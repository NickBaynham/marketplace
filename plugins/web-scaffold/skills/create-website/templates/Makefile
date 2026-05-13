# {{site_name}} — local workflows
# Requires: Node.js 20+, npm, Python 3.12+, pdm, Docker (for local infra)

.DEFAULT_GOAL := help

.PHONY: help setup setup-frontend setup-backend configure dev dev-frontend dev-backend \
        lint lint-frontend lint-backend typecheck typecheck-frontend typecheck-backend \
        test test-frontend test-backend build build-frontend build-backend \
        docker-up docker-down ci deploy-check clean distclean

help: ## Show all Make targets
	@printf "\n{{site_name}} — Make targets\n\n"
	@grep -E '^[a-zA-Z][a-zA-Z0-9_-]*:.*##' Makefile | sort | sed 's/:.*## /  ->  /'

# ---- setup ----

setup: setup-frontend setup-backend ## Install all dependencies (frontend + backend)

setup-frontend: ## npm install in frontend/
	cd frontend && npm install

setup-backend: ## pdm install in backend/
	cd backend && pdm install -G dev

configure: ## Copy .env.example files to .env / .env.local where missing
	@if [ ! -f frontend/.env.local ]; then cp frontend/.env.example frontend/.env.local; \
		echo "Created frontend/.env.local"; \
	else echo "frontend/.env.local already exists"; fi
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env; \
		echo "Created backend/.env"; \
	else echo "backend/.env already exists"; fi

# ---- run ----

dev: ## Run frontend (:3000) and backend (:8000) together
	@$(MAKE) -j 2 dev-frontend dev-backend

dev-frontend: ## Next.js dev server on http://localhost:3000
	cd frontend && npm run dev

dev-backend: ## FastAPI dev server on http://localhost:8000
	cd backend && pdm run dev

# ---- quality ----

lint: lint-frontend lint-backend ## ESLint + ruff
lint-frontend: ; cd frontend && npm run lint
lint-backend:  ; cd backend  && pdm run lint

typecheck: typecheck-frontend typecheck-backend ## tsc + mypy
typecheck-frontend: ; cd frontend && npm run typecheck
typecheck-backend:  ; cd backend  && pdm run typecheck

test: test-frontend test-backend ## vitest + pytest
test-frontend: ; cd frontend && npm run test
test-backend:  ; cd backend  && pdm run test

# ---- build ----

build: build-frontend build-backend ## Production build (frontend) + image build (backend)
build-frontend: ; cd frontend && npm run build
build-backend:  ; docker build -t {{site_name_slug}}-backend:local backend

# ---- local infra ----

docker-up: ## Start local infra defined in docker-compose.yml
	docker compose up -d

docker-down: ## Stop local infra
	docker compose down

# ---- ci + deploy ----

ci: lint typecheck test build ## What CI runs (mirrors .github/workflows/ci.yml)

deploy-check: ci ## Verify the project is ready to deploy (no AWS calls)
	@echo "deploy-check: OK"
	@echo "Frontend: push to GitHub; Amplify auto-deploys (see plugin reference: amplify-deploy.md)."
	@echo "Backend:  push backend image to ECR; App Runner auto-deploys (see plugin reference: fastapi-backend.md)."

# ---- cleanup ----

clean: ## Remove frontend build output
	rm -rf frontend/.next

distclean: clean ## Full reset (node_modules, .venv, .pdm-build, etc.)
	rm -rf frontend/node_modules backend/.venv backend/.pdm-build backend/__pypackages__
