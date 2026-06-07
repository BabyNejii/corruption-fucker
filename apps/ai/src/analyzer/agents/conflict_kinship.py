"""Conflict / kinship agent for appointments and competitions."""

from __future__ import annotations

from ..context import AnalysisContext
from ..llm import StructuredLLM
from ..payload import TenderView
from ..redaction import redact_kinship_parties
from ..schemas import ConflictKinshipOutput, Signal
from .base import entity_aggregates_block, full_text_block, load_prompt, tender_brief

NAME = "conflict_kinship"


def run(client: StructuredLLM, view: TenderView, ctx: AnalysisContext) -> ConflictKinshipOutput | None:
    if not client.available:
        return None
    system = load_prompt(NAME)
    user = (
        f"{tender_brief(view)}\n\n"
        f"{entity_aggregates_block(view, ctx)}\n\n"
        f"{full_text_block(view)}"
    )
    output = client.analyze(system, user, ConflictKinshipOutput)
    if output is not None:
        # Privacy/defamation guard: relatives are private third parties — never publish
        # their names (redaction.py). Applied here so agent_outputs is clean too.
        output.named_parties = redact_kinship_parties(output.named_parties)
    return output


def signals(output: ConflictKinshipOutput | None, view: TenderView) -> list[Signal]:
    if output is None:
        return []
    out: list[Signal] = []
    # Defense-in-depth: redact again at the publish boundary (idempotent) so a direct
    # signals() call can never surface a private relative's name.
    parties = redact_kinship_parties(output.named_parties)
    if output.kinship_confidence >= 0.4:
        out.append(
            Signal(
                key="conflict_kinship_llm",
                family="conflict",
                code="CONF01",
                risk=output.kinship_confidence,
                value=parties or None,
                source_field="роднински връзки (LLM)",
                rationale_bg=output.rationale_bg or "Съмнение за роднински връзки при назначение.",
            )
        )
    if output.conflict_confidence >= 0.4:
        out.append(
            Signal(
                key="conflict_of_interest_llm",
                family="conflict",
                code="CONF02",
                risk=output.conflict_confidence,
                value=parties or None,
                source_field="конфликт на интереси (LLM)",
                rationale_bg=output.rationale_bg or "Съмнение за конфликт на интереси.",
            )
        )
    return out
