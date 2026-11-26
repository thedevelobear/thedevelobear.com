import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  // List pages change when their newest post does.
  const lists = [
    ["/", posts],
    ["/post/", posts],
    ["/tags/code/", posts.filter((post) => post.tags.includes("code"))],
    ["/tags/design/", posts.filter((post) => post.tags.includes("design"))],
  ] as const;

  return [
    ...lists.map(([path, listed]) => ({
      url: `${siteUrl}${path}`,
      lastModified: listed[0].date,
    })),
    { url: `${siteUrl}/projects/` },
    { url: `${siteUrl}/about/` },
    ...posts.map((post) => ({
      url: `${siteUrl}/post/${post.slug}/`,
      lastModified: post.date,
    })),
  ];
}
