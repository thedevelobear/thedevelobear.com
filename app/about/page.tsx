import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Mascot } from "@/components/Mascot";
import { SocialLinks } from "@/components/SocialLinks";
import { Todo } from "@/components/Todo";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Develobear, who writes about front-end development and design and is the author of the react-rewards library.",
  path: "/about/",
});

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
              <p>
                Hi, I’m <Todo>your name, as you want recruiters to see it</Todo>
                , known online as Develobear.
              </p>
              <p>
                <Todo>
                  your current role and where you are based. The old page said
                  front-end developer from Wrocław, Poland: confirm or correct
                  it
                </Todo>
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
          <p>
            <Todo>
              roles, newest first, each with company, dates and one or two
              things you delivered
            </Todo>
          </p>
        </Section>
        <Section title="Skills">
          <p>
            <Todo>
              the languages, frameworks and tools you want to be hired for
            </Todo>
          </p>
          <p className="mt-4">
            Meanwhile, my articles show some of what I’ve worked with:{" "}
            <PostLink slug="5-things-to-improve-performance">
              React performance
            </PostLink>
            ,{" "}
            <PostLink slug="logging-and-debugging">
              JavaScript debugging
            </PostLink>
            ,{" "}
            <PostLink slug="react-three-fibear">
              3D with react-three-fiber
            </PostLink>
            ,{" "}
            <PostLink slug="styling-cognito-verification-email">
              AWS Cognito with Lambda
            </PostLink>{" "}
            and{" "}
            <PostLink slug="modern-ui-with-memphis-design">
              interface design
            </PostLink>
            .
          </p>
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
            <Todo>
              your email address, or how you want to be contacted about work
            </Todo>
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
    <section className="grid gap-4 border-ink border-dashed py-10 first:pt-0 last:pb-0 md:grid-cols-[17rem_1fr] [&+&]:border-t-3">
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
