import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { HumanOMaticCard, RewardsCard } from "@/components/ProjectCard";
import { humanOMatic, rewards } from "@/lib/projects";
import { breadcrumbs, pageMetadata, person } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "react-rewards, a React library for confetti and other micro-interactions, and human-o-matic, an MCP server for drum MIDI.",
  path: "/projects/",
});

const jsonLd = [
  { ...rewards, language: "TypeScript" },
  { ...humanOMatic, language: "Python" },
].map((project) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: project.name,
  description: project.pitch,
  url: `${siteUrl}/projects/`,
  codeRepository: project.links.github,
  programmingLanguage: project.language,
  author: person,
}));

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbs(["Projects", "/projects/"])} />
      <div className="bg-tan pt-32 pb-14 text-center sm:pt-40 sm:pb-20">
        <div className="shell">
          <h1 className="display text-[clamp(4.5rem,16vw,12rem)] leading-[0.86]">
            Projects
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance font-semibold text-xl">
            One makes buttons celebrate. The other makes programmed drums sound
            less robotic.
          </p>
        </div>
      </div>
      <RewardsCard headingLevel="h2" detailed />
      <HumanOMaticCard headingLevel="h2" detailed />
    </>
  );
}
