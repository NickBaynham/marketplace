# TODO

Outstanding work and ideas. Edit freely.

## Setup

- [ ] Push the repo to GitHub at `{{github_repo}}`.
- [ ] Run `make setup`, then commit `frontend/package-lock.json` and `backend/pdm.lock` so CI runs are reproducible.
- [ ] Create the Route 53 hosted zone for `{{domain}}` (if not already created).
- [ ] Connect the repo in AWS Amplify. When the console asks for the monorepo "App root", enter `frontend`. Attach `{{domain}}`.
- [ ] Build the backend image (`make build-backend`), push to Amazon ECR, and create an App Runner service from it. Attach `{{api_domain}}`.
- [ ] Set environment variables in Amplify and App Runner (see `frontend/.env.example` and `backend/.env.example`).

## Content

- [ ] Flesh out `docs/SITE.md` with the actual story.
- [ ] Replace landing-page placeholder copy.
- [ ] Replace about-page placeholder copy.
- [ ] Replace or remove the example blog post (`frontend/content/blog/welcome.mdx`).
- [ ] Replace or remove the example news post (`frontend/content/news/launch.mdx`).
- [ ] Add a real favicon (`frontend/app/icon.svg` or `icon.png`) and apple-touch-icon.

## Features (ideas)

- [ ] Configure analytics: set `NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible` or `posthog` in Amplify env.
- [ ] RSS feed for blog and news.
- [ ] Search across posts.
- [ ] Newsletter signup (Resend audiences or ConvertKit).
