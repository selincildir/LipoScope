# LipoScope Research Atlas Traceability Audit

This folder contains a script-backed source-to-code traceability audit for selected cohort-facing sections of the LipoScope Research Atlas.

## Scope

The audit checks the following implemented Research Atlas sections in the unchanged `../LipoScope.html` file:

- Standardized Cohort Builder
- Diagnostic-noise audit
- Cohort Blueprint Export
- Phenotype and Differential Diagnosis Matrix
- Cohort Design Gap Radar
- Lipoedema Minimum Dataset Builder

PubMed-derived discovery sections such as the Knowledge Graph, Candidate Gene and Biomarker Prioritizer, Mechanism Explorer and Gene/Variant Literature Evidence Checker are intentionally outside this Delphi/CCRF traceability audit because their primary logic is literature mapping rather than direct consensus/data-element implementation.

## How the audit is generated

Run:

```bash
node run_research_atlas_alignment_audit.js
python plot_research_atlas_alignment_audit.py
```

The Node script reads `../LipoScope.html` without modifying it. It extracts implemented section IDs, JavaScript functions/constants, cohort-builder form fields, differential-matrix entities, encoded Delphi consensus statements, and Minimum Dataset fields with the app's own Delphi and CCRF-style labels. It then applies the source-requirement dictionary defined inside the script to generate the traceability tables.

The source-requirement dictionary is not hidden: the requirement labels, Delphi statement ranges, CCRF-style domains and search aliases are exported to `source_requirements_from_script.csv`. This makes the mapping assumptions inspectable and rerunnable.

## Main outputs

- `source_requirements_from_script.csv`: predefined Delphi/CCRF source requirements and aliases used by the script.
- `implementation_inventory.csv`: implemented app sections, code identifiers, form fields, dataset fields and differential entities extracted from `LipoScope.html`.
- `function_presence_tests.csv`: required JavaScript identifiers checked for each selected section.
- `section_source_anchor_tests.csv`: section-level mapping counts.
- `source_to_tool_traceability.csv`: row-level source-to-tool traceability table.
- `traceability_figure_matrix.csv`: figure-ready requirement-by-section matrix.
- `minimum_dataset_alignment_from_app.csv`: Minimum Dataset fields extracted from the app with app-generated Delphi and CCRF-style labels.
- `functional_scenario_tests.csv`: three mocked-form scenario checks run through implemented cohort-builder functions.
- `export_output_tests.csv`: export helper checks.
- `figures/`: PNG, PDF and SVG versions of generated figures.

## Purpose

This audit tests whether the selected cohort-facing Research Atlas sections are traceable to Delphi consensus logic and CCRF-style minimum-data logic at the level of implemented fields, functions, prompts and outputs.


