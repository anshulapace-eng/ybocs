import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { SEVERITY_COLORS } from "../../lib/severity";
import { baseUrl } from "../../lib/base";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea } from "recharts";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import AppLayout from "../../Layouts/AppLayout";

function Field({ k, v }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>{k}</div>
      <div className="text-sm" style={{ color: "var(--ink)" }}>{v}</div>
    </div>
  );
}

export default function PatientDetail() {
  const { patient, sessions } = usePage().props;

  const trend = [...sessions].reverse().map((s, i) => ({
    n: `S${i + 1}`,
    date: new Date(s.date).toLocaleDateString(),
    Total: s.total_score,
    Obsession: s.obsession_score,
    Compulsion: s.compulsion_score,
  }));

  return (
    <div className="max-w-7xl" data-testid="patient-detail-page">
      <Link href={baseUrl("/patients")} className="text-sm flex items-center gap-2 mb-6" style={{ color: "var(--ink-soft)" }}>
        <ArrowLeft size={14} /> All patients
      </Link>

      <div className="card-warm-deep p-8 mb-8 fade-up">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center font-display text-3xl shrink-0"
                 style={{ background: "var(--cream)", color: "var(--ink)" }}>
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-4xl" style={{ color: "var(--ink)" }}>{patient.name}</h1>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>
                {patient.uid && <Field k="UID" v={patient.uid} />}
                <Field k="Age / Gender" v={`${patient.age}y · ${patient.gender}`} />
                {patient.mobile && <Field k="Mobile" v={patient.mobile} />}
                {patient.email && <Field k="Email" v={patient.email} />}
                {patient.consultant_name && <Field k="Consultant" v={patient.consultant_name} />}
                {patient.assessment_date && <Field k="Assessment Date" v={patient.assessment_date} />}
              </div>
              <div className="flex flex-wrap gap-3 mt-4 text-sm" style={{ color: "var(--ink-soft)" }}>
                <span>Sessions: <strong>{patient.sessions_count}</strong></span>
                {patient.last_severity && (
                  <span className="tag-severity"
                        style={{ background: SEVERITY_COLORS[patient.last_severity],
                                 color: ["Severe", "Extreme"].includes(patient.last_severity) ? "#FAF3E3" : "#3F1C0E" }}>
                    Latest · {patient.last_severity} · {patient.last_score}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link href={baseUrl(`/assessments/new/${patient.id}`)} data-testid="new-assessment-btn" className="btn-primary-warm inline-flex items-center gap-2 shrink-0">
            <ClipboardCheck size={16} /> New Y-BOCS Assessment
          </Link>
        </div>
        {patient.notes && (
          <div className="mt-5 p-4 rounded-xl text-sm" style={{ background: "rgba(250, 243, 227, 0.5)", color: "var(--ink-soft)" }}>
            {patient.notes}
          </div>
        )}
      </div>

      {trend.length > 0 && (
        <div className="card-warm p-6 mb-8 fade-up delay-1">
          <h3 className="font-display text-2xl mb-1" style={{ color: "var(--ink)" }}>Progress over time</h3>
          <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>Y-BOCS scores across sessions.</p>
          <div style={{ height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#E1D4B7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="n" tick={{ fill: "#4A3526", fontSize: 12 }} axisLine={{ stroke: "#C9B891" }} />
                <YAxis domain={[0, 40]} tick={{ fill: "#4A3526", fontSize: 12 }} axisLine={{ stroke: "#C9B891" }} />
                <ReferenceArea y1={0} y2={7} fill="#F5C9A6" fillOpacity={0.25} />
                <ReferenceArea y1={8} y2={15} fill="#E89866" fillOpacity={0.18} />
                <ReferenceArea y1={16} y2={23} fill="#C8612C" fillOpacity={0.18} />
                <ReferenceArea y1={24} y2={31} fill="#8E3A1C" fillOpacity={0.18} />
                <ReferenceArea y1={32} y2={40} fill="#3F1C0E" fillOpacity={0.18} />
                <Tooltip contentStyle={{ background: "#FBF6E9", border: "1px solid var(--line)", borderRadius: 12 }} />
                <Legend />
                <Line type="monotone" dataKey="Total" stroke="#3F1C0E" strokeWidth={3} dot={{ r: 5, fill: "#3F1C0E" }} />
                <Line type="monotone" dataKey="Obsession" stroke="#C8612C" strokeWidth={2} />
                <Line type="monotone" dataKey="Compulsion" stroke="#E89866" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card-warm p-6 fade-up delay-2">
        <h3 className="font-display text-2xl mb-4" style={{ color: "var(--ink)" }}>Sessions</h3>
        {sessions.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
            No sessions yet. Start a new Y-BOCS assessment.
          </div>
        ) : (
          <div className="flex flex-col">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={baseUrl(`/assessments/${s.id}`)}
                data-testid={`session-row-${s.id}`}
                className="grid grid-cols-12 items-center gap-4 py-4 border-b last:border-0 hover:opacity-80"
                style={{ borderColor: "var(--line)" }}
              >
                <div className="col-span-3 text-sm" style={{ color: "var(--ink-soft)" }}>
                  {new Date(s.date).toLocaleString()}
                </div>
                <div className="col-span-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                  Obs: <strong style={{ color: "var(--ink)" }}>{s.obsession_score}</strong>
                </div>
                <div className="col-span-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                  Com: <strong style={{ color: "var(--ink)" }}>{s.compulsion_score}</strong>
                </div>
                <div className="col-span-2">
                  <span className="tag-severity"
                        style={{ background: SEVERITY_COLORS[s.severity],
                                 color: ["Severe", "Extreme"].includes(s.severity) ? "#FAF3E3" : "#3F1C0E" }}>
                    {s.severity}
                  </span>
                </div>
                <div className="col-span-3 text-right font-display text-2xl" style={{ color: "var(--ink)" }}>
                  {s.total_score}<span className="text-sm" style={{ color: "var(--ink-muted)" }}>/40</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

PatientDetail.layout = (page) => <AppLayout>{page}</AppLayout>;
