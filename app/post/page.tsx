import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PostList } from "@/components/PostList";
import { getPosts } from "@/lib/posts";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Articles",
  description:
    "All of Develobear’s articles on JavaScript, React, front-end development and interface design.",
  path: "/post/",
});

export default function PostsPage() {
  return (
    <>
      <JsonLd data={breadcrumbs(["Blog", "/post/"])} />
      <PostList title="Articles" posts={getPosts()} />
    </>
  );
}
