// The only place that defines the bear. To swap the art, see docs/art-brief.md.

export const mascot = {
  /** Path under public/. A PNG or an SVG with a transparent background. */
  src: "/img/mascot/bear.svg",
  /** The art's own size (for an SVG, its viewBox). It sets the aspect ratio. */
  width: 1040,
  height: 1671,
  alt: "The Develobear mascot: a brown bear in a white T-shirt",
  /** The plain part of the shirt, as a share of the art. Text goes here. */
  shirt: { left: "17%", top: "35%", width: "66%", height: "35%" },
  /** The share of the height that peeks over the footer: head and some shirt. */
  headHeight: 0.42,
};
