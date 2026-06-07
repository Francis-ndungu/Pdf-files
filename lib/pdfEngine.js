
/**
 * PDFforge Client-Side Engine
 * Uses pdf-lib for PDF manipulation operations.
 * All processing happens in the browser — files never leave the device.
 */

export async function loadPdfLib() {
  const { PDFDocument, degrees, rgb, StandardFonts, PageSizes } = await import('pdf-lib');
  return { PDFDocument, degrees, rgb, StandardFonts, PageSizes };
}

/** Merge multiple PDFs into one */
export async function mergePDFs(files) {
  const { PDFDocument } = await loadPdfLib();
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  return await merged.save();
}

/** Split PDF into separate files by page */
export async function splitPDF(file, ranges) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();
  const results = [];
  for (const range of ranges) {
    const doc = await PDFDocument.create();
    const pageNums = range === 'all'
      ? Array.from({ length: total }, (_, i) => i)
      : range.map(n => Math.min(Math.max(0, n - 1), total - 1));
    const copied = await doc.copyPages(src, pageNums);
    copied.forEach(p => doc.addPage(p));
    results.push(await doc.save());
  }
  return results;
}

/** Extract specific pages */
export async function extractPages(file, pageNumbers) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const doc = await PDFDocument.create();
  const indices = pageNumbers.map(n => n - 1).filter(i => i >= 0 && i < src.getPageCount());
  const pages = await doc.copyPages(src, indices);
  pages.forEach(p => doc.addPage(p));
  return await doc.save();
}

/** Delete specific pages */
export async function deletePages(file, pageNumbers) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const doc = await PDFDocument.create();
  const toDelete = new Set(pageNumbers.map(n => n - 1));
  const keep = src.getPageIndices().filter(i => !toDelete.has(i));
  const pages = await doc.copyPages(src, keep);
  pages.forEach(p => doc.addPage(p));
  return await doc.save();
}

/** Rotate pages */
export async function rotatePages(file, angleDeg, pageNumbers) {
  const { PDFDocument, degrees } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = doc.getPageCount();
  const targets = pageNumbers === 'all'
    ? Array.from({ length: total }, (_, i) => i)
    : pageNumbers.map(n => n - 1);
  targets.forEach(i => {
    if (i >= 0 && i < total) {
      const page = doc.getPage(i);
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angleDeg) % 360));
    }
  });
  return await doc.save();
}

/** Reverse page order */
export async function reversePages(file) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const doc = await PDFDocument.create();
  const indices = src.getPageIndices().reverse();
  const pages = await doc.copyPages(src, indices);
  pages.forEach(p => doc.addPage(p));
  return await doc.save();
}

/** Add blank pages */
export async function addBlankPage(file, afterPage, width = 595, height = 842) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const page = doc.insertPage(afterPage, [width, height]);
  return await doc.save();
}

/** Add watermark text */
export async function addWatermark(file, text, options = {}) {
  const { PDFDocument, rgb, degrees, StandardFonts } = await loadPdfLib();
  const { opacity = 0.15, fontSize = 48, color = { r: 0.7, g: 0.7, b: 0.7 }, rotation = -45, position = 'center' } = options;
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    let x = (width - textWidth) / 2, y = height / 2;
    if (position === 'top-left') { x = 40; y = height - 80; }
    if (position === 'bottom-right') { x = width - textWidth - 40; y = 40; }
    page.drawText(text, { x, y, size: fontSize, font, color: rgb(color.r, color.g, color.b), opacity, rotate: degrees(rotation) });
  }
  return await doc.save();
}

/** Add page numbers */
export async function addPageNumbers(file, options = {}) {
  const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();
  const { startFrom = 1, position = 'bottom-center', fontSize = 11, prefix = '', suffix = '' } = options;
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    const label = `${prefix}${startFrom + i}${suffix}`;
    const textW = font.widthOfTextAtSize(label, fontSize);
    let x = (width - textW) / 2, y = 24;
    if (position === 'top-center') y = height - 30;
    if (position === 'bottom-left') { x = 40; }
    if (position === 'bottom-right') { x = width - textW - 40; }
    page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) });
  });
  return await doc.save();
}

/** Add header and footer */
export async function addHeaderFooter(file, header, footer, options = {}) {
  const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();
  const { fontSize = 10 } = options;
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    if (header) {
      const tw = font.widthOfTextAtSize(header, fontSize);
      page.drawText(header, { x: (width - tw) / 2, y: height - 25, size: fontSize, font, color: rgb(0.3,0.3,0.3) });
    }
    if (footer) {
      const tw = font.widthOfTextAtSize(footer, fontSize);
      page.drawText(footer, { x: (width - tw) / 2, y: 15, size: fontSize, font, color: rgb(0.3,0.3,0.3) });
    }
  }
  return await doc.save();
}

/** Compress PDF (removes metadata, optimises streams) */
export async function compressPDF(file) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  // Remove metadata to reduce size
  src.setTitle('');
  src.setAuthor('');
  src.setSubject('');
  src.setKeywords([]);
  src.setProducer('PDFforge');
  src.setCreator('PDFforge');
  return await src.save({ useObjectStreams: true });
}

/** Protect PDF with password */
export async function protectPDF(file, userPassword, ownerPassword) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return await doc.save({
    userPassword,
    ownerPassword: ownerPassword || userPassword,
    permissions: {
      printing: 'lowResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: false,
    },
  });
}

/** Remove metadata */
export async function removeMetadata(file) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('');
  doc.setCreator('');
  return await doc.save();
}

/** View metadata */
export async function getMetadata(file) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return {
    title: doc.getTitle() || '',
    author: doc.getAuthor() || '',
    subject: doc.getSubject() || '',
    keywords: doc.getKeywords() || '',
    creator: doc.getCreator() || '',
    producer: doc.getProducer() || '',
    creationDate: doc.getCreationDate()?.toISOString() || '',
    modificationDate: doc.getModificationDate()?.toISOString() || '',
    pageCount: doc.getPageCount(),
  };
}

/** Edit metadata */
export async function editMetadata(file, meta) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  if (meta.title !== undefined) doc.setTitle(meta.title);
  if (meta.author !== undefined) doc.setAuthor(meta.author);
  if (meta.subject !== undefined) doc.setSubject(meta.subject);
  if (meta.keywords !== undefined) doc.setKeywords([meta.keywords]);
  if (meta.creator !== undefined) doc.setCreator(meta.creator);
  return await doc.save();
}

/** Image to PDF */
export async function imageToPDF(files) {
  const { PDFDocument } = await loadPdfLib();
  const doc = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const mime = file.type;
    let img;
    if (mime === 'image/jpeg' || mime === 'image/jpg') {
      img = await doc.embedJpg(bytes);
    } else if (mime === 'image/png') {
      img = await doc.embedPng(bytes);
    } else {
      // Convert to PNG via canvas
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      const imgEl = new Image();
      await new Promise((res, rej) => { imgEl.onload = res; imgEl.onerror = rej; imgEl.src = url; });
      const canvas = document.createElement('canvas');
      canvas.width = imgEl.naturalWidth; canvas.height = imgEl.naturalHeight;
      canvas.getContext('2d').drawImage(imgEl, 0, 0);
      const pngBytes = await new Promise(res => canvas.toBlob(b => b.arrayBuffer().then(res), 'image/png'));
      img = await doc.embedPng(pngBytes);
      URL.revokeObjectURL(url);
    }
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  return await doc.save();
}

/** Flatten PDF (annotations + forms → static) */
export async function flattenPDF(file) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = doc.getForm();
  try { form.flatten(); } catch (e) { /* no forms */ }
  return await doc.save();
}

/** Fix / repair PDF */
export async function repairPDF(file) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, throwOnInvalidObject: false });
  return await doc.save();
}

/** Fix page size */
export async function fixPageSize(file, targetSize = [595.28, 841.89]) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  doc.getPages().forEach(page => page.setSize(...targetSize));
  return await doc.save();
}

/** Remove annotations */
export async function removeAnnotations(file) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  for (const page of doc.getPages()) {
    const annots = page.node.get(page.node.context.obj('Annots'));
    if (annots) page.node.delete(page.node.context.obj('Annots'));
  }
  return await doc.save();
}

/** PDF to ZIP (multiple PDFs → single archive) */
export async function pdfToZip(files) {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file);
  }
  return await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

/** Organise / reorder pages */
export async function organisePDF(file, newOrder) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const doc = await PDFDocument.create();
  const indices = newOrder.map(n => n - 1);
  const pages = await doc.copyPages(src, indices);
  pages.forEach(p => doc.addPage(p));
  return await doc.save();
}

/** Background colour */
export async function changeBackgroundColor(file, r, g, b) {
  const { PDFDocument, rgb } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(r/255, g/255, b/255), opacity: 1 });
  }
  return await doc.save();
}

/** Page dimensions report */
export async function pageDimensions(file) {
  const { PDFDocument } = await loadPdfLib();
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPages().map((p, i) => {
    const { width, height } = p.getSize();
    const rot = p.getRotation().angle;
    return { page: i + 1, width: Math.round(width), height: Math.round(height), rotation: rot,
      orientation: width > height ? 'Landscape' : 'Portrait',
      size: Math.abs(width - 595) < 10 && Math.abs(height - 842) < 10 ? 'A4' : Math.abs(width - 612) < 10 && Math.abs(height - 792) < 10 ? 'US Letter' : 'Custom' };
  });
}

/** Download helper */
export function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
