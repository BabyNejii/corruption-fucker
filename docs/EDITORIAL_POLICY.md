# Editorial Policy

> **СВИНЕКЛАНИЦА / Svineklanitsa Watchdog** · 2026-06-07
> Our "responsible publisher" standard — the operational backbone of the defamation/GDPR defence in `docs/LEGAL_AUDIT.md`. Every published flag/post must satisfy this.

## 1. The core rule
**Flag patterns, link the source, don't convict.** We publish *"this public data looks anomalous — here is why, here is the primary source, judge for yourself."* We never publish a statement of guilt as established fact.

## 2. Sourcing standard (non-negotiable)
- **No source → no publication.** Every flag carries ≥1 primary `source_url` a reader can open.
- The cited source must **actually substantiate** the specific claim — the reviewer opens each source and confirms.
- The underlying facts (prices, dates, counts) must be **true and verifiable**; characterisation is framed as suspicion/opinion.

## 3. Who can publish
- Only authenticated **admins**. Public users can never author.
- Flags start in **draft/pending**; they go live only after a human review passes the checklist below.

## 4. Pre-publish checklist
1. Each source link opens and supports the claim.
2. Title/explanation describe an **observation**, not a verdict (no "X е престъпник/открадна"; prefer "данните показват…/изглежда…").
3. Punk tags are used as **editorial opinion**, grounded in the cited facts.
4. Subject is a **public** body, company, or **public office-holder in their public function** — **no private third parties** named (relatives, donors who are private individuals are redacted).
5. The standing disclaimer ("съмнение/модел, не присъда") is present (it is, by component).
6. If AI-assisted, that is disclosed (it is, by component).

## 5. Corrections & right-of-reply
- Anyone affected can write to **ivojd2006@gmail.com** (see the `/corrections` page).
- If a claim is **not supported** by its source, we **correct or remove** it promptly.
- On request, the subject's reply may be published alongside the flag.
- Keep a log of corrections made (planned: in-app; for now, email thread + commit history).

## 6. Private individuals & special data
- Default to **not naming** private individuals. Name only public office-holders, in their public function.
- Avoid inferring Art. 9 data (e.g. political opinion from a donation). Detectors must keep such inferences to organisations/suppliers.

## 7. Demo vs. real data
- Seeded/illustrative data is shown only with the **"Примерни данни"** banner (`VITE_DEMO_DATA`). Never present illustrative examples as real findings about real bodies in a public context.

## 8. Review
This policy is reviewed when a new detector/sphere is added or after any complaint. Owner: „Свинекланица" екип.
