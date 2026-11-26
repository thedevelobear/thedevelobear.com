import type { MetadataRoute } from "next";
import { colors, siteDescription, siteName, themeColor } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    // Deliberately not installable: the old PWA is being retired.
    display: "browser",
    background_color: colors.paper,
    theme_color: themeColor,
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
