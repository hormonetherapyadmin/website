import { defineConfig, devices } from "@playwright/test";

// A dedicated port so tests never hit another local dev server on 3000.
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

// Runs against the production build, so run `pnpm build` first.
export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
  },
});
