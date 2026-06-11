
import Link from "next/link";
import { FileQuestion } from "lucide-react";
export default function NotFound() {
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#183438",flexDirection:"column",textAlign:"center",padding:"40px var(--pad)"}}>
      <FileQuestion size={56} color="#2a5259" strokeWidth={1} style={{marginBottom:24}} />
      <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,4vw,44px)",fontWeight:400,color:"#f0f9fa",marginBottom:10}}>Page not found</h1>
      <p style={{fontSize:15,color:"#8fb3b8",marginBottom:32,maxWidth:380}}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        <Link href="/" style={{padding:"11px 24px",background:"#D85A30",borderRadius:9,color:"#fff",textDecoration:"none",fontSize:14,fontWeight:500}}>Browse all tools</Link>
        <Link href="/" style={{padding:"11px 24px",border:"1px solid #2a5259",borderRadius:9,color:"#8fb3b8",textDecoration:"none",fontSize:14}}>Go home</Link>
      </div>
    </div>
  );
}
