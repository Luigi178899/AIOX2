# Task: Researcher Task

**Task ID:** researcher-task
**Version:** 1.0
**Purpose:** Conduct deep-dive research into specific technical domains or project requirements to provide high-fidelity context for the squad.
**Orchestrator:** specialist
**Mode:** Research-first

## Inputs

- `topic`: The technical subject or domain to investigate.
- `depth`: Depth of research required (standard|exhaustive).

## Steps

1. **Scan Domain**: Identify key documentation, repositories, and industry standards related to the `topic`.
2. **Data Extraction**: Retrieve specific technical details, avoiding generic AI hallucinations.
3. **Verification**: Cross-reference extracted data with the squad's `config/tech-stack.md` to ensure compatibility.
4. **Synthesis**: Generate an actionable research report including implementation risks and benefits.
5. **Quality Gate**: Validate the final report using `checklists/specialist-quality-gate.md`.

## Veto Conditions

- `insufficient_documentation` → ABORT → "Could not find reliable primary sources for the specified topic."
- `vague_intent` → ABORT → "The research topic is too broad to provide deterministic value."

## Output Format

Follows the structure defined in `templates/specialist-output-tmpl.md`.