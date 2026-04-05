/**
 * Core generation logic: fetch metadata, build badge JSON, write file.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { normalizeDoi, doiToSlug } from "./filenames.js";
import { makePreprintBadge, makePublishedBadge, makeErrorBadge, type BadgeJson } from "./badge.js";
import { getPreprintDetails, getPublicationDetails } from "./biorxiv.js";

/** Attempt to infer the GitHub Pages base URL from the git remote. */
async function detectPagesBase(): Promise<string | null> {
  try {
    const { execSync } = await import("node:child_process");
    const remote = execSync("git remote get-url origin", { encoding: "utf-8" }).trim();
    // Match github.com/<owner>/<repo> from HTTPS or SSH URLs
    const match = remote.match(/github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
    if (match) {
      return `https://${match[1]}.github.io/${match[2]}`;
    }
  } catch {
    // Not a git repo or no remote — fall through
  }
  return null;
}

export interface GenerateResult {
  doi: string;
  slug: string;
  badge: BadgeJson;
  filePath: string;
  markdown: string;
}

export function buildMarkdownSnippet(
  slug: string,
  doi: string,
  pagesBase: string,
): string {
  const endpointUrl = `${pagesBase}/badges/${slug}.json`;
  const badgeUrl = `https://img.shields.io/endpoint?url=${encodeURIComponent(endpointUrl)}`;
  return `[![bioRxiv](${badgeUrl})](https://doi.org/${doi})`;
}

export async function generateBadge(
  rawDoi: string,
  outDir = "docs/badges",
  pagesBase?: string,
): Promise<GenerateResult> {
  if (!pagesBase) {
    pagesBase = (await detectPagesBase()) ?? undefined;
  }
  const doi = normalizeDoi(rawDoi);
  const slug = doiToSlug(doi);
  const filePath = join(outDir, `${slug}.json`);

  // Fetch metadata
  const preprint = await getPreprintDetails(doi);

  let badge: BadgeJson;

  if (!preprint) {
    badge = makeErrorBadge("not found");
  } else {
    const publication = await getPublicationDetails(doi);
    if (publication) {
      badge = makePublishedBadge({
        doi,
        publishedDoi: publication.publishedDoi,
        publishedJournal: publication.publishedJournal,
      });
    } else {
      badge = makePreprintBadge({
        doi,
        version: preprint.version,
      });
    }
  }

  // Write the JSON file
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(badge, null, 2) + "\n");

  const markdown = pagesBase
    ? buildMarkdownSnippet(slug, doi, pagesBase)
    : `[![bioRxiv](https://img.shields.io/endpoint?url=https%3A%2F%2F<user>.github.io%2Fbiorxiv-badge%2Fbadges%2F${slug}.json)](https://doi.org/${doi})`;

  return { doi, slug, badge, filePath, markdown };
}
