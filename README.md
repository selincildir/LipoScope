# LipoScope

LipoScope is an open, browser-based lipoedema research atlas for literature exploration, PubMed surveillance, biomarker prioritization, local omics overlay, and hypothesis generation.

The app is designed for researchers, clinicians, reviewers, and patient-facing research organizations who need a lightweight way to explore the lipoedema/lipedema literature without registration, server upload, or installation.

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

- Browse a curated lipoedema literature corpus with topic, study type, and year filters.
- Search PubMed live for lipedema/lipoedema papers.
- Add PubMed records into a local browser collection.
- Hide, restore, or reset default literature locally.
- Explore a Research Atlas with knowledge graph, candidate gene/biomarker prioritizer, mechanism explorer, omics overlay, research gap generator, and minimum dataset builder.
- Upload or paste gene, biomarker, proteomics, transcriptomics, or variant lists for local matching.
- View open-access paper figure previews when available through full-text sources.
- Use built-in biology schematics and walkthrough visuals for orientation.

## Privacy and Access

LipoScope is a single-page static web application. It does not require mandatory registration, login, server-side accounts, or server-side upload of local omics data.

User-added papers, hidden-paper choices, profile labels, and local notes are stored in the user's own browser storage. Different users on different devices will have independent local collections unless they export and share data manually.

## Data Sources

LipoScope combines:

- a curated default lipoedema/lipedema literature seed,
- PubMed live searches using lipedema/lipoedema-scoped queries,
- locally added user records,
- browser-local omics or biomarker lists supplied by the user.

PubMed results depend on internet access and NCBI service availability.

## Intended Use

LipoScope is intended for research, education, study planning, and literature navigation. It is not a diagnostic tool and should not replace clinical assessment, systematic review methods, or expert medical judgment.

## Repository Contents

- `LipoScope.html` - the full application.
- `index.html` - GitHub Pages entry point that opens `LipoScope.html`.
- `README.md` - project overview and deployment notes.
- `LICENSE` - MIT License for the software/code.
- `CONTENT_LICENSE.md` - CC BY 4.0 license notice for original non-code content.
- `NOTICE.md` - third-party content and use notice.

## Citation

If you use LipoScope in research, please cite the project page and the relevant primary papers surfaced through the app. 

## License

LipoScope uses a dual-license model:

- Software/code: MIT License. See `LICENSE`.
- Original documentation, educational figures, explanatory text, and curated annotations created for LipoScope: Creative Commons Attribution 4.0 International (CC BY 4.0). See `CONTENT_LICENSE.md`.

Third-party publications, PubMed metadata, abstracts, external links, DOI-linked content, paper figures, publisher material, and other third-party content are not relicensed by this repository. They remain subject to their original copyright, license, database, publisher, and access terms. See `NOTICE.md`.

Suggested Application Note wording:

```text
The LipoScope source code is released under the MIT License. Original documentation, educational figures, explanatory text, and curated annotations are released under Creative Commons Attribution 4.0 International (CC BY 4.0). Third-party publications, PubMed metadata, abstracts, linked external content, and paper figures remain under their original licenses and copyright terms.
```

## Author

Developed by Selin Cildir, Centre for Cancer Biology, Adelaide University.

ORCID: [0009-0003-5456-3335](https://orcid.org/0009-0003-5456-3335)
