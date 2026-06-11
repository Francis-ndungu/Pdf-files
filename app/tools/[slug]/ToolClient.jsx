
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { CATEGORIES } from "@/lib/tools";

const { ArrowLeft, Upload, Download, CheckCircle2, AlertCircle, Loader2,
        ChevronRight, Info, Shield, Zap, X, Plus, RefreshCw } = LucideIcons;

function Icon({ name, ...p }) {
  const C = LucideIcons[name] || LucideIcons.File;
  return <C strokeWidth={1.6} {...p} />;
}

function catColor(cat) {
  const c = CATEGORIES.find(x => x.id === cat);
  return c ? c.color : "#D85A30";
}

/* ── File drop zone ─────────────────────────────────────────────────────────── */
function DropZone({ accepts, multi, files, onFiles, onRemove }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const onDrop = useCallback(e => {
    e.preventDefault(); setDrag(false);
    const f = Array.from(e.dataTransfer.files);
    const valid = accepts?.length ? f.filter(x => accepts.some(a => x.name.toLowerCase().endsWith(a))) : f;
    if (valid.length) onFiles(valid);
  }, [accepts, onFiles]);

  return (
    <div>
      <div
        className={`upload-zone ${drag ? "dragging" : ""}`}
        onClick={() => ref.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        style={{ cursor: "pointer" }}
      >
        <input ref={ref} type="file" multiple={multi} accept={accepts?.join(",")}
          style={{ display:"none" }} onChange={e => { const f = Array.from(e.target.files); if (f.length) onFiles(f); e.target.value=''; }} />
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
          <div style={{ width:52, height:52, borderRadius:12, background:"rgba(216,90,48,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Upload size={22} color="#D85A30" strokeWidth={1.5} />
          </div>
          {files.length === 0 ? (
            <>
              <div>
                <p style={{ fontSize:15, fontWeight:600, color:"#f0f9fa", marginBottom:4, textAlign:"center" }}>
                  Drop {multi ? "files" : "a file"} here
                </p>
                <p style={{ fontSize:13, color:"#8fb3b8", textAlign:"center" }}>
                  or click to browse{multi ? " — multiple files supported" : ""}
                </p>
              </div>
              {accepts?.length > 0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
                  {accepts.map(a => (
                    <span key={a} style={{ fontSize:11, background:"rgba(255,255,255,0.06)", color:"#8fb3b8", padding:"3px 8px", borderRadius:5, border:"1px solid rgba(255,255,255,0.08)" }}>{a}</span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:6 }} onClick={e => e.stopPropagation()}>
              {files.map((f, i) => (
                <div key={i} className="file-row">
                  <Icon name="FileText" size={15} color="#D85A30" />
                  <span style={{ flex:1, fontSize:13, color:"#f0f9fa", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</span>
                  <span style={{ fontSize:11, color:"#517880", flexShrink:0 }}>{(f.size/1024/1024).toFixed(1)} MB</span>
                  <button onClick={() => onRemove(i)} style={{ background:"none", border:"none", cursor:"pointer", color:"#517880", padding:"2px 4px", borderRadius:4, lineHeight:1 }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
              <p style={{ fontSize:12, color:"#517880", textAlign:"center", marginTop:4 }}>Click to add more files</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Options fields ─────────────────────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
function Input({ value, onChange, type="text", placeholder="" }) {
  return <input className="field-input" type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />;
}
function Select({ value, onChange, options }) {
  return (
    <select className="field-select" value={value} onChange={e=>onChange(e.target.value)}>
      {options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
function ColorInput({ label, value, onChange }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <input type="color" value={value} onChange={e=>onChange(e.target.value)}
          style={{ width:40, height:38, borderRadius:6, border:"1px solid #2a5259", background:"none", cursor:"pointer", padding:2 }} />
        <input className="field-input" style={{ flex:1 }} value={value} onChange={e=>onChange(e.target.value)} />
      </div>
    </div>
  );
}
function SignatureCanvas({ onCapture }) {
  const cv = useRef(); const [drawing, setDrawing] = useState(false);
  useEffect(() => {
    const canvas = cv.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle="#fff"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="#1e3d41"; ctx.lineWidth=2; ctx.lineCap="round";
  }, []);
  const getPos = e => {
    const r = cv.current.getBoundingClientRect();
    const src = e.touches?.[0] || e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };
  const down = e => { setDrawing(true); const {x,y}=getPos(e); const ctx=cv.current.getContext('2d'); ctx.beginPath(); ctx.moveTo(x,y); };
  const move = e => { if (!drawing) return; const {x,y}=getPos(e); const ctx=cv.current.getContext('2d'); ctx.lineTo(x,y); ctx.stroke(); };
  const up = () => { setDrawing(false); onCapture(cv.current.toDataURL('image/png')); };
  const clear = () => { const ctx=cv.current.getContext('2d'); ctx.fillStyle="#fff"; ctx.fillRect(0,0,cv.current.width,cv.current.height); onCapture(null); };
  return (
    <div>
      <canvas ref={cv} width={400} height={120}
        style={{ border:"1px solid #2a5259", borderRadius:8, cursor:"crosshair", touchAction:"none", display:"block", width:"100%", background:"#fff" }}
        onMouseDown={down} onMouseMove={move} onMouseUp={up}
        onTouchStart={down} onTouchMove={move} onTouchEnd={up} />
      <button type="button" onClick={clear}
        style={{ marginTop:6, fontSize:12, color:"#517880", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
        <RefreshCw size={11} /> Clear signature
      </button>
    </div>
  );
}

/* ── Main ToolClient ─────────────────────────────────────────────────────────── */
export default function ToolClient({ tool, allTools }) {
  const [files, setFiles]       = useState([]);
  const [filesB, setFilesB]     = useState([]);
  const [opts, setOpts]         = useState({});
  const [status, setStatus]     = useState("idle"); // idle | loading | done | error
  const [progress, setProgress] = useState(0);
  const [message, setMessage]   = useState("");
  const [metadata, setMeta]     = useState(null);
  const [aiResult, setAiResult] = useState("");
  const [sigData, setSigData]   = useState(null);

  const setOpt = (k, v) => setOpts(o => ({ ...o, [k]: v }));
  const addFiles = useCallback(f => setFiles(prev => tool.multi ? [...prev, ...f] : f), [tool.multi]);
  const removeFile = i => setFiles(prev => prev.filter((_,j)=>j!==i));
  const color = catColor(tool.category);
  const related = allTools.filter(t => t.category === tool.category && t.slug !== tool.slug).slice(0,4);

  const run = async () => {
    if (!files.length) { setStatus("error"); setMessage("Please select a file first."); return; }
    setStatus("loading"); setProgress(0); setMessage(""); setMeta(null); setAiResult("");
    try {
      const eng  = await import("@/lib/pdfEngine");
      const conv = await import("@/lib/converters");
      const prog = p => setProgress(p);
      const base = files[0].name.replace(/\.[^.]+$/, '');
      let resultBytes, resultName;

      switch (tool.slug) {
        // ── ORGANISE ──────────────────────────────────────────────────────
        case 'merge-pdf':
          resultBytes = await eng.mergePDFs(files); resultName = "merged.pdf"; break;
        case 'split-pdf':
          { const res = await eng.splitPDF(files[0], opts.mode||'single', opts.value||'2');
            if (res.length > 1) { eng.downloadMulti(res); setStatus("done"); setMessage(`Split into ${res.length} files — all downloaded.`); return; }
            resultBytes = res[0].bytes; resultName = res[0].name; } break;
        case 'extract-pages':
          resultBytes = await eng.extractPages(files[0], opts.pages||'1'); resultName = `${base}_extracted.pdf`; break;
        case 'organize-pdf':
          resultBytes = await eng.organisePDF(files[0], opts.order||''); resultName = `${base}_organised.pdf`; break;
        case 'delete-pages':
          resultBytes = await eng.deletePages(files[0], opts.pages||''); resultName = `${base}_edited.pdf`; break;
        case 'rotate-pdf':
          resultBytes = await eng.rotatePDF(files[0], opts.angle||'90', opts.pages||'all'); resultName = `${base}_rotated.pdf`; break;
        case 'reverse-pages':
          resultBytes = await eng.reversePages(files[0]); resultName = `${base}_reversed.pdf`; break;
        case 'add-blank-page':
          resultBytes = await eng.addBlankPage(files[0], parseInt(opts.after||0), parseInt(opts.w||595), parseInt(opts.h||842)); resultName = `${base}_added.pdf`; break;
        case 'alternate-merge':
          if (!filesB.length) { setStatus("error"); setMessage("Please upload a second PDF."); return; }
          resultBytes = await eng.alternateMerge(files[0], filesB[0]); resultName = "interleaved.pdf"; break;
        case 'n-up-pdf':
          resultBytes = await eng.nUpPDF(files[0], parseInt(opts.n||2)); resultName = `${base}_nup.pdf`; break;
        case 'pdf-to-zip':
          { const z = await eng.pdfToZip(files); eng.download(z, "pdfs.zip","application/zip"); setStatus("done"); setMessage(`${files.length} files archived.`); return; }
        case 'pdf-reader':
          { const url = URL.createObjectURL(files[0]);
            window.open(url,'_blank'); setStatus("done"); setMessage("PDF opened in a new tab."); return; }
        case 'view-metadata':
          { const m = await eng.getMetadata(files[0]); setMeta(m); setStatus("done"); setMessage(""); return; }
        case 'compare-pdfs':
          if (!filesB.length) { setStatus("error"); setMessage("Please upload a second PDF."); return; }
          { const m = await eng.comparePDFs(files[0], filesB[0]); setMeta({ type:'compare', ...m }); setStatus("done"); setMessage(""); return; }

        // ── EDIT ──────────────────────────────────────────────────────────
        case 'add-watermark':
          resultBytes = await eng.addWatermark(files[0], opts.text||'CONFIDENTIAL', { opacity:parseFloat(opts.opacity||0.15), rotation:parseInt(opts.rotation||-45), fontSize:parseInt(opts.size||52), position:opts.pos||'center' });
          resultName = `${base}_watermarked.pdf`; break;
        case 'page-numbers':
          resultBytes = await eng.addPageNumbers(files[0], { startFrom:parseInt(opts.start||1), position:opts.pos||'bottom-center', prefix:opts.prefix||'', suffix:opts.suffix||'' });
          resultName = `${base}_numbered.pdf`; break;
        case 'header-footer':
          resultBytes = await eng.addHeaderFooter(files[0], opts.header||'', opts.footer||''); resultName = `${base}_headed.pdf`; break;
        case 'background-color':
          resultBytes = await eng.changeBackground(files[0], opts.color||'#FFFDE7'); resultName = `${base}_bg.pdf`; break;
        case 'add-stamps':
          resultBytes = await eng.addStamp(files[0], opts.stamp||'APPROVED', opts.color||'#D85A30'); resultName = `${base}_stamped.pdf`; break;
        case 'sign-pdf':
          if (!sigData) { setStatus("error"); setMessage("Please draw your signature first."); return; }
          resultBytes = await eng.signPDF(files[0], sigData, { x:parseInt(opts.x||80), y:parseInt(opts.y||80), pageNum:parseInt(opts.page||0)-1, w:parseInt(opts.sw||180), h:parseInt(opts.sh||60) });
          resultName = `${base}_signed.pdf`; break;
        case 'redact-pdf':
          { const regions = [{ page:parseInt(opts.page||1)-1, x:parseInt(opts.x||50), y:parseInt(opts.y||50), w:parseInt(opts.w||200), h:parseInt(opts.h||40) }];
            resultBytes = await eng.redactPDF(files[0], regions); resultName = `${base}_redacted.pdf`; } break;
        case 'crop-pdf':
          resultBytes = await eng.cropPDF(files[0], { top:parseInt(opts.top||0), right:parseInt(opts.right||0), bottom:parseInt(opts.bottom||0), left:parseInt(opts.left||0) });
          resultName = `${base}_cropped.pdf`; break;
        case 'remove-annotations':
          resultBytes = await eng.removeAnnotations(files[0]); resultName = `${base}_clean.pdf`; break;
        case 'remove-blank-pages':
          resultBytes = await eng.removeBlankPages(files[0]); resultName = `${base}_trimmed.pdf`; break;
        case 'edit-metadata':
          resultBytes = await eng.editMetadata(files[0], { title:opts.title, author:opts.author, subject:opts.subject, keywords:opts.keywords, creator:opts.creator });
          resultName = `${base}_edited.pdf`; break;

        // ── OPTIMISE ──────────────────────────────────────────────────────
        case 'compress-pdf':
          resultBytes = await eng.compressPDF(files[0]); resultName = `${base}_compressed.pdf`; break;
        case 'repair-pdf':
          resultBytes = await eng.repairPDF(files[0]); resultName = `${base}_repaired.pdf`; break;
        case 'fix-page-size':
          resultBytes = await eng.fixPageSize(files[0], opts.size||'a4'); resultName = `${base}_fixed.pdf`; break;
        case 'page-dimensions':
          { const d = await eng.getPageDimensions(files[0]); setMeta({ type:'dimensions', data:d }); setStatus("done"); setMessage(""); return; }
        case 'flatten-pdf':
          resultBytes = await eng.flattenPDF(files[0]); resultName = `${base}_flat.pdf`; break;
        case 'remove-metadata':
          resultBytes = await eng.removeMetadata(files[0]); resultName = `${base}_clean.pdf`; break;
        case 'ocr-pdf':
          resultBytes = await eng.ocrPDF ? await eng.ocrPDF(files[0]) : await conv.ocrPDF(files[0], opts.lang||'eng', p => setProgress(p));
          resultName = `${base}_ocr.pdf`; break;

        // ── SECURITY ──────────────────────────────────────────────────────
        case 'protect-pdf':
          if (!opts.pass) { setStatus("error"); setMessage("Enter a password."); return; }
          resultBytes = await eng.protectPDF(files[0], opts.pass, opts.opass); resultName = `${base}_protected.pdf`; break;
        case 'unlock-pdf':
          resultBytes = await eng.unlockPDF(files[0]); resultName = `${base}_unlocked.pdf`; break;
        case 'sanitize-pdf':
          resultBytes = await eng.sanitizePDF(files[0]); resultName = `${base}_sanitized.pdf`; break;
        case 'convert-pdfa':
          resultBytes = await eng.convertToPdfA(files[0]); resultName = `${base}_pdfa.pdf`; break;

        // ── CONVERT TO PDF ────────────────────────────────────────────────
        case 'image-to-pdf':
          resultBytes = await eng.imageToPDF(files); resultName = "images.pdf"; break;
        case 'word-to-pdf':
          resultBytes = await conv.wordToPDF(files[0], prog); resultName = `${base}.pdf`; break;
        case 'txt-to-pdf':
          resultBytes = await eng.txtToPDF(files[0]); resultName = `${base}.pdf`; break;
        case 'markdown-to-pdf':
          resultBytes = await eng.markdownToPDF(files[0]); resultName = `${base}.pdf`; break;
        case 'html-to-pdf':
          { const html = await files[0].text();
            const b64 = btoa(unescape(encodeURIComponent(html)));
            const win = window.open(`data:text/html;base64,${b64}`, '_blank');
            setStatus("done"); setMessage("HTML opened in new tab — use browser Print → Save as PDF to export."); return; }

        // ── CONVERT FROM PDF ──────────────────────────────────────────────
        case 'pdf-to-jpg':
          { const imgs = await conv.pdfToImages(files[0],'jpeg',2,prog);
            imgs.forEach((im,i) => setTimeout(() => conv.downloadBlob(im.bytes, im.name,'image/jpeg'), i*300));
            setStatus("done"); setMessage(`${imgs.length} JPG files downloaded.`); return; }
        case 'pdf-to-png':
          { const imgs = await conv.pdfToImages(files[0],'png',2,prog);
            imgs.forEach((im,i) => setTimeout(() => conv.downloadBlob(im.bytes, im.name,'image/png'), i*300));
            setStatus("done"); setMessage(`${imgs.length} PNG files downloaded.`); return; }
        case 'pdf-to-text':
          { const txt = await conv.pdfToText(files[0], prog);
            conv.downloadBlob(new TextEncoder().encode(txt), `${base}.txt`, 'text/plain');
            setStatus("done"); setMessage("Text file downloaded."); return; }
        case 'pdf-to-word':
          { const { text } = await conv.pdfToWord(files[0], prog);
            conv.downloadBlob(new TextEncoder().encode(text), `${base}.txt`, 'text/plain');
            setStatus("done"); setMessage("Text extracted. Full DOCX requires LibreOffice WASM."); return; }
        case 'pdf-to-html':
          { const html = await conv.pdfToHTML(files[0], prog);
            conv.downloadBlob(new TextEncoder().encode(html), `${base}.html`, 'text/html');
            setStatus("done"); setMessage("HTML file downloaded."); return; }
        case 'pdf-to-csv':
          { const csv = await conv.pdfToCSV(files[0], prog);
            conv.downloadBlob(new TextEncoder().encode(csv), `${base}.csv`, 'text/csv');
            setStatus("done"); setMessage("CSV downloaded."); return; }

        // ── AI ────────────────────────────────────────────────────────────
        case 'summarize-pdf': case 'translate-pdf': case 'chat-pdf':
          { const text = await conv.pdfToText(files[0], p => setProgress(p * 0.4));
            setProgress(50);
            const action = tool.slug === 'summarize-pdf' ? 'summarize' : tool.slug === 'translate-pdf' ? 'translate' : 'chat';
            const prompt = tool.slug === 'chat-pdf' ? `Document context:\n${text.slice(0,8000)}\n\nUser question: ${opts.question||'Summarise this document.'}` : text;
            const res = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action, text:prompt, targetLang:opts.lang||'Spanish' }) });
            const data = await res.json();
            setProgress(100);
            if (data.error) { setStatus("error"); setMessage(data.error); return; }
            setAiResult(data.result); setStatus("done"); setMessage(""); return; }

        default:
          setStatus("error"); setMessage(`${tool.name} requires additional WASM modules not yet loaded.`); return;
      }

      setProgress(100);
      eng.download(resultBytes, resultName);
      setStatus("done"); setMessage(`${resultName} ready — downloading…`);
    } catch(e) {
      console.error(e);
      setStatus("error"); setMessage(e.message || "Processing failed. The file may be encrypted or corrupted.");
    }
  };

  const OptionPanels = {
    'split-pdf': (
      <>
        <Field label="Split mode">
          <Select value={opts.mode||'single'} onChange={v=>setOpt('mode',v)} options={[['single','Every page as separate file'],['every','Every N pages'],['ranges','Custom page ranges']]} />
        </Field>
        {(opts.mode==='every') && <Field label="Pages per part"><Input value={opts.value||'2'} onChange={v=>setOpt('value',v)} placeholder="e.g. 3" /></Field>}
        {(opts.mode==='ranges') && <Field label="Ranges (semicolons separated)"><Input value={opts.value||''} onChange={v=>setOpt('value',v)} placeholder="e.g. 1-3; 4-8; 9" /></Field>}
      </>
    ),
    'extract-pages': <Field label="Page numbers (comma-separated)"><Input value={opts.pages||''} onChange={v=>setOpt('pages',v)} placeholder="e.g. 1, 3, 5-8" /></Field>,
    'organize-pdf':  <Field label="New page order (comma-separated)"><Input value={opts.order||''} onChange={v=>setOpt('order',v)} placeholder="e.g. 3, 1, 4, 2" /></Field>,
    'delete-pages':  <Field label="Pages to delete (comma-separated)"><Input value={opts.pages||''} onChange={v=>setOpt('pages',v)} placeholder="e.g. 2, 5, 7" /></Field>,
    'rotate-pdf': (
      <>
        <Field label="Rotation angle"><Select value={opts.angle||'90'} onChange={v=>setOpt('angle',v)} options={[['90','90° clockwise'],['180','180°'],['270','270° counter-clockwise']]} /></Field>
        <Field label="Which pages"><Input value={opts.pages||'all'} onChange={v=>setOpt('pages',v)} placeholder="all  or  1, 3, 5" /></Field>
      </>
    ),
    'add-blank-page': (
      <>
        <Field label="Insert after page"><Input type="number" value={opts.after||'0'} onChange={v=>setOpt('after',v)} /></Field>
        <Field label="Page size"><Select value={opts.preset||'a4'} onChange={v=>{ setOpt('preset',v); const s={a4:[595,842],letter:[612,792]}[v]; if(s){setOpt('w',s[0]);setOpt('h',s[1])}; }} options={[['a4','A4'],['letter','US Letter'],['custom','Custom']]} /></Field>
      </>
    ),
    'n-up-pdf': <Field label="Pages per sheet"><Select value={opts.n||'2'} onChange={v=>setOpt('n',v)} options={[['2','2-up (2 pages)'],['4','4-up (4 pages)'],['9','9-up (9 pages)']]} /></Field>,
    'add-watermark': (
      <>
        <Field label="Watermark text"><Input value={opts.text||'CONFIDENTIAL'} onChange={v=>setOpt('text',v)} /></Field>
        <Field label="Opacity (0.05 – 0.4)"><Input type="number" value={opts.opacity||'0.15'} onChange={v=>setOpt('opacity',v)} /></Field>
        <Field label="Font size"><Input type="number" value={opts.size||'52'} onChange={v=>setOpt('size',v)} /></Field>
        <Field label="Rotation (degrees)"><Input type="number" value={opts.rotation||'-45'} onChange={v=>setOpt('rotation',v)} /></Field>
        <Field label="Position"><Select value={opts.pos||'center'} onChange={v=>setOpt('pos',v)} options={[['center','Center (diagonal)'],['top','Top'],['bottom','Bottom']]} /></Field>
      </>
    ),
    'page-numbers': (
      <>
        <Field label="Start from"><Input type="number" value={opts.start||'1'} onChange={v=>setOpt('start',v)} /></Field>
        <Field label="Position"><Select value={opts.pos||'bottom-center'} onChange={v=>setOpt('pos',v)} options={[['bottom-center','Bottom centre'],['top-center','Top centre'],['bottom-left','Bottom left'],['bottom-right','Bottom right']]} /></Field>
        <Field label="Prefix (e.g. Page )"><Input value={opts.prefix||''} onChange={v=>setOpt('prefix',v)} placeholder="Page " /></Field>
        <Field label="Suffix"><Input value={opts.suffix||''} onChange={v=>setOpt('suffix',v)} placeholder=" of 10" /></Field>
      </>
    ),
    'header-footer': (
      <>
        <Field label="Header text"><Input value={opts.header||''} onChange={v=>setOpt('header',v)} placeholder="Company Confidential" /></Field>
        <Field label="Footer text"><Input value={opts.footer||''} onChange={v=>setOpt('footer',v)} placeholder="Page {n} · 2025" /></Field>
      </>
    ),
    'background-color': <ColorInput label="Background colour" value={opts.color||'#FFFDE7'} onChange={v=>setOpt('color',v)} />,
    'add-stamps': (
      <>
        <Field label="Stamp text"><Select value={opts.stamp||'APPROVED'} onChange={v=>setOpt('stamp',v)} options={[['APPROVED','APPROVED'],['DRAFT','DRAFT'],['CONFIDENTIAL','CONFIDENTIAL'],['REVIEWED','REVIEWED'],['REJECTED','REJECTED'],['FINAL','FINAL']]} /></Field>
        <ColorInput label="Stamp colour" value={opts.color||'#D85A30'} onChange={v=>setOpt('color',v)} />
      </>
    ),
    'sign-pdf': (
      <>
        <Field label="Draw your signature">
          <SignatureCanvas onCapture={setSigData} />
        </Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <Field label="Page number"><Input type="number" value={opts.page||'1'} onChange={v=>setOpt('page',v)} /></Field>
          <Field label="X position (pt)"><Input type="number" value={opts.x||'80'} onChange={v=>setOpt('x',v)} /></Field>
          <Field label="Y from top (pt)"><Input type="number" value={opts.y||'80'} onChange={v=>setOpt('y',v)} /></Field>
          <Field label="Width (pt)"><Input type="number" value={opts.sw||'180'} onChange={v=>setOpt('sw',v)} /></Field>
        </div>
      </>
    ),
    'redact-pdf': (
      <>
        <div style={{ padding:"10px 14px", background:"rgba(239,68,68,0.07)", borderRadius:8, border:"1px solid rgba(239,68,68,0.18)", fontSize:12, color:"#FCA5A5", marginBottom:4 }}>
          Redaction is permanent and cannot be undone.
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <Field label="Page"><Input type="number" value={opts.page||'1'} onChange={v=>setOpt('page',v)} /></Field>
          <Field label="X (pt)"><Input type="number" value={opts.x||'50'} onChange={v=>setOpt('x',v)} /></Field>
          <Field label="Y from top (pt)"><Input type="number" value={opts.y||'50'} onChange={v=>setOpt('y',v)} /></Field>
          <Field label="Width (pt)"><Input type="number" value={opts.w||'200'} onChange={v=>setOpt('w',v)} /></Field>
          <Field label="Height (pt)"><Input type="number" value={opts.h||'40'} onChange={v=>setOpt('h',v)} /></Field>
        </div>
      </>
    ),
    'crop-pdf': (
      <>
        <p style={{ fontSize:12, color:"#8fb3b8", marginBottom:8 }}>Trim margins in points (1 pt ≈ 0.35 mm)</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {['top','right','bottom','left'].map(s => <Field key={s} label={s.charAt(0).toUpperCase()+s.slice(1)}><Input type="number" value={opts[s]||'0'} onChange={v=>setOpt(s,v)} /></Field>)}
        </div>
      </>
    ),
    'protect-pdf': (
      <>
        <Field label="User password"><Input type="password" value={opts.pass||''} onChange={v=>setOpt('pass',v)} placeholder="Password to open" /></Field>
        <Field label="Owner password (optional)"><Input type="password" value={opts.opass||''} onChange={v=>setOpt('opass',v)} placeholder="Admin password" /></Field>
      </>
    ),
    'edit-metadata': (
      <>
        {[['title','Title'],['author','Author'],['subject','Subject'],['keywords','Keywords'],['creator','Creator']].map(([k,l]) => (
          <Field key={k} label={l}><Input value={opts[k]||''} onChange={v=>setOpt(k,v)} /></Field>
        ))}
      </>
    ),
    'fix-page-size': <Field label="Target size"><Select value={opts.size||'a4'} onChange={v=>setOpt('size',v)} options={[['a4','A4 (210×297mm)'],['letter','US Letter (8.5×11in)'],['a3','A3 (297×420mm)'],['a5','A5 (148×210mm)'],['legal','Legal (8.5×14in)']]} /></Field>,
    'ocr-pdf': <Field label="Language"><Select value={opts.lang||'eng'} onChange={v=>setOpt('lang',v)} options={[['eng','English'],['fra','French'],['deu','German'],['spa','Spanish'],['ita','Italian'],['por','Portuguese'],['chi_sim','Chinese (Simplified)'],['ara','Arabic'],['jpn','Japanese'],['kor','Korean']]} /></Field>,
    'word-to-pdf': <div className="alert alert-info" style={{ fontSize:12 }}>DOCX files are converted using mammoth.js. Complex formatting is simplified to ensure compatibility.</div>,
    'html-to-pdf': <div className="alert alert-info" style={{ fontSize:12 }}>HTML will open in a new tab. Use your browser's Print → Save as PDF to export with full fidelity.</div>,
    'translate-pdf': (
      <>
        <Field label="Target language"><Select value={opts.lang||'Spanish'} onChange={v=>setOpt('lang',v)} options={[['Spanish','Spanish'],['French','French'],['German','German'],['Italian','Italian'],['Portuguese','Portuguese'],['Dutch','Dutch'],['Chinese (Simplified)','Chinese (Simplified)'],['Japanese','Japanese'],['Arabic','Arabic'],['Russian','Russian'],['Hindi','Hindi'],['Korean','Korean'],['Turkish','Turkish'],['Polish','Polish']]} /></Field>
        <div className="alert alert-info" style={{ fontSize:12 }}>Requires <code>ANTHROPIC_API_KEY</code> set in your Vercel environment variables.</div>
      </>
    ),
    'chat-pdf': (
      <>
        <Field label="Your question"><Input value={opts.question||''} onChange={v=>setOpt('question',v)} placeholder="What is this document about?" /></Field>
        <div className="alert alert-info" style={{ fontSize:12 }}>Requires <code>ANTHROPIC_API_KEY</code> in environment variables.</div>
      </>
    ),
    'summarize-pdf': <div className="alert alert-info" style={{ fontSize:12 }}>Requires <code>ANTHROPIC_API_KEY</code> in your Vercel environment variables. Set it in the Vercel dashboard under Settings → Environment Variables.</div>,
    'alternate-merge': (
      <div>
        <p style={{ fontSize:12, color:"#8fb3b8", marginBottom:10 }}>Upload a second PDF to interleave with the first.</p>
        <DropZone accepts={['.pdf']} multi={false} files={filesB} onFiles={setFilesB} onRemove={i => setFilesB(p=>p.filter((_,j)=>j!==i))} />
      </div>
    ),
    'compare-pdfs': (
      <div>
        <p style={{ fontSize:12, color:"#8fb3b8", marginBottom:10 }}>Upload the second PDF to compare against.</p>
        <DropZone accepts={['.pdf']} multi={false} files={filesB} onFiles={setFilesB} onRemove={i => setFilesB(p=>p.filter((_,j)=>j!==i))} />
      </div>
    ),
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingTop:"var(--nav-h)" }}>
      {/* ── Breadcrumb bar ── */}
      <div style={{ background:"#1e3d41", borderBottom:"1px solid #2a5259", padding:"10px var(--pad)" }}>
        <div className="container" style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#517880" }}>
          <Link href="/" style={{ color:"#517880", textDecoration:"none" }}>Tools</Link>
          <ChevronRight size={13} />
          <span style={{ color:color }}>{(CATEGORIES.find(c=>c.id===tool.category)||{}).label}</span>
          <ChevronRight size={13} />
          <span style={{ color:"#f0f9fa", fontWeight:500 }}>{tool.name}</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="container" style={{ padding:"32px var(--pad)", maxWidth:1200 }}>
        {/* Tool header */}
        <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:28, flexWrap:"wrap" }}>
          <div style={{ width:56, height:56, borderRadius:14, background:`rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.15)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name={tool.icon} size={24} color={color} />
          </div>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:6 }}>
              <h1 style={{ fontFamily:"var(--serif)", fontSize:"clamp(22px,3vw,32px)", fontWeight:400, color:"#f0f9fa", letterSpacing:"-0.5px" }}>{tool.name}</h1>
              {tool.ai   && <span className="pill pill-ai">AI</span>}
              {tool.wasm && <span className="pill pill-pro">WASM required</span>}
              {tool.multi&& <span className="pill pill-new">Batch</span>}
            </div>
            <p style={{ fontSize:14, color:"#8fb3b8", lineHeight:1.6, maxWidth:600 }}>{tool.desc}</p>
          </div>
        </div>

        <div className="tool-layout">
          {/* ── Left: upload + options + run ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <DropZone accepts={tool.accepts} multi={tool.multi} files={files} onFiles={addFiles} onRemove={removeFile} />

            {/* Options */}
            {OptionPanels[tool.slug] && (
              <div className="panel">
                <div className="panel-header"><span className="panel-header-title">Options</span></div>
                <div className="panel-body" style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {OptionPanels[tool.slug]}
                </div>
              </div>
            )}

            {/* Progress */}
            {status === 'loading' && (
              <div className="panel">
                <div className="panel-body">
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, color:"#8fb3b8", fontSize:13 }}>
                      <Loader2 size={14} className="animate-spin" color={color} /> Processing…
                    </div>
                    <span style={{ fontSize:13, fontWeight:600, color }}>{progress}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width:`${progress}%` }} /></div>
                </div>
              </div>
            )}

            {/* Error */}
            {status === 'error' && (
              <div className="alert alert-error" style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <AlertCircle size={16} style={{ flexShrink:0, marginTop:2 }} />
                <span>{message}</span>
              </div>
            )}

            {/* Success */}
            {status === 'done' && message && (
              <div className="result-card">
                <CheckCircle2 size={22} color="#22C55E" />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:"#22C55E", marginBottom:2 }}>Done!</div>
                  <div style={{ fontSize:13, color:"#8fb3b8" }}>{message}</div>
                </div>
                <button className="btn btn-outline" style={{ fontSize:12, padding:"7px 14px" }} onClick={() => { setStatus("idle"); setFiles([]); }}>
                  <RefreshCw size={13} /> New file
                </button>
              </div>
            )}

            {/* AI result */}
            {status === 'done' && aiResult && (
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-header-title">AI Result</span>
                  <button className="btn btn-outline" style={{ fontSize:11, padding:"5px 12px" }} onClick={() => { conv: import('@/lib/converters').then(c => c.downloadBlob(new TextEncoder().encode(aiResult), 'result.txt', 'text/plain')); }}>
                    <Download size={12} /> Save
                  </button>
                </div>
                <div className="panel-body" style={{ maxHeight:400, overflowY:"auto" }}>
                  <pre style={{ fontFamily:"var(--sans)", fontSize:13, color:"#c8e0e4", lineHeight:1.8, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{aiResult}</pre>
                </div>
              </div>
            )}

            {/* Metadata display */}
            {status === 'done' && metadata && !metadata.type && (
              <div className="panel">
                <div className="panel-header"><span className="panel-header-title">File Metadata</span></div>
                <div className="panel-body">
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <tbody>
                      {Object.entries(metadata).map(([k, v]) => (
                        <tr key={k} style={{ borderBottom:"1px solid #2a5259" }}>
                          <td style={{ padding:"8px 0", fontSize:11, fontWeight:700, color:"#517880", textTransform:"uppercase", letterSpacing:"0.5px", width:160 }}>{k.replace(/([A-Z])/g,' $1').trim()}</td>
                          <td style={{ padding:"8px 0", fontSize:13, color:"#f0f9fa" }}>{String(v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Dimensions table */}
            {status === 'done' && metadata?.type === 'dimensions' && (
              <div className="panel">
                <div className="panel-header"><span className="panel-header-title">Page Dimensions</span></div>
                <div className="panel-body" style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                    <thead>
                      <tr>{['Page','Width','Height','Format','Orientation','Rotation'].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#517880", textTransform:"uppercase", borderBottom:"1px solid #2a5259" }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {metadata.data.map(d=>(
                        <tr key={d.page} style={{ borderBottom:"1px solid rgba(42,82,89,0.5)" }}>
                          {[d.page,`${d.width} pt`,`${d.height} pt`,d.format,d.orientation,`${d.rotation}°`].map((v,i)=>(
                            <td key={i} style={{ padding:"8px 12px", color:"#f0f9fa" }}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Compare result */}
            {status === 'done' && metadata?.type === 'compare' && (
              <div className="panel">
                <div className="panel-header"><span className="panel-header-title">Comparison Results</span></div>
                <div className="panel-body" style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                  {[{f:metadata.fileA, label:"File A"},{f:metadata.fileB, label:"File B"}].map(({f,label})=>(
                    <div key={label} style={{ flex:1, minWidth:180, background:"#224146", borderRadius:9, padding:"14px 18px" }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#517880", marginBottom:8, textTransform:"uppercase" }}>{label}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#f0f9fa", marginBottom:4 }}>{f.name}</div>
                      <div style={{ fontSize:13, color:"#8fb3b8" }}>{f.pages} pages</div>
                      <div style={{ fontSize:12, color:"#517880", marginTop:4 }}>{f.title}</div>
                    </div>
                  ))}
                  <div style={{ width:"100%", padding:"12px 14px", borderRadius:8, background: metadata.pageCountMatch?"rgba(34,197,94,0.08)":"rgba(245,158,11,0.08)", border:`1px solid ${metadata.pageCountMatch?"rgba(34,197,94,0.2)":"rgba(245,158,11,0.2)"}`, fontSize:13, color: metadata.pageCountMatch?"#86EFAC":"#FCD34D" }}>
                    {metadata.pageCountMatch ? "Page counts match." : `Page count differs: ${metadata.fileA.pages} vs ${metadata.fileB.pages}.`}
                  </div>
                </div>
              </div>
            )}

            {/* Run button */}
            <button className="btn btn-primary" onClick={run} disabled={status==='loading'}
              style={{ width:"100%", padding:"14px", fontSize:15, gap:10, borderRadius:10, background: status==='loading'?"#224146":"#D85A30" }}>
              {status === 'loading' ? (<><Loader2 size={17} className="animate-spin" /> Processing…</>) : (<><Icon name={tool.icon} size={17} /> {tool.output ? `Run ${tool.name}` : tool.name}</>)}
            </button>

            <p style={{ textAlign:"center", fontSize:12, color:"#517880", lineHeight:1.6 }}>
              <Shield size={12} style={{ display:"inline", verticalAlign:"middle", marginRight:4 }} />
              All processing happens locally in your browser — files are never uploaded anywhere.
            </p>
          </div>

          {/* ── Right sidebar ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* About this tool */}
            <div className="panel">
              <div className="panel-header"><span className="panel-header-title">About this tool</span></div>
              <div className="panel-body" style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <p style={{ fontSize:13, color:"#8fb3b8", lineHeight:1.7 }}>{tool.desc}</p>
                {tool.accepts?.length > 0 && (
                  <div>
                    <p style={{ fontSize:11, fontWeight:700, color:"#517880", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:7 }}>Accepts</p>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      {tool.accepts.map(a=><span key={a} style={{ fontSize:11, background:"rgba(255,255,255,0.05)", color:"#8fb3b8", padding:"3px 8px", borderRadius:5, border:"1px solid rgba(255,255,255,0.07)" }}>{a}</span>)}
                    </div>
                  </div>
                )}
                {tool.output && (
                  <div>
                    <p style={{ fontSize:11, fontWeight:700, color:"#517880", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:7 }}>Output</p>
                    <span style={{ fontSize:11, background:`rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.15)`, color, padding:"3px 9px", borderRadius:5 }}>.{tool.output}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy */}
            <div style={{ padding:"16px", background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.18)", borderRadius:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <Shield size={15} color="#22C55E" />
                <span style={{ fontSize:13, fontWeight:600, color:"#22C55E" }}>100% Private</span>
              </div>
              <p style={{ fontSize:12, color:"#8fb3b8", lineHeight:1.7 }}>All processing runs in your browser via WebAssembly. No files are ever sent to a server.</p>
            </div>

            {/* Related tools */}
            {related.length > 0 && (
              <div className="panel">
                <div className="panel-header"><span className="panel-header-title">Related tools</span></div>
                <div style={{ padding:"8px 0" }}>
                  {related.map(t => (
                    <Link key={t.slug} href={`/tools/${t.slug}`}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 20px", textDecoration:"none", borderBottom:"1px solid rgba(42,82,89,0.5)", transition:"background 0.12s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#224146"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{ width:30, height:30, borderRadius:7, background:`rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.12)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon name={t.icon} size={13} color={color} />
                      </div>
                      <span style={{ fontSize:13, color:"#f0f9fa", flex:1 }}>{t.name}</span>
                      <ChevronRight size={13} color="#517880" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
