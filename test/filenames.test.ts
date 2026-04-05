import { describe, it, expect } from "vitest";
import { normalizeDoi, doiToSlug, slugToDoi } from "../src/filenames.js";

describe("normalizeDoi", () => {
  it("passes through a bare DOI", () => {
    expect(normalizeDoi("10.1101/2026.01.01.123456")).toBe(
      "10.1101/2026.01.01.123456",
    );
  });

  it("strips https://doi.org/ prefix", () => {
    expect(normalizeDoi("https://doi.org/10.1101/2026.01.01.123456")).toBe(
      "10.1101/2026.01.01.123456",
    );
  });

  it("strips http://doi.org/ prefix", () => {
    expect(normalizeDoi("http://doi.org/10.1101/2026.01.01.123456")).toBe(
      "10.1101/2026.01.01.123456",
    );
  });

  it("trims whitespace", () => {
    expect(normalizeDoi("  10.1101/2026.01.01.123456  ")).toBe(
      "10.1101/2026.01.01.123456",
    );
  });

  it("handles combined whitespace and prefix", () => {
    expect(
      normalizeDoi("  https://doi.org/10.1101/2026.01.01.123456  "),
    ).toBe("10.1101/2026.01.01.123456");
  });
});

describe("doiToSlug", () => {
  it("replaces / with __", () => {
    expect(doiToSlug("10.1101/2026.01.01.123456")).toBe(
      "10.1101__2026.01.01.123456",
    );
  });

  it("handles DOIs with multiple slashes", () => {
    expect(doiToSlug("10.1101/2026.01.01/sub.123")).toBe(
      "10.1101__2026.01.01__sub.123",
    );
  });

  it("normalizes before slugifying", () => {
    expect(doiToSlug("https://doi.org/10.1101/2026.01.01.123456")).toBe(
      "10.1101__2026.01.01.123456",
    );
  });
});

describe("slugToDoi", () => {
  it("reverses doiToSlug", () => {
    expect(slugToDoi("10.1101__2026.01.01.123456")).toBe(
      "10.1101/2026.01.01.123456",
    );
  });

  it("round-trips correctly", () => {
    const doi = "10.1101/2026.01.01.123456";
    expect(slugToDoi(doiToSlug(doi))).toBe(doi);
  });
});
