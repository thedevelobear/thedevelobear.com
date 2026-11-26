// RSS 2.0. GUIDs and links match the old Hugo feeds, so readers see nothing as new.
import type { Post } from "./posts.ts";
import { siteUrl } from "./site.ts";

export type FeedItem = {
  title: string;
  /** Path under the site, which is also the permanent GUID. Never change it. */
  path: string;
  date: Date;
  description: string;
};

export const postItem = (post: Post): FeedItem => ({
  title: post.title,
  path: `/post/${post.slug}/`,
  date: new Date(post.date),
  description: post.description,
});

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const rssDate = (date: Date) => date.toUTCString().replace("GMT", "+0000");

/** `items` must be newest first. */
export function rssResponse({
  title,
  path,
  self,
  description,
  items,
}: {
  title: string;
  path: string;
  self: string;
  description: string;
  items: FeedItem[];
}): Response {
  const entries = items.map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${siteUrl}${item.path}</link>
      <pubDate>${rssDate(item.date)}</pubDate>
      <guid>${siteUrl}${item.path}</guid>
      <description>${escapeXml(item.description)}</description>
    </item>`,
  );
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}${path}</link>
    <description>${escapeXml(description)}</description>
    <language>en-US</language>
    <lastBuildDate>${rssDate(items[0].date)}</lastBuildDate>
    <atom:link href="${siteUrl}${self}" rel="self" type="application/rss+xml" />
${entries.join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
