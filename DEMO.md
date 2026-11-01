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

Deployment and visual verification records will be appended after publishing.
