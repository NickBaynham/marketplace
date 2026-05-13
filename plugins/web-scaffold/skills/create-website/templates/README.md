# {{site_name}}

{{tagline}}

- Live: https://{{domain}}
- API: https://{{api_domain}}
- Repo: {{github_repo}}

## Stack

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind + MDX. Deployed to AWS Amplify.
- **Backend:** FastAPI managed with pdm. Deployed to AWS App Runner.
- **Domain + TLS:** Route 53 hosted zone, ACM certificates issued by Amplify (frontend) and App Runner (backend).

## Local quickstart

```bash
make setup        # install frontend (npm) and backend (pdm) deps
make configure    # create frontend/.env.local and backend/.env from examples
make dev          # frontend on :3000, backend on :8000
```

Other Make targets: `make help`.

## Tests and CI

```bash
make ci   # lint + typecheck + test + build for both frontend and backend
```

GitHub Actions runs the same steps on every PR and on pushes to `main` / `develop`.

## Deployment

- **Frontend (Amplify):** push to GitHub; Amplify builds `frontend/.next` per [`amplify.yml`](./amplify.yml). Custom domain `{{domain}}` is attached in the Amplify console (Route 53 + ACM).
- **Backend (App Runner):** build the container in `backend/`, push to Amazon ECR, point App Runner at the image. Custom domain `{{api_domain}}` is attached in the App Runner console (Route 53 + ACM).

Full deploy instructions live in the plugin reference docs (`amplify-deploy.md`, `fastapi-backend.md`) under the `web-scaffold` plugin in the marketplace.

## Editing content

- `frontend/app/page.tsx` — landing
- `frontend/app/about/page.tsx` — about
- `frontend/app/contact/page.tsx` — contact (form posts to backend `/contact`)
- `frontend/content/blog/*.mdx` — blog posts
- `frontend/content/news/*.mdx` — news posts
- `docs/SITE.md` — high-level description of the site (drives copy generation)

## License

Private / all rights reserved unless otherwise noted.
