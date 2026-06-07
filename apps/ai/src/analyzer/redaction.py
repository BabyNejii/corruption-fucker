"""Privacy / defamation guard for the published verdict.

A PUBLISHED verdict must never name a PRIVATE individual. We name only public
office-holders (in their public function), institutions, and companies. Relatives
surfaced by the kinship detector and private donors are referred to by ROLE, not by
name — the editorial reviewer opens the linked primary source for the identities.

This is the code-level backstop for the prompt rule (see the kinship/donation prompts)
and implements docs/LEGAL_AUDIT.md §2.3 + docs/EDITORIAL_POLICY.md §6. Both helpers are
idempotent, so applying them more than once (run() and signals()) is safe.
"""

from __future__ import annotations

PRIVATE_DONOR_BG = "частен дарител"
KINSHIP_PARTY_BG = "лице за проверка"


def published_donor(named_donor: str, raw_donor: str | None, is_regulated_supplier: bool) -> str:
    """Donor identity safe to publish.

    A donor is named ONLY when it is a regulated supplier / company the ministry buys
    from or licenses — a public-interest entity, and the actual corruption story. A
    private donor (citizen, foundation with no interest) is generalised to a role, so a
    private person is never publicly tied to a corruption signal.
    """
    if is_regulated_supplier:
        name = (named_donor or raw_donor or "").strip()
        if name:
            return name
    return PRIVATE_DONOR_BG


def redact_kinship_parties(parties: list[str]) -> list[str]:
    """Drop the identities of kinship parties (relatives are private third parties),
    keeping only a neutral placeholder per party so the count stays auditable while no
    private name is ever published."""
    return [KINSHIP_PARTY_BG for party in parties if party and str(party).strip()]
