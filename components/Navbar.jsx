"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, FileText, Github } from "lucide-react";
import { TOOLS } from "@/lib/tools";

export default function Navbar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const results = q.length > 1
    ? TOOLS.filter(t => t.name.toLowerCase().includes(q.toLowerCase()) || t.desc.toLowerCase().includes(q.toLowerCase())).slice(0, 7)
    : [];

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        height:"var(--nav-h)",
        background: scrolled ? "rgba(24,52,56,0.97)" : "#183438",
        borderBottom: `1px solid ${scrolled ? "#2a5259" : "transparent"}`,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        display:"flex", alignItems:"center",
        padding:"0 var(--pad)", gap:16,
        transition:"all 0.3s",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", flexShrink:0 }}>
          <div style={{ width:34, height:34, background:"#D85A30", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FileText size={17} color="white" strokeWidth={1.8} />
          </div>
          <span style={{ fontSize:17, fontWeight:600, color:"#f0f9fa", letterSpacing:"-0.4px", fontFamily:"var(--sans)" }}>
            PDF<span style={{ color:"#D85A30" }}>forge</span>
          </span>
        </Link>

        {/* Search — hidden on mobile */}
        <div style={{ flex:1, maxWidth:480, position:"relative", display:"flex" }} className="search-desktop">
          <div style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#517880" }}>
            <Search size={14} strokeWidth={2} />
          </div>
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => q && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder="Search 50+ tools…"
            style={{
              width:"100%", padding:"8px 12px 8px 34px",
              background:"#1e3d41", border:"1px solid #2a5259",
              borderRadius:9, color:"#f0f9fa", fontSize:13,
              fontFamily:"var(--sans)", outline:"none",
              transition:"border-color 0.15s",
            }}
            onMouseEnter={e => e.target.style.borderColor="#366068"}
            onMouseLeave={e => { if (document.activeElement !== e.target) e.target.style.borderColor="#2a5259"; }}
          />
          {open && results.length > 0 && (
            <div style={{
              position:"absolute", top:"calc(100% + 6px)", left:0, right:0,
              background:"#1e3d41", border:"1px solid #2a5259", borderRadius:10,
              boxShadow:"0 12px 40px rgba(0,0,0,0.4)", overflow:"hidden", zIndex:300,
            }}>
              {results.map(t => (
                <Link key={t.slug} href={`/tools/${t.slug}`}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", textDecoration:"none", borderBottom:"1px solid #2a5259" }}
                  onMouseEnter={e => e.currentTarget.style.background="#224146"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <div style={{ width:28, height:28, borderRadius:6, background:"rgba(216,90,48,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <FileText size={13} color="#D85A30" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:"#f0f9fa" }}>{t.name}</div>
                    <div style={{ fontSize:11, color:"#517880", marginTop:1 }}>{t.desc.slice(0,60)}…</div>
                  </div>
                  <span style={{ marginLeft:"auto", fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:600, background:"rgba(216,90,48,0.12)", color:"#D85A30", whiteSpace:"nowrap" }}>Open</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          <a href="https://github.com" target="_blank" rel="noopener" style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", border:"1px solid #2a5259", borderRadius:8, color:"#8fb3b8", fontSize:13, textDecoration:"none", fontFamily:"var(--sans)", transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#366068"; e.currentTarget.style.color="#f0f9fa"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#2a5259"; e.currentTarget.style.color="#8fb3b8"; }}>
            <Github size={14} strokeWidth={1.8} />
            <span className="hide-sm">GitHub</span>
          </a>
          <button className="nav-mobile-menu" onClick={() => setMobileOpen(v=>!v)}
            style={{ padding:8, background:"transparent", border:"1px solid #2a5259", borderRadius:7, color:"#8fb3b8", cursor:"pointer" }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile search overlay */}
      {mobileOpen && (
        <div style={{ position:"fixed", top:"var(--nav-h)", left:0, right:0, bottom:0, background:"#183438", zIndex:190, padding:"20px var(--pad)", overflowY:"auto" }}>
          <div style={{ position:"relative", marginBottom:20 }}>
            <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#517880" }} />
            <input placeholder="Search tools…" style={{ width:"100%", padding:"10px 12px 10px 34px", background:"#1e3d41", border:"1px solid #2a5259", borderRadius:9, color:"#f0f9fa", fontSize:14, fontFamily:"var(--sans)", outline:"none" }} />
          </div>
          <p style={{ fontSize:12, color:"#517880", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.6px", fontWeight:600 }}>Quick access</p>
          {TOOLS.slice(0, 12).map(t => (
            <Link key={t.slug} href={`/tools/${t.slug}`} onClick={() => setMobileOpen(false)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #2a5259", textDecoration:"none", color:"#f0f9fa", fontSize:14 }}>
              <div style={{ width:32, height:32, borderRadius:7, background:"rgba(216,90,48,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FileText size={14} color="#D85A30" strokeWidth={1.5} />
              </div>
              {t.name}
            </Link>
          ))}
        </div>
      )}

      <style>{`.hide-sm { } .search-desktop { } @media(max-width:600px){.hide-sm{display:none}.search-desktop{display:none!important}}`}</style>
    </>
  );
}
