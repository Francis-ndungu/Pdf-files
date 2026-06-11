
/**
 * Converters — PDF rendering, OCR, text extraction, Word conversion
 * Uses pdfjs-dist + tesseract.js + mammoth
 */

let _pdfjsLib = null;
async function pdfjsLib() {
  if (_pdfjsLib) return _pdfjsLib;
  const lib = await import('pdfjs-dist');
  lib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`;
  _pdfjsLib = lib;
  return lib;
}

/** Render every page → array of {dataUrl, width, height, page} */
export async function pdfToImages(file, format='jpeg', scale=2, onProgress) {
  const pdfjs = await pdfjsLib();
  const bytes  = await file.arrayBuffer();
  const pdf    = await pdfjs.getDocument({ data: new Uint8Array(bytes) }).promise;
  const results = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page     = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas   = document.createElement('canvas');
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx      = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    const mimeType  = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl   = canvas.toDataURL(mimeType, 0.92);
    const response  = await fetch(dataUrl);
    const blob      = await response.blob();
    const ab        = await blob.arrayBuffer();
    results.push({ bytes: new Uint8Array(ab), name: `page_${i}.${format}`, width: viewport.width, height: viewport.height });
    onProgress?.(Math.round((i / pdf.numPages) * 100));
  }
  return results;
}

/** Extract text from every page */
export async function pdfToText(file, onProgress) {
  const pdfjs = await pdfjsLib();
  const bytes = await file.arrayBuffer();
  const pdf   = await pdfjs.getDocument({ data: new Uint8Array(bytes) }).promise;
  let out = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lines   = [];
    let lastY = null;
    for (const item of content.items) {
      if ('str' in item) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) lines.push('');
        lines.push(item.str);
        lastY = item.transform[5];
      }
    }
    out += `\n--- Page ${i} ---\n${lines.join(' ')}\n`;
    onProgress?.(Math.round((i / pdf.numPages) * 100));
  }
  return out.trim();
}

/** Extract text and format as HTML */
export async function pdfToHTML(file, onProgress) {
  const text = await pdfToText(file, onProgress);
  const escaped = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<title>Extracted from ${file.name}</title>
<style>body{font-family:sans-serif;max-width:800px;margin:40px auto;line-height:1.8;color:#222}
hr{border:1px solid #ddd;margin:24px 0}pre{white-space:pre-wrap}</style>
</head><body><pre>${escaped}</pre></body></html>`;
}

/** Extract text and format as CSV (paragraph-per-row) */
export async function pdfToCSV(file, onProgress) {
  const text = await pdfToText(file, onProgress);
  const rows = text.split('\n').filter(Boolean).map(l => `"${l.replace(/"/g,'""')}"`);
  return rows.join('\n');
}

/** Best-effort PDF to Word (extracts text into a structured text doc) */
export async function pdfToWord(file, onProgress) {
  const text = await pdfToText(file, onProgress);
  // Return as plain text with .txt extension (proper DOCX needs server-side tooling)
  return { text, note: 'Extracted as plain text — full DOCX conversion requires LibreOffice WASM (Pro).' };
}

/** Word (DOCX) to PDF via mammoth → HTML → canvas → pdf-lib */
export async function wordToPDF(file, onProgress) {
  const mammoth = await import('mammoth');
  const bytes   = await file.arrayBuffer();
  onProgress?.(20);
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: bytes });
  onProgress?.(50);

  // Render HTML in a hidden iframe, capture via canvas
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  const doc  = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const bold = await doc.embedFont(StandardFonts.TimesRomanBold);

  // Parse HTML → structured text blocks
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const blocks = [];
  const walk = (node) => {
    if (node.nodeType === 3) {
      const t = node.textContent.trim();
      if (t) blocks.push({ text: t, bold: false, heading: false, indent: 0 });
    } else if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      if (['h1','h2','h3'].includes(tag)) {
        blocks.push({ text: node.textContent.trim(), bold: true, heading: true, size: tag==='h1'?18:tag==='h2'?15:13 });
      } else if (tag === 'p' || tag === 'div') {
        const t = node.textContent.trim();
        if (t) blocks.push({ text: t, bold: false, heading: false });
      } else if (tag === 'li') {
        blocks.push({ text: '• ' + node.textContent.trim(), bold: false, heading: false, indent: 20 });
      } else {
        for (const child of node.childNodes) walk(child);
        return;
      }
    }
  };
  for (const child of tmp.childNodes) walk(child);
  onProgress?.(70);

  const pW = 595, pH = 842, margin = 60;
  let page = doc.addPage([pW, pH]);
  let y = pH - margin;

  for (const block of blocks) {
    const fs   = block.heading ? (block.size || 14) : 11;
    const lh   = fs * 1.6;
    const f    = block.bold ? bold : font;
    const maxW = pW - 2*margin - (block.indent||0);
    const maxCh = Math.floor(maxW / (fs * 0.52));
    const words = block.text.split(' ');
    let line = '';
    for (const word of words) {
      if ((line + word).length > maxCh) {
        if (y < margin + lh) { page = doc.addPage([pW, pH]); y = pH - margin; }
        page.drawText(line.trim(), { x: margin + (block.indent||0), y, size:fs, font:f, color:rgb(0.05,0.05,0.1) });
        y -= lh; line = word + ' ';
      } else { line += word + ' '; }
    }
    if (line.trim()) {
      if (y < margin + lh) { page = doc.addPage([pW, pH]); y = pH - margin; }
      page.drawText(line.trim(), { x: margin + (block.indent||0), y, size:fs, font:f, color:rgb(0.05,0.05,0.1) });
      y -= lh;
    }
    if (block.heading) y -= 6;
    y -= 4;
  }
  onProgress?.(100);
  return doc.save();
}

/** OCR: render pages → tesseract → embed text layer */
export async function ocrPDF(file, lang='eng', onProgress) {
  const pdfjs   = await pdfjsLib();
  const { createWorker } = await import('tesseract.js');
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

  const bytes = await file.arrayBuffer();
  const pdf   = await pdfjs.getDocument({ data: new Uint8Array(bytes) }).promise;
  const worker = await createWorker(lang);

  const outDoc = await PDFDocument.create();
  const font   = await outDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(Math.round(((i-1) / pdf.numPages) * 90));
    const page     = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas   = document.createElement('canvas');
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

    // Embed page image
    const dataUrl  = canvas.toDataURL('image/jpeg', 0.85);
    const imgBytes = await (await fetch(dataUrl)).arrayBuffer();
    const img      = await outDoc.embedJpg(imgBytes);
    const outPage  = outDoc.addPage([viewport.width / 2, viewport.height / 2]);
    outPage.drawImage(img, { x:0, y:0, width: viewport.width/2, height: viewport.height/2 });

    // Run OCR and overlay invisible text
    const { data: { words } } = await worker.recognize(canvas);
    for (const w of words) {
      if (!w.text.trim()) continue;
      const { x0, y0, x1, y1 } = w.bbox;
      const ww = (x1 - x0) / 2, wh = (y1 - y0) / 2;
      const wx = x0 / 2, wy = viewport.height/2 - y1/2;
      const fs = Math.max(4, wh * 0.9);
      try {
        outPage.drawText(w.text, { x: wx, y: wy, size: fs, font, color: rgb(0,0,0), opacity: 0 });
      } catch(_) {}
    }
  }

  await worker.terminate();
  onProgress?.(100);
  return outDoc.save();
}

export function downloadBlob(bytes, filename, mime='application/pdf') {
  const blob = new Blob([bytes], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href:url, download:filename });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
