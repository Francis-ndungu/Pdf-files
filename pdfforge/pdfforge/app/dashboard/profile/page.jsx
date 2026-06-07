
"use client";
export default function ProfilePage() {
  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100vh" }}>
      <div style={{ background:"#1e3d41",borderBottom:"1px solid #2a5259",padding:"0 24px",height:52,display:"flex",alignItems:"center" }}>
        <span style={{ fontSize:16,fontWeight:500,color:"#e8f4f5" }}>Profile</span>
      </div>
      <div style={{ flex:1,padding:40,overflowY:"auto",background:"#183438",display:"flex",alignItems:"center",justifyContent:"center" }}>
        <div style={{ textAlign:"center",color:"#8fb3b8" }}>
          <div style={{ fontSize:48,marginBottom:16 }}>👤</div>
          <h2 style={{ fontFamily:"var(--serif)",fontSize:32,fontWeight:400,color:"#fff",marginBottom:8 }}>Profile</h2>
          <p style={{ fontSize:14,color:"#8fb3b8",marginBottom:24 }}>Manage your account details</p>
          <div style={{ background:"#1a3b3f",border:"1px solid #2a5259",borderRadius:10,padding:"24px 32px",maxWidth:400,textAlign:"left" }}>
            <div style={{ fontSize:12,color:"#4a7a80",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:16 }}>Coming soon</div>
            <p style={{ fontSize:13,color:"#8fb3b8",lineHeight:1.7 }}>Full profile management will be available in the next update. This page will include account details, API keys, notification preferences, and billing settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
