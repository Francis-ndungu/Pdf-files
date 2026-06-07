
import { getToolBySlug, ALL_TOOLS } from "@/lib/tools";
import ToolClient from "./ToolClient";
import Navbar from "@/components/Navbar";

export function generateStaticParams() {
  return ALL_TOOLS.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };
  return { title: `${tool.name} | PDFforge`, description: tool.desc };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#183438"}}>
      <div style={{textAlign:"center",color:"#8fb3b8"}}>
        <div style={{fontSize:48,marginBottom:16}}>🔍</div>
        <h1 style={{color:"#fff",marginBottom:8}}>Tool not found</h1>
        <a href="/tools" style={{color:"#E07050"}}>← Back to all tools</a>
      </div>
    </div>
  );
  return (
    <>
      <Navbar />
      <ToolClient tool={tool} />
    </>
  );
}
