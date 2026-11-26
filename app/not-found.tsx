import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/Mascot";

export const metadata: Metadata = { title: "Page not found | Develobear" };

export default function NotFound() {
  return (
    <div className="bg-apricot pt-28 sm:pt-36">
      <div className="shell flex flex-col items-center text-center">
        <h1 className="display text-[clamp(4rem,11vw,8rem)] leading-[0.86]">
          This page isn’t here
        </h1>
        <p className="mt-6 max-w-md text-balance font-semibold text-xl">
          The address may be mistyped, or the page has moved. The articles are
          all still on the blog.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link href="/post/" className="button">
            Read the blog
          </Link>
          <Link href="/" className="big-link">
            Go to the home page
          </Link>
        </div>
        <Mascot
          sizes="(max-width: 479px) 80vw, 384px"
          className="mt-10 w-[80vw] max-w-96"
        >
          <span aria-hidden="true" className="text-[15cqw] leading-none">
            404
          </span>
        </Mascot>
      </div>
    </div>
  );
}
