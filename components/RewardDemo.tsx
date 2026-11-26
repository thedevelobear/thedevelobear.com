"use client";

import { useState } from "react";
import { Burst } from "./Burst";

const effects = [
  { id: "confetti", label: "Confetti" },
  { id: "emoji", label: "Emoji" },
  { id: "balloon", label: "Balloons" },
  { id: "firework", label: "Firework" },
  { id: "pop", label: "Pop" },
] as const;

type EffectId = (typeof effects)[number]["id"];

// The page's own yellows, oranges and greys (see globals.css).
const colors = ["#efcf7e", "#f6dd86", "#eaa965", "#bfa674", "#cbc6ba"];

// Imported on first interaction, so the page ships none of it up front.
const loadLibrary = () => import("react-rewards");

const preload = () => {
  loadLibrary().catch(() => {});
};

/** The real library, through fire(), which is what useReward calls for you. */
export function RewardDemo() {
  const [effect, setEffect] = useState<EffectId>("confetti");
  const [status, setStatus] = useState("");

  async function run(id: EffectId, origin: HTMLButtonElement) {
    setEffect(id);
    try {
      const library = await loadLibrary();
      const { renderer } = library.fire(library[id], {
        origin,
        config: id === "emoji" ? { emojis: ["🐻", "🍯", "✨"] } : { colors },
      });
      if (renderer) {
        setStatus(
          `Drawn with ${renderer === "webgl" ? "WebGL2" : "Canvas 2D"}.`,
        );
      } else {
        setStatus(
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "You prefer reduced motion, so react-rewards skipped the burst. That’s on purpose."
            : "This browser couldn’t draw the burst.",
        );
      }
    } catch {
      setStatus("The demo didn’t load. Check your connection and try again.");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <fieldset className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
        <legend className="sr-only">Fire a react-rewards effect</legend>
        {effects.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            data-selected={id === effect}
            onPointerEnter={preload}
            onFocus={preload}
            onClick={(event) => run(id, event.currentTarget)}
            className="group display relative isolate grid size-24 cursor-pointer place-items-center rounded-full text-[1.25rem] text-ink transition-[scale] duration-150 active:scale-90 sm:size-32 sm:text-[1.625rem]"
          >
            <Burst className="-z-10 absolute inset-0 size-full fill-sheet transition-[rotate] duration-300 group-hover:rotate-12 group-data-[selected=true]:fill-honey" />
            {label}
          </button>
        ))}
      </fieldset>
      <output className="block min-h-11 text-center font-semibold text-sm">
        {status ||
          "Pick an effect. The library loads when you first reach for it."}
      </output>
      <figure className="on-ink overflow-hidden bg-ink text-sheet">
        <figcaption className="px-5 pt-4 font-bold text-honey text-sm">
          In your app
        </figcaption>
        <pre
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be reachable by keyboard.
          tabIndex={0}
          className="overflow-x-auto px-5 py-3 text-[0.8125rem] leading-relaxed"
        >
          <code>
            {`const ref = useRef(null);
const { reward } =
  useReward(ref, ${effect});

<button
  ref={ref}
  onClick={() => reward()}
>
  Reward me
</button>`}
          </code>
        </pre>
      </figure>
    </div>
  );
}
