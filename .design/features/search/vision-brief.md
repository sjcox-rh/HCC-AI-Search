# Vision Brief: Connected Search and Help

## Problem Statement

Sam, a system administrator at Money, Inc., comes to console.redhat.com to get servers trusted and workload-ready. Search, the help panel, and Ask Red Hat are three separate doors, and each is asked to do the others' work. Search often returns nothing, so people leave. Chat is a button almost nobody presses. The help panel does not know what the person just searched. Tracy Rankin has asked for intelligent chat and search to work as one experience, to reverse the traffic drop and raise engagement. The scope of that ask is the GUI chatbot and finding help inside the console.

## Who Is Affected

Role: Sam, a system administrator at Money, Inc. He is a composite based on research, and he is also a cartoon.

Priority: Get servers trusted and workload-ready without hassle.

Context: He is in the masthead or the help drawer, with a short window before he has to say which servers are ready and which rule he used.

Goal: Find the authoritative answer, see which hosts are actually ready, and leave with one action that can cover the fleet.

Challenges this journey is built for: Information is everywhere, and the authoritative answer is still hard to find. A server still needs reachability, registration, patches, and extras before it can run a workload. Cloud, on-prem, and metal each need their own script, so one definition never covers the fleet. He is expected to move quickly without adding downtime, regressions, or compliance risk. Alerts, advisories, tickets, dashboards, and messages compete for his attention.

Current condition: Production search at console.redhat.com is the baseline. Most queries return nothing, and most people leave. Help and Ask Red Hat sit beside search and do not share its context. The picture of the connected experience is the HCC AI Search prototype, version V2.2 Search and Help: https://sjcox-rh.github.io/HCC-AI-Search/. The flow is in the reference guide, under Help Panel, "RHEL 10 migration & Image Mode."

## The three jobs

Right support is the surface that matches the question.

Search finds. Sam has a shorthand, a host name, or a task such as "RHEL 10 migration image mode." Search returns places and documents immediately: the upgrade guide, the pre-upgrade check, Image Builder. Its value is that he does not have to know which service owns the answer. Search is the front door because it is fast enough to try.

The help panel explains. He needs the official rule before he acts: the hardware baseline, package mode versus image mode, the crypto warning. The panel holds that guide beside his work, including the fleet signal the guide makes relevant (42 registered systems, 6 below the baseline). Its value is a source he can check. He trusts the words because they are the guide, not a summary standing in for the guide.

Chat applies the guide to his estate. Ask Red Hat, in the GUI, opens in the same drawer with the guide and his hosts already named. It answers "do my systems meet this rule?" and offers a next action he can review: a verification playbook, an Image Builder template, or a CSV of the hosts that fail. Its value is a personal answer. The guide told him the rule. Chat tells him which of his hosts the rule catches.

## How they work together

The prototype reference guide is the journey.

1. He searches. The dropdown lists the guide, the pre-upgrade assistant, and Image Builder. Each row can open the place, view the guide in the help panel, or ask Lightspeed. Search has finished its job when he can see the guide.
2. He opens the guide in the help panel. The drawer shows the requirements. A callout names his 42 systems and the 6 that miss x86-64-v3, and offers "Analyze Fleet Compatibility in Lightspeed." Help has finished its job when he understands the rule and can see that it applies to his inventory.
3. He asks from that guide. Chat opens in the same drawer. The context is the upgrade guide plus the 42 RHEL 9 hosts. The answer splits the fleet, 36 ready and 6 blocked, and offers the next action. Chat has finished its job when the action is still tied to the guide he can read.

Search hands the document to help. Help hands the document and the fleet signal to chat. Chat hands back an action he can review. The drawer is what makes the handoff visible: the guide and Ask Lightspeed are tabs in one panel, so the source stays available while chat works.

## Evidence

Research retrieved via uxd-research-insights: No. Findings below were read from the decks, the Amplitude chart, CRCPLAN-448, the prototype, and the leadership update supplied for this brief in November 2026.

Evidence: 73% of search queries returned zero results in a 2024 analysis, and 74% of users abandoned search in a 2026 analysis. Success at GA for search is a zero-result rate at or below 30% and abandonment at or below 25%. (HCC Search Overhaul, Jeff Gehlbach.) https://docs.google.com/presentation/d/1WDMprsl5arGubjQxf91ZNgnM_iE8slQQTiq1swbYvj0/edit?slide=id.g3f864fe97d4_0_906#slide=id.g3f864fe97d4_0_906

Evidence: Of 9,368 external users who opened masthead search in the 90 days before 8 Oct 2026, 2,512 clicked a result within 60 seconds (26.8%). Median time to that click was 10 seconds. This is a click-through measure, not the 74% abandonment measure. (Amplitude, console.redhat.com autocapture.) https://app.amplitude.com/analytics/redhat/chart/pktt0pqd/edit/ppb4cyik

Evidence: Only about 27% of Q3 queries were for content current search can return, because search only supports services. People also type actions, CLI commands, and topics. (Mary Shakshober, Masthead and search revamp.) https://docs.google.com/presentation/d/1jYGBDdMFwhoPOzk_4PJt1hYgalpCUj6IJemHSGT5PPw/edit?slide=id.g311c88a6bdc_0_9#slide=id.g311c88a6bdc_0_9

Evidence: Console search is for jumping to assets, KB articles, error codes, and patch docs. People type shorthand unless the UI clearly signals a conversation. An empty field should be a light overlay, not a chat. "Search or Ask AI..." leaves people unsure which one they are in. AI summaries belong on a results page, with the source linked. (Connected Experience, Q3 2026, n=8, Richardson and Tan.) https://docs.google.com/presentation/d/1kDox5YrU_xw06AlsyVKdFqvFO5uvBFKIrsLI6YFGnFA/edit?slide=id.h1b90e906c620a406_0_12#slide=id.h1b90e906c620a406_0_12

Evidence: Chat usage is under 1% button clicks and under 5% Ask Red Hat adoption. Tracy Rankin mandated an integrated chat and search experience to reverse the traffic drop and raise engagement. Scope is the GUI chatbot and finding help inside the console. (Leadership update supplied for this brief, November 2026.)

Evidence: Multi-agent processing through Unifi takes from 14 seconds to 90 seconds per query. Alternative frameworks are blocked, so the experience has to be designed around that wait. Omry's team is developing a cache of 250 to 1,000 common answers to skip Unifi for those questions. Leadership is addressing the search metrics with caching solutions. (Same leadership update.)

Evidence: Design sprints are underway with JP Sherman's search experience designers and Dan Carol's web team, so the console flow and the web flow stay one workflow. Steerco will review this vision for gaps against PatternFly guidelines and for the components it still needs. (Same leadership update.)

Evidence: The connected flow exists in the prototype reference guide: search "RHEL 10 migration image mode," open "Upgrading to RHEL 10 & Adopting Image Mode" in the help panel, then Analyze Fleet Compatibility in Lightspeed. The chat answer uses the guide's x86-64-v3 rule against 42 hosts. https://sjcox-rh.github.io/HCC-AI-Search/

Evidence: CRCPLAN-448 is the committed search feature, In Progress, in production no later than the end of 2Q2027, under UIESTRAT-84. It covers estate assets, support cases, learning resources, and Ask Red Hat summaries. It does not by itself define the help-panel handoff or the latency design. https://redhat.atlassian.net/browse/CRCPLAN-448

Assumption: Reaching chat from a guide the person is already reading will raise use above the cold-button baseline. The studies on hand do not measure that handoff.

Assumption: Keeping the guide open, and saying what chat is checking, makes a 14 to 90 second Unifi wait usable. That is a design response to the constraint, not a tested result.

Assumption: The 250 to 1,000 cached answers will cover the common questions people actually type. The cache is in development. Coverage is not measured yet.

Assumption: The prototype shortens the analyzing state so a walkthrough can be shown. That shortening is not the production wait. The production design has to show the real one.

## Latency

This is the main design constraint.

A search click today happens in about 10 seconds at the median. Unifi can take longer than that on its fastest query, and up to 90 seconds on a slow one. Ninety seconds is the entire window in the story before standup. A chat that starts the visit, on an empty panel, spends the meeting before the person has a document to read.

The experience therefore splits the wait.

Search and the help document return without Unifi. They are a lookup and a page. Caching for the search metrics protects that speed. The dropdown stays a short list of places and documents.

A common question that hits Omry's cache returns the cached answer and does not enter the 14 to 90 second path.

A question about this person's estate, such as which of his hosts fail the RHEL 10 baseline, goes to Unifi. He has already chosen it from the guide. The guide stays in the drawer. Chat says it is checking his systems. The rest of the console stays usable. When the answer arrives, it cites the rule he can still see.

## Desired Outcome

Sam can tell a teammate which hosts can move to RHEL 10, which cannot, and where that rule is written, without leaving the console and without opening a chat to look up a document. Search finds the guide. Help lets him read it. Chat checks the guide against his fleet and hands him an action he can review.

Search success at GA remains a zero-result rate at or below 30% and abandonment at or below 25%. Chat success, for this vision, is that Ask Red Hat is used from a guide rather than as a cold button. A numeric chat target is not set in the sources for this brief.

## Scope

Situation: One journey on console.redhat.com. Sam searches for RHEL 10 migration guidance, reads the upgrade guide in the help panel, and asks the GUI chatbot to check his registered hosts against that guide. Search preview remains Q3-26 through GA at the end of 2Q2027 for the CRCPLAN-448 scope. The help and chat handoff is the vision the prototype is showing now.

Known constraints:

The GUI chatbot and finding help inside the console are in scope. — Evidence

Search still covers estate assets, support cases, learning resources, and AI answer summaries, within CRCPLAN-448. — Evidence

Unbounded asset types and off-console content stay out of scope. — Evidence

Translation stays in the presentation packet, not in this journey. — Decision already made on the previous narrative

Unifi latency of 14 to 90 seconds is a constraint. Alternative agent frameworks are blocked. — Evidence

The common-answer cache is in development (250 to 1,000 answers) and is the planned way off the slow path for those questions. — Evidence

A playbook or template is generated for the person to review and open in the product. Running a remediation on his hosts without that review is out of scope. — Decision from review of the previous narrative; the prototype opens Automation Execution rather than running the playbook itself

Restricted assets: research wants a host the person cannot open to stay visible, with request access. CRCPLAN-448 hides it. This journey does not depend on that conflict. It stays open. — Evidence

Steerco has not yet completed the PatternFly review. The prototype uses PatternFly masthead, drawer, tabs, and buttons. Gaps and missing components are for that review to name. — Evidence

Starting chat from the help guide will move the under 1% and under 5% figures. — Assumption

An honest wait, with the guide still readable, is enough for the fleet question. — Assumption

## Alignment

JP Sherman's search experience designers and Dan Carol's web team are in design sprints with this work so the console journey and the web journey use one pattern. Steerco will use this vision to find PatternFly gaps and to decide which components are required. Those reviews are how the three surfaces stay one workflow instead of three local designs.

## Stakeholders

| Who | What they care about |
| --- | --- |
| Tracy Rankin, VP | Chat and search integrated. Traffic and engagement moving. Help and search with distinct jobs. |
| Steerco | Gaps against PatternFly guidelines, and the components this vision requires. |
| JP Sherman's search designers | The search step matches the search experience they are designing. |
| Dan Carol's web team | The same handoff holds on the web side of the journey. |
| Omry's team | The cache of common answers, so Unifi is reserved for questions the cache cannot carry. |
| UIE leadership and delivery leads | A journey they can judge: what each surface is for, and how the wait is handled. |

## Presentation Context

The previous brief and narrative treated help as a later push and chat as a summary on the results page. This brief replaces that frame. The prototype reference guide is the artifact to walk. The question leadership will ask first is what happens during the 14 to 90 seconds.

## Resources

Current search, console.redhat.com
https://console.redhat.com/

Prototype, V2.2 Search and Help, including the reference guide
https://sjcox-rh.github.io/HCC-AI-Search/

Connected Experience study, Q3 2026, Richardson and Tan
https://docs.google.com/presentation/d/1kDox5YrU_xw06AlsyVKdFqvFO5uvBFKIrsLI6YFGnFA/edit?slide=id.h1b90e906c620a406_0_12#slide=id.h1b90e906c620a406_0_12

HCC Search Overhaul, Jeff Gehlbach
https://docs.google.com/presentation/d/1WDMprsl5arGubjQxf91ZNgnM_iE8slQQTiq1swbYvj0/edit?slide=id.g3f864fe97d4_0_906#slide=id.g3f864fe97d4_0_906

Amplitude, masthead search then a result click
https://app.amplitude.com/analytics/redhat/chart/pktt0pqd/edit/ppb4cyik

Masthead and search revamp, Q3 queries, Mary Shakshober
https://docs.google.com/presentation/d/1jYGBDdMFwhoPOzk_4PJt1hYgalpCUj6IJemHSGT5PPw/edit?slide=id.g311c88a6bdc_0_9#slide=id.g311c88a6bdc_0_9

CRCPLAN-448, HCC search feature
https://redhat.atlassian.net/browse/CRCPLAN-448

Parent outcome, UIESTRAT-84
https://redhat.atlassian.net/browse/UIESTRAT-84

Previous vision doc, search-only frame, October 2026
https://docs.google.com/document/d/1usDTN8yE64xOsmxXH0bwsMOECeC8RleCLXyPMNsKO-Q/edit
