import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* Color palette (matches in-app warm-earthy theme) — RGB tuples for jsPDF */
const C = {
  cream:      [250, 243, 227],
  creamSoft:  [245, 237, 219],
  creamDeep:  [239, 226, 194],
  ink:        [42, 27, 17],
  inkSoft:    [74, 53, 38],
  inkMuted:   [138, 120, 96],
  line:       [225, 212, 183],
  lineStrong: [201, 184, 145],
  peach:      [245, 201, 166],
  orange:     [232, 152, 102],
  burnt:      [200, 97, 44],
  brick:      [142, 58, 28],
  chocolate:  [63, 28, 14],
};
const SEV = {
  Subclinical: C.peach,
  Mild:        C.orange,
  Moderate:    C.burnt,
  Severe:      C.brick,
  Extreme:     C.chocolate,
};
const onDark = (sev) => ["Severe", "Extreme"].includes(sev);

export function generateReportPdf(a, meta) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();   // 595
  const H = pdf.internal.pageSize.getHeight();  // 842
  const M = 36;                                 // margin
  const contentW = W - 2 * M;

  /* ============== PAGE 1 — Summary ============== */

  // Header band (warm card)
  pdf.setFillColor(...C.creamSoft);
  pdf.roundedRect(M, M, contentW, 100, 10, 10, "F");

  // Brand mark
  pdf.setFillColor(...C.ink);
  pdf.circle(M + 22, M + 22, 8, "F");
  pdf.setFont("times", "italic"); pdf.setFontSize(14); pdf.setTextColor(...C.ink);
  pdf.text("radial", M + 36, M + 26);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...C.inkMuted);
  pdf.text("Y-BOCS CLINICAL SUITE", M + 36, M + 38);

  // Title
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(...C.inkMuted);
  pdf.text("Y-BOCS REPORT", M + 22, M + 56);

  // Patient name
  pdf.setFont("times", "bold"); pdf.setFontSize(24); pdf.setTextColor(...C.ink);
  pdf.text(a.patient_name || "—", M + 22, M + 80);

  // Score (right of header)
  pdf.setFont("times", "bold"); pdf.setFontSize(46); pdf.setTextColor(...C.ink);
  pdf.text(String(a.total_score), W - M - 22, M + 60, { align: "right" });
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(...C.inkMuted);
  pdf.text("out of 40", W - M - 22, M + 72, { align: "right" });

  // Severity badge
  const sev = SEV[a.severity] || C.peach;
  const badgeW = 78, badgeH = 18, badgeX = W - M - 22 - badgeW, badgeY = M + 78;
  pdf.setFillColor(...sev);
  pdf.roundedRect(badgeX, badgeY, badgeW, badgeH, 9, 9, "F");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(8);
  pdf.setTextColor(...(onDark(a.severity) ? C.cream : C.chocolate));
  pdf.text((a.severity || "").toUpperCase(), badgeX + badgeW / 2, badgeY + 12, { align: "center" });

  // Client info grid (3 cols × 2 rows below header)
  const fieldsY = M + 110;
  const fields = [
    ["UID",            a.patient_uid || "—"],
    ["Age / Gender",   `${a.patient_age || "—"}y · ${a.patient_gender || "—"}`],
    ["Mobile",         a.patient_mobile || "—"],
    ["Email",          a.patient_email || "—"],
    ["Consultant",     a.consultant_name || "—"],
    ["Assessment Date", new Date(a.date).toLocaleString()],
  ];
  const colW = contentW / 3;
  fields.forEach(([k, v], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = M + col * colW;
    const y = fieldsY + row * 30;
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...C.inkMuted);
    pdf.text(k.toUpperCase(), x, y);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.setTextColor(...C.ink);
    const lines = pdf.splitTextToSize(String(v), colW - 12);
    pdf.text(lines.slice(0, 1), x, y + 12);
  });

  // ================== Score visualization row ==================
  const vizY = fieldsY + 70;
  const vizH = 200;

  // Card backdrop for severity meter (left)
  const meterBoxW = 280;
  pdf.setFillColor(255, 251, 240); pdf.setDrawColor(...C.line);
  pdf.roundedRect(M, vizY, meterBoxW, vizH, 8, 8, "FD");
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...C.inkMuted);
  pdf.text("SEVERITY RANGE", M + 12, vizY + 16);

  // Vertical 5-band gradient bar (shifted right so we can place score label on its left)
  const barX = M + 70, barY = vizY + 28, barW = 36, barH = vizH - 48;
  const bandH = barH / 5;
  const bands = [
    [SEV.Subclinical, "0–7",  "Subclinical"],
    [SEV.Mild,        "8–15", "Mild"],
    [SEV.Moderate,    "16–23","Moderate"],
    [SEV.Severe,      "24–31","Severe"],
    [SEV.Extreme,     "32–40","Extreme"],
  ];
  bands.forEach(([rgb], i) => {
    pdf.setFillColor(...rgb);
    pdf.rect(barX, barY + i * bandH, barW, bandH, "F");
  });

  // Score indicator — big dot (ring style) at the correct Y
  const pct = Math.min(1, Math.max(0, a.total_score / 40));
  const dotY = barY + pct * barH;

  // Score label on the LEFT of the bar with a horizontal line pointer
  pdf.setFont("times", "bold"); pdf.setFontSize(22); pdf.setTextColor(...C.ink);
  pdf.text(String(a.total_score), barX - 14, dotY + 6, { align: "right" });
  pdf.setDrawColor(...C.ink); pdf.setLineWidth(1.2);
  pdf.line(barX - 10, dotY, barX - 2, dotY);

  // Big ringed dot on the bar
  pdf.setFillColor(...C.cream); pdf.setDrawColor(...C.ink); pdf.setLineWidth(2.2);
  pdf.circle(barX + barW / 2, dotY, 9, "FD");

  // Bands legend on right
  bands.forEach(([rgb, range, label], i) => {
    const ly = barY + i * bandH + bandH / 2;
    pdf.setFont("times", "bold"); pdf.setFontSize(11); pdf.setTextColor(...rgb);
    pdf.text(range, barX + barW + 14, ly);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(...C.inkSoft);
    pdf.text(label, barX + barW + 14, ly + 11);
  });

  // Right side: sub-score cards (Obsessions / Compulsions)
  const subX = M + meterBoxW + 14;
  const subW = contentW - meterBoxW - 14;
  const subCardH = (vizH - 14) / 2;

  const drawSubCard = (y, title, score, color) => {
    pdf.setFillColor(255, 251, 240); pdf.setDrawColor(...C.line);
    pdf.roundedRect(subX, y, subW, subCardH, 8, 8, "FD");

    // Label
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...C.inkMuted);
    pdf.text(title.toUpperCase(), subX + 16, y + 18);

    // Big score number (own baseline, left)
    pdf.setFont("times", "bold"); pdf.setFontSize(32); pdf.setTextColor(...C.ink);
    pdf.text(String(score), subX + 16, y + 54);

    // "/ 20" on its own line below (never overlaps)
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(...C.inkMuted);
    pdf.text("out of 20", subX + 16, y + 70);

    // Full-width progress bar near bottom
    const pbX = subX + 16;
    const pbW = subW - 32;
    const pbH = 7;
    const pbY = y + subCardH - 18;
    pdf.setFillColor(...C.creamDeep);
    pdf.roundedRect(pbX, pbY, pbW, pbH, 3.5, 3.5, "F");
    pdf.setFillColor(...color);
    pdf.roundedRect(pbX, pbY, pbW * (score / 20), pbH, 3.5, 3.5, "F");
  };
  drawSubCard(vizY,                "Obsessions",  a.obsession_score,  C.burnt);
  drawSubCard(vizY + subCardH + 14, "Compulsions", a.compulsion_score, C.orange);

  // ================== Per-question chart ==================
  const chartY = vizY + vizH + 18;
  const chartH = 150;
  pdf.setFillColor(255, 251, 240); pdf.setDrawColor(...C.line);
  pdf.roundedRect(M, chartY, contentW, chartH, 8, 8, "FD");

  pdf.setFont("times", "bold"); pdf.setFontSize(13); pdf.setTextColor(...C.ink);
  pdf.text("Per-question breakdown", M + 14, chartY + 18);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(...C.inkMuted);
  pdf.text("Q1–Q5 Obsessions  ·  Q6–Q10 Compulsions  ·  scale 0–4", M + 14, chartY + 30);

  // Bars
  const barAreaX = M + 36;
  const barAreaY = chartY + 46;
  const barAreaW = contentW - 60;
  const barAreaH = chartH - 64;
  const slot = barAreaW / 10;
  const barWidth = slot * 0.55;

  // Y-axis grid
  pdf.setDrawColor(...C.line);
  for (let i = 0; i <= 4; i++) {
    const yy = barAreaY + barAreaH - (i / 4) * barAreaH;
    pdf.setLineWidth(0.4);
    pdf.line(barAreaX, yy, barAreaX + barAreaW, yy);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...C.inkMuted);
    pdf.text(String(i), barAreaX - 10, yy + 2, { align: "right" });
  }
  // Bars + labels
  for (let i = 0; i < 10; i++) {
    const v = a.answers[`q${i + 1}`] ?? 0;
    const bx = barAreaX + i * slot + (slot - barWidth) / 2;
    const bh = (v / 4) * barAreaH;
    const by = barAreaY + barAreaH - bh;
    pdf.setFillColor(...(i < 5 ? C.burnt : C.orange));
    pdf.roundedRect(bx, by, barWidth, Math.max(bh, 1), 3, 3, "F");
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...C.inkSoft);
    pdf.text(`Q${i + 1}`, bx + barWidth / 2, barAreaY + barAreaH + 12, { align: "center" });
  }

  // Footer
  drawFooter(pdf, 1);

  /* ============== PAGE 2 — Clinical Interpretation ============== */
  pdf.addPage();

  pdf.setFont("times", "bold"); pdf.setFontSize(20); pdf.setTextColor(...C.ink);
  pdf.text("Clinical interpretation", M, M + 14);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(...C.inkMuted);
  pdf.text(`${a.patient_name} · ${new Date(a.date).toLocaleDateString()}`, M, M + 30);

  let y = M + 50;

  // Manual clinician notes (priority — therapist's own write-up)
  if (a.manual_notes && a.manual_notes.trim()) {
    pdf.setFillColor(...C.creamSoft); pdf.setDrawColor(...C.line);
    pdf.roundedRect(M, y, contentW, 26, 6, 6, "FD");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor(...C.brick);
    pdf.text("CLINICIAN'S NOTES", M + 12, y + 16);
    y += 36;
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(11); pdf.setTextColor(...C.ink);
    const lines = pdf.splitTextToSize(a.manual_notes.trim(), contentW);
    y = drawTextBlock(pdf, lines, M, y, 14, () => addPageWithFooter(pdf, M));
    y += 18;
  }

  const ai = a.ai_summary;
  const showAi = a.include_ai_in_pdf !== false;
  if (ai && showAi) {
    if (ai.interpretation) {
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor(...C.brick);
      pdf.text("AI-ASSISTED INTERPRETATION", M, y);
      y += 14;
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(11); pdf.setTextColor(...C.inkSoft);
      const lines = pdf.splitTextToSize(ai.interpretation, contentW);
      y = drawTextBlock(pdf, lines, M, y, 14, () => addPageWithFooter(pdf, M));
      y += 14;
    }
    if (ai.key_concerns?.length) {
      y = drawBulletList(pdf, "KEY CONCERNS", ai.key_concerns, M, y, contentW, C);
    }
    if (ai.recommendations?.length) {
      y = drawBulletList(pdf, "RECOMMENDATIONS", ai.recommendations, M, y, contentW, C);
    }
    if (ai.risk_flags?.length) {
      y = drawBulletList(pdf, "RISK FLAGS", ai.risk_flags, M, y, contentW, C, true);
    }
  }

  drawFooter(pdf, pdf.internal.getNumberOfPages());

  /* ============== PAGE 3+ — Checklist tables ============== */
  if (meta) {
    drawChecklistSection(pdf, "Obsessions checklist", meta.obsession_checklist,
                         a.obsessions_current || [], a.obsessions_past || [],
                         a.principal_obsession, M, contentW, C);
    drawChecklistSection(pdf, "Compulsions checklist", meta.compulsion_checklist,
                         a.compulsions_current || [], a.compulsions_past || [],
                         a.principal_compulsion, M, contentW, C);
  }

  // Page numbers on every page
  const total = pdf.internal.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    pdf.setPage(p);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(...C.inkMuted);
    pdf.text(`${p} / ${total}`, W - M, H - 22, { align: "right" });
  }

  pdf.save(`YBOCS_${(a.patient_name || "client").replace(/\s+/g, "_")}_${new Date(a.date).toISOString().slice(0, 10)}.pdf`);
}

function drawTextBlock(pdf, lines, x, y, lh, onNewPage) {
  const H = pdf.internal.pageSize.getHeight();
  const bottom = H - 50;
  for (const line of lines) {
    if (y > bottom) {
      onNewPage();
      y = 50;
    }
    pdf.text(line, x, y);
    y += lh;
  }
  return y;
}

function addPageWithFooter(pdf, M) {
  pdf.addPage();
}

function drawBulletList(pdf, title, items, x, y, w, C, isRisk = false) {
  const H = pdf.internal.pageSize.getHeight();
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(8);
  pdf.setTextColor(...(isRisk ? C.brick : C.brick));
  pdf.text(title, x, y);
  y += 14;
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.setTextColor(...C.ink);
  for (const it of items) {
    if (y > H - 60) {
      pdf.addPage();
      y = 50;
    }
    const lines = pdf.splitTextToSize(`•  ${it}`, w - 10);
    for (const l of lines) {
      pdf.text(l, x + 6, y);
      y += 13;
    }
    y += 2;
  }
  return y + 10;
}

function drawChecklistSection(pdf, title, categories, current, past, principal, M, contentW, C) {
  const curSet = new Set(current);
  const pastSet = new Set(past);
  // PDF shows ONLY items where Current is checked. Past-only items are excluded.
  const visible = categories
    .map((c) => ({ ...c, items: c.items.filter((i) => curSet.has(i)) }))
    .filter((c) => c.items.length > 0);
  if (visible.length === 0) return;

  pdf.addPage();
  pdf.setFont("times", "bold"); pdf.setFontSize(20); pdf.setTextColor(...C.ink);
  pdf.text(title, M, M + 14);
  if (principal) {
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(...C.brick);
    pdf.text(`Principal: ${principal} *`, M, M + 30);
  }

  let startY = M + 44;

  for (const cat of visible) {
    const body = cat.items.map((it) => [
      it === principal ? `${it}  *` : it,
      "cur",
      pastSet.has(it) ? "past" : "",
    ]);

    autoTable(pdf, {
      startY,
      head: [[
        { content: cat.category, colSpan: 3, styles: {
          fillColor: C.creamSoft, textColor: C.brick, halign: "left",
          fontStyle: "bold", fontSize: 10,
        }}
      ], [
        { content: "Symptom", styles: { halign: "left" } },
        { content: "Current", styles: { halign: "center" } },
        { content: "Past",    styles: { halign: "center" } },
      ]],
      body,
      theme: "plain",
      margin: { left: M, right: M },
      tableWidth: contentW,
      styles: {
        font: "helvetica",
        fontSize: 9,
        textColor: C.inkSoft,
        cellPadding: { top: 6, right: 6, bottom: 6, left: 6 },
        lineColor: C.line,
        lineWidth: 0.4,
      },
      headStyles: {
        fillColor: C.cream,
        textColor: C.inkMuted,
        fontSize: 7,
        fontStyle: "normal",
        cellPadding: { top: 4, right: 6, bottom: 4, left: 6 },
      },
      columnStyles: {
        0: { cellWidth: contentW - 140 },
        1: { cellWidth: 70, halign: "center" },
        2: { cellWidth: 70, halign: "center" },
      },
      didParseCell: (data) => {
        if (data.section === "body") {
          if (data.column.index === 0 && body[data.row.index][0].includes("*")) {
            data.cell.styles.textColor = C.ink;
            data.cell.styles.fontStyle = "bold";
          }
          // Hide the raw "cur"/"past" text — we'll render a custom square in didDrawCell
          if (data.column.index === 1 || data.column.index === 2) {
            data.cell.text = [""];
          }
        }
      },
      didDrawCell: (data) => {
        if (data.section !== "body") return;
        if (data.column.index !== 1 && data.column.index !== 2) return;
        const raw = body[data.row.index][data.column.index];
        const on = raw === "cur" || raw === "past";
        if (!on) return;

        // Draw a prominent filled terracotta rounded square with white check
        const size = 14;
        const cx = data.cell.x + data.cell.width / 2;
        const cy = data.cell.y + data.cell.height / 2;
        const x = cx - size / 2;
        const y = cy - size / 2;
        pdf.setFillColor(...C.burnt);
        pdf.setDrawColor(...C.burnt);
        pdf.roundedRect(x, y, size, size, 2.5, 2.5, "FD");
        // white check
        pdf.setDrawColor(...C.cream);
        pdf.setLineWidth(1.8);
        pdf.line(x + 3, cy + 0.3, x + 6, cy + 3);
        pdf.line(x + 6, cy + 3, x + size - 2.5, y + 3.5);
      },
      showHead: "firstPage",
      pageBreak: "auto",
      rowPageBreak: "avoid",
    });
    startY = pdf.lastAutoTable.finalY + 14;
  }
}

function drawFooter(pdf, _page) {
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  pdf.setDrawColor(...C.line); pdf.setLineWidth(0.4);
  pdf.line(36, H - 36, W - 36, H - 36);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...C.inkMuted);
  pdf.text("Radial · Y-BOCS Clinical Suite", 36, H - 22);
}
