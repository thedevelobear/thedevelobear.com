import Link from "next/link";
import { nav, siteName } from "@/lib/site";

/** Sits on top of each page's colour block, which leaves room for it. */
export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="shell flex items-center justify-between gap-3 py-4 sm:py-6">
        <Link
          href="/"
          aria-label={`${siteName}, home`}
          className="flex min-h-11 shrink-0 items-center"
        >
          {/* logo.png is black, so it is used as a mask and painted in ink. */}
          <span className="aspect-1107/196 w-24 bg-ink [mask:url(/img/logo.png)_center/contain_no-repeat] min-[24rem]:w-28 sm:w-40 forced-colors:bg-[CanvasText]" />
        </Link>
        <nav aria-label="Main">
          <ul className="flex sm:gap-4">
            {nav.map(({ name, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="display inline-flex min-h-11 items-center px-1.5 text-lg decoration-3 min-[24rem]:px-2 min-[24rem]:text-[1.375rem] underline-offset-4 hover:underline sm:text-[1.75rem]"
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
