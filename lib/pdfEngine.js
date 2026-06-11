
/**
 * PDFforge Engine — client-side PDF operations via pdf-lib
 * All processing happens in the browser. Zero server uploads.
 */

async function lib() {
  return import('pdf-lib');
}

export async function mergePDFs(files) {
  const { PDFDocument } = await lib();
  const out = await PDFDocument.create();
  for (const f of files) {
    const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption:true });
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach(p => out.addPage(p));
  }
  return out.save();
}

export async function splitPDF(file, mode, value) {
  const { PDFDocument } = await lib();
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption:true });
  const total = src.getPageCount();
  const results = [];

  if (mode === 'every') {
    const n = Math.max(1, parseInt(value));
    for (let i = 0; i < total; i += n) {
      const doc = await PDFDocument.create();
      const idxs = Array.from({ length: Math.min(n, total - i) }, (_, j) => i + j);
      const pages = await doc.copyPages(src, idxs);
      pages.forEach(p => doc.addPage(p));
      results.push({ bytes: await doc.save(), name: `part_${Math.floor(i/n)+1}.pdf` });
    }
  } else if (mode === 'ranges') {
    const ranges = value.split(';').map(r => r.trim()).filter(Boolean);
    for (const range of ranges) {
      const [a, b] = range.includes('-') ? range.split('-').map(x => parseInt(x.trim())-1) : [parseInt(range)-1, parseInt(range)-1];
      const idxs = Array.from({ length: b-a+1 }, (_, i) => Math.min(Math.max(a+i, 0), total-1));
      const doc = await PDFDocument.create();
      const pages = await doc.copyPages(src, idxs);
      pages.forEach(p => doc.addPage(p));
      results.push({ bytes: await doc.save(), name: `pages_${a+1}-${b+1}.pdf` });
    }
  } else {
    // single pages
    for (let i = 0; i < total; i++) {
      const doc = await PDFDocument.create();
      const [page] = await doc.copyPages(src, [i]);
      doc.addPage(page);
      results.push({ bytes: await doc.save(), name: `page_${i+1}.pdf` });
    }
  }
  return results;
}

export async function extractPages(file, pageStr) {
  const { PDFDocument } = await lib();
  const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const total = src.getPageCount();
  const idxs = pageStr.split(',').map(s => parseInt(s.trim())-1).filter(n => n >= 0 && n < total);
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, idxs);
  pages.forEach(p => doc.addPage(p));
  return doc.save();
}

export async function organisePDF(file, orderStr) {
  const { PDFDocument } = await lib();
  const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const total = src.getPageCount();
  const idxs = orderStr.split(',').map(s => parseInt(s.trim())-1).filter(n => n >= 0 && n < total);
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, idxs);
  pages.forEach(p => doc.addPage(p));
  return doc.save();
}

export async function deletePages(file, pageStr) {
  const { PDFDocument } = await lib();
  const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const total = src.getPageCount();
  const toDelete = new Set(pageStr.split(',').map(s => parseInt(s.trim())-1));
  const keep = src.getPageIndices().filter(i => !toDelete.has(i));
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, keep);
  pages.forEach(p => doc.addPage(p));
  return doc.save();
}

export async function rotatePDF(file, angle, pageStr) {
  const { PDFDocument, degrees } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const total = doc.getPageCount();
  const targets = pageStr === 'all'
    ? doc.getPageIndices()
    : pageStr.split(',').map(s => parseInt(s.trim())-1).filter(n => n >= 0 && n < total);
  targets.forEach(i => {
    const page = doc.getPage(i);
    page.setRotation(degrees((page.getRotation().angle + parseInt(angle)) % 360));
  });
  return doc.save();
}

export async function reversePages(file) {
  const { PDFDocument } = await lib();
  const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const doc = await PDFDocument.create();
  const idxs = src.getPageIndices().reverse();
  const pages = await doc.copyPages(src, idxs);
  pages.forEach(p => doc.addPage(p));
  return doc.save();
}

export async function addBlankPage(file, after, w=595, h=842) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  doc.insertPage(Math.min(parseInt(after), doc.getPageCount()), [w, h]);
  return doc.save();
}

export async function alternateMerge(fileA, fileB) {
  const { PDFDocument } = await lib();
  const [srcA, srcB] = await Promise.all([fileA, fileB].map(async f => PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption:true })));
  const doc = await PDFDocument.create();
  const maxLen = Math.max(srcA.getPageCount(), srcB.getPageCount());
  for (let i = 0; i < maxLen; i++) {
    if (i < srcA.getPageCount()) { const [p] = await doc.copyPages(srcA, [i]); doc.addPage(p); }
    if (i < srcB.getPageCount()) { const [p] = await doc.copyPages(srcB, [i]); doc.addPage(p); }
  }
  return doc.save();
}

export async function nUpPDF(file, n=2) {
  const { PDFDocument } = await lib();
  const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const doc = await PDFDocument.create();
  const total = src.getPageCount();
  const cols = n <= 2 ? 2 : n <= 4 ? 2 : 3;
  const rows = Math.ceil(n / cols);
  const sheetW = 841.89, sheetH = 595.28; // A4 landscape
  const cellW = sheetW / cols, cellH = sheetH / rows;

  for (let i = 0; i < total; i += n) {
    const page = doc.addPage([sheetW, sheetH]);
    for (let j = 0; j < n && i + j < total; j++) {
      const srcPage = src.getPage(i + j);
      const { width, height } = srcPage.getSize();
      const scale = Math.min(cellW / width, cellH / height) * 0.9;
      const col = j % cols, row = Math.floor(j / cols);
      const x = col * cellW + (cellW - width * scale) / 2;
      const y = sheetH - (row + 1) * cellH + (cellH - height * scale) / 2;
      const embedded = await doc.embedPage(srcPage);
      page.drawPage(embedded, { x, y, width: width * scale, height: height * scale });
    }
  }
  return doc.save();
}

export async function addWatermark(file, text, { opacity=0.15, rotation=-45, fontSize=52, position='center' }={}) {
  const { PDFDocument, rgb, degrees, StandardFonts } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const tw = font.widthOfTextAtSize(text, fontSize);
    let x = (width - tw) / 2, y = height / 2;
    if (position==='top') { y = height - 80; }
    if (position==='bottom') { y = 60; }
    page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.6,0.6,0.6), opacity, rotate: degrees(rotation) });
  }
  return doc.save();
}

export async function addStamp(file, stamp, color='#D85A30') {
  const { PDFDocument, rgb, degrees, StandardFonts } = await lib();
  const r = parseInt(color.slice(1,3),16)/255, g = parseInt(color.slice(3,5),16)/255, b = parseInt(color.slice(5,7),16)/255;
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const fontSize = 44;
    const tw = font.widthOfTextAtSize(stamp, fontSize);
    const bw = tw + 30, bh = fontSize + 18;
    const x = (width - bw) / 2, y = (height - bh) / 2;
    page.drawRectangle({ x, y, width: bw, height: bh, borderColor: rgb(r,g,b), borderWidth: 3, color: rgb(r,g,b), opacity: 0.08 });
    page.drawText(stamp, { x: x + 15, y: y + 10, size: fontSize, font, color: rgb(r,g,b), opacity: 0.55, rotate: degrees(-15) });
  }
  return doc.save();
}

export async function addPageNumbers(file, { startFrom=1, position='bottom-center', prefix='', suffix='' }={}) {
  const { PDFDocument, rgb, StandardFonts } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  doc.getPages().forEach((page, i) => {
    const { width, height } = page.getSize();
    const label = `${prefix}${startFrom + i}${suffix}`;
    const fs = 10;
    const tw = font.widthOfTextAtSize(label, fs);
    let x = (width - tw) / 2, y = 22;
    if (position.includes('top')) y = height - 30;
    if (position.includes('left')) x = 40;
    if (position.includes('right')) x = width - tw - 40;
    page.drawText(label, { x, y, size: fs, font, color: rgb(0.4,0.4,0.4) });
  });
  return doc.save();
}

export async function addHeaderFooter(file, headerText='', footerText='') {
  const { PDFDocument, rgb, StandardFonts } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fs = 10;
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    if (headerText) {
      const tw = font.widthOfTextAtSize(headerText, fs);
      page.drawText(headerText, { x:(width-tw)/2, y:height-24, size:fs, font, color:rgb(0.35,0.35,0.35) });
      page.drawLine({ start:{x:40,y:height-30}, end:{x:width-40,y:height-30}, thickness:0.4, color:rgb(0.7,0.7,0.7) });
    }
    if (footerText) {
      const tw = font.widthOfTextAtSize(footerText, fs);
      page.drawLine({ start:{x:40,y:32}, end:{x:width-40,y:32}, thickness:0.4, color:rgb(0.7,0.7,0.7) });
      page.drawText(footerText, { x:(width-tw)/2, y:16, size:fs, font, color:rgb(0.35,0.35,0.35) });
    }
  }
  return doc.save();
}

export async function compressPDF(file) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  doc.setTitle(''); doc.setAuthor(''); doc.setSubject(''); doc.setKeywords([]);
  doc.setProducer('PDFforge'); doc.setCreator('PDFforge');
  return doc.save({ useObjectStreams:true });
}

export async function changeBackground(file, hex='#ffffff') {
  const { PDFDocument, rgb } = await lib();
  const r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    page.drawRectangle({ x:0, y:0, width, height, color:rgb(r,g,b), opacity:1 });
  }
  return doc.save();
}

export async function getMetadata(file) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const pages = doc.getPages();
  const first = pages[0];
  const { width, height } = first ? first.getSize() : { width:0, height:0 };
  return {
    title:            doc.getTitle()||'—',
    author:           doc.getAuthor()||'—',
    subject:          doc.getSubject()||'—',
    keywords:         doc.getKeywords()||'—',
    creator:          doc.getCreator()||'—',
    producer:         doc.getProducer()||'—',
    creationDate:     doc.getCreationDate()?.toLocaleDateString()||'—',
    modificationDate: doc.getModificationDate()?.toLocaleDateString()||'—',
    pageCount:        doc.getPageCount(),
    firstPageSize:    `${Math.round(width)} × ${Math.round(height)} pt`,
  };
}

export async function editMetadata(file, meta) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  if (meta.title   !== undefined) doc.setTitle(meta.title);
  if (meta.author  !== undefined) doc.setAuthor(meta.author);
  if (meta.subject !== undefined) doc.setSubject(meta.subject);
  if (meta.keywords!== undefined) doc.setKeywords([meta.keywords]);
  if (meta.creator !== undefined) doc.setCreator(meta.creator);
  return doc.save();
}

export async function removeMetadata(file) {
  return editMetadata(file, { title:'', author:'', subject:'', keywords:'', creator:'' });
}

export async function flattenPDF(file) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  try { doc.getForm().flatten(); } catch(_) {}
  return doc.save();
}

export async function protectPDF(file, userPwd, ownerPwd) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  return doc.save({
    userPassword: userPwd,
    ownerPassword: ownerPwd || userPwd + '_owner',
    permissions: { printing:'lowResolution', modifying:false, copying:false, annotating:false, fillingForms:true, contentAccessibility:true, documentAssembly:false },
  });
}

export async function unlockPDF(file) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  return doc.save();
}

export async function repairPDF(file) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true, throwOnInvalidObject:false });
  return doc.save({ useObjectStreams:true });
}

export async function fixPageSize(file, size='a4') {
  const { PDFDocument } = await lib();
  const sizes = { a4:[595.28,841.89], letter:[612,792], a3:[841.89,1190.55], legal:[612,1008], a5:[419.53,595.28] };
  const [w,h] = sizes[size]||sizes.a4;
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  doc.getPages().forEach(p => p.setSize(w, h));
  return doc.save();
}

export async function getPageDimensions(file) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  return doc.getPages().map((p, i) => {
    const { width:w, height:h } = p.getSize();
    const rot = p.getRotation().angle;
    const isA4   = Math.abs(w-595)<5 && Math.abs(h-842)<5;
    const isLetter = Math.abs(w-612)<5 && Math.abs(h-792)<5;
    return { page:i+1, width:Math.round(w), height:Math.round(h), rotation:rot, orientation: w>h?'Landscape':'Portrait', format: isA4?'A4':isLetter?'US Letter':'Custom' };
  });
}

export async function removeAnnotations(file) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  for (const page of doc.getPages()) {
    try { page.node.delete(page.node.context.obj('Annots')); } catch(_) {}
  }
  return doc.save();
}

export async function removeBlankPages(file, threshold=0.99) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const out = await PDFDocument.create();
  const total = doc.getPageCount();
  for (let i = 0; i < total; i++) {
    const content = doc.getPage(i).node.get(doc.getPage(i).node.context.obj('Contents'));
    const isBlank = !content;
    if (!isBlank) { const [p] = await out.copyPages(doc, [i]); out.addPage(p); }
  }
  if (out.getPageCount() === 0) { const [p] = await out.copyPages(doc, [0]); out.addPage(p); }
  return out.save();
}

export async function cropPDF(file, { top=0, right=0, bottom=0, left=0 }={}) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    page.setCropBox(left, bottom, width - left - right, height - top - bottom);
  }
  return doc.save();
}

export async function sanitizePDF(file) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  doc.setTitle(''); doc.setAuthor(''); doc.setSubject(''); doc.setKeywords([]); doc.setCreator(''); doc.setProducer('');
  for (const page of doc.getPages()) {
    try { page.node.delete(page.node.context.obj('Annots')); } catch(_) {}
    try { page.node.delete(page.node.context.obj('AA')); } catch(_) {}
  }
  try { doc.catalog.delete(doc.catalog.context.obj('AcroForm')); } catch(_) {}
  try { doc.catalog.delete(doc.catalog.context.obj('Names')); } catch(_) {}
  return doc.save();
}

export async function signPDF(file, signatureDataUrl, { x=100, y=100, pageNum=0, w=180, h=60 }={}) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  const base64 = signatureDataUrl.split(',')[1];
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const img = await doc.embedPng(bytes);
  const page = doc.getPage(Math.min(pageNum, doc.getPageCount()-1));
  const { height } = page.getSize();
  page.drawImage(img, { x, y: height - y - h, width: w, height: h });
  return doc.save();
}

export async function redactPDF(file, regions) {
  const { PDFDocument, rgb } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  for (const { page:pg, x, y, w, h } of regions) {
    const page = doc.getPage(Math.min(pg, doc.getPageCount()-1));
    const { height } = page.getSize();
    page.drawRectangle({ x, y: height-y-h, width:w, height:h, color:rgb(0,0,0) });
  }
  return doc.save();
}

export async function imageToPDF(files) {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const mime  = file.type;
    let img;
    if (mime === 'image/jpeg' || mime === 'image/jpg') {
      img = await doc.embedJpg(bytes);
    } else {
      // Convert to PNG via canvas for other formats
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      const el = new Image();
      await new Promise((res, rej) => { el.onload=res; el.onerror=rej; el.src=url; });
      const cv = document.createElement('canvas');
      cv.width = el.naturalWidth; cv.height = el.naturalHeight;
      cv.getContext('2d').drawImage(el, 0, 0);
      const pngBytes = await new Promise(res => cv.toBlob(b => b.arrayBuffer().then(res), 'image/png'));
      img = await doc.embedPng(pngBytes);
      URL.revokeObjectURL(url);
    }
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x:0, y:0, width:img.width, height:img.height });
  }
  return doc.save();
}

export async function txtToPDF(file) {
  const { PDFDocument, StandardFonts, rgb } = await lib();
  const text = await file.text();
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Courier);
  const pW = 595, pH = 842, margin = 50, fs = 11, lh = 15;
  const lines = [];
  for (const rawLine of text.split('\n')) {
    const maxChars = Math.floor((pW - 2*margin) / (fs * 0.55));
    if (rawLine.length <= maxChars) { lines.push(rawLine); continue; }
    for (let i = 0; i < rawLine.length; i += maxChars) lines.push(rawLine.slice(i, i+maxChars));
  }
  let page = doc.addPage([pW, pH]);
  let y = pH - margin;
  for (const line of lines) {
    if (y < margin) { page = doc.addPage([pW, pH]); y = pH - margin; }
    page.drawText(line, { x:margin, y, size:fs, font, color:rgb(0.1,0.1,0.1) });
    y -= lh;
  }
  return doc.save();
}

export async function markdownToPDF(file) {
  const raw = await file.text();
  // Simple markdown → plain text with headings
  const text = raw
    .replace(/^#{1,6}\s+/gm, (m) => m.replace(/#/g,'').trim().toUpperCase() + '\n' + '─'.repeat(40) + '\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[-*+]\s+/gm, '  • ')
    .replace(/^>\s+/gm, '  | ');
  const fakeFile = new File([text], file.name.replace(/\.md$/,'.txt'), { type:'text/plain' });
  return txtToPDF(fakeFile);
}

export async function pdfToZip(files) {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  for (const f of files) zip.file(f.name, f);
  return zip.generateAsync({ type:'uint8array', compression:'DEFLATE', compressionOptions:{ level:6 } });
}

export async function convertToPdfA(file) {
  // Best-effort: pdf-lib can't fully convert to PDF/A-3b but can set the version marker
  const { PDFDocument, PDFName, PDFString } = await lib();
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:true });
  // Set creator/producer metadata for archival intent
  doc.setCreator('PDFforge — PDF/A Export');
  doc.setProducer('PDFforge');
  return doc.save({ useObjectStreams: false }); // PDF/A requires no object streams
}

export async function comparePDFs(fileA, fileB) {
  // Returns page count and metadata diff for now
  const { PDFDocument } = await lib();
  const [docA, docB] = await Promise.all([fileA, fileB].map(async f => PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption:true })));
  return {
    fileA: { name:fileA.name, pages:docA.getPageCount(), title:docA.getTitle()||'—' },
    fileB: { name:fileB.name, pages:docB.getPageCount(), title:docB.getTitle()||'—' },
    pageCountMatch: docA.getPageCount() === docB.getPageCount(),
  };
}

export function download(bytes, filename, mime='application/pdf') {
  const blob = new Blob([bytes], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadMulti(results) {
  results.forEach(({ bytes, name }, i) => {
    setTimeout(() => download(bytes, name), i * 400);
  });
}
