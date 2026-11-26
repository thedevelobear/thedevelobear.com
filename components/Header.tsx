import Image from "next/image";
import Link from "next/link";
import { nav } from "@/lib/site";

/** Sits on top of each page's colour block, which leaves room for it. */
export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="shell flex items-center justify-between gap-3 py-4 sm:py-6">
        <Link
          href="/"
          className="-rotate-4 block shrink-0 bg-ink px-2 py-2 transition-[rotate] hover:rotate-2 sm:px-3 sm:py-2.5"
        >
          <Image
            src="/img/logo.png"
            alt="Develobear, home"
            width={1107}
            height={196}
            sizes="(max-width: 639px) 112px, 160px"
            loading="eager"
            className="h-auto w-24 invert min-[24rem]:w-28 sm:w-40"
          />
        </Link>
        <nav aria-label="Main">
          <ul className="flex sm:gap-4">
            {nav.map(({ name, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="display inline-flex min-h-11 items-center px-1.5 text-xl decoration-3 min-[24rem]:px-2 min-[24rem]:text-[1.375rem] underline-offset-4 hover:underline sm:text-[1.75rem]"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
