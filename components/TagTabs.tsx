import Link from "next/link";
import type { Tag } from "@/lib/posts";

const tabs = [
  { id: "all", label: "All", href: "/post/" },
  { id: "code", label: "Code", href: "/tags/code/" },
  { id: "design", label: "Design", href: "/tags/design/" },
] as const;

/** Tabs that are plain links. The selected one gets an ink sticker. */
export function TagTabs({
  selected = "all",
  isCurrentPage = false,
}: {
  selected?: Tag | "all";
  /** True when the selected tab links to the page it is on. */
  isCurrentPage?: boolean;
}) {
  return (
    <nav aria-label="Article topics">
      <ul className="flex gap-1 sm:gap-3">
        {tabs.map(({ id, label, href }) => (
          <li key={id}>
            <Link
              href={href}
              aria-current={
                id === selected ? (isCurrentPage ? "page" : "true") : undefined
              }
              className="display inline-flex min-h-12 min-w-20 items-center justify-center px-4 text-3xl decoration-3 underline-offset-4 hover:underline aria-[current]:-rotate-3 aria-[current]:bg-ink aria-[current]:text-sheet aria-[current]:no-underline"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
