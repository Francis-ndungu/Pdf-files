
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ALL_TOOLS, TOOL_CATEGORIES } from "@/lib/tools";

const ICONS = {
  combine:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M18 16l4-4-4-4"/><path d="M2 12h20"/><path d="M18 8l4 4-4 4"/></svg>,
  scissors:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/></svg>,
  default:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
};

function ToolIcon({ icon, color }) {
  const I = ICONS[icon] || ICONS.default;
  return <div style={{width:38,height:38,borderRadius:9,background:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",color,flexShrink:0}}>{I}</div>;
}

export default function ToolsPage() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setTimeout(() => setRevealed(true), 100); }, []);

  const filtered = ALL_TOOLS.filter(t => {
    const catOk = cat === "all" || t.category === cat;
    const qOk = !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.desc.toLowerCase().includes(q.toLowerCase()) || (t.accepts||[]).some(a=>a.includes(q.toLowerCase()));
    return catOk && qOk;
  });

  const grouped = {};
  filtered.forEach(t => { if (!grouped[t.category]) grouped[t.category] = []; grouped[t.category].push(t); });
  const catOrder = ["organize","edit","optimize","secure","convert-to","convert-from","ai"];
  const catMeta = {
    organize:{label:"Organise & Manage",desc:"Page trees, reordering, metadata"},
    edit:{label:"Edit & Annotate",desc:"Markup, signatures, watermarks, forms"},
    optimize:{label:"Optimise & Repair",desc:"Compress, linearise, fix corrupted files"},
    secure:{label:"Security",desc:"Encrypt, redact, sanitize, sign"},
    "convert-to":{label:"Convert to PDF",desc:"Office, images, web, ebooks"},
    "convert-from":{label:"Convert from PDF",desc:"Extract to Word, Excel, images, text"},
    ai:{label:"AI-powered",desc:"Summarise, translate, chat"},
  };

  return (
    <>
      <Navbar />
      <div style={{minHeight:"100vh",background:"#183438",paddingTop:68}}>
        <div style={{background:"#1e3d41",borderBottom:"1px solid #2a5259",padding:"40px 60px 0"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:28}}>
              <div>
                <div style={{fontSize:11,color:"#E07050",textTransform:"uppercase",letterSpacing:"1.5px",fontWeight:500,marginBottom:10}}>PDF Tools</div>
                <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(32px,4vw,48px)",fontWeight:400,letterSpacing:"-1px",color:"#fff",marginBottom:8}}>All tools</h1>
                <p style={{fontSize:14,color:"#8fb3b8",fontWeight:300}}>{ALL_TOOLS.length} tools · every PDF workflow covered</p>
              </div>
              <div style={{position:"relative"}}>
                <svg style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#4a7a80" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Search tools…' style={{padding:"9px 12px 9px 32px",background:"#224146",border:"1px solid #2a5259",borderRadius:8,color:"#e8f4f5",fontSize:13,outline:"none",width:240,fontFamily:"var(--sans)"}} />
              </div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",paddingBottom:0}}>
              {[{id:"all",label:"All tools"},...TOOL_CATEGORIES].map(c => (
                <button key={c.id} onClick={()=>setCat(c.id)} style={{padding:"7px 16px",fontSize:12,borderRadius:"20px 20px 0 0",cursor:"pointer",border:"1px solid",borderBottom:"none",fontFamily:"var(--sans)",transition:"all .15s",
                  background:cat===c.id?"#183438":"transparent",
                  color:cat===c.id?"#fff":"#8fb3b8",
                  borderColor:cat===c.id?"#3a6570":"#2a5259",
                  fontWeight:cat===c.id?500:400}}>{c.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{padding:"32px 60px",maxWidth:1160,margin:"0 auto"}}>
          <div style={{fontSize:12,color:"#4a7a80",marginBottom:20}}>Showing {filtered.length} tool{filtered.length!==1?"s":""}</div>
          {catOrder.map(cid => {
            const items = grouped[cid];
            if (!items?.length) return null;
            const meta = catMeta[cid];
            return (
              <div key={cid} style={{marginBottom:36}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#4a7a80",textTransform:"uppercase",letterSpacing:"0.7px"}}>{meta.label}</span>
                  <span style={{fontSize:11,color:"#4a7a80",fontWeight:300}}>— {meta.desc}</span>
                  <div style={{flex:1,height:1,background:"#2a5259"}} />
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                  {items.map((t,i) => (
                    <Link key={t.id} href={`/tools/${t.slug}`} style={{
                      background:"#1a3b3f",border:"1px solid #2a5259",borderRadius:10,
                      padding:"18px 16px",cursor:"pointer",transition:"all .2s",
                      display:"flex",flexDirection:"column",gap:8,textDecoration:"none",
                      opacity:revealed?1:0,transform:revealed?"translateY(0)":"translateY(16px)",
                      transitionDelay:`${i*20}ms`,
                    }}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                        <div style={{width:36,height:36,borderRadius:8,background:t.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={t.iconColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        {t.badge && <span style={{fontSize:9,padding:"2px 7px",borderRadius:8,fontWeight:600,
                          background:t.badge==="ai"?"rgba(239,159,39,0.2)":t.badge==="pro"?"rgba(127,119,221,0.2)":t.badge==="new"?"rgba(93,202,165,0.2)":"rgba(93,202,165,0.12)",
                          color:t.badge==="ai"?"#EF9F27":t.badge==="pro"?"#AFA9EC":"#5DCAA5"}}>
                          {t.badge==="ai"?"AI":t.badge==="pro"?"Pro":t.badge==="new"?"New":"Free"}
                        </span>}
                      </div>
                      <div style={{fontSize:13,fontWeight:500,color:"#e8f4f5"}}>{t.name}</div>
                      <div style={{fontSize:11,color:"#8fb3b8",lineHeight:1.5}}>{t.desc}</div>
                      {t.accepts?.length > 0 && (
                        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:2}}>
                          {t.accepts.slice(0,3).map(a=><span key={a} style={{fontSize:10,background:"#224146",color:"#4a7a80",padding:"2px 6px",borderRadius:4,border:"1px solid #2a5259"}}>{a}</span>)}
                          {t.accepts.length>3&&<span style={{fontSize:10,color:"#4a7a80"}}>+{t.accepts.length-3}</span>}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length===0 && (
            <div style={{textAlign:"center",padding:"60px 20px",color:"#8fb3b8"}}>
              <div style={{fontSize:32,marginBottom:12}}>🔍</div>
              <div style={{fontSize:15,fontWeight:500,color:"#e8f4f5",marginBottom:6}}>No tools found</div>
              <div style={{fontSize:13}}>Try a different search term or category filter</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
