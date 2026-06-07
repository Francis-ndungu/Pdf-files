
"use client";
import { useState } from "react";
import Link from "next/link";

const HISTORY = [
  { name: "Annual_Report_2025.docx", action: "Word → PDF", size: "1.2 MB", time: "Today, 10:32", status: "done", icon: "📄" },
  { name: "Budget_Q4_Final.xlsx", action: "Excel → PDF", size: "840 KB", time: "Today, 10:28", status: "done", icon: "📊" },
  { name: "scanned_invoice_nov.png", action: "Image → PDF (OCR)", size: "2.4 MB", time: "Today, 10:20", status: "done", icon: "🖼" },
  { name: "Pitch_Deck_v3.pptx", action: "PPT → PDF", size: "5.1 MB", time: "Today, 10:04", status: "done", icon: "📑" },
  { name: "ebook_draft.epub", action: "EPUB → PDF", size: "3.8 MB", time: "Today, 09:45", status: "failed", icon: "📕" },
  { name: "contract_v2.pdf", action: "Merge PDF", size: "2.1 MB", time: "Yesterday, 17:20", status: "done", icon: "📄" },
  { name: "report_pages.pdf", action: "Split PDF", size: "4.4 MB", time: "Yesterday, 15:11", status: "done", icon: "📄" },
  { name: "scan_001.pdf", action: "OCR", size: "890 KB", time: "Yesterday, 14:03", status: "done", icon: "🔍" },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState("all");
  const filtered = HISTORY.filter(h => filter === "all" || h.status === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ background: "#1e3d41", borderBottom: "1px solid #2a5259", padding: "0 24px", height: 52, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: "#e8f4f5", marginRight: "auto" }}>History</span>
        {[["all","All"],["done","Done"],["failed","Failed"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: "5px 14px", fontSize: 12, borderRadius: 20, border: "1px solid", background: filter===v?"#D85A30":"transparent", color: filter===v?"#fff":"#8fb3b8", borderColor: filter===v?"#D85A30":"#3a6570", cursor: "pointer", fontFamily:"var(--sans)" }}>{l}</button>
        ))}
      </div>
      <div style={{ flex: 1, padding: 20, overflowY: "auto", background: "#183438" }}>
        <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1e3d41" }}>
                {["File","Action","Size","Time","Status",""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#4a7a80", textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 600, borderBottom: "1px solid #2a5259" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #2a5259" }}
                  onMouseEnter={e => e.currentTarget.style.background="#1e3d41"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{r.icon}</span>
                      <span style={{ fontSize: 13, color: "#e8f4f5" }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#8fb3b8" }}>{r.action}</td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#4a7a80" }}>{r.size}</td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#4a7a80" }}>{r.time}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, fontWeight: 500,
                      background: r.status==="done"?"rgba(93,202,165,0.15)":"rgba(226,75,74,0.15)",
                      color: r.status==="done"?"#5DCAA5":"#F09595" }}>{r.status==="done"?"Done":"Failed"}</span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    {r.status==="done" && <button style={{ fontSize: 11, color: "#E07050", background: "none", border: "none", cursor: "pointer" }}>Download</button>}
                    {r.status==="failed" && <button style={{ fontSize: 11, color: "#4a7a80", background: "none", border: "none", cursor: "pointer" }}>Retry</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
