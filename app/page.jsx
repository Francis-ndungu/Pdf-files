"use client";
import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { Search, ArrowRight, Lock, Cpu, Zap } from "lucide-react";
import * as LucideIcons from "lucide-react";

function Icon({ name, size = 18, color, ...props }) {
  const C = LucideIcons[name] || LucideIcons.File;
  return <C size={size} color={color} strokeWidth={1.6} {...props} />;
}

function ToolCard({ tool, catColor, catBg, delay = 0 }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="tool-card"
      style={{ "--card-accent": catColor, animationDelay: `${delay}ms` }}
    >
      {/* Top row: icon + badge */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div style={{
          width:42, height:42, borderRadius:9,
          background: catBg,
          display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0,
        }}>
          <Icon name={tool.icon} size={18} color={catColor} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
          {tool.ai   && <span className="pill pill-ai"  style={{ fontSize:9 }}>AI</span>}
          {tool.wasm && <span className="pill pill-pro" style={{ fontSize:9 }}>WASM</span>}
          {tool.multi&& <span className="pill pill-new" style={{ fontSize:9 }}>Batch</span>}
        </div>
      </div>

      {/* Name + desc */}
      <div>
        <div style={{ fontSize:14, fontWeight:600, color:"#f0f9fa", marginBottom:5, lineHeight:1.3 }}>{tool.name}</div>
        <div style={{ fontSize:12, color:"#8fb3b8", lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {tool.desc}
        </div>
      </div>

      {/* Footer: formats + open */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"auto", paddingTop:8 }}>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {(tool.accepts||[]).slice(0,2).map(a => (
            <span key={a} style={{ fontSize:10, background:"rgba(255,255,255,0.05)", color:"#517880", padding:"2px 6px", borderRadius:4, border:"1px solid rgba(255,255,255,0.06)" }}>{a}</span>
          ))}
          {(tool.accepts||[]).length > 2 && <span style={{ fontSize:10, color:"#517880" }}>+{tool.accepts.length-2}</span>}
        </div>
        <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:12, fontWeight:500, color: catColor }}>
          Open <ArrowRight size={12} strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const searchRef = useRef();

  const filtered = useMemo(() => {
    return TOOLS.filter(t => {
      const catOk = cat === "all" || t.category === cat;
      const qOk   = !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.desc.toLowerCase().includes(q.toLowerCase());
      return catOk && qOk;
    });
  }, [cat, q]);

  const grouped = useMemo(() => {
    const m = {};
    filtered.forEach(t => { if (!m[t.category]) m[t.category] = []; m[t.category].push(t); });
    return m;
  }, [filtered]);

  const catOrder = ["organize","edit","optimize","secure","convert-to","convert-from","ai"];
  const catInfo  = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingTop:"var(--nav-h)" }}>
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <div style={{
        background:"linear-gradient(180deg, #1b3c41 0%, #183438 100%)",
        borderBottom:"1px solid #2a5259",
        padding:"48px var(--pad) 0",
      }}>
        <div className="container" style={{ maxWidth:1400, margin:"0 auto" }}>
          {/* Title row */}
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:28 }}>
            <div>
              <h1 style={{ fontFamily:"var(--serif)", fontSize:"clamp(28px, 4vw, 44px)", fontWeight:400, color:"#f0f9fa", letterSpacing:"-0.8px", lineHeight:1.1, marginBottom:8 }}>
                Professional PDF Tools,<br />
                <span className="heading-accent">free for everyone.</span>
              </h1>
              <p style={{ fontSize:15, color:"#8fb3b8", fontWeight:300, maxWidth:520 }}>
                {TOOLS.length} tools. No login. No file uploads to servers. Everything runs in your browser.
              </p>
            </div>

            {/* Trust badges */}
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              {[
                { icon:Lock,  label:"Files stay local",    sub:"Never uploaded" },
                { icon:Cpu,   label:"Browser-powered",     sub:"WebAssembly" },
                { icon:Zap,   label:"Instant processing",  sub:"No waiting" },
              ].map(({ icon:Ic, label, sub }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid #2a5259", borderRadius:10 }}>
                  <div style={{ width:32, height:32, borderRadius:7, background:"rgba(216,90,48,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Ic size={15} color="#D85A30" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#f0f9fa" }}>{label}</div>
                    <div style={{ fontSize:11, color:"#517880" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position:"relative", marginBottom:24, maxWidth:640 }}>
            <Search size={15} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#517880", pointerEvents:"none" }} />
            <input
              ref={searchRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search tools by name, format, or action…"
              style={{
                width:"100%", padding:"13px 16px 13px 42px",
                background:"rgba(255,255,255,0.05)", border:"1px solid #2a5259",
                borderRadius:10, color:"#f0f9fa", fontSize:14,
                fontFamily:"var(--sans)", outline:"none",
                transition:"border-color 0.15s, background 0.15s",
              }}
              onFocus={e => { e.target.style.borderColor="#D85A30"; e.target.style.background="rgba(255,255,255,0.07)"; }}
              onBlur={e =>  { e.target.style.borderColor="#2a5259"; e.target.style.background="rgba(255,255,255,0.05)"; }}
            />
            {q && (
              <button onClick={() => setQ("")}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#517880", fontSize:18 }}>×</button>
            )}
          </div>

          {/* Category tabs */}
          <div className="cat-tabs">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`cat-tab ${cat === c.id ? "active" : ""}`}
                onClick={() => setCat(c.id)}
                style={cat === c.id ? { background: c.color, borderColor: c.color } : {}}
              >
                {c.label}
                {cat === c.id && <span style={{ marginLeft:6, background:"rgba(255,255,255,0.25)", borderRadius:10, padding:"0 6px", fontSize:10 }}>
                  {c.id === "all" ? TOOLS.length : TOOLS.filter(t=>t.category===c.id).length}
                </span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOOL GRID ── */}
      <div className="container" style={{ padding:"32px var(--pad)", maxWidth:1400, margin:"0 auto" }}>
        {/* Result count */}
        <div style={{ fontSize:12, color:"#517880", marginBottom:20, fontWeight:500 }}>
          {filtered.length === 0 ? "No tools found" : `Showing ${filtered.length} tool${filtered.length !== 1 ? "s" : ""}${q ? ` for "${q}"` : ""}`}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"64px 20px", color:"#517880" }}>
            <Search size={40} style={{ marginBottom:16, opacity:0.4 }} />
            <div style={{ fontSize:16, fontWeight:500, color:"#8fb3b8", marginBottom:6 }}>No tools found for "{q}"</div>
            <button onClick={() => { setQ(""); setCat("all"); }} style={{ marginTop:12, padding:"8px 20px", background:"#D85A30", border:"none", borderRadius:8, color:"#fff", fontSize:13, cursor:"pointer", fontFamily:"var(--sans)" }}>Clear filters</button>
          </div>
        )}

        {/* Grouped sections */}
        {cat === "all" ? (
          catOrder.map(cid => {
            const items = grouped[cid];
            if (!items?.length) return null;
            const ci = catInfo[cid];
            return (
              <div key={cid} style={{ marginBottom:40 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:ci.color, flexShrink:0 }} />
                  <span style={{ fontSize:13, fontWeight:700, color: ci.color, letterSpacing:"0.5px" }}>{ci.label}</span>
                  <span style={{ fontSize:11, color:"#517880" }}>— {items.length} tool{items.length!==1?"s":""}</span>
                  <div style={{ flex:1, height:1, background:"#2a5259" }} />
                </div>
                <div className="tool-grid">
                  {items.map((t, i) => (
                    <ToolCard key={t.slug} tool={t} catColor={ci.color} catBg={ci.bg} delay={i * 30} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="tool-grid">
            {filtered.map((t, i) => {
              const ci = catInfo[t.category];
              return <ToolCard key={t.slug} tool={t} catColor={ci.color} catBg={ci.bg} delay={i * 20} />;
            })}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid #2a5259", padding:"24px var(--pad)", marginTop:20, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:26, height:26, background:"#D85A30", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Lock size={12} color="white" strokeWidth={2} />
          </div>
          <span style={{ fontSize:13, color:"#517880" }}>All processing happens locally in your browser — your files never leave your device.</span>
        </div>
        <span style={{ fontSize:12, color:"#2a5259" }}>PDFforge © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
