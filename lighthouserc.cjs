// Budgets for `pnpm lighthouse` (after `pnpm build`). Mobile, simulated
// throttling, median of 3 runs.
const { chromium } = require("@playwright/test");

// The Chromium that Playwright pins, so local runs and CI use the same browser.
process.env.CHROME_PATH ||= chromium.executablePath();

const port = process.env.PORT ?? 3100;
const median = (level) => ["error", { ...level, aggregationMethod: "median" }];
const atMost = (maxNumericValue) => median({ maxNumericValue });

const textLcp = "/(about|projects|post/microinteractions)/$";
const imageLcp = `(:${port}/|/post/(logpoints|modern-ui-with-memphis-design)/)$`;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `pnpm start --port ${port}`,
      startServerReadyPattern: "Ready in",
      numberOfRuns: 3,
      url: [
        "/",
        "/post/logpoints/",
        "/post/microinteractions/",
        "/post/modern-ui-with-memphis-design/",
        "/about/",
        "/projects/",
      ].map((path) => `http://localhost:${port}${path}`),
      settings: {
        // CI runners don't allow Chrome's sandbox.
        chromeFlags: process.env.CI
          ? "--headless=new --no-sandbox"
          : "--headless=new",
      },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: ".*",
          assertions: {
            "categories:performance": median({ minScore: 0.95 }),
            "categories:accessibility": median({ minScore: 1 }),
            "categories:best-practices": median({ minScore: 1 }),
            "categories:seo": median({ minScore: 1 }),
            "cumulative-layout-shift": atMost(0.05),
            "total-blocking-time": atMost(100),
            // First-load JavaScript in bytes over the wire (gzip and headers),
            // just above the measured 151,304. Nearly all of it is the framework.
            "resource-summary:script:size": atMost(155_000),
          },
        },
        // The LCP target is 2.0 s. Pages whose LCP is text meet it.
        {
          matchingUrlPattern: textLcp,
          assertions: { "largest-contentful-paint": atMost(2000) },
        },
        // NOT MET where the LCP is an image: 2.6 to 2.8 s on simulated slow 4G
        // (docs/case-study.md says why). The target stays visible as a warning,
        // and a ceiling stops it getting worse.
        {
          matchingUrlPattern: imageLcp,
          assertions: {
            "largest-contentful-paint": [
              "warn",
              { maxNumericValue: 2000, aggregationMethod: "median" },
            ],
          },
        },
        {
          matchingUrlPattern: imageLcp,
          assertions: { "largest-contentful-paint": atMost(3000) },
        },
      ],
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/report" },
  },
};
