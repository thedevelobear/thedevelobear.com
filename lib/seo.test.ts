import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getPosts } from "./posts.ts";
import { postItem, rssResponse } from "./rss.ts";
import { jsonLdString, metaDescription } from "./seo.ts";

test("meta descriptions fit, and are cut cleanly", () => {
  for (const post of getPosts()) {
    const summary = metaDescription(post.description);
    assert.ok(summary.length <= 160, `${post.slug}: ${summary.length}`);
    assert.match(summary, /[.!?…)👀🍿]$/u, post.slug);
  }
  const sentence = `${"word ".repeat(16).trim()}.`;
  assert.equal(metaDescription(`${sentence} ${sentence} more`), sentence);
  assert.equal(metaDescription("alpha beta, gamma delta", 14), "alpha beta…");
});

test("JSON-LD cannot close its script tag", () => {
  const json = jsonLdString({ name: "</script>" });
  assert.ok(!json.includes("<"));
  assert.deepEqual(JSON.parse(json), { name: "</script>" });
});

test("feed GUIDs and links match the old feed, and text is escaped", async () => {
  const baseline = readFileSync("docs/baseline/feed-post.xml", "utf8");
  const tags = (xml: string) => xml.match(/<(guid|link|pubDate)>[^<]*/g);
  const feed = (items = getPosts().map(postItem)) =>
    rssResponse({
      title: "a & <b>",
      path: "/post/",
      self: "/post/index.xml",
      description: "d",
      items,
    }).text();

  const xml = await feed();
  assert.deepEqual(tags(xml), tags(baseline));
  assert.match(xml, /<title>a &amp; &lt;b&gt;<\/title>/);
});
