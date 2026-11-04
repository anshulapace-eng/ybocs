import { useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { SEVERITY_COLORS } from "../lib/severity";
import { baseUrl } from "../lib/base";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import AppLayout from "../Layouts/AppLayout";

export default function Reports() {
  const { assessments, patients } = usePage().props;
  const [pid, setPid] = useState("all");

  const filtered = useMemo(
    () => (pid === "all" ? assessments : assessments.filter((a) => a.patient_id === pid)),
    [assessments, pid]
  );

  const chartData = [...filtered].reverse().map((a, i) => ({
    n: `S${i + 1}`,
    label: `${a.patient_name.split(" ")[0]} · ${new Date(a.date).toLocaleDateString()}`,
    Total: a.total_score,
    Obsession: a.obsession_score,
    Compulsion: a.compulsion_score,
  }));

  return (
    <div className="max-w-7xl" data-testid="reports-page">
      <div className="flex items-end justify-between mb-8 fade-up">
        <div>
          <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--ink-muted)" }}>Analytics</div>
          <h1 className="font-display text-4xl sm:text-5xl" style={{ color: "var(--ink)" }}>Reports</h1>
        </div>
        <div className="w-64">
          <Select value={pid} onValueChange={setPid}>
            <SelectTrigger data-testid="report-patient-filter"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All patients</SelectItem>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="card-warm p-6 mb-6 fade-up">
        <h3 className="font-display text-2xl mb-1" style={{ color: "var(--ink)" }}>Score trajectory</h3>
        <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
          {pid === "all" ? "Across all patients & sessions" : "Selected patient timeline"}
        </p>
        {chartData.length === 0 ? (
          <div className="h-60 flex items-center justify-center text-sm" style={{ color: "var(--ink-muted)" }}>
            No assessment data yet.
          </div>
        ) : (
          <div style={{ height: 360 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#E1D4B7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="n" tick={{ fill: "#4A3526", fontSize: 12 }} axisLine={{ stroke: "#C9B891" }} />
                <YAxis domain={[0, 40]} tick={{ fill: "#4A3526", fontSize: 12 }} axisLine={{ stroke: "#C9B891" }} />
                <ReferenceArea y1={0} y2={7} fill="#F5C9A6" fillOpacity={0.18} />
                <ReferenceArea y1={8} y2={15} fill="#E89866" fillOpacity={0.14} />
                <ReferenceArea y1={16} y2={23} fill="#C8612C" fillOpacity={0.14} />
                <ReferenceArea y1={24} y2={31} fill="#8E3A1C" fillOpacity={0.14} />
                <ReferenceArea y1={32} y2={40} fill="#3F1C0E" fillOpacity={0.14} />
                <Tooltip
                  contentStyle={{ background: "#FBF6E9", border: "1px solid var(--line)", borderRadius: 12 }}
                  labelFormatter={(l, p) => p?.[0]?.payload?.label || l}
                />
                <Legend />
                <Line type="monotone" dataKey="Total" stroke="#3F1C0E" strokeWidth={3} dot={{ r: 4, fill: "#3F1C0E" }} />
                <Line type="monotone" dataKey="Obsession" stroke="#C8612C" strokeWidth={2} />
                <Line type="monotone" dataKey="Compulsion" stroke="#E89866" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card-warm p-6 fade-up delay-1">
        <h3 className="font-display text-2xl mb-4" style={{ color: "var(--ink)" }}>All assessments</h3>
        {filtered.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--ink-muted)" }}>No assessments to show.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
                  <th className="py-3">Patient</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Obs</th>
                  <th className="py-3">Com</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Severity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-t" style={{ borderColor: "var(--line)" }}>
                    <td className="py-4">
                      <Link data-testid={`report-row-${a.id}`} href={baseUrl(`/assessments/${a.id}`)} className="font-medium hover:underline" style={{ color: "var(--ink)" }}>
                        {a.patient_name}
                      </Link>
                    </td>
                    <td className="py-4 text-sm" style={{ color: "var(--ink-soft)" }}>
                      {new Date(a.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-sm" style={{ color: "var(--ink-soft)" }}>{a.obsession_score}</td>
                    <td className="py-4 text-sm" style={{ color: "var(--ink-soft)" }}>{a.compulsion_score}</td>
                    <td className="py-4 font-display text-xl" style={{ color: "var(--ink)" }}>{a.total_score}</td>
                    <td className="py-4">
                      <span className="tag-severity" style={{ background: SEVERITY_COLORS[a.severity], color: ["Severe", "Extreme"].includes(a.severity) ? "#FAF3E3" : "#3F1C0E" }}>
                        {a.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

Reports.layout = (page) => <AppLayout>{page}</AppLayout>;
