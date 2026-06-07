"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      padding:"0 48px",height:68,
      display:"flex",alignItems:"center",justifyContent:"space-between",
      background: scrolled ? "rgba(24,52,56,0.95)" : "rgba(24,52,56,0.7)",
      backdropFilter:"blur(16px)",
      borderBottom:`1px solid ${scrolled ? "#2a5259" : "transparent"}`,
      transition:"all .3s"
    }}>
      <Link href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
        <div style={{width:34,height:34,background:"#D85A30",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg viewBox="0 0 14 14" width="16" height="16"><path d="M2 2h7l3 3v7H2V2z" fill="white"/><path d="M9 2v3h3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/></svg>
        </div>
        <span style={{fontSize:18,fontWeight:600,color:"#fff",letterSpacing:"-0.5px"}}>PDF<span style={{color:"#D85A30"}}>forge</span></span>
      </Link>
      <div style={{display:"flex",alignItems:"center",gap:32}} className="nav-links-desktop">
        {[["Features","/#features"],["Tools","/tools"],["How it works","/#how"],["Pricing","/#pricing"]].map(([l,h]) => (
          <Link key={l} href={h} style={{color:"#8fb3b8",textDecoration:"none",fontSize:14,transition:"color .2s"}}
            onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="#8fb3b8"}>{l}</Link>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Link href="/dashboard" style={{padding:"8px 18px",border:"1px solid #3a6570",borderRadius:8,color:"#e8f4f5",fontSize:14,textDecoration:"none",transition:"all .2s"}}
          onMouseEnter={e=>{e.target.style.borderColor="#8fb3b8";e.target.style.color="#fff";}}
          onMouseLeave={e=>{e.target.style.borderColor="#3a6570";e.target.style.color="#e8f4f5";}}>Sign in</Link>
        <Link href="/tools" style={{padding:"8px 20px",background:"#D85A30",borderRadius:8,color:"#fff",fontSize:14,fontWeight:500,textDecoration:"none",transition:"all .2s"}}
          onMouseEnter={e=>e.target.style.background="#E07050"} onMouseLeave={e=>e.target.style.background="#D85A30"}>Get started</Link>
      </div>
    </nav>
  );
}
