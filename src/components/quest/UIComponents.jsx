import { useState } from 'react';

function Btn({children,variant="primary",onClick,disabled,style={}}) {
  const base={padding:"12px 24px",borderRadius:12,border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"'Nunito',sans-serif",fontSize:15,fontWeight:800,letterSpacing:.2,display:"inline-flex",alignItems:"center",gap:8,opacity:disabled?.4:1,transition:"all .18s cubic-bezier(.34,1.56,.64,1)",...style};
  const variants={
    primary:{background:"#3b82f6",color:"#e8e0d5",boxShadow:disabled?"none":"0 4px 0 #2563eb"},
    secondary:{background:"#1e2130",border:"2px solid #2e3347",color:"#7c8499",boxShadow:disabled?"none":"0 3px 0 #0a0c14"},
    green:{background:"#22c55e",color:"#0f1117",boxShadow:disabled?"none":"0 4px 0 #15803d"},
    purple:{background:"#3b82f6",color:"#0f1117",boxShadow:disabled?"none":"0 4px 0 #1d4ed8"},
    ghost:{background:"transparent",border:"2px dashed #3d4460",color:"#3b82f6"},
  };
  return (
    <button style={{...base,...variants[variant]}} onClick={!disabled?onClick:undefined} disabled={disabled}
      onMouseEnter={e=>{if(!disabled){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.filter="brightness(1.05)";}}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.filter="";}}
      onMouseDown={e=>{if(!disabled)e.currentTarget.style.transform="translateY(1px)";}}
      onMouseUp={e=>{if(!disabled)e.currentTarget.style.transform="translateY(-2px)";}}
    >{children}</button>
  );
}

function HBox({children,type="amber",style={}}) {
  const types={
    amber:{borderColor:"#3b82f6",bl:"4px solid #3b82f6",background:"#0f1a2e",color:"#60a5fa"},
    brown:{borderColor:"#3d4460",bl:"4px solid #1d4ed8",background:"#0f1117",color:"#93c5fd"},
    green:{borderColor:"#16a34a",bl:"4px solid #16a34a",background:"#0f1f14",color:"#4ade80"},
    red:{borderColor:"#dc2626",bl:"4px solid #dc2626",background:"#1f0a0a",color:"#fca5a5"},
    orange:{borderColor:"#4f46e5",bl:"4px solid #4f46e5",background:"#080f1e",color:"#6366f1"},
    cyan:{borderColor:"#3b82f6",bl:"4px solid #3b82f6",background:"#0f1a2e",color:"#60a5fa"},
    purple:{borderColor:"#1d4ed8",bl:"4px solid #1d4ed8",background:"#0f1117",color:"#93c5fd"},
    yellow:{borderColor:"#4f46e5",bl:"4px solid #4f46e5",background:"#080f1e",color:"#6366f1"},
  };
  const t=types[type]||types.amber;
  return <div style={{border:`1px solid ${t.borderColor}`,borderLeft:t.bl,background:t.background,color:t.color,borderRadius:12,padding:"14px 18px",margin:"16px 0",fontSize:14,lineHeight:1.7,fontWeight:600,...style}}>{children}</div>;
}

function SectionBadge({children,color="amber"}) {
  const cols={
    amber:{color:"#60a5fa",borderColor:"#3b82f6",background:"#0f1a2e"},
    brown:{color:"#93c5fd",borderColor:"#3d4460",background:"#0f1117"},
    purple:{color:"#93c5fd",borderColor:"#3d4460",background:"#0f1117"},
  };
  const c=cols[color]||cols.amber;
  return <div style={{display:"inline-flex",alignItems:"center",gap:8,fontFamily:"'Nunito',sans-serif",fontSize:12,letterSpacing:.5,textTransform:"uppercase",fontWeight:800,...c,border:`2px solid ${c.borderColor}`,padding:"5px 16px",borderRadius:999,marginBottom:20}}>{children}</div>;
}

function ConceptTitle({children,size=28}) {
  return <div style={{fontFamily:"'Fredoka One',cursive",fontSize:Math.min(size,window.innerWidth<600?22:size),color:"#e8e0d5",marginBottom:16,lineHeight:1.25,letterSpacing:.3}}>{children}</div>;
}

function CodeBlock({children}) {
  return <div style={{background:"#0a0c12",border:"2px solid #2e3347",borderRadius:14,padding:"20px",fontFamily:"'JetBrains Mono',monospace",fontSize:13,lineHeight:1.9,overflowX:"auto",margin:"14px 0",whiteSpace:"pre",boxShadow:"0 4px 12px rgba(0,0,0,.5)"}} dangerouslySetInnerHTML={{__html:children}}/>;
}

function StepCompleteBanner({children}) {
  return <div style={{background:"#0f1f14",border:"2px solid #16a34a",borderRadius:12,padding:"14px 18px",color:"#4ade80",fontSize:14,display:"flex",alignItems:"center",gap:10,marginTop:16,fontWeight:700}}>{children}</div>;
}

function ReadBtn({done,onConfirm}) {
  if (done) return <StepCompleteBanner>Marked as complete!</StepCompleteBanner>;
  return <button className="read-btn-base" onClick={onConfirm} style={{padding:"12px 28px",borderRadius:12,border:"2px dashed #3d4460",background:"#161926",color:"#3b82f6",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontSize:14,fontWeight:800,marginTop:12,transition:"all .2s",display:"inline-flex",alignItems:"center",gap:8}}>Mark as Read &amp; Continue</button>;
}

function BottomNav({step,total,canNext,onPrev,onNext,nextLabel="Next →"}) {
  const isFirst=step===0,isLast=step>=total-1;
  return (
    <div className="bottom-nav-wrap" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:48,paddingTop:24,borderTop:"2px dashed #2e3347",gap:12,flexWrap:"wrap"}}>
      <Btn variant="secondary" onClick={onPrev} disabled={isFirst}>← Previous</Btn>
      <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:"#7c8499",textAlign:"center",flex:1,fontWeight:700}}>Step {step+1} of {total}</div>
      {!isLast && <Btn variant="primary" onClick={onNext} disabled={!canNext}>{nextLabel}</Btn>}
      {isLast && <div style={{width:100}}/>}
    </div>
  );
}

function ProgressTrack({total,current,completed}) {
  return (
    <div style={{display:"flex",alignItems:"center",flex:1,overflow:"auto",padding:"4px 0",gap:0}}>
      {Array.from({length:total}).map((_,i)=>{
        const isDone = completed.has(i);
        const isActive = i === current;

        // 🔒 LOCK LOGIC
        const isUnlocked = i <= current;

        return (
          <div key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
            
            {i>0 && (
              <div
                style={{
                  width:18,
                  height:3,
                  background: completed.has(i-1) ? "#16a34a" : "#2e3347",
                  flexShrink:0,
                  borderRadius:2,
                  transition:"background .35s"
                }}
              />
            )}

            <div
              style={{
                width:32,
                height:32,
                borderRadius:"50%",
                background:isDone ? "#22c55e" : isActive ? "#3b82f6" : "#1e2130",
                border:`3px solid ${isDone ? "#22c55e" : isActive ? "#3b82f6" : "#2e3347"}`,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontFamily:"'Nunito',sans-serif",
                fontSize:isDone ? 14 : 12,
                fontWeight:900,
                color:isDone ? "#0f1117" : isActive ? "#0f1117" : "#4e566b",
                boxShadow:isActive ? "0 4px 0 #2563eb" : "0 2px 0 #0a0c14",
                transition:"all .3s cubic-bezier(.34,1.56,.64,1)",
                flexShrink:0,

                // ✅ ONLY ADD THESE (NO CSS CHANGE)
                opacity: isUnlocked ? 1 : 0.4,
                position:"relative"
              }}
            >
            {!isUnlocked ? "🔒" : (isDone ? "" : i+1)}  
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────── MCQ COMPONENT ─────────────── */
function MCQModule({questions,mcqState,onAnswer,onNav,badgeColor="amber",badgeText="KNOWLEDGE CHECK",onComplete}) {
  const {current,score,answered}=mcqState;
  const q=questions[current];
  if (!q){onComplete(score);return null;}
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
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:"#7c8499",fontWeight:700}}>Q {current+1} / {questions.length}</div>
      </div>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:19,color:"#e8e0d5",marginBottom:22,lineHeight:1.4}}>{q.q}</div>
      <div style={{display:"grid",gap:10,marginBottom:20}}>
        {q.opts.map((opt,i)=>{
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

export { Btn, HBox, SectionBadge, ConceptTitle, CodeBlock, StepCompleteBanner, ReadBtn, BottomNav, ProgressTrack };
