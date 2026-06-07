
"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ALL_TOOLS } from "@/lib/tools";

const CAT_META = {
  organize:{label:"Organise & Manage",href:"/tools?cat=organize"},
  edit:{label:"Edit & Annotate",href:"/tools?cat=edit"},
  optimize:{label:"Optimise & Repair",href:"/tools?cat=optimize"},
  secure:{label:"Security",href:"/tools?cat=secure"},
  "convert-to":{label:"Convert to PDF",href:"/tools?cat=convert-to"},
  "convert-from":{label:"Convert from PDF",href:"/tools?cat=convert-from"},
  ai:{label:"AI-powered",href:"/tools?cat=ai"},
};

export default function ToolClient({ tool }) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(null);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({});
  const [metadata, setMetadata] = useState(null);
  const fileRef = useRef();

  const related = ALL_TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 4);

  const handleFiles = useCallback((incoming) => {
    const arr = Array.from(incoming);
    if (tool.accepts && tool.accepts.length > 0) {
      const valid = arr.filter(f => tool.accepts.some(ext => f.name.toLowerCase().endsWith(ext)));
      if (valid.length === 0) { setError(`Please upload ${tool.accepts.join(', ')} files`); return; }
      setFiles(valid);
    } else {
      setFiles(arr);
    }
    setError(null); setDone(null); setMetadata(null);
  }, [tool]);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onProcess = async () => {
    if (!files.length) { setError("Please upload a file first"); return; }
    setProcessing(true); setProgress(0); setError(null); setDone(null);
    try {
      const engine = await import("@/lib/pdfEngine");
      let resultBytes;
      let filename = files[0].name.replace(/\.[^.]+$/, '');

      // Simulate progress
      const prog = setInterval(() => setProgress(p => Math.min(p + 8, 88)), 200);

      switch (tool.id) {
        case 'merge-pdf':
          resultBytes = await engine.mergePDFs(files);
          filename = 'merged.pdf'; break;
        case 'split-pdf': {
          const parts = parseInt(options.parts || 2);
          const total = files[0];
          const { PDFDocument } = await import('pdf-lib');
          const src = await PDFDocument.load(await total.arrayBuffer(), {ignoreEncryption:true});
          const count = src.getPageCount();
          const size = Math.ceil(count / parts);
          const ranges = Array.from({length:parts},(_,i)=>Array.from({length:Math.min(size,count-i*size)},(_,j)=>i*size+j));
          const results = await engine.splitPDF(total, ranges);
          results.forEach((b, i) => engine.downloadBytes(b, `${filename}_part${i+1}.pdf`));
          clearInterval(prog); setProgress(100); setProcessing(false); setDone({multi:true,count:results.length}); return;
        }
        case 'extract-pages': {
          const nums = (options.pages||'1').split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
          resultBytes = await engine.extractPages(files[0], nums);
          filename = `${filename}_extracted.pdf`; break;
        }
        case 'organize-pdf': {
          const order = (options.order||'').split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
          if (!order.length) { setError("Please enter page order (e.g. 3,1,2)"); clearInterval(prog); setProcessing(false); return; }
          resultBytes = await engine.organisePDF(files[0], order);
          filename = `${filename}_organised.pdf`; break;
        }
        case 'delete-pages': {
          const nums = (options.pages||'').split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
          if (!nums.length) { setError("Please enter page numbers to delete"); clearInterval(prog); setProcessing(false); return; }
          resultBytes = await engine.deletePages(files[0], nums);
          filename = `${filename}_edited.pdf`; break;
        }
        case 'rotate-pdf':
          resultBytes = await engine.rotatePages(files[0], parseInt(options.angle||90), options.pages==='all'?'all':(options.pages||'all').split(',').map(s=>parseInt(s.trim())));
          filename = `${filename}_rotated.pdf`; break;
        case 'reverse-pages':
          resultBytes = await engine.reversePages(files[0]);
          filename = `${filename}_reversed.pdf`; break;
        case 'add-blank-page':
          resultBytes = await engine.addBlankPage(files[0], parseInt(options.afterPage||0));
          filename = `${filename}_edited.pdf`; break;
        case 'add-watermark':
          resultBytes = await engine.addWatermark(files[0], options.text||'CONFIDENTIAL', {opacity:parseFloat(options.opacity||0.15),rotation:parseInt(options.rotation||-45),fontSize:parseInt(options.fontSize||48)});
          filename = `${filename}_watermarked.pdf`; break;
        case 'page-numbers':
          resultBytes = await engine.addPageNumbers(files[0], {startFrom:parseInt(options.startFrom||1),position:options.position||'bottom-center',prefix:options.prefix||'',suffix:options.suffix||''});
          filename = `${filename}_numbered.pdf`; break;
        case 'header-footer':
          resultBytes = await engine.addHeaderFooter(files[0], options.header||'', options.footer||'');
          filename = `${filename}_headed.pdf`; break;
        case 'compress-pdf':
          resultBytes = await engine.compressPDF(files[0]);
          filename = `${filename}_compressed.pdf`; break;
        case 'protect-pdf':
          if (!options.password) { setError("Please enter a password"); clearInterval(prog); setProcessing(false); return; }
          resultBytes = await engine.protectPDF(files[0], options.password, options.ownerPassword);
          filename = `${filename}_protected.pdf`; break;
        case 'remove-metadata':
          resultBytes = await engine.removeMetadata(files[0]);
          filename = `${filename}_clean.pdf`; break;
        case 'view-metadata': {
          const m = await engine.getMetadata(files[0]);
          clearInterval(prog); setProgress(100); setProcessing(false); setMetadata(m); return;
        }
        case 'edit-metadata':
          resultBytes = await engine.editMetadata(files[0], {title:options.title,author:options.author,subject:options.subject,keywords:options.keywords,creator:options.creator});
          filename = `${filename}_edited.pdf`; break;
        case 'flatten-pdf':
          resultBytes = await engine.flattenPDF(files[0]);
          filename = `${filename}_flattened.pdf`; break;
        case 'repair-pdf':
          resultBytes = await engine.repairPDF(files[0]);
          filename = `${filename}_repaired.pdf`; break;
        case 'fix-page-size': {
          const sizes = {a4:[595.28,841.89],'us-letter':[612,792],a3:[841.89,1190.55],legal:[612,1008]};
          resultBytes = await engine.fixPageSize(files[0], sizes[options.size||'a4']);
          filename = `${filename}_fixed.pdf`; break;
        }
        case 'page-dimensions': {
          const dims = await engine.pageDimensions(files[0]);
          clearInterval(prog); setProgress(100); setProcessing(false); setMetadata({type:'dimensions',data:dims}); return;
        }
        case 'remove-annotations':
          resultBytes = await engine.removeAnnotations(files[0]);
          filename = `${filename}_clean.pdf`; break;
        case 'image-to-pdf':
          resultBytes = await engine.imageToPDF(files);
          filename = 'images.pdf'; break;
        case 'pdf-to-zip': {
          const zipBytes = await engine.pdfToZip(files);
          engine.downloadBytes(zipBytes, 'pdfs.zip');
          clearInterval(prog); setProgress(100); setProcessing(false); setDone({filename:'pdfs.zip',bytes:zipBytes}); return;
        }
        case 'background-color': {
          const hex = options.color||'#FFFDE7';
          const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
          resultBytes = await engine.changeBackgroundColor(files[0], r, g, b);
          filename = `${filename}_bg.pdf`; break;
        }
        default:
          clearInterval(prog); setError(`${tool.name} requires additional WASM modules. Available in Pro.`); setProcessing(false); return;
      }
      clearInterval(prog); setProgress(100);
      const outname = filename.endsWith('.pdf') ? filename : filename + '.pdf';
      engine.downloadBytes(resultBytes, outname);
      setDone({ filename: outname, bytes: resultBytes });
    } catch (e) {
      console.error(e);
      setError(e.message || "Processing failed. The file may be corrupted or encrypted.");
    }
    setProcessing(false);
  };

  const opt = (key, val) => setOptions(o => ({ ...o, [key]: val }));
  const catM = CAT_META[tool.category] || { label: tool.category, href: '/tools' };

  return (
    <div style={{ minHeight: "100vh", background: "#183438", paddingTop: 68 }}>
      {/* Breadcrumb */}
      <div style={{ background: "#1e3d41", borderBottom: "1px solid #2a5259", padding: "12px 60px" }}>
        <div style={{ fontSize: 13, color: "#4a7a80", display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/tools" style={{ color: "#4a7a80", textDecoration: "none" }}>Tools</Link>
          <span>›</span>
          <Link href={catM.href} style={{ color: "#4a7a80", textDecoration: "none" }}>{catM.label}</Link>
          <span>›</span>
          <span style={{ color: "#e8f4f5" }}>{tool.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>
          {/* Main column */}
          <div>
            {/* Tool header */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: tool.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={tool.iconColor} strokeWidth="1.6" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px,3vw,36px)", fontWeight: 400, letterSpacing: "-0.5px", color: "#fff", marginBottom: 6 }}>{tool.name}</h1>
                <p style={{ fontSize: 14, color: "#8fb3b8", lineHeight: 1.6 }}>{tool.desc}</p>
              </div>
              {tool.badge && <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: 600, marginLeft: "auto", flexShrink: 0,
                background: tool.badge === "ai" ? "rgba(239,159,39,0.2)" : tool.badge === "pro" ? "rgba(127,119,221,0.2)" : "rgba(93,202,165,0.15)",
                color: tool.badge === "ai" ? "#EF9F27" : tool.badge === "pro" ? "#AFA9EC" : "#5DCAA5"
              }}>{tool.badge === "ai" ? "AI-powered" : tool.badge === "pro" ? "Pro feature" : "New"}</span>}
            </div>

            {/* Upload zone */}
            <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              style={{ border: `1.5px dashed ${dragging ? "#D85A30" : "#3a6570"}`, borderRadius: 12, padding: "40px 32px", textAlign: "center", cursor: "pointer", marginBottom: 20, background: dragging ? "rgba(216,90,48,0.05)" : "#1a3b3f", transition: "all .2s" }}>
              <input ref={fileRef} type="file" multiple={tool.maxFiles > 1} accept={tool.accepts?.join(',')} style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
              <div style={{ width: 52, height: 52, background: "rgba(216,90,48,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#E07050" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              {files.length === 0 ? (
                <>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", marginBottom: 6 }}>Drop your file{tool.maxFiles > 1 ? "s" : ""} here</div>
                  <div style={{ fontSize: 13, color: "#8fb3b8", marginBottom: 12 }}>or click to browse{tool.maxFiles > 1 ? ` — up to ${tool.maxFiles} files` : ""}</div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                    {(tool.accepts || []).map(a => <span key={a} style={{ fontSize: 11, background: "#224146", color: "#8fb3b8", padding: "2px 8px", borderRadius: 4, border: "1px solid #2a5259" }}>{a}</span>)}
                  </div>
                </>
              ) : (
                <div>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#224146", borderRadius: 8, padding: "10px 14px", marginBottom: 6, textAlign: "left" }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#E07050" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                      <span style={{ fontSize: 13, color: "#fff", flex: 1 }}>{f.name}</span>
                      <span style={{ fontSize: 11, color: "#4a7a80" }}>{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, color: "#4a7a80", marginTop: 8 }}>Click to change files</div>
                </div>
              )}
            </div>

            {/* Options panel */}
            <OptionsPanel tool={tool} options={options} opt={opt} />

            {/* Error */}
            {error && <div style={{ background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.3)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#F09595", marginBottom: 16 }}>⚠ {error}</div>}

            {/* Progress */}
            {processing && (
              <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#8fb3b8" }}>Processing…</span>
                  <span style={{ fontSize: 13, color: "#E07050" }}>{progress}%</span>
                </div>
                <div style={{ height: 4, background: "#224146", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#D85A30,#E07050)", borderRadius: 2, transition: "width .3s" }} />
                </div>
              </div>
            )}

            {/* Success */}
            {done && !done.multi && (
              <div style={{ background: "rgba(93,202,165,0.1)", border: "1px solid rgba(93,202,165,0.25)", borderRadius: 10, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#5DCAA5" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#5DCAA5", marginBottom: 2 }}>Done! Your file is ready.</div>
                    <div style={{ fontSize: 12, color: "#4a7a80" }}>{done.filename}</div>
                  </div>
                </div>
              </div>
            )}
            {done?.multi && (
              <div style={{ background: "rgba(93,202,165,0.1)", border: "1px solid rgba(93,202,165,0.25)", borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#5DCAA5" }}>✓ {done.count} files downloaded</div>
              </div>
            )}

            {/* Metadata display */}
            {metadata && !metadata.type && (
              <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#E07050", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.8px" }}>PDF Metadata</div>
                {Object.entries(metadata).map(([k, v]) => v ? (
                  <div key={k} style={{ display: "flex", gap: 16, padding: "8px 0", borderBottom: "1px solid #2a5259" }}>
                    <div style={{ fontSize: 12, color: "#4a7a80", width: 140, flexShrink: 0, textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, ' $1')}</div>
                    <div style={{ fontSize: 13, color: "#e8f4f5" }}>{String(v)}</div>
                  </div>
                ) : null)}
              </div>
            )}
            {metadata?.type === 'dimensions' && (
              <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#E07050", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.8px" }}>Page Dimensions</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead><tr style={{ color: "#4a7a80" }}>{"Page,Width (pt),Height (pt),Size,Orientation,Rotation".split(",").map(h => <th key={h} style={{ textAlign: "left", padding: "6px 12px", borderBottom: "1px solid #2a5259" }}>{h}</th>)}</tr></thead>
                    <tbody>{metadata.data.map(d => <tr key={d.page}>{[d.page,d.width,d.height,d.size,d.orientation,`${d.rotation}°`].map((v,i)=><td key={i} style={{ padding:"6px 12px",borderBottom:"1px solid #2a5259",color:"#e8f4f5" }}>{v}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              </div>
            )}

            <button onClick={onProcess} disabled={processing}
              style={{ width: "100%", padding: 14, background: processing ? "#224146" : "#D85A30", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 500, cursor: processing ? "not-allowed" : "pointer", fontFamily: "var(--sans)", transition: "all .2s" }}>
              {processing ? "Processing…" : tool.output ? `${tool.name} →` : `Run ${tool.name}`}
            </button>

            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              {["🔒 Files processed locally","Never uploaded to any server","Deleted after session"].map(t => (
                <span key={t} style={{ fontSize: 11, color: "#4a7a80" }}>{t} ·</span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* About box */}
            <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10, padding: "20px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#4a7a80", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>About this tool</div>
              <div style={{ fontSize: 13, color: "#8fb3b8", lineHeight: 1.7 }}>{tool.desc}</div>
              {tool.accepts?.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11, color: "#4a7a80", marginBottom: 6 }}>Accepts</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {tool.accepts.map(a => <span key={a} style={{ fontSize: 11, background: "#224146", color: "#8fb3b8", padding: "2px 8px", borderRadius: 4, border: "1px solid #2a5259" }}>{a}</span>)}
                  </div>
                </div>
              )}
              {tool.output && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 11, color: "#4a7a80", marginBottom: 6 }}>Output</div>
                  <span style={{ fontSize: 11, background: "rgba(216,90,48,0.12)", color: "#E07050", padding: "2px 8px", borderRadius: 4 }}>.{tool.output}</span>
                </div>
              )}
            </div>

            {/* Privacy box */}
            <div style={{ background: "rgba(93,202,165,0.06)", border: "1px solid rgba(93,202,165,0.2)", borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#5DCAA5", marginBottom: 10 }}>🔒 100% Private</div>
              <div style={{ fontSize: 12, color: "#8fb3b8", lineHeight: 1.7 }}>All processing happens in your browser using WebAssembly. Your files are never uploaded to any server and are automatically cleared when you close the tab.</div>
            </div>

            {/* Related tools */}
            {related.length > 0 && (
              <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10, padding: "20px", marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#4a7a80", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>Related tools</div>
                {related.map(t => (
                  <Link key={t.id} href={`/tools/${t.slug}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #2a5259", textDecoration: "none" }}>
                    <div style={{ width: 28, height: 28, background: t.color, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={t.iconColor} strokeWidth="1.6" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16"/><polyline points="14 2 20 8 20 22 4 22"/></svg>
                    </div>
                    <span style={{ fontSize: 13, color: "#e8f4f5" }}>{t.name}</span>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#4a7a80" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionsPanel({ tool, options, opt }) {
  const common = (label, key, type = "text", placeholder = "") => (
    <div key={key} style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, color: "#4a7a80", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>{label}</label>
      <input type={type} value={options[key] || ""} onChange={e => opt(key, e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", background: "#224146", border: "1px solid #2a5259", borderRadius: 7, color: "#e8f4f5", fontSize: 13, fontFamily: "var(--sans)", outline: "none" }} />
    </div>
  );
  const select = (label, key, choices) => (
    <div key={key} style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, color: "#4a7a80", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>{label}</label>
      <select value={options[key] || choices[0][0]} onChange={e => opt(key, e.target.value)}
        style={{ width: "100%", padding: "9px 12px", background: "#224146", border: "1px solid #2a5259", borderRadius: 7, color: "#e8f4f5", fontSize: 13, fontFamily: "var(--sans)" }}>
        {choices.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );

  const panels = {
    'split-pdf': [select("Split into", "parts", [["2","2 parts"],["3","3 parts"],["4","4 parts"],["5","5 parts"]])],
    'extract-pages': [common("Page numbers (e.g. 1,3,5)", "pages", "text", "1,3,5")],
    'organize-pdf': [common("New page order (e.g. 3,1,2,4)", "order", "text", "3,1,2,4")],
    'delete-pages': [common("Pages to delete (e.g. 2,4)", "pages", "text", "2,4")],
    'rotate-pdf': [
      select("Rotation angle", "angle", [["90","90° clockwise"],["180","180°"],["270","270° (90° counter-clockwise)"]]),
      common("Pages (leave blank for all)", "pages", "text", "all"),
    ],
    'add-blank-page': [common("Insert after page number", "afterPage", "number", "0")],
    'add-watermark': [
      common("Watermark text", "text", "text", "CONFIDENTIAL"),
      select("Position", "rotation", [["-45","Diagonal"],["0","Horizontal"],["90","Vertical"]]),
      common("Opacity (0.05–0.5)", "opacity", "number", "0.15"),
      common("Font size", "fontSize", "number", "48"),
    ],
    'page-numbers': [
      common("Start from", "startFrom", "number", "1"),
      select("Position", "position", [["bottom-center","Bottom center"],["top-center","Top center"],["bottom-left","Bottom left"],["bottom-right","Bottom right"]]),
      common("Prefix (e.g. Page )", "prefix", "text", ""),
      common("Suffix (e.g.  of 10)", "suffix", "text", ""),
    ],
    'header-footer': [
      common("Header text", "header", "text", "Company Confidential"),
      common("Footer text", "footer", "text", "Page {n}"),
    ],
    'protect-pdf': [
      common("User password", "password", "password", "Enter password"),
      common("Owner password (optional)", "ownerPassword", "password", "Same as user password"),
    ],
    'edit-metadata': [
      common("Title", "title"), common("Author", "author"),
      common("Subject", "subject"), common("Keywords", "keywords"), common("Creator", "creator"),
    ],
    'fix-page-size': [select("Target size", "size", [["a4","A4 (210×297mm)"],["us-letter","US Letter (8.5×11in)"],["a3","A3 (297×420mm)"],["legal","Legal (8.5×14in)"]])],
    'background-color': [common("Background colour", "color", "color", "#FFFDE7")],
  };

  const fields = panels[tool.id];
  if (!fields?.length) return null;
  return (
    <div style={{ background: "#1a3b3f", border: "1px solid #2a5259", borderRadius: 10, padding: "20px", marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#4a7a80", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Options</div>
      {fields}
    </div>
  );
}
