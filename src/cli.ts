#!/usr/bin/env node
/**
 * CLI entry point for generating bioRxiv badges.
 *
 * Usage:
 *   npm run generate -- --doi 10.1101/2026.01.01.123456
 *   npm run generate -- --file dois.txt
 */

import { readFile } from "node:fs/promises";
import { generateBadge } from "./generate.js";

async function main() {
  const args = process.argv.slice(2);
  const dois: string[] = [];
  let baseUrl: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--doi" && args[i + 1]) {
      dois.push(args[++i]);
    } else if (args[i] === "--file" && args[i + 1]) {
      const content = await readFile(args[++i], "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          dois.push(trimmed);
        }
      }
    } else if (args[i] === "--base-url" && args[i + 1]) {
      baseUrl = args[++i];
    } else if (!args[i].startsWith("--")) {
      dois.push(args[i]);
    }
  }

  if (dois.length === 0) {
    console.error("Usage: npm run generate -- --doi <DOI> [--doi <DOI> ...]");
    console.error("       npm run generate -- --file dois.txt");
    console.error("       npm run generate -- --base-url https://<user>.github.io/biorxiv-badge --doi <DOI>");
    process.exit(1);
  }

  for (const doi of dois) {
    console.log(`\nProcessing: ${doi}`);
    try {
      const result = await generateBadge(doi, undefined, baseUrl);
      console.log(`  Badge:    ${result.badge.message} (${result.badge.color})`);
      console.log(`  File:     ${result.filePath}`);
      console.log(`  Markdown: ${result.markdown}`);
    } catch (err) {
      console.error(`  Error: ${err instanceof Error ? err.message : err}`);
    }
  }
}

main();
