import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { formatDate, getPost, getPosts, isOutdated } from "./posts.ts";
import { colors } from "./site.ts";

const posts = getPosts();

test("10 published posts with unique slugs, newest first", () => {
  assert.equal(posts.length, 10);
  assert.equal(new Set(posts.map((post) => post.slug)).size, posts.length);
  const dates = posts.map((post) => post.date);
  assert.deepEqual(dates, dates.toSorted().reverse());
});

test("the draft is excluded", () => {
  assert.equal(getPost("Class-functional-pure"), undefined);
});

test("every referenced local asset and post link exists", () => {
  for (const post of posts) {
    const source = readFileSync(`content/post/${post.file}.md`, "utf8");
    const links = [...source.matchAll(/\]\((\/[^)\s#?]*)/g)].map((m) => m[1]);

    for (const link of [post.image, ...links]) {
      const slug = link.match(/^\/post\/([^/]+)\/$/)?.[1];
      if (slug) {
        assert.ok(getPost(slug), `${post.file}: broken link ${link}`);
        continue;
      }
      const files = link.endsWith(".mp4")
        ? [link, link.replace(/mp4$/, "jpg")]
        : [link];
      for (const file of files) {
        assert.ok(existsSync(`public${file}`), `${post.file}: missing ${file}`);
      }
    }
  }
});

test("headings stay within the display font's latin file", () => {
  for (const { file, title } of posts) {
    const source = readFileSync(`content/post/${file}.md`, "utf8");
    const headings = source.match(/^#{1,6} .*$/gm) ?? [];
    for (const heading of [title, ...headings]) {
      // Latin Extended letters, such as "ł".
      assert.doesNotMatch(heading, /[\u0100-\u024f]/, file);
    }
  }
});

/** WCAG relative luminance of "#rrggbb". */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const c = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

test("every post colour gives ink text AA contrast", () => {
  for (const { slug, color } of posts) {
    const ratio = (luminance(color) + 0.05) / (luminance(colors.ink) + 0.05);
    assert.ok(ratio >= 4.5, `${slug}: ${color} is only ${ratio.toFixed(2)}:1`);
  }
});

test("dates are formatted, and posts age out after two years", () => {
  assert.equal(formatDate("2020-10-29"), "29 October 2020");
  const now = new Date("2022-10-29T12:00:00Z");
  assert.equal(isOutdated("2020-10-29", now), true);
  assert.equal(isOutdated("2020-10-30", now), false);
});
