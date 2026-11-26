# thedevelobear.com

[![CI](https://github.com/thedevelobear/thedevelobear.com/actions/workflows/ci.yml/badge.svg)](https://github.com/thedevelobear/thedevelobear.com/actions/workflows/ci.yml)

Blog and portfolio built with Next.js (App Router, prerendered), deployed on Vercel.

## Development

Needs Node 26 and pnpm.

```bash
pnpm install
pnpm dev
```

| Command            | What it does                                         |
| ------------------ | ---------------------------------------------------- |
| `pnpm build`       | Production build                                     |
| `pnpm start`       | Serve the build                                      |
| `pnpm lint`        | Biome lint and format check                          |
| `pnpm typecheck`   | Route types and `tsc`                                |
| `pnpm test:unit`   | Posts, stats, feeds, meta                            |
| `pnpm test:e2e`    | Playwright and axe, desktop and mobile (build first) |
| `pnpm lighthouse`  | Lighthouse CI budgets (build first)                  |
| `pnpm check:todos` | Fails while a `[TODO:` is rendered (build first)     |
| `pnpm measure`     | Before/after numbers: `<site URL> <output.json>`     |

## Quality gates

Install the test browsers once:

```bash
pnpm exec playwright install chromium webkit
```

The tests and Lighthouse start the built site on port 3100; set `PORT` to change it.

To check a deployed site instead (the old service worker test is skipped, as it needs to control the server):

```bash
BASE_URL=https://www.thedevelobear.com pnpm test:e2e
```

CI (`.github/workflows/ci.yml`) runs all of this. The `[TODO:` check is a separate job that fails until `/about/` is filled in. Budgets are in `lighthouserc.cjs`. The 2.0 s LCP target is not met on pages whose largest element is an image, so there it only warns, with a hard ceiling of 3.0 s. Details and measurements are in `docs/case-study.md`.

## Writing a post

Add a Markdown file to `content/post/`. Front matter: `slug`, `title`, `description`, `date`, `tags` (`code`, `design`), `image` and `color` are required; `draft` is optional.

- `image` is the cover art, shown as a print on the post's tile and page.
- `color` is the post's flat background colour, as `"#rrggbb"` (keep the quotes: `#` starts a YAML comment). Black text sits on it, so keep it light; `pnpm test:unit` fails below WCAG AA contrast.

No component changes are needed. The bear is defined in `lib/mascot.ts`; to replace it, see `docs/art-brief.md`.

Put images in `public/img/` and reference them as `![alt text](/img/...)`. For a video, reference the `.mp4` and add a `.jpg` poster with the same name next to it.
