/**
 * Generate badge JSON for a set of sample DOIs.
 * Used by CI and for local development.
 */

import { generateBadge } from "../src/generate.js";

// Sample bioRxiv DOIs for demonstration.
// Replace or extend these with real DOIs you want to track.
const SAMPLE_DOIS = [
  "10.64898/2025.12.01.691638", // Neural posterior estimation for population genetics
];

async function main() {
  console.log("Generating sample badges...\n");

  for (const doi of SAMPLE_DOIS) {
    console.log(`Processing: ${doi}`);
    try {
      const result = await generateBadge(doi);
      console.log(`  Status:   ${result.badge.message}`);
      console.log(`  File:     ${result.filePath}`);
      console.log(`  Markdown: ${result.markdown}\n`);
    } catch (err) {
      console.error(`  Error: ${err instanceof Error ? err.message : err}\n`);
    }
  }

  console.log("Done.");
}

main();
