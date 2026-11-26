import Link from "next/link";
import type { Post } from "@/lib/posts";
import { PostImage } from "@/mdx-components";
import { PostMeta } from "./PostMeta";

/** A tile in the post's own colour. The title link covers the whole card. */
export function PostCard({
  post,
  headingLevel: Heading = "h2",
  wide = false,
}: {
  post: Post;
  headingLevel?: "h2" | "h3";
  /** Two columns from large screens. */
  wide?: boolean;
}) {
  return (
    <article
      style={{ backgroundColor: post.color }}
      className={`tilt group relative flex h-full flex-col gap-5 p-4 pb-5 has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-ink has-[a:focus-visible]:outline-offset-3 sm:p-5 ${wide ? "[--tilt:-0.3deg] lg:grid lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-10 lg:p-8" : ""}`}
    >
      {/* The cover art, as a print stuck on the tile. */}
      <div
        className={`rotate-1 bg-sheet p-2 transition-[rotate] duration-200 group-hover:-rotate-1 ${wide ? "lg:-rotate-1 lg:p-3 lg:group-hover:rotate-0" : ""}`}
      >
        <PostImage
          src={post.image}
          alt=""
          eager={wide}
          sizes={
            wide
              ? "(max-width: 1023px) calc(100vw - 88px), 620px"
              : "(max-width: 639px) calc(100vw - 88px), (max-width: 1023px) calc(50vw - 80px), 330px"
          }
          className="aspect-16/9 h-auto w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <Heading
          className={`display wrap-break-word ${wide ? "text-[clamp(2rem,5vw,3.75rem)]" : "text-[2.125rem]"}`}
        >
          <Link
            href={`/post/${post.slug}/`}
            className="decoration-3 underline-offset-4 after:absolute after:inset-0 focus-visible:outline-none group-hover:underline"
          >
            {post.title}
          </Link>
        </Heading>
        <p className="line-clamp-3 text-[0.9375rem]">{post.description}</p>
        <PostMeta post={post} className={wide ? "mt-2" : "mt-auto pt-2"} />
      </div>
    </article>
  );
}
