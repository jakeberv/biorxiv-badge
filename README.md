# biorxiv-badge

Generate reusable GitHub README badges for bioRxiv preprints.

### Example

**[Neural posterior estimation for population genetics](https://doi.org/10.64898/2025.12.01.691638)** (Min, Ning, Pope, Baumdicker & Kern 2025):

[![bioRxiv](https://img.shields.io/endpoint?url=https%3A%2F%2Fandrewkern.github.io%2Fbiorxiv-badge%2Fbadges%2F10.64898__2025.12.01.691638.json)](https://doi.org/10.64898/2025.12.01.691638)

The badge updates automatically — when this preprint is published in a journal, it will switch from red ("preprint") to green ("published").

## Why

There's no built-in [Shields.io](https://shields.io) badge for bioRxiv preprints. This project fills the gap using Shields **endpoint badges** — a JSON file hosted on GitHub Pages that Shields renders as a badge. The badge includes the bioRxiv logo and automatically reflects whether a preprint has been published:

| State     | Badge                                                                                    |
| --------- | ---------------------------------------------------------------------------------------- |
| Preprint  | ![preprint](https://img.shields.io/badge/bioRxiv-preprint%20v2-B31B1B)                  |
| Published | ![published](https://img.shields.io/badge/bioRxiv-published-2E8B57)                     |
| Not found | ![not found](https://img.shields.io/badge/bioRxiv-not%20found-red)                      |

## Quick start

1. **Fork** this repo on GitHub.
2. **Enable GitHub Pages** on your fork: go to **Settings > Pages**, set source to **Deploy from a branch**, branch `main`, folder `/docs`.
3. Clone your fork and generate badges:

```bash
git clone https://github.com/<you>/biorxiv-badge.git
cd biorxiv-badge
npm install

# Generate a badge for a DOI
npm run generate -- --doi 10.64898/2025.12.01.691638
```

4. Commit and push the generated JSON, and your badge is live.

The CLI auto-detects your GitHub Pages URL from the git remote. You can also set it explicitly:

```bash
npm run generate -- --base-url https://<you>.github.io/biorxiv-badge --doi 10.64898/2025.12.01.691638
```

This creates a JSON file in `docs/badges/` and prints a Markdown snippet you can paste into any README:

```markdown
[![bioRxiv](https://img.shields.io/endpoint?url=https%3A%2F%2F<you>.github.io%2Fbiorxiv-badge%2Fbadges%2F10.64898__2025.12.01.691638.json)](https://doi.org/10.64898/2025.12.01.691638)
```

## Usage

### Single DOI

```bash
npm run generate -- --doi 10.64898/2025.12.01.691638
```

### Full URL (auto-normalized)

```bash
npm run generate -- --doi https://doi.org/10.64898/2025.12.01.691638
```

### Batch file

Create a text file with one DOI per line:

```text
# dois.txt
10.64898/2025.12.01.691638
10.1101/2024.03.15.585102
```

```bash
npm run generate -- --file dois.txt
```

## How it works

1. The CLI queries the [bioRxiv API](https://api.biorxiv.org) for preprint metadata and publication status.
2. It generates a JSON file conforming to the [Shields endpoint badge schema](https://shields.io/badges/endpoint-badge):
   ```json
   {
     "schemaVersion": 1,
     "label": "bioRxiv",
     "message": "preprint",
     "color": "B31B1B"
   }
   ```
3. The JSON is saved to `docs/badges/` which is served via GitHub Pages.
4. Shields.io fetches the JSON and renders the badge dynamically.

## Automation

A GitHub Actions workflow (`.github/workflows/build-pages.yml`) runs:
- On every push to `main`
- Nightly at 06:00 UTC

It regenerates badges for the sample DOIs in `scripts/generate-samples.ts`, keeping publication status up to date automatically.

## Fallback: static badge

If you don't need dynamic status updates, use a plain Shields badge:

```markdown
[![bioRxiv](https://img.shields.io/badge/bioRxiv-preprint-B31B1B)](https://doi.org/10.64898/2025.12.01.691638)
```

## Development

```bash
npm install
npm test          # Run tests
npm run build     # Compile TypeScript
```

## Badge states

| Condition               | `message`              | `color`   |
| ----------------------- | ---------------------- | --------- |
| Valid preprint, v1      | `preprint`             | `B31B1B`  |
| Valid preprint, v3      | `preprint v3`          | `B31B1B`  |
| Published (no journal)  | `published`            | `2E8B57`  |
| Published (with journal)| `published in eLife`   | `2E8B57`  |
| Invalid / not found     | `not found`            | `red`     |

## Limitations

- Badge data is only as fresh as the last CI run (or manual `generate` invocation). Shields caches endpoint responses for ~5 minutes.
- The bioRxiv API can be slow or intermittently unavailable.
- Long journal names are truncated to keep badges readable.

## License

MIT
