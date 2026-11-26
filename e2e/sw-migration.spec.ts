// A returning visitor still has the Hugo site's cache-first service worker.
// One origin plays all three stages: the old site, then the new pages behind the
// old worker, then the cutover with the new /sw.js.
import { readFileSync } from "node:fs";
import { createServer, request as httpRequest } from "node:http";
import type { AddressInfo } from "node:net";
import { expect, type Page, test } from "@playwright/test";

test.skip(
  Boolean(process.env.BASE_URL),
  "needs to put the old worker on the origin, so local only",
);

// Byte for byte the worker served by the old site.
const oldWorker = readFileSync("e2e/fixtures/old-sw.js", "utf8");
const oldHeading = "The old Hugo site";
const oldPage = `<!doctype html><title>Old</title><h1>${oldHeading}</h1>
<script>navigator.serviceWorker.register("/sw.js", { scope: "/" });</script>`;

type Stage = "old-site" | "old-worker-stuck" | "cutover";

async function startOrigin(upstream: URL) {
  const origin = { stage: "old-site" as Stage, url: "", close: () => {} };
  const server = createServer((req, res) => {
    const isWorker = req.url === "/sw.js";
    if (
      origin.stage === "old-site" ||
      (isWorker && origin.stage !== "cutover")
    ) {
      // Every path answers 200, as each precached file did on the old host.
      res.writeHead(200, {
        "content-type": isWorker ? "application/javascript" : "text/html",
        "cache-control": "public,max-age=0,must-revalidate",
      });
      res.end(isWorker ? oldWorker : oldPage);
      return;
    }
    req.pipe(
      httpRequest(
        {
          host: upstream.hostname,
          port: upstream.port,
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        (response) => {
          res.writeHead(response.statusCode ?? 502, response.headers);
          response.pipe(res);
        },
      ),
    );
  });
  await new Promise<void>((resolve) => server.listen(0, "localhost", resolve));
  origin.url = `http://localhost:${(server.address() as AddressInfo).port}/`;
  origin.close = () => {
    server.closeAllConnections();
    server.close();
  };
  return origin;
}

const state = (page: Page) =>
  page.evaluate(async () => ({
    registrations: (await navigator.serviceWorker.getRegistrations()).length,
    caches: (await caches.keys()).sort(),
    controlled: Boolean(navigator.serviceWorker.controller),
  }));

test("the old service worker is retired and visitors get the new site", async ({
  context,
  baseURL,
}) => {
  const origin = await startOrigin(new URL(baseURL ?? ""));
  try {
    // 1. The old site installs its worker, which caches the home page.
    const page = await context.newPage();
    await page.goto(origin.url);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(async () => (await state(page)).controlled).toBe(true);
    await page.reload();
    await expect
      .poll(() => page.evaluate(() => caches.match("/").then(Boolean)))
      .toBe(true);
    expect((await state(page)).caches).toEqual([
      "404-v10",
      "assets-v10",
      "content-v10",
      "offline-v10",
    ]);

    // 2. The server now has the new site, but the old worker hides it.
    origin.stage = "old-worker-stuck";
    await page.reload();
    await expect(page.locator("h1")).toHaveText(oldHeading);
    const secondTab = await context.newPage();
    await secondTab.goto(origin.url);
    await expect(secondTab.locator("h1")).toHaveText(oldHeading);

    // 3. Cutover. One visit is enough: both open tabs reload themselves.
    origin.stage = "cutover";
    await page.reload();
    for (const tab of [page, secondTab]) {
      await expect(tab.locator("h1")).toContainText("Front-end, design");
      await expect(async () => {
        expect(await state(tab)).toEqual({
          registrations: 0,
          caches: [],
          controlled: false,
        });
      }).toPass();
      await tab.waitForLoadState("load");
    }

    // 4. And it stays that way: no reload loop, nothing re-registers.
    let loads = 0;
    page.on("load", () => loads++);
    await page.waitForTimeout(2000);
    expect(loads).toBe(0);
    const response = await page.reload();
    expect(response?.fromServiceWorker()).toBe(false);
    expect(await state(page)).toEqual({
      registrations: 0,
      caches: [],
      controlled: false,
    });
  } finally {
    origin.close();
  }
});
