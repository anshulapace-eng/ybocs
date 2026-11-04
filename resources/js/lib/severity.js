export const SEVERITY_COLORS = {
  Subclinical: "#F5C9A6",
  Mild: "#E89866",
  Moderate: "#C8612C",
  Severe: "#8E3A1C",
  Extreme: "#3F1C0E",
};

export const SEVERITY_BANDS = [
  { label: "Subclinical", min: 0, max: 7, color: "#F5C9A6" },
  { label: "Mild", min: 8, max: 15, color: "#E89866" },
  { label: "Moderate", min: 16, max: 23, color: "#C8612C" },
  { label: "Severe", min: 24, max: 31, color: "#8E3A1C" },
  { label: "Extreme", min: 32, max: 40, color: "#3F1C0E" },
];

export function severityOf(total) {
  if (total <= 7) return "Subclinical";
  if (total <= 15) return "Mild";
  if (total <= 23) return "Moderate";
  if (total <= 31) return "Severe";
  return "Extreme";
}

export function severityTextColor(label) {
  return ["Severe", "Extreme"].includes(label) ? "#FAF3E3" : "#3F1C0E";
}
