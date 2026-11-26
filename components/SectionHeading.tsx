import type { ReactNode } from "react";

/** A huge title, with an optional control on the right. */
export function SectionHeading({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
      <h2
        id={id}
        className="display text-[clamp(4rem,12vw,8rem)] leading-[0.85]"
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
