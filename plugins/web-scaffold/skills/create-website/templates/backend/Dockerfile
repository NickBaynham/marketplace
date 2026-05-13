# FastAPI backend container. Suitable for AWS App Runner (port 8000).
# Two-stage build: stage 1 resolves and installs into a venv with pdm; stage 2
# copies just the venv + source into a slim runtime image.

FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PDM_USE_VENV=1

RUN pip install --no-cache-dir pdm

WORKDIR /app

# Dependencies first so layer caching survives source changes.
COPY pyproject.toml pdm.lock* ./
RUN pdm venv create --with-pip /app/.venv \
 && pdm use -f /app/.venv \
 && pdm install --prod --no-editable --no-self

COPY src ./src

# Runtime stage
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:${PATH}" \
    PYTHONPATH="/app/src"

WORKDIR /app

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/src /app/src

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
