import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
const cached = `${homedir()}/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`;
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync(cached) ? cached : undefined);
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npm run start",
      url: "http://localhost:3000",
      reuseExistingServer: true,
      timeout: 60000,
    },
    {
      command:
        "node --require ./tests/mock-email-provider.cjs node_modules/next/dist/bin/next start --port 3001",
      url: "http://localhost:3001",
      reuseExistingServer: false,
      timeout: 60000,
      env: {
        VALORE_TEST_PROVIDER: "1",
        RESEND_API_KEY: "test-only-not-a-credential",
        EMAIL_FROM: "test@example.com",
        EMAIL_TO: "owner@example.com",
        ALLOW_LOCAL_TEST_FORMS: "true",
      },
    },
  ],
});
