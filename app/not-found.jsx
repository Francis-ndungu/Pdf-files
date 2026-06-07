
import Link from "next/link";
export default function NotFound() {
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#183438",flexDirection:"column",textAlign:"center",padding:40}}>
      <div style={{fontFamily:"var(--serif)",fontSize:120,fontWeight:400,color:"rgba(216,90,48,0.2)",lineHeight:1,marginBottom:16}}>404</div>
      <h1 style={{fontFamily:"var(--serif)",fontSize:36,fontWeight:400,color:"#fff",marginBottom:12}}>Page not found</h1>
      <p style={{fontSize:15,color:"#8fb3b8",marginBottom:32,maxWidth:400}}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{display:"flex",gap:12}}>
        <Link href="/" style={{padding:"12px 24px",background:"#D85A30",borderRadius:8,color:"#fff",textDecoration:"none",fontSize:14,fontWeight:500}}>Go home</Link>
        <Link href="/tools" style={{padding:"12px 24px",border:"1px solid #3a6570",borderRadius:8,color:"#e8f4f5",textDecoration:"none",fontSize:14}}>Browse tools</Link>
      </div>
    </div>
  );
}
