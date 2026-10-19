# Vision Brief: HCC Search

## Problem Statement

Org admins and cloud ops engineers depend on console.redhat.com to move through complex environments. Search does not hold up that job: 73% of queries return zero results, and 74% of users abandon search. The masthead is not yet a place they can trust to find the right asset, case, or resource, or to act on what they find.

## Target User

- **Role:** Org admins and cloud ops engineers
- **Context:** They are in console.redhat.com, moving across a complex estate and looking for the next place to go or the next thing to fix
- **Goal:** Get to the right asset, case, learning resource, or action without already knowing which service owns it
- **Current experience:** On [console.redhat.com](https://console.redhat.com/), search is the production baseline. Most queries return nothing, and most people leave search. The [HCC AI Search prototype](https://sjcox-rh.github.io/HCC-AI-Search/) is the vision, not the current product.

## Evidence

- **Research retrieved via `uxd-research-insights`:** No. The sources below were read from the decks and Amplitude chart linked for this brief.
- **HCC Search Overhaul, problem statement** (Jeff Gehlbach). [Slide](https://docs.google.com/presentation/d/1WDMprsl5arGubjQxf91ZNgnM_iE8slQQTiq1swbYvj0/edit?slide=id.g3f864fe97d4_0_906#slide=id.g3f864fe97d4_0_906): 73% zero-result rate (2024 analysis). 74% abandonment rate (2026 analysis). People fall into fragmented manual navigation. Success at GA, from the same deck: zero-result rate at or below 30%, abandonment at or below 25%.
- **Amplitude, last 90 days, external users** on console.redhat.com autocapture. Chart: [_crc | Masthead Search / activated search, then clicked a result item](https://app.amplitude.com/analytics/redhat/chart/pktt0pqd/edit/ppb4cyik). Of 9,368 users who opened masthead search, 2,512 clicked a result within 60 seconds (26.8%). Median time to that click was 10 seconds (average 14). Internal users are excluded. Queried 8 Oct 2026.
- **Q3 query analysis** (Mary Shakshober, Masthead + search revamp). [Slide](https://docs.google.com/presentation/d/1jYGBDdMFwhoPOzk_4PJt1hYgalpCUj6IJemHSGT5PPw/edit?slide=id.g311c88a6bdc_0_9#slide=id.g311c88a6bdc_0_9): only about 27% of queries are for content current search can return, and current search only supports services. Most service queries are subscription-related. People also type actions (register, remove, download), CLI commands (yum), topics (software, SCA), Satellite, and a smaller set of certification queries.
- **Connected Experience study, Q3 2026.** Khalaeb Richardson and Jingfu Tan interviewed eight technical participants (Red Hat Accelerators and User Interviews) on high-fidelity Figma prototypes. The study covered moving Portal case management, search, and product downloads onto Hybrid Cloud Console, plus troubleshooting with and without AI. Deck version V202510. [Project summary](https://docs.google.com/presentation/d/1kDox5YrU_xw06AlsyVKdFqvFO5uvBFKIrsLI6YFGnFA/edit?slide=id.h1b90e906c620a406_0_12#slide=id.h1b90e906c620a406_0_12). Search findings start at [this slide](https://docs.google.com/presentation/d/1kDox5YrU_xw06AlsyVKdFqvFO5uvBFKIrsLI6YFGnFA/edit?slide=id.h70685614480c9c0e_4_562#slide=id.h70685614480c9c0e_4_562).
- Console search is used to jump to assets (clusters, VPCs), look up KB articles and error codes, and find patch docs. People type shorthand keywords unless the UI clearly signals an AI conversation. One participant said they use console search “mostly for navigation purposes,” and go to a web search engine for documentation.
- An empty search field should open a light overlay (recent history, shortcuts, categories), not a full chat. “Search or Ask AI...” leaves people unsure whether typing is a lookup or a chat.
- The overlay should stay short, without scrolling, and can include pinned favorites. Full AI summaries and product downloads inside that first dropdown felt like too much.
- Restricted assets should stay visible, with a short non-sensitive summary and an inline request-access action. Hiding them makes on-call engineers think the asset is missing. **This conflicts with [CRCPLAN-448](https://redhat.atlassian.net/browse/CRCPLAN-448).** That feature's security rule is the opposite: if the person's role cannot view an item, search must not reveal that the item exists. The prototype shows the restricted host. The vision narrative now does too: the host appears immediately, with request access. CRCPLAN-448 still hides it. That conflict stays open.
- AI summaries belong on the full results page, with an on/off toggle and direct links to the source KB article. People will not trust a summary they cannot check. CRCPLAN-448 adds a second control: an organization can turn AI summaries off, and a person can turn them off for the session. Summaries come from Ask Red Hat / multi-agent when they are allowed.
- No design history file exists in this prototype repo.

## New Capabilities

- **The prototype is the vision.** [HCC AI Search](https://sjcox-rh.github.io/HCC-AI-Search/) shows the masthead as the way in: a light dropdown, mixed results, an AI answer, and a path to act. Production search on console.redhat.com is the before.
- **Act from the search bar:** The person states an intent in natural language and runs an automated remediation, instead of only receiving a documentation link. The prototype sketches this for one CVE intent (“Run remediation without leaving search”). The ConsoleDot agentic workflow is still being explored.
- **Trust the results:** The same field returns accurate, helpful results across estate assets, support cases, learning resources, and AI answer summaries. Research adds a constraint: AI summaries need a direct citation to the source article, and they belong on the results page rather than filling the first dropdown. CRCPLAN-448 is the feature for this. It is In Progress, due in production no later than the end of 2Q2027, under parent outcome [UIESTRAT-84](https://redhat.atlassian.net/browse/UIESTRAT-84). It does not include running a remediation from the search bar.
- **Further push — help panel:** The prototype can go further by bringing the help panel into this same experience. The shell already has a separate help drawer. It is not part of the primary search journey yet.

## Capability Readiness

- [x] On the roadmap (committed) — [CRCPLAN-448](https://redhat.atlassian.net/browse/CRCPLAN-448), In Progress: estate assets, support cases, learning resources, and AI answer summaries from the masthead, in English, French, Korean, Japanese, and Chinese for items already translated. GA no later than the end of 2Q2027. Results include only what the person's role in the active org or workspace can view.
- [x] Being explored (prototyping / proof of concept) — natural-language remediation as an agentic ConsoleDot workflow. It is not in CRCPLAN-448. The AI Search prototype sketches it for one CVE intent.
- [ ] Aspirational (not yet started but plausible in time horizon)

## Scope

- **Time horizon:** Cross-domain preview in Q3-26 through general availability in Q2-27
- **Success at GA:** Zero-result rate at or below 30% (from 73% in the 2024 analysis). Abandonment at or below 25% (from 74% in the 2026 analysis).
- **Primary journey:** One masthead search that covers estate assets, support cases, learning resources, and AI answer summaries. Estate assets in the feature are Ansible Automation Platform, IAM (workspaces after GA), Integrations and Notifications, Lightwell, OpenShift, Red Hat Lightspeed, and Subscriptions. Downloads are after GA.
- **Who the feature names:** An org admin searching every entitled bundle. An end user in English, seeing only their role and subscriptions. An end user working in French, Korean, Japanese, or Chinese, seeing items already translated into that language. On-the-fly translation is after MVP.
- **Out of scope:** Unbounded asset types (Lightspeed conversations, planning items, lifecycle logs) and off-console content (Ecosystem Catalog, Developer Sandbox). A nurture item may still point at those off-platform places. A navigation minigame is after MVP.
- **Open tension:** Research wants restricted items to stay visible with request access. The narrative shows that host immediately. CRCPLAN-448 says a person who cannot view an item must not learn that it exists.
- **Depends on:** Opening a support case on the console depends on [UIESTRAT-95](https://redhat.atlassian.net/browse/UIESTRAT-95). Subscriptions in this search depend on [UIESTRAT-127](https://redhat.atlassian.net/browse/UIESTRAT-127). Downloads, after GA, depend on [UIESTRAT-144](https://redhat.atlassian.net/browse/UIESTRAT-144).
- **How it arrives:** Shadow mode first, then internal Red Hat users and a beta, then GA by the end of 2Q2027.
- **Further reach:** Fold the help panel into the same prototype, beyond the primary search journey. Not in CRCPLAN-448.

## rhoai-3.6 Integration

Adapted for the HCC AI Search prototype at `/Users/sjcox/AI-Search` (published at https://sjcox-rh.github.io/HCC-AI-Search/). This vision is not an rhoai-3.6 page.

- **Feature area:** Masthead search in `src/app/AppLayout/AppLayout.tsx`, the dropdown in `src/app/SearchPalette/`, and the full results page in `src/app/SearchResults/SearchResults.tsx` (`/search`)
- **Branch:** `feature/vision-hcc-search`
- **Feature flag:** `showVisionHccSearch` (no feature-flag module exists today; the AI-answers switch is local state in `SearchResults`)
- **Design history reviewed:** No — the repo has no design history

## Stakeholders

| Who | What They Care About |
|-----|---------------------|
| UIE leadership | The what and why of a seamless Portal and Console customer journey, quickly |
| Delivery leads | The same story, in a form they can take into delivery decisions |

## Presentation Context

- Oct 13 — Stakeholder POC check-in
- Oct 20 — UIE All Hands presentation

The audience needs to grasp the what and why without a long walkthrough.
