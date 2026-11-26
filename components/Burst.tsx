/** The corners of a serrated sticker, as SVG polygon points around 0,0. */
const burstPoints = Array.from({ length: 64 }, (_, i) => {
  const angle = (i * Math.PI) / 32;
  const radius = i % 2 ? 45.5 : 50;
  const point = [Math.cos(angle) * radius, Math.sin(angle) * radius];
  return point.map((n) => n.toFixed(2)).join(",");
}).join(" ");

/** A serrated sticker to put things on. Takes its colour from `fill-*`. */
export function Burst({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="-50 -50 100 100" className={className}>
      <polygon points={burstPoints} />
    </svg>
  );
}
