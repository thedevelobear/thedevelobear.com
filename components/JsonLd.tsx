import { jsonLdString } from "@/lib/seo";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: jsonLdString escapes "<".
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}
