PWA and Capacitor notes

- Placeholder icons are referenced in `public/manifest.json` under `/icons/`.
- Add actual app icons to `public/icons/icon-192.png` and `public/icons/icon-512.png` before store builds.
- To scaffold Capacitor (manual steps):

  ```bash
  npm install --save @capacitor/core @capacitor/cli
  npx cap init "LokiSecureQR" com.example.loki
  npx cap add android
  npx cap add ios
  ```

Notes for Capacitor builds
- After running `npx cap add android` or `ios`, open the native project in Android Studio / Xcode to complete signing and configuration.
- Build the web assets with `npm run build` or `next build && next export` to generate a `out` folder matching `capacitor.config.json` `webDir`.
- For CI native builds, you'll need to provide signing keys (Android keystore, Apple provisioning profiles) as secrets on the build server.

Playwright E2E notes
- CI now includes an `e2e` job which runs `npx playwright test`. It starts the built app on port 3000 and runs tests against `http://localhost:3000`.
- Playwright requires browsers; CI installs them automatically using `npx playwright install --with-deps`.


