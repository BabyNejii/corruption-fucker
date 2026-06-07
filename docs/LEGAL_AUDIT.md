# LEGAL_AUDIT.md — GDPR & Defamation

> **Audit date:** 2026-06-07 · **Scope:** GDPR (Reg. (EU) 2016/679 + Bulgarian ЗЗЛД) and defamation/клевета exposure for **СВИНЕКЛАНИЦА / Svineklanitsa Watchdog**.
> **⚠️ NOT LEGAL ADVICE.** This is an engineering/compliance audit: it maps the code's actual data flows and published claims onto legal principles, rates the risk, and proposes code/copy fixes. Before any **public** launch (beyond the hackathon demo), have a Bulgarian lawyer (ЗЗЛД + медийно право) sign off. The whole product theme — accusing named bodies of corruption — lives or dies on getting this right; CLAUDE.md already says so ("unsourced = disinformation = disqualifying").

## 0. Overall posture

**The good news:** the architecture already contains most of the right *instincts* — mandatory `source_urls` ("no source → no flag"), an admin review/verify gate before publish, "маркираме модели, не осъждаме хора", suspicion-framed copy ("съмнително"), AI prompts that are explicitly told to hedge, IP hashing, strict auth/CSP. These are real defamation/GDPR shields and they are unusually mature for a hackathon.

**The gap:** the *published surface* is sharper than the *internal discipline*. Flag **titles assert facts** ("Община Бургас надплати…"), the **punk tags impute crimes** ("Крадене на пари"), the app processes **data about identifiable people and (alleged) criminal conduct** with **no privacy notice, no legal-basis statement, no data-subject-rights path, no right-of-reply, and indefinite retention**, and the **demo seed attaches fabricated specifics to REAL institutions**. None of these is fatal; all are fixable, several in an hour.

| Area | Residual risk (today) | After the §4.1 quick wins |
|---|---|---|
| GDPR — lawful basis / journalism exemption | 🟠 High | 🟡 Medium |
| GDPR — transparency & data-subject rights | 🔴 Critical (nothing exists) | 🟡 Medium |
| GDPR — DPIA / criminal-offence data (Art. 10) | 🟠 High | 🟠 High (needs real work) |
| Defamation — published framing & punk tags | 🟠 High | 🟡 Medium |
| Defamation — demo data on real bodies | 🔴 Critical (for a public pitch) | 🟢 Low |
| Defamation — no right-of-reply | 🟠 High | 🟡 Medium |

---

## 1. The two shields this product must lean on

Everything below is about *strengthening these two defenses*, because they are what make a corruption watchdog lawful at all:

1. **The journalistic / public-watchdog exemption.** GDPR **Art. 85** (and its Bulgarian transposition, **ЗЗЛД чл. 25з**) requires member states to reconcile data protection with **freedom of expression and information**, including processing **for journalistic purposes**. A genuine anti-corruption watchdog acting in the public interest can disapply large parts of GDPR (much of Ch. II–III) **if** it is structured and documented as journalism/expression. → **You must explicitly claim this**, in a published statement, and behave consistently with it (editorial standards, sourcing, corrections). Right now the claim is implicit in CLAUDE.md but **not stated anywhere a regulator or court would see it.**

2. **"Flag patterns, link the source, don't convict."** In both GDPR (legitimate processing of public-interest info) and defamation (fair comment / value judgment on a matter of public interest, grounded in disclosed true facts), the defensible posture is: *"here is public data, here is why it looks anomalous, here is the primary source — judge for yourself."* The product says this on the About page but **contradicts it in the published titles and tags.** Close that gap and most of the defamation risk collapses.

---

## 2. GDPR audit

### 2.1 Personal-data inventory (what the code actually stores about people)

| Data | Where | Data subjects | Notes |
|---|---|---|---|
| Company `owner_name`, `phone`, `address`, `eik` | `…2026_06_05_100003_create_companies_table.php`; `modules/Procurement/Models/Company.php` | Company owners/managers (identifiable natural persons) | Used for shell/serial-winner clustering |
| Officials' names + **asset/wealth declarations** | scraper `sources/gov_declarations.py`; AI `agents/gov_official_wealth.py` (`official_name`, `named_assets`, `wealth_vs_income_suspicion`) | Senior public officials | Financial-life data; high sensitivity |
| Magistrates' names + declarations | scraper `sources/ivss_declarations.py`; AI `agents/unexplained_wealth.py` | Judges/prosecutors | Same |
| **Kinship/family** relations | AI `agents/conflict_kinship.py` (`named_parties`, `kinship_confidence`) | Officials + their relatives | Relatives are *non-public* third parties — see §2.3 |
| **Donors** + donation amount/date | scraper `sources/mvr_donations.py`; AI `agents/donation_influence.py` (`named_donor`, `quid_pro_quo_suspicion`) | Donors (incl. private persons) | Can edge into Art. 9 if it reveals political opinion |
| Job-competition candidates | `sources/gov_jobs.py`, `mvr_jobs.py`, `mz_jobs.py`, `vss_jobs.py`; AI `magistrate_competition.py` | Named/identifiable applicants | Hiring data |
| Subscriber `email` | `subscribers` table; `/api/subscribe`, `/api/unsubscribe/{token}` | Citizens | Consent/notice gaps — §2.4, §2.6 |
| IP (hashed), 5-yr device cookie `__dvc`, header fingerprint | `FlagViewService::hashIp` (SHA-256/32), `BlacklistMiddleware` | Site visitors | **Well handled** — hashed, TTL'd — §2.8 |
| Flag/post `explanation_bg`, `title`, `subject_label`, `evidence` | `flags`, `posts` tables | Whoever is named in the narrative | The *publication* itself — §3 |

### 2.2 Lawful basis — **the central gap**

- No lawful-basis statement exists anywhere. For the public-interest processing the realistic bases are **Art. 6(1)(e)** (public interest) and/or **6(1)(f)** (legitimate interests — anti-corruption transparency), **operating under the Art. 85 / ЗЗЛД чл. 25з journalistic exemption**.
- **Action:** publish a short *Lawful-basis & journalistic-purpose statement* (can live in the privacy notice). This is the single highest-leverage GDPR fix — it reframes the whole product as protected expression rather than unconsented profiling.

### 2.3 Criminal-offence data (Art. 10) and special category (Art. 9) — be precise

- **Art. 10 (criminal convictions/offences) is the real headline here, not Art. 9.** Publishing that a named company/official engaged in cartel behaviour, rigging, "крадене на пари", etc. is processing personal data **relating to (alleged) criminal offences**, which Art. 10 restricts to processing "under the control of official authority" or when "authorised by Union or Member State law." The journalistic exemption is what carries this — **but only if you actually claim and document it.**
- **Art. 9 (special category)** is narrower than the GDPR-inventory agent suggested: kinship and wealth are *ordinary* personal data, not Art. 9. The genuine Art. 9 risk is **`donation_influence`** *if* a donation reveals a person's **political opinion/affiliation** — keep that detector to organisations/suppliers and avoid inferring private individuals' politics.
- **Relatives flagged by `conflict_kinship`** are private third parties who are **not** public-office holders. This is the most exposed processing in the whole app. Mitigation: only surface kinship for *public* officeholders, never name a private relative, keep `kinship_confidence` high-bar, and never state the relationship as fact (the prompt already says "НЕ доказва роднинство" — make the *UI* honour that).

### 2.4 Transparency (Art. 13/14) — **absent**

- No privacy notice, no controller identity, no contact, no DPO/representative, no processing-purpose disclosure. Because most data is collected **not from the subject** (Art. 14), you owe notice unless the journalism exemption or "disproportionate effort" applies — and you can only rely on those if you've *stated* them.
- **Action:** add `/privacy` (a "Поверителност" page) + an **impressum/контакти** (controller identity + contact). Both are also defamation hygiene (a real, reachable publisher).

### 2.5 Data-subject rights (Art. 15–22) — **absent**

- No access/rectification/erasure/objection path for the people named in flags, nor for subscribers beyond unsubscribe. Even under the journalism exemption, **rectification and objection are effectively expected** for a credible watchdog.
- **Action:** a single **"Поискай корекция / данни"** contact route (email or form → admin queue) covers Art. 15–18/21 *and* doubles as the defamation right-of-reply (§3). One feature kills two findings.

### 2.6 Retention & minimization

- Indefinite retention; no purge; subscriber "delete" is a soft flag (`unsubscribed_at`) that keeps the email. 
- **Action:** define a retention policy (e.g. drop raw scraped snapshots after N months, hard-delete unsubscribed emails), and document it. Minimise: do you need donor/relative *names* to show the pattern, or can you show the relationship without naming the private party?

### 2.7 DPIA (Art. 35) — **likely mandatory**

- This is systematic, large-scale **evaluation/scoring (profiling)** of individuals, combined with **criminal-offence data** and **public-facing** consequences — squarely in the territory where a **Data Protection Impact Assessment is required**. 
- **Action (pre-launch, not pre-demo):** write a short DPIA. It also forces you to document the §2.2 lawful basis and §2.7 risks coherently.

### 2.8 What's already correct (keep it)

- **View-count IP hashing:** `FlagViewService::hashIp` → `substr(hash('sha256',$ip),0,32)`, 24h TTL, never raw. ✅
- **Blacklist** hashes signals, has TTL (no permanent ban), logs hashes not raw IPs. ✅
- **No PII in logs** rule (security.md §9), strict auth/CSP/HTTPS, honeypot uses an **isolated fake dataset, never the real DB**. ✅
- These are genuinely good and materially reduce GDPR exposure on the *visitor* side. The gap is entirely on the *subjects-of-reporting* side.

---

## 3. Defamation / клевета audit

### 3.1 The Bulgarian legal frame (orientation, not advice)

- **Клевета** is both a **criminal** offence (НК чл. 147–148 — fine; harsher if against an official in their duties or "разпространена чрез… средства за масово осведомяване") **and** a basis for **civil damages** (ЗЗД чл. 45 tort).
- **Truth is a defence**; **value judgments** (opinions) on matters of public interest are protected **if they rest on a sufficient, disclosed factual basis** (ECtHR line: *Lingens*, *Jersild*, etc.). Public bodies and public figures must tolerate **wider** criticism; **private companies and private individuals tolerate less.**
- Translation for this product: **"X надплати / X краде" stated as fact about a named private company = high risk.** **"Тази поръчка изглежда аномална — ето данните и източника, преценете сами" = protected.** The safeguards already lean the right way; the published headlines and tags do not.

### 3.2 Safeguards already in place (your defence-in-depth — keep & strengthen)

- **Mandatory sourcing:** `Flag.source_urls` required; `--require-verdict` ingest gate; About page "без източник няма сигнал". ✅ (Truth/basis defence.)
- **Admin editorial gate:** `PostStatus::Draft→Published`, review queue, "Отвори всеки източник и потвърди, че твърдението стои зад него." ✅ (Editorial responsibility.)
- **Hedged AI prompts:** collusion/wealth/kinship/donation prompts all say "бъди сдържан", cap confidence for legally-normal facts. ✅
- **Suspicion framing in places:** "Какво изглежда съмнително", "Защо е съмнително", "Маркираме модели, не осъждаме хора." ✅

### 3.3 The sharp edges (ranked)

1. **🔴 Demo seed fabricates specific accusations against REAL institutions.** `DemoSeeder.php` attaches invented specifics to **real** named bodies — `Община Бургас надплати 2.4× за същия лаптоп`, plus Варна, Пловдив, **УМБАЛ "Света Анна"**, **ВСС** — with `source_urls` to TED notices that do **not** actually substantiate the invented numbers. Shown in a **public pitch** as if real, this is exactly the "disinformation" CLAUDE.md forbids **and** a live libel exposure against real institutions. **Fix before the demo** (§4.1).
2. **🟠 Punk tags impute crimes as fact.** `Крадене на пари` (theft/embezzlement), `Кофти сделки`, `Шуши-муши` rendered as bold filled chips on a named entity = direct imputation of a crime. Re-word toward *assessment* not *verdict* ("Съмнение за…", "Възможно завишение"), or restrict the harshest tags to entities where a finding is documented/adjudicated.
3. **🟠 Flag titles assert facts.** "Община Бургас **надплати**", "Стройинвест Корект **печели** 9 поредни", "Спецификация, **скроена за** един доставчик", explanation "**индикация за разпределяне на пазара**" (cartel). Re-frame as observation+question grounded in the source ("Данните показват 2.4× по-висока цена — без обосновка в документацията"). The *facts* are defensible; the *characterisation-as-guilt* is the exposure.
4. **🟠 No right-of-reply / correction channel.** A named company has no way to respond or demand correction → removes a key "responsible journalism" defence and aggravates damages. (Same fix as §2.5.)
5. **🟡 AI verdicts about named private individuals** (relatives via kinship; donors). Keep verdicts to public officeholders/organisations; never publish a private third party's name as part of a suspicion.
6. **🟡 No per-card disclaimer.** The "patterns, not convictions / verify the source yourself / auto-assisted" framing lives only on the About page, not on the cards/posts where the accusation is read.

---

## 4. Prioritised remediation

### 4.1 Before the public demo — ✅ IMPLEMENTED 2026-06-07

- [x] **Production = real data only.** The "примерни данни" demo banner was **removed** (2026-06-07): this is production with real ingested records, not a demo. The protection against false claims is that every published flag is **sourced + human-reviewed** before going live (§3.2), not a banner. ⚠️ The illustrative `DemoSeeder` rows (real institution names + invented specifics) are **dev/local only and must never run in production**.
- [x] **Standing disclaimer on every flag card & post** — `flags:card.disclaimer` ("Автоматичен сигнал по публични данни — съмнение и модел за проверка, не присъда…") in `AppFlagPostCard` (caption) + `PostView` (Alert).
- [x] **Punk tags reframed as editorial opinion** — `AppTag` tooltip `flags:tagNote` ("Редакторска оценка… мнение, не правно заключение"). Tag words kept (brand); framing added.
- [x] **Privacy + Art. 85 statement + right-of-reply published** — `/privacy` (`PrivacyView`, controller = „Свинекланица" екип, contact ivojd2006@gmail.com, lawful basis incl. Art. 85/Art. 10, rights) and `/corrections` (`CorrectionsView`, mailto). Footer + About links. About page carries the public-interest/journalistic-purpose statement.

### 4.2 Before any real public launch (must-do)

- [x] **Privacy notice (Art. 13/14)** — published at `/privacy` (`legal.json`): controller, purposes, lawful basis (6(1)(e)/(f) under Art. 85/ЗЗЛД 25з), categories, retention, rights, contact. *(Lawyer should still review the text.)*
- [~] **Lawful-basis + Art. 10 memo** — stated on the About page + privacy + `docs/DPIA.md §3`; **still needs lawyer confirmation.**
- [x] **Right-of-reply channel** — `/corrections` page + contact email (mailto). *(In-app request tracking still TODO — §4.2 below.)*
- [x] **DPIA (Art. 35)** — starter at `docs/DPIA.md`; complete + DPO review before launch.
- [~] **Retention/erasure** — ✅ subscriber email **hard-deleted on unsubscribe** (`EloquentSubscriberRepository`); ⏳ automated purge of raw scraped snapshots still TODO.
- [x] **Editorial policy doc** — `docs/EDITORIAL_POLICY.md`.
- [ ] **Private-individual minimisation** — kinship/donation detectors must not name private third parties. **Still TODO** (AI/Python layer).

### 4.3 Hardening / nice-to-have

- [ ] Per-claim "last verified" timestamp + source-reachability check (a dead source = auto-unpublish, matching "no source → no flag").
- [ ] Distinguish in the UI between **deterministic detector** flags and **AI-verdict** flags (label the latter "AI-подпомогнат анализ").
- [ ] Cookie/analytics note (you already avoid tracking cookies — say so; it's a plus).

---

## 5. Key file references

- Personal data: `database/migrations/2026_06_05_100003_create_companies_table.php`, `modules/Procurement/Models/Company.php`, scraper `apps/scraper/src/scraper/sources/{gov_declarations,ivss_declarations,mvr_donations,*_jobs}.py`, AI `apps/ai/src/analyzer/agents/{gov_official_wealth,unexplained_wealth,conflict_kinship,donation_influence}.py` + `schemas.py`.
- Published claims: `modules/Detection/Models/Flag.php`, `modules/Publishing/Enums/PostTag.php`, `lang/bg/enums.php`, `database/seeders/DemoSeeder.php`, `apps/web/src/components/flags/{AppFlagPostCard,AppTag}.tsx`, `apps/web/src/i18n/locales/bg/{about,feed,post,home}.json`.
- Safeguards: `modules/Publishing/Enums/PostStatus.php`, `apps/web/src/i18n/locales/bg/admin.json` (review/verify), `modules/Presentation/Services/FlagViewService.php` (IP hashing), `modules/Identity/...BlacklistMiddleware.php`, `SOURCES.md`, `LICENSE`.
- Absent (confirmed by search): privacy policy, impressum, terms, data-subject-rights endpoints, right-of-reply, retention policy, DPIA, per-card disclaimer.
