/**
 * bioRxiv API client for fetching preprint and publication metadata.
 */

const BASE = "https://api.biorxiv.org";

export interface PreprintDetails {
  doi: string;
  title: string;
  version: string;
  date: string;
  category: string;
  abstract: string;
  server: string;
}

export interface PublicationDetails {
  preprintDoi: string;
  publishedDoi: string;
  publishedJournal: string;
  publishedDate: string;
}

async function fetchCollection(
  endpoint: string,
  doi: string,
): Promise<Record<string, string>[] | null> {
  const url = `${BASE}/${endpoint}/biorxiv/${doi}/na/json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const collection = data.collection as Record<string, string>[] | undefined;
    return collection?.length ? collection : null;
  } catch {
    return null;
  }
}

export async function getPreprintDetails(
  doi: string,
): Promise<PreprintDetails | null> {
  const collection = await fetchCollection("details", doi);
  if (!collection) return null;

  // Use the latest version (last entry in the collection).
  const latest = collection[collection.length - 1];

  return {
    doi: latest.doi ?? doi,
    title: latest.title ?? "",
    version: latest.version ?? "1",
    date: latest.date ?? "",
    category: latest.category ?? "",
    abstract: latest.abstract ?? "",
    server: latest.server ?? "biorxiv",
  };
}

export async function getPublicationDetails(
  doi: string,
): Promise<PublicationDetails | null> {
  const collection = await fetchCollection("pubs", doi);
  if (!collection) return null;

  const entry = collection[0];
  const publishedDoi = entry.published_doi ?? entry.pub_doi ?? "";

  if (!publishedDoi) return null;

  return {
    preprintDoi: doi,
    publishedDoi,
    publishedJournal: entry.published_journal ?? entry.pub_journal ?? "",
    publishedDate: entry.published_date ?? entry.pub_date ?? "",
  };
}
