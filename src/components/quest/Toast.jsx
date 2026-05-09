function Toast({msg,show}) {
  const isErr=msg&&msg.startsWith("");
  return (
    <div style={{position:"fixed",bottom:24,right:24,background:"#1e2130",border:`2px solid ${isErr?"#dc2626":"#16a34a"}`,boxShadow:"0 4px 16px rgba(92,60,30,.12)",borderRadius:12,padding:"14px 20px",fontSize:14,color:isErr?"#991b1b":"#14532d",fontFamily:"'Nunito',sans-serif",fontWeight:800,zIndex:1000,display:"flex",alignItems:"center",gap:10,transform:show?"translateY(0)":"translateY(100px)",opacity:show?1:0,transition:"all .3s"}}>{msg}</div>
  );
}

/* ─────────────── MAIN APP ─────────────── */

export default Toast;
