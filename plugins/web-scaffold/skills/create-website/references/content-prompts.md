# Content prompts

The full set of fields the `create-website` skill asks for, with examples and validation guidance.

## Required fields

| Field | Description | Example | Validation |
|---|---|---|---|
| `site_name` | Product or site name shown in the header, title tag, and OG metadata. | `VerifiedSignal` | Non-empty, 1–60 chars. |
| `company` | Legal or operating company name shown in the footer and metadata. | `Calgentik` | Non-empty. |
| `domain` | Apex domain the site will live at, no scheme, no trailing slash. | `calgentik.com` | Lowercase before validating; must then match `^[a-z0-9.-]+\.[a-z]{2,}$`. Strip an accidental leading `https://` or `www.` before storing. |
| `tagline` | Short headline; one line, no period required. | `Document intelligence you can verify.` | 1–120 chars. |
| `description` | One-sentence what-and-for-whom. Used in meta description and the landing hero. | `Helps teams turn complex documents into structured, decision-ready signals.` | 30–200 chars. |
| `contact_email` | Public contact address shown on the contact page and used as the default inbox for the contact form. | `hello@calgentik.com` | Valid email. |

## Optional fields (sensible defaults)

| Field | Default | Notes |
|---|---|---|
| `api_domain` | `api.{{domain}}` | Backend public hostname. Override if you already have an API host. |
| `github_repo` | _(empty)_ | URL like `https://github.com/owner/repo`. Used in the footer and README. |
| `accent_color` | `#5b8def` | Hex color for primary buttons and links. Tailwind v4 reads it from `--color-accent`. |
| `staging_domain` | `staging.{{domain}}` | Used in Amplify branch mapping docs. |

## Site description (optional)

If a `docs/SITE.md` exists in the target directory, the skill reads it and uses it to inform landing and about page copy. The file does not need a specific structure; freeform prose works. A useful starter shape:

```markdown
# {{site_name}}

## What it is
One paragraph.

## Who it is for
List or paragraph.

## What it does
Bullet list of capabilities.

## Why now / why us
Optional context — competitive landscape, founding story, etc.
```

The skill paraphrases; it never copies `SITE.md` verbatim into pages.

## Re-running the skill

If the skill is invoked again on the same project:

- Re-read `docs/SITE.md` to pick up edits.
- Read existing values from `frontend/lib/site.ts` (treated as canonical) and offer them as defaults rather than re-prompting from scratch.
- Never overwrite a page that has been edited since scaffolding (compare to the template; if the file diverges, ask before replacing).
