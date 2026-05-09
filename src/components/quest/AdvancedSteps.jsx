import { useState } from 'react';
import { Btn, HBox, SectionBadge, ConceptTitle, CodeBlock, StepCompleteBanner, ReadBtn, BottomNav } from './UIComponents';
import MCQModule from './MCQModule';
import { PracticeEditor, NormalizationVisual } from './InteractiveWidgets';
import { ADV_STAGES } from './questData';

const ADV_MCQS = ADV_STAGES[0].questions;

function AdvStep0({done,onConfirm,onPrev,onNext,step,total}) {
  return (
    <>
      <SectionBadge color="purple"> Advanced 1 of 5 · Normalization</SectionBadge>
      <ConceptTitle>Normalization — Designing Clean Databases</ConceptTitle>
      <div style={{fontSize:15,lineHeight:1.8,color:"#c4bdb4",marginBottom:14}}><strong style={{color:"#00e5ff"}}>Normalization</strong> organizes a database to eliminate redundant data. Every fact should be stored in exactly ONE place.</div>
      <HBox type="purple"> <strong>Goal:</strong> Store every fact in exactly one place. Changes need to happen in only one row.</HBox>
      <div style={{display:"grid",gap:12,margin:"16px 0"}}>
        {[["1NF","First Normal Form","Atomic values in each column. No repeating groups. Each row unique.","#00ff94"],["2NF","Second Normal Form","Must be 1NF + every non-key column depends on the full primary key.","#00e5ff"],["3NF","Third Normal Form","Must be 2NF + no transitive dependencies between non-key columns.","#ffd600"],["BCNF","Boyce-Codd NF","Stricter 3NF — every determinant must be a candidate key.","#7c3aed"]].map(([a,n,d,c])=>(
          <div key={a} style={{border:"2px solid #2e3347",borderRadius:14,padding:18,display:"flex",gap:14,background:"#1e2130",boxShadow:"0 2px 6px rgba(0,0,0,.3)"}}>
            <div style={{width:4,borderRadius:2,background:c,flexShrink:0}}/>
            <div>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:16,color:c,marginBottom:6}}>{a} — {n}</div>
              <div style={{fontSize:13,color:"#7c8499",lineHeight:1.6,fontWeight:600}}>{d}</div>
            </div>
          </div>
        ))}
      </div>
      <NormalizationVisual/>
      <ReadBtn done={done} onConfirm={onConfirm}/>
      <BottomNav step={step} total={total} canNext={done} onPrev={onPrev} onNext={onNext}/>
    </>
  );
}

function AdvStep1({done,onConfirm,onPrev,onNext,step,total}) {
  return (
    <>
      <SectionBadge color="purple"> Advanced 2 of 5 · Transactions &amp; ACID</SectionBadge>
      <ConceptTitle>Transactions &amp; ACID Properties</ConceptTitle>
      <div style={{fontSize:15,lineHeight:1.8,color:"#c4bdb4",marginBottom:14}}>A <strong style={{color:"#00e5ff"}}>Transaction</strong> is a group of SQL ops executed as one unit — either ALL succeed, or NONE do.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,margin:"20px 0"}}>
        {[["A","Atomicity","All operations succeed, or all are rolled back.","#00e5ff"],["C","Consistency","DB moves from one valid state to another.","#00ff94"],["I","Isolation","Concurrent transactions don't interfere.","#ffd600"],["D","Durability","Committed data is permanently saved.","#7c3aed"]].map(([l,n,d,c])=>(
          <div key={l} style={{border:`2px solid ${c}44`,borderRadius:14,padding:20,background:"#1e2130",boxShadow:"0 3px 8px rgba(0,0,0,.35)"}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:40,color:c,opacity:.3,marginBottom:8}}>{l}</div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:15,color:c,marginBottom:6}}>{n}</div>
            <div style={{fontSize:12,color:"#7c8499",fontWeight:600,lineHeight:1.6}}>{d}</div>
          </div>
        ))}
      </div>
      <CodeBlock>{`<span style="color:#546e7a;font-style:italic">-- Bank Transfer Transaction</span>
<span style="color:#c792ea">START TRANSACTION</span>;
<span style="color:#c792ea">UPDATE</span> <span style="color:#00e5ff">accounts</span> <span style="color:#c792ea">SET</span> <span style="color:#82aaff">balance</span> = <span style="color:#82aaff">balance</span> - <span style="color:#f78c6c">1000</span>
<span style="color:#c792ea">WHERE</span> <span style="color:#82aaff">account_id</span> = <span style="color:#f78c6c">101</span>;
<span style="color:#c792ea">UPDATE</span> <span style="color:#00e5ff">accounts</span> <span style="color:#c792ea">SET</span> <span style="color:#82aaff">balance</span> = <span style="color:#82aaff">balance</span> + <span style="color:#f78c6c">1000</span>
<span style="color:#c792ea">WHERE</span> <span style="color:#82aaff">account_id</span> = <span style="color:#f78c6c">202</span>;
<span style="color:#c792ea">COMMIT</span>;</span>`}</CodeBlock>
      <ReadBtn done={done} onConfirm={onConfirm}/>
      <BottomNav step={step} total={total} canNext={done} onPrev={onPrev} onNext={onNext}/>
    </>
  );
}

function AdvStep2({done,onConfirm,onPrev,onNext,step,total}) {
  const check=(val)=>{
    const q=val.trim().toLowerCase();
    const ok=q.includes("procedure")&&q.includes("city")&&q.includes("select")&&q.includes("begin")&&q.includes("end");
    const missing=[];
    if(!q.includes("procedure"))missing.push("CREATE PROCEDURE");
    if(!q.includes("city"))missing.push("city parameter");
    if(!q.includes("select"))missing.push("SELECT statement");
    if(!q.includes("begin")||!q.includes("end"))missing.push("BEGIN...END");
    return ok?{ok:true,msg:"Excellent! Stored procedure looks correct. +30 XP!"}:{ok:false,msg:"Missing: "+missing.join(", ")};
  };
  return (
    <>
      <SectionBadge color="purple"> Advanced 3 of 5 · Stored Procedures &amp; Indexes</SectionBadge>
      <ConceptTitle>Stored Procedures &amp; Indexes</ConceptTitle>
      <div style={{fontSize:15,lineHeight:1.8,color:"#c4bdb4",marginBottom:14}}>A <strong style={{color:"#00e5ff"}}>Stored Procedure</strong> is a saved, reusable SQL program. An <strong style={{color:"#00e5ff"}}>Index</strong> dramatically speeds up data retrieval.</div>
      <CodeBlock>{`<span style="color:#c792ea">CREATE PROCEDURE</span> <span style="color:#ffcb6b">GetByGrade</span>(<span style="color:#c792ea">IN</span> <span style="color:#82aaff">g</span> <span style="color:#ffcb6b">VARCHAR</span>(10))
<span style="color:#c792ea">BEGIN</span>
  <span style="color:#c792ea">SELECT</span> * <span style="color:#c792ea">FROM</span> <span style="color:#00e5ff">students</span> <span style="color:#c792ea">WHERE</span> <span style="color:#82aaff">grade</span> = g;
<span style="color:#c792ea">END</span>;
<span style="color:#c792ea">CREATE INDEX</span> idx_grade <span style="color:#c792ea">ON</span> <span style="color:#00e5ff">students</span>(<span style="color:#82aaff">grade</span>);</span>`}</CodeBlock>
      <HBox type="green"> <strong>When to Index?</strong> Columns used in WHERE, JOIN, ORDER BY. Don't over-index — each index slows down INSERT/UPDATE/DELETE.</HBox>
      <PracticeEditor
        placeholder={"CREATE PROCEDURE GetByCity(IN c VARCHAR(50))\nBEGIN\n  ...\nEND"}
        check={check}
        hintText="Structure: CREATE PROCEDURE name(IN param TYPE) BEGIN ... SELECT from students WHERE city = param ... END"
        btnVariant="purple"
      />
      <ReadBtn done={done} onConfirm={onConfirm}/>
      <BottomNav step={step} total={total} canNext={done} onPrev={onPrev} onNext={onNext}/>
    </>
  );
}

function AdvStep3({mcqState,onAnswer,onNav,onComplete,onPrev,onNext,step,total}) {
  const quizDone=mcqState.done||false;
  const handleComplete=(score)=>{onComplete(score);};
  return (
    <>
      <SectionBadge color="purple"> Quiz · Step 4 of 5</SectionBadge>
      <ConceptTitle>Advanced Knowledge Check</ConceptTitle>
      <p style={{color:"#7c8499",fontSize:14,marginBottom:24,fontWeight:600}}>Prove your mastery of advanced DBMS concepts!</p>
      {!quizDone
        ? <MCQModule questions={ADV_MCQS} mcqState={mcqState} onAnswer={onAnswer} onNav={onNav} badgeColor="purple" badgeText="ADVANCED QUIZ" onComplete={handleComplete}/>
        : <>
            <StepCompleteBanner> Quiz complete! Score: {mcqState.score}/{ADV_MCQS.length} — Final step unlocked!</StepCompleteBanner>
            <BottomNav step={step} total={total} canNext={true} onPrev={onPrev} onNext={onNext} nextLabel="See Results →"/>
          </>
      }
    </>
  );
}

function AdvStep4({xp,onHome}) {
  return (
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <span style={{fontSize:64,display:"block",marginBottom:24}} className="bounce-anim"></span>
      <div style={{fontFamily:"'Orbitron',monospace",fontSize:28,color:"#3b82f6",marginBottom:16}}>Advanced Master!</div>
      <p style={{color:"#7c8499",fontSize:16,maxWidth:440,margin:"0 auto 32px",lineHeight:1.7,fontWeight:600}}>You've conquered normalization, ACID, transactions, stored procedures, and indexing. You're a MySQL expert!</p>
      <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginBottom:32}}>
        {[{val:xp,label:"Total XP",color:"#6366f1"},{val:"ALL",label:"Modules",color:"#00ff94"},{val:"🏆",label:"Expert",color:"#3b82f6"}].map(({val,label,color})=>(
          <div key={label} style={{background:"#1e2130",border:"2px solid #2e3347",borderRadius:16,padding:"16px 20px",textAlign:"center",minWidth:100,boxShadow:"0 3px 0 #1a1e2b"}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:30,color}}>{val}</div>
            <div style={{fontSize:11,color:"#7c8499",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginTop:4}}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn variant="secondary" onClick={onHome}>← Back Home</Btn>
        <Btn variant="green" onClick={()=>alert("🎓 Certificate coming soon on NeuroVerse!")}> Get Certificate</Btn>
      </div>
    </div>
  );
}

export { AdvStep0, AdvStep1, AdvStep2, AdvStep3, AdvStep4 };
