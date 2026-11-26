# Case study: thedevelobear.com, from Hugo to Next.js

A blog with 10 posts and a two-project portfolio. The old site was Hugo on Netlify. The new one is Next.js 16 (App Router, every page prerendered) for Vercel.

## Results

> The local numbers below were measured on 2026-11-25, **before the current mascot art and the full-height hero**. Re-run `pnpm measure` before quoting them.

> **Read this before comparing columns.** "Old" was measured on the **live production site** (real hosting and network). "New, local" was measured on `next start` **on localhost**: no CDN, no real latency, gzip rather than the CDN's compression, and no analytics scripts (they render only on Vercel). The two are **not directly comparable**. The "after cutover" column is the like-for-like one, and it is empty until the new site is live.

Lighthouse 13.6.0, simulated throttling, median of 3 runs by performance score. Measured 2026-11-25. Weight is what Lighthouse saw during page load, in KiB. It never scrolls or presses play, so lazy images and unplayed videos are not counted. Raw data: [old](baseline/lighthouse/summary.json), [new, local](measurements/local.json).

### Home (`/`), mobile

| Metric | Old: production | New: local only | New: after cutover (production) |
| --- | ---: | ---: | ---: |
| Performance | 74 | 96 | _not measured yet_ |
| Accessibility | 89 | 100 | _not measured yet_ |
| Best practices | 100 | 100 | _not measured yet_ |
| SEO | 100 | 100 | _not measured yet_ |
| LCP | 7.61 s | 2.80 s | _not measured yet_ |
| CLS | 0 | 0 | _not measured yet_ |
| TBT | 24 ms | 20 ms | _not measured yet_ |
| Weight | 1,909 KiB | 299 KiB | _not measured yet_ |
| Requests | 34 | 25 | _not measured yet_ |

### Home (`/`), desktop

| Metric | Old: production | New: local only | New: after cutover (production) |
| --- | ---: | ---: | ---: |
| Performance | 90 | 100 | _not measured yet_ |
| Accessibility | 89 | 100 | _not measured yet_ |
| Best practices | 100 | 100 | _not measured yet_ |
| SEO | 100 | 100 | _not measured yet_ |
| LCP | 1.97 s | 0.24 s | _not measured yet_ |
| CLS | 0 | 0 | _not measured yet_ |
| TBT | 0 ms | 0 ms | _not measured yet_ |
| Weight | 1,909 KiB | 335 KiB | _not measured yet_ |
| Requests | 34 | 33 | _not measured yet_ |

### Text post (`/post/logpoints/`), mobile

| Metric | Old: production | New: local only | New: after cutover (production) |
| --- | ---: | ---: | ---: |
| Performance | 74 | 96 | _not measured yet_ |
| Accessibility | 84 | 100 | _not measured yet_ |
| Best practices | 73 | 100 | _not measured yet_ |
| SEO | 85 | 100 | _not measured yet_ |
| LCP | 9.60 s | 2.72 s | _not measured yet_ |
| CLS | 0 | 0 | _not measured yet_ |
| TBT | 24 ms | 21 ms | _not measured yet_ |
| Weight | 4,036 KiB | 343 KiB | _not measured yet_ |
| Requests | 84 | 37 | _not measured yet_ |

### Text post (`/post/logpoints/`), desktop

| Metric | Old: production | New: local only | New: after cutover (production) |
| --- | ---: | ---: | ---: |
| Performance | 88 | 100 | _not measured yet_ |
| Accessibility | 84 | 100 | _not measured yet_ |
| Best practices | 73 | 100 | _not measured yet_ |
| SEO | 85 | 100 | _not measured yet_ |
| LCP | 2.07 s | 0.59 s | _not measured yet_ |
| CLS | 0 | 0 | _not measured yet_ |
| TBT | 0 ms | 0 ms | _not measured yet_ |
| Weight | 4,008 KiB | 343 KiB | _not measured yet_ |
| Requests | 86 | 36 | _not measured yet_ |

### GIF-heavy post (`/post/microinteractions/`), mobile

| Metric | Old: production | New: local only | New: after cutover (production) |
| --- | ---: | ---: | ---: |
| Performance | 84 | 100 | _not measured yet_ |
| Accessibility | 83 | 100 | _not measured yet_ |
| Best practices | 73 | 100 | _not measured yet_ |
| SEO | 92 | 100 | _not measured yet_ |
| LCP | 4.15 s | 0.90 s | _not measured yet_ |
| CLS | 0 | 0 | _not measured yet_ |
| TBT | 14 ms | 22 ms | _not measured yet_ |
| Weight | 13,283 KiB | 309 KiB | _not measured yet_ |
| Requests | 94 | 35 | _not measured yet_ |

### GIF-heavy post (`/post/microinteractions/`), desktop

| Metric | Old: production | New: local only | New: after cutover (production) |
| --- | ---: | ---: | ---: |
| Performance | 82 | 100 | _not measured yet_ |
| Accessibility | 83 | 100 | _not measured yet_ |
| Best practices | 73 | 100 | _not measured yet_ |
| SEO | 92 | 100 | _not measured yet_ |
| LCP | 2.87 s | 0.24 s | _not measured yet_ |
| CLS | 0.021 | 0 | _not measured yet_ |
| TBT | 0 ms | 0 ms | _not measured yet_ |
| Weight | 13,279 KiB | 313 KiB | _not measured yet_ |
| Requests | 95 | 35 | _not measured yet_ |

### Memphis post (`/post/modern-ui-with-memphis-design/`), mobile

| Metric | Old: production | New: local only | New: after cutover (production) |
| --- | ---: | ---: | ---: |
| Performance | 74 | 96 | _not measured yet_ |
| Accessibility | 79 | 100 | _not measured yet_ |
| Best practices | 73 | 100 | _not measured yet_ |
| SEO | 92 | 100 | _not measured yet_ |
| LCP | 12.24 s | 2.79 s | _not measured yet_ |
| CLS | 0.004 | 0 | _not measured yet_ |
| TBT | 13 ms | 19 ms | _not measured yet_ |
| Weight | 12,322 KiB | 330 KiB | _not measured yet_ |
| Requests | 321 | 34 | _not measured yet_ |

The old memphis post was only measured on mobile.

To fill the last column after cutover:

```bash
pnpm measure https://www.thedevelobear.com docs/measurements/production.json
BASE_URL=https://www.thedevelobear.com pnpm test:e2e
```

These are lab numbers. Real-user Core Web Vitals will come from Vercel Speed Insights, and there are none yet.

## Targets

Mobile targets, checked by Lighthouse CI on six pages (local, median of 3):

| Page | Perf | A11y | Best pr. | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 96 | 100 | 100 | 100 | 2.80 s **(missed)** | 0.000 | 29 ms |
| `/post/logpoints/` | 96 | 100 | 100 | 100 | 2.72 s **(missed)** | 0.000 | 21 ms |
| `/post/microinteractions/` | 100 | 100 | 100 | 100 | 0.90 s | 0.000 | 20 ms |
| `/post/modern-ui-with-memphis-design/` | 96 | 100 | 100 | 100 | 2.80 s **(missed)** | 0.000 | 20 ms |
| `/about/` | 100 | 100 | 100 | 100 | 0.75 s | 0.000 | 20 ms |
| `/projects/` | 100 | 100 | 100 | 100 | 0.75 s | 0.000 | 20 ms |

Performance ≥95; accessibility, best practices and SEO 100; CLS <0.05 and TBT <100 ms are met on all six.

**LCP < 2.0 s is not met on three of them:** home and two posts, where the largest element is a cover or hero image. It is met where the largest element is text.

- In the unthrottled trace behind each run the image is requested early, with high priority. The 2.6 to 2.8 s comes from Lighthouse's simulation of slow 4G, where the image shares the link with fonts and about 148 KiB of JavaScript.
- With every JavaScript file blocked, the same three pages measured 1.95 to 2.03 s. So even removing all of it would only just reach the target. That JavaScript is almost all React and the Next.js runtime; the reward demo's library is not part of it.
- Tried and not kept: inlined CSS (no clear gain), a modern `browserslist` (no change), and not preloading fonts (faster in some runs, but results varied from run to run, and with neither font preloaded one page's CLS rose to 0.09).
- In CI the 2.0 s target stays as a warning on these three pages, with a hard 3.0 s ceiling. On the other three it is a hard 2.0 s limit.

## What made it faster

- **GIF to video.** Eight GIFs, 19,800,835 bytes on `master`, are now H.264 MP4s totalling 1,797,539 bytes, plus 196,277 bytes of JPEG posters: about 90% less, posters included. Videos have controls, do not autoplay (which also respects reduced motion) and are not downloaded until played.
- **Lazy posters.** `preload="none"` does not stop a browser fetching every video's poster. `loading="lazy"` on `<video>` does where supported (checked in Chromium 159; the WebKit build tested still loads them). One attribute, no client JavaScript.
- **Display font, 58,296 to 22,816 bytes.** The site uses one weight of Big Shoulders, but `next/font/google` can only serve the optical-size axis together with all weights. It is now Google's own file with the weight pinned and optical sizing kept, loaded with `next/font/local`. The trade-off: it covers Latin only (a unit test fails if a heading needs more), and updating it is manual.
- **AVIF** from `next/image`, with WebP as the fallback.
- **Third parties removed.** On mobile, the old home page made 19 of its 34 requests to 7 other hosts (AdSense, a Google ad-quality service, `ga.js`, Google Fonts, the jQuery CDN). The memphis post made 304 of 321 requests to 18 other hosts, mostly Instagram embeds and Disqus. The new pages request nothing from other hosts, which a test enforces. Embeds became static linked cards and comments were dropped. Vercel's analytics are meant to load from the site's own domain too, which can only be checked once deployed.
- **Images** go through `next/image` with real dimensions read at build time. `static/` on `master` was 38.4 MB and `public/` is 12.6 MB, mostly because the GIFs and unreferenced files are gone.

## Decisions and trade-offs

### Why Next.js rather than Astro

For a mostly static blog, Astro would ship less JavaScript. That is the main cost of this choice, and it is measurable: every page loads 151,304 bytes of script (gzip, including headers), nearly all framework, and it is a large part of why the image-led pages miss the LCP target.

What it buys: React Server Components (the one interactive component of the site's own is the reward demo), daily regeneration for the live GitHub and npm numbers, `next/image`, the metadata API and generated social cards, and a demo that uses my React library directly. A budget of 155,000 bytes keeps the cost from growing.

I did not build an Astro version, so I have no measured comparison between the two.

### Retiring the old service worker

The old site registered a cache-first service worker. Everything it precaches answered 200 on the live site, so it could install, and a returning visitor could have kept seeing cached Hugo pages after cutover. Deleting `sw.js` was not enough of a plan, so the new [`sw.js`](../public/sw.js) takes over, deletes every cache, unregisters itself and reloads open tabs. It has no fetch handler, is served with `no-cache`, and must stay for at least a year.

The test installs the **real old worker**, byte for byte, in Chromium and WebKit. One local origin plays three stages: the old site; the new pages behind the old worker (which still shows the old page, in both of two open tabs); then the new `sw.js`. After one reload both tabs show the new site, with no registration, no caches, no controller and no reload loop. It cannot cover real visitors' browsers, so it is the closest check available before cutover.

### Keeping URLs and feeds

- All post URLs are unchanged, trailing slash included.
- Removed pages (`/categories/`, `/tags/`, `/offline/`, pagination, tag feeds) redirect permanently, in one hop.
- Both feeds keep their addresses and item GUIDs, so readers should not see old posts as new. The one dropped item is the offline page.
- A test checks every URL from the old sitemap, and compares GUIDs with copies of the old feeds.

### Security headers

`nosniff`, a referrer policy, a permissions policy and `frame-ancestors 'none'`. There is no script Content Security Policy: a nonce-based one would force every page to render dynamically.

## Quality gates

A GitHub Actions workflow is set up to run lint, type check, unit tests, build, Playwright (desktop Chromium and mobile WebKit) and Lighthouse CI. Playwright covers old URLs and redirects, metadata and JSON-LD, feeds, the excluded draft, internal links and assets, third-party requests, reading with JavaScript off, axe accessibility checks on every page, no sideways scrolling at 360 px, video playback, the reward demo's first click and the service worker migration. A separate job fails while any unfilled placeholder is on the site.

At the time of writing the workflow has not run on GitHub: every result here comes from local runs on macOS.

Automated accessibility checks find only some problems. A clean axe run and a Lighthouse score of 100 are not proof that the site is fully accessible; no screen reader testing is recorded here.

To check that the tests can fail, I broke the code on purpose: removed a redirect, put the draft in a feed, added an external image without alt text and a dead link, swallowed the demo's first click, and removed cache deletion from the new worker. The matching tests failed each time.

Two bugs these gates found: the home page was 14 px too wide at 360 px while the featured card animated in, and two links labelled only "here" cost a post its SEO score (the links now cover more of the same sentence; no words changed).
