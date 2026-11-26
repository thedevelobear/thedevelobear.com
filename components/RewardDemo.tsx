"use client";

import { useState } from "react";

// The page's own pinks, grey and near-black (see globals.css). Mostly darker
// than the section behind the button, so the burst shows.
const colors = ["#161616", "#ffc7c2", "#eda9a4", "#d29591", "#6d6d6d"];

// Imported on first interaction, so the page ships none of it up front.
const loadLibrary = () => import("react-rewards");

const preload = () => {
  loadLibrary().catch(() => {});
};

/** The real library, through fire(), which is what useReward calls for you. */
export function RewardDemo({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState("");

  async function run(origin: HTMLButtonElement) {
    try {
      const library = await loadLibrary();
      const { renderer } = library.fire(library.confetti, {
        origin,
        config: { colors },
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
    <div className={`flex flex-col gap-4 ${className}`}>
      <button
        type="button"
        onPointerEnter={preload}
        onFocus={preload}
        onClick={(event) => run(event.currentTarget)}
        className="button min-h-16! cursor-pointer px-10! text-3xl! active:scale-95"
      >
        Confetti
      </button>
      <output className="block min-h-11 max-w-xs text-sm">
        {status || "The other effects are in the docs."}
      </output>
    </div>
  );
}
