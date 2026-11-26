// Project facts come from each repo's README. Live numbers are never hardcoded.

export const rewards = {
  name: "react-rewards",
  pitch:
    "Micro-interactions for React. Reward your users with confetti, emoji, balloons, fireworks or a pop of stars.",
  features: [
    "Draws with WebGL2, and falls back to Canvas 2D",
    "About 7.5 kB gzipped for useReward and confetti",
    "Built with TypeScript, for React 18 or later",
    "Stays quiet for people who prefer reduced motion",
  ],
  install: "npm install react-rewards",
  links: {
    docs: "https://thedevelobear.github.io/react-rewards/",
    github: "https://github.com/thedevelobear/react-rewards",
    npm: "https://www.npmjs.com/package/react-rewards",
    post: "/post/microinteractions/",
  },
};

export const humanOMatic = {
  name: "human-o-matic",
  pitch:
    "An MCP server that re-performs programmed drum MIDI section by section, steered by your answers.",
  features: [
    "117 drum libraries with 161 kits built in",
    "Written in Python",
    "Never writes over your input file",
    "The same session and seed always give the same file",
  ],
  links: {
    web: "https://human-o-matic.netlify.app/",
    github: "https://github.com/thedevelobear/human-o-matic",
  },
  /** Verbatim from the README, which notes that words and numbers depend on the song. */
  dialogue: [
    [
      "You",
      "Humanize ~/songs/song.mid. It's General MIDI, and I play it with Superior Drummer 3.",
    ],
    [
      "Agent",
      "Reading it as gm and writing for superior-drummer-3, I found 4 sections. A: bars 1 to 8, hats, 2 crash hits. B: bars 9 to 24, crash riding, half-time. C: bars 25 to 40, china riding, double kick. B repeats at bars 41 to 56. The snare has 34 soft notes, and bar 33 could be triplets or loose 16ths. Do these look right?",
    ],
    ["You", "Yes, the soft notes are ghosts. Bar 33 is triplets."],
    ["Agent", "What kind of drummer overall: tight and modern, or looser?"],
    ["You", "Tight, modern metal."],
    [
      "Agent",
      "What's the energy in bars 25 to 40 (china riding, double kick)?",
    ],
    ["You", "It's a breakdown, full power."],
    [
      "Agent",
      "Taking that as maximum energy, tight, little light and shade: kick about 121 to 127, backbeats 124 to 127, timing spread about 2.0 ms. It's in song-2.mid: drag it into the DAW and play from bar 25. Sound right?",
    ],
  ] as const,
};

/** Cached for a day. Any failure gives null, and the number is then hidden. */
async function getNumber(url: string, key: string): Promise<number | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const value = (await response.json())[key];
    return typeof value === "number" && value > 0 ? value : null;
  } catch {
    return null;
  }
}

export async function getRewardsStats() {
  const [stars, weeklyDownloads] = await Promise.all([
    getNumber(
      "https://api.github.com/repos/thedevelobear/react-rewards",
      "stargazers_count",
    ),
    getNumber(
      "https://api.npmjs.org/downloads/point/last-week/react-rewards",
      "downloads",
    ),
  ]);
  return { stars, weeklyDownloads };
}
