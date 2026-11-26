import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Old Hugo URLs with no page of their own now. All permanent (308), one hop each.
const redirects = [
  ["/categories/", "/post/"],
  ["/tags/", "/post/"],
  ["/offline/", "/post/"],
  ["/page/:n(\\d+)/", "/post/"],
  ["/post/page/:n(\\d+)/", "/post/"],
  ["/tags/:tag(code|design)/page/:n(\\d+)/", "/tags/:tag/"],
  ["/tags/:tag(code|design)/index.xml", "/index.xml"],
  ["/tags/index.xml", "/index.xml"],
  ["/categories/index.xml", "/index.xml"],
].map(([source, destination]) => ({ source, destination, permanent: true }));

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // No nonce-based script CSP: it would force every page to render dynamically.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

// Syntax colours from the site's palette. All pass AA on ink.
const codeTheme = {
  name: "develobear",
  type: "dark",
  colors: { "editor.foreground": "#ebe8df", "editor.background": "#231f20" },
  tokenColors: Object.entries({
    "#aaa497": ["comment"],
    "#eaa965": ["keyword", "storage", "entity.name.tag"],
    "#f6dd86": ["string"],
    "#d6bd88": ["constant", "support", "variable.language"],
    "#efcf7e": ["entity.name", "support.function", "entity.other"],
    "#ebe8df": ["keyword.operator", "punctuation"],
  }).map(([foreground, scope]) => ({ scope, settings: { foreground } })),
};

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  // AVIF first: smaller than WebP, which matters for the LCP image on slow links.
  images: { formats: ["image/avif", "image/webp"] },
  redirects: async () => redirects,
  headers: async () => [
    { source: "/:path*", headers: securityHeaders },
    // The worker that retires the old one must never be served stale.
    {
      source: "/sw.js",
      headers: [{ key: "Cache-Control", value: "no-cache" }],
    },
  ],
  // The home page regenerates daily (live project stats), so the files it reads
  // at render time must ship with the server function.
  outputFileTracingIncludes: {
    "/": ["./content/post/*.md", "./public/img/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Plugins are strings with serialisable options because of Turbopack.
export default createMDX({
  extension: /\.mdx?$/,
  options: {
    // "detect" compiles .md as plain Markdown, so braces in prose stay literal.
    format: "detect",
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        {
          theme: codeTheme,
          // globals.css paints the block in the site's own ink.
          keepBackground: false,
          defaultLang: "plaintext",
        },
      ],
    ],
  },
})(nextConfig);
