# HCC AI Search

A **Hybrid Cloud Console (HCC)** prototype for console-wide search and ask. It explores how people can find services, resources, documentation, and take action — including asking AI — from a single search field in the masthead.

This is a **clickable UX prototype**, not a production backend. Search results, inventory, and AI answers are mocked so reviewers can try the interaction.

**Try it:** [https://sjcox-rh.github.io/HCC-AI-Search/](https://sjcox-rh.github.io/HCC-AI-Search/)

## What this prototype is for

HCC spans many products and pages. Today, finding the right landing page, host, cluster, playbook, or doc often means knowing where to click. This prototype tests a single **Search or ask AI** experience that can:

- Jump to a service or related page
- Surface clusters, hosts, systems, groups, and playbooks
- Answer natural-language questions with a direct AI summary
- Point to getting-started and other documentation
- Carry the intent into the destination page as filter chips

Built with [PatternFly](https://www.patternfly.org/) v6 on the PatternFly React seed.

## Main features

### Masthead search

- Search lives in the console chrome, next to the product name.
- Collapsed placeholder: **Search or ask AI...**
- When the field is focused, it expands and the placeholder becomes **Ask AI, jump to resources, run playbooks, search docs...**
- Open search with a click, or with **⌘K** (Mac) / **Ctrl+K** (Windows/Linux).
- **Esc** or a click outside closes search and clears the query.
- Results hang from the search field as a dropdown. The input stays in the masthead.

### Suggestions (empty state)

With no query, search shows **Suggestions** based on the current page — for example CVE, storage, or subscription prompts on the homepage, or alerting and IAM prompts on those pages.

### Search and ask

Typing a query returns a mixed list (no category headings). Result type is shown with an icon; hover the icon for a tooltip (landing page, page, playbook, action, cluster, host, system, group, documentation).

When a query matches a known intent, an **AI answer** card appears first, with a short summary and follow-up actions (for example view hosts or generate a playbook).

### Result ranking

For a typical service or platform query, results are ordered:

1. Direct AI answer, when one applies
2. Service **landing page**, then related pages, playbooks, and actions
3. Inventory: **clusters, hosts, systems, groups**
4. **Getting started** docs (when they exist) and other documentation

Covered mock catalog includes Hybrid Cloud Console, RHEL, OpenShift, Insights, alerting, IAM, automation, and subscriptions.

### Navigation and filters

Selecting a result can navigate into the prototype and apply **filter chips** on the destination page, so a natural-language query is shown as translated console filters.

Playbook-style actions are mocked: they show a confirmation that a remediation playbook was queued (prototype only).

### Console chrome

The prototype sits in a simplified HCC shell: Red Hat masthead, services menu, and a product name that switches between **Hybrid Cloud Console** (home) and **Red Hat Enterprise Linux** on other pages.

## Queries worth trying

These mocked intents show the AI answer and mixed-result patterns:

- `Show me all RHEL 8 servers with critical CVEs in production`
- `Which OpenShift clusters are running out of storage?`
- `RHEL subscription usage`

Also try service names such as `Insights`, `OpenShift`, `Alert Manager`, or `IAM` to see landing pages, related pages, inventory, and getting-started docs.

## Local development

```bash
git clone https://github.com/sjcox-rh/HCC-AI-Search.git
cd HCC-AI-Search
npm install
npm run start:dev
```

The app runs at `http://localhost:9000` by default. If that port is in use, start with `PORT=9001 npm run start:dev`.

| Script | Description |
| --- | --- |
| `npm run start:dev` | Development server |
| `npm run build` | Production build (`dist/`) |
| `npm test` | Test suite |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

Pushes to `main` deploy the GitHub Pages preview automatically.

## Notes

- Search data lives in `src/app/SearchPalette/searchPaletteData.ts`. There is no live console or Lightspeed API.
- PatternFly guidance used by this project is in [`ai-documentation/`](./ai-documentation/README.md).
