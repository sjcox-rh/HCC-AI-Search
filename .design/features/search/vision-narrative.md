# Vision Narrative: Connected Search and Help

Sam is a system administrator at Money, Inc. He is a composite based on research, and he is also a cartoon. His priority is to get servers trusted and workload-ready without hassle. The authoritative answer is hard to find, a server is not ready until it is reachable, registered, and patched, and one script does not cover cloud, on-prem, and metal. He has to move quickly without adding downtime, regressions, or compliance risk, while alerts and advisories compete for his attention. Quotes are from the Connected Experience study (Q3 2026, n=8, Richardson and Tan) unless another source is named.

## The Setup

It is 8:40 on a Tuesday morning. Sam has twenty minutes before standup. Leadership wants a RHEL 10 migration plan, and Image Mode is on the table. His job is to get those servers trusted and workload-ready. He needs to tell the room which hosts can move, which cannot, and what rule he is using. If he spends the twenty minutes hunting for the guide, he will walk in with a link and no host list.

## Today: Sam's Current Experience

### Beat 1: Search does not find the guide

Sam clicks the masthead on console.redhat.com and types the shorthand he would actually use: RHEL 10 migration image mode.

Nothing useful comes back. Current search returns services, and only about 27% of queries are for content it can return (Q3 query analysis, Shakshober). A 2024 analysis put the zero-result rate at 73% (HCC Search Overhaul, Gehlbach).

He still does not have the upgrade rule, and the first minute is gone.

### Beat 2: Help does not know what he asked

He opens the help drawer. It is a general panel. It does not know he was looking for the RHEL 10 upgrade guide, and it does not know he has 42 RHEL 9 hosts. He scrolls for a document that may live in another site.

A participant described the same split: console search is "mostly for navigation purposes," and documentation sends them to a search engine like Google (Connected Experience).

### Beat 3: Chat is a cold button, and it is slow

Ask Red Hat is available. Almost nobody uses it. Button clicks are under 1%, and Ask Red Hat adoption is under 5% (leadership update, November 2026). Sam does not press it. A chat with no guide and no host list is a detour, and a multi-agent answer through Unifi can take from 14 seconds to 90 seconds. Ninety seconds is the rest of his morning.

He will not spend the standup window staring at a typing indicator.

### Beat 4: He leaves

He opens a web search engine for the migration docs and the services menu for inventory. In the last 90 days, 9,368 external users opened masthead search and 2,512 clicked a result within 60 seconds (26.8%, Amplitude). A 2026 analysis put abandonment at 74% (Gehlbach). Those are different measures. Sam is in the group that does not finish in the console.

Standup starts without a count of hosts that fail the baseline.

## The Pivot

Sam types the same shorthand into the vision masthead. The dropdown returns immediately. The upgrade guide is in the list, with the pre-upgrade assistant and Image Builder. On the guide he can open it, view it in the help panel, or ask Lightspeed.

He views it in the help panel. Search has found the document. He does not need a conversation to learn that the document exists.

## Tomorrow: Sam's New Experience

### Beat 1: Search finds the guide

The dropdown stays short. It is a list of places and documents, not an essay and not a chat. "Upgrading to RHEL 10 & Adopting Image Mode" is there, with View in Help Panel and Ask Lightspeed on the row.

This step does not wait on Unifi. A lookup has to come back in the time people already give a search result. The median click today is 10 seconds (Amplitude). Leadership is protecting that speed, and the zero-result metric, with caching. The first thing Sam sees is the guide.

### Beat 2: Help holds the rule

The help drawer opens on the guide: hardware baseline x86-64-v3, package mode versus Image Mode, and the crypto warning. A callout says Insights sees 42 systems, and 6 do not meet the CPU baseline. The button on that callout is Analyze Fleet Compatibility in Lightspeed.

He reads the rule before he asks anything. The panel is the source. A participant said they use a summary when the source is right there, so they do not have to open ten links (Connected Experience). Here the source is the panel itself.

### Beat 3: Chat applies the rule, and the wait is visible

He chooses the fleet check. Ask Lightspeed opens in the same drawer, with the context named: the RHEL 10 upgrade guide and 42 registered RHEL 9 hosts. The guide stays available. Chat says it is checking his systems against that guide.

This question is about his estate, so it goes through Unifi. That path takes from 14 seconds to 90 seconds, and another framework is not available (leadership update). He is waiting on purpose, with the rule still on screen, and the rest of the console still works. A common question, one of the 250 to 1,000 answers Omry's team is caching, would have returned on the fast path and would not have entered this wait.

The prototype compresses this moment so the flow can be walked. The vision does not. The production chat has to show the real wait.

### Beat 4: The answer is tied to the guide

The answer comes back. 36 hosts can take an in-place upgrade or an image-mode rebase. 6 hosts are pre-Haswell and fail x86-64-v3. He asks for a playbook that verifies those CPU flags. He reads the tasks, then opens the playbook in Automation Execution.

Chat did the part only chat can do: it held his inventory against the guide. He reviews the action before anything runs. The guide is still the thing he would defend in the room.

## The Payoff

At 8:57 Sam can name the rule, the six hosts, and the playbook. He tells his teammate, "I found the guide in search, I read it in help, and I only opened chat to check our hosts."

That is the support the three surfaces are for. Search is how the zero-result and abandonment numbers move: the first result is the document. Help is how he trusts it. Chat is how the under 1% button and the under 5% adoption can move: he opens it because the guide asked a question only his estate can answer, not because a button was in the masthead.

The twenty minutes went to the migration, not to reconstructing which product owned the answer.

## Screen Breakdown

| # | Screen | Where it lives | Narrative moment | Key elements | User action |
| --- | --- | --- | --- | --- | --- |
| 1 | Masthead results | Home, search open, query "RHEL 10 migration image mode" | Pivot and tomorrow, beat 1 | Short dropdown. Upgrade guide, pre-upgrade assistant, Image Builder. View in Help Panel and Ask Lightspeed on the row. No Unifi wait in the list. | Open the guide in the help panel |
| 2 | Help panel, guide | Help drawer, tab "Upgrading to RHEL 10 & Adopting Image Mode" | Tomorrow, beat 2 | x86-64-v3 baseline, package mode versus Image Mode, crypto warning. Callout: 42 systems, 6 below the baseline. Analyze Fleet Compatibility in Lightspeed. | Read the rule, then start the fleet check |
| 3 | Chat, working | Same drawer, Ask Lightspeed tab | Tomorrow, beat 3 | Context: the guide plus 42 RHEL 9 hosts. A visible working state that names the fleet check. Guide still available. This is the 14 to 90 second Unifi path. | Wait, and keep reading the guide |
| 4 | Chat, answer | Same drawer, Ask Lightspeed tab | Tomorrow, beat 4 | 36 hosts ready, 6 blocked as pre-Haswell. Actions: verification playbook, Image Builder template, CSV of incompatible hosts. | Choose the playbook |
| 5 | Playbook to review | Chat, then Automation Execution | Tomorrow, beat 4 | Playbook tasks for the x86-64-v3 flags. Open in Automation Execution. Nothing runs until he takes it there. | Review, then open the playbook |
