# biorxiv-badge

Generate GitHub README badges for bioRxiv preprints. The badge automatically updates when a preprint is published in a journal.

| State     | Badge                                                                    |
| --------- | ------------------------------------------------------------------------ |
| Preprint  | ![preprint](https://img.shields.io/badge/bioRxiv-preprint%20v2-B31B1B)  |
| Published | ![published](https://img.shields.io/badge/bioRxiv-published-2E8B57)     |
| Not found | ![not found](https://img.shields.io/badge/bioRxiv-not%20found-red)      |

### Example

[![bioRxiv](https://img.shields.io/endpoint?url=https%3A%2F%2Fandrewkern.github.io%2Fbiorxiv-badge%2Fbadges%2F10.64898__2025.12.01.691638.json)](https://doi.org/10.64898/2025.12.01.691638)

## Quick start

1. **Fork** this repo on GitHub.
2. **Enable GitHub Pages** on your fork: **Settings > Pages**, set source to **GitHub Actions**.
3. **Edit `dois.txt`** — add your DOIs, one per line.
4. **Push** — CI generates the badge JSON and deploys to Pages automatically.

### Add the badge to your README

Once deployed, paste this into your README, replacing the DOI and username:

```markdown
[![bioRxiv](https://img.shields.io/endpoint?url=https%3A%2F%2F<you>.github.io%2Fbiorxiv-badge%2Fbadges%2F<slug>.json)](https://doi.org/<doi>)
```

The `<slug>` is the DOI with `/` replaced by `__`:

| DOI                            | Slug                              |
| ------------------------------ | --------------------------------- |
| `10.1101/2023.07.30.551115`    | `10.1101__2023.07.30.551115`      |
| `10.64898/2025.12.01.691638`   | `10.64898__2025.12.01.691638`     |

### Local generation

You can also generate badges and get a ready-to-paste snippet locally:

```bash
git clone https://github.com/<you>/biorxiv-badge.git
cd biorxiv-badge
npm install
npm run generate -- --doi 10.1101/2023.07.30.551115
```

The CLI accepts full URLs too (`https://doi.org/...`) and supports batch files with `--file dois.txt`.

## How it works

The badge is powered by [Shields endpoint badges](https://shields.io/badges/endpoint-badge). A GitHub Actions workflow queries the [bioRxiv API](https://api.biorxiv.org) for each DOI in `dois.txt`, generates a small JSON file, and deploys it to GitHub Pages. Shields.io fetches the JSON and renders the badge. The workflow runs on push and nightly to keep publication status fresh.

## Fallback: static badge

If you don't need dynamic status updates, use a plain Shields badge:

```markdown
[![bioRxiv](https://img.shields.io/badge/bioRxiv-preprint-B31B1B)](https://doi.org/10.1101/2023.07.30.551115)
```

## Development

```bash
npm install
npm test
npm run build
```

## Limitations

- Badge data is only as fresh as the last CI run. Shields caches endpoint responses for ~5 minutes.
- The bioRxiv API can be slow or intermittently unavailable.
- Long journal names are truncated to keep badges readable.

## License

MIT
