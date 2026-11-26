"use client";

import { useState } from "react";

const effects = [
  { id: "confetti", label: "Confetti" },
  { id: "emoji", label: "Emoji" },
  { id: "balloon", label: "Balloons" },
  { id: "firework", label: "Firework" },
  { id: "pop", label: "Pop" },
] as const;

type EffectId = (typeof effects)[number]["id"];

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
        config: id === "emoji" ? { emojis: ["🐻", "🍯", "✨"] } : undefined,
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
            className="display size-24 cursor-pointer rounded-full bg-sheet text-[1.5rem] text-ink transition-[rotate,scale] duration-150 even:rotate-6 odd:-rotate-6 hover:rotate-0 hover:scale-105 active:scale-90 data-[selected=true]:bg-honey sm:size-32 sm:text-[2rem]"
          >
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
