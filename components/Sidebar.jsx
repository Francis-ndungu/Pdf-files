"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label:"Main", items:[
    { href:"/dashboard", icon:"grid", label:"Dashboard" },
    { href:"/tools", icon:"tool", label:"PDF Tools", badge:"90+" },
    { href:"/dashboard/history", icon:"clock", label:"History" },
    { href:"/dashboard/workflow", icon:"git-branch", label:"Workflow Builder", badge:"new" },
  ]},
  { label:"Account", items:[
    { href:"/dashboard/profile", icon:"user", label:"Profile" },
    { href:"/dashboard/settings", icon:"settings", label:"Settings" },
  ]},
];

const ICONS = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  tool: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  "git-branch": <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(null);

  return (
    <aside style={{width:200,flexShrink:0,background:"#183438",borderRight:"1px solid #2a5259",display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <div style={{padding:"18px 16px 14px",borderBottom:"1px solid #2a5259",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,background:"#D85A30",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg viewBox="0 0 14 14" width="14" height="14"><path d="M2 2h7l3 3v7H2V2z" fill="white"/></svg>
        </div>
        <span style={{fontSize:15,fontWeight:600,color:"#fff",letterSpacing:"-0.3px"}}>PDF<span style={{color:"#D85A30"}}>forge</span></span>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"12px 0"}}>
        {NAV.map(section => (
          <div key={section.label} style={{marginBottom:8}}>
            <div style={{fontSize:10,color:"#4a7a80",textTransform:"uppercase",letterSpacing:"0.8px",padding:"0 16px 8px",fontWeight:600}}>{section.label}</div>
            {section.items.map(item => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const isHovered = hovered === item.href;
              return (
                <Link key={item.href} href={item.href} style={{
                  display:"flex",alignItems:"center",gap:10,padding:"9px 16px",
                  cursor:"pointer",border:"none",width:"100%",textAlign:"left",
                  background: active ? "rgba(216,90,48,0.15)" : isHovered ? "#fff" : "transparent",
                  color: active ? "#E07050" : isHovered ? "#000" : "#fff",
                  fontSize:13,textDecoration:"none",transition:"background .15s, color .15s",
                }}
                  onMouseEnter={() => setHovered(item.href)}
                  onMouseLeave={() => setHovered(null)}>
                  <span style={{color:"inherit",flexShrink:0}}>{ICONS[item.icon]}</span>
                  <span style={{flex:1}}>{item.label}</span>
                  {item.badge && (
                    <span style={{fontSize:9,background:item.badge==="new"?"rgba(93,202,165,0.2)":"#D85A30",color:item.badge==="new"?"#5DCAA5":"#fff",padding:"2px 6px",borderRadius:10,fontWeight:600}}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{padding:"14px 16px",borderTop:"1px solid #2a5259"}}>
        <div style={{background:"rgba(216,90,48,0.1)",border:"1px solid rgba(216,90,48,0.3)",borderRadius:8,padding:"10px 12px"}}>
          <div style={{fontSize:11,color:"#E07050",fontWeight:600,marginBottom:3}}>Free plan</div>
          <div style={{fontSize:10,color:"#4a7a80",marginBottom:8}}>12 / 20 conversions used</div>
          <div style={{height:4,background:"#224146",borderRadius:2,overflow:"hidden",marginBottom:8}}>
            <div style={{width:"60%",height:"100%",background:"#D85A30",borderRadius:2}} />
          </div>
          <button style={{width:"100%",padding:5,background:"#D85A30",color:"#fff",border:"none",borderRadius:5,fontSize:11,cursor:"pointer",fontWeight:500}}>Upgrade to Pro</button>
        </div>
      </div>
    </aside>
  );
}
