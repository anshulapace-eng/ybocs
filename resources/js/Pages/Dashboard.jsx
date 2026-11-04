import { Link, usePage } from "@inertiajs/react";
import { SEVERITY_COLORS } from "../lib/severity";
import { baseUrl } from "../lib/base";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Users, Activity, Gauge, ArrowUpRight } from "lucide-react";
import AppLayout from "../Layouts/AppLayout";

export default function Dashboard() {
  const { stats } = usePage().props;

  const cards = [
    { label: "Patients", value: stats.patients_count, icon: Users },
    { label: "Sessions", value: stats.sessions_count, icon: Activity },
    { label: "Avg Score", value: `${stats.avg_score}/40`, icon: Gauge },
  ];

  const pieData = stats.severity_distribution.filter((d) => d.count > 0);

  return (
    <div className="max-w-7xl" data-testid="dashboard-page">
      <div className="flex items-end justify-between mb-10 fade-up">
        <div>
          <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--ink-muted)" }}>Workspace</div>
          <h1 className="font-display text-4xl sm:text-5xl" style={{ color: "var(--ink)" }}>Good day, clinician.</h1>
          <p className="mt-2 text-base" style={{ color: "var(--ink-soft)" }}>
            Here is a snapshot of your Y-BOCS practice today.
          </p>
        </div>
        <Link href={baseUrl("/patients")} data-testid="cta-add-patient" className="btn-primary-warm hidden md:inline-flex items-center gap-2">
          New Patient <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`card-warm p-6 fade-up delay-${i + 1}`} data-testid={`stat-${c.label.toLowerCase()}`}>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                  {c.label}
                </span>
                <Icon size={18} color="var(--ink-soft)" />
              </div>
              <div className="font-display text-5xl" style={{ color: "var(--ink)" }}>{c.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        <div className="card-warm p-6 fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-2xl" style={{ color: "var(--ink)" }}>Severity distribution</h3>
            <span className="text-xs" style={{ color: "var(--ink-muted)" }}>{stats.sessions_count} sessions</span>
          </div>
          {pieData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-sm" style={{ color: "var(--ink-muted)" }}>
              No assessments yet
            </div>
          ) : (
            <div style={{ height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="count" nameKey="label" innerRadius={60} outerRadius={110} paddingAngle={3}>
                    {pieData.map((d) => <Cell key={d.label} fill={SEVERITY_COLORS[d.label]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#FBF6E9", border: "1px solid var(--line)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            {stats.severity_distribution.map((d) => (
              <div key={d.label} className="flex items-center gap-2 text-xs" style={{ color: "var(--ink-soft)" }}>
                <span className="w-3 h-3 rounded-full" style={{ background: SEVERITY_COLORS[d.label] }} />
                {d.label} · {d.count}
              </div>
            ))}
          </div>
        </div>

        <div className="card-warm p-6 fade-up delay-1">
          <h3 className="font-display text-2xl mb-4" style={{ color: "var(--ink)" }}>Recent assessments</h3>
          {stats.recent_assessments.length === 0 ? (
            <div className="text-sm" style={{ color: "var(--ink-muted)" }}>No recent activity yet.</div>
          ) : (
            <div className="flex flex-col">
              {stats.recent_assessments.map((a) => (
                <Link
                  key={a.id}
                  href={baseUrl(`/assessments/${a.id}`)}
                  data-testid={`recent-assessment-${a.id}`}
                  className="flex items-center justify-between py-3 border-b last:border-0 hover:opacity-80"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div>
                    <div className="font-medium text-sm" style={{ color: "var(--ink)" }}>{a.patient_name}</div>
                    <div className="text-xs" style={{ color: "var(--ink-muted)" }}>
                      {new Date(a.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="tag-severity"
                      style={{ background: SEVERITY_COLORS[a.severity], color: ["Severe", "Extreme"].includes(a.severity) ? "#FAF3E3" : "#3F1C0E" }}
                    >
                      {a.severity}
                    </span>
                    <span className="font-display text-2xl" style={{ color: "var(--ink)" }}>{a.total_score}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card-warm p-6 fade-up">
        <h3 className="font-display text-2xl mb-4" style={{ color: "var(--ink)" }}>Cases by severity</h3>
        <div style={{ height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={stats.severity_distribution}>
              <CartesianGrid stroke="#E1D4B7" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#4A3526", fontSize: 12 }} axisLine={{ stroke: "#C9B891" }} />
              <YAxis tick={{ fill: "#4A3526", fontSize: 12 }} axisLine={{ stroke: "#C9B891" }} />
              <Tooltip contentStyle={{ background: "#FBF6E9", border: "1px solid var(--line)", borderRadius: 12 }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {stats.severity_distribution.map((d) => (
                  <Cell key={d.label} fill={SEVERITY_COLORS[d.label]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

Dashboard.layout = (page) => <AppLayout>{page}</AppLayout>;
