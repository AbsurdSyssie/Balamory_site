# Balamory Group Practice

An entirely fictional independent design demonstration. The owner requested Balamory, an invented Isle of Mull address, whimsical staff and local simulated request links. No real practice, clinicians, NHS endorsement, regulator identity or supplier account is represented. Original CSS artwork uses no television images or characters.

## Content and safety decisions

- One global fictional banner on every page including the error page; noindex metadata and deployment headers. Search exclusion is advisory, not access control.
- All home request cards and appointment, prescription, registration, test, fit-note, admin, complaints and telephone request links lead to `/online-requests/`. Its message is exactly `Your PATCHS/Accurx booking page here`. No forms, embeds, trackers or patient data.
- `1 Storybook Lane, Tobermory, Isle of Mull` is invented, not directions to a real building. No postcode or map. `01632 960042` is an Ofcom drama number, not dialled by request links. Z00001 is an internal fictional template identifier, not a Scottish ODS identity and not published.
- Scotland is accepted only in `demo: true`, not as general production support. NHS 24 telephone 111 and NHS inform replace English signposting. The real NHS App link is explicitly labelled England, not claimed to work for Scottish patients. No CQC widget or false Scottish equivalent is fabricated.
- Review dates describe fictional content review, not clinical approval. Accessibility limitations are stated; no unaudited compliance claim.

## Check and publish manually

```sh
npm ci
npm run lint
npm run check
npm test
npm run build
npm run lint:html
npm run build:demo
npm run lint:html:demo
npm run audit:demo
uvx reuse lint
npx wrangler pages deploy _preview --project-name balamory-site --branch main
```

Publish only clean `_preview`, not `_site`. A failed demo rebuild removes stale output first. No validation is relaxed by the preview configuration. Normal checks pass for this fictional site. Baseline England and Wales tests remain. Inherited GitHub publishing is removed; CI checks only, no GitHub Pages setup or automatic Cloudflare deployment.

Push only the new personal `AbsurdSyssie/Balamory_site` repository; upstream is read-only. Do not change HHC, Barlow, Didsbury or Range projects or domains. Only `balamory.oddtv.uk` is in scope. Attach it to the new Pages project before DNS changes. Read and privately back up exact-host records before writing; stop on permission failure. No wildcard, apex, mail or security changes. To undo, remove only this demo's custom domain/deployments and restore exact-host DNS only if actually changed and backed up.

## Not a production practice site

Real use needs confirmed identity, contact details, hours, catchment, staff and accessibility information; genuine supplier links; health board and complaints contacts; approved privacy notice and accessibility audit; closure and service arrangements; clinical safety and owner sign-off; practice-owned accounts; separately reviewed Scottish production support. Never just switch demo off.

## Verification and deployment, 1 November 2026

- Fresh clone at `/home/oscar/Documents/Code_Projects/Balamory_site`. New public repository: <https://github.com/AbsurdSyssie/Balamory_site>. `origin` is preserved with a disabled push URL; only `demo` is writable.
- New manually uploaded Cloudflare Pages project `balamory-site`, branch main, no Git integration. Public address: <https://balamory-site.pages.dev/>. Initial deployment: `c1173976.balamory-site.pages.dev`. Subsequent tested asset updates use the same project only.
- `balamory.oddtv.uk` is attached but not a working address: HTTPS returned 525. Exact-host DNS lookup returned 403, so no records could be backed up and no DNS change was attempted. All existing demos, wildcard/apex/mail records and zone security settings were untouched.
- To finish the hostname, privately save any existing exact `balamory` DNS records, then set only `balamory` to CNAME `balamory-site.pages.dev`. Check the project's custom-domain status and certificate, then verify HTTPS home, appointments, assets and noindex. Do not bypass certificate warnings. Until verified, use `.pages.dev`.
- Lint, practice checks, all 44 tests, normal and isolated demo builds, both HTML validators, demo audit, REUSE and whitespace checks pass. GitHub CI passed for the initial implementation. The expected demo warning remains. `npm ci` reported seven inherited moderate development-tool advisories; `npm audit --omit=dev` reported zero. Public hosting serves static files, not these tools. Do not use an unreviewed forced dependency upgrade as a shortcut.
- Seven core pages were browser-checked at 390×844, 768×1024 and 1440×900 with no horizontal overflow, missing urgent help or browser errors. Six home actions were clicked and reached the exact inert request message. Keyboard focus reaches the skip link visibly. Reduced-motion and 200% CSS zoom at 720px were checked; the task grid was corrected to reflow by available width. A 390px viewport with an additional 200% CSS zoom (195 effective CSS pixels, below the 320px reflow baseline) can still overflow. No full screen-reader/independent audit is claimed.
- The initial live byte check found Cloudflare redirects `/404.html` to `/404` with HTTP 308, rather than serving it directly. Verification follows that canonical redirect and separately checks a genuinely missing route returns 404 with the local error page. No security protection was disabled.
