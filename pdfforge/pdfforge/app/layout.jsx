import "./globals.css";

export const metadata = {
  title: { default: "PDFforge — Professional PDF Suite", template: "%s | PDFforge" },
  description: "90+ professional PDF tools. Convert, compress, merge, sign and transform any document — fast, private, and free to start.",
  keywords: ["PDF converter","merge PDF","compress PDF","PDF editor","OCR","sign PDF","PDF tools"],
  openGraph: { title: "PDFforge", description: "Professional PDF tools for everyone", type: "website" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
