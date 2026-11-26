import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/Mascot";
import { PostCard } from "@/components/PostCard";
import { HumanOMaticCard, RewardsCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SocialLinks } from "@/components/SocialLinks";
import { TagTabs } from "@/components/TagTabs";
import { getPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Develobear: front-end, React and design blog",
  description: siteDescription,
  path: "/",
});

export default function HomePage() {
  const posts = getPosts();

  return (
    <>
      <div className="flex min-h-svh flex-col bg-honey pt-28 sm:pt-32">
        <div className="shell grid flex-1 content-between justify-items-center gap-y-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:content-stretch lg:gap-x-12">
          <div className="max-w-xl text-center lg:self-center lg:justify-self-start lg:pb-16 lg:text-left">
            <h1 className="display text-[clamp(3.75rem,7vw,6.5rem)] leading-[0.9]">
              Front-end, design and the odd bear pun.
            </h1>
            <p className="mx-auto mt-8 max-w-md font-semibold text-xl lg:mx-0">
              I’m Develobear. I write about JavaScript, React and interface
              design, and I made react-rewards.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 lg:justify-start">
              <li>
                <Link href="/projects/" className="big-link">
                  See my projects
                </Link>
              </li>
              <li>
                <Link href="/post/" className="big-link">
                  Read the blog
                </Link>
              </li>
            </ul>
            <SocialLinks className="mt-8 justify-center lg:-ml-3 lg:justify-start" />
          </div>
          <Mascot
            sizes="(max-width: 465px) 86vw, (max-width: 1279px) 400px, 520px"
            className="w-[86vw] max-w-100 self-end border-ink border-b-6 lg:w-[clamp(20rem,36vw,25rem)] lg:border-b-0 xl:w-[clamp(25rem,36vw,32.5rem)] xl:max-w-130"
          />
        </div>
      </div>

      <section aria-labelledby="projects" className="pt-20 sm:pt-28">
        <div className="shell pb-10">
          <SectionHeading id="projects" title="Projects">
            <Link href="/projects/" className="big-link">
              More about my projects
            </Link>
          </SectionHeading>
        </div>
        <RewardsCard headingLevel="h3" />
        <HumanOMaticCard headingLevel="h3" />
      </section>

      <section aria-labelledby="articles" className="shell pt-20 sm:pt-28">
        <SectionHeading id="articles" title="Articles">
          <TagTabs />
        </SectionHeading>
        <ul className="pile mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <li
              key={post.slug}
              className={index === 0 ? "sm:col-span-2 lg:col-span-3" : ""}
            >
              <PostCard post={post} headingLevel="h3" wide={index === 0} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
