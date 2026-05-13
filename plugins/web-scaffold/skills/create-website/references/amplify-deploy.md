# AWS Amplify Hosting for the Next.js frontend

Amplify Hosting runs the full Next.js runtime (App Router, SSR, ISR) without requiring a static export. The scaffolded project already includes [`amplify.yml`](../templates/frontend/amplify.yml).

## Connect the repo

1. Push the project to GitHub.
2. Open the [AWS Amplify console](https://console.aws.amazon.com/amplify/).
3. **Create new app** → **Host web app** → **GitHub**, authorize AWS, select the repo.
4. Pick branches:
   - `main` → production
   - `develop` → staging (add as a second Amplify branch or a second app)
   - Feature branches → enable **Pull request previews** for ephemeral URLs.
5. Amplify detects **Next.js**; confirm the build settings point at `amplify.yml` at the repo root. The `baseDirectory` in `amplify.yml` is set to `frontend/.next` because the project is a monorepo with `frontend/` and `backend/` side by side.

## Environment variables

In Amplify → **App settings → Environment variables**, set the same `NEXT_PUBLIC_*` keys as in `frontend/.env.example`. The important ones:

- `NEXT_PUBLIC_SITE_URL` — `https://{{domain}}`
- `NEXT_PUBLIC_API_BASE_URL` — `https://{{api_domain}}`

Server-only (no `NEXT_PUBLIC_` prefix) — set in Amplify, never commit:

- `RESEND_API_KEY` (optional, for the contact form to send email via Resend)
- `CONTACT_INBOX_EMAIL`
- `RESEND_FROM_EMAIL` (optional)

Redeploy after changing any environment variable.

## Custom domain and HTTPS

1. Amplify → **Hosting → Custom domains** → **Add domain** → `{{domain}}`.
2. If `{{domain}}` is already in Route 53, Amplify offers to manage the records automatically. Accept that — it creates the `A`/`AAAA` alias and the CNAME records for domain verification.
3. Amplify provisions an **ACM certificate** for the Amplify-managed distribution. HTTPS is on by default; HTTP redirects to HTTPS automatically.
4. Add `www.{{domain}}` if you want it; Amplify will issue a redirect from `www` to apex (or the other way) per the console option.

If the domain is **not** yet in Route 53:

1. Create a public hosted zone for `{{domain}}` in Route 53.
2. Update the registrar's nameservers to the four assigned by Route 53.
3. Wait for DNS to propagate, then add the domain in Amplify.

## Branch model

| Branch | Target |
|---|---|
| `main` | Production — `{{domain}}` |
| `develop` | Staging — `staging.{{domain}}` or Amplify branch URL |
| Feature / PR | PR previews (enable in Amplify) |

## Verifying

1. Push to `main` — Amplify build should run automatically.
2. Watch the build in **Hosting → Builds**. The artifact directory is `frontend/.next`.
3. After deploy, visit `https://{{domain}}`. Check:
   - HTTPS is active and the certificate is valid.
   - `/`, `/about`, `/blog`, `/news`, `/contact` all load.
   - Contact form submission reaches `{{api_domain}}/contact` (see [`fastapi-backend.md`](./fastapi-backend.md) for backend deploy).

## Troubleshooting

- **Build can't find `package.json`** — confirm `appRoot: frontend` in `amplify.yml` and the Amplify console **App settings → Build settings → monorepo configuration**.
- **404 on routes that exist locally** — Amplify cached a prior static export; clear the cache from the Amplify console and trigger a rebuild.
- **Domain stuck at "Pending verification"** — Route 53 hosted zone nameservers do not match the registrar; fix at the registrar.
