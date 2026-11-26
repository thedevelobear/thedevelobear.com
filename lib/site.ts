/** www is canonical; the apex redirects to it. */
export const siteUrl = "https://www.thedevelobear.com";
export const siteName = "Develobear";
export const siteDescription =
  "Develobear’s blog and portfolio: articles on JavaScript, React and interface design, plus react-rewards and human-o-matic.";
/** Shared with app/globals.css, for places that can't read CSS. */
export const colors = {
  ink: "#231f20",
  paper: "#ebe8df",
  sheet: "#f8f5ea",
  honey: "#efcf7e",
};
export const themeColor = colors.honey;
export const twitterHandle = "@thedevelobear";

export const socials = [
  { name: "GitHub", href: "https://github.com/thedevelobear" },
  { name: "X", href: "https://x.com/thedevelobear" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/jakub-szewczyk" },
  { name: "Medium", href: "https://medium.com/@thedevelobear" },
  { name: "RSS", href: "/index.xml" },
] as const;

export const nav = [
  { name: "Blog", href: "/post/" },
  { name: "Projects", href: "/projects/" },
  { name: "About", href: "/about/" },
] as const;
