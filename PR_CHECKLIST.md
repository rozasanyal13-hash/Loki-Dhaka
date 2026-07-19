PR Merge Checklist

- [ ] `REACT_APP_LOKI_SECRET` repository secret added
- [ ] Firebase `NEXT_PUBLIC_*` values provided or placeholders accepted
- [ ] CI (GitHub Actions) passes for branch
- [ ] Manual testing of QR scan on a device completed
- [ ] PWA icons added to `public/icons/` for store screenshots
- [ ] Capacitor native build tested (Android/iOS) — signing keys ready
- [ ] Security review completed (HMAC secret handling, rate limiting)
- [ ] Changelog entry added

Notes:
- The server API uses an in-memory rate limiter — for multi-instance deployments use Redis or another central store.
- The current service worker is a simple precache generator; consider replacing with Workbox for advanced caching strategies.
