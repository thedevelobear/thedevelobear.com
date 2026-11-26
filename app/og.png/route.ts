// The default social card. A real file extension avoids a trailing-slash redirect.
import { ogImage } from "@/lib/og";

export const dynamic = "force-static";

export function GET() {
  return ogImage(
    "Front-end, design and the odd bear pun.",
    "thedevelobear.com",
  );
}
