import { SEVERITY_BANDS } from "../lib/severity";

/* Vertical severity gradient meter, mirrors the user's Y-BOCS reference image */
export default function SeverityMeter({ score = 0, max = 40, height = 380 }) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));

  const bands = [
    { color: "#F5C9A6", label: "Subclinical", range: "0–7" },
    { color: "#E89866", label: "Mild", range: "8–15" },
    { color: "#C8612C", label: "Moderate", range: "16–23" },
    { color: "#8E3A1C", label: "Severe", range: "24–31" },
    { color: "#3F1C0E", label: "Extreme", range: "32–40" },
  ];

  return (
    <div className="flex items-stretch gap-4" data-testid="severity-meter">
      {/* Left column: score number that tracks dot position */}
      <div className="relative" style={{ height, width: 48 }}>
        <div
          className="absolute right-0 flex items-center gap-2 whitespace-nowrap"
          style={{
            top: `${pct}%`,
            transform: "translateY(-50%)",
            transition: "top 700ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          <span
            className="font-display text-3xl leading-none"
            style={{ color: "var(--ink)" }}
          >
            {score}
          </span>
          <span
            className="block h-[2px] w-4"
            style={{ background: "var(--ink)" }}
          />
        </div>
      </div>

      {/* Middle column: vertical gradient bar with prominent dot */}
      <div className="relative flex flex-col" style={{ height, width: 56 }}>
        {bands.map((b, i) => (
          <div key={i} className="flex-1" style={{ background: b.color }} />
        ))}
        <div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{
            top: `${pct}%`,
            transform: "translateY(-50%)",
            transition: "top 700ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {/* Bigger dot with ring effect */}
          <div
            className="w-8 h-8 rounded-full border-[4px] shadow-lg"
            style={{ background: "#FAF3E3", borderColor: "var(--ink)" }}
          />
        </div>
      </div>

      {/* Right column: range + label text */}
      <div className="flex flex-col justify-between pl-1" style={{ height }}>
        {bands.map((b) => (
          <div key={b.label} className="flex flex-col leading-tight">
            <span className="font-display text-base" style={{ color: b.color }}>
              {b.range}
            </span>
            <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
