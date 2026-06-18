---
task: synthesize-findings
responsavel: "@specialist"
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
    validacao: "Optional focus for the final synthesis"

Saida:
  - campo: synthesized_findings
    tipo: object
    destino: Return value
    persistido: false

Checklist:
  - "[ ] Review verified findings and discard unsupported claims"
  - "[ ] Group findings by decision, risk, and implementation impact"
  - "[ ] Produce concise recommendations with clear next actions"
  - "[ ] Validate output against checklists/specialist-quality-gate.md"
---

# synthesize-findings

## Purpose

Synthesize verified research findings into concise, actionable squad output.

## Pre-Conditions

```yaml
pre-conditions:
  - [ ] Research report is available
    tipo: pre-condition
    blocker: true
    validacao: |
      Confirm research_report contains verified findings and references.
    error_message: "Cannot synthesize findings without a verified research report"
```

## Execution Steps

### Step 1: Review Inputs

Read `research_report`, confirm the evidence level of each finding, and remove unsupported or duplicate claims.

### Step 2: Cluster Findings

Group findings into decisions, risks, constraints, and implementation opportunities.

### Step 3: Generate Synthesis

Produce a concise output with prioritized recommendations, tradeoffs, and next actions.

### Step 4: Validate Output

Run the synthesis against `checklists/specialist-quality-gate.md` before returning it.

## Error Handling

### Error 1: Missing Research Report

```yaml
error: RESEARCH_REPORT_MISSING
cause: Required research_report input was not provided
resolution: Run researcher-task before synthesize-findings
recovery: Request a verified research report from the previous workflow step
```

### Error 2: Unsupported Findings

```yaml
error: UNSUPPORTED_FINDINGS
cause: Findings cannot be traced to verified evidence
resolution: Exclude unsupported findings from the synthesis
recovery: Return a list of findings that require additional research
```

## Post-Conditions

```yaml
post-conditions:
  - [ ] Synthesis is actionable
    tipo: post-condition
    blocker: true
    validacao: |
      Confirm recommendations are concise, prioritized, and traceable to verified findings.
    error_message: "Synthesis must include actionable and evidence-backed recommendations"
```

## Metadata

```yaml
version: 1.0.0
created: 2026-06-18
updated: 2026-06-18
author: squad-creator
tags:
  - meu-squad-trabalho
  - synthesize-findings
```

---

*Task definition created by squad-creator*
