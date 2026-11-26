// The only place that defines the bear. To swap the art, see docs/art-brief.md.

export const mascot = {
  /** Path under public/. A PNG or an SVG with a transparent background. */
  src: "/img/mascot/bear.svg",
  /** The art's own size (for an SVG, its viewBox). It sets the aspect ratio. */
  width: 968,
  height: 822,
  alt: "The Develobear mascot: a grinning black bear with an earring",
  /** The solid belly below the grin, as a share of the art. Light text goes here. */
  belly: { left: "15%", top: "56%", width: "70%", height: "15%" },
  /** The share of the height that shows the head down to below the grin. */
  headHeight: 0.56,
};
