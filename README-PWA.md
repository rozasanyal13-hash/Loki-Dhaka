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
