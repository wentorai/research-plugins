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
