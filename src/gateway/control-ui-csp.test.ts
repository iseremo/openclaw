import { afterEach, describe, expect, it } from "vitest";
import { buildControlUiCspHeader } from "./control-ui-csp.js";

describe("buildControlUiCspHeader", () => {
  afterEach(() => {
    delete process.env.OPENCLAW_FRAME_ANCESTORS;
  });

  it("blocks inline scripts while allowing inline styles", () => {
    const csp = buildControlUiCspHeader();
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).toContain("style-src 'self' 'unsafe-inline'");
  });

  it("defaults to frame-ancestors 'none' when no override", () => {
    const csp = buildControlUiCspHeader();
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("accepts frame-ancestors via parameter", () => {
    const csp = buildControlUiCspHeader(["https://example.com", "https://*.example.com"]);
    expect(csp).toContain("frame-ancestors https://example.com https://*.example.com");
    expect(csp).not.toContain("frame-ancestors 'none'");
  });

  it("reads OPENCLAW_FRAME_ANCESTORS env var as fallback", () => {
    process.env.OPENCLAW_FRAME_ANCESTORS = "'self' https://myapp.com";
    const csp = buildControlUiCspHeader();
    expect(csp).toContain("frame-ancestors 'self' https://myapp.com");
    expect(csp).not.toContain("frame-ancestors 'none'");
  });

  it("parameter takes precedence over env var", () => {
    process.env.OPENCLAW_FRAME_ANCESTORS = "https://env.example.com";
    const csp = buildControlUiCspHeader(["https://param.example.com"]);
    expect(csp).toContain("frame-ancestors https://param.example.com");
    expect(csp).not.toContain("frame-ancestors https://env.example.com");
  });
});
