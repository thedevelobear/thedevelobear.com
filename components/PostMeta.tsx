import { formatDate, type Post } from "@/lib/posts";

export function PostMeta({
  post,
  className = "",
}: {
  post: Post;
  className?: string;
}) {
  return (
    <p
      className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-semibold text-sm ${className}`}
    >
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span>{post.readingTime} min read</span>
    </p>
  );
}
