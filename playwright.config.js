// Minimal Playwright config for CI
module.exports = {
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  timeout: 30_000,
  retries: 0,
}
