import type { Post, Tag } from "@/lib/posts";
import { PostCard } from "./PostCard";
import { TagTabs } from "./TagTabs";

const colors = { all: "bg-stone", code: "bg-tan", design: "bg-apricot" };

/** The /post/ and /tags/* pages: a title block, a wide lead card, then a grid. */
export function PostList({
  title,
  posts,
  tag = "all",
}: {
  title: string;
  posts: Post[];
  tag?: Tag | "all";
}) {
  return (
    <>
      <div className={`${colors[tag]} pt-32 pb-10 text-center sm:pt-40`}>
        <div className="shell flex flex-col items-center gap-8">
          <h1 className="display text-[clamp(4rem,13vw,9.5rem)] leading-[0.88]">
            {title}
          </h1>
          <TagTabs selected={tag} isCurrentPage />
        </div>
      </div>
      <ul className="shell pile mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <li
            key={post.slug}
            className={index === 0 ? "sm:col-span-2 lg:col-span-3" : ""}
          >
            <PostCard post={post} wide={index === 0} />
          </li>
        ))}
      </ul>
    </>
  );
}
