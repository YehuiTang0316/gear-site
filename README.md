# GEAR website

The bilingual GEAR product website, published on GitHub Pages.

- English: https://yehuitang0316.github.io/gear-site/
- 简体中文: https://yehuitang0316.github.io/gear-site/zh/
- Product repository: https://github.com/rsi-gear/gear

## Develop

No third-party packages are required. Use Node.js 18+ to generate the site and Python 3 for the local preview.

```sh
npm run build
npm run check
npm run preview
```

Open http://127.0.0.1:4173/. Rebuild and reload after source edits.

- `src/content.mjs`: English and Chinese copy, sourced from the project README and the latest product film.
- `scripts/build.mjs`: shared accessible HTML template, sitemap and metadata.
- `src/style.css`: responsive styles and reduced-motion support.
- `src/app.js`: keyboard-accessible tabs, video replays and setup-prompt copying.
- `src/stars.js`: live star counts from the public `rsi-gear/gear` GitHub API, shared across all three Star links. Uses a five-minute browser cache and refreshes when a visitor returns from a Star link.
- `src/github-stats.json`: verified fallback count and an internal timestamp for cache freshness. Failed requests keep the last verified count; timestamps are not displayed in the page. No GitHub credentials are needed in the website.
- `static/assets/`: original logo, videos, poster and hand-timed English/Chinese captions.
- `docs/`: generated, committed publication directory.

## Publish

GitHub Pages publishes `main` → `/docs`. After editing, run `npm run build` and `npm run check`, commit both source and generated output, then push `main`. GitHub builds and publishes the committed static output. No custom Actions workflow, build service, API keys or npm installation is required.

The main product repository and the existing personal homepage are independent of this website.

To refresh the fallback Star snapshot before publishing:

```sh
gh api repos/rsi-gear/gear --jq '{repo:.full_name,count:.stargazers_count,checkedAt:(now|todateiso8601)}' > src/github-stats.json
npm run build
```

The two task comparisons appear directly after the hero, before aggregate metrics, the introduction film and the technical explanation. Their replay videos use the original assets and play inline, muted and looping by default when they enter view. The two videos sit side by side on desktop and compact previews, with a single column on narrow phones. Each card contains a case title and video; native playback and fullscreen controls remain available.

## Content provenance

Content snapshot: 2026-10-11.

- Product copy, reported metrics, caveats and setup prompt: `rsi-gear/gear` README and README.zh-CN.md.
- Main introduction: `media/pro-c-intro/out/voiceover-v2/gear-pro-c-intro-18s-voiceover.mp4`, latest 2026-10-11 production (18 seconds of picture, 18.048-second container including audio padding).
- Logo: original supplied mark used in the product film.
- GitHub and Star icons: GitHub's official [Octicons mark-github-16](https://github.com/primer/octicons/blob/main/icons/mark-github-16.svg) and [star-16](https://github.com/primer/octicons/blob/main/icons/star-16.svg), distributed under the included MIT license (`static/assets/octicons-LICENSE.txt`).
- Case replays: `docs/guide/assets/landing-page-alerts-replay.mp4` and `featured-snippet-replay.mp4` from the product repository.
- The interactive report workflow is an explicitly labeled conceptual illustration, not a live optimization run.

Benchmark comparisons include all relevant reasoning-effort and harness conditions. The cost comparison uses the same optimized DSH harness (`a0740800`). Model training and automatic seed-task generation are not presented as completed capabilities.
