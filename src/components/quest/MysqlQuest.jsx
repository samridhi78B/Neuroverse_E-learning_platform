import { useState, useEffect, useCallback, useRef } from 'react';
import GLOBAL_CSS from './globalStyles';
import { INTRO_DATA } from './questData';
import { LEVEL_ICONS } from './Icons';
import { Btn } from './UIComponents';
import ModuleScreen from './ModuleScreen';
import Toast from './Toast';
import { BegStep0, BegStep1, BegStep2, BegStep3, BegStep4, BegStep5 } from './BeginnerSteps';
import { MedStep0, MedStep1, MedStep2, MedStep3, MedStep4 } from './IntermediateSteps';
import { AdvStep0, AdvStep1, AdvStep2, AdvStep3, AdvStep4 } from './AdvancedSteps';
import authService from '../../services/authService';

// XP thresholds to unlock each level
const XP_TO_UNLOCK_INTERMEDIATE = 40; // complete beginner quiz (4 Qs × 10 XP)
const XP_TO_UNLOCK_ADVANCED     = 80; // complete intermediate quiz too

export default function MysqlQuest({ onBackToIsland }) {
  const [screen,setScreen]=useState("landing");
  const [introLevel,setIntroLevel]=useState(null);
  const [xp,setXp]=useState(0);
  const [dbXP,setDbXP]=useState(0); // Actual database XP from backend
  const [totalEarned,setTotalEarned]=useState(0); // Track XP earned in current session
  const [toast,setToast]=useState({msg:"",show:false});
  const toastTimer=useRef(null);
  const sessionXpRef=useRef(0);

  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent=GLOBAL_CSS;
    document.head.appendChild(style);
    return ()=>document.head.removeChild(style);
  },[]);

  // Load database XP from backend on component mount
  useEffect(() => {
    const loadDatabaseXP = async () => {
      try {
        const profile = await authService.getProfile();
        const databaseXP = profile.user?.planetXP?.db || 0;
        setDbXP(databaseXP);
        setXp(databaseXP); // Sync local XP with backend
        console.log('Loaded database XP:', databaseXP);
      } catch (error) {
        console.error('Failed to load database XP:', error);
      }
    };

    loadDatabaseXP();
    
    // Refresh XP every 30 seconds to ensure sync
    const interval = setInterval(loadDatabaseXP, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh XP from backend when it changes
  const refreshXP = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      const databaseXP = profile.user?.planetXP?.db || 0;
      setDbXP(databaseXP);
      setXp(databaseXP); // Keep local XP in sync
      console.log('Refreshed database XP:', databaseXP);
    } catch (error) {
      console.error('Failed to refresh database XP:', error);
    }
  }, []);

  const saveXPToBackend = useCallback(async (totalEarned) => {
  if (totalEarned <= 0) return;
  try {
    // db = Databases planet ID
    await authService.updatePlanetXP('db', totalEarned);
  } catch (err) {
    console.error('Failed to save MySQL Quest XP:', err);
  }
}, []);

  const addXP=useCallback((n)=>{
    setXp(x=>x+n);
    setDbXP(x=>x+n); // Keep dbXP in sync as well
    sessionXpRef.current += n;
    saveXPToBackend(n);
    showToast(`+${n} XP earned!`);
  },[saveXPToBackend]);

  const showToast=(msg)=>{
    setToast({msg,show:true});
    if(toastTimer.current)clearTimeout(toastTimer.current);
    toastTimer.current=setTimeout(()=>setToast(t=>({...t,show:false})),2600);
  };

  const openIntro=(level)=>{setIntroLevel(level);setScreen("intro");};
  const startLevel=(level)=>setScreen(level);
  const goHome=()=>setScreen("landing");
  const xpPct=Math.min(dbXP/4,100); // Use dbXP for progress calculation

  // Derive unlock state from the most current XP value
  const currentXP = Math.max(xp, dbXP); // Use the higher of local or backend XP
  const isUnlocked = {
    beginner: true,
    medium:   currentXP >= XP_TO_UNLOCK_INTERMEDIATE,
    advanced: currentXP >= XP_TO_UNLOCK_ADVANCED,
  };

  const breadcrumb = screen==="landing"?"Home / MySQL Quest":
    screen==="intro"?`Home / MySQL Quest / ${INTRO_DATA[introLevel]?.label}`:`Home / MySQL Quest / ${INTRO_DATA[screen]?.label||screen}`;

  const CARDS = [
    {id:"beginner",label:"Level 01",name:"Beginner",desc:"Learn what databases are, why they matter, and build your first table — zero prior knowledge needed.",topics:["What is DBMS?","Tables & Rows","SELECT","WHERE","INSERT"],hoverBorder:"#16a34a",unlockXP:0},
    {id:"medium",  label:"Level 02",name:"Intermediate",desc:"Explore JOINs, GROUP BY, subqueries and start building real database relationships.",topics:["JOINs","GROUP BY","Subqueries","Indexes","Functions"],hoverBorder:"#3b82f6",unlockXP:XP_TO_UNLOCK_INTERMEDIATE},
    {id:"advanced",label:"Level 03",name:"Advanced",desc:"Deep dive into normalization, transactions, stored procedures, and query optimization.",topics:["Normalization","Transactions","Stored Proc","ACID","Optimization"],hoverBorder:"#4f46e5",unlockXP:XP_TO_UNLOCK_ADVANCED},
  ];

  return (
    <div style={{minHeight:"100vh",position:"relative"}}>
      {/* Header */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(5,11,26,0.95)",backdropFilter:"blur(16px)",borderBottom:"2px solid rgba(74,158,255,0.2)",padding:"0 32px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:900,fontSize:20,letterSpacing:1}}>
          <span style={{color:"#e8f0fe"}}>NEURO</span><span style={{color:"#4A9EFF"}}>VERSE</span>
        </div>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"#8899bb",letterSpacing:.3,fontWeight:700}}>
          {breadcrumb.split("/").map((part,i,arr)=>(
            <span key={i}>
              {i>0?" / ":""}
              {i===0 ? (
                <span onClick={onBackToIsland} style={{cursor:"pointer",color:"#ffffff",padding:"4px 8px",borderRadius:6,background:"rgba(74,158,255,0.2)",border:"1px solid rgba(74,158,255,0.3)",transition:"all .2s",fontWeight:700}} 
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(74,158,255,0.4)";e.currentTarget.style.color="#ffffff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(74,158,255,0.2)";e.currentTarget.style.color="#ffffff";}}
                >{part.trim()}</span>
              ) : i===arr.length-1 ? (
                <span style={{color:"#4A9EFF",padding:"4px 8px",borderRadius:6,background:"rgba(74,158,255,0.1)",border:"1px solid rgba(74,158,255,0.2)",fontWeight:700}}>{part.trim()}</span>
              ) : (
                <span style={{color:"#ffffff",padding:"4px 8px",borderRadius:6,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",fontWeight:600}}>{part.trim()}</span>
              )}
            </span>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,color:"#8899bb",fontWeight:700}}>
          <span>XP</span>
          <div style={{width:100,height:8,background:"#2e3347",borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#4A9EFF,#1a4a9a)",borderRadius:3,width:`${Math.min((currentXP/4)*100,100)}%`,transition:"width .6s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
          <span>{currentXP}</span>
        </div>
      </header>

      <div style={{position:"relative",zIndex:1,paddingTop:60,minHeight:"100vh",background:"linear-gradient(180deg,#050b1a 0%,#07101f 50%,#05080f 100%)"}}>

        {/* ── LANDING ── */}
        {screen==="landing" && (
          <div className="fade-slide" style={{minHeight:"calc(100vh - 60px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px"}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:.5,fontWeight:800,color:"#4A9EFF",border:"1px solid rgba(74,158,255,0.2)",padding:"6px 14px",borderRadius:20,marginBottom:24,background:"rgba(74,158,255,0.1)"}}>&nbsp; DBMS Learning Module</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"clamp(40px,7vw,80px)",textAlign:"center",lineHeight:1.05,marginBottom:16}}>
              <div style={{color:"#e8f0fe"}}>MySQL</div>
              <div style={{background:"linear-gradient(135deg,#4A9EFF,#1a4a9a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Quest</div>
            </div>
            <p style={{textAlign:"center",color:"#8899bb",fontSize:17,maxWidth:500,marginBottom:56,lineHeight:1.7,fontWeight:600}}>Master database concepts through interactive visuals, hands-on practice, and adaptive challenges.</p>

            <div className="level-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,maxWidth:860,width:"100%"}}>
              {CARDS.map(card=>{
                const locked = !isUnlocked[card.id];
                return (
                  <div
                    key={card.id}
                    className={locked ? "" : "level-card-hover"}
                    onClick={locked ? undefined : ()=>openIntro(card.id)}
                    style={{
                      border:`2px solid ${locked?"#1e2130":"#2e3347"}`,
                      borderRadius:24,
                      padding:"32px 24px",
                      cursor:locked?"not-allowed":"pointer",
                      position:"relative",
                      overflow:"hidden",
                      background:locked?"#13151f":"#1e2130",
                      textAlign:"left",
                      transition:"all .25s cubic-bezier(.34,1.56,.64,1)",
                      boxShadow:"0 4px 0 #0a0c14",
                      opacity:locked?0.5:1,
                      filter:locked?"grayscale(60%)":"none",
                    }}
                  >
                    {/* Lock overlay - floating centered, no panel */}
                    {locked && (
                      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:2,pointerEvents:"none",gap:8}}>
                        <span style={{fontSize:44,lineHeight:1,filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.8))"}}>🔒</span>
                        <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:"#fff700",fontWeight:800,letterSpacing:.8,textShadow:"0 2px 8px rgba(0,0,0,0.9)"}}>Earn {card.unlockXP} XP to unlock</span>
                      </div>
                    )}

                    {/* Icon */}
                    <div style={{width:52,height:52,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:20,background:locked?"rgba(255,255,255,0.04)":`${card.hoverBorder}1a`,border:`1px solid ${locked?"rgba(255,255,255,0.08)":card.hoverBorder+"4d"}`,color:locked?"#4a5568":card.hoverBorder}}>
                      {(()=>{ const I=LEVEL_ICONS[card.id]; return I?<I/>:null; })()}
                    </div>

                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,letterSpacing:.5,textTransform:"uppercase",fontWeight:900,color:locked?"#4a5568":card.hoverBorder,marginBottom:8}}>{card.label}</div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:22,color:locked?"#4a5568":"#e8f0fe",marginBottom:12}}>{card.name}</div>
                    <p style={{fontSize:14,color:locked?"#4a5568":"#8899bb",lineHeight:1.6,marginBottom:20,fontWeight:600}}>{card.desc}</p>

                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {card.topics.map(t=>(
                        <span key={t} style={{fontSize:11,fontFamily:"'Rajdhani',sans-serif",padding:"4px 12px",borderRadius:999,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",color:locked?"#374151":"#8899bb",fontWeight:700}}>{t}</span>
                      ))}
                    </div>

                    {/* Locked progress hint */}
                    {locked && (
                      <div style={{marginTop:18,padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#8899bb",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,marginBottom:6}}>
                          <span>YOUR XP</span>
                          <span>{currentXP} / {card.unlockXP}</span>
                        </div>
                        <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.06)"}}>
                          <div style={{height:"100%",borderRadius:2,background:card.hoverBorder,width:`${Math.min((currentXP/card.unlockXP)*100,100)}%`,transition:"width .6s ease"}}/>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── INTRO ── */}
        {screen==="intro" && introLevel && (()=>{
          const d=INTRO_DATA[introLevel];
          const btnStyles={green:{background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#1e2130"},cyan:{background:"linear-gradient(135deg,#3b82f6,#2563eb)",color:"#e8f0fe"},purple:{background:"linear-gradient(135deg,#4f46e5,#3730a3)",color:"#1e2130"}};
          return (
            <div className="fade-slide" style={{maxWidth:720,margin:"0 auto",padding:"56px 20px"}}>
              <button onClick={goHome} style={{display:"inline-flex",alignItems:"center",gap:6,color:"#8899bb",fontSize:14,cursor:"pointer",border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",padding:"9px 18px",borderRadius:12,marginBottom:36,transition:"all .2s",fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>← Back to Levels</button>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:1,textTransform:"uppercase",color:introLevel==="beginner"?"#16a34a":introLevel==="medium"?"#3b82f6":"#4f46e5",marginBottom:12,fontWeight:900,display:"flex",alignItems:"center",gap:8}}>
                {(()=>{ const I=LEVEL_ICONS[introLevel]; return I?<span style={{display:"flex",alignItems:"center"}}><I/></span>:null; })()} {d.label}
              </div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"clamp(26px,4vw,44px)",color:"#e8f0fe",marginBottom:16,lineHeight:1.2}}>{d.title}</div>
              <p style={{color:"#8899bb",fontSize:16,lineHeight:1.8,marginBottom:40,fontWeight:600}}>{d.sub}</p>
              <div className="intro-topics-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginBottom:40}}>
                {d.topics.map((t,i)=>(
                  <div key={i} style={{background:"rgba(5,11,26,0.6)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"18px 20px",display:"flex",gap:14,alignItems:"flex-start",boxShadow:"0 2px 6px rgba(0,0,0,.3)"}}>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,color:introLevel==="beginner"?"#16a34a":introLevel==="medium"?"#3b82f6":"#4f46e5",width:26,flexShrink:0}}>0{i+1}</div>
                    <div>
                      <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:15,color:"#e8f0fe",marginBottom:4}}>{t.title}</div>
                      <div style={{fontSize:13,color:"#8899bb",lineHeight:1.5,fontWeight:600}}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={()=>startLevel(introLevel)} style={{width:"100%",padding:16,borderRadius:12,border:"none",cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:16,letterSpacing:1,fontWeight:700,...btnStyles[d.btnClass],transition:"all .25s",boxShadow:"0 4px 0 rgba(0,0,0,.15)"}}>
                {d.btnText}
              </button>
            </div>
          );
        })()}

        {/* ── BEGINNER ── */}
        {screen==="beginner" && (
          <ModuleScreen level="beginner" steps={6} onBack={()=>openIntro("beginner")} xp={xp} onAddXP={addXP}
            stepComponent={({step,sharedProps,goPrev,goNext,done,xp,onBack})=>{
              const p={...sharedProps};
              if(step===0) return <BegStep0 {...p}/>;
              if(step===1) return <BegStep1 {...p}/>;
              if(step===2) return <BegStep2 {...p}/>;
              if(step===3) return <BegStep3 {...p}/>;
              if(step===4) return <BegStep4 {...p}/>;
              return <BegStep5 xp={dbXP} onHome={onBack} onNextLevel={()=>{
                if (dbXP >= XP_TO_UNLOCK_INTERMEDIATE) {
                  openIntro("medium");
                } else {
                  showToast(`Need ${XP_TO_UNLOCK_INTERMEDIATE} XP to unlock Intermediate (Current: ${dbXP} XP)`);
                }
              }}/>;
            }}
          />
        )}

        {/* ── MEDIUM ── */}
        {screen==="medium" && (
          <ModuleScreen level="medium" steps={5} onBack={()=>openIntro("medium")} xp={xp} onAddXP={addXP}
            stepComponent={({step,sharedProps,xp,onBack})=>{
              const p={...sharedProps};
              if(step===0) return <MedStep0 {...p}/>;
              if(step===1) return <MedStep1 {...p}/>;
              if(step===2) return <MedStep2 {...p}/>;
              if(step===3) return <MedStep3 {...p}/>;
              return <MedStep4 xp={xp} onHome={onBack} onNextLevel={()=>openIntro("advanced")}/>;
            }}
          />
        )}

        {/* ── ADVANCED ── */}
        {screen==="advanced" && (
          <ModuleScreen level="advanced" steps={5} onBack={()=>openIntro("advanced")} xp={xp} onAddXP={addXP}
            stepComponent={({step,sharedProps,xp,onBack})=>{
              const p={...sharedProps};
              if(step===0) return <AdvStep0 {...p}/>;
              if(step===1) return <AdvStep1 {...p}/>;
              if(step===2) return <AdvStep2 {...p}/>;
              if(step===3) return <AdvStep3 {...p}/>;
              return <AdvStep4 xp={xp} onHome={onBack}/>;
            }}
          />
        )}
      </div>
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  );
}
