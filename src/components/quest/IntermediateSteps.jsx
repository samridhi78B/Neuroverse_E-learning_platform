import { useState } from 'react';
import { Btn, HBox, SectionBadge, ConceptTitle, CodeBlock, StepCompleteBanner, ReadBtn, BottomNav } from './UIComponents';
import MCQModule from './MCQModule';
import { PracticeEditor, GroupByVisualizer, SchemaDiagram } from './InteractiveWidgets';
import { MED_STAGES } from './questData';

const MED_MCQS = MED_STAGES[0].questions;

function MedStep0({done,onConfirm,onPrev,onNext,step,total}) {
  return (
    <>
      <SectionBadge> Concept 1 of 5 · JOINs</SectionBadge>
      <ConceptTitle>JOINs — Connecting Tables</ConceptTitle>
      <div style={{fontSize:15,lineHeight:1.8,color:"#c4bdb4",marginBottom:14}}>Real databases split data into multiple related tables. A <strong style={{color:"#00e5ff"}}>JOIN</strong> combines rows from two or more tables based on a matching column.</div>
      <SchemaDiagram/>
      <CodeBlock>{`<span style="color:#546e7a;font-style:italic">-- INNER JOIN: only matched rows</span>
<span style="color:#c792ea">SELECT</span> <span style="color:#82aaff">s.name</span>, <span style="color:#82aaff">m.subject</span>, <span style="color:#82aaff">m.score</span>
<span style="color:#c792ea">FROM</span> <span style="color:#00e5ff">students</span> s
<span style="color:#c792ea">INNER JOIN</span> <span style="color:#00e5ff">marks</span> m <span style="color:#c792ea">ON</span> s.student_id = m.student_id;

<span style="color:#546e7a;font-style:italic">-- LEFT JOIN: all students, even without marks</span>
<span style="color:#c792ea">SELECT</span> <span style="color:#82aaff">s.name</span>, <span style="color:#82aaff">m.score</span>
<span style="color:#c792ea">FROM</span> <span style="color:#00e5ff">students</span> s
<span style="color:#c792ea">LEFT JOIN</span> <span style="color:#00e5ff">marks</span> m <span style="color:#c792ea">ON</span> s.student_id = m.student_id;</span>`}</CodeBlock>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,margin:"16px 0"}}>
        {[["INNER JOIN","Only matching rows in both tables","#00e5ff"],["LEFT JOIN","All from left + matches from right","#1565ff"],["RIGHT JOIN","All from right + matches from left","#7c3aed"],["FULL JOIN","All rows from both tables","#ffd600"]].map(([t,d,c])=>(
          <div key={t} style={{background:"#161926",border:"2px solid #2e3347",borderRadius:12,padding:14}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:c,marginBottom:6,fontWeight:700}}>{t}</div>
            <div style={{fontSize:12,color:"#7c8499",fontWeight:600}}>{d}</div>
          </div>
        ))}
      </div>
      <ReadBtn done={done} onConfirm={onConfirm}/>
      <BottomNav step={step} total={total} canNext={done} onPrev={onPrev} onNext={onNext}/>
    </>
  );
}

function MedStep1({done,onConfirm,onPrev,onNext,step,total}) {
  return (
    <>
      <SectionBadge> Concept 2 of 5 · GROUP BY</SectionBadge>
      <ConceptTitle>GROUP BY &amp; Aggregate Functions</ConceptTitle>
      <div style={{fontSize:15,lineHeight:1.8,color:"#c4bdb4",marginBottom:14}}><strong style={{color:"#00e5ff"}}>Aggregate functions</strong> calculate across multiple rows. <strong style={{color:"#00e5ff"}}>GROUP BY</strong> groups rows so aggregates apply per group.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,margin:"16px 0"}}>
        {[["COUNT()","Count rows"],["SUM()","Total"],["AVG()","Average"],["MAX()","Highest"],["MIN()","Lowest"]].map(([f,d])=>(
          <div key={f} style={{background:"#1e2130",border:"2px solid #2e3347",borderRadius:12,padding:12,textAlign:"center"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#3b82f6",marginBottom:4}}>{f}</div>
            <div style={{fontSize:11,color:"#7c8499",fontWeight:600}}>{d}</div>
          </div>
        ))}
      </div>
      <CodeBlock>{`<span style="color:#546e7a;font-style:italic">-- Count students per grade</span>
<span style="color:#c792ea">SELECT</span> <span style="color:#82aaff">grade</span>, <span style="color:#ffcb6b">COUNT</span>(*) <span style="color:#c792ea">AS</span> total
<span style="color:#c792ea">FROM</span> <span style="color:#00e5ff">students</span>
<span style="color:#c792ea">GROUP BY</span> <span style="color:#82aaff">grade</span>;

<span style="color:#546e7a;font-style:italic">-- Avg score per subject (HAVING filters groups)</span>
<span style="color:#c792ea">SELECT</span> <span style="color:#82aaff">subject</span>, <span style="color:#ffcb6b">AVG</span>(<span style="color:#82aaff">score</span>) <span style="color:#c792ea">AS</span> avg_score
<span style="color:#c792ea">FROM</span> <span style="color:#00e5ff">marks</span>
<span style="color:#c792ea">GROUP BY</span> <span style="color:#82aaff">subject</span>
<span style="color:#c792ea">HAVING</span> <span style="color:#ffcb6b">AVG</span>(<span style="color:#82aaff">score</span>) &gt; <span style="color:#f78c6c">70</span>;</span>`}</CodeBlock>
      <HBox type="cyan"> <strong>WHERE vs HAVING:</strong> WHERE filters rows <em>before</em> grouping. HAVING filters groups <em>after</em> aggregation.</HBox>
      <GroupByVisualizer/>
      <ReadBtn done={done} onConfirm={onConfirm}/>
      <BottomNav step={step} total={total} canNext={done} onPrev={onPrev} onNext={onNext}/>
    </>
  );
}

function MedStep2({done,onConfirm,onPrev,onNext,step,total}) {
  const check = (val) => {
    const q=val.trim().toLowerCase();
    const ok=q.includes("select")&&q.includes("join")&&(q.includes("'10th'")||q.includes("10th"))&&q.includes("80");
    return ok?{ok:true,msg:"Correct! Returns 10th grade students with score > 80."}:{ok:false,msg:"Needs: SELECT + JOIN marks + WHERE grade='10th' + score>80"};
  };
  return (
    <>
      <SectionBadge> Concept 3 of 5 · Subqueries</SectionBadge>
      <ConceptTitle>Subqueries &amp; Nested SELECT</ConceptTitle>
      <div style={{fontSize:15,lineHeight:1.8,color:"#c4bdb4",marginBottom:14}}>A <strong style={{color:"#00e5ff"}}>Subquery</strong> is a query nested inside another query. The inner query runs first and its result is used by the outer query.</div>
      <CodeBlock>{`<span style="color:#546e7a;font-style:italic">-- Students who scored above the average</span>
<span style="color:#c792ea">SELECT</span> <span style="color:#82aaff">name</span> <span style="color:#c792ea">FROM</span> <span style="color:#00e5ff">students</span>
<span style="color:#c792ea">WHERE</span> <span style="color:#82aaff">student_id</span> <span style="color:#c792ea">IN</span> (
  <span style="color:#c792ea">SELECT</span> <span style="color:#82aaff">student_id</span> <span style="color:#c792ea">FROM</span> <span style="color:#00e5ff">marks</span>
  <span style="color:#c792ea">WHERE</span> <span style="color:#82aaff">score</span> &gt; (
    <span style="color:#c792ea">SELECT</span> <span style="color:#ffcb6b">AVG</span>(<span style="color:#82aaff">score</span>) <span style="color:#c792ea">FROM</span> <span style="color:#00e5ff">marks</span>
  )
);</span>`}</CodeBlock>
      <PracticeEditor
        placeholder={"Write a query to find 10th grade students who scored > 80..."}
        check={check}
        hintText="Use SELECT ... FROM students JOIN marks ON student_id. Filter WHERE grade = '10th' AND score > 80."
      />
      <ReadBtn done={done} onConfirm={onConfirm}/>
      <BottomNav step={step} total={total} canNext={done} onPrev={onPrev} onNext={onNext}/>
    </>
  );
}

function MedStep3({mcqState,onAnswer,onNav,onComplete,onPrev,onNext,step,total}) {
  const quizDone=mcqState.done||false;
  const handleComplete=(score)=>{onComplete(score);};
  return (
    <>
      <SectionBadge> Quiz · Step 4 of 5</SectionBadge>
      <ConceptTitle>Intermediate Knowledge Check</ConceptTitle>
      <p style={{color:"#7c8499",fontSize:14,marginBottom:24,fontWeight:600}}>Complete to unlock the final step!</p>
      {!quizDone
        ? <MCQModule questions={MED_MCQS} mcqState={mcqState} onAnswer={onAnswer} onNav={onNav} badgeColor="cyan" badgeText="INTERMEDIATE QUIZ" onComplete={handleComplete}/>
        : <>
            <StepCompleteBanner> Quiz complete! Score: {mcqState.score}/{MED_MCQS.length} — Final step unlocked!</StepCompleteBanner>
            <BottomNav step={step} total={total} canNext={true} onPrev={onPrev} onNext={onNext} nextLabel="See Results →"/>
          </>
      }
    </>
  );
}

function MedStep4({xp,onHome,onNextLevel}) {
  return (
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <span style={{fontSize:64,display:"block",marginBottom:24}} className="bounce-anim"></span>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:32,color:"#e8e0d5",marginBottom:16}}>Intermediate Complete!</div>
      <p style={{color:"#7c8499",fontSize:16,maxWidth:420,margin:"0 auto 32px",lineHeight:1.7,fontWeight:600}}>You've mastered JOINs, GROUP BY, aggregate functions, subqueries, and practice SQL writing!</p>
      <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginBottom:32}}>
        {[{val:xp,label:"Total XP",color:"#00e5ff"},{val:"⭐⭐⭐",label:"Stars",color:"#3b82f6"}].map(({val,label,color})=>(
          <div key={label} style={{background:"#1e2130",border:"2px solid #2e3347",borderRadius:16,padding:"16px 20px",textAlign:"center",minWidth:100,boxShadow:"0 3px 0 #1a1e2b"}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:30,color}}>{val}</div>
            <div style={{fontSize:11,color:"#7c8499",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginTop:4}}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn variant="secondary" onClick={onHome}>← Home</Btn>
        <Btn variant="purple" onClick={onNextLevel}>Try Advanced →</Btn>
      </div>
    </div>
  );
}

export { MedStep0, MedStep1, MedStep2, MedStep3, MedStep4 };
