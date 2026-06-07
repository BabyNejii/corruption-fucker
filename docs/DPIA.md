# DPIA — Data Protection Impact Assessment (starter)

> **СВИНЕКЛАНИЦА / Svineklanitsa Watchdog** · v0.1 · 2026-06-07
> **⚠️ NOT LEGAL ADVICE.** Starter DPIA per GDPR Art. 35. Complete + have a Bulgarian DPO/lawyer review before any public launch. Companion to `docs/LEGAL_AUDIT.md`.

## 1. Why a DPIA is required
The processing is "likely to result in a high risk" under Art. 35(3): it is **systematic, large-scale evaluation/scoring (profiling)** of natural persons (incl. public officials), combines that with **data relating to alleged criminal offences (Art. 10)**, and **publishes** the results. That triggers a mandatory DPIA.

## 2. Description of processing
- **Nature:** scrape public registries → normalize → AI/deterministic detectors compute suspicion scores → admin review → publish "flags"/posts naming institutions, companies and public officials.
- **Scope:** Bulgarian public procurement, payments, company registry, public-official & magistrate declarations, donations, public job competitions.
- **Context:** civic anti-corruption watchdog, public-interest journalism.
- **Data subjects:** company owners/managers; public officials & magistrates; donors; job candidates; site visitors; subscribers.
- **Data categories:** identity + role + financial-declaration data of public figures; company/EIK data; alleged-wrongdoing assessments (Art. 10); technical data (hashed IP); subscriber email.

## 3. Necessity & proportionality
- **Lawful basis:** Art. 6(1)(e)/(f) under the **journalistic-purposes exemption (Art. 85 GDPR / ЗЗЛД чл. 25з)**; subscriptions on consent (6(1)(a)).
- **Art. 10** (offence-related data): relied on under the journalistic exemption; mitigated by mandatory sourcing + editorial verification.
- **Minimisation:** focus on **public office-holders in their public function**; avoid naming private third parties (kinship/donation detectors must redact private individuals); show patterns, not private life.

## 4. Risks to data subjects
| # | Risk | Inherent |
|---|---|---|
| R1 | False/unsupported accusation harms reputation (defamation) | High |
| R2 | Naming a **private** individual (relative/donor) without public-interest justification | High |
| R3 | An automated/AI score read as a factual verdict | Medium |
| R4 | No way for a subject to correct/erase | High |
| R5 | Visitor tracking / re-identification | Low |
| R6 | Demo/illustrative data mistaken for real findings | High |

## 5. Mitigations
**Implemented (2026-06-07):**
- ✅ Mandatory `source_urls` ("no source → no flag") + admin verify-before-publish gate. (R1)
- ✅ Per-card + per-post disclaimer ("съмнение/модел, не присъда — проверете първоизточника"). (R1, R3)
- ✅ Punk tags reframed as **editorial opinion** (tooltip + disclaimer), not statements of fact. (R1)
- ✅ Public **privacy notice** (controller, lawful basis incl. Art. 85, rights) + **right-of-reply** page. (R4)
- ✅ AI-assisted analysis disclosed; human editor approves each publication. (R3)
- ✅ Visitor IP **hashed** (SHA-256), no tracking cookies; honeypot uses isolated fake data. (R5)
- ✅ **Production publishes only real, sourced, human-reviewed records** (R6); the illustrative `DemoSeeder` is dev-only and must not run in production. (The demo banner was removed — this is production, not a demo.)
- ✅ Subscriber email **erased on unsubscribe** (not soft-flagged). (R4)

**Planned (pre-launch):**
- ⏳ Redact private third parties in kinship/donation detectors (only public office-holders named). (R2)
- ⏳ Automated retention/purge of raw scraped snapshots; documented retention schedule. (R5)
- ⏳ Correction-request tracking (currently via email) + published-correction log. (R4)
- ⏳ Lawyer sign-off on the Art. 85 / Art. 10 reliance.

## 6. Residual risk
After implemented mitigations: **Medium** (mainly R2 + the inherent reputational risk of any watchdog). Acceptable for a public-interest tool **provided** the editorial gate, sourcing, and right-of-reply are genuinely operated, and the pre-launch items above are completed.

## 7. Review
Re-assess on: adding a new sphere/detector, processing a new personal-data category, or any complaint indicating harm. Owner: „Свинекланица" екип — ivojd2006@gmail.com.
