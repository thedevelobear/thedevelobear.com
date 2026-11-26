// What visitors experience. Runs at desktop and mobile sizes.
import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { missingPage, pages, posts } from "./pages.ts";

/** Scrolls through the page so everything lazy gets requested, then settles. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
  });
  await page.waitForLoadState("networkidle");
}

const violations = async (page: Page) =>
  (await new AxeBuilder({ page }).analyze()).violations.map(
    ({ id, help, nodes }) => ({
      id,
      help,
      targets: nodes.map((node) => node.target.join(" ")),
    }),
  );

for (const path of [...pages, missingPage]) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    // Entrance and hover motion would otherwise be measured half-way.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    expect(await violations(page)).toEqual([]);
  });

  test(`${path} loads cleanly, with no third parties`, async ({
    page,
    baseURL,
  }) => {
    const origin = new URL(baseURL ?? "").origin;
    const foreign: string[] = [];
    const problems: string[] = [];
    const videos: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (!["data:", "blob:"].includes(url.protocol) && url.origin !== origin) {
        foreign.push(url.href);
      }
      if (url.pathname.endsWith(".mp4")) videos.push(url.pathname);
    });
    page.on("response", (response) => {
      if (response.status() >= 400 && !response.url().endsWith(missingPage)) {
        problems.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on("pageerror", (error) => problems.push(error.message));
    page.on("console", (message) => {
      // The 404 page's own status is one expected error. WebKit also logs this
      // about the icons of its own built-in video controls.
      if (
        message.type() === "error" &&
        path !== missingPage &&
        !message.text().startsWith("Button failed to load, iconName =")
      ) {
        problems.push(message.text());
      }
    });

    await page.goto(path);
    await scrollThrough(page);
    expect(foreign).toEqual([]);
    expect(problems).toEqual([]);
    expect(videos, "videos load only when played").toEqual([]);
    const broken = await page.$$eval("img", (images) =>
      images
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.src),
    );
    expect(broken).toEqual([]);
  });
}

test("no page scrolls sideways at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  for (const path of [...pages, missingPage]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect.soft(overflow, path).toBe(0);
  }
});

test.describe("with JavaScript off", () => {
  test.use({ javaScriptEnabled: false });

  for (const { slug, title } of posts) {
    test(`the post ${slug} is readable`, async ({ page }) => {
      await page.goto(`/post/${slug}/`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      const blocks = page.locator(".prose > *");
      expect(await blocks.count()).toBeGreaterThan(5);
      for (const block of await blocks.all()) {
        await expect(block).toBeVisible();
      }
      const text = await page.locator(".prose").innerText();
      expect(text.split(/\s+/).length).toBeGreaterThan(250);
    });
  }
});

for (const path of ["/", "/projects/"]) {
  test(`${path}: the reward demo fires on the very first click`, async ({
    page,
  }) => {
    const scripts: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(request.url());
    });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const before = scripts.length;
    const canvases = await page.locator("canvas").count();

    // No hover or focus first, so nothing has preloaded the library.
    await page
      .getByRole("button", { name: "Confetti", exact: true })
      .dispatchEvent("click");

    await expect(page.locator("main output")).toHaveText(
      /^Drawn with (WebGL2|Canvas 2D)\.$/,
    );
    await expect(page.locator("canvas")).not.toHaveCount(canvases);
    expect(scripts.length, "the library is loaded on demand").toBeGreaterThan(
      before,
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await violations(page)).toEqual([]);
  });
}

test("the reward demo respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/");
  await page.getByRole("button", { name: "Balloons" }).click();
  await expect(page.locator("main output")).toContainText("reduced motion");
});

const withVideo = posts.filter(({ file }) =>
  readFileSync(`content/post/${file}.md`, "utf8").includes(".mp4"),
);

test("the four posts with former GIFs have video", () => {
  expect(withVideo).toHaveLength(4);
});

for (const { slug } of withVideo) {
  test(`videos in ${slug} play`, async ({ page }) => {
    await page.goto(`/post/${slug}/`);
    const videos = await page.locator("video").all();
    expect(videos.length).toBeGreaterThan(0);
    for (const video of videos) {
      // As a visitor would: nobody can press play on a video they can't see,
      // and a lazy one doesn't load until it is near the screen.
      await video.scrollIntoViewIfNeeded();
      // Resolves only once frames are really playing.
      const time = await video.evaluate(async (element: HTMLVideoElement) => {
        await element.play();
        await new Promise((resolve) =>
          element.addEventListener("timeupdate", resolve, { once: true }),
        );
        element.pause();
        return element.currentTime;
      });
      expect(time).toBeGreaterThan(0);
      await expect(video).toHaveAttribute("aria-label", /\S/);
      // Keeps off-screen posters from loading up front.
      await expect(video).toHaveAttribute("loading", "lazy");
    }
  });
}
