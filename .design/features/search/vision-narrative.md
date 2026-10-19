# Vision Narrative: HCC Search

Priya is a composite cloud ops engineer, not a named study participant. This repo has no persona files. The brief names two roles, org admins and cloud ops engineers. One person carries the story: Priya administers her org's console.redhat.com access and is the person on call when production hosts need a fix. Quotes below are from the Connected Experience study (Q3 2026, n=8, Richardson and Tan) unless another source is named.

## The Setup

It is 8:40 on a Tuesday morning. Priya, a cloud ops engineer, has twenty minutes before standup. Overnight, production RHEL hosts picked up critical CVEs. She needs to tell the room which hosts are affected, whether a case is already open, and where the fix is documented. If search fails her, she will spend the twenty minutes clicking through services and a second browser tab, and she will walk into standup without an answer.

## Today: Priya's Current Experience

### Beat 1: She searches for the hosts

Priya clicks the masthead on [console.redhat.com](https://console.redhat.com/) and types the shorthand she always uses: `rhel critical cve`.

Nothing useful comes back. Current search only returns services, and only about 27% of queries are even for content it can return (Q3 query analysis, Shakshober). A 2024 analysis put the zero-result rate at 73% (HCC Search Overhaul, Gehlbach).

She has already lost the first minute, and she still does not know which hosts are exposed.

### Beat 2: She cannot tell what the field is for

The placeholder says "Search or Ask AI..." Priya does not know whether the next keystroke is a lookup or a chat. She does not want a chat window to take over the page. In research, one person said they hoped clicking search would not "open up like a whole chat box," and that a flyout would be enough (Connected Experience).

She hesitates, deletes the query, and does not trust the field enough to try a full sentence.

### Beat 3: She leaves search

She opens a web search engine for the CVE documentation. A participant described the same split: console search is "mostly for navigation purposes," and documentation sends them to a search engine like Google (Connected Experience).

In the last 90 days, 9,368 external users opened masthead search and 2,512 clicked a result within 60 seconds (26.8%, Amplitude). A 2026 analysis put abandonment at 74% (Gehlbach). Priya is in that majority. The services menu is now how she will hunt for inventory, one product at a time.

### Beat 4: She cannot see the estate at all

The hosts she is looking for are estate assets. Today's search does not index them. She also cannot tell, from an empty result, whether a host in another workspace is hidden on purpose. Research participants said that omitting a restricted asset makes an on-call engineer "confused and ask around" (Connected Experience). The feature that will ship, [CRCPLAN-448](https://redhat.atlassian.net/browse/CRCPLAN-448), chooses the other rule: if her role cannot view an item, search must not reveal that it exists.

She messages a teammate and opens Subscriptions by hand, because most service queries are subscription-related and that is the only neighborhood search understands. Standup starts without a host list.

## The Pivot

Priya types the same shorthand, `rhel critical cve`, into the vision masthead. The field does not become a chat. A short dropdown hangs under it at once: the hosts her role can view, `pci-app-server-01` marked access required, one open support case, and one learning resource. The case opens on the console only once Support on Console has landed ([UIESTRAT-95](https://redhat.atlassian.net/browse/UIESTRAT-95)). The restricted host is already in that dropdown. Enter opens the full results page, which leads with an AI answer that cites the KB article, not a summary she has to take on faith.

## Tomorrow: Priya's New Experience

### Beat 1: The empty field stays light

Priya focuses the masthead. A light overlay shows recent searches, a few shortcuts, and her pinned services. It does not open a chat. The placeholder no longer blurs lookup and conversation.

She can start in under a second, which matches what research asked for: a flyout, not a full assistant (Connected Experience).

### Beat 2: Shorthand finds the estate, the case, and the doc

She types `rhel critical cve`. The dropdown stays short, about three items in each group, with a way to see the rest. No scrolling. No product-download dump. No full AI essay in the overlay.

She sees the affected hosts her role allows, an existing support case, and a getting-started link. `pci-app-server-01` is in that same dropdown, immediately, marked access required, with the owner and Request access. Research participants said that hiding a restricted asset makes an on-call engineer "confused and ask around" (Connected Experience). [CRCPLAN-448](https://redhat.atlassian.net/browse/CRCPLAN-448) currently says the opposite: if her role cannot view an item, search must not reveal that it exists. This vision shows the host in the first results. That conflict with the feature is still open, and the prototype already shows this version.

### Beat 3: The answer is on the results page, and she can check it

She presses Enter. `/search` opens with an AI answer at the top, from Ask Red Hat, and a control to turn AI answers off for this session. Her organization has left summaries on. If the org had disabled them, this block would not be here. The summary names the error, the hosts, and a direct link to the source article. A participant said they use that kind of summary so they "don't need to go to 10 links," especially for something basic, and only when the source is right there (Connected Experience).

She reads the summary and opens the cited article to confirm it matches the hosts. She leaves the summary on. The session control is there for when she wants the rows alone, and the block is absent if her organization has disabled summaries. The dropdown she just left never tried to be this page.

### Beat 4: The destination already knows what she asked

She opens a host she is allowed to see. The overview carries filter chips from the query, so she does not retype the CVE conditions. Request access for `pci-app-server-01` stays on the result she already saw, with the asset and owner filled in.

## The Payoff

At 8:57 Priya has the host list, the open case, and the cited article. She tells her teammate, "I didn't leave the masthead." The twenty minutes went to the incident, not to reconstructing which service owned the answer.

That is the experience behind the GA targets: a zero-result rate at or below 30%, and abandonment at or below 25%.

Running a remediation from the result sits outside this vision. It is risky, and it is not planned by Summit.

Search and help do different jobs. Search is how Priya finds a host, a case, a learning resource, or a cited answer and goes there. Help is guidance for the page she is already on. This journey is search. Help stays the drawer for the current page, so the two features answer different questions.

---

## Screen Breakdown

| # | Screen | Route | Narrative Moment | Key Elements | User Action |
|---|--------|-------|-----------------|--------------|-------------|
| 1 | Masthead, empty | `/` with search focused | Tomorrow, beat 1 | Light overlay: recent, shortcuts, pinned services. No chat. Placeholder that does not say both "search" and "ask" at once. | Focus the field, scan, start typing |
| 2 | Masthead, results | `/` with a query | Tomorrow, beat 2, and the pivot | Short dropdown. About three items per group, then a way to see all. Hosts her role can view, one support case, one learning link. `pci-app-server-01` appears immediately, marked access required, with the owner and Request access. No full AI summary in the dropdown. | Scan, choose a row, or press Enter |
| 3 | Search results | `/search` | Tomorrow, beat 3 | AI answer from Ask Red Hat, with a direct KB citation. On/off for this session, and absent entirely if the org disabled summaries. Mixed results under it: hosts she can view, case, learning. | Read the summary and open the cited article |
| 4 | Host overview | `/overview` with filter chips | Tomorrow, beat 4 | Filter chips carried from the query. Request access for the restricted host was already on the search result. | Open the host |
