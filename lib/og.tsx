// The social card, drawn at build time. Font and art are local files: no network.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { mascot } from "./mascot";
import { ogSize } from "./seo";
import { colors, siteName } from "./site";

export async function ogImage(
  title: string,
  detail: string,
  color = colors.honey,
) {
  const [font, bear] = await Promise.all([
    readFile(join(process.cwd(), "assets/BigShoulders-Display-ExtraBold.ttf")),
    readFile(
      join(
        process.cwd(),
        "public/img/mascot",
        mascot.src.split("/").pop() ?? "",
      ),
    ),
  ]);
  const type = mascot.src.endsWith(".svg") ? "image/svg+xml" : "image/png";
  const bearWidth = 430;
  // next/og downloads emoji art from a CDN, so cards go without emoji.
  const text = title.replace(
    /\s*(?:\p{Extended_Pictographic}|\u{FE0F}|\u{200D})+/gu,
    "",
  );
  const fontSize =
    text.length > 65
      ? 70
      : text.length > 45
        ? 84
        : text.length > 30
          ? 100
          : 124;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        background: color,
        color: colors.ink,
        textTransform: "uppercase",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: 755,
          height: "100%",
          padding: "52px 0 48px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "6px 18px 10px",
            background: colors.ink,
            color: colors.sheet,
            fontSize: 44,
            lineHeight: 1,
            transform: "rotate(-4deg)",
          }}
        >
          {siteName}
        </div>
        <div style={{ display: "flex", fontSize, lineHeight: 0.98 }}>
          {text}
        </div>
        <div style={{ display: "flex", fontSize: 36 }}>{detail}</div>
      </div>
      {/* biome-ignore lint/performance/noImgElement: satori draws plain img only. */}
      <img
        src={`data:${type};base64,${bear.toString("base64")}`}
        alt=""
        width={bearWidth}
        height={Math.round((bearWidth * mascot.height) / mascot.width)}
        style={{ position: "absolute", right: 0, bottom: 0 }}
      />
    </div>,
    {
      ...ogSize,
      fonts: [{ name: "Big Shoulders", data: font, weight: 800 }],
    },
  );
}
