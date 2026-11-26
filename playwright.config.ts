import { defineConfig, devices } from "@playwright/test";

// BASE_URL points the suite at a deployed site. Without it, `next start` serves
// the local build on PORT (not 3000, which is often taken).
const deployed = process.env.BASE_URL;
const port = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: deployed ?? `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: devices["Desktop Chrome"] },
    // WebKit, so Safari's engine is covered too. HTTP-level checks run once.
    {
      name: "mobile",
      use: devices["iPhone 15"],
      testIgnore: "site.spec.ts",
    },
  ],
  webServer: deployed
    ? undefined
    : {
        command: `pnpm start --port ${port}`,
        url: `http://localhost:${port}`,
        // Never test whatever else happens to be listening.
        reuseExistingServer: false,
      },
});
