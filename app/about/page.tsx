import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Mascot } from "@/components/Mascot";
import { SocialLinks } from "@/components/SocialLinks";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Develobear, who writes about front-end development and design and is the author of the react-rewards library.",
  path: "/about/",
});

const skills = [
  [
    "AI",
    "Multi-agent orchestration, GitHub Copilot, MCP servers, agent skills",
  ],
  ["Languages", "TypeScript, JavaScript, HTML, CSS"],
  [
    "Frontend",
    "React, Next.js, React Native, Expo, Redux, Zustand, TanStack Query, Tailwind CSS, shadcn/ui",
  ],
  [
    "Architecture",
    "Microfrontends (Module Federation), monorepos (Turborepo), design systems, design tokens, library development, accessibility",
  ],
  ["Testing", "Jest, Vitest, React Testing Library, Cypress, BrowserStack"],
  ["APIs", "REST, GraphQL, hypermedia-driven APIs, WebSockets"],
  [
    "Build and infrastructure",
    "Vite, Webpack, Rsbuild, Node.js, Docker, Azure, CI/CD, Nginx, Sentry, Datadog, EAS",
  ],
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbs(["About", "/about/"])} />
      <div className="bg-honey pt-32 sm:pt-40">
        <div className="shell">
          <h1 className="display text-center text-[clamp(4rem,11.4vw,8.75rem)] leading-[0.86]">
            About Develobear
          </h1>
          <div className="mt-12 grid items-end gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
            <div className="max-w-xl space-y-5 font-semibold text-xl lg:self-center lg:pb-24">
              <p>Hi, I’m Jakub Szewczyk.</p>
              <p>
                I’m a senior software engineer and tech lead in Wrocław,
                Poland, with more than a decade of experience building web and
                mobile apps, mostly with React, React Native and TypeScript.
              </p>
              <p>
                I write about front-end development and design, and I’m the
                author of{" "}
                <Link href="/projects/" className="text-link">
                  react-rewards
                </Link>
                .
              </p>
              <p>Also, I’m not a bear, just in case someone asks.</p>
            </div>
            <Mascot
              sizes="(max-width: 465px) 86vw, 520px"
              className="w-[86vw] max-w-100 justify-self-center lg:w-full lg:max-w-130"
            />
          </div>
        </div>
      </div>

      <div className="shell max-w-5xl! pt-14 sm:pt-20">
        <Section title="Experience">
          <div className="space-y-4">
            <p>
              I’ve worked as a tech lead, a senior software engineer and a team
              leader, building products for both web and mobile.
            </p>
            <p>
              As a tech lead, I guide the technical direction of front-end
              projects: planning architecture, turning business requirements
              into technical plans, and building shared libraries and tooling.
            </p>
            <p>
              As a senior software engineer, I’ve delivered complex applications
              and reusable libraries that other projects adopted. As a team
              leader, I ran a frontend and mobile department, mentored
              developers and set company-wide frontend standards.
            </p>
          </div>
        </Section>
        <Section title="Skills">
          <dl className="space-y-3">
            {skills.map(([group, list]) => (
              <div key={group}>
                <dt className="font-bold">{group}</dt>
                <dd>{list}</dd>
              </div>
            ))}
          </dl>
        </Section>
        <Section title="Projects">
          <p>
            <Link href="/projects/" className="text-link">
              react-rewards and human-o-matic
            </Link>
            : a React micro-interaction library, and an MCP server for drum
            MIDI.
          </p>
        </Section>
        <Section title="Contact">
          <p>
            For work enquiries, email{" "}
            <a href="mailto:thedevelobear@gmail.com" className="text-link">
              thedevelobear@gmail.com
            </a>
            .
          </p>
          <SocialLinks className="mt-3 -ml-3" />
        </Section>
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 border-ink py-10 first:pt-0 last:pb-0 md:grid-cols-[17rem_1fr] [&+&]:border-t-3">
      <h2 className="display text-[3.25rem]">{title}</h2>
      <div className="max-w-2xl text-lg">{children}</div>
    </section>
  );
}

function PostLink({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={`/post/${slug}/`} className="text-link">
      {children}
    </Link>
  );
}
