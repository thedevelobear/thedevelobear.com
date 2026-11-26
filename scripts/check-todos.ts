// Fails while any "[TODO:" placeholder is in the built pages or feeds.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = ".next/server/app";
const files = readdirSync(root, { recursive: true, encoding: "utf8" }).filter(
  (file) => /\.(html|body)$/.test(file),
);
// Guards against passing because there was nothing to scan.
if (!files.includes("about.html")) throw new Error("Run `pnpm build` first.");

let found = 0;
for (const file of files) {
  const text = readFileSync(join(root, file), "utf8");
  // The same text also sits in the page's script data, so report each once.
  for (const placeholder of new Set(text.match(/\[TODO:[^\]<"\\]*\]?/g))) {
    console.error(`${file}: ${placeholder}`);
    found++;
  }
}
if (found > 0) {
  console.error(`\n${found} unfilled placeholder(s).`);
  process.exit(1);
}
console.log(`No placeholders in ${files.length} built files.`);
