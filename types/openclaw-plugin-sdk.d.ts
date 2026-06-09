// Build-time ambient for the optional host peer `openclaw/plugin-sdk`, which is
// not installed during the plugin's own `tsc` build. Loose shapes let tsc emit
// clean JS; the real SDK types apply at runtime inside OpenClaw.

// Minimal Node `process` typing so the build needs no @types/node dependency.
// The real `process` is provided by the Node 22 runtime inside OpenClaw.
declare const process: { env: Record<string, string | undefined> };

declare module "openclaw/plugin-sdk" {
  export type OpenClawPluginToolContext = unknown;
  export interface OpenClawPluginApi {
    registerTool(
      factory: (ctx: OpenClawPluginToolContext) => unknown,
      options: { names: string[] },
    ): void;
  }
}
