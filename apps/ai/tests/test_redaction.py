"""Privacy/defamation guard: private individuals are never named in a published verdict.

Covers redaction.py + its application in the kinship and donation detectors
(docs/LEGAL_AUDIT.md §2.3). The raw private name must never reach a published Signal.
"""

from __future__ import annotations

from analyzer.agents.conflict_kinship import signals as kinship_signals
from analyzer.agents.donation_influence import signals as donation_signals
from analyzer.payload import view_from_record
from analyzer.redaction import (
    KINSHIP_PARTY_BG,
    PRIVATE_DONOR_BG,
    published_donor,
    redact_kinship_parties,
)
from analyzer.schemas import ConflictKinshipOutput, DonationInfluenceOutput

from conftest import make_record


# --- helpers ---------------------------------------------------------------- #


def test_published_donor_generalises_a_private_donor():
    assert published_donor("Иван Петров", "Иван Петров", is_regulated_supplier=False) == PRIVATE_DONOR_BG
    assert published_donor("", "Иван Петров", is_regulated_supplier=False) == PRIVATE_DONOR_BG


def test_published_donor_names_a_regulated_supplier():
    assert published_donor("Доставчик ЕООД", None, is_regulated_supplier=True) == "Доставчик ЕООД"
    # supplier flag but no name -> still generalised, never empty
    assert published_donor("", None, is_regulated_supplier=True) == PRIVATE_DONOR_BG


def test_redact_kinship_parties_strips_names_keeps_count():
    out = redact_kinship_parties(["Иван Петров", "Мария Петрова", "  "])
    assert out == [KINSHIP_PARTY_BG, KINSHIP_PARTY_BG]  # blank dropped, names gone
    assert "Иван Петров" not in out


# --- detector publish boundary --------------------------------------------- #


def test_donation_signal_never_publishes_a_private_donor_name():
    out = DonationInfluenceOutput(
        influence_suspicion=0.9, named_donor="Иван Петров", donor_is_regulated_or_supplier=False
    )
    view = view_from_record(make_record(source="mvr_donations", natural_key="R1", donor="Иван Петров"))
    sigs = donation_signals(out, view)
    assert sigs and sigs[0].key == "donation_influence_llm"
    assert sigs[0].value["donor"] == PRIVATE_DONOR_BG
    assert "Иван Петров" not in str(sigs[0].value)


def test_donation_signal_keeps_a_supplier_name():
    out = DonationInfluenceOutput(
        influence_suspicion=0.9, named_donor="Доставчик ЕООД", donor_is_regulated_or_supplier=True
    )
    view = view_from_record(make_record(source="mvr_donations", natural_key="R2", donor="Доставчик ЕООД"))
    sigs = donation_signals(out, view)
    assert sigs[0].value["donor"] == "Доставчик ЕООД"


def test_kinship_signal_never_publishes_a_relative_name():
    out = ConflictKinshipOutput(kinship_confidence=0.8, named_parties=["Иван Петров", "Мария Петрова"])
    view = view_from_record(make_record(source="mvr_jobs", natural_key="K1"))
    sigs = kinship_signals(out, view)
    assert sigs and sigs[0].key == "conflict_kinship_llm"
    assert "Иван Петров" not in str(sigs[0].value)
    assert "Мария Петрова" not in str(sigs[0].value)
    assert sigs[0].value == [KINSHIP_PARTY_BG, KINSHIP_PARTY_BG]
