import { describe, expect, it } from "vitest";
import { site } from "./site";

describe("site config", () => {
  it("has the required fields", () => {
    expect(site.name).toBeTruthy();
    expect(site.domain).toMatch(/\./);
    expect(site.contactEmail).toMatch(/@/);
  });

  it("derives an api domain", () => {
    expect(site.apiDomain).toContain(".");
  });
});
