import Link from "next/link";
import { nav, socials } from "@/lib/site";
import { MascotHead } from "./Mascot";

export function Footer() {
  return (
    <footer className="mt-48 sm:mt-60">
      <div className="relative">
        {/* The bear peeks over the edge, to say what it isn't. */}
        <MascotHead className="absolute bottom-full left-1/2 w-44 -translate-x-1/2 sm:w-64" />
      </div>
      <div className="on-ink bg-ink text-honey">
        <div className="shell pt-16 pb-10 text-center sm:pt-24">
          <p className="display mx-auto max-w-4xl text-balance text-[clamp(3rem,7vw,6.5rem)]">
            I’m not a bear, just in case someone asks.
          </p>
          <ul className="mt-12 flex flex-wrap border-honey border-y-3">
            {socials.map(({ name, href }) => (
              <li key={name} className="grow basis-1/3 sm:basis-0">
                <a
                  href={href}
                  className="display block px-3 py-5 text-3xl hover:bg-honey hover:text-ink sm:text-4xl"
                >
                  {name === "RSS" ? "RSS feed" : name}
                </a>
              </li>
            ))}
          </ul>
          <nav aria-label="Footer" className="mt-14">
            <ul className="flex justify-center gap-6">
              {nav.map(({ name, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="display inline-block py-2 text-2xl decoration-3 underline-offset-4 hover:underline"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
