/**
 * Build the Content-Security-Policy header for the Control UI.
 *
 * By default, framing is blocked (`frame-ancestors 'none'`).
 * To allow embedding in an iframe (e.g. from a management platform),
 * set the `OPENCLAW_FRAME_ANCESTORS` environment variable to a
 * space-separated list of allowed origins:
 *
 *   OPENCLAW_FRAME_ANCESTORS="https://example.com https://*.example.com"
 *
 * @param frameAncestors - Optional override for frame-ancestors directive.
 *   Falls back to OPENCLAW_FRAME_ANCESTORS env var, then "'none'".
 */
export function buildControlUiCspHeader(frameAncestors?: string[]): string {
  let ancestors: string;
  if (frameAncestors?.length) {
    ancestors = frameAncestors.join(" ");
  } else {
    const envVal = process.env.OPENCLAW_FRAME_ANCESTORS;
    ancestors = envVal?.trim() || "'none'";
  }

  // Control UI: block inline scripts, keep styles permissive
  // (UI uses a lot of inline style attributes in templates).
  return [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    `frame-ancestors ${ancestors}`,
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' ws: wss:",
  ].join("; ");
}
