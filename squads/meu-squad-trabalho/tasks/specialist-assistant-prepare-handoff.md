---
task: prepare-handoff
responsavel: "@specialist-assistant"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: research_report
    tipo: object
    origem: Previous task output
    obrigatorio: true
    validacao: "Must contain verified findings, risks, and source references"
  - campo: synthesis_goal
    tipo: string
    origem: User Input
    obrigatorio: false
    validacao: "Optional focus for the specialist handoff"

Saida:
  - campo: specialist_handoff
    tipo: object
    destino: Return value
    persistido: false

Checklist:
  - "[ ] Review research_report for unsupported or duplicate claims"
  - "[ ] Synthesize findings using specialist-synthesize-findings guidance"
  - "[ ] Precheck output against checklists/specialist-quality-gate.md"
  - "[ ] Prepare open questions, risks, and recommended next action for specialist"
---

# prepare-handoff

## Purpose

Prepare synthesized findings, quality precheck notes, and handoff context for the specialist.

## Execution Steps

### Step 1: Normalize Research Context

Read the research report, preserve source references, and group findings by decision, risk, constraint, and implementation impact.

### Step 2: Synthesize Findings

Use `tasks/specialist-synthesize-findings.md` as the synthesis contract and produce concise recommendations.

### Step 3: Precheck Quality

Run the output through `checklists/specialist-quality-gate.md` and record any unresolved issues.

### Step 4: Prepare Specialist Handoff

Return a handoff with `context_summary`, `verified_findings`, `open_questions`, `risks`, and `recommended_next_action`.

## Error Handling

```yaml
error: HANDOFF_INPUT_INCOMPLETE
cause: research_report is missing required evidence or references
resolution: Request additional research before specialist review
recovery: Return missing fields and blocked handoff status
```

## Metadata

```yaml
version: 1.0.0
created: 2026-06-18
updated: 2026-06-18
author: squad-creator
tags:
  - meu-squad-trabalho
  - specialist-assistant
  - handoff
```
