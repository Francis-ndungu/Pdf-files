import "./globals.css";
export const metadata = {
  title: { default:"PDFforge — Free PDF Tools", template:"%s | PDFforge" },
  description:"90+ professional PDF tools. No login. No uploads. Runs entirely in your browser.",
  keywords:["PDF converter","PDF editor","merge PDF","compress PDF","OCR","free PDF tools"],
  openGraph:{ title:"PDFforge", description:"Professional PDF tools, free forever.", type:"website" },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
