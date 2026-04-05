import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPreprintDetails, getPublicationDetails } from "../src/biorxiv.js";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("getPreprintDetails", () => {
  it("returns preprint details on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        collection: [
          {
            doi: "10.1101/2020.01.01.000001",
            title: "Test Paper",
            version: "2",
            date: "2020-01-15",
            category: "bioinformatics",
            abstract: "An abstract",
            server: "biorxiv",
          },
        ],
      }),
    });

    const result = await getPreprintDetails("10.1101/2020.01.01.000001");
    expect(result).toEqual({
      doi: "10.1101/2020.01.01.000001",
      title: "Test Paper",
      version: "2",
      date: "2020-01-15",
      category: "bioinformatics",
      abstract: "An abstract",
      server: "biorxiv",
    });
  });

  it("returns the latest version from collection", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        collection: [
          { doi: "10.1101/123", version: "1", title: "v1", date: "", category: "", abstract: "", server: "biorxiv" },
          { doi: "10.1101/123", version: "3", title: "v3", date: "", category: "", abstract: "", server: "biorxiv" },
        ],
      }),
    });

    const result = await getPreprintDetails("10.1101/123");
    expect(result?.version).toBe("3");
    expect(result?.title).toBe("v3");
  });

  it("returns null for empty collection", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ collection: [] }),
    });

    expect(await getPreprintDetails("10.1101/fake")).toBeNull();
  });

  it("returns null on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    expect(await getPreprintDetails("10.1101/fake")).toBeNull();
  });

  it("returns null on non-OK response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    expect(await getPreprintDetails("10.1101/fake")).toBeNull();
  });
});

describe("getPublicationDetails", () => {
  it("returns publication details when published", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        collection: [
          {
            published_doi: "10.7554/eLife.12345",
            published_journal: "eLife",
            published_date: "2021-06-01",
          },
        ],
      }),
    });

    const result = await getPublicationDetails("10.1101/2020.01.01.000001");
    expect(result).toEqual({
      preprintDoi: "10.1101/2020.01.01.000001",
      publishedDoi: "10.7554/eLife.12345",
      publishedJournal: "eLife",
      publishedDate: "2021-06-01",
    });
  });

  it("returns null when no published DOI", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        collection: [{ published_doi: "", published_journal: "" }],
      }),
    });

    expect(
      await getPublicationDetails("10.1101/2020.01.01.000001"),
    ).toBeNull();
  });

  it("returns null on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("timeout"));
    expect(await getPublicationDetails("10.1101/fake")).toBeNull();
  });
});
