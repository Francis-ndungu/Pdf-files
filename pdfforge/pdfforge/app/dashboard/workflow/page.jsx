
"use client";
import { useState } from "react";
import Link from "next/link";

const TEMPLATES = [
  { name: "Merge & Compress", desc: "Combine PDFs then optimise file size", nodes: ["Input Files", "Merge PDF", "Compress PDF", "Output"], color: "#D85A30" },
  { name: "Office to PDF", desc: "Convert Word/Excel/PPT to PDF", nodes: ["Input Files", "Convert to PDF", "Add Watermark", "Output"], color: "#378ADD" },
  { name: "Secure Document", desc: "Redact sensitive data then encrypt", nodes: ["Input PDF", "Redact", "Protect PDF", "Output"], color: "#EF9F27" },
  { name: "OCR Archive", desc: "Make scanned PDFs searchable & archive", nodes: ["Scanned PDFs", "OCR", "Convert to PDF/A", "Output"], color: "#5DCAA5" },
  { name: "Split & Watermark", desc: "Extract pages then brand each one", nodes: ["Input PDF", "Split PDF", "Add Watermark", "Output"], color: "#AFA9EC" },
  { name: "Invoice Processing", desc: "Extract tables from PDF invoices", nodes: ["Invoice PDFs", "OCR", "PDF to Excel", "Output CSV"], color: "#97C459" },
];

export default function WorkflowPage() {
  const [selected, setSelected] = useState(0);
  const tpl = TEMPLATES[selected];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ background: "#1e3d41", borderBottom: "1px solid #2a5259", padding: "0 24px", height: 52, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: "#e8f4f5", marginRight: "auto" }}>Workflow Builder</span>
        <span style={{ fontSize: 11, background: "rgba(93,202,165,0.15)", color: "#5DCAA5", padding: "3px 10px", borderRadius: 10, fontWeight: 500 }}>New</span>
        <button style={{ padding: "7px 16px", background: "#D85A30", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--sans)" }}>Run Workflow</button>
      </div>
      <div style={{ flex: 1, padding: 20, overflowY: "auto", background: "#183438" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>

          {/* Template list */}
          <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #2a5259", fontSize: 12, fontWeight: 600, color: "#4a7a80", textTransform: "uppercase", letterSpacing: "0.8px" }}>Templates</div>
            {TEMPLATES.map((t, i) => (
              <div key={i} onClick={() => setSelected(i)}
                style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #2a5259", background: selected===i?"rgba(216,90,48,0.1)":"transparent", borderLeft: selected===i?`3px solid ${t.color}`:"3px solid transparent" }}
                onMouseEnter={e => e.currentTarget.style.background=selected===i?"rgba(216,90,48,0.1)":"#224146"} onMouseLeave={e => e.currentTarget.style.background=selected===i?"rgba(216,90,48,0.1)":"transparent"}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#e8f4f5", marginBottom: 3 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#4a7a80", lineHeight: 1.4 }}>{t.desc}</div>
              </div>
            ))}
          </div>

          {/* Canvas */}
          <div>
            <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#e8f4f5", marginBottom: 6 }}>{tpl.name}</div>
              <div style={{ fontSize: 13, color: "#8fb3b8", marginBottom: 24 }}>{tpl.desc}</div>

              {/* Node pipeline */}
              <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
                {tpl.nodes.map((node, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    <div style={{ background: "#224146", border: `1px solid ${i===0||i===tpl.nodes.length-1?"#3a6570":tpl.color}`, borderRadius: 10, padding: "14px 18px", minWidth: 130, textAlign: "center", position: "relative" }}>
                      <div style={{ fontSize: 18, marginBottom: 6 }}>
                        {i===0?"📂":i===tpl.nodes.length-1?"💾":["🔄","✏","🔍","📊","🗜","🔒","💧"][i%7]}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: i===0||i===tpl.nodes.length-1?"#8fb3b8":tpl.color }}>{node}</div>
                      {i > 0 && i < tpl.nodes.length - 1 && (
                        <div style={{ position: "absolute", top: -8, right: -8, width: 16, height: 16, background: tpl.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                          <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      )}
                    </div>
                    {i < tpl.nodes.length - 1 && (
                      <div style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
                        <div style={{ width: 32, height: 2, background: `linear-gradient(90deg,${tpl.color},${tpl.color}88)` }} />
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={tpl.color} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upload for workflow */}
            <div style={{ background: "#1a3b3f", border: "1px dashed #3a6570", borderRadius: 10, padding: "28px 24px", textAlign: "center", cursor: "pointer", marginBottom: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📂</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#e8f4f5", marginBottom: 4 }}>Drop files to start workflow</div>
              <div style={{ fontSize: 12, color: "#4a7a80" }}>Files will be processed through: {tpl.nodes.slice(1,-1).join(" → ")}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {TEMPLATES.filter((_,i) => i !== selected).slice(0,3).map((t, i) => (
                <div key={i} onClick={() => setSelected(TEMPLATES.indexOf(t))}
                  style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 8, padding: "14px 16px", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background="#224146"} onMouseLeave={e => e.currentTarget.style.background="#1a3b3f"}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, marginBottom: 8 }} />
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#e8f4f5", marginBottom: 3 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#4a7a80" }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
