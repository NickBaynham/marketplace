# FastAPI backend deployment

Amplify Hosting does **not** run Python. The FastAPI service deploys separately. The recommended target is **AWS App Runner**: it accepts a container, gives you a public HTTPS endpoint, supports custom domains via Route 53 + ACM, and autoscales without an ALB.

The scaffolded project includes [`backend/Dockerfile`](../templates/backend/Dockerfile) ready for App Runner.

## App Runner (recommended)

### One-time setup

1. Push the project to GitHub. Make sure `backend/` builds cleanly with `docker build backend/`.
2. Open the [App Runner console](https://console.aws.amazon.com/apprunner/).
3. **Create service** → **Source: Container registry** *(or)* **Source code repository**.
   - **Container registry** (recommended): push the image to Amazon ECR first, then point App Runner at the ECR image. App Runner watches the ECR tag for updates.
   - **Source code**: connect GitHub and let App Runner build and deploy automatically on push (set the source directory to `backend/`).
4. Configure:
   - Port: `8000`
   - Health check path: `/health`
   - CPU: `0.25 vCPU`, Memory: `0.5 GB` to start.
   - Environment variables: see the list below.
5. Create the service. App Runner returns a default URL like `https://abc123.us-east-1.awsapprunner.com`.

### Environment variables

Set these in App Runner → **Configuration → Environment variables**:

- `APP_ENV` — `production`
- `CORS_ORIGINS` — `https://{{domain}},https://www.{{domain}}`
- `CONTACT_INBOX_EMAIL` — same value as the frontend
- `RESEND_API_KEY` — if the backend sends email
- `DATABASE_URL` — if you uncommented Postgres locally and provisioned RDS

### Custom domain + HTTPS

1. App Runner → service → **Custom domains** → **Link domain** → `{{api_domain}}`.
2. App Runner shows two CNAME records to add — one for the domain itself, one for ACM validation. If `{{domain}}` is in Route 53, add both records to the hosted zone. (App Runner does not auto-create Route 53 records the way Amplify does — copy them in manually.)
3. ACM provisions a certificate for `{{api_domain}}`. Wait for status to reach **Active** (usually under 10 minutes after DNS propagates).
4. The endpoint is now `https://{{api_domain}}` with valid HTTPS.

### Verifying

```bash
curl -sS https://{{api_domain}}/health
# {"status":"ok"}
```

Then submit the frontend contact form and confirm the POST reaches `{{api_domain}}/contact`.

## Alternatives

### ECS Fargate behind an ALB

Use this if you need:
- VPC isolation, private subnets, or other services in the same cluster.
- Custom networking (VPC peering, PrivateLink, etc.).
- Multiple containers per task or sidecars.

Cost is higher than App Runner because of the ALB. Setup: ECR image → ECS service → ALB target group → Route 53 alias to the ALB → ACM cert on the ALB listener (HTTPS).

### Lambda + API Gateway

Use this if traffic is bursty and low average — Lambda scales to zero. Tradeoffs:
- Requires an ASGI adapter ([Mangum](https://github.com/jordaneremieff/mangum) is the standard).
- Cold starts on FastAPI add 300–800 ms unless you provision concurrency.
- Long-running connections (SSE, WebSockets) need API Gateway WebSockets or a different transport.

Setup: package the FastAPI app with Mangum → upload to Lambda → API Gateway HTTP API → custom domain → Route 53 alias → ACM cert.

## Picking between them

| Scenario | Choice |
|---|---|
| Default starter, simple HTTP API, predictable traffic | **App Runner** |
| Need VPC, multiple services, or strict networking | **ECS Fargate** |
| Bursty/low traffic, latency-tolerant | **Lambda + API Gateway** |

## Troubleshooting

- **App Runner build fails on `pdm install`** — make sure the Dockerfile copies `pyproject.toml` and `pdm.lock` before running `pdm install --prod --no-editable`. The scaffolded Dockerfile does this; do not reorder.
- **CORS errors in the browser** — `CORS_ORIGINS` must list the exact frontend origin including scheme. No trailing slash.
- **Custom domain stuck "Pending"** — App Runner shows two CNAMEs; both must be added to the hosted zone. Recheck with `dig CNAME {{api_domain}}`.
- **`/health` returns 502** — App Runner kills the container if `/health` doesn't return 200 within the configured timeout. Bump the health check timeout or fix the handler.
