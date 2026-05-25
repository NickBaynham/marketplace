# k6 Performance Plugin — Design

Date: 2026-05-25
Status: Approved (pending spec review)
Plugin name: `k6-performance`
Repository location: `plugins/k6-performance/`

## 1. Purpose

Ship a Claude Code plugin that helps authors produce idiomatic, threshold-gated k6 performance test scripts. The plugin is opinionated about the five core Grafana k6 load profiles (smoke, average load, stress, spike, soak) and writes scripts under `performance/k6/` in the target project.

The plugin does authoring only. It does not run scripts, parse results, scaffold a runtime environment, or convert OpenAPI/Postman/HAR to k6. Those are explicit non-goals for the 0.1.0 release.

## 2. Deliverables

| Surface | Path | Purpose |
|---|---|---|
| Plugin manifest | `plugins/k6-performance/.claude-plugin/plugin.json` | Plugin metadata |
| README | `plugins/k6-performance/README.md` | What ships, how to use |
| Changelog | `plugins/k6-performance/CHANGELOG.md` | Release notes |
| Skill | `plugins/k6-performance/skills/write-k6-script/SKILL.md` | Workflow and decision tree |
| Skill references | `plugins/k6-performance/skills/write-k6-script/references/*.md` | Reusable knowledge |
| Skill templates | `plugins/k6-performance/skills/write-k6-script/templates/*.js` | Starter scripts |
| Slash command | `plugins/k6-performance/commands/k6-script.md` | `/k6-script <description>` entry point |
| Sub-agent | `plugins/k6-performance/agents/k6-author.md` | Delegable authoring agent |
| Marketplace README row | `CLAUDE.md` table at repo root | Discoverability |

## 3. Plugin layout

```
plugins/k6-performance/
├── .claude-plugin/
│   └── plugin.json
├── README.md
├── CHANGELOG.md
├── agents/
│   └── k6-author.md
├── commands/
│   └── k6-script.md
└── skills/
    └── write-k6-script/
        ├── SKILL.md
        ├── references/
        │   ├── load-profiles.md
        │   ├── thresholds.md
        │   ├── metrics.md
        │   ├── scenarios.md
        │   ├── lifecycle.md
        │   └── data.md
        └── templates/
            ├── smoke.js
            ├── average-load.js
            ├── stress.js
            ├── spike.js
            └── soak.js
```

## 4. Skill workflow (`write-k6-script`)

`SKILL.md` runs this decision flow when invoked.

1. **Identify the target.** Service or URL, endpoint(s), expected traffic mix. Ask if unknown.
2. **Identify the load profile.** One of `smoke`, `average-load`, `stress`, `spike`, `soak`. If the user does not know, recommend `smoke` first, then `average-load`.
3. **Identify SLOs.** P95/P99 latency targets, error-rate ceiling, throughput floor. These become `thresholds` in the script. If not provided, use sensible defaults and flag them as placeholders in a top-of-file comment.
4. **Pick output path.** Default `performance/k6/<profile>/<name>.js`. Create the directory if missing.
5. **Generate.** Start from the matching template under `templates/`. Customize base URL, endpoints, scenarios, thresholds, and any data setup. Add a header comment block with purpose, profile, SLOs, and how to run.
6. **Print the run command.** `k6 run performance/k6/<profile>/<name>.js` plus the official Docker form (`docker run --rm -i grafana/k6 run - <script.js`). No runner scripts are written.

### Hard rules baked into the skill

- Always include `thresholds`. A k6 script without pass/fail gates is not a real test.
- Never use sleeps to mask issues. Use realistic think time only where it models user behavior.
- Default to `scenarios` (executor-based config). Do not use legacy top-level `vus`/`duration`.
- Use `SharedArray` for any data file read in init context.
- No emojis in scripts, comments, or console output.

## 5. References

One Markdown file per topic. Each is short, scannable, and link-friendly so the skill can pull only what is relevant.

- **load-profiles.md** — The five Grafana k6 profiles. For each: when to use, typical shape (`stages` array), typical duration, what it is looking for (functional sanity, baseline behavior, breaking point, recovery, memory leaks). Includes a "which profile do I want" decision table.
- **thresholds.md** — Threshold syntax (`http_req_failed`, `http_req_duration{...}`, custom-metric thresholds), `abortOnFail`, tag-scoped thresholds, multi-condition examples. SLO mapping: latency to `p(95)<N`, error rate to `rate<0.01`, throughput to `rate>N`.
- **metrics.md** — Built-in metrics (`http_req_duration`, `http_reqs`, `iteration_duration`, `vus`, `data_received`), the four custom metric types (`Trend`, `Counter`, `Rate`, `Gauge`), when to use each, tagging (`{ tags: { endpoint: 'checkout' } }`).
- **scenarios.md** — The seven executors with one-line guidance each (`shared-iterations`, `per-vu-iterations`, `constant-vus`, `ramping-vus`, `constant-arrival-rate`, `ramping-arrival-rate`, `externally-controlled`). Closed-model vs open-model. Mixing scenarios in one file.
- **lifecycle.md** — The four lifecycle stages (init, `setup()`, VU code/`default`, `teardown()`), what runs where, what is and is not allowed in each (e.g., no `http` in init), `handleSummary()` for custom output.
- **data.md** — `SharedArray` for read-only data, per-VU data via `__VU`, `open()` in init, parameterization via env (`__ENV.BASE_URL`), CSV/JSON loading patterns.

## 6. Templates

All templates are runnable starter scripts. Every template uses `scenarios`, `thresholds`, `__ENV.BASE_URL`, and a top-of-file comment block. They make one HTTP `GET` to `${BASE_URL}/` plus a `check()`, and are starting points the skill edits, not finished tests.

| Template | Executor | Shape | Default thresholds |
|---|---|---|---|
| `smoke.js` | `constant-vus` | 1 VU, 1m | `http_req_failed: rate<0.01`, `http_req_duration: p(95)<500` |
| `average-load.js` | `ramping-vus` | 0→N over 5m, hold N for 10m, ramp to 0 over 5m | `p(95)<800`, `rate<0.01` |
| `stress.js` | `ramping-arrival-rate` | Step up RPS until something gives | Loose thresholds, `abortOnFail: false` |
| `spike.js` | `ramping-arrival-rate` | Low → spike → drop → hold | Recovery-focused |
| `soak.js` | `constant-vus` | Average load, 2h+ | Tracks `iteration_duration` trend for slow leaks |

## 7. Slash command

`/k6-script <description>` in `commands/k6-script.md`. Thin wrapper. The command body instructs Claude to invoke the `write-k6-script` skill with the description as the target.

Examples:
- `/k6-script smoke test for GET /api/products on staging`
- `/k6-script soak test for checkout flow, 50 VUs for 2h, p95 < 800ms`

The command does no logic of its own. It is a discoverable entry point.

## 8. Sub-agent

`k6-author` in `agents/k6-author.md`. Single-purpose agent for delegation.

- **Description:** "Use to author k6 performance test scripts. Produces idiomatic, threshold-gated k6 JS scripts under `performance/k6/`. Does not run scripts or analyze results."
- **Tools:** `Read, Write, Edit, Glob, Grep, Bash`. Bash is for read-only use (listing existing scripts); no execution of generated scripts.
- **System prompt:** Tells the agent to invoke the `write-k6-script` skill and follow it exactly.

Useful when the main agent wants to parallelize multiple script authoring tasks or keep its own context clean.

## 9. `plugin.json`

Same shape as existing marketplace plugins. Required fields:

- `name`: `k6-performance`
- `version`: `0.1.0`
- `description`: Authoring kit for idiomatic, threshold-gated k6 performance test scripts. Covers smoke, average-load, stress, spike, and soak profiles. Does not run scripts or analyze results.
- `author`: Nick Baynham / nickbaynham@gmail.com
- `homepage`: `https://github.com/NickBaynham/marketplace/tree/main/plugins/k6-performance`
- `repository`: `https://github.com/NickBaynham/marketplace`
- `license`: `SEE LICENSE IN LICENSE`
- `keywords`: `k6`, `performance-testing`, `load-testing`, `stress-testing`, `soak-testing`, `slo`, `thresholds`, `grafana-k6`

## 10. README and CHANGELOG

`README.md` stays under 400 lines. Sections:

- What it is
- Install
- What ships (skill / `/k6-script` / `k6-author`)
- Quick start example
- Conventions (output path, thresholds required, no sleeps, no emojis)
- Out of scope (running, results analysis; flagged as future work)

`CHANGELOG.md` has a `0.1.0` entry covering the initial release.

The root `CLAUDE.md` plugin table gets a new row pointing at the plugin and skill.

## 11. Out of scope (explicit)

Deferred to a future `0.2.0` or beyond:

- Running scripts (`make` targets, docker-compose, CI integration).
- Parsing or summarizing k6 results.
- Converting OpenAPI, Postman, or HAR into k6.
- k6 browser, WebSocket, gRPC, or extension authoring.
- Grafana Cloud k6 integration.

## 12. Success criteria

The plugin is done when:

1. A fresh Claude Code session can install the plugin from this repo.
2. Invoking `/k6-script smoke test for GET /api/products` produces a syntactically valid k6 script at `performance/k6/smoke/products.js` with thresholds and a header comment block.
3. The same outcome is reachable by asking Claude to "use the write-k6-script skill" or by delegating to the `k6-author` sub-agent.
4. The skill refuses to produce a script without thresholds.
5. README, CHANGELOG, plugin.json, and the marketplace root table are all consistent and accurate.
