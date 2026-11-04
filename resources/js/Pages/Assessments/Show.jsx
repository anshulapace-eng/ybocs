import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { YBOCS_META } from "../../data/entities";
import { SEVERITY_COLORS } from "../../lib/severity";
import { baseUrl } from "../../lib/base";
import SeverityMeter from "../../components/SeverityMeter";
import ScoreGauge from "../../components/ScoreGauge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowLeft, Download, Sparkles, AlertTriangle, FileEdit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { generateReportPdf } from "../../lib/generatePdf";
import AppLayout from "../../Layouts/AppLayout";

export default function AssessmentResult() {
  const { assessment: a } = usePage().props;
  const meta = YBOCS_META;
  const [notes, setNotes] = useState(a.manual_notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);

  const saveNotes = () => {
    setSavingNotes(true);
    router.patch(baseUrl(`/assessments/${a.id}/notes`), { manual_notes: notes }, {
      preserveScroll: true,
      onSuccess: () => {
        setEditingNotes(false);
        toast.success("Clinical notes saved");
      },
      onError: () => toast.error("Could not save notes"),
      onFinish: () => setSavingNotes(false),
    });
  };

  const cancelEdit = () => {
    setNotes(a.manual_notes || "");
    setEditingNotes(false);
  };

  const hasSavedNotes = !!(a.manual_notes && a.manual_notes.trim());

  const perQuestion = Array.from({ length: 10 }, (_, i) => ({
    q: `Q${i + 1}`,
    score: a.answers[`q${i + 1}`] ?? 0,
    section: i < 5 ? "Obsession" : "Compulsion",
  }));

  const subBars = [
    { name: "Obsession", score: a.obsession_score, color: "#C8612C" },
    { name: "Compulsion", score: a.compulsion_score, color: "#E89866" },
  ];

  const exportPdf = async () => {
    try {
      toast.message("Generating PDF…");
      generateReportPdf(a, meta);
      toast.success("PDF downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Could not generate PDF");
    }
  };

  const toggleAiInPdf = (v) => {
    router.patch(baseUrl(`/assessments/${a.id}/prefs`), { include_ai_in_pdf: !!v }, {
      preserveScroll: true,
      onSuccess: () => toast.success(v ? "AI summary will appear in PDF" : "AI summary hidden from PDF"),
      onError: () => toast.error("Could not update preference"),
    });
  };

  const sevColor = SEVERITY_COLORS[a.severity];
  const onDark = ["Severe", "Extreme"].includes(a.severity);

  return (
    <div className="max-w-6xl mx-auto" data-testid="assessment-result-page">
      <div className="flex items-center justify-between mb-6">
        <Link href={baseUrl(`/patients/${a.patient_id}`)} className="text-sm flex items-center gap-2" style={{ color: "var(--ink-soft)" }}>
          <ArrowLeft size={14} /> Back to patient
        </Link>
        <button data-testid="download-pdf-btn" onClick={exportPdf} className="btn-primary-warm inline-flex items-center gap-2">
          <Download size={16} /> Download PDF
        </button>
      </div>

      <div className="space-y-6">
        {/* Header with full client info */}
        <div className="card-warm-deep p-8 fade-up">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--ink-muted)" }}>Y-BOCS Report</div>
              <h1 className="font-display text-4xl mb-4" style={{ color: "var(--ink)" }}>{a.patient_name}</h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 text-sm">
                {a.patient_uid && <ClientField k="UID" v={a.patient_uid} />}
                <ClientField k="Age / Gender" v={`${a.patient_age || "—"}y · ${a.patient_gender || "—"}`} />
                {a.patient_mobile && <ClientField k="Mobile" v={a.patient_mobile} />}
                {a.patient_email && <ClientField k="Email" v={a.patient_email} />}
                {a.consultant_name && <ClientField k="Consultant" v={a.consultant_name} />}
                <ClientField k="Assessment Date" v={new Date(a.date).toLocaleString()} />
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display text-7xl leading-none" style={{ color: "var(--ink)" }}>{a.total_score}</div>
              <div className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>out of 40</div>
              <span className="tag-severity mt-3" style={{ background: sevColor, color: onDark ? "#FAF3E3" : "#3F1C0E" }}>
                {a.severity}
              </span>
            </div>
          </div>
        </div>

        {/* Score visualization grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 fade-up delay-1">
          <div className="card-warm p-6 md:col-span-1">
            <h3 className="text-xs uppercase tracking-widest mb-6" style={{ color: "var(--ink-muted)" }}>Severity Range</h3>
            <SeverityMeter score={a.total_score} max={40} height={340} />
          </div>

          <div className="card-warm p-6 flex flex-col items-center justify-center">
            <h3 className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--ink-muted)" }}>Obsessions</h3>
            <ScoreGauge score={a.obsession_score} max={20} label="Obsession" />
          </div>

          <div className="card-warm p-6 flex flex-col items-center justify-center">
            <h3 className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--ink-muted)" }}>Compulsions</h3>
            <ScoreGauge score={a.compulsion_score} max={20} label="Compulsion" />
          </div>
        </div>

        {/* Per-question chart */}
        <div className="card-warm p-6 fade-up delay-2">
          <h3 className="font-display text-2xl mb-1" style={{ color: "var(--ink)" }}>Per-question breakdown</h3>
          <p className="text-sm mb-5" style={{ color: "var(--ink-muted)" }}>Each item rated 0–4. Q1–Q5 obsessions · Q6–Q10 compulsions.</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={perQuestion}>
                <CartesianGrid stroke="#E1D4B7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="q" tick={{ fill: "#4A3526", fontSize: 12 }} axisLine={{ stroke: "#C9B891" }} />
                <YAxis domain={[0, 4]} tick={{ fill: "#4A3526", fontSize: 12 }} axisLine={{ stroke: "#C9B891" }} />
                <Tooltip contentStyle={{ background: "#FBF6E9", border: "1px solid var(--line)", borderRadius: 12 }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {perQuestion.map((d, i) => (
                    <Cell key={i} fill={d.section === "Obsession" ? "#C8612C" : "#E89866"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sub-score comparison */}
        <div className="card-warm p-6 fade-up delay-3">
          <h3 className="font-display text-2xl mb-5" style={{ color: "var(--ink)" }}>Obsession vs Compulsion</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={subBars} layout="vertical">
                <CartesianGrid stroke="#E1D4B7" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 20]} tick={{ fill: "#4A3526", fontSize: 12 }} axisLine={{ stroke: "#C9B891" }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#4A3526", fontSize: 13 }} axisLine={{ stroke: "#C9B891" }} width={110} />
                <Tooltip contentStyle={{ background: "#FBF6E9", border: "1px solid var(--line)", borderRadius: 12 }} />
                <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                  {subBars.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clinician's interpretation — manual write-up */}
        <div className={`fade-up ${hasSavedNotes && !editingNotes ? "card-warm-deep" : "card-warm"} p-8`} data-testid="clinical-notes-card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileEdit size={18} color="var(--brick)" />
              <h3 className="font-display text-2xl" style={{ color: "var(--ink)" }}>
                Clinician's interpretation
              </h3>
            </div>
            {hasSavedNotes && !editingNotes && (
              <button
                data-testid="edit-notes-btn"
                onClick={() => setEditingNotes(true)}
                className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full border transition hover:opacity-80"
                style={{ borderColor: "var(--line-strong)", color: "var(--ink-soft)", background: "#FBF6E9" }}
              >
                <FileEdit size={13} /> Edit
              </button>
            )}
          </div>

          {hasSavedNotes && !editingNotes ? (
            <p data-testid="clinical-notes-display" className="text-base whitespace-pre-wrap leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              {a.manual_notes}
            </p>
          ) : (
            <>
              <p className="text-xs mb-3" style={{ color: "var(--ink-muted)" }}>
                Your own clinical interpretation. Shown at the top of the PDF report, above the AI-assisted summary.
              </p>
              <Textarea
                data-testid="clinical-notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type your clinical formulation, observations, or treatment plan here…"
                rows={6}
                className="text-sm mb-4"
              />
              <div className="flex gap-3 justify-end">
                {hasSavedNotes && (
                  <button
                    data-testid="cancel-notes-btn"
                    onClick={cancelEdit}
                    className="inline-flex items-center gap-2 text-sm px-5 py-2 rounded-full border transition hover:opacity-80"
                    style={{ borderColor: "var(--line-strong)", color: "var(--ink-soft)" }}
                  >
                    <X size={14} /> Cancel
                  </button>
                )}
                <button
                  data-testid="save-notes-btn"
                  onClick={saveNotes}
                  disabled={savingNotes || !notes.trim()}
                  className="btn-primary-warm inline-flex items-center gap-2 disabled:opacity-40"
                  style={{ padding: "8px 20px" }}
                >
                  <Save size={14} /> {savingNotes ? "Saving…" : "Save interpretation"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* AI summary */}
        {a.ai_summary && (
          <div className="card-warm-deep p-8 fade-up delay-4" data-testid="ai-summary-card">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} color="var(--brick)" />
                <h3 className="font-display text-2xl" style={{ color: "var(--ink)" }}>Clinical interpretation</h3>
              </div>
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none px-3 py-2 rounded-full" style={{ color: "var(--ink-soft)", background: "#FBF6E9", border: "1px solid var(--line)" }}>
                <Checkbox
                  data-testid="include-ai-in-pdf-toggle"
                  checked={a.include_ai_in_pdf !== false}
                  onCheckedChange={toggleAiInPdf}
                />
                Include AI interpretation in PDF
              </label>
            </div>
            <p className="text-base mb-6" style={{ color: "var(--ink-soft)" }}>{a.ai_summary.interpretation}</p>

            <div className="grid md:grid-cols-2 gap-6">
              {a.ai_summary.key_concerns?.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--ink-muted)" }}>Key concerns</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "var(--ink-soft)" }}>
                    {a.ai_summary.key_concerns.map((k, i) => <li key={i}>{k}</li>)}
                  </ul>
                </div>
              )}
              {a.ai_summary.recommendations?.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--ink-muted)" }}>Recommendations</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "var(--ink-soft)" }}>
                    {a.ai_summary.recommendations.map((k, i) => <li key={i}>{k}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {a.ai_summary.risk_flags?.length > 0 && (
              <div className="mt-6 p-4 rounded-xl flex gap-3 items-start" style={{ background: "rgba(142, 58, 28, 0.1)" }}>
                <AlertTriangle size={18} color="#8E3A1C" className="shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#8E3A1C" }}>Risk flags</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: "var(--ink)" }}>
                    {a.ai_summary.risk_flags.map((k, i) => <li key={i}>{k}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Symptom checklist as TABLE (mirrors questionnaire format) */}
        <ChecklistTable
          title="Obsessions checklist"
          accent="#C8612C"
          principal={a.principal_obsession}
          categories={meta.obsession_checklist}
          current={a.obsessions_current || []}
          past={a.obsessions_past || []}
        />
        <ChecklistTable
          title="Compulsions checklist"
          accent="#8E3A1C"
          principal={a.principal_compulsion}
          categories={meta.compulsion_checklist}
          current={a.compulsions_current || []}
          past={a.compulsions_past || []}
        />
      </div>
    </div>
  );
}

function ClientField({ k, v }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>{k}</div>
      <div className="text-sm" style={{ color: "var(--ink)" }}>{v}</div>
    </div>
  );
}

function ChecklistTable({ title, accent, principal, categories, current, past }) {
  const curSet = new Set(current);
  const pastSet = new Set(past);
  const visible = categories.filter((c) => c.items.some((i) => curSet.has(i) || pastSet.has(i)));
  if (visible.length === 0) return null;

  return (
    <div className="card-warm p-6 fade-up" data-testid={`report-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-display text-2xl" style={{ color: "var(--ink)" }}>{title}</h3>
        {principal && (
          <div className="text-xs" style={{ color: "var(--ink-muted)" }}>
            Principal: <span className="font-medium" style={{ color: accent }}>{principal} ★</span>
          </div>
        )}
      </div>
      {visible.map((cat) => (
        <div key={cat.category} className="mb-5">
          <div className="text-sm font-semibold mb-2 mt-2" style={{ color: accent }}>{cat.category}</div>
          <div className="grid grid-cols-[1fr_88px_88px] gap-3 px-1 pb-2 border-b text-[10px] uppercase tracking-widest"
               style={{ color: "var(--ink-muted)", borderColor: "var(--line)" }}>
            <div>Symptom</div>
            <div className="text-center">Current</div>
            <div className="text-center">Past</div>
          </div>
          {cat.items.map((item) => {
            const isCur = curSet.has(item);
            const isPast = pastSet.has(item);
            const isPrincipal = principal === item;
            return (
              <div key={item} className="grid grid-cols-[1fr_88px_88px] gap-3 items-center py-2.5 border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                <span className="text-sm" style={{ color: isPrincipal ? "var(--ink)" : "var(--ink-soft)", fontWeight: isPrincipal ? 600 : 400 }}>
                  {item}{isPrincipal ? " ★" : ""}
                </span>
                <CellMark on={isCur} color={accent} />
                <CellMark on={isPast} color={accent} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function CellMark({ on, color }) {
  return (
    <div className="flex justify-center">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
        style={{ background: on ? color : "transparent", border: `2px solid ${on ? color : "var(--line-strong)"}` }}
      >
        {on && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8L6.5 11.5L13 4.5" stroke="#FAF3E3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

AssessmentResult.layout = (page) => <AppLayout>{page}</AppLayout>;
