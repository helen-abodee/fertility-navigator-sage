import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npx next dev -p 3100",
    port: 3100,
    reuseExistingServer: true,
    timeout: 120000,
  },
  use: {
    baseURL: "http://localhost:3100",
    viewport: { width: 390, height: 844 },
  },
});
