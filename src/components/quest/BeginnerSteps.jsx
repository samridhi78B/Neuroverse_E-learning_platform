import { useState } from 'react';
import { Btn, HBox, SectionBadge, ConceptTitle, CodeBlock, StepCompleteBanner, ReadBtn, BottomNav } from './UIComponents';
import MCQModule from './MCQModule';
import { StudentTable, QueryBuilderGame, SQLSandbox } from './InteractiveWidgets';
import { BEG_STAGES } from './questData';

const BEG_MCQS = BEG_STAGES[0].questions;

function BegStep0({done,onConfirm,onPrev,onNext,step,total}) {
  return (
    <>
      <SectionBadge> Concept 1 of 6 · What is DBMS?</SectionBadge>
      <ConceptTitle>What is a Database & DBMS?</ConceptTitle>
      <div style={{fontSize:15,lineHeight:1.8,color:"#c4bdb4"}}>
        <p>Database = organized data storage</p>
      </div>
      <ReadBtn done={done} onConfirm={onConfirm}/>
      <BottomNav step={step} total={total} canNext={done} onPrev={onPrev} onNext={onNext}/>
    </>
  );
}

function BegStep1({done,onConfirm,onPrev,onNext,step,total}) {
  return (
    <>
      <SectionBadge> Concept 2</SectionBadge>
      <ConceptTitle>Tables</ConceptTitle>
      <StudentTable/>
      <ReadBtn done={done} onConfirm={onConfirm}/>
      <BottomNav step={step} total={total} canNext={done} onPrev={onPrev} onNext={onNext}/>
    </>
  );
}

function BegStep2({done,onConfirm,onPrev,onNext,step,total}) {
  return (
    <>
      <SectionBadge> Concept 3</SectionBadge>
      <ConceptTitle>SELECT</ConceptTitle>
      <QueryBuilderGame/>
      <ReadBtn done={done} onConfirm={onConfirm}/>
      <BottomNav step={step} total={total} canNext={done} onPrev={onPrev} onNext={onNext}/>
    </>
  );
}

function BegStep3({done,onConfirm,onPrev,onNext,step,total}) {
  return (
    <>
      <SectionBadge> Concept 4</SectionBadge>
      <ConceptTitle>CRUD</ConceptTitle>
      <SQLSandbox onSuccess={()=>{}}/>
      <ReadBtn done={done} onConfirm={onConfirm}/>
      <BottomNav step={step} total={total} canNext={done} onPrev={onPrev} onNext={onNext}/>
    </>
  );
}

function BegStep4({mcqState,onAnswer,onNav,onComplete,onPrev,onNext,step,total}) {
  const quizDone = mcqState.done || false;
  const handleComplete = (score) => { onComplete(score); };
  return (
    <>
      <SectionBadge> Quiz · Step 5 of 6</SectionBadge>
      <ConceptTitle>Knowledge Check</ConceptTitle>
      <p style={{color:"#7c8499",fontSize:14,marginBottom:24,fontWeight:600}}>Answer all questions. Each correct answer earns +10 XP. Complete to unlock the next step!</p>
      {!quizDone
        ? <MCQModule questions={BEG_MCQS} mcqState={mcqState} onAnswer={onAnswer} onNav={onNav} onComplete={handleComplete}/>
        : <>
            <StepCompleteBanner> Quiz complete! Score: {mcqState.score}/{BEG_MCQS.length} — Next step unlocked!</StepCompleteBanner>
            <BottomNav step={step} total={total} canNext={true} onPrev={onPrev} onNext={onNext}/>
          </>
      }
    </>
  );
}

function BegStep5({xp,onHome,onNextLevel}) {
  return (
    <div style={{textAlign:"center",padding:"40px"}}>
      <h2 style={{color:"#e8f0fe"}}>Beginner Complete!</h2>
      <p style={{color:"#8899bb"}}>Total XP: {xp}</p>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:20}}>
        <Btn variant="secondary" onClick={onHome}>← Home</Btn>
        <Btn variant="primary" onClick={onNextLevel}>Next Level →</Btn>
      </div>
    </div>
  );
}

export { BegStep0, BegStep1, BegStep2, BegStep3, BegStep4, BegStep5 };
