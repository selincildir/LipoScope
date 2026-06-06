# LipoScope

LipoScope is an open, browser-based lipoedema research atlas for literature exploration, PubMed surveillance, diagnostic standardization, standardized cohort building, gene and biomarker evidence mapping, gene/variant literature checking, cohort design-gap prioritization, and minimum dataset export.

The app is designed for researchers, clinicians, reviewers, educators, and patient-facing research organizations who need a lightweight way to explore the lipoedema/lipedema literature without registration, server upload, or installation.

Current app version: `v2.0.0`

## Web App

Open the app from GitHub Pages:

```text
https://selincildir.github.io/LipoScope/
```

Direct file URL:

```text
https://selincildir.github.io/LipoScope/LipoScope.html
```

## What LipoScope Does

- Opens with `Start Here`, then separates browser-local workspace functions (`Browse Papers`, `Live Search`) from broader PubMed-wide views (`Analytics`, `Research Atlas`).
- Uses color-coded navigation so workspace tabs, Atlas-wide tabs, and orientation/support tabs are visually distinct.
- Provides a curated 200-record default lipoedema/lipedema literature seed with topic, study type, and year filters.
- Searches PubMed live for lipoedema/lipedema papers and lets users add selected records into their local Browse workspace.
- Runs PubMed-only Auto-Discovery across lipoedema research domains with disease-scoped deduplication and abstract-based topic assignment.
- Lets users hide, restore, reset, export, or share their local Browse Papers curation as a portable workspace link.
- Shows structured paper cards with aims/background, methods, key findings, source links, open-access figure lookup where available, and optional local PDF figure preview.
- Keeps user-added records, hidden-paper choices, profile labels, notes, cohort drafts, gene/variant queries, and optional local PDF figure previews in browser storage on the user's own device unless the user chooses to export or share a Browse snapshot.
- Provides a Research Atlas with Corpus Status, Knowledge Graph, Candidate Gene and Biomarker Prioritizer, Mechanism Explorer, Standardized Cohort Builder, Gene and Variant Literature Evidence Checker, Phenotype and Differential Diagnosis Matrix, Cohort Design Gap Radar, and Lipoedema Minimum Dataset Builder.
- Uses the 2026 Lipedema World Alliance Delphi consensus logic and CCRF-style minimum dataset logic to support structured phenotype capture, differential flags, comparator strategy, diagnostic-noise auditing, cohort tiers, and exportable cohort blueprints.
- Checks genes, variants, loci, and pathways against the PubMed-wide lipoedema evidence layer and lipoedema-adjacent biological programs for research triage.
- Identifies cohort-building gaps across genetics, imaging, biomarkers, treatment response, registries, and diagnostic-accuracy studies using the Cohort Design Gap Radar.
- Provides Analytics views that distinguish the user's visible Browse workspace from broader PubMed-wide lipoedema/lipedema evidence signals.
- Includes Start Here orientation material, one static lipoedema overview visual guide, an in-app biology explainer, walkthrough content, and links to external lipoedema organizations and resources.

## Research Atlas Traceability

The folder `LipoScope_Research_Atlas_Traceability/` contains a script-backed source-to-code traceability audit for selected cohort-facing Research Atlas sections. It checks the implemented `LipoScope.html` fields, prompts, functions, outputs, and export variables against Delphi consensus logic and CCRF-style minimum data needs.

The traceability package includes:

- `run_research_atlas_alignment_audit.js` - reads `../LipoScope.html` and regenerates the audit tables.
- `check_research_atlas_traceability.js` - convenience entry point for the same audit.
- `plot_research_atlas_alignment_audit.py` - regenerates the traceability figures from CSV outputs.
- CSV outputs documenting source requirements, implementation inventory, function presence, source-to-tool mappings, minimum dataset alignment, and functional scenario checks.
- `figures/` containing PNG, PDF, and SVG figure exports.

## Privacy and Access

LipoScope is a static single-page web application. It does not require mandatory registration, login, server-side accounts, or server-side upload of local research inputs.

User-added papers, hidden-paper choices, profile labels, local notes, cohort drafts, gene/variant queries, and optional local PDF figure previews are stored in the user's own browser storage. Different users on different devices have independent local collections unless they deliberately open the same shared Browse link.

Local PDF figure previews are separate from the paper database and share-link system. If a user enables device storage, uploaded PDFs stay only in that browser on that device for that local workspace. They are not embedded in shared Browse links, not uploaded to GitHub, and not transferred to other users.

## Data Sources

LipoScope combines:

- a curated 200-record default lipoedema/lipedema literature seed,
- PubMed live searches and an automatically refreshed lipoedema-focused PubMed Atlas layer,
- locally added user records,
- browser-local phenotype, cohort-rule, gene/variant query, note, and figure-PDF inputs supplied by the user.

PubMed results depend on internet access and NCBI service availability.

## Intended Use

LipoScope is intended for research, education, study planning, and literature navigation. It is not a diagnostic tool and should not replace clinical assessment, systematic review methods, or expert medical judgment.

## Repository Contents

- `LipoScope.html` - the full application.
- `index.html` - GitHub Pages entry point that opens `LipoScope.html`.
- `README.md` - project overview and deployment notes.
- `LICENSE` - Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0).
- `CONTENT_LICENSE.md` - repository license summary and attribution guidance.
- `NOTICE.md` - third-party content and use notice.
- `CITATION.cff` - preferred citation metadata for GitHub and research reuse.
- `Lipoedema_understanding_condition.png` - Start Here visual guide asset.
- `LipoScope_Research_Atlas_Traceability/` - script-backed traceability audit tables, scripts, and figures.

## Citation

If you use LipoScope in research, teaching, presentations, or scholarly work, please cite the software repository and, when available, the associated publication, alongside the relevant primary papers surfaced through the app.

Preferred software citation until the journal article is available:

```text
Cildir S. (2026). LipoScope (Version 2.0.0) [Software].
https://github.com/selincildir/LipoScope
```

GitHub citation metadata is provided in `CITATION.cff`.

## License

LipoScope is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0). See `LICENSE` and `CONTENT_LICENSE.md`.

Users may copy and redistribute the original LipoScope repository materials for non-commercial purposes with attribution. Modified or adapted versions may not be shared without prior permission from the copyright holder.

Third-party publications, PubMed metadata, abstracts, external links, DOI-linked content, paper figures, publisher material, and other third-party content surfaced or linked by LipoScope are not relicensed by this repository. They remain subject to their original copyright, license, database, publisher, and access terms. See `NOTICE.md`.

## Author

Developed by Selin Cildir, Centre for Cancer Biology, Adelaide University.

ORCID: [0009-0003-5456-3335](https://orcid.org/0009-0003-5456-3335)
