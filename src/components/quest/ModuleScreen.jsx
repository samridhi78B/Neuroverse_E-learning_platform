import { useState, useEffect } from 'react';
import { ProgressTrack } from './UIComponents';
import { BEG_STAGES, MED_STAGES, ADV_STAGES } from './questData';

const BEG_MCQS = BEG_STAGES[0].questions;
const MED_MCQS = MED_STAGES[0].questions;
const ADV_MCQS = ADV_STAGES[0].questions;

function ModuleScreen({level,steps,stepComponent,completed,onBack,xp,onAddXP}) {
  const [step,setStep]=useState(0);
  const [done,setDone]=useState(new Set());
  const [mcqState,setMcqState]=useState({current:0,score:0,answered:false,selected:null,done:false});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [sessionReadingSteps, setSessionReadingSteps] = useState(new Set());
  const TOTAL=steps;

  // Reset all state whenever level changes so stale indices don't carry over
  useEffect(()=>{
    setMcqState({current:0,score:0,answered:false,selected:null,done:false});
    setStep(0);
    setDone(new Set());
    setQuizCompleted(false);
    setSessionReadingSteps(new Set());
  },[level]);

  const markDone=(s)=>{
    if(!done.has(s)){
      const n=new Set(done);
      n.add(s);
      setDone(n);
      // Track reading steps completed in this session
      const sessionSteps = new Set(sessionReadingSteps);
      sessionSteps.add(s);
      setSessionReadingSteps(sessionSteps);
      onAddXP(5);
    }
  };
  const confirmRead=()=>{markDone(step);};
  const goNext=()=>{if(step<TOTAL-1){setStep(s=>s+1);window.scrollTo(0,0);}};
  const goPrev=()=>{if(step>0){setStep(s=>s-1);window.scrollTo(0,0);}};

  const handleAnswer=(i)=>{
    if(mcqState.answered)return;
    const mcqs=level==="beginner"?BEG_MCQS:level==="medium"?MED_MCQS:ADV_MCQS;
    const ok=i===mcqs[mcqState.current].ans;
    setMcqState(s=>({...s,answered:true,selected:i,score:ok?s.score+1:s.score}));
    // Don't award XP immediately - wait for quiz completion
  };
  const handleMcqNav=(delta)=>{
    const mcqs=level==="beginner"?BEG_MCQS:level==="medium"?MED_MCQS:ADV_MCQS;
    const next=mcqState.current+delta;
    if(next<0)return;
    if(next>=mcqs.length){
      const quizStep=level==="beginner"?4:3;
      markDone(quizStep);
      setMcqState(s=>({...s,done:true}));
      // Award XP only on quiz completion if score is better than previous
      awardQuizXP(mcqState.score);
      return;
    }
    setMcqState(s=>({...s,current:next,answered:false,selected:null}));
  };
  
  const awardQuizXP = (finalScore) => {
    if (quizCompleted) return; // Already awarded XP for this quiz session
    
    // Calculate total module XP for THIS SESSION only (reading steps + quiz)
    const readingStepsXP = sessionReadingSteps.size * 5; // Only count reading steps done in this session
    const quizXP = finalScore * (level === "advanced" ? 15 : 10);
    const totalSessionXP = readingStepsXP + quizXP;
    
    const moduleKey = `module_score_${level}`;
    const previousModuleXP = parseInt(localStorage.getItem(moduleKey) || '0');
    
    if (totalSessionXP > previousModuleXP) {
      // Only award the difference
      const xpToAdd = totalSessionXP - previousModuleXP;
      
      if (xpToAdd > 0) {
        onAddXP(xpToAdd);
        localStorage.setItem(moduleKey, totalSessionXP.toString());
        localStorage.setItem(`${moduleKey}_timestamp`, Date.now().toString());
        
        // Also store quiz score separately for tracking
        const quizKey = `quiz_score_${level}`;
        localStorage.setItem(quizKey, finalScore.toString());
        localStorage.setItem(`${quizKey}_timestamp`, Date.now().toString());
      }
    }
    
    setQuizCompleted(true);
  };
  
  const handleQuizComplete=(score)=>{
    const quizStep=level==="beginner"?4:3;
    markDone(quizStep);
    setMcqState(s=>({...s,done:true}));
    awardQuizXP(score);
  };

  const sharedProps={done:done.has(step),onConfirm:confirmRead,onPrev:goPrev,onNext:goNext,step,total:TOTAL,mcqState,onAnswer:handleAnswer,onNav:handleMcqNav,onComplete:handleQuizComplete,xp,onHome:onBack,onNextLevel:()=>{}};

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"40px 20px 80px"}} className="module-pad">
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:36,flexWrap:"wrap"}}>
        <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:12,border:"2px solid #2e3347",background:"#1e2130",color:"#8899bb",cursor:"pointer",fontSize:14,fontFamily:"'Rajdhani',sans-serif",transition:"all .2s",flexShrink:0,fontWeight:800,boxShadow:"0 3px 0 #1a1e2b"}}>← Back</button>
        <ProgressTrack total={TOTAL} current={step} completed={done}/>
      </div>
      <div className="fade-slide" key={step}>
        {stepComponent({step,sharedProps,goPrev,goNext,done,xp,onBack,onNextLevel:onBack})}
      </div>
    </div>
  );
}

export default ModuleScreen;
