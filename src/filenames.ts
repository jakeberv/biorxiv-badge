/**
 * DOI normalization and filesystem-safe slug mapping.
 */

/** Strip leading https://doi.org/ or http://doi.org/ and trim whitespace. */
export function normalizeDoi(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/doi\.org\//, "");
}

/** Convert a DOI to a filesystem-safe slug by replacing "/" with "__". */
export function doiToSlug(doi: string): string {
  return normalizeDoi(doi).replace(/\//g, "__");
}

/** Reverse a slug back to a DOI by replacing "__" with "/". */
export function slugToDoi(slug: string): string {
  return slug.replace(/__/g, "/");
}
