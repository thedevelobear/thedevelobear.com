import { getPosts } from "@/lib/posts";
import { postItem, rssResponse } from "@/lib/rss";

export const dynamic = "force-static";

export function GET() {
  const title = "Develobear - Front-end, React, CSS, Design blog.";
  return rssResponse({
    title,
    path: "/",
    self: "/index.xml",
    description: `Recent content on ${title}`,
    items: [
      ...getPosts().map(postItem),
      // The old feed listed this page too. It is older than every post.
      {
        title: "About me",
        path: "/about/",
        date: new Date("2015-04-14T22:17:00Z"),
        description: "About Develobear.",
      },
    ],
  });
}
