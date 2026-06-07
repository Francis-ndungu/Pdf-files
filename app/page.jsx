import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"120px 40px 80px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 50% 0%, rgba(216,90,48,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 15% 60%, rgba(93,202,165,0.07) 0%, transparent 60%)",zIndex:0}} />
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(42,82,89,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(42,82,89,0.25) 1px, transparent 1px)",backgroundSize:"60px 60px",maskImage:"radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",zIndex:0}} />

        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(216,90,48,0.1)",border:"1px solid rgba(216,90,48,0.25)",borderRadius:100,padding:"6px 16px",fontSize:12,color:"#E07050",fontWeight:500,marginBottom:28,position:"relative",zIndex:1}}>
          <span style={{width:6,height:6,background:"#D85A30",borderRadius:"50%",display:"inline-block"}} className="pulse-dot" />
          90+ tools · No account needed to start
        </div>

        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(44px,6vw,80px)",fontWeight:400,lineHeight:1.05,letterSpacing:"-1.5px",color:"#fff",maxWidth:820,marginBottom:24,position:"relative",zIndex:1}}>
          Every PDF task,<br /><em style={{fontStyle:"italic",color:"#E07050"}}>beautifully simple</em>
        </h1>
        <p style={{fontSize:17,color:"#8fb3b8",lineHeight:1.7,maxWidth:520,marginBottom:44,position:"relative",zIndex:1,fontWeight:300}}>
          Convert, compress, merge, sign and transform PDFs in seconds. Professional-grade tools that work entirely in your browser — your files never leave your device.
        </p>

        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:60,position:"relative",zIndex:1}}>
          <Link href="/tools" style={{padding:"14px 32px",background:"#D85A30",border:"none",borderRadius:10,color:"#fff",fontSize:15,fontWeight:500,cursor:"pointer",textDecoration:"none",display:"flex",alignItems:"center",gap:8,boxShadow:"0 0 40px rgba(216,90,48,0.3)"}}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload your file
          </Link>
          <Link href="/tools" style={{padding:"14px 28px",background:"transparent",border:"1px solid #3a6570",borderRadius:10,color:"#e8f4f5",fontSize:15,cursor:"pointer",textDecoration:"none"}}>Explore all 90+ tools →</Link>
        </div>

        {/* Hero upload card */}
        <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:680,background:"rgba(30,61,65,0.8)",border:"1px solid #3a6570",borderRadius:16,padding:"36px 40px",backdropFilter:"blur(10px)"}}>
          <div style={{border:"1.5px dashed #3a6570",borderRadius:10,padding:28,textAlign:"center",marginBottom:20,cursor:"pointer"}}>
            <div style={{width:48,height:48,background:"rgba(216,90,48,0.15)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#E07050" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div style={{fontSize:15,fontWeight:500,color:"#fff",marginBottom:4}}>Drop your file here</div>
            <div style={{fontSize:13,color:"#8fb3b8",marginBottom:12}}>or click to browse — any file type, any size</div>
            <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
              {["PDF","DOCX","XLSX","PPTX","JPG","PNG","EPUB","EML","+80 more"].map(f => (
                <span key={f} style={{fontSize:11,background:"#224146",color:"#8fb3b8",padding:"3px 9px",borderRadius:5,border:"1px solid #2a5259"}}>{f}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <select style={{flex:1,padding:"10px 14px",background:"#224146",border:"1px solid #2a5259",borderRadius:8,color:"#e8f4f5",fontSize:13,fontFamily:"var(--sans)"}}>
              <option>Convert to PDF</option><option>PDF to Word</option><option>Compress PDF</option>
              <option>Merge PDFs</option><option>OCR — make searchable</option><option>Sign PDF</option>
              <option>Translate PDF (AI)</option>
            </select>
            <button style={{padding:"10px 24px",background:"#D85A30",border:"none",borderRadius:8,color:"#fff",fontSize:14,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap"}}>Convert now</button>
          </div>
        </div>

        {/* Trust row */}
        <div style={{display:"flex",alignItems:"center",gap:28,justifyContent:"center",flexWrap:"wrap",marginTop:48,paddingTop:48,borderTop:"1px solid #2a5259",position:"relative",zIndex:1}}>
          {[["✓","No sign-up required"],["🔒","Files deleted after 1 hour"],["🛡","SSL encrypted upload"],["📋","GDPR compliant"],["🔌","100% client-side processing"]].map(([icon,label]) => (
            <div key={label} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#8fb3b8"}}>
              <span style={{color:"#E07050"}}>{icon}</span>{label}
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div style={{background:"#1e3d41",borderTop:"1px solid #2a5259",borderBottom:"1px solid #2a5259",display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
        {[["90+","Tools available"],["12M+","PDFs processed monthly"],["98%","Conversion success rate"],["<3s","Average processing time"]].map(([num,desc],i) => (
          <div key={i} style={{textAlign:"center",padding:"40px 20px",borderRight:i<3?"1px solid #2a5259":"none"}}>
            <div style={{fontFamily:"var(--serif)",fontSize:"clamp(32px,4vw,52px)",fontWeight:400,color:"#fff",letterSpacing:"-1px",marginBottom:6}}>
              <span className="gradient-text">{num}</span>
            </div>
            <div style={{fontSize:13,color:"#8fb3b8"}}>{desc}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" style={{padding:"100px 60px",background:"#183438"}}>
        <div style={{textAlign:"center",maxWidth:560,margin:"0 auto 60px"}}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",color:"#E07050",marginBottom:14}}>Why PDFforge</div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(34px,4vw,52px)",fontWeight:400,lineHeight:1.1,letterSpacing:"-1px",color:"#fff",marginBottom:16}}>
            Built for people who work with documents <em style={{fontStyle:"italic",color:"#E07050"}}>every day</em>
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16,maxWidth:1100,margin:"0 auto"}}>
          {[
            {icon:"🔒",title:"100% Private",desc:"All processing happens in your browser using WebAssembly. Your files never touch a server. Zero uploads, zero exposure.",color:"rgba(93,202,165,0.12)"},
            {icon:"⚡",title:"Lightning Fast",desc:"WebAssembly-powered engines process documents locally at near-native speed. Average completion under 3 seconds.",color:"rgba(239,159,39,0.12)"},
            {icon:"🎯",title:"90+ Tools",desc:"From basic conversions to advanced OCR, digital signatures, workflow automation and AI-powered analysis.",color:"rgba(216,90,48,0.12)"},
            {icon:"🤖",title:"AI-Powered",desc:"Summarise long reports, translate into 50+ languages, and chat with any document using the latest AI models.",color:"rgba(127,119,221,0.12)"},
            {icon:"🌍",title:"Works Everywhere",desc:"No installation needed. Runs in any modern browser on desktop, tablet or mobile. Fully offline-capable.",color:"rgba(55,138,221,0.12)"},
            {icon:"📐",title:"Professional Grade",desc:"PKI digital signatures, PDF/A archival conversion, batch workflows, and enterprise security features built-in.",color:"rgba(93,202,165,0.1)"},
          ].map(f => (
            <div key={f.title} style={{background:"#1a3b3f",border:"1px solid #2a5259",borderRadius:12,padding:"24px 20px",transition:"all .2s"}}>
              <div style={{width:44,height:44,background:f.color,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:14}}>{f.icon}</div>
              <h3 style={{fontSize:15,fontWeight:500,color:"#fff",marginBottom:8}}>{f.title}</h3>
              <p style={{fontSize:13,color:"#8fb3b8",lineHeight:1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS PREVIEW */}
      <section id="tools" style={{padding:"100px 60px",background:"#1e3d41"}}>
        <div style={{maxWidth:560,marginBottom:60}}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",color:"#E07050",marginBottom:14}}>All tools</div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(34px,4vw,52px)",fontWeight:400,lineHeight:1.1,letterSpacing:"-1px",color:"#fff",marginBottom:16}}>
            Everything you need, <em style={{fontStyle:"italic",color:"#E07050"}}>nothing you don't</em>
          </h2>
          <p style={{fontSize:16,color:"#8fb3b8",lineHeight:1.7,fontWeight:300}}>90+ tools covering every PDF workflow — from quick conversions to advanced OCR, cryptographic signing, and AI analysis.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:40}}>
          {[
            {icon:"🔀",name:"Merge PDF",tag:"free",bg:"rgba(216,90,48,0.15)"},
            {icon:"✂",name:"Split PDF",tag:"free",bg:"rgba(55,138,221,0.15)"},
            {icon:"📊",name:"Excel to PDF",tag:"free",bg:"rgba(99,153,34,0.15)"},
            {icon:"🖼",name:"Image to PDF",tag:"free",bg:"rgba(127,119,221,0.15)"},
            {icon:"🔍",name:"OCR",tag:"free",bg:"rgba(93,202,165,0.15)"},
            {icon:"🗜",name:"Compress PDF",tag:"free",bg:"rgba(99,153,34,0.15)"},
            {icon:"✍",name:"Sign PDF",tag:"free",bg:"rgba(55,138,221,0.15)"},
            {icon:"✨",name:"Summarise (AI)",tag:"ai",bg:"rgba(93,202,165,0.12)"},
            {icon:"🌐",name:"Translate (AI)",tag:"ai",bg:"rgba(239,159,39,0.12)"},
            {icon:"💬",name:"Chat with PDF",tag:"ai",bg:"rgba(127,119,221,0.12)"},
            {icon:"🔒",name:"Protect PDF",tag:"free",bg:"rgba(239,159,39,0.12)"},
            {icon:"📐",name:"CAD to PDF",tag:"pro",bg:"rgba(180,178,169,0.1)"},
          ].map(t => (
            <div key={t.name} style={{background:"#1a3b3f",border:"1px solid #2a5259",borderRadius:12,padding:"18px 16px",cursor:"pointer",transition:"all .2s"}}>
              <div style={{width:36,height:36,background:t.bg,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginBottom:10}}>{t.icon}</div>
              <div style={{fontSize:13,fontWeight:500,color:"#fff",marginBottom:6}}>{t.name}</div>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:500,
                background:t.tag==="ai"?"rgba(93,202,165,0.15)":t.tag==="pro"?"rgba(127,119,221,0.15)":"rgba(93,202,165,0.1)",
                color:t.tag==="ai"?"#5DCAA5":t.tag==="pro"?"#AFA9EC":"#5DCAA5"}}>{t.tag==="ai"?"AI":t.tag==="pro"?"Pro":"Free"}</span>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center"}}>
          <Link href="/tools" style={{padding:"12px 28px",border:"1px solid #3a6570",borderRadius:9,fontSize:14,color:"#e8f4f5",textDecoration:"none"}}>View all 90+ tools →</Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{padding:"100px 60px",background:"#183438"}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",color:"#E07050",marginBottom:14}}>Simple process</div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(34px,4vw,52px)",fontWeight:400,letterSpacing:"-1px",color:"#fff"}}>Ready in three steps</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"#2a5259",border:"1px solid #2a5259",borderRadius:16,overflow:"hidden",maxWidth:900,margin:"0 auto"}}>
          {[
            {num:"01",title:"Upload your file",desc:"Drag and drop any file — PDF, Word, Excel, image, webpage or ebook. Up to any size, multiple files for batch jobs."},
            {num:"02",title:"Choose your tool",desc:"Pick from 90+ tools. Set quality, page size and options — or just use the smart defaults and we'll handle the rest."},
            {num:"03",title:"Download your result",desc:"Ready in seconds. Download instantly. Files are processed locally and never stored — auto-cleared after 1 hour."},
          ].map((s,i) => (
            <div key={i} style={{background:"#1a3b3f",padding:"40px 36px",position:"relative"}}>
              <div style={{fontFamily:"var(--serif)",fontSize:64,fontWeight:400,color:"rgba(216,90,48,0.12)",lineHeight:1,marginBottom:20,letterSpacing:"-2px"}}>{s.num}</div>
              <h3 style={{fontSize:17,fontWeight:500,color:"#fff",marginBottom:10}}>{s.title}</h3>
              <p style={{fontSize:13,color:"#8fb3b8",lineHeight:1.7}}>{s.desc}</p>
              {i < 2 && <div style={{position:"absolute",top:44,right:-14,zIndex:1,width:28,height:28,background:"#183438",border:"1px solid #2a5259",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#4a7a80" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>}
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"100px 60px",background:"#1e3d41"}}>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto 60px"}}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",color:"#E07050",marginBottom:14}}>Pricing</div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(34px,4vw,52px)",fontWeight:400,letterSpacing:"-1px",color:"#fff",marginBottom:12}}>
            Start free, <em style={{fontStyle:"italic",color:"#E07050"}}>scale when ready</em>
          </h2>
          <p style={{fontSize:15,color:"#8fb3b8",fontWeight:300}}>No credit card required. Upgrade any time. Cancel any time.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,maxWidth:960,margin:"0 auto"}}>
          {[
            {plan:"Free",price:"0",period:"mo",desc:"For occasional use. No sign-up needed.",btnText:"Get started free",filled:false,features:["20 conversions per month","Files up to 25 MB","Core tools (merge, split, compress)","OCR — 3 pages max"],noFeatures:["AI tools","Priority processing","API access"]},
            {plan:"Pro",price:"12",period:"mo",desc:"For professionals and power users.",btnText:"Start 7-day free trial",filled:true,popular:true,features:["Unlimited conversions","Files up to 500 MB","All 90+ tools unlocked","Full OCR — unlimited pages","AI tools (summarise, translate, chat)","Priority processing","Workflow automation"],noFeatures:[]},
            {plan:"Team",price:"39",period:"mo",desc:"For teams of up to 10 users.",btnText:"Contact sales",filled:false,features:["Everything in Pro","Up to 10 seats","Shared workspace","Admin dashboard","API access (10k calls/mo)","Priority SLA support"],noFeatures:[]},
          ].map((p,i) => (
            <div key={i} style={{background:"#1a3b3f",border:`1px solid ${p.popular?"#D85A30":"#2a5259"}`,borderRadius:16,padding:"36px 32px",position:"relative",background:p.popular?"rgba(216,90,48,0.05)":"#1a3b3f"}}>
              {p.popular && <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"#D85A30",color:"#fff",fontSize:11,fontWeight:500,padding:"4px 16px",borderRadius:100,whiteSpace:"nowrap"}}>Most popular</div>}
              <div style={{fontSize:11,fontWeight:500,letterSpacing:"1.2px",textTransform:"uppercase",color:"#4a7a80",marginBottom:12}}>{p.plan}</div>
              <div style={{fontFamily:"var(--serif)",fontSize:48,fontWeight:400,color:"#fff",lineHeight:1,marginBottom:4,letterSpacing:"-1px"}}>
                <sup style={{fontSize:22,verticalAlign:"top",marginTop:10,fontFamily:"var(--sans)",fontWeight:300}}>$</sup>{p.price}
                <span style={{fontFamily:"var(--sans)",fontSize:14,color:"#4a7a80",fontWeight:300}}>/{p.period}</span>
              </div>
              <div style={{fontSize:13,color:"#8fb3b8",marginBottom:28}}>{p.desc}</div>
              <button style={{width:"100%",padding:12,borderRadius:9,fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:28,border:p.filled?"none":"1px solid #3a6570",background:p.filled?"#D85A30":"transparent",color:p.filled?"#fff":"#e8f4f5",fontFamily:"var(--sans)"}}>{p.btnText}</button>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {p.features.map(f => <div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#8fb3b8"}}><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#5DCAA5" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>{f}</div>)}
                {p.noFeatures.map(f => <div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#4a7a80"}}><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#4a7a80" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>{f}</div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"100px 60px",background:"#183438"}}>
        <div style={{textAlign:"center",maxWidth:480,margin:"0 auto 60px"}}>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",color:"#E07050",marginBottom:14}}>Testimonials</div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(34px,4vw,52px)",fontWeight:400,letterSpacing:"-1px",color:"#fff"}}>
            Trusted by document workers <em style={{fontStyle:"italic",color:"#E07050"}}>worldwide</em>
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,maxWidth:1100,margin:"0 auto"}}>
          {[
            {q:"The privacy aspect alone won me over. I process confidential client contracts daily — knowing it all runs in my browser with zero server uploads is genuinely reassuring.",name:"Sarah K.",role:"Financial Analyst, Nairobi",avatar:"SK",bg:"rgba(55,138,221,0.2)"},
            {q:"The OCR tool is exceptionally accurate. We scan hundreds of invoices monthly and the searchable PDF output just works — better than any cloud tool we've tried.",name:"James M.",role:"Operations Lead, Cape Town",avatar:"JM",bg:"rgba(93,202,165,0.2)"},
            {q:"The AI translation saved us thousands. 80-page legal contracts translated into French in minutes, with the original layout fully intact. Remarkable.",name:"Amira T.",role:"Legal Counsel, Lagos",avatar:"AT",bg:"rgba(216,90,48,0.2)"},
          ].map(t => (
            <div key={t.name} style={{background:"#1a3b3f",border:"1px solid #2a5259",borderRadius:14,padding:28}}>
              <div style={{display:"flex",gap:3,marginBottom:16}}>{"★★★★★".split("").map((s,i) => <span key={i} style={{color:"#D85A30",fontSize:14}}>{s}</span>)}</div>
              <p style={{fontSize:14,color:"#8fb3b8",lineHeight:1.7,marginBottom:20,fontStyle:"italic"}}>"{t.q}"</p>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,color:"#fff"}}>{t.avatar}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:500,color:"#fff"}}>{t.name}</div>
                  <div style={{fontSize:11,color:"#4a7a80"}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <div style={{padding:"100px 60px",textAlign:"center",background:"#1e3d41",borderTop:"1px solid #2a5259",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 80% at 50% 50%, rgba(216,90,48,0.1) 0%, transparent 70%)"}} />
        <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(36px,5vw,60px)",fontWeight:400,color:"#fff",letterSpacing:"-1px",marginBottom:16,position:"relative",zIndex:1}}>
          Your documents deserve <em style={{fontStyle:"italic",color:"#E07050"}}>better tools</em>
        </h2>
        <p style={{fontSize:16,color:"#8fb3b8",maxWidth:440,margin:"0 auto 36px",position:"relative",zIndex:1,fontWeight:300}}>Join over 2 million people who trust PDFforge for their document workflows. Free to start, no card required.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",position:"relative",zIndex:1}}>
          <Link href="/tools" style={{padding:"14px 32px",background:"#D85A30",border:"none",borderRadius:10,color:"#fff",fontSize:15,fontWeight:500,cursor:"pointer",textDecoration:"none"}}>Start for free</Link>
          <Link href="#pricing" style={{padding:"14px 28px",background:"transparent",border:"1px solid #3a6570",borderRadius:10,color:"#e8f4f5",fontSize:15,cursor:"pointer",textDecoration:"none"}}>View pricing</Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:"#183438",borderTop:"1px solid #2a5259",padding:"60px 60px 40px"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:60,marginBottom:48}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:30,height:30,background:"#D85A30",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg viewBox="0 0 14 14" width="14" height="14"><path d="M2 2h7l3 3v7H2V2z" fill="white"/></svg>
              </div>
              <span style={{fontSize:16,fontWeight:600,color:"#fff"}}>PDF<span style={{color:"#D85A30"}}>forge</span></span>
            </div>
            <p style={{fontSize:13,color:"#4a7a80",lineHeight:1.7,maxWidth:240}}>Professional PDF tools for individuals and teams. Convert, compress, sign and transform any document in seconds.</p>
          </div>
          {[
            {title:"Tools",links:["Word to PDF","Excel to PDF","PDF to Word","Merge PDFs","Compress PDF","OCR"]},
            {title:"Product",links:["Features","Pricing","API access","Changelog","Roadmap"]},
            {title:"Company",links:["About","Blog","Privacy policy","Terms of service","Contact"]},
          ].map(col => (
            <div key={col.title}>
              <h4 style={{fontSize:12,fontWeight:500,color:"#8fb3b8",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:16}}>{col.title}</h4>
              {col.links.map(l => <a key={l} href="#" style={{display:"block",fontSize:13,color:"#4a7a80",textDecoration:"none",marginBottom:10}}>{l}</a>)}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid #2a5259",paddingTop:28,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:12,color:"#4a7a80"}}>© 2025 PDFforge. All rights reserved.</div>
          <div style={{display:"flex",gap:8}}>
            {["SSL Secured","GDPR","SOC 2","WASM-Powered"].map(b => <span key={b} style={{fontSize:10,background:"#224146",color:"#4a7a80",padding:"3px 10px",borderRadius:4,border:"1px solid #2a5259"}}>{b}</span>)}
          </div>
        </div>
      </footer>
    </>
  );
}
