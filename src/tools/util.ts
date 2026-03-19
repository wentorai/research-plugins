/**
 * Wrap raw data into the OpenClaw AgentTool return format.
 *
 * Expected shape: { content: [{ type: "text", text: string }], details: unknown }
 *   - content  → displayed to the user / consumed by the model as text
 *   - details  → structured data for programmatic access by downstream tools
 */
export function toolResult(data: unknown) {
  const text = JSON.stringify(data, null, 2);
  return { content: [{ type: "text" as const, text }], details: data };
}

// ── Source Health Tracking ───────────────────────────────────────────────

interface SourceHealthEntry {
  source: string;
  total_calls: number;
  successes: number;
  failures: number;
  last_status: number | null;
  last_latency_ms: number | null;
  last_error: string | null;
  avg_latency_ms: number;
  last_called: string | null;
}

const healthRegistry = new Map<string, SourceHealthEntry>();

function getOrCreateEntry(source: string): SourceHealthEntry {
  let entry = healthRegistry.get(source);
  if (!entry) {
    entry = {
      source,
      total_calls: 0,
      successes: 0,
      failures: 0,
      last_status: null,
      last_latency_ms: null,
      last_error: null,
      avg_latency_ms: 0,
      last_called: null,
    };
    healthRegistry.set(source, entry);
  }
  return entry;
}

function recordSuccess(entry: SourceHealthEntry, status: number, latencyMs: number) {
  entry.total_calls++;
  entry.successes++;
  entry.last_status = status;
  entry.last_latency_ms = latencyMs;
  entry.last_error = null;
  entry.last_called = new Date().toISOString();
  entry.avg_latency_ms = Math.round(
    (entry.avg_latency_ms * (entry.total_calls - 1) + latencyMs) / entry.total_calls,
  );
}

function recordFailure(entry: SourceHealthEntry, error: string, status?: number) {
  entry.total_calls++;
  entry.failures++;
  entry.last_status = status ?? null;
  entry.last_error = error;
  entry.last_called = new Date().toISOString();
}

export interface TrackedResponse {
  res: Response;
  latency_ms: number;
  source: string;
}

/**
 * Fetch with automatic source health tracking, timeout, and error handling.
 *
 * @param source - Source identifier (e.g. "europe_pmc", "dblp")
 * @param url - Request URL
 * @param options - Fetch options
 * @param timeoutMs - Timeout in milliseconds (default: 10000)
 * @returns TrackedResponse on success, or a toolResult error on failure
 */
export async function trackedFetch(
  source: string,
  url: string,
  options?: RequestInit,
  timeoutMs = 10_000,
): Promise<TrackedResponse | ReturnType<typeof toolResult>> {
  const entry = getOrCreateEntry(source);
  const start = Date.now();

  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
    const latency = Date.now() - start;

    if (!res.ok) {
      recordFailure(entry, `HTTP ${res.status} ${res.statusText}`, res.status);
      return toolResult({
        error: `${source} API error: ${res.status} ${res.statusText}`,
        _source_health: {
          source,
          status: res.status,
          latency_ms: latency,
          success_rate: entry.total_calls > 0
            ? `${Math.round((entry.successes / entry.total_calls) * 100)}%`
            : "N/A",
        },
      });
    }

    recordSuccess(entry, res.status, latency);
    return { res, latency_ms: latency, source };
  } catch (err) {
    const latency = Date.now() - start;
    const message = err instanceof Error ? err.message : String(err);
    const isTimeout = message.includes("abort") || message.includes("timeout");
    recordFailure(entry, isTimeout ? `Timeout after ${timeoutMs}ms` : message);

    return toolResult({
      error: `${source} ${isTimeout ? "timeout" : "network error"}: ${message}`,
      _source_health: {
        source,
        latency_ms: latency,
        success_rate: entry.total_calls > 0
          ? `${Math.round((entry.successes / entry.total_calls) * 100)}%`
          : "N/A",
        suggestion: isTimeout
          ? "This source is slow. Try a different source or reduce result count."
          : "This source may be temporarily unavailable. Try an alternative.",
      },
    });
  }
}

/**
 * Get health status for all tracked sources. Useful for agent decision-making.
 */
export function getSourceHealth(): SourceHealthEntry[] {
  return Array.from(healthRegistry.values());
}

/**
 * Check if a tracked fetch result is an error (toolResult) or success (TrackedResponse).
 */
export function isTrackedError(
  result: TrackedResponse | ReturnType<typeof toolResult>,
): result is ReturnType<typeof toolResult> {
  return "content" in result && "details" in result;
}

// ── LLM Input Sanitization ──────────────────────────────────────────────

const INVALID_PARAM_VALUES = new Set(["undefined", "null", "none", "None", ""]);

/**
 * Sanitize an optional string parameter from LLM tool calls.
 *
 * LLMs (especially weaker models) sometimes pass the literal string "undefined"
 * or "null" instead of omitting the parameter. The nullish coalescing operator
 * (`??`) does NOT catch these because they are truthy strings.
 *
 * Returns the value if valid, or `undefined` if it's a known non-value.
 */
export function validParam(value: string | undefined | null): string | undefined {
  if (value == null) return undefined;
  if (INVALID_PARAM_VALUES.has(value.trim())) return undefined;
  return value;
}

/**
 * Validate a string parameter against a whitelist of allowed values.
 * Returns the value if it matches, or the fallback otherwise.
 */
export function validEnum<T extends string>(
  value: string | undefined | null,
  allowed: readonly T[],
  fallback: T,
): T {
  const clean = validParam(value);
  if (clean && (allowed as readonly string[]).includes(clean)) return clean as T;
  return fallback;
}
