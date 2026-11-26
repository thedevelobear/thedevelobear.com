import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { feedAlternates, person, sameAs } from "@/lib/seo";
import {
  colors,
  siteDescription,
  siteName,
  siteUrl,
  themeColor,
} from "@/lib/site";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
});

// Condensed headlines; optical sizing picks the display cut when large. Only
// weight 800 is used, so this is Google's latin file with that weight pinned and
// the opsz axis kept: 23 kB, where next/font/google can only serve all weights
// (58 kB). globals.css defines "Display Fallback".
// shortcut: latin only, add the latin-ext file if a heading ever needs it
// (lib/posts.test.ts fails first).
const bigShoulders = localFont({
  src: "../assets/BigShoulders-opsz-800.woff2",
  weight: "800",
  variable: "--font-big-shoulders",
  adjustFontFallback: false,
});

// No canonical here: the 404 page would inherit it.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
  alternates: { types: feedAlternates },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: {
      rel: "mask-icon",
      url: "/safari-pinned-tab.svg",
      color: colors.ink,
    },
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteName,
      description: siteDescription,
      inLanguage: "en-US",
      publisher: { "@id": person["@id"] },
    },
    { ...person, sameAs },
  ],
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${schibsted.variable} ${bigShoulders.variable}`}
    >
      <body>
        <a
          href="#main"
          className="button absolute! top-3 left-3 z-50 -translate-y-24 focus:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer />
        <JsonLd data={siteJsonLd} />
        {/* Their scripts only exist on Vercel. Elsewhere they would 404. */}
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
