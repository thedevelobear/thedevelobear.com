// The before/after numbers: the pages in docs/baseline, measured the same way
// (Lighthouse 13.6.0, mobile and desktop, median of 3 runs by performance score).
// Usage: pnpm measure <site URL> <output.json>
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const [site, output] = process.argv.slice(2);
if (!site || !output) {
  throw new Error("Usage: pnpm measure <site URL> <output.json>");
}

const paths = [
  "/",
  "/post/logpoints/",
  "/post/microinteractions/",
  "/post/modern-ui-with-memphis-design/",
];

// Chrome now and then dies mid-run ("Target closed"), so a failed run is retried
// rather than losing the whole session.
function run(url: string, form: string, retries = 2): LighthouseResult {
  try {
    return runOnce(url, form);
  } catch (error) {
    if (retries === 0) throw error;
    console.error(`Retrying ${url} (${form})`);
    return run(url, form, retries - 1);
  }
}

type LighthouseResult = ReturnType<typeof runOnce>;

function runOnce(url: string, form: string) {
  const stdout = execFileSync(
    "node_modules/.bin/lighthouse",
    [
      url,
      "--output=json",
      "--quiet",
      "--chrome-flags=--headless=new",
      ...(form === "desktop" ? ["--preset=desktop"] : []),
    ],
    {
      env: { CHROME_PATH: chromium.executablePath(), ...process.env },
      maxBuffer: 64 * 1024 * 1024,
      encoding: "utf8",
    },
  );
  const report = JSON.parse(stdout);
  if (report.runtimeError) throw new Error(report.runtimeError.message);
  return report;
}

const rows = [];
for (const path of paths) {
  for (const form of ["mobile", "desktop"]) {
    const url = new URL(path, site).href;
    const runs = [1, 2, 3]
      .map(() => run(url, form))
      .sort(
        (a, b) =>
          a.categories.performance.score - b.categories.performance.score,
      );
    const { audits, categories, lighthouseVersion } = runs[1];
    const score = (id: string) => Math.round(categories[id].score * 100);
    const row = {
      path,
      form,
      performance: score("performance"),
      accessibility: score("accessibility"),
      "best-practices": score("best-practices"),
      seo: score("seo"),
      lcpMs: Math.round(audits["largest-contentful-paint"].numericValue),
      cls: Number(audits["cumulative-layout-shift"].numericValue.toFixed(3)),
      tbtMs: Math.round(audits["total-blocking-time"].numericValue),
      transferKB: Math.round(audits["total-byte-weight"].numericValue / 1024),
      requests: audits["network-requests"].details.items.length,
      lighthouse: lighthouseVersion,
    };
    console.log(Object.values(row).join(" | "));
    rows.push(row);
  }
}

writeFileSync(
  output,
  `${JSON.stringify({ date: new Date().toISOString(), site, note: "median of 3 runs by performance score", rows }, null, 2)}\n`,
);
