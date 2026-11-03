# NiñoWatch frontend

Next.js dashboard for sourced seasonal outlooks, verified news incidents,
Meta generated advisories, language previews, and moderated community evidence.

## Local development

Run the backend stack and migrations described in the sibling `nino_watch/README.md`.
Then run `npm install` and `npm run dev` here. The frontend calls
`http://localhost:8000` unless `NEXT_PUBLIC_API_URL` is set.

## Deployment

Set `NEXT_PUBLIC_API_URL` to the public HTTPS backend URL at build time.
Set the backend `CORS_ORIGINS` to this site's public origin. `npm run build`
checks the production build.

The globe lists sourced outlook areas; it does not present a country risk
score. Advisories in other languages are labeled machine previews and show
the English source. User reports enter a pending review queue before public
display. The broadcaster pack remains English until translations are reviewed.
