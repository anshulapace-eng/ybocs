import { SEVERITY_COLORS, severityOf } from "../lib/severity";

export default function ScoreGauge({ score = 0, max = 40, label = "Total" }) {
  const pct = Math.min(1, Math.max(0, score / max));
  const sev = severityOf(score);
  const color = SEVERITY_COLORS[sev];

  const r = 80;
  const c = 2 * Math.PI * r;
  // 270° arc only
  const arcLen = c * 0.75;
  const dash = arcLen * pct;

  return (
    <div className="flex flex-col items-center" data-testid={`score-gauge-${label.toLowerCase()}`}>
      <svg width="200" height="200" viewBox="-100 -100 200 200" style={{ transform: "rotate(135deg)" }}>
        <circle
          r={r}
          fill="none"
          stroke="#EFE4CC"
          strokeWidth="14"
          strokeDasharray={`${arcLen} ${c}`}
          strokeLinecap="round"
        />
        <circle
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
        />
      </svg>
      <div className="-mt-[118px] flex flex-col items-center pointer-events-none">
        <div className="font-display text-5xl leading-none" style={{ color: "var(--ink)" }}>
          {score}
        </div>
        <div className="text-[11px] mt-1 uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>
          out of {max}
        </div>
        <div className="mt-14 text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
          {label}
        </div>
      </div>
    </div>
  );
}
