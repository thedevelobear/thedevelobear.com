import type { Metadata } from "next";
import { siteName, siteUrl, socials, twitterHandle } from "./site.ts";

/** Fits search snippets: whole sentences if possible, else whole words. */
export function metaDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const sentences = cut.match(/^.*[.!?](?= )/)?.[0];
  if (sentences && sentences.length >= 70) return sentences;
  const words = cut.slice(0, cut.lastIndexOf(" "));
  return `${words.replace(/[\s,;:.–—-]+$/, "")}…`;
}

export const ogSize = { width: 1200, height: 630 };

export const feedAlternates = {
  "application/rss+xml": [{ url: "/index.xml", title: siteName }],
};

/** Next merges metadata shallowly, so every page gets the whole set from here. */
export function pageMetadata({
  title,
  description,
  path,
  article,
}: {
  title: string;
  description: string;
  path: string;
  /** Posts have a social card of their own at <path>og.png. */
  article?: { date: string; tags: string[] };
}): Metadata {
  const summary = metaDescription(description);
  const image = {
    url: article ? `${path}og.png` : "/og.png",
    ...ogSize,
    type: "image/png",
    alt: article ? title : siteName,
  };
  const shared = {
    title,
    description: summary,
    url: path,
    siteName,
    locale: "en_US",
    images: [image],
  };
  return {
    title: path === "/" ? title : `${title} | ${siteName}`,
    description: summary,
    alternates: { canonical: path, types: feedAlternates },
    openGraph: article
      ? {
          ...shared,
          type: "article",
          publishedTime: article.date,
          authors: [`${siteUrl}/about/`],
          tags: article.tags,
        }
      : { ...shared, type: "website" },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      creator: twitterHandle,
      images: [image],
    },
  };
}

export const person = {
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: siteName,
  url: `${siteUrl}/about/`,
};

export const sameAs = socials
  .map(({ href }) => href)
  .filter((href) => href.startsWith("https://"));

/** A BreadcrumbList from [name, path] pairs below the home page. */
export function breadcrumbs(...trail: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"], ...trail].map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${siteUrl}${path}`,
    })),
  };
}

/** JSON for a script tag: "<" is escaped so no value can close the tag. */
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
