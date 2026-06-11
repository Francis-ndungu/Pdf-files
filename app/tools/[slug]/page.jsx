
import { TOOLS } from "@/lib/tools";
import ToolClient from "./ToolClient";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return TOOLS.map(t => ({ slug: t.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = TOOLS.find(x => x.slug === slug);
  if (!t) return { title:"Tool not found" };
  return { title: t.name, description: t.desc };
}
export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = TOOLS.find(t => t.slug === slug);
  if (!tool) notFound();
  return (
    <>
      <Navbar />
      <ToolClient tool={tool} allTools={TOOLS} />
    </>
  );
}
