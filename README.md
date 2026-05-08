# LipoScope

LipoScope is an open, browser-based lipoedema research atlas for literature exploration, PubMed surveillance, biomarker prioritization, local omics overlay, and hypothesis generation.

The app is designed for researchers, clinicians, reviewers, and patient-facing research organizations who need a lightweight way to explore the lipoedema/lipedema literature without registration, server upload, or installation.

Current app version: `v1.7.4`

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

- Opens with `Start Here` first, then separates the app into a browser-local workspace flow (`Browse Papers`, `Live Search`) and broader PubMed-wide lipoedema Atlas views (`Analytics`, `Research Atlas`).
- Uses color-coded navigation to make the distinction visible in the UI: workspace tabs are teal, Atlas-wide tabs are indigo, and orientation/support tabs are rose.
- Browse a curated lipoedema literature corpus with topic, study type, and year filters.
- Search PubMed live for lipedema/lipoedema papers.
- Add PubMed records into a local browser collection.
- Run PubMed-only Auto-Discovery across 10 lipoedema research domains with disease-scoped deduplication and abstract-based topic assignment.
- Hide, restore, or reset default literature locally.
- Share the current Browse Papers curation with a one-click link that recreates the same Browse view in another browser, without import/export or registration.
- Explore a Research Atlas with knowledge graph, candidate gene/biomarker prioritizer, mechanism explorer, omics overlay, research gap generator, and minimum dataset builder.
- Use PubMed-wide Atlas views that remain anchored to the full lipoedema/lipedema evidence layer, even when the local Browse corpus is hidden, edited, or expanded.
- Use Analytics that now prefers live PubMed Atlas-backed charting, with clearer `Live`, `Cached live`, and `Estimated` states instead of dropping straight into opaque fallback behavior.
- Review generated biology and translation figures that update from the same PubMed-wide evidence source used by the Atlas.
- Upload or paste gene, biomarker, proteomics, transcriptomics, or variant lists for local matching.
- View open-access paper figure previews when available through full-text sources.
- Upload a paper PDF locally to preview likely figure pages in the browser while keeping the existing source-figure links available.
- Optionally keep uploaded figure PDFs on the same device for the same local workspace so previews survive refresh without being added to shared links.
- Use built-in biology schematics and walkthrough visuals for orientation.

## Privacy and Access

LipoScope is a single-page static web application. It does not require mandatory registration, login, server-side accounts, or server-side upload of local omics data.

User-added papers, hidden-paper choices, profile labels, and local notes are stored in the user's own browser storage. Different users on different devices will have independent local collections unless they deliberately open the same shared Browse link.

Local PDF figure previews are separate from the paper database and share-link system. If a user enables device storage, uploaded PDFs stay only in that browser on that device for that specific local workspace. They are not embedded in shared Browse links, not uploaded to GitHub, and not transferred to other users.

## Data Sources

LipoScope combines:

- a curated 200-record default lipoedema/lipedema literature seed,
- PubMed live searches and an automatically refreshed lipoedema-focused PubMed Atlas layer,
- locally added user records,
- browser-local omics or biomarker lists supplied by the user.

PubMed results depend on internet access and NCBI service availability.

## Intended Use

LipoScope is intended for research, education, study planning, and literature navigation. It is not a diagnostic tool and should not replace clinical assessment, systematic review methods, or expert medical judgment.

## Repository Contents

- `LipoScope.html` - the full application.
- `index.html` - GitHub Pages entry point that opens `LipoScope.html`.
- `README.md` - project overview and deployment notes.
- `LICENSE` - GNU Affero General Public License v3.0 (AGPL-3.0) for the software/code.
- `CONTENT_LICENSE.md` - CC BY-NC 4.0 license notice for original non-code content.
- `NOTICE.md` - third-party content and use notice.
- `CITATION.cff` - preferred citation metadata for GitHub and research reuse.

## Citation

If you use LipoScope in research, teaching, presentations, or derivative scholarly work, please cite the software repository and, when available, the associated publication, alongside the relevant primary papers surfaced through the app.

Preferred software citation until the journal article is available:

```text
Cildir S. (2026). LipoScope (Version 1.7.4) [Software].
https://github.com/selincildir/LipoScope
```

GitHub citation metadata is provided in `CITATION.cff`.

## License

LipoScope uses a dual-license model:

- Software/code: GNU Affero General Public License v3.0 (AGPL-3.0). See `LICENSE`.
- Original documentation, educational figures, explanatory text, and curated annotations created for LipoScope: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0). See `CONTENT_LICENSE.md`.

This means the app remains openly available for public use, while stronger copyleft terms apply to the codebase and commercial reuse of original non-code content is not permitted without permission.

Third-party publications, PubMed metadata, abstracts, external links, DOI-linked content, paper figures, publisher material, and other third-party content are not relicensed by this repository. They remain subject to their original copyright, license, database, publisher, and access terms. See `NOTICE.md`.

## Author

Developed by Selin Cildir, Centre for Cancer Biology, Adelaide University.

ORCID: [0009-0003-5456-3335](https://orcid.org/0009-0003-5456-3335)
