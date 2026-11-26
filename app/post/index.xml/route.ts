import { getPosts } from "@/lib/posts";
import { postItem, rssResponse } from "@/lib/rss";

export const dynamic = "force-static";

export function GET() {
  const title = "Posts on Develobear - Front-end, React, CSS, Design blog.";
  return rssResponse({
    title,
    path: "/post/",
    self: "/post/index.xml",
    description: `Recent content in ${title}`,
    items: getPosts().map(postItem),
  });
}
