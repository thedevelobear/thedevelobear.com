// Not the opengraph-image file convention: with trailingSlash, its URL redirects.
import { notFound } from "next/navigation";
import { ogImage } from "@/lib/og";
import { formatDate, getPost, getPosts } from "@/lib/posts";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/post/[slug]/og.png">,
) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return ogImage(
    post.title,
    `${formatDate(post.date)}, ${post.readingTime} min read`,
    post.color,
  );
}
