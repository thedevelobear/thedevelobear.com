import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { formatDate, getPost, getPosts, isOutdated } from "@/lib/posts";
import { rewards } from "@/lib/projects";
import { breadcrumbs, pageMetadata, person } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { PostImage } from "@/mdx-components";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/post/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/post/${post.slug}/`,
    article: post,
  });
}

export default async function PostPage({ params }: PageProps<"/post/[slug]">) {
  const { slug } = await params;
  const posts = getPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) notFound();
  const post = posts[index];
  const neighbours = [
    { post: posts[index + 1], label: "Older article", align: "" },
    {
      post: posts[index - 1],
      label: "Newer article",
      align: "sm:col-start-2 sm:text-right",
    },
  ];
  const { default: Content } = await import(`@/content/post/${post.file}.md`);
  const path = `/post/${post.slug}/`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: `${siteUrl}${post.image}`,
    url: `${siteUrl}${path}`,
    mainEntityOfPage: `${siteUrl}${path}`,
    keywords: post.tags,
    inLanguage: "en-US",
    author: person,
    publisher: person,
    isPartOf: { "@id": `${siteUrl}/#website` },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbs(["Blog", "/post/"], [post.title, path])} />
      <article>
        <header
          style={{ backgroundColor: post.color }}
          className="pt-28 pb-32 sm:pt-36 sm:pb-44"
        >
          <div className="shell max-w-5xl! text-center">
            <ul aria-label="Topics" className="flex justify-center gap-3">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/tags/${tag}/`}
                    className="display on-ink inline-flex min-h-10 items-center bg-ink px-4 text-2xl text-sheet hover:text-honey"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
            <h1 className="display mt-6 wrap-break-word text-[clamp(2.375rem,10.5vw,5.5rem)] leading-[0.92] sm:text-[clamp(3.5rem,7.5vw,5.5rem)]">
              {post.title}
            </h1>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 font-semibold sm:gap-x-7">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <p>{post.readingTime} min read</p>
            </div>
          </div>
        </header>

        {/* The cover art, as a print laid across the edge of the colour. */}
        <div className="-mt-24 sm:-mt-32 mx-auto max-w-4xl px-4 sm:px-5">
          <div className="bg-sheet p-2 sm:p-3">
            <PostImage
              src={post.image}
              alt=""
              eager
              sizes="(max-width: 896px) calc(100vw - 48px), 832px"
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="mx-auto max-w-[44rem] px-5 pt-12 sm:pt-16">
          {isOutdated(post.date) && (
            <p className="mb-12 border-ink border-l-8 bg-sheet px-5 py-4 font-semibold">
              This is an older post, so some details may be outdated.
            </p>
          )}
          <div className="prose">
            <Content />
          </div>
          {path === rewards.links.post && (
            <p className="mt-12">
              <Link href="/projects/" className="big-link">
                Try the react-rewards live demo
              </Link>
            </p>
          )}
        </div>
      </article>

      <nav
        aria-label="More articles"
        className="mx-auto mt-20 grid max-w-4xl gap-6 px-5 sm:grid-cols-2"
      >
        {neighbours.map(
          (neighbour) =>
            neighbour.post && (
              <Link
                key={neighbour.label}
                href={`/post/${neighbour.post.slug}/`}
                style={{ backgroundColor: neighbour.post.color }}
                className={`group hover:-translate-x-1 hover:-translate-y-1 block p-6 transition-[translate,box-shadow] duration-150 hover:shadow-[0.5rem_0.5rem_0_var(--color-ink)] ${neighbour.align}`}
              >
                <span className="block font-semibold text-sm">
                  {neighbour.label}
                </span>
                <span className="display mt-2 block text-3xl decoration-3 underline-offset-4 group-hover:underline">
                  {neighbour.post.title}
                </span>
              </Link>
            ),
        )}
      </nav>
    </>
  );
}
