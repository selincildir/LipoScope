'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const packageDir = __dirname;
const projectDir = path.resolve(packageDir, '..');
const appPath = path.join(projectDir, 'LipoScope.html');
const appText = fs.readFileSync(appPath, 'utf8');
const appLines = appText.split(/\r?\n/);

const SELECTED_SECTIONS = [
  { key: 'cohort_builder', label: 'Standardized Cohort Builder', sectionId: 'atlas-section-dx', required: ['collectPhenotypeForm','buildPhenotypeProfile','buildCaseReadiness','buildStudyReadinessScores'] },
  { key: 'diagnostic_noise_audit', label: 'Diagnostic-noise audit', sectionId: 'atlas-section-dx', required: ['buildDiagnosticNoiseAudit','diagnosticNoiseMatrixHtml'] },
  { key: 'cohort_blueprint_export', label: 'Cohort Blueprint Export', sectionId: 'atlas-section-dx', required: ['buildEligibilityPlan','cohortTemplateHtml','cohortTemplateText','cohortMethodsSentence','cohortCaseCsvRows','downloadAtlasExport'] },
  { key: 'differential_matrix', label: 'Phenotype and Differential Diagnosis Matrix', sectionId: 'atlas-section-differential', required: ['ATLAS_DIFFERENTIAL','renderDifferentialMatrix'] },
  { key: 'gap_radar', label: 'Cohort Design Gap Radar', sectionId: 'atlas-section-gaps', required: ['buildAtlasGaps','cohortDesignGapGridHtml','cohortGapTextForRequirement'] },
  { key: 'minimum_dataset', label: 'Lipoedema Minimum Dataset Builder', sectionId: 'atlas-section-dataset', required: ['ATLAS_DATASET_FIELDS','atlasDatasetRowsWithUse','atlasRedcapRows','atlasDatasetDelphiMapping','atlasDatasetCcrfClass','renderDatasetBuilder'] }
];

const SOURCE_REQUIREMENTS = [
  { key:'case_definition', label:'Case definition', source:'Delphi+CCRF', delphi:'S1-S8; S41-S44', ccrf:'Diagnosis source / case-definition fields', aliases:['diagnosis','diagnostic','case definition','case-definition','adjudicator','confirmed','self-reported','cohort definition','cohort type'] },
  { key:'symptoms', label:'Symptoms', source:'Delphi+CCRF', delphi:'S1-S8', ccrf:'Core symptom and history fields', aliases:['symptom','pain','tenderness','heaviness','bruising','hematoma','onset','history'] },
  { key:'phenotype_distribution', label:'Phenotype distribution', source:'Delphi+CCRF', delphi:'S1-S8', ccrf:'Phenotype distribution / body-region fields', aliases:['distribution','symmetry','symmetric','bilateral','upper limb','lower limb','hands','feet','sparing','disproportion'] },
  { key:'pain_tenderness', label:'Pain and tenderness', source:'Delphi+CCRF', delphi:'S1-S8; S45-S52', ccrf:'Pain score / symptom severity fields', aliases:['pain','tenderness','nrs','visual analog','vas','quality of life','qol'] },
  { key:'bruising_heaviness', label:'Bruising and heaviness', source:'Delphi+CCRF', delphi:'S1-S8', ccrf:'Symptom signs / bruising-heaviness fields', aliases:['bruising','bruise','hematoma','haematoma','heaviness'] },
  { key:'stage_severity', label:'Stage and severity', source:'Delphi+CCRF', delphi:'S1-S8; S45-S52', ccrf:'Stage / severity / phenotype grade fields', aliases:['stage','severity','type','staging','stage/severity'] },
  { key:'anthropometry', label:'Anthropometry and body composition', source:'Delphi+CCRF', delphi:'S9-S18; S41-S44', ccrf:'Height, weight, BMI, waist, hip, limb measures', aliases:['height','weight','bmi','waist','hip','whtr','whr','anthropometry','limb measures','circumference','body composition'] },
  { key:'fluid_overlap', label:'Oedema/fluid and lymphatic overlap', source:'Delphi+CCRF', delphi:'S9-S18; S19-S28', ccrf:'Fluid/lymphatic assessment and overlap fields', aliases:['edema','oedema','fluid','lymph','lymphatic','lymphoedema','lymphedema','pitting','stemmer','venous'] },
  { key:'nodularity_fibrosis', label:'Nodularity and fibrosis', source:'Delphi+CCRF', delphi:'S9-S18; S29-S40', ccrf:'Tissue texture / fibrosis / imaging fields', aliases:['nodularity','nodule','fibrosis','fibrotic','tissue texture','extracellular matrix','ecm','imaging'] },
  { key:'differential_diagnosis', label:'Differential diagnosis', source:'Delphi+CCRF', delphi:'S19-S28; S41-S44', ccrf:'Differential review fields', aliases:['differential','obesity','lymphoedema','lymphedema','venous','dercum','lipodystrophy','hypermobility','mimic'] },
  { key:'comorbidities', label:'Comorbidities and overlap conditions', source:'Delphi+CCRF', delphi:'S19-S28; S45-S52', ccrf:'Comorbidity / overlap-condition fields', aliases:['comorbid','comorbidity','obesity','venous','hypermobility','thyroid','migraine','asthma','urinary','metabolic'] },
  { key:'comparator_strategy', label:'Comparator strategy', source:'Delphi+CCRF', delphi:'S41-S44; S53-S59', ccrf:'Comparator / control-group planning fields', aliases:['comparator','control','matched','healthy','disease comparator','stratify','exclude','covariate'] },
  { key:'treatment_exposure', label:'Treatment exposure', source:'Delphi+CCRF', delphi:'S29-S40; S45-S52', ccrf:'Conservative/surgical treatment exposure fields', aliases:['treatment','compression','surgery','liposuction','intervention','exposure','therapy'] },
  { key:'outcomes_followup', label:'Outcomes and follow-up', source:'Delphi+CCRF', delphi:'S29-S40; S45-S52', ccrf:'Outcomes / follow-up / adverse event fields', aliases:['outcome','endpoint','follow-up','follow up','longitudinal','adverse','qol','quality of life','response'] },
  { key:'family_genetics', label:'Family history and genetics', source:'Delphi+CCRF', delphi:'S53-S59', ccrf:'Family history / genetics study fields', aliases:['family','familial','genetic','genetics','variant','ancestry','relative','affected relative','sequencing','gwas'] },
  { key:'biomarkers_omics', label:'Biomarkers and omics', source:'Delphi+CCRF', delphi:'S53-S59', ccrf:'Biomarker/omics/specimen metadata fields', aliases:['biomarker','omics','transcript','proteom','metabolom','biospecimen','specimen','assay','gene','variant'] },
  { key:'future_validation', label:'Future validation and reproducibility needs', source:'Delphi+CCRF+PubMed', delphi:'S53-S59', ccrf:'Study-specific / validation / exploratory fields', aliases:['validation','reproducibility','replication','future','gap','minimum dataset','standard','standardised','standardized','protocol','redcap'] }
];

const SECTION_REQUIREMENT_RULES = {
  cohort_builder: ['case_definition','symptoms','phenotype_distribution','pain_tenderness','bruising_heaviness','stage_severity','anthropometry','fluid_overlap','differential_diagnosis','comorbidities','comparator_strategy','family_genetics','biomarkers_omics','treatment_exposure','outcomes_followup'],
  diagnostic_noise_audit: ['case_definition','symptoms','anthropometry','fluid_overlap','differential_diagnosis','comorbidities','comparator_strategy','family_genetics','biomarkers_omics','future_validation'],
  cohort_blueprint_export: ['case_definition','symptoms','phenotype_distribution','pain_tenderness','stage_severity','anthropometry','fluid_overlap','differential_diagnosis','comorbidities','comparator_strategy','treatment_exposure','outcomes_followup','family_genetics','biomarkers_omics','future_validation'],
  differential_matrix: ['case_definition','symptoms','phenotype_distribution','pain_tenderness','bruising_heaviness','stage_severity','fluid_overlap','nodularity_fibrosis','differential_diagnosis','comorbidities','anthropometry'],
  gap_radar: ['case_definition','symptoms','anthropometry','fluid_overlap','differential_diagnosis','comorbidities','comparator_strategy','treatment_exposure','outcomes_followup','family_genetics','biomarkers_omics','future_validation','stage_severity'],
  minimum_dataset: ['case_definition','symptoms','phenotype_distribution','pain_tenderness','bruising_heaviness','stage_severity','anthropometry','fluid_overlap','nodularity_fibrosis','differential_diagnosis','comorbidities','comparator_strategy','treatment_exposure','outcomes_followup','family_genetics','biomarkers_omics','future_validation']
};

const DIRECT_RULES = {
  cohort_builder: new Set(['case_definition','symptoms','phenotype_distribution','pain_tenderness','bruising_heaviness','stage_severity','anthropometry','fluid_overlap','differential_diagnosis','comorbidities','family_genetics']),
  differential_matrix: new Set(['case_definition','symptoms','phenotype_distribution','pain_tenderness','bruising_heaviness','stage_severity','fluid_overlap','differential_diagnosis','comorbidities']),
  minimum_dataset: new Set(['case_definition','symptoms','phenotype_distribution','pain_tenderness','bruising_heaviness','stage_severity','anthropometry','fluid_overlap','nodularity_fibrosis','differential_diagnosis','comorbidities','comparator_strategy','treatment_exposure','outcomes_followup','family_genetics','biomarkers_omics'])
};

function norm(s) { return String(s || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim(); }
function stripTags(s) { return norm(s); }
function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function lineOf(term) { const idx = appText.indexOf(term); if (idx < 0) return ''; return appText.slice(0, idx).split(/\r?\n/).length; }
function countAny(text, aliases) { const t = String(text || '').toLowerCase(); return aliases.reduce((n, a) => n + (t.includes(String(a).toLowerCase()) ? 1 : 0), 0); }
function hasAllTerms(text, terms) { return terms.every(t => String(text || '').includes(t)); }
function writeJson(name, obj) { fs.writeFileSync(path.join(packageDir, name), JSON.stringify(obj, null, 2), 'utf8'); }
function csvEscape(v) { const s = v === null || v === undefined ? '' : String(v); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
function writeCsv(name, rows) { if (!rows.length) { fs.writeFileSync(path.join(packageDir, name), '', 'utf8'); return; } const headers = Object.keys(rows[0]); const out = [headers.join(',')].concat(rows.map(r => headers.map(h => csvEscape(r[h])).join(','))).join('\n'); fs.writeFileSync(path.join(packageDir, name), out + '\n', 'utf8'); }
function startIndexForId(id) { let idx = appText.indexOf(`id="${id}"`); if (idx < 0) idx = appText.indexOf(`id='${id}'`); return idx; }
function sectionHtml(id) { const idx = startIndexForId(id); if (idx < 0) return ''; const starts = SELECTED_SECTIONS.map(s => startIndexForId(s.sectionId)).filter(i => i > idx); const end = starts.length ? Math.min(...starts) : Math.min(appText.length, idx + 30000); const start = Math.max(0, appText.lastIndexOf('<', idx)); return appText.slice(start, end); }
function snippet(identifier) { const idx = appText.indexOf(identifier); if (idx < 0) return ''; return appText.slice(Math.max(0, idx - 1500), Math.min(appText.length, idx + 5000)); }
function evidenceLine(identifier) { const ln = lineOf(identifier); return ln ? `LipoScope.html:${ln}` : ''; }

function extractDxFields(dxHtml) {
  const rows = [];
  const labelInputRe = /<label\b[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/label>[\s\S]{0,400}?(?:<input|<select|<textarea)\b[^>]*id="\1"[^>]*>/gi;
  let m;
  while ((m = labelInputRe.exec(dxHtml))) {
    rows.push({ field_id: m[1], field_label: stripTags(m[2]), source: 'label-for' });
  }
  const checkRe = /<label\b[^>]*class="[^"]*atlas-check[^"]*"[^>]*>\s*<input\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/label>/gi;
  while ((m = checkRe.exec(dxHtml))) {
    rows.push({ field_id: m[1], field_label: stripTags(m[2]), source: 'checkbox-label' });
  }
  const seen = new Set();
  return rows.filter(r => { if (seen.has(r.field_id)) return false; seen.add(r.field_id); return true; });
}

function makeSandbox() {
  const store = {};
  function defaultEl(id) {
    return store[id] || (store[id] = { id, value:'', checked:false, innerHTML:'', textContent:'', style:{}, dataset:{}, classList:{ add(){}, remove(){}, toggle(){} }, addEventListener(){}, querySelector(){ return null; }, querySelectorAll(){ return []; }, setAttribute(){}, appendChild(){}, remove(){}, scrollIntoView(){} });
  }
  const documentMock = {
    getElementById: defaultEl,
    querySelector(){ return null; },
    querySelectorAll(){ return []; },
    createElement(tag){ return defaultEl('created-' + tag + '-' + Math.random()); },
    addEventListener(){}
  };
  const localStore = {};
  const sandbox = {
    console,
    setTimeout(){}, clearTimeout(){},
    document: documentMock,
    window: { location:{ search:'', hash:'' }, addEventListener(){}, matchMedia(){ return { matches:false, addEventListener(){}, removeEventListener(){} }; } },
    navigator: { userAgent:'node' },
    localStorage: { getItem(k){ return localStore[k] || null; }, setItem(k,v){ localStore[k] = String(v); }, removeItem(k){ delete localStore[k]; } },
    Blob: function(parts, opts){ this.parts = parts; this.opts = opts; },
    URL: { createObjectURL(){ return 'blob:mock'; }, revokeObjectURL(){} },
    atlasEsc(s){ return String(s ?? '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch])); },
    jsStringEsc(s){ return String(s ?? '').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n'); },
    showToast(){},
    profileKey(k){ return k; },
    elements:{},
    __store: store
  };
  sandbox.global = sandbox;
  sandbox.globalThis = sandbox;
  return sandbox;
}

function loadAtlasJs() {
  const start = appText.indexOf('var ATLAS_CONSENSUS_SOURCE');
  const endMarker = appText.indexOf('//  TOAST', start);
  if (start < 0 || endMarker < 0) throw new Error('Could not find Research Atlas JS block boundaries.');
  const block = appText.slice(start, endMarker);
  const sandbox = makeSandbox();
  vm.createContext(sandbox);
  vm.runInContext(block, sandbox, { timeout: 5000, filename:'LipoScope_ResearchAtlas_Block.js' });
  function get(name) {
    try { return vm.runInContext(name, sandbox, { timeout: 1000 }); } catch (e) { return sandbox[name]; }
  }
  return { sandbox, get };
}

const atlas = loadAtlasJs();
const dxHtml = sectionHtml('atlas-section-dx');
const dxFields = extractDxFields(dxHtml);
const datasetFields = atlas.get('ATLAS_DATASET_FIELDS') || [];
const consensusStatements = atlas.get('ATLAS_CONSENSUS_STATEMENTS') || [];
const differentialRows = atlas.get('ATLAS_DIFFERENTIAL') || [];

function datasetRowsWithMapping() {
  return datasetFields.map(row => {
    let delphi = '';
    let ccrf = '';
    try { delphi = atlas.sandbox.atlasDatasetDelphiMapping(row); } catch (e) { delphi = ''; }
    try { ccrf = atlas.sandbox.atlasDatasetCcrfClass(row); } catch (e) { ccrf = ''; }
    return { ...row, delphi_mapping: delphi, ccrf_class: ccrf };
  });
}
const datasetRows = datasetRowsWithMapping();

const implementationInventory = [];
SELECTED_SECTIONS.forEach(sec => {
  const html = sectionHtml(sec.sectionId);
  implementationInventory.push({ section: sec.label, item_type:'section_html', item_name: sec.sectionId, detected: html ? 'yes' : 'no', line_or_count: evidenceLine(sec.sectionId), detail: stripTags(html).slice(0, 500) });
  sec.required.forEach(id => implementationInventory.push({ section: sec.label, item_type:'code_identifier', item_name: id, detected: appText.includes(id) ? 'yes' : 'no', line_or_count: evidenceLine(id), detail: snippet(id).slice(0, 500).replace(/\s+/g, ' ') }));
});
dxFields.forEach(r => implementationInventory.push({ section:'Standardized Cohort Builder', item_type:'form_field', item_name:r.field_id, detected:'yes', line_or_count:r.source, detail:r.field_label }));
datasetRows.forEach(r => implementationInventory.push({ section:'Lipoedema Minimum Dataset Builder', item_type:'dataset_field', item_name:r.field, detected:'yes', line_or_count:r.ccrf_class || '', detail:`${r.domain}; ${r.label}; ${r.use}; ${r.delphi_mapping}` }));
differentialRows.forEach(r => implementationInventory.push({ section:'Phenotype and Differential Diagnosis Matrix', item_type:'differential_entity', item_name:r.name, detected:'yes', line_or_count:'ATLAS_DIFFERENTIAL', detail:[r.typical, r.overlap, r.distinguish].join(' | ') }));

const functionPresenceRows = SELECTED_SECTIONS.flatMap(sec => sec.required.map(id => ({ section: sec.label, code_identifier: id, present: appText.includes(id) ? 'yes' : 'no', line: lineOf(id), evidence: evidenceLine(id) })));

function sectionEvidence(sec) {
  let text = sectionHtml(sec.sectionId) + '\n';
  sec.required.forEach(id => { text += '\n' + snippet(id); });
  if (sec.key === 'cohort_builder' || sec.key === 'diagnostic_noise_audit' || sec.key === 'cohort_blueprint_export') text += '\n' + dxFields.map(f => `${f.field_id} ${f.field_label}`).join('\n');
  if (sec.key === 'differential_matrix') text += '\n' + differentialRows.map(r => Object.values(r).join(' ')).join('\n');
  if (sec.key === 'minimum_dataset') text += '\n' + datasetRows.map(r => `${r.domain} ${r.field} ${r.label} ${r.use} ${r.delphi_mapping} ${r.ccrf_class}`).join('\n');
  if (sec.key === 'gap_radar') text += '\n' + snippet('buildAtlasGaps') + '\n' + snippet('cohortDesignGapGridHtml') + '\n' + snippet('cohortGapTextForRequirement');
  return text;
}

function mappingStrength(secKey, reqKey, detected) {
  if (!detected) return '';
  if (DIRECT_RULES[secKey] && DIRECT_RULES[secKey].has(reqKey)) return 'Direct';
  if (secKey === 'differential_matrix') return 'Contextual';
  if (secKey === 'gap_radar' && ['future_validation','comparator_strategy','outcomes_followup','family_genetics','biomarkers_omics','treatment_exposure'].includes(reqKey)) return 'Operationalised';
  if (secKey === 'gap_radar') return 'Operationalised';
  if (secKey === 'diagnostic_noise_audit' || secKey === 'cohort_blueprint_export') return 'Operationalised';
  if (secKey === 'minimum_dataset' && reqKey === 'future_validation') return 'Operationalised';
  if (secKey === 'cohort_builder' && ['comparator_strategy','treatment_exposure','outcomes_followup','biomarkers_omics','future_validation'].includes(reqKey)) return 'Operationalised';
  return 'Contextual';
}

function sourceTypeFor(secKey, req) {
  if (secKey === 'gap_radar') return 'Delphi+CCRF+PubMed';
  if (req.source.includes('PubMed')) return req.source;
  return req.source;
}

const traceabilityRows = [];
SELECTED_SECTIONS.forEach(sec => {
  const text = sectionEvidence(sec);
  const allowed = new Set(SECTION_REQUIREMENT_RULES[sec.key] || []);
  SOURCE_REQUIREMENTS.forEach(req => {
    const aliasHits = countAny(text, req.aliases);
    const detected = allowed.has(req.key) && aliasHits > 0 && sec.required.every(id => appText.includes(id));
    const strength = mappingStrength(sec.key, req.key, detected);
    if (detected) {
      traceabilityRows.push({
        atlas_tool: sec.label,
        source_requirement: req.label,
        ui_field_or_output: req.key,
        code_function: sec.required.filter(id => appText.includes(id)).join('; '),
        source_type: sourceTypeFor(sec.key, req),
        delphi_statement_id: req.delphi,
        ccrf_element_or_domain: req.ccrf,
        mapping_strength: strength,
        implementation_role: strength === 'Direct' ? 'Implemented as a visible field, data element, or differential-matrix concept' : (strength === 'Operationalised' ? 'Converted into a prompt, score, flag, export field, or gap-grid output' : 'Provides contextual support for interpretation or study planning'),
        evidence_detected: 'yes',
        evidence_alias_hits: aliasHits,
        evidence_line_or_count: sec.required.map(evidenceLine).filter(Boolean).join('; '),
        notes: 'Generated by script from implemented HTML/JavaScript identifiers plus predefined Delphi/CCRF source-requirement dictionary.'
      });
    }
  });
});

const traceMatrixRows = SOURCE_REQUIREMENTS.map(req => {
  const row = { requirement: req.label, source_anchor: `${req.source}; Delphi ${req.delphi}; ${req.ccrf}` };
  SELECTED_SECTIONS.forEach(sec => {
    const match = traceabilityRows.find(r => r.atlas_tool === sec.label && r.source_requirement === req.label);
    row[sec.label] = match ? match.mapping_strength : '';
  });
  return row;
});

const requirementRows = SOURCE_REQUIREMENTS.map(req => {
  const rows = traceabilityRows.filter(r => r.source_requirement === req.label);
  return { source_requirement: req.label, source_type: req.source, delphi_statement_id: req.delphi, ccrf_element_or_domain: req.ccrf, mapped_sections: [...new Set(rows.map(r => r.atlas_tool))].join('; '), mapped_section_count: new Set(rows.map(r => r.atlas_tool)).size, direct_count: rows.filter(r => r.mapping_strength === 'Direct').length, operationalised_count: rows.filter(r => r.mapping_strength === 'Operationalised').length, contextual_count: rows.filter(r => r.mapping_strength === 'Contextual').length };
});

const sectionAnchorTests = SELECTED_SECTIONS.map(sec => {
  const rows = traceabilityRows.filter(r => r.atlas_tool === sec.label);
  return { section: sec.label, section_id: sec.sectionId, section_present: sectionHtml(sec.sectionId) ? 'yes' : 'no', required_identifiers_present: sec.required.every(id => appText.includes(id)) ? 'yes' : 'no', mapped_requirement_count: new Set(rows.map(r => r.source_requirement)).size, direct_count: rows.filter(r => r.mapping_strength === 'Direct').length, operationalised_count: rows.filter(r => r.mapping_strength === 'Operationalised').length, contextual_count: rows.filter(r => r.mapping_strength === 'Contextual').length };
});

const minimumDatasetAlignment = datasetRows.map(row => ({
  domain: row.domain,
  field: row.field,
  label: row.label,
  use: row.use,
  delphi_mapping: row.delphi_mapping,
  ccrf_class: row.ccrf_class,
  has_delphi_alignment: row.delphi_mapping ? 'yes' : 'no',
  has_ccrf_style_tier: row.ccrf_class ? 'yes' : 'no'
}));

function setScenarioValues(values) {
  const store = atlas.sandbox.__store;
  Object.keys(store).forEach(k => { store[k].value = ''; store[k].checked = false; });
  Object.entries(values).forEach(([k, v]) => {
    if (!store[k]) atlas.sandbox.document.getElementById(k);
    if (typeof v === 'boolean') store[k].checked = v;
    else store[k].value = String(v);
  });
}
function runScenario(name, values, expectations) {
  setScenarioValues(values);
  const d = atlas.sandbox.collectPhenotypeForm();
  const profile = atlas.sandbox.buildPhenotypeProfile(d);
  const noise = profile.noise || atlas.sandbox.buildDiagnosticNoiseAudit(d, profile.readiness || {});
  const plan = atlas.sandbox.buildEligibilityPlan(profile);
  const csvRows = atlas.sandbox.cohortCaseCsvRows ? atlas.sandbox.cohortCaseCsvRows([{ caseId: d.caseId || name, savedAt:'test', data:d, profile }]) : [];
  const methodText = atlas.sandbox.cohortMethodsSentence ? atlas.sandbox.cohortMethodsSentence(profile) : '';
  const passed = expectations.every(fn => fn({ d, profile, noise, plan, csvRows, methodText }));
  return {
    scenario: name,
    passed: passed ? 'yes' : 'no',
    readiness_score: profile.score || (profile.readiness ? profile.readiness.total : ''),
    diagnostic_noise_score: noise ? noise.score : '',
    cohort_tier: profile.cohortTier || '',
    missing_blockers: (profile.recommended || (profile.readiness ? profile.readiness.missing : []) || []).join('; '),
    noise_sources: noise && noise.rows ? noise.rows.filter(r => !r.ok).map(r => r.source).join('; ') : '',
    blueprint_mentions_comparator: /comparator|control|matched|lymph|obesity|venous/i.test(JSON.stringify(plan)) ? 'yes' : 'no',
    csv_export_rows: Array.isArray(csvRows) ? csvRows.length : '',
    method_text_generated: methodText ? 'yes' : 'no'
  };
}

const scenarioRows = [
  runScenario('well_phenotyped_genetics_case', {
    'dx-case-id':'case_001','dx-sex':'Female','dx-age-onset':'15','dx-onset-window':'puberty','dx-distribution':'lower_upper','dx-stage':'2','dx-pain-nrs':'7','dx-height':'168','dx-weight':'82','dx-waist':'82','dx-hip':'112','dx-limb-measures':'ankle 24; calf 48; thigh 72','dx-adjudicator':'Lipoedema specialist clinician','dx-study-type':'genetics','dx-cohort-type':'strict','dx-comparator-plan':'matched','dx-symmetric':true,'dx-disproportion':true,'dx-sparing':true,'dx-pain':true,'dx-heaviness':true,'dx-bruising':true,'dx-hormonal':true,'dx-family':true,'dx-differential-excluded':true,'dx-comp-obesity':true,'dx-comp-lymph':true,'dx-comp-healthy':true
  }, [o => Number(o.profile.score || (o.profile.readiness && o.profile.readiness.total)) >= 70, o => Number(o.noise.score) <= 45, o => /genetic|family|relative|ancestry/i.test(JSON.stringify(o.plan) + ' ' + o.methodText)]),
  runScenario('self_report_missing_core_review', {
    'dx-case-id':'case_002','dx-sex':'Female','dx-study-type':'diagnostic','dx-cohort-type':'broad','dx-comparator-plan':'none','dx-adjudicator':'Self-reported only','dx-symmetric':true
  }, [o => Number(o.profile.score || (o.profile.readiness && o.profile.readiness.total)) <= 60, o => Number(o.noise.score) >= 40, o => /Self-report|Differential|Comparator|Measurement|missing/i.test(JSON.stringify(o.noise) + ' ' + (o.profile.missing || []).join(' '))]),
  runScenario('fluid_overlap_without_lymph_comparator', {
    'dx-case-id':'case_003','dx-sex':'Female','dx-age-onset':'30','dx-onset-window':'adult','dx-distribution':'lower','dx-stage':'3','dx-pain-nrs':'5','dx-height':'165','dx-weight':'95','dx-waist':'102','dx-hip':'120','dx-limb-measures':'calf 56; thigh 78','dx-adjudicator':'Vascular/lymphatic clinician','dx-study-type':'imaging','dx-cohort-type':'mixed','dx-comparator-plan':'matched','dx-symmetric':true,'dx-disproportion':true,'dx-pain':true,'dx-pitting':true,'dx-stemmer':true,'dx-obesity':true,'dx-comp-obesity':true
  }, [o => /fluid|lymph|pitting|Stemmer/i.test(JSON.stringify(o.noise)), o => /strat|lymph|fluid|comparator/i.test(JSON.stringify(o.plan) + ' ' + (o.profile.missing || []).join(' '))])
];

const exportTests = [
  { export_name:'Minimum Dataset REDCap-style fields', code_function:'atlasRedcapRows', output_detected: typeof atlas.sandbox.atlasRedcapRows === 'function' ? 'yes' : 'no', row_count: typeof atlas.sandbox.atlasRedcapRows === 'function' ? atlas.sandbox.atlasRedcapRows().length : '', notes:'Generated from ATLAS_DATASET_FIELDS and app REDCap export helper.' },
  { export_name:'Cohort case CSV export', code_function:'cohortCaseCsvRows', output_detected: typeof atlas.sandbox.cohortCaseCsvRows === 'function' ? 'yes' : 'no', row_count: scenarioRows.reduce((n, r) => n + Number(r.csv_export_rows || 0), 0), notes:'Scenario-based check using the app cohort case CSV helper; JSON export is not required for Research Atlas public outputs.' },
  { export_name:'Cohort methods text', code_function:'cohortMethodsSentence', output_detected: scenarioRows.every(r => r.method_text_generated === 'yes') ? 'yes' : 'no', row_count: scenarioRows.length, notes:'Functional check that app can generate protocol/manuscript methods text for scenario profiles.' }
];

const summary = {
  generated_at: new Date().toISOString(),
  app_file: appPath,
  app_bytes: Buffer.byteLength(appText, 'utf8'),
  selected_sections_checked: SELECTED_SECTIONS.length,
  selected_sections_present: sectionAnchorTests.filter(r => r.section_present === 'yes').length,
  required_code_identifiers_checked: functionPresenceRows.length,
  required_code_identifiers_present: functionPresenceRows.filter(r => r.present === 'yes').length,
  source_requirements_defined: SOURCE_REQUIREMENTS.length,
  source_requirements_with_at_least_one_mapping: requirementRows.filter(r => Number(r.mapped_section_count) > 0).length,
  traceability_rows_generated: traceabilityRows.length,
  direct_mappings: traceabilityRows.filter(r => r.mapping_strength === 'Direct').length,
  operationalised_mappings: traceabilityRows.filter(r => r.mapping_strength === 'Operationalised').length,
  contextual_mappings: traceabilityRows.filter(r => r.mapping_strength === 'Contextual').length,
  delphi_consensus_statements_encoded_in_app: consensusStatements.length,
  delphi_statement_ids_present: consensusStatements.map(s => s.id || '').filter(Boolean).length,
  minimum_dataset_fields_extracted_from_app: datasetRows.length,
  minimum_dataset_fields_with_delphi_alignment: minimumDatasetAlignment.filter(r => r.has_delphi_alignment === 'yes').length,
  minimum_dataset_fields_with_ccrf_style_tier: minimumDatasetAlignment.filter(r => r.has_ccrf_style_tier === 'yes').length,
  dx_cohort_form_fields_extracted_from_app: dxFields.length,
  differential_matrix_entities_extracted_from_app: differentialRows.length,
  functional_scenarios_checked: scenarioRows.length,
  functional_scenarios_passed: scenarioRows.filter(r => r.passed === 'yes').length,
  notes: 'Traceability rows were generated by script from unchanged LipoScope.html using implemented section/function/field evidence and a predefined Delphi/CCRF source-requirement dictionary. This is a source-to-code alignment audit, not a clinical validation study.'
};

writeCsv('source_requirements_from_script.csv', SOURCE_REQUIREMENTS.map(r => ({ requirement_key:r.key, requirement:r.label, source_type:r.source, delphi_statement_id:r.delphi, ccrf_element_or_domain:r.ccrf, aliases_used_for_code_detection:r.aliases.join('; ') })));
writeCsv('implementation_inventory.csv', implementationInventory);
writeCsv('section_source_anchor_tests.csv', sectionAnchorTests);
writeCsv('function_presence_tests.csv', functionPresenceRows);
writeCsv('field_requirement_alignment_tests.csv', requirementRows);
writeCsv('source_to_tool_traceability.csv', traceabilityRows);
writeCsv('traceability_figure_matrix.csv', traceMatrixRows);
writeCsv('minimum_dataset_alignment_from_app.csv', minimumDatasetAlignment);
writeCsv('functional_scenario_tests.csv', scenarioRows);
writeCsv('functional_scenario_check_details.csv', scenarioRows);
writeCsv('export_output_tests.csv', exportTests);

console.log(JSON.stringify(summary, null, 2));


