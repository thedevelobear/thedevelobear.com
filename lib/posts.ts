// The only source of posts for pages, sitemap, feeds and metadata, so drafts are filtered here once.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

export type Tag = "code" | "design";

export type Post = {
  slug: string;
  /** File name in content/post without ".md"; it can differ from the slug. */
  file: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  tags: Tag[];
  /** Cover image, as a path under public/. */
  image: string;
  /** Flat colour behind the post. Ink text sits on it, so keep it light. */
  color: string;
  /** Minutes. */
  readingTime: number;
};

function readPost(fileName: string): Post | null {
  const { data, content } = matter(
    readFileSync(join(process.cwd(), "content/post", fileName), "utf8"),
  );
  if (data.draft) return null;

  for (const key of [
    "slug",
    "title",
    "description",
    "date",
    "tags",
    "image",
    "color",
  ]) {
    if (!data[key]) throw new Error(`${fileName}: missing "${key}"`);
  }
  if (!/^#[0-9a-f]{6}$/i.test(data.color)) {
    throw new Error(`${fileName}: "color" must look like "#ffc7c2"`);
  }

  return {
    slug: data.slug,
    file: fileName.replace(/\.md$/, ""),
    title: data.title,
    description: data.description,
    date: new Date(data.date).toISOString().slice(0, 10),
    tags: data.tags,
    image: data.image,
    color: data.color,
    readingTime: Math.ceil(content.trim().split(/\s+/).length / 220),
  };
}

/** Published posts, newest first. */
export function getPosts(): Post[] {
  return readdirSync(join(process.cwd(), "content/post"))
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readPost)
    .filter((post) => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "UTC",
});

/** "2020-10-29" as "29 October 2020". */
export function formatDate(date: string): string {
  return dateFormat.format(new Date(date));
}

/** Whether a YYYY-MM-DD date is more than two years before now. */
export function isOutdated(date: string, now = new Date()): boolean {
  const limit = new Date(date);
  limit.setUTCFullYear(limit.getUTCFullYear() + 2);
  return limit < now;
}
