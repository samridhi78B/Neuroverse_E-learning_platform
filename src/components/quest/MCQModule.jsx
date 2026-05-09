import { useEffect } from 'react';
import { Btn } from './UIComponents';

function MCQModule({questions,mcqState,onAnswer,onNav,badgeColor="amber",badgeText="KNOWLEDGE CHECK",onComplete}) {
  const {current,score,answered}=mcqState;
  // Guard: questions may be undefined while data loads
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const q = safeQuestions[current];

  // Call onComplete in an effect, not during render
  useEffect(() => {
    if (!q && safeQuestions.length > 0) {
      onComplete(score);
    }
  }, [q, safeQuestions.length, score, onComplete]);

  if (!q) return null;
  const badgeStyles={
    amber:{color:"#60a5fa",background:"#0f1a2e",border:"2px solid #3b82f6"},
    cyan:{color:"#60a5fa",background:"#0f1a2e",border:"2px solid #3b82f6"},
    purple:{color:"#93c5fd",background:"#0f1117",border:"2px solid #d4b896"},
    yellow:{color:"#6366f1",background:"#080f1e",border:"2px solid #4f46e5"},
  };
  const bs=badgeStyles[badgeColor]||badgeStyles.amber;
  return (
    <div style={{background:"#1e2130",border:"2px solid #2e3347",borderRadius:20,padding:32,margin:"8px 0",boxShadow:"0 4px 16px rgba(0,0,0,.35)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12,letterSpacing:.5,fontWeight:800,textTransform:"uppercase",...bs,padding:"5px 14px",borderRadius:999}}>{badgeText}</div>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:"#7c8499",fontWeight:700}}>Q {current+1} / {safeQuestions.length}</div>
      </div>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:19,color:"#e8e0d5",marginBottom:22,lineHeight:1.4}}>{q.q}</div>
      <div style={{display:"grid",gap:10,marginBottom:20}}>
        {(q.opts||[]).map((opt,i)=>{
          let borderColor="#2e3347",bg="#161926",color="#e8e0d5",shadow="0 2px 0 #0a0c14";
          if(answered){
            if(i===q.ans){borderColor="#22c55e";bg="#0f1f14";color="#4ade80";shadow="0 2px 0 #15803d";}
            else if(i===mcqState.selected&&i!==q.ans){borderColor="#f87171";bg="#1f0a0a";color="#fca5a5";shadow="none";}
          }
          return (
            <div key={i} className={!answered?"mcq-opt-hover":""} onClick={!answered?()=>onAnswer(i):undefined}
              style={{padding:"14px 18px",border:`2px solid ${borderColor}`,borderRadius:14,background:bg,cursor:answered?"default":"pointer",fontSize:15,display:"flex",alignItems:"center",gap:12,color,transition:"all .2s",fontWeight:600,boxShadow:shadow}}>
              <div style={{width:30,height:30,borderRadius:8,background:i===q.ans&&answered?"#22c55e":i===mcqState.selected&&answered&&i!==q.ans?"#f87171":"#0f1a2e",border:`2px solid ${i===q.ans&&answered?"#22c55e":i===mcqState.selected&&answered&&i!==q.ans?"#f87171":"#3b82f6"}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Fredoka One',cursive",fontSize:13,flexShrink:0,color:((i===q.ans||i===mcqState.selected)&&answered)?"#0f1117":"#60a5fa",fontWeight:400}}>{"ABCD"[i]}</div>
              {opt}
            </div>
          );
        })}
      </div>
      {answered&&(
        <div style={{padding:"14px 18px",borderRadius:12,fontSize:14,marginBottom:18,background:mcqState.selected===q.ans?"#0f1f14":"#1f0a0a",border:`2px solid ${mcqState.selected===q.ans?"#22c55e":"#f87171"}`,color:mcqState.selected===q.ans?"#4ade80":"#fca5a5",fontWeight:700}}>
          {mcqState.selected===q.ans?"Correct! ":"Not quite. "}{q.exp}
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <Btn variant="secondary" onClick={()=>onNav(-1)} disabled={current===0}>← Prev</Btn>
        <Btn variant={badgeColor==="purple"?"purple":"primary"} onClick={()=>onNav(1)} disabled={!answered}>Next →</Btn>
      </div>
    </div>
  );
}

/* ─────────────── TABLE VISUAL ─────────────── */

export default MCQModule;
