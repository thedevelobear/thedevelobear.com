import { socials } from "@/lib/site";
import { socialIcons } from "./Icons";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-1 ${className}`}>
      {socials.map(({ name, href }) => (
        <li key={name}>
          <a
            href={href}
            aria-label={name === "RSS" ? "RSS feed" : name}
            className="grid size-11 place-items-center rounded-full text-ink hover:bg-ink hover:text-sheet"
          >
            {socialIcons[name]}
          </a>
        </li>
      ))}
    </ul>
  );
}
