import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("node:fs", () => ({
  readdirSync: vi.fn(() => [] as string[]),
}));

beforeEach(() => {
  vi.resetModules();
});

describe("listPosts", () => {
  it("returns an empty list when the content directory is missing or empty", async () => {
    const { listPosts } = await import("./posts");
    const posts = await listPosts("blog");
    expect(posts).toEqual([]);
  });
});

describe("PostMeta type", () => {
  it("module exports the public API", async () => {
    const mod = await import("./posts");
    expect(typeof mod.listPosts).toBe("function");
    expect(typeof mod.getPost).toBe("function");
  });
});
