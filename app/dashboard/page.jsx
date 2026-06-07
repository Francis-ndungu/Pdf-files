
"use client";
import { useState } from "react";
import Link from "next/link";

const RECENT = [
  { name: "Annual_Report_2025.docx", action: "Word → PDF", size: "1.2 MB", time: "Just now", status: "processing", icon: "📄", iconBg: "rgba(55,138,221,0.2)" },
  { name: "Budget_Q4_Final.xlsx", action: "Excel → PDF", size: "840 KB", time: "4 min ago", status: "done", icon: "📊", iconBg: "rgba(99,153,34,0.18)" },
  { name: "scanned_invoice_nov.png", action: "Image → PDF (OCR)", size: "2.4 MB", time: "12 min ago", status: "done", icon: "🖼", iconBg: "rgba(127,119,221,0.18)" },
  { name: "Pitch_Deck_v3.pptx", action: "PPT → PDF", size: "5.1 MB", time: "28 min ago", status: "done", icon: "📑", iconBg: "rgba(216,90,48,0.18)" },
  { name: "ebook_draft.epub", action: "EPUB → PDF", size: "3.8 MB", time: "1 hr ago", status: "failed", icon: "📕", iconBg: "rgba(226,75,74,0.15)" },
];

const QUICK_TOOLS = [
  { name: "Merge PDF", icon: "🔀", bg: "rgba(216,90,48,0.18)", href: "/tools/merge-pdf" },
  { name: "Split PDF", icon: "✂", bg: "rgba(55,138,221,0.18)", href: "/tools/split-pdf" },
  { name: "OCR", icon: "🔍", bg: "rgba(127,119,221,0.18)", href: "/tools/ocr-pdf" },
  { name: "Compress", icon: "🗜", bg: "rgba(99,153,34,0.18)", href: "/tools/compress-pdf" },
  { name: "Sign", icon: "✍", bg: "rgba(55,138,221,0.15)", href: "/tools/sign-pdf" },
  { name: "Summarise", icon: "✨", bg: "rgba(93,202,165,0.15)", href: "/tools/summarize-pdf" },
];

const BARS = [
  { label: "Word → PDF", count: 482, color: "#D85A30", pct: 75 },
  { label: "Image → PDF", count: 318, color: "#5DCAA5", pct: 49 },
  { label: "PDF → Word", count: 241, color: "#378ADD", pct: 37 },
  { label: "Excel → PDF", count: 148, color: "#EF9F27", pct: 23 },
  { label: "PDF → Excel", count: 95, color: "#AFA9EC", pct: 15 },
];

function StatusPill({ s }) {
  const map = { done: ["rgba(93,202,165,0.15)", "#5DCAA5", "Done"], processing: ["rgba(239,159,39,0.15)", "#EF9F27", "Processing…"], failed: ["rgba(226,75,74,0.15)", "#F09595", "Failed"] };
  const [bg, col, lbl] = map[s] || map.done;
  return <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, fontWeight: 500, background: bg, color: col }}>{lbl}</span>;
}

export default function DashboardPage() {
  const [searchQ, setSearchQ] = useState("");
  const [srOpen, setSrOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Topbar */}
      <div style={{ background: "#1e3d41", borderBottom: "1px solid #2a5259", padding: "0 24px", height: 52, display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: "#e8f4f5", marginRight: "auto" }}>Dashboard</span>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#4a7a80" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={searchQ} onChange={e => { setSearchQ(e.target.value); setSrOpen(!!e.target.value); }}
            onFocus={() => searchQ && setSrOpen(true)} onBlur={() => setTimeout(() => setSrOpen(false), 200)}
            placeholder='Search tools — "merge", "OCR", "Word"…'
            style={{ width: "100%", padding: "7px 10px 7px 32px", background: "#224146", border: "1px solid #2a5259", borderRadius: 8, color: "#e8f4f5", fontSize: 13, outline: "none", fontFamily: "var(--sans)" }} />
          {srOpen && searchQ && (
            <div style={{ position: "absolute", left: 0, right: 0, top: "100%", background: "#1e3d41", border: "1px solid #2a5259", borderTop: "none", borderRadius: "0 0 8px 8px", zIndex: 99, maxHeight: 280, overflowY: "auto" }}>
              {["Merge PDF","Split PDF","Compress PDF","OCR","Sign PDF","Protect PDF","Word to PDF","Image to PDF","Translate PDF","Summarise PDF"].filter(n => n.toLowerCase().includes(searchQ.toLowerCase())).map(n => (
                <Link key={n} href={`/tools/${n.toLowerCase().replace(/ /g,'-').replace(/\//g,'-to-')}`}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", color: "#e8f4f5", textDecoration: "none", fontSize: 13 }}
                  onMouseEnter={e => e.currentTarget.style.background="#224146"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#4a7a80" strokeWidth="1.6" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16"/><polyline points="14 2 20 8 20 22 4 22"/></svg>
                  {n}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Tab filters */}
        {[["To PDF","convert-to"],["From PDF","convert-from"],["Tools","tools"]].map(([l, c]) => (
          <Link key={l} href={`/tools?cat=${c}`} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 20, cursor: "pointer", border: "1px solid #3a6570", background: "transparent", color: "#8fb3b8", textDecoration: "none", transition: "all .15s" }}>{l}</Link>
        ))}

        <Link href="/tools" style={{ padding: "7px 16px", background: "#D85A30", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 5 5 12"/></svg>
          Upload file
        </Link>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto", background: "#183438" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total conversions", val: "1,284", change: "+12%", up: true, icon: "📄", bg: "rgba(216,90,48,0.15)" },
            { label: "Success rate", val: "98.4%", change: "+0.3%", up: true, icon: "✅", bg: "rgba(93,202,165,0.15)" },
            { label: "Avg. process time", val: "3.2s", change: "+0.4s", up: false, icon: "⏱", bg: "rgba(239,159,39,0.15)" },
            { label: "Storage used", val: "4.7 GB", change: "47% of 10 GB", up: true, icon: "💾", bg: "rgba(93,202,165,0.1)" },
          ].map(s => (
            <div key={s.label} style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: "#4a7a80", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#e8f4f5", marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: s.up ? "#5DCAA5" : "#E07050" }}>{s.up ? "↑" : "↓"} {s.change}</div>
            </div>
          ))}
        </div>

        {/* Two-col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 20 }}>
          {/* Recent conversions */}
          <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10 }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #2a5259", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#e8f4f5" }}>Recent conversions</span>
              <Link href="/dashboard/history" style={{ fontSize: 12, color: "#E07050", textDecoration: "none" }}>View all</Link>
            </div>
            <div>
              {RECENT.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: i < RECENT.length - 1 ? "1px solid #2a5259" : "none" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 7, background: r.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{r.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "#e8f4f5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "#4a7a80" }}>{r.action} · {r.size} · {r.time}</div>
                  </div>
                  <StatusPill s={r.status} />
                  {r.status === "done" && <button style={{ fontSize: 11, color: "#E07050", background: "none", border: "none", cursor: "pointer", padding: "3px 8px", borderRadius: 5 }}>Download</button>}
                  {r.status === "failed" && <button style={{ fontSize: 11, color: "#4a7a80", background: "none", border: "none", cursor: "pointer", padding: "3px 8px", borderRadius: 5 }}>Retry</button>}
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Quick convert */}
            <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10 }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #2a5259" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#e8f4f5" }}>Quick convert</span>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ border: "1.5px dashed #3a6570", borderRadius: 10, padding: "20px 14px", textAlign: "center", cursor: "pointer", marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, background: "rgba(216,90,48,0.15)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#E07050" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#e8f4f5", marginBottom: 3 }}>Drop file here</div>
                  <div style={{ fontSize: 11, color: "#4a7a80" }}>or click to browse</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#4a7a80", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.4px" }}>Output</div>
                    <select style={{ width: "100%", padding: "7px 8px", background: "#224146", border: "1px solid #2a5259", borderRadius: 6, color: "#e8f4f5", fontSize: 12, fontFamily: "var(--sans)" }}>
                      <option>To PDF</option><option>From PDF</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#4a7a80", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.4px" }}>Quality</div>
                    <select style={{ width: "100%", padding: "7px 8px", background: "#224146", border: "1px solid #2a5259", borderRadius: 6, color: "#e8f4f5", fontSize: 12, fontFamily: "var(--sans)" }}>
                      <option>High</option><option>Standard</option><option>Compressed</option>
                    </select>
                  </div>
                </div>
                <button style={{ width: "100%", padding: 10, background: "#D85A30", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--sans)" }}>Convert now</button>
              </div>
            </div>

            {/* Popular tools */}
            <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10 }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #2a5259", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#e8f4f5" }}>Popular tools</span>
                <Link href="/tools" style={{ fontSize: 12, color: "#E07050", textDecoration: "none" }}>All tools</Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#2a5259", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
                {QUICK_TOOLS.map(t => (
                  <Link key={t.name} href={t.href} style={{ background: "#1a3b3f", padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
                    onMouseEnter={e => e.currentTarget.style.background="#224146"} onMouseLeave={e => e.currentTarget.style.background="#1a3b3f"}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{t.icon}</div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#e8f4f5" }}>{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10 }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #2a5259", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#e8f4f5" }}>Conversion volume by format</span>
            <span style={{ fontSize: 12, color: "#4a7a80" }}>This month</span>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {BARS.map(b => (
              <div key={b.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#8fb3b8" }}>{b.label}</span>
                  <span style={{ fontSize: 12, color: "#e8f4f5", fontWeight: 500 }}>{b.count}</span>
                </div>
                <div style={{ height: 5, background: "#224146", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${b.pct}%`, height: "100%", background: b.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
