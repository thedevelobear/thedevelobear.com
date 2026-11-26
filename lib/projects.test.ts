import assert from "node:assert/strict";
import test from "node:test";
import { getRewardsStats } from "./projects.ts";

test("live stats are null, so hidden, when a request fails", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: string) => {
    if (url.includes("github")) return new Response("{}", { status: 403 });
    throw new Error("offline");
  });
  assert.deepEqual(await getRewardsStats(), {
    stars: null,
    weeklyDownloads: null,
  });
});

test("one source can fail without hiding the other", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: string) =>
    url.includes("github")
      ? Response.json({ stargazers_count: 12 })
      : Response.json({ error: "not found" }),
  );
  assert.deepEqual(await getRewardsStats(), {
    stars: 12,
    weeklyDownloads: null,
  });
});
