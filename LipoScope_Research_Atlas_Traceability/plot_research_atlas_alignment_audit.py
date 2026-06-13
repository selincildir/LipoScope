#!/usr/bin/env python3
"""Plot script-generated Research Atlas traceability audit outputs."""
from __future__ import annotations

import csv
import textwrap
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

BASE = Path(__file__).resolve().parent
FIG = BASE / "figures"
FIG.mkdir(exist_ok=True)

COLORS = {
    "Direct": "#11786f",
    "Operationalised": "#315891",
    "Contextual": "#d8891b",
    "": "#f4f0ea",
}
TEXT = "#1f2528"
SUBTEXT = "#6f6960"
GRID = "#ded6c9"
BG = "#fffdf8"


def read_csv(name: str):
    with (BASE / name).open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def save_all(fig, stem: str):
    fig.canvas.draw()
    for ext in ("png", "pdf", "svg"):
        fig.savefig(FIG / f"{stem}.{ext}", bbox_inches="tight", pad_inches=0.25, dpi=320, facecolor="white")
    plt.close(fig)


def wrapped(text: str, width: int) -> str:
    return "\n".join(textwrap.wrap(str(text), width=width, break_long_words=False))


def clean_section(name: str) -> str:
    mapping = {
        "Standardized Cohort Builder": "Cohort\nBuilder",
        "Diagnostic-noise audit": "Noise\nAudit",
        "Cohort Blueprint Export": "Blueprint\nExport",
        "Phenotype and Differential Diagnosis Matrix": "Differential\nMatrix",
        "Cohort Design Gap Radar": "Gap\nRadar",
        "Lipoedema Minimum Dataset Builder": "Minimum\nDataset",
    }
    return mapping.get(name, name)


def short_requirement(name: str) -> str:
    mapping = {
        "Anthropometry and body composition": "Anthropometry /\nbody composition",
        "Oedema/fluid and lymphatic overlap": "Fluid / lymphatic\noverlap",
        "Comorbidities and overlap conditions": "Comorbidities /\noverlap",
        "Future validation and reproducibility needs": "Future validation /\nreproducibility",
        "Phenotype distribution": "Phenotype\ndistribution",
        "Pain and tenderness": "Pain /\ntenderness",
        "Bruising and heaviness": "Bruising /\nheaviness",
        "Nodularity and fibrosis": "Nodularity /\nfibrosis",
        "Family history and genetics": "Family /\ngenetics",
        "Biomarkers and omics": "Biomarkers /\nomics",
        "Outcomes and follow-up": "Outcomes /\nfollow-up",
        "Stage and severity": "Stage /\nseverity",
        "Comparator strategy": "Comparator\nstrategy",
        "Differential diagnosis": "Differential\ndiagnosis",
        "Treatment exposure": "Treatment\nexposure",
        "Case definition": "Case\ndefinition",
    }
    return mapping.get(name, wrapped(name, 16))


def plot_summary():
    section_rows = read_csv("section_source_anchor_tests.csv")
    function_rows = read_csv("function_presence_tests.csv")
    requirement_rows = read_csv("field_requirement_alignment_tests.csv")
    dataset_rows = read_csv("minimum_dataset_alignment_from_app.csv")
    scenario_rows = read_csv("functional_scenario_tests.csv")
    trace_rows = read_csv("source_to_tool_traceability.csv")

    selected_present = sum(1 for r in section_rows if r.get("section_present") == "yes")
    required_present = sum(1 for r in function_rows if r.get("present") == "yes")
    requirements_mapped = sum(1 for r in requirement_rows if int(r.get("mapped_section_count") or 0) > 0)
    dataset_delphi = sum(1 for r in dataset_rows if r.get("has_delphi_alignment") == "yes")
    dataset_ccrf = sum(1 for r in dataset_rows if r.get("has_ccrf_style_tier") == "yes")
    scenarios_passed = sum(1 for r in scenario_rows if r.get("passed") == "yes")
    direct_count = sum(1 for r in trace_rows if r.get("mapping_strength") == "Direct")
    operationalised_count = sum(1 for r in trace_rows if r.get("mapping_strength") == "Operationalised")
    contextual_count = sum(1 for r in trace_rows if r.get("mapping_strength") == "Contextual")

    metrics = [
        ("Selected sections present", selected_present, len(section_rows)),
        ("Required code identifiers", required_present, len(function_rows)),
        ("Source requirements mapped", requirements_mapped, len(requirement_rows)),
        ("Dataset fields with Delphi labels", dataset_delphi, len(dataset_rows)),
        ("Dataset fields with CCRF-style tiers", dataset_ccrf, len(dataset_rows)),
        ("Functional scenarios passed", scenarios_passed, len(scenario_rows)),
    ]
    fig, ax = plt.subplots(figsize=(13.5, 7.2))
    fig.subplots_adjust(left=0.035, right=0.985, top=0.83, bottom=0.12)
    ax.set_axis_off()
    fig.text(0.035, 0.95, "Research Atlas alignment audit summary", fontsize=20, fontweight="bold", color=TEXT, ha="left")
    fig.text(0.035, 0.905, "Counts are generated from unchanged LipoScope.html by the audit script output tables.", fontsize=11.5, color=SUBTEXT, ha="left")

    cols = 3
    card_w = 0.30
    card_h = 0.30
    x0s = [0.025, 0.35, 0.675]
    y0s = [0.52, 0.16]
    for i, (label, val, total) in enumerate(metrics):
        row = i // cols
        col = i % cols
        x = x0s[col]
        y = y0s[row]
        pct = 100 * val / total if total else 0
        color = "#11786f" if pct == 100 else "#d8891b"
        ax.add_patch(Rectangle((x, y), card_w, card_h, facecolor=BG, edgecolor=GRID, linewidth=1.2, transform=ax.transAxes))
        ax.text(x + card_w / 2, y + 0.19, f"{val}/{total}", ha="center", va="center", fontsize=25, fontweight="bold", color=color, transform=ax.transAxes)
        ax.text(x + card_w / 2, y + 0.085, wrapped(label, 24), ha="center", va="center", fontsize=11.2, color=TEXT, transform=ax.transAxes, linespacing=1.2)

    footer = (
        f"Traceability rows: {len(trace_rows)} | "
        f"Direct: {direct_count} | "
        f"Operationalised: {operationalised_count} | "
        f"Contextual: {contextual_count}"
    )
    fig.text(0.035, 0.055, footer, fontsize=11, color="#4f5758", ha="left")
    save_all(fig, "figure_1_alignment_audit_summary")
def plot_matrix():
    rows = read_csv("traceability_figure_matrix.csv")
    sections = [h for h in rows[0].keys() if h not in ("requirement", "source_anchor")]
    n_y = len(rows)
    n_x = len(sections)
    fig, ax = plt.subplots(figsize=(14.6, 11.2))
    fig.subplots_adjust(left=0.255, right=0.985, top=0.82, bottom=0.055)
    fig.text(0.255, 0.965, "Source-to-tool traceability matrix", fontsize=20, fontweight="bold", color=TEXT, ha="left")
    fig.text(0.255, 0.925, "Rows are Delphi/CCRF source requirements; columns are selected cohort-facing Research Atlas sections.", fontsize=11.2, color=SUBTEXT, ha="left")

    ax.set_xlim(0, n_x)
    ax.set_ylim(0, n_y)
    ax.invert_yaxis()
    ax.set_xticks([i + 0.5 for i in range(n_x)])
    ax.set_xticklabels([clean_section(s) for s in sections], fontsize=10.2, linespacing=1.15)
    ax.xaxis.tick_top()
    ax.tick_params(axis="x", pad=10, length=0)
    ax.set_yticks([i + 0.5 for i in range(n_y)])
    ax.set_yticklabels([short_requirement(r["requirement"]) for r in rows], fontsize=9.6, linespacing=1.1)
    ax.tick_params(axis="y", length=0, pad=8)

    for y, row in enumerate(rows):
        for x, section in enumerate(sections):
            value = row[section]
            ax.add_patch(Rectangle((x, y), 1, 1, facecolor=COLORS.get(value, COLORS[""]), edgecolor="white", linewidth=1.5))
            if value:
                ax.text(
                    x + 0.5,
                    y + 0.5,
                    {"Direct": "D", "Operationalised": "O", "Contextual": "C"}.get(value, ""),
                    ha="center",
                    va="center",
                    fontsize=11.2,
                    fontweight="bold",
                    color="white",
                )
    for spine in ax.spines.values():
        spine.set_visible(False)
    save_all(fig, "figure_2_traceability_matrix")


def plot_mapping_strength():
    rows = read_csv("source_to_tool_traceability.csv")
    sections = list(dict.fromkeys(r["atlas_tool"] for r in rows))
    strengths = ["Direct", "Operationalised", "Contextual"]
    counts = {s: {st: 0 for st in strengths} for s in sections}
    for r in rows:
        counts[r["atlas_tool"]][r["mapping_strength"]] += 1

    fig, ax = plt.subplots(figsize=(13.2, 7.2))
    fig.subplots_adjust(left=0.25, right=0.96, top=0.84, bottom=0.14)
    fig.text(0.25, 0.95, "Mapping strength by Research Atlas section", fontsize=20, fontweight="bold", color=TEXT, ha="left")
    fig.text(0.25, 0.908, "Counts are calculated from source_to_tool_traceability.csv.", fontsize=11.2, color=SUBTEXT, ha="left")

    y = list(range(len(sections)))
    left = [0] * len(sections)
    for st in strengths:
        vals = [counts[s][st] for s in sections]
        ax.barh(y, vals, left=left, color=COLORS[st], edgecolor="white", height=0.66)
        for i, v in enumerate(vals):
            if v:
                ax.text(left[i] + v / 2, i, str(v), ha="center", va="center", color="white", fontsize=10.2, fontweight="bold")
        left = [left[i] + vals[i] for i in range(len(vals))]

    ax.set_yticks(y)
    ax.set_yticklabels([clean_section(s).replace("\n", " ") for s in sections], fontsize=10.5)
    ax.invert_yaxis()
    ax.set_xlabel("Number of mapped Research Atlas items", fontsize=11)
    ax.grid(axis="x", color=GRID, linewidth=0.8)
    ax.set_axisbelow(True)
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.tick_params(axis="y", length=0, pad=8)
    save_all(fig, "figure_3_mapping_strength_by_section")


def scenario_label(raw: str) -> str:
    labels = {
        "well_phenotyped_genetics_case": "Well-phenotyped\ngenetics case",
        "self_report_missing_core_review": "Self-report with\nmissing review",
        "fluid_overlap_without_lymph_comparator": "Fluid-overlap\nimaging case",
    }
    return labels.get(raw, wrapped(raw.replace("_", " "), 18))


def plot_scenarios():
    rows = read_csv("functional_scenario_tests.csv")
    labels = [scenario_label(r["scenario"]) for r in rows]
    readiness = [float(r["readiness_score"] or 0) for r in rows]
    noise = [float(r["diagnostic_noise_score"] or 0) for r in rows]
    x = list(range(len(rows)))

    fig, ax = plt.subplots(figsize=(11.8, 6.6))
    fig.subplots_adjust(left=0.105, right=0.975, top=0.82, bottom=0.18)
    fig.text(0.105, 0.95, "Functional scenario checks using implemented cohort-builder functions", fontsize=18.5, fontweight="bold", color=TEXT, ha="left")
    fig.text(0.105, 0.908, "Green bars show case-definition readiness; red bars show diagnostic-noise score. Scores are generated by LipoScope functions with mocked form inputs.", fontsize=10.8, color=SUBTEXT, ha="left")

    ax.bar([i - 0.18 for i in x], readiness, width=0.34, color="#165817", edgecolor="white")
    ax.bar([i + 0.18 for i in x], noise, width=0.34, color="#c95f46", edgecolor="white")
    for i, v in enumerate(readiness):
        ax.text(i - 0.18, min(v + 2.5, 101), f"{v:.0f}", ha="center", fontsize=10.2, color=TEXT)
    for i, v in enumerate(noise):
        ax.text(i + 0.18, min(v + 2.5, 101), f"{v:.0f}", ha="center", fontsize=10.2, color=TEXT)

    ax.set_ylim(0, 108)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=10.2, linespacing=1.15)
    ax.set_ylabel("Score (0-100)", fontsize=11)
    ax.grid(axis="y", color=GRID, linewidth=0.8)
    ax.set_axisbelow(True)
    ax.spines[["top", "right"]].set_visible(False)
    save_all(fig, "figure_4_functional_scenario_scores")

if __name__ == "__main__":
    plot_summary()
    plot_matrix()
    plot_mapping_strength()
    plot_scenarios()
    print(f"Figures written to {FIG}")



