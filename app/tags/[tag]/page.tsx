import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PostList } from "@/components/PostList";
import { getPosts, type Tag } from "@/lib/posts";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

const pages: Record<Tag, { title: string; description: string }> = {
  code: {
    title: "Code articles",
    description:
      "Develobear’s articles about code: JavaScript, React, debugging, performance and other front-end topics.",
  },
  design: {
    title: "Design articles",
    description:
      "Develobear’s articles about design: modern interfaces, microinteractions, Memphis style and design skills for developers.",
  },
};

const isTag = (tag: string): tag is Tag => Object.hasOwn(pages, tag);

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tags/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  return isTag(tag)
    ? pageMetadata({ ...pages[tag], path: `/tags/${tag}/` })
    : {};
}

export default async function TagPage({ params }: PageProps<"/tags/[tag]">) {
  const { tag } = await params;
  if (!isTag(tag)) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbs(
          ["Blog", "/post/"],
          [pages[tag].title, `/tags/${tag}/`],
        )}
      />
      <PostList
        title={pages[tag].title}
        tag={tag}
        posts={getPosts().filter((post) => post.tags.includes(tag))}
      />
    </>
  );
}
