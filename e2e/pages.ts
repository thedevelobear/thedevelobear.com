import { getPosts } from "../lib/posts.ts";

export const posts = getPosts();

/** Every indexable page. site.spec.ts checks the sitemap lists exactly these. */
export const pages = [
  "/",
  "/post/",
  "/tags/code/",
  "/tags/design/",
  "/projects/",
  "/about/",
  ...posts.map((post) => `/post/${post.slug}/`),
];

export const missingPage = "/no-such-page/";
