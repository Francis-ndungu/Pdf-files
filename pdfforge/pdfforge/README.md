# PDFforge — Professional PDF Suite

## Deploy to Vercel

1. Push this project to a GitHub repository
2. Import into Vercel (vercel.com/new)
3. Framework: Next.js (auto-detected)
4. Click Deploy

All COOP/COEP headers are pre-configured in `vercel.json` for LibreOffice WASM support.

## Local development

```bash
npm install
npm run dev
```

## Tech stack
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 3
- pdf-lib (client-side PDF processing)
- pdfjs-dist (PDF rendering)
- Tesseract.js (OCR)
- Zustand (state management)
- Lucide React (icons)
