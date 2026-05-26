# k6-performance Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `k6-performance` Claude Code plugin, an authoring-only kit for k6 performance test scripts covering the five Grafana k6 load profiles.

**Architecture:** Static plugin under `plugins/k6-performance/` following the marketplace pattern (mirrors `logical-consistency`). One skill (`write-k6-script`) with reference docs and starter templates, one slash command (`/k6-script`), one sub-agent (`k6-author`). No runtime, no build step.

**Tech Stack:** Markdown for skill/references/commands/agent, JSON for the plugin manifest, ES module JavaScript for k6 templates. Verification uses `jq` for JSON, `grep` for required-content checks, `node --check --input-type=module` for template syntax.

**Spec:** [docs/superpowers/specs/2026-05-25-k6-performance-plugin-design.md](../specs/2026-05-25-k6-performance-plugin-design.md)

**Verification model:** This plugin ships static content. There is no runtime to test. Each task ends with concrete verification: JSON validity, file existence, required-content grep checks, or JS module parse checks. Commit after each task.

---

### Task 1: Plugin scaffold (manifest + changelog)

**Files:**
- Create: `plugins/k6-performance/.claude-plugin/plugin.json`
- Create: `plugins/k6-performance/CHANGELOG.md`

- [ ] **Step 1: Create the plugin directory structure**

Run:
```bash
mkdir -p plugins/k6-performance/.claude-plugin \
         plugins/k6-performance/agents \
         plugins/k6-performance/commands \
         plugins/k6-performance/skills/write-k6-script/references \
         plugins/k6-performance/skills/write-k6-script/templates
```

Expected: No output, directories created.

- [ ] **Step 2: Write `plugin.json`**

Create `plugins/k6-performance/.claude-plugin/plugin.json` with:

```json
{
  "name": "k6-performance",
  "version": "0.1.0",
  "description": "Authoring kit for idiomatic, threshold-gated k6 performance test scripts. Covers smoke, average-load, stress, spike, and soak profiles. Does not run scripts or analyze results.",
  "author": {
    "name": "Nick Baynham",
    "email": "nickbaynham@gmail.com"
  },
  "homepage": "https://github.com/NickBaynham/marketplace/tree/main/plugins/k6-performance",
  "repository": "https://github.com/NickBaynham/marketplace",
  "license": "SEE LICENSE IN LICENSE",
  "keywords": [
    "k6",
    "performance-testing",
    "load-testing",
    "stress-testing",
    "soak-testing",
    "slo",
    "thresholds",
    "grafana-k6"
  ]
}
```

- [ ] **Step 3: Validate JSON**

Run: `jq . plugins/k6-performance/.claude-plugin/plugin.json > /dev/null && echo OK`
Expected: `OK`

- [ ] **Step 4: Write `CHANGELOG.md`**

Create `plugins/k6-performance/CHANGELOG.md` with:

```markdown
# Changelog

All notable changes to the `k6-performance` plugin are documented here.

## 0.1.0 — 2026-05-25

Initial release.

- `write-k6-script` skill with workflow for authoring k6 scripts.
- Reference docs for load profiles, thresholds, metrics, scenarios, lifecycle, and data handling.
- Starter templates for smoke, average-load, stress, spike, and soak profiles.
- `/k6-script` slash command.
- `k6-author` sub-agent for delegated authoring.
```

- [ ] **Step 5: Commit**

```bash
git add plugins/k6-performance/.claude-plugin/plugin.json \
        plugins/k6-performance/CHANGELOG.md
git commit -m "Scaffold k6-performance plugin manifest and changelog"
```

---

### Task 2: Write `SKILL.md`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/SKILL.md`

- [ ] **Step 1: Write the skill file**

Create `plugins/k6-performance/skills/write-k6-script/SKILL.md` with:

````markdown
---
name: write-k6-script
description: Use this skill when the user wants to author a k6 performance test script. Triggers include "write a k6 test", "k6 script for X", "performance test for endpoint Y", "load test", "stress test", "soak test", "spike test", "smoke test for the API". Produces an idiomatic, threshold-gated k6 JS script under `performance/k6/<profile>/<name>.js`. Does NOT run scripts, parse k6 results, or convert OpenAPI/Postman/HAR to k6.
---

# write-k6-script

Author idiomatic k6 performance test scripts. Opinionated about the five Grafana k6 load profiles. Authoring only — no runtime, no result analysis.

## Hard rules

These are non-negotiable. Apply them to every script you write.

1. **Every script must have `thresholds`.** A k6 script without pass/fail gates is not a real test. If the user provides no SLOs, use sensible defaults and flag them as placeholders in the header comment.
2. **Use `scenarios`, not legacy top-level `vus`/`duration`.** Every script declares an `options.scenarios` block.
3. **Never use sleeps to mask issues.** Use `sleep()` only to model realistic user think time, never to work around flakiness.
4. **Use `SharedArray` for any data file read in init context.** Never `JSON.parse(open(...))` directly into a top-level `const`.
5. **Parameterize the base URL via `__ENV.BASE_URL`.** Never hardcode a target.
6. **No emojis** in scripts, comments, or `console.log` output.

## Workflow

Follow these steps in order.

### 1. Identify the target

Determine what is being tested:
- Service or URL.
- Endpoint(s) and HTTP methods.
- Expected traffic mix (single endpoint, weighted scenarios, etc.).

If any of this is unknown, ask the user.

### 2. Identify the load profile

Pick exactly one:

| Profile | When to use |
|---|---|
| `smoke` | First-pass sanity check, 1 VU, ~1m. Run this before anything else. |
| `average-load` | Baseline behavior under normal traffic. |
| `stress` | Push past expected load to find the breaking point. |
| `spike` | Sudden traffic burst and recovery. |
| `soak` | Long-running test for memory leaks and degradation (2h+). |

If the user does not know which profile they want, recommend `smoke` first, then `average-load`. See `references/load-profiles.md` for details.

### 3. Identify SLOs

Collect:
- P95 (and optionally P99) latency target.
- Error-rate ceiling (usually `<1%`).
- Throughput floor, if applicable.

These become entries in `options.thresholds`. If the user does not provide SLOs, use defaults from the matching template and flag them in the header comment as `// PLACEHOLDER — confirm with stakeholders`.

See `references/thresholds.md`.

### 4. Pick the output path

Default: `performance/k6/<profile>/<name>.js`.

- `<profile>` is one of `smoke`, `average-load`, `stress`, `spike`, `soak`.
- `<name>` is a short kebab-case noun describing the target (e.g., `products`, `checkout-flow`).

Create the directory if it does not exist.

### 5. Generate the script

1. Read the matching template from `templates/<profile>.js`.
2. Replace the example endpoint with the real target(s).
3. Update `options.scenarios` with the user's chosen shape (VUs, RPS, duration).
4. Update `options.thresholds` with the SLOs.
5. Replace the header comment block with:
   - **Purpose** — one sentence describing what the script tests.
   - **Profile** — the load profile name.
   - **SLOs** — the thresholds in plain English.
   - **How to run** — the `k6 run` command.

### 6. Print the run command

After writing the file, output both forms so the user can pick:

```bash
# Local k6 binary
k6 run -e BASE_URL=https://example.com performance/k6/<profile>/<name>.js

# Docker (no local install needed)
docker run --rm -i -e BASE_URL=https://example.com grafana/k6 run - < performance/k6/<profile>/<name>.js
```

Do not write a runner script, Make target, or docker-compose file. Running is out of scope for this skill.

## References

Load only the reference files relevant to the current task. They are short and focused.

- [`references/load-profiles.md`](references/load-profiles.md) — Choosing between smoke, average-load, stress, spike, soak.
- [`references/thresholds.md`](references/thresholds.md) — SLO-as-code, threshold syntax, `abortOnFail`.
- [`references/metrics.md`](references/metrics.md) — Built-in metrics, custom Trend/Counter/Rate/Gauge.
- [`references/scenarios.md`](references/scenarios.md) — The seven executors, closed vs open model.
- [`references/lifecycle.md`](references/lifecycle.md) — init, setup, default, teardown, handleSummary.
- [`references/data.md`](references/data.md) — `SharedArray`, env parameterization, CSV/JSON.

## Out of scope

If the user asks for any of the following, explain that this skill does not cover it (it may be added in a future version):

- Running the script or setting up runners (`make`, docker-compose, CI).
- Parsing or summarizing k6 results.
- Converting OpenAPI, Postman, or HAR into k6.
- k6 browser, WebSocket, gRPC, or extensions.
- Grafana Cloud k6 integration.
````

- [ ] **Step 2: Verify required content is present**

Run:
```bash
for term in "thresholds" "scenarios" "SharedArray" "BASE_URL" "smoke" "average-load" "stress" "spike" "soak"; do
  grep -q "$term" plugins/k6-performance/skills/write-k6-script/SKILL.md || echo "MISSING: $term"
done
echo "done"
```
Expected: only `done` (no `MISSING` lines).

- [ ] **Step 3: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/SKILL.md
git commit -m "Add write-k6-script SKILL.md with hard rules and workflow"
```

---

### Task 3: Reference — `load-profiles.md`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/references/load-profiles.md`

- [ ] **Step 1: Write the reference**

Create the file with:

````markdown
# Load profiles

The five canonical k6 test profiles. Pick one per script.

## Decision table

| Question | Profile |
|---|---|
| Is this my first k6 script for this target? | `smoke` |
| Does it behave correctly under normal traffic? | `average-load` |
| Where does it break? | `stress` |
| How does it handle a sudden burst? | `spike` |
| Does it degrade over hours? | `soak` |

## smoke

- **Goal:** Verify the script runs and the target responds at all.
- **Shape:** 1 VU, ~1 minute, single iteration loop.
- **Executor:** `constant-vus`.
- **Thresholds:** Tight — `http_req_failed: ['rate<0.01']`, `http_req_duration: ['p(95)<500']`.
- **Run before any other profile.**

## average-load

- **Goal:** Confirm baseline performance at expected production traffic.
- **Shape:** Ramp up to N VUs over a few minutes, hold, ramp down.
- **Executor:** `ramping-vus` (closed model) or `ramping-arrival-rate` (open model).
- **Duration:** 15–30 minutes total.
- **Thresholds:** Realistic SLOs. P95 latency, error rate, optionally throughput.

## stress

- **Goal:** Find the breaking point.
- **Shape:** Step up VUs or RPS until errors climb or latency blows out.
- **Executor:** `ramping-arrival-rate` is usually the right choice (open model isolates client from server slowness).
- **Thresholds:** Loose. Set `abortOnFail: false` so the test runs to completion and shows where it broke.

## spike

- **Goal:** Measure behavior under a sudden burst and recovery afterward.
- **Shape:** Low baseline → sharp spike → drop back → hold to observe recovery.
- **Executor:** `ramping-arrival-rate`.
- **Watch:** Recovery time, error rate during and after the spike.

## soak

- **Goal:** Surface slow leaks, connection pool exhaustion, log buildup, GC pressure.
- **Shape:** Hold average load for hours (2h+, ideally overnight).
- **Executor:** `constant-vus` or `constant-arrival-rate`.
- **Watch:** `iteration_duration` trend over time, memory and CPU on the target.
````

- [ ] **Step 2: Verify**

Run: `grep -c "^## " plugins/k6-performance/skills/write-k6-script/references/load-profiles.md`
Expected: `6` (one decision table heading plus the five profile headings).

- [ ] **Step 3: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/references/load-profiles.md
git commit -m "Add load-profiles reference for write-k6-script skill"
```

---

### Task 4: Reference — `thresholds.md`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/references/thresholds.md`

- [ ] **Step 1: Write the reference**

````markdown
# Thresholds

Thresholds are k6's pass/fail gates. A script without thresholds is not a real test — k6 will report `passed` even if every request errored.

## Basic syntax

```js
export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
  },
};
```

The key is a metric name (built-in or custom). The value is an array of expressions; each must evaluate `true` over the run.

## Common SLO mappings

| SLO | Threshold |
|---|---|
| Less than 1% errors | `http_req_failed: ['rate<0.01']` |
| P95 latency under 500ms | `http_req_duration: ['p(95)<500']` |
| Throughput at least 100 RPS | `http_reqs: ['rate>100']` |
| All checks pass at least 99% of the time | `checks: ['rate>0.99']` |

## Tag-scoped thresholds

Apply a threshold to a subset of requests by tag.

```js
thresholds: {
  'http_req_duration{endpoint:checkout}': ['p(95)<800'],
  'http_req_duration{endpoint:health}':   ['p(95)<50'],
},
```

Tag the requests:

```js
http.get(`${BASE_URL}/checkout`, { tags: { endpoint: 'checkout' } });
```

## abortOnFail

Stop the test as soon as a threshold is breached.

```js
http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '30s' }],
```

Useful for smoke and average-load. **Do not** set on stress tests — the whole point is to run until something breaks.

## Custom-metric thresholds

If you create a custom `Trend`, `Counter`, `Rate`, or `Gauge`, you can threshold it the same way. See `metrics.md`.
````

- [ ] **Step 2: Verify**

Run: `grep -q "abortOnFail" plugins/k6-performance/skills/write-k6-script/references/thresholds.md && grep -q "http_req_failed" plugins/k6-performance/skills/write-k6-script/references/thresholds.md && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/references/thresholds.md
git commit -m "Add thresholds reference for write-k6-script skill"
```

---

### Task 5: Reference — `metrics.md`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/references/metrics.md`

- [ ] **Step 1: Write the reference**

````markdown
# Metrics

## Built-in metrics

| Metric | What it measures |
|---|---|
| `http_req_duration` | End-to-end request time. The default latency metric. |
| `http_req_failed` | Rate of failed requests (after k6's built-in checks). |
| `http_reqs` | Total request count and rate. |
| `iteration_duration` | Time for one VU iteration of `default`. Useful in soak tests. |
| `vus` | Active virtual users. |
| `vus_max` | Maximum VUs allocated. |
| `data_sent` / `data_received` | Bytes over the wire. |
| `checks` | Pass rate for `check()` assertions. |

## Custom metric types

Import from `k6/metrics`. Create once in init scope, update inside `default`.

```js
import { Trend, Counter, Rate, Gauge } from 'k6/metrics';

const checkoutLatency = new Trend('checkout_latency', true); // true = isTime
const checkoutErrors  = new Counter('checkout_errors');
const checkoutOk      = new Rate('checkout_ok');
const queueDepth      = new Gauge('queue_depth');
```

| Type | Use when |
|---|---|
| `Trend` | You want statistics (min, max, avg, p95, p99) over a value. Most common. |
| `Counter` | You want a monotonic count of events. |
| `Rate` | You want the percentage of true vs false outcomes. |
| `Gauge` | You want the latest value of something that goes up and down. |

## Tagging

Tags slice every metric. Add them per-request or in `options.tags`.

```js
http.get(url, { tags: { endpoint: 'products', region: 'us-east' } });
```

Tagged metrics can have their own thresholds (see `thresholds.md`).
````

- [ ] **Step 2: Verify**

Run: `grep -cE "^(\| .Trend|\| .Counter|\| .Rate|\| .Gauge)" plugins/k6-performance/skills/write-k6-script/references/metrics.md`
Expected: `4`

- [ ] **Step 3: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/references/metrics.md
git commit -m "Add metrics reference for write-k6-script skill"
```

---

### Task 6: Reference — `scenarios.md`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/references/scenarios.md`

- [ ] **Step 1: Write the reference**

````markdown
# Scenarios and executors

Always use `options.scenarios`. Do not use top-level `vus` / `duration` / `stages` — those are legacy and harder to evolve.

## The seven executors

| Executor | Model | Use when |
|---|---|---|
| `shared-iterations` | closed | Fixed total iterations split across VUs. |
| `per-vu-iterations` | closed | Each VU runs a fixed number of iterations. |
| `constant-vus` | closed | Hold N VUs for a duration. Good for `smoke` and `soak`. |
| `ramping-vus` | closed | Ramp VU count through stages. Good for `average-load`. |
| `constant-arrival-rate` | open | Hold N iterations per time unit. Good for `soak` with strict throughput. |
| `ramping-arrival-rate` | open | Ramp iteration rate through stages. Best for `stress`, `spike`, RPS-driven `average-load`. |
| `externally-controlled` | open | Control VUs at runtime via the k6 REST API. Rare. |

## Closed vs open model

- **Closed (vus-based):** N concurrent workers. If the server slows down, you send fewer requests. Models user concurrency.
- **Open (arrival-rate):** N requests per second regardless of server state. If the server slows down, requests queue up. Models real traffic and isolates client from server.

For most production-traffic simulations, prefer **open model**. For modeling a fixed pool of clients (e.g., known number of polling agents), use **closed**.

## Multiple scenarios in one file

Run scenarios concurrently, each calling its own `exec` function.

```js
export const options = {
  scenarios: {
    browse: {
      executor: 'ramping-vus',
      stages: [{ duration: '2m', target: 50 }, { duration: '5m', target: 50 }],
      exec: 'browse',
    },
    checkout: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '7m',
      preAllocatedVUs: 20,
      exec: 'checkout',
    },
  },
};

export function browse()   { /* ... */ }
export function checkout() { /* ... */ }
```
````

- [ ] **Step 2: Verify all seven executors are listed**

Run:
```bash
for e in shared-iterations per-vu-iterations constant-vus ramping-vus constant-arrival-rate ramping-arrival-rate externally-controlled; do
  grep -q "\`$e\`" plugins/k6-performance/skills/write-k6-script/references/scenarios.md || echo "MISSING: $e"
done
echo done
```
Expected: only `done`.

- [ ] **Step 3: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/references/scenarios.md
git commit -m "Add scenarios reference for write-k6-script skill"
```

---

### Task 7: Reference — `lifecycle.md`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/references/lifecycle.md`

- [ ] **Step 1: Write the reference**

````markdown
# Lifecycle

k6 runs your script in four stages. Knowing which stage you are in determines what APIs are available.

## Stages

```
1. init      — top-level code, imports, SharedArray, custom metric creation
2. setup()   — runs once before the test. Output is passed to default and teardown.
3. default() — runs in every VU, every iteration. This is where http calls live.
4. teardown(data) — runs once after the test. Cleanup.
```

## What is allowed where

| Stage | http allowed? | metrics allowed? | filesystem allowed? |
|---|---|---|---|
| init | no | create only | `open()` read-only |
| setup | yes | yes | no |
| default | yes | yes | no |
| teardown | yes | yes | no |

`open()` only works in init. Pair it with `SharedArray` (see `data.md`) so each VU does not pay the parse cost.

## Example

```js
import http from 'k6/http';
import { SharedArray } from 'k6/data';

// --- init ---
const users = new SharedArray('users', () => JSON.parse(open('./users.json')));

export const options = { /* ... */ };

export function setup() {
  const res = http.post(`${__ENV.BASE_URL}/login`, { user: 'admin' });
  return { token: res.json('token') };
}

export default function (data) {
  const user = users[__VU % users.length];
  http.get(`${__ENV.BASE_URL}/users/${user.id}`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
}

export function teardown(data) {
  http.post(`${__ENV.BASE_URL}/logout`, null, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
}
```

## handleSummary

Customize the end-of-test summary by exporting `handleSummary`.

```js
export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: false }),
  };
}
```

Use this when you need machine-readable output. Authoring stops here — parsing the JSON is out of scope for this skill.
````

- [ ] **Step 2: Verify**

Run: `grep -q "handleSummary" plugins/k6-performance/skills/write-k6-script/references/lifecycle.md && grep -q "SharedArray" plugins/k6-performance/skills/write-k6-script/references/lifecycle.md && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/references/lifecycle.md
git commit -m "Add lifecycle reference for write-k6-script skill"
```

---

### Task 8: Reference — `data.md`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/references/data.md`

- [ ] **Step 1: Write the reference**

````markdown
# Data handling

## SharedArray for read-only data

Always wrap test-data files in `SharedArray`. Without it, every VU gets its own copy of the parsed data — at 100 VUs and a 10MB JSON file that is 1GB of memory.

```js
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', () => JSON.parse(open('./data/users.json')));
```

The arrow function runs once per process; VUs read by index.

## Per-VU selection

Pick a different row per VU and per iteration.

```js
const user = users[(__VU + __ITER) % users.length];
```

`__VU` is the VU number (1-indexed). `__ITER` is the iteration count for that VU.

## CSV

k6 has no built-in CSV parser. Either pre-convert to JSON or use the [`papaparse`](https://github.com/jonataswalker/k6-papaparse) port packaged for k6.

```js
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const rows = new SharedArray('rows', () => papaparse.parse(open('./data/rows.csv'), { header: true }).data);
```

## Environment variables

Pass configuration via `-e KEY=VALUE`. Read with `__ENV.KEY`.

```js
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const VUS      = parseInt(__ENV.VUS || '10', 10);
```

Always parameterize the base URL. Never hardcode the target.

## Avoid

- `JSON.parse(open(...))` assigned to a top-level `const` (no SharedArray).
- Reading files in `default()` — `open()` only works in init.
- Embedding credentials in the script. Use env vars.
````

- [ ] **Step 2: Verify**

Run: `grep -q "SharedArray" plugins/k6-performance/skills/write-k6-script/references/data.md && grep -q "__ENV" plugins/k6-performance/skills/write-k6-script/references/data.md && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/references/data.md
git commit -m "Add data reference for write-k6-script skill"
```

---

### Task 9: Template — `smoke.js`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/templates/smoke.js`

- [ ] **Step 1: Write the template**

```javascript
// Purpose: Smoke test — verify the target responds correctly under minimal load.
// Profile: smoke
// SLOs:
//   - Error rate < 1%
//   - P95 latency < 500ms
// Run:
//   k6 run -e BASE_URL=https://example.com performance/k6/smoke/example.js

import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
    },
  },
  thresholds: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
```

- [ ] **Step 2: Verify the template parses as a JS module**

Run: `node --check --input-type=module < plugins/k6-performance/skills/write-k6-script/templates/smoke.js && echo OK`
Expected: `OK`

- [ ] **Step 3: Verify required content**

Run: `grep -q "thresholds" plugins/k6-performance/skills/write-k6-script/templates/smoke.js && grep -q "scenarios" plugins/k6-performance/skills/write-k6-script/templates/smoke.js && grep -q "__ENV.BASE_URL" plugins/k6-performance/skills/write-k6-script/templates/smoke.js && echo OK`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/templates/smoke.js
git commit -m "Add smoke.js template for write-k6-script skill"
```

---

### Task 10: Template — `average-load.js`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/templates/average-load.js`

- [ ] **Step 1: Write the template**

```javascript
// Purpose: Average-load test — confirm baseline performance under expected production traffic.
// Profile: average-load
// SLOs:
//   - Error rate < 1%
//   - P95 latency < 800ms
// Run:
//   k6 run -e BASE_URL=https://example.com performance/k6/average-load/example.js

import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TARGET_VUS = parseInt(__ENV.TARGET_VUS || '50', 10);

export const options = {
  scenarios: {
    average_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m',  target: TARGET_VUS },
        { duration: '10m', target: TARGET_VUS },
        { duration: '5m',  target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
```

- [ ] **Step 2: Verify the template parses as a JS module**

Run: `node --check --input-type=module < plugins/k6-performance/skills/write-k6-script/templates/average-load.js && echo OK`
Expected: `OK`

- [ ] **Step 3: Verify required content**

Run: `grep -q "ramping-vus" plugins/k6-performance/skills/write-k6-script/templates/average-load.js && grep -q "thresholds" plugins/k6-performance/skills/write-k6-script/templates/average-load.js && echo OK`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/templates/average-load.js
git commit -m "Add average-load.js template for write-k6-script skill"
```

---

### Task 11: Template — `stress.js`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/templates/stress.js`

- [ ] **Step 1: Write the template**

```javascript
// Purpose: Stress test — push past expected load to find the breaking point.
// Profile: stress
// SLOs:
//   - Loose. The point is to run to completion and observe where it breaks.
//   - Threshold is informational only (abortOnFail: false).
// Run:
//   k6 run -e BASE_URL=https://example.com performance/k6/stress/example.js

import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 500,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '2m', target: 400 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed:   [{ threshold: 'rate<0.10', abortOnFail: false }],
    http_req_duration: [{ threshold: 'p(95)<2000', abortOnFail: false }],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/`);
  check(res, {
    'status is 2xx or 3xx': (r) => r.status >= 200 && r.status < 400,
  });
}
```

- [ ] **Step 2: Verify the template parses as a JS module**

Run: `node --check --input-type=module < plugins/k6-performance/skills/write-k6-script/templates/stress.js && echo OK`
Expected: `OK`

- [ ] **Step 3: Verify required content**

Run: `grep -q "ramping-arrival-rate" plugins/k6-performance/skills/write-k6-script/templates/stress.js && grep -q "abortOnFail: false" plugins/k6-performance/skills/write-k6-script/templates/stress.js && echo OK`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/templates/stress.js
git commit -m "Add stress.js template for write-k6-script skill"
```

---

### Task 12: Template — `spike.js`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/templates/spike.js`

- [ ] **Step 1: Write the template**

```javascript
// Purpose: Spike test — sudden burst of traffic and recovery afterward.
// Profile: spike
// SLOs:
//   - Recovery: P95 latency returns under 1s within 2 minutes after the spike ends.
//   - During spike: thresholds are informational only.
// Run:
//   k6 run -e BASE_URL=https://example.com performance/k6/spike/example.js

import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 1000,
      stages: [
        { duration: '1m',  target: 10 },   // baseline
        { duration: '10s', target: 500 },  // spike
        { duration: '1m',  target: 500 },  // hold
        { duration: '10s', target: 10 },   // drop
        { duration: '3m',  target: 10 },   // recovery observation
      ],
    },
  },
  thresholds: {
    http_req_failed:   [{ threshold: 'rate<0.05', abortOnFail: false }],
    http_req_duration: [{ threshold: 'p(95)<2000', abortOnFail: false }],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/`);
  check(res, {
    'status is 2xx or 3xx': (r) => r.status >= 200 && r.status < 400,
  });
}
```

- [ ] **Step 2: Verify the template parses as a JS module**

Run: `node --check --input-type=module < plugins/k6-performance/skills/write-k6-script/templates/spike.js && echo OK`
Expected: `OK`

- [ ] **Step 3: Verify required content**

Run: `grep -q "spike" plugins/k6-performance/skills/write-k6-script/templates/spike.js && grep -q "ramping-arrival-rate" plugins/k6-performance/skills/write-k6-script/templates/spike.js && echo OK`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/templates/spike.js
git commit -m "Add spike.js template for write-k6-script skill"
```

---

### Task 13: Template — `soak.js`

**Files:**
- Create: `plugins/k6-performance/skills/write-k6-script/templates/soak.js`

- [ ] **Step 1: Write the template**

```javascript
// Purpose: Soak test — hold average load for hours to surface leaks and degradation.
// Profile: soak
// SLOs:
//   - Error rate < 1%
//   - P95 latency stays under 800ms for the whole run (no upward trend).
// Run:
//   k6 run -e BASE_URL=https://example.com performance/k6/soak/example.js

import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TARGET_VUS = parseInt(__ENV.TARGET_VUS || '50', 10);
const DURATION  = __ENV.DURATION || '2h';

const iterationTrend = new Trend('soak_iteration_duration', true);

export const options = {
  scenarios: {
    soak: {
      executor: 'constant-vus',
      vus: TARGET_VUS,
      duration: DURATION,
    },
  },
  thresholds: {
    http_req_failed:          ['rate<0.01'],
    http_req_duration:        ['p(95)<800'],
    soak_iteration_duration:  ['p(95)<1500'],
  },
};

export default function () {
  const start = Date.now();
  const res = http.get(`${BASE_URL}/`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  iterationTrend.add(Date.now() - start);
}
```

- [ ] **Step 2: Verify the template parses as a JS module**

Run: `node --check --input-type=module < plugins/k6-performance/skills/write-k6-script/templates/soak.js && echo OK`
Expected: `OK`

- [ ] **Step 3: Verify required content**

Run: `grep -q "constant-vus" plugins/k6-performance/skills/write-k6-script/templates/soak.js && grep -q "Trend" plugins/k6-performance/skills/write-k6-script/templates/soak.js && echo OK`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add plugins/k6-performance/skills/write-k6-script/templates/soak.js
git commit -m "Add soak.js template for write-k6-script skill"
```

---

### Task 14: Slash command `/k6-script`

**Files:**
- Create: `plugins/k6-performance/commands/k6-script.md`

- [ ] **Step 1: Write the command file**

````markdown
---
description: Author a k6 performance test script using the write-k6-script skill.
argument-hint: <description of the test, e.g. "smoke test for GET /api/products on staging">
---

Invoke the `write-k6-script` skill to author a k6 performance test script.

The user's request: `$ARGUMENTS`

Follow the skill's workflow exactly:
1. Identify the target (service, endpoints, traffic mix). Ask if anything is missing.
2. Identify the load profile (`smoke`, `average-load`, `stress`, `spike`, or `soak`).
3. Identify SLOs (P95 latency, error rate, throughput). If absent, use template defaults and flag them as placeholders.
4. Write the script to `performance/k6/<profile>/<name>.js`.
5. Print both the local `k6 run` and the Docker run commands.

Do not run the script. Do not create runner scripts, Make targets, or docker-compose files. Those are out of scope.
````

- [ ] **Step 2: Verify**

Run: `grep -q "write-k6-script" plugins/k6-performance/commands/k6-script.md && grep -q "\$ARGUMENTS" plugins/k6-performance/commands/k6-script.md && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add plugins/k6-performance/commands/k6-script.md
git commit -m "Add /k6-script slash command for k6-performance plugin"
```

---

### Task 15: Sub-agent `k6-author`

**Files:**
- Create: `plugins/k6-performance/agents/k6-author.md`

- [ ] **Step 1: Write the agent file**

````markdown
---
name: k6-author
description: Use to author k6 performance test scripts. Produces idiomatic, threshold-gated k6 JS scripts under `performance/k6/`. Useful for parallelizing multiple authoring tasks or keeping the main agent's context clean. Does NOT run scripts, analyze results, or convert OpenAPI/Postman/HAR to k6.
tools: Read, Write, Edit, Glob, Grep, Bash
---

You are a focused k6 performance test author.

Your single job is to produce one or more idiomatic, threshold-gated k6 JavaScript test scripts under `performance/k6/`. You invoke the `write-k6-script` skill and follow it exactly.

## Operating rules

- Always invoke the `write-k6-script` skill before writing any script. The skill has the workflow, hard rules, and references you need.
- Bash is for read-only use only: listing directories, checking whether a target file exists, validating JSON or JS syntax. Do not execute generated k6 scripts. Running tests is out of scope.
- If the user's request is ambiguous (no target, no profile, no SLOs), ask one focused question at a time, in the order the skill specifies.
- When you finish, report:
  1. The path of each script you wrote.
  2. The `k6 run` command to execute each one.
  3. Any placeholder values the user must confirm (typically SLOs).

## Out of scope

If asked to do any of these, decline and explain why:

- Run, schedule, or CI-integrate the scripts.
- Parse k6 results or build reports.
- Convert OpenAPI, Postman, or HAR into k6.
- k6 browser, WebSocket, gRPC, or extension authoring.
````

- [ ] **Step 2: Verify**

Run: `grep -q "name: k6-author" plugins/k6-performance/agents/k6-author.md && grep -q "write-k6-script" plugins/k6-performance/agents/k6-author.md && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add plugins/k6-performance/agents/k6-author.md
git commit -m "Add k6-author sub-agent for k6-performance plugin"
```

---

### Task 16: Plugin `README.md`

**Files:**
- Create: `plugins/k6-performance/README.md`

- [ ] **Step 1: Write the README**

````markdown
# k6-performance

Authoring kit for idiomatic, threshold-gated k6 performance test scripts. Covers the five Grafana k6 load profiles: `smoke`, `average-load`, `stress`, `spike`, `soak`.

Authoring only. This plugin does not run scripts or analyze results. Those are explicitly out of scope for 0.1.0.

## What ships

| Surface | Purpose |
|---|---|
| `write-k6-script` skill | Step-by-step workflow for producing a single k6 script. |
| `/k6-script` slash command | Entry point: `/k6-script smoke test for GET /api/products on staging`. |
| `k6-author` sub-agent | Delegable agent that invokes the skill. Useful for parallel authoring. |

## Install

This plugin lives in the [marketplace](https://github.com/NickBaynham/marketplace) repository. Install it in Claude Code following whatever mechanism your session uses to load marketplace plugins.

## Quick start

```text
/k6-script smoke test for GET /api/products on staging, p95 < 300ms, error rate < 1%
```

Claude will:

1. Confirm the target, profile, and SLOs.
2. Write a runnable script to `performance/k6/smoke/products.js`.
3. Print both the local and Docker run commands.

## Conventions

- Scripts are written to `performance/k6/<profile>/<name>.js`.
- Every script declares `options.scenarios` and `options.thresholds`. No exceptions.
- The base URL is parameterized via `__ENV.BASE_URL`.
- Test data files are wrapped in `SharedArray`.
- No emojis in scripts, comments, or console output.

## Out of scope

These may land in a future version. They are not part of 0.1.0:

- Running scripts (Make targets, docker-compose, CI integration).
- Parsing or summarizing k6 results.
- Converting OpenAPI, Postman, or HAR into k6 scripts.
- k6 browser, WebSocket, gRPC, or extensions.
- Grafana Cloud k6 integration.

## References

The skill ships with focused reference docs under `skills/write-k6-script/references/`:

- `load-profiles.md` — Choosing between the five profiles.
- `thresholds.md` — SLO-as-code, threshold syntax, `abortOnFail`.
- `metrics.md` — Built-in and custom metrics, tagging.
- `scenarios.md` — The seven executors, closed vs open model.
- `lifecycle.md` — init, setup, default, teardown, handleSummary.
- `data.md` — `SharedArray`, env parameterization, CSV/JSON.

## License

See repository LICENSE.
````

- [ ] **Step 2: Verify line count and required content**

Run:
```bash
wc -l plugins/k6-performance/README.md
grep -q "write-k6-script" plugins/k6-performance/README.md && \
  grep -q "/k6-script" plugins/k6-performance/README.md && \
  grep -q "k6-author" plugins/k6-performance/README.md && echo "content OK"
```
Expected: line count well under 400 and `content OK`.

- [ ] **Step 3: Commit**

```bash
git add plugins/k6-performance/README.md
git commit -m "Add k6-performance plugin README"
```

---

### Task 17: Register the plugin in the marketplace root `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md` (add one row to the Plugins table)

- [ ] **Step 1: Read the current table**

Read `CLAUDE.md` to confirm the existing table format. The table is at lines 18–22 of the current file and looks like:

```markdown
| Plugin | Skill | Purpose |
|---|---|---|
| [`web-scaffold`](plugins/web-scaffold/) | [`create-website`](plugins/web-scaffold/skills/create-website/SKILL.md) | Scaffold a Next.js + FastAPI website with Amplify + App Runner deploy targets, Route 53 + HTTPS. |
| [`business-requirements`](plugins/business-requirements/) | [`analyze-requirements`](plugins/business-requirements/skills/analyze-requirements/SKILL.md) | Senior Business Requirements Analyst for AI-augmented quality intelligence work. Also ships `/brd` and a `business-analyst` sub-agent. |
| [`logical-consistency`](plugins/logical-consistency/) | [`check-logical-consistency`](plugins/logical-consistency/skills/check-logical-consistency/SKILL.md) | Audit a document or set of documents for internal logical consistency — contradictions, fallacies, undefined or equivocated terms, invalid inferences. Also ships `/logic-check` and a `logic-auditor` sub-agent. |
```

- [ ] **Step 2: Append the new row after the `logical-consistency` row**

Add this row immediately after the `logical-consistency` line, keeping the same format:

```markdown
| [`k6-performance`](plugins/k6-performance/) | [`write-k6-script`](plugins/k6-performance/skills/write-k6-script/SKILL.md) | Authoring kit for idiomatic, threshold-gated k6 performance test scripts. Covers smoke, average-load, stress, spike, and soak profiles. Also ships `/k6-script` and a `k6-author` sub-agent. |
```

Use the Edit tool with the `logical-consistency` row as `old_string` and `<that row>\n<new row>` as `new_string`.

- [ ] **Step 3: Verify**

Run: `grep -q "k6-performance" CLAUDE.md && grep -q "write-k6-script" CLAUDE.md && echo OK`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "Register k6-performance plugin in marketplace README"
```

---

### Task 18: Final verification sweep

**Files:**
- None changed. Read-only checks against the whole plugin.

- [ ] **Step 1: File-existence check**

Run:
```bash
for f in \
  plugins/k6-performance/.claude-plugin/plugin.json \
  plugins/k6-performance/CHANGELOG.md \
  plugins/k6-performance/README.md \
  plugins/k6-performance/agents/k6-author.md \
  plugins/k6-performance/commands/k6-script.md \
  plugins/k6-performance/skills/write-k6-script/SKILL.md \
  plugins/k6-performance/skills/write-k6-script/references/load-profiles.md \
  plugins/k6-performance/skills/write-k6-script/references/thresholds.md \
  plugins/k6-performance/skills/write-k6-script/references/metrics.md \
  plugins/k6-performance/skills/write-k6-script/references/scenarios.md \
  plugins/k6-performance/skills/write-k6-script/references/lifecycle.md \
  plugins/k6-performance/skills/write-k6-script/references/data.md \
  plugins/k6-performance/skills/write-k6-script/templates/smoke.js \
  plugins/k6-performance/skills/write-k6-script/templates/average-load.js \
  plugins/k6-performance/skills/write-k6-script/templates/stress.js \
  plugins/k6-performance/skills/write-k6-script/templates/spike.js \
  plugins/k6-performance/skills/write-k6-script/templates/soak.js; do
  test -f "$f" || echo "MISSING: $f"
done
echo done
```
Expected: only `done`.

- [ ] **Step 2: JSON validity**

Run: `jq . plugins/k6-performance/.claude-plugin/plugin.json > /dev/null && echo OK`
Expected: `OK`

- [ ] **Step 3: All templates parse**

Run:
```bash
for f in plugins/k6-performance/skills/write-k6-script/templates/*.js; do
  node --check --input-type=module < "$f" && echo "ok: $f" || echo "FAIL: $f"
done
```
Expected: every line is `ok: <path>`, no `FAIL`.

- [ ] **Step 4: No emojis anywhere in the plugin**

Run:
```bash
LC_ALL=C grep -rlP "[^\x00-\x7F]" plugins/k6-performance/ || echo "no non-ASCII content"
```
Expected: `no non-ASCII content` (em-dashes etc. count as non-ASCII; if any file is listed, inspect and replace with ASCII equivalents, then re-run). Allowed exception: leave Unicode in place if it is meaningful prose (e.g., `—`), but flag emojis specifically.

If any file is flagged, verify with eyes that what is present is prose punctuation (em-dash, curly quotes) and not an emoji. If an emoji is found, replace it with plain ASCII and amend the relevant commit.

- [ ] **Step 5: Marketplace README references the plugin**

Run: `grep -q "k6-performance" CLAUDE.md && grep -q "write-k6-script" CLAUDE.md && echo OK`
Expected: `OK`

- [ ] **Step 6: Final commit (only if anything was amended in Step 4)**

If Step 4 required no changes, no commit is needed.

---

## Self-review notes

- **Spec coverage:** Every deliverable in spec Section 2 maps to a task: plugin.json (T1), CHANGELOG (T1), SKILL.md (T2), six references (T3–T8), five templates (T9–T13), `/k6-script` (T14), `k6-author` (T15), README (T16), marketplace table row (T17). T18 is final verification.
- **Hard rules from spec Section 4 are enforced** in SKILL.md (T2) and re-checked by template content greps (T9–T13).
- **Out-of-scope language from spec Section 11** appears in SKILL.md, README, and the sub-agent prompt.
- **No placeholders:** Every step contains the actual content to write, exact commands, and expected output.
- **Type/name consistency:** Plugin name `k6-performance`, skill name `write-k6-script`, command `/k6-script`, sub-agent `k6-author`, output path `performance/k6/<profile>/<name>.js` — all consistent across SKILL.md, command, sub-agent, README, and marketplace table row.
