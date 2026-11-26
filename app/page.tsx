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
      <div className="flex min-h-svh flex-col bg-pink pt-28 sm:pt-32">
        {/* Two halves of the whole banner. The text half is capped at half the
            shell, so it stays in line with the header. */}
        <div className="grid flex-1 content-between justify-items-center gap-y-12 lg:grid-cols-2 lg:content-stretch">
          <div className="w-full max-w-152 px-5 text-center lg:self-center lg:justify-self-end lg:pb-16 lg:text-left">
            <h1 className="display text-[clamp(3.75rem,6.5vw,6rem)] leading-[0.9]">
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
            sizes="(max-width: 487px) 78vw, (max-width: 1023px) 380px, (max-width: 1279px) 336px, 400px"
            className="w-[78vw] max-w-95 self-end lg:mb-12 lg:w-[clamp(15rem,calc((100svh-12rem)*0.622),21rem)] lg:self-center xl:w-[clamp(15rem,calc((100svh-12rem)*0.622),25rem)] xl:max-w-100"
          />
        </div>
      </div>

      <section aria-labelledby="projects" className="bg-rose py-20 sm:py-28">
        <div className="shell">
          <SectionHeading id="projects" title="Projects">
            <Link href="/projects/" className="big-link">
              More about my projects
            </Link>
          </SectionHeading>
          <div className="mt-10 grid gap-7 lg:grid-cols-2">
            <RewardsCard headingLevel="h3" />
            <HumanOMaticCard headingLevel="h3" />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="articles"
        className="bear-room bg-mauve pt-20 sm:pt-28"
      >
        <div className="shell">
          <SectionHeading id="articles" title="Articles">
            <TagTabs />
          </SectionHeading>
          <ul className="pile mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <li
                key={post.slug}
                className={index === 0 ? "sm:col-span-2 lg:col-span-3" : ""}
              >
                <PostCard post={post} headingLevel="h3" wide={index === 0} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
