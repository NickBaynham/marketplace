# business-requirements

A Claude Code plugin that turns rough product ideas into structured, testable, implementation-ready business requirements — with a default focus on AI-augmented quality intelligence, document intelligence, and agentic automation platforms.

The plugin ships three surfaces:

- **Skill:** [`analyze-requirements`](./skills/analyze-requirements/SKILL.md) — activates from natural-language requests like "analyze requirements for X" or "write a BRD."
- **Slash command:** `/brd <topic>` — invoke the analysis directly.
- **Sub-agent:** [`business-analyst`](./agents/business-analyst.md) — delegate BA work from a main agent.

## What it produces

A Business Requirements Analysis with up to 18 sections — executive summary, goals, users, scope, use cases, functional / non-functional / data / AI / integration requirements, reporting, Given/When/Then acceptance criteria, risks, assumptions, open questions, MVP recommendation, and roadmap.

Two modes layer on by default:

- **Product Strategy Mode** — opinionated calls on differentiating vs. commodity, MVP scope cuts, real AI value vs. demoware, deterministic vs. agentic boundaries.
- **Implementation Handoff Mode** — engineering-ready appendix with epic, user stories, API endpoints, data model changes, UI components, backend services, test cases, observability, security, and Definition of Done.

Disable either with "skip strategy" or "no handoff format."

## When it triggers

The `analyze-requirements` skill activates on phrases like:

- "analyze requirements for…"
- "write a BRD for…"
- "what should this feature do"
- "turn this rough idea into requirements"
- "draft user stories and acceptance criteria for…"
- "refine the scope of…"

It does **not** trigger for pure implementation help on settled features, code review, or non-product analysis.

## Default lens

When the user doesn't specify a domain, the skill assumes the work serves an **AI-Augmented Quality Intelligence Platform** and uses the preferred vocabulary (Quality Intelligence Platform, Software Knowledge Model, Quality Signal, Source-grounded recommendation, etc.). If the domain is different, the skill adopts it but keeps the same analytical rigor.

## Installation

This plugin lives in the [marketplace](../../) repository. Install it into a Claude Code session via the marketplace and the skill, slash command, and sub-agent become available.

## Layout

```
business-requirements/
├── .claude-plugin/plugin.json
├── README.md
├── CHANGELOG.md
├── commands/
│   └── brd.md                          # /brd <topic>
├── agents/
│   └── business-analyst.md             # delegated BA sub-agent
└── skills/
    └── analyze-requirements/
        ├── SKILL.md                    # primary skill behavior
        ├── references/
        │   ├── output-template.md
        │   ├── requirement-quality-rules.md
        │   ├── agentic-checklist.md
        │   ├── product-strategy-mode.md
        │   ├── implementation-handoff-mode.md
        │   ├── vocabulary.md
        │   └── platform-context.md
        └── templates/
            └── BRD.md                  # blank BRD with the 18-section structure
```

## Further reading

- [SKILL.md](./skills/analyze-requirements/SKILL.md) — full skill instructions and trigger rules
- [output-template.md](./skills/analyze-requirements/references/output-template.md) — canonical section-by-section output
- [requirement-quality-rules.md](./skills/analyze-requirements/references/requirement-quality-rules.md) — how to write good requirements
- [agentic-checklist.md](./skills/analyze-requirements/references/agentic-checklist.md) — questions every AI/agent feature must answer
- [product-strategy-mode.md](./skills/analyze-requirements/references/product-strategy-mode.md)
- [implementation-handoff-mode.md](./skills/analyze-requirements/references/implementation-handoff-mode.md)
- [vocabulary.md](./skills/analyze-requirements/references/vocabulary.md) — preferred Quality Intelligence Platform terms
- [platform-context.md](./skills/analyze-requirements/references/platform-context.md) — default platform inputs, outputs, agent workflows
