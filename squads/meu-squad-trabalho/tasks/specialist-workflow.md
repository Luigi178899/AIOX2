# Task: Specialist Workflow

**Task ID:** specialist-task
**Version:** 1.0
**Purpose:** Execute domain-specific analysis and implementation
**Orchestrator:** specialist
**Mode:** Deterministic

## Inputs

- `subject`: The entity or data to be analyzed
- `depth`: Level of analysis required (standard|deep)

## Steps

1. **Initialization**: Load domain context and verify required tools.
2. **Research**: Extract core attributes and cross-reference with existing squad documentation.
3. **Execution**: Apply domain-specific logic to generate the requested output.
4. **Validation**: Run the output through the `specialist-quality-gate.md`.

## Veto Conditions

- `input_missing` → ABORT → "Cannot proceed without subject input"
- `validation_fail` → RETRY → "Output does not meet quality standards"

## Output Format

Follows the structure defined in `templates/specialist-output-tmpl.md`.