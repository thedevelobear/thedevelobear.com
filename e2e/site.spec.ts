// What crawlers and feed readers see. Independent of viewport, so desktop only.
import { readFileSync } from "node:fs";
import { type APIRequestContext, expect, test } from "@playwright/test";
import { siteUrl } from "../lib/site.ts";
import { missingPage, pages } from "./pages.ts";

const baseline = (file: string) =>
  readFileSync(`docs/baseline/${file}`, "utf8");

async function status(request: APIRequestContext, url: string) {
  const response = await request.get(url, { maxRedirects: 0 });
  const location = response.headers().location;
  return location
    ? `${response.status()} ${new URL(location, response.url()).pathname}`
    : `${response.status()}`;
}

test("every old URL answers 200 or redirects once to its new home", async ({
  request,
}) => {
  const redirected: Record<string, string> = {
    "/offline/": "/post/",
    "/categories/": "/post/",
    "/tags/": "/post/",
  };
  const legacy = baseline("legacy-urls.txt").trim().split("\n");
  // Hugo URLs that were never in the sitemap.
  Object.assign(redirected, {
    "/page/2/": "/post/",
    "/post/page/2/": "/post/",
    "/tags/code/page/2/": "/tags/code/",
    "/tags/design/page/2/": "/tags/design/",
    "/tags/code/index.xml": "/index.xml",
    "/tags/design/index.xml": "/index.xml",
    "/tags/index.xml": "/index.xml",
    "/categories/index.xml": "/index.xml",
  });
  const feeds = ["/index.xml", "/post/index.xml", "/sitemap.xml"];

  for (const url of new Set([
    ...legacy,
    ...feeds,
    ...Object.keys(redirected),
  ])) {
    const target = redirected[url];
    expect
      .soft(await status(request, url), url)
      .toBe(target ? `308 ${target}` : "200");
    if (target) expect.soft(await status(request, target), target).toBe("200");
  }
});

test("feed GUIDs match the old feeds", async ({ request }) => {
  const guids = (xml: string) =>
    [...xml.matchAll(/<guid[^>]*>([^<]+)<\/guid>/g)].map((match) => match[1]);

  for (const [url, file] of [
    ["/index.xml", "feed-root.xml"],
    ["/post/index.xml", "feed-post.xml"],
  ]) {
    // The offline page is gone. Dropping an item shows readers nothing new.
    const expected = guids(baseline(file)).filter(
      (guid) => guid !== `${siteUrl}/offline/`,
    );
    expect(expected.length).toBeGreaterThanOrEqual(10);
    expect(guids(await (await request.get(url)).text()), url).toEqual(expected);
  }
});

test("the sitemap lists exactly the published pages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(listed.sort()).toEqual(pages.map((path) => siteUrl + path).sort());
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
});

test("the draft appears nowhere", async ({ request }) => {
  const draft = /class-functional-pure|which are the fastest/i;
  const files = [
    ...pages,
    "/index.xml",
    "/post/index.xml",
    "/sitemap.xml",
    "/robots.txt",
  ];
  for (const url of files) {
    const response = await request.get(url);
    expect(response.status(), url).toBe(200);
    expect.soft(await response.text(), url).not.toMatch(draft);
  }
  for (const url of [
    "/post/Class-functional-pure/",
    "/post/class-functional-pure/",
    "/post/01/",
    "/post/Class-functional-pure/og.png",
  ]) {
    expect.soft((await request.get(url)).status(), url).toBe(404);
  }
});

test("every page has unique metadata, one h1 and valid JSON-LD", async ({
  browser,
  baseURL,
}) => {
  // Without JavaScript: this is the HTML as the server sends it.
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const path of pages) {
    await page.goto(path);
    const head = await page.evaluate(() => {
      const all = (selector: string, attribute: string) =>
        [...document.querySelectorAll(selector)].map(
          (element) => element.getAttribute(attribute) ?? "",
        );
      return {
        title: document.title,
        description: all('meta[name="description"]', "content"),
        canonical: all('link[rel="canonical"]', "href"),
        ogTitle: all('meta[property="og:title"]', "content"),
        ogImage: all('meta[property="og:image"]', "content"),
        twitter: all('meta[name="twitter:card"]', "content"),
        h1: document.querySelectorAll("h1").length,
        lang: document.documentElement.lang,
        jsonLd: [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ].map((script) => script.textContent ?? ""),
      };
    });

    expect.soft(head.title, path).not.toBe("");
    expect.soft(head.description, path).toHaveLength(1);
    expect.soft(head.description[0]?.length, path).toBeGreaterThan(30);
    expect.soft(head.canonical, path).toEqual([siteUrl + path]);
    expect.soft(head.ogTitle, path).toHaveLength(1);
    expect.soft(head.ogImage, path).toHaveLength(1);
    expect.soft(head.twitter, path).toEqual(["summary_large_image"]);
    expect.soft(head.h1, path).toBe(1);
    expect.soft(head.lang, path).toBe("en");
    const types = head.jsonLd
      .flatMap((json) => [JSON.parse(json)].flat())
      .flatMap((data) => data["@graph"] ?? data)
      .map((data) => data["@type"]);
    expect.soft(types, path).toContain("WebSite");
    if (path !== "/") {
      const required = path.match(/^\/post\/./)
        ? ["BlogPosting", "BreadcrumbList"]
        : ["BreadcrumbList"];
      for (const type of required) expect.soft(types, path).toContain(type);
    }
    if (path === "/projects/") {
      expect.soft(types, path).toContain("SoftwareSourceCode");
    }
    titles.add(head.title);
    descriptions.add(head.description[0]);
  }
  expect(titles.size, "unique titles").toBe(pages.length);
  expect(descriptions.size, "unique descriptions").toBe(pages.length);
  await context.close();
});

test("no internal link, anchor, image or asset is broken", async ({
  page,
  request,
  baseURL,
}) => {
  test.slow();
  const found = new Map<string, string>(); // URL -> first page that uses it
  const anchors = new Map<string, Set<string>>(); // path -> ids on it
  const fragments: [string, string, string][] = [];

  for (const path of [...pages, missingPage]) {
    await page.goto(path);
    const { urls, ids } = await page.evaluate(() => {
      const urls: string[] = [];
      const attributes = ["href", "src", "poster", "content"];
      for (const element of document.querySelectorAll(
        'a[href], img[src], video[src], video[poster], script[src], link[href], meta[property="og:image"], meta[name="twitter:image"]',
      )) {
        for (const attribute of attributes) {
          const value = element.getAttribute(attribute);
          if (value) urls.push(value);
        }
      }
      for (const element of document.querySelectorAll(
        "[srcset], [imagesrcset]",
      )) {
        const set =
          element.getAttribute("srcset") ??
          element.getAttribute("imagesrcset") ??
          "";
        for (const entry of set.split(", ")) urls.push(entry.split(" ")[0]);
      }
      return {
        urls,
        ids: [...document.querySelectorAll("[id]")].map((e) => e.id),
      };
    });
    anchors.set(path, new Set(ids));

    for (const raw of urls) {
      // Canonical and social URLs name the live site: check them here too.
      const url = new URL(
        raw.startsWith(siteUrl) ? raw.slice(siteUrl.length) || "/" : raw,
        new URL(path, baseURL),
      );
      if (url.origin !== new URL(baseURL ?? "").origin) continue;
      if (path === missingPage && url.pathname === missingPage) continue;
      if (url.hash) {
        fragments.push([path, url.pathname, url.hash.slice(1)]);
        url.hash = "";
      }
      if (!found.has(url.href)) found.set(url.href, path);
    }
  }

  expect(found.size).toBeGreaterThan(100);
  const queue = [...found];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      for (let item = queue.pop(); item; item = queue.pop()) {
        const [url, from] = item;
        // A redirect counts as broken: internal links should be direct.
        expect
          .soft(await status(request, url), `${url} on ${from}`)
          .toBe("200");
      }
    }),
  );
  for (const [from, target, id] of fragments) {
    expect
      .soft(anchors.get(target), `${target}#${id} on ${from}`)
      .toContain(id);
  }
});

test("unknown pages are a real 404", async ({ page }) => {
  const response = await page.goto(missingPage);
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("security headers are set, and the retiring worker is never cached", async ({
  request,
}) => {
  const headers = (await request.get("/")).headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["content-security-policy"]).toBe("frame-ancestors 'none'");

  const worker = await request.get("/sw.js");
  expect(worker.status()).toBe(200);
  expect(worker.headers()["cache-control"]).toBe("no-cache");
});

test("the skip link is first and moves focus to the content", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});
