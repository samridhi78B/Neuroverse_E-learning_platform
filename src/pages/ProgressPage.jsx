import { useState, useEffect, useRef } from "react";
import { PLANETS, BADGES } from "../App";
import authService from "../services/authService";

const CSS = `
@keyframes orbitSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes orbitRevSpin{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
@keyframes progressIn{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes barReveal{from{width:0}to{width:var(--pw)}}
@keyframes numberCount{0%{transform:translateY(10px);opacity:0}100%{transform:translateY(0);opacity:1}}
@keyframes glassFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes hexIn{from{opacity:0;transform:scale(.4) rotate(45deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}
@keyframes cardFlip{from{opacity:0;transform:perspective(400px) rotateY(-25deg) translateY(20px)}to{opacity:1;transform:perspective(400px) rotateY(0deg) translateY(0)}}
@keyframes particleFloat{0%{transform:translate(0,0);opacity:0}20%{opacity:1}100%{transform:translate(var(--px),var(--py));opacity:0}}
@keyframes radarSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes radarPing{0%{transform:scale(.3);opacity:.9}100%{transform:scale(1.4);opacity:0}}
.prog-bar{animation:barReveal 1.4s cubic-bezier(.4,0,.2,1) both}
.prog-card{animation:cardFlip .6s cubic-bezier(.22,1,.36,1) both}
.stat-hex{animation:hexIn .5s cubic-bezier(.34,1.56,.64,1) both}
`;

function useCountUp(target,duration=1200,start=true){
  const [val,setVal]=useState(0);
  const frame=useRef();
  useEffect(()=>{
    if(!start)return;
    const s=performance.now();
    const tick=(now)=>{
      const p=Math.min((now-s)/duration,1);
      const ease=1-Math.pow(1-p,3);
      setVal(Math.floor(target*ease));
      if(p<1)frame.current=requestAnimationFrame(tick);
    };
    frame.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame.current);
  },[target,duration,start]);
  return val;
}

function Planet3D({planet,size=60}){
  const r=size/2,c=planet;
  return(
    <svg width={size+30} height={size+25} viewBox={`0 0 ${size+30} ${size+25}`}>
      <defs>
        <radialGradient id={`ppg${c.id}`} cx="34%" cy="28%" r="70%">
          <stop offset="0%" stopColor={c.grad[2]} stopOpacity=".92"/>
          <stop offset="60%" stopColor={c.grad[1]} stopOpacity=".87"/>
          <stop offset="100%" stopColor={c.grad[0]} stopOpacity=".95"/>
        </radialGradient>
        <radialGradient id={`psp${c.id}`} cx="29%" cy="24%" r="38%">
          <stop offset="0%" stopColor="white" stopOpacity=".22"/><stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <clipPath id={`pcl${c.id}`}><circle cx={r+15} cy={r+5} r={r}/></clipPath>
      </defs>
      <ellipse cx={r+15} cy={r+5+r*.15} rx={r*1.5} ry={r*.2} fill="none" stroke={c.ring1} strokeWidth="1.5"
        style={{animation:'ringSpin 18s linear infinite',transformOrigin:`${r+15}px ${r+5+r*.15}px`}}/>
      <circle cx={r+15} cy={r+5} r={r} fill={`url(#ppg${c.id})`}/>
      <g clipPath={`url(#pcl${c.id})`}>
        <ellipse cx={r+15} cy={r} rx={r*.9} ry={r*.1} fill={`${c.grad[2]}25`}/>
        <ellipse cx={r+10} cy={r+12} rx={r*.7} ry={r*.08} fill={`${c.grad[2]}18`}/>
      </g>
      <circle cx={r+15} cy={r+5} r={r} fill={`url(#psp${c.id})`}/>
    </svg>
  );
}

function RadarChart({planets}){
  const cx=120,cy=120,r=80;
  const n=planets.length;
  const angles=planets.map((_,i)=>((i/n)*2*Math.PI)-Math.PI/2);
  const getPoint=(angle,dist)=>({x:cx+dist*Math.cos(angle),y:cy+dist*Math.sin(angle)});
  const gridLevels=[0.25,0.5,0.75,1];
  const dataPoints=planets.map((p,i)=>{
    const pct=p.checkpoints.filter(c=>c.number<p.activeLevel).length/p.checkpoints.length;
    return getPoint(angles[i],pct*r);
  });
  const polyPath=dataPoints.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ")+"Z";
  return(
    <svg width={240} height={240} viewBox="0 0 240 240">
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4A9EFF" stopOpacity=".3"/>
          <stop offset="100%" stopColor="#4A9EFF" stopOpacity=".05"/>
        </radialGradient>
        <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A9EFF" stopOpacity=".8"/>
          <stop offset="100%" stopColor="#A8D8EA" stopOpacity=".8"/>
        </linearGradient>
      </defs>
      {/* Grid */}
      {gridLevels.map((lv,li)=>(
        <polygon key={li} points={angles.map(a=>{ const p=getPoint(a,r*lv);return`${p.x},${p.y}`; }).join(" ")}
          fill="none" stroke={`rgba(255,255,255,${.04+li*.02})`} strokeWidth="1"/>
      ))}
      {/* Spokes */}
      {angles.map((a,i)=>{
        const p=getPoint(a,r);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,.06)" strokeWidth="1"/>;
      })}
      {/* Radar sweep */}
      <g style={{animation:"radarSpin 6s linear infinite",transformOrigin:`${cx}px ${cy}px`}}>
        <line x1={cx} y1={cy} x2={cx} y2={cy-r} stroke="rgba(74,158,255,.5)" strokeWidth="1.5"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(74,158,255,.04)" strokeWidth={r*2} strokeDasharray={`${r*Math.PI/2} ${r*Math.PI*2}`} strokeDashoffset="0"/>
      </g>
      {/* Data shape */}
      <path d={polyPath} fill="url(#radarFill)" stroke="url(#radarStroke)" strokeWidth="2" strokeLinejoin="round"/>
      {/* Data points */}
      {dataPoints.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={planets[i].color} style={{animation:`radarPing 2s ease-out ${i*.3}s infinite`}}/>
          <circle cx={p.x} cy={p.y} r={3} fill={planets[i].color}/>
        </g>
      ))}
      {/* Labels */}
      {angles.map((a,i)=>{
        const p=getPoint(a,r+18);
        return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill={planets[i].color} fontFamily="'Rajdhani',sans-serif" fontWeight="700">{planets[i].shortName}</text>;
      })}
      {/* Ping at center */}
      <circle cx={cx} cy={cy} r={3} fill="rgba(74,158,255,.8)"/>
    </svg>
  );
}

function PlanetProgressRow({planet,index,active}){
  const done=planet.checkpoints.filter(c=>c.number<planet.activeLevel).length;
  const total=planet.checkpoints.length;
  const pct=planet.progress !== undefined ? planet.progress : Math.round((done/total)*100); // Use progress prop if available, otherwise calculate from checkpoints
  const [hov,setHov]=useState(false);

  return(
    <div className="prog-card" style={{animationDelay:`${.1+index*.07}s`,position:"relative",borderRadius:16,padding:"16px 18px",marginBottom:10,
      background:hov?`linear-gradient(135deg,rgba(255,255,255,.07),${planet.color}08)`:"rgba(255,255,255,.04)",
      border:`1px solid ${hov?planet.color+"44":"rgba(255,255,255,.07)"}`,
      backdropFilter:"blur(10px)",cursor:"pointer",transition:"all .25s cubic-bezier(.34,1.2,.64,1)",
      transform:hov?"translateX(6px) scale(1.01)":"none",
      boxShadow:hov?`0 10px 30px ${planet.color}22,inset 0 1px 0 rgba(255,255,255,.1)`:"none",
    }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    >
      {/* Accent line */}
      <div style={{position:"absolute",left:0,top:"15%",bottom:"15%",width:3,borderRadius:"0 2px 2px 0",background:planet.color,opacity:hov?1:.4,transition:"opacity .2s",boxShadow:hov?`0 0 10px ${planet.color}`:"none"}}/>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        {/* Mini planet */}
        <div style={{flexShrink:0,filter:`drop-shadow(0 0 8px ${planet.color}66)`,transform:hov?"scale(1.1)":"scale(1)",transition:"transform .2s",animation:`orbFloat ${5+index*.3}s ease-in-out ${index*.2}s infinite`}}>
          <Planet3D planet={planet} size={36}/>
        </div>
        {/* Info */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div>
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".88rem",color:"#e8f0fe",letterSpacing:".04em"}}>{planet.name}</span>
              <span style={{marginLeft:8,fontSize:".52rem",color:planet.color,fontFamily:"'Rajdhani',sans-serif",letterSpacing:".1em",padding:"2px 6px",borderRadius:10,background:`${planet.color}18`,border:`1px solid ${planet.color}30`}}>{planet.currentLevel}</span>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem",color:planet.color}}>{pct}<span style={{fontSize:".5em",opacity:.7}}>%</span></div>
              <div style={{fontSize:".5rem",color:"#8899bb"}}>{done}/{total} LVL</div>
            </div>
          </div>
          {/* Progress track */}
          <div style={{height:7,borderRadius:4,background:"rgba(255,255,255,.06)",overflow:"hidden",position:"relative"}}>
            {/* Segmented background */}
            <div style={{position:"absolute",inset:0,backgroundImage:`repeating-linear-gradient(90deg,transparent,transparent ${100/total-1}%,rgba(0,0,0,.25) ${100/total-1}%,rgba(0,0,0,.25) ${100/total}%)`}}/>
            <div className="prog-bar" style={{"--pw":`${pct}%`,width:`${active?pct:0}%`,height:"100%",borderRadius:4,background:`linear-gradient(90deg,${planet.color}77,${planet.color},${planet.color}ee)`,boxShadow:`0 0 14px ${planet.color}88`,position:"relative",overflow:"hidden",animationDelay:`${.3+index*.1}s`}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)",animation:"shimmer 2s infinite"}}/>
            </div>
            {/* Milestone dots */}
            {[25,50,75].map(m=>(
              <div key={m} style={{position:"absolute",top:"50%",left:`${m}%`,transform:"translate(-50%,-50%)",width:5,height:5,borderRadius:"50%",background:pct>=m?planet.color:"rgba(255,255,255,.2)",boxShadow:pct>=m?`0 0 8px ${planet.color}`:""}}/>
            ))}
          </div>
          {/* Checkpoint pills */}
          {hov&&<div style={{display:"flex",gap:3,marginTop:6,flexWrap:"wrap"}}>
            {planet.checkpoints.map(cp=>(
              <div key={cp.number} style={{fontSize:".45rem",padding:"1px 5px",borderRadius:8,fontFamily:"'Rajdhani',sans-serif",
                background:cp.number<planet.activeLevel?`${planet.color}22`:cp.number===planet.activeLevel?`${planet.color}12`:"rgba(255,255,255,.04)",
                color:cp.number<planet.activeLevel?planet.color:cp.number===planet.activeLevel?"#e8f0fe":"#8899bb",
                border:`1px solid ${cp.number<planet.activeLevel?planet.color+"30":"rgba(255,255,255,.06)"}`,
              }}>{cp.label}</div>
            ))}
          </div>}
        </div>
        {/* XP badge */}
        <div style={{flexShrink:0,textAlign:"center",padding:"8px 10px",borderRadius:10,background:`${planet.color}0d`,border:`1px solid ${planet.color}20`}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".8rem",color:planet.color}}>{planet.xp}</div>
          <div style={{fontSize:".45rem",color:"#8899bb",letterSpacing:".08em"}}>XP</div>
        </div>
      </div>
    </div>
  );
}

function OrbitalMap({ planets }){
  const [rot,setRot]=useState(0);
  useEffect(()=>{
    const id=setInterval(()=>setRot(r=>(r+.3)%360),50);
    return()=>clearInterval(id);
  },[]);
  const displayPlanets = planets ? planets.slice(0,5) : PLANETS.slice(0,5);
  return(
    <div style={{position:"relative",width:260,height:260,flexShrink:0}}>
      {/* Rings */}
      {[100,80,60].map((rr,i)=>(
        <div key={i} style={{position:"absolute",top:"50%",left:"50%",transform:`translate(-50%,-50%)`,width:rr*2,height:rr*2,borderRadius:"50%",border:`1px solid rgba(74,158,255,${.06+i*.03})`}}/>
      ))}
      {/* Orbiting planets */}
      {displayPlanets.map((p,i)=>{
        const orb=55+i*18;
        const angle=(rot*(1+i*.2)+i*(360/5))*Math.PI/180;
        const x=130+orb*Math.cos(angle);
        const y=130+orb*Math.sin(angle);
        const done=p.checkpoints.filter(c=>c.number<p.activeLevel).length/p.checkpoints.length;
        const xpEarned = p.xp || 0;
        const baseSize = 8;
        // Size scales with XP up to a max of 20
        const size = baseSize + Math.min(12, xpEarned / 50);
        // Brightness (opacity) based on completion, from 0.4 to 1.0
        const opacity = 0.4 + (done * 0.6);
        return(
          <div key={p.id} style={{position:"absolute",transform:"translate(-50%,-50%)",left:x,top:y,zIndex:5}}>
            <div style={{width:size,height:size,borderRadius:"50%",background:p.color,boxShadow:`0 0 ${size}px ${p.color}`,opacity:opacity}}/>
          </div>
        );
      })}
      {/* Center */}
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#1a4a9a,#4A9EFF)",boxShadow:"0 0 20px rgba(74,158,255,.6)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:10,color:"white"}}>◉</span>
      </div>
      {/* Radar ping */}
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:30,height:30,borderRadius:"50%",border:"1px solid rgba(74,158,255,.5)",animation:"radarPing 2.5s ease-out infinite"}}/>
    </div>
  );
}

export default function ProgressPage(){
  const [userData, setUserData] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [resetting, setResetting] = useState(false);
  const ref = useRef();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          // Get fresh user data from backend
          const profile = await authService.getProfile();
          setUserData(profile.user);
          
          // Get user rank from leaderboard
          const leaderboard = await authService.getLeaderboard();
          const userEntry = leaderboard.find(entry => entry.name === user.name);
          setUserRank(userEntry ? userEntry.rank : null);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleResetXP = async () => {
    setResetting(true);
    try {
      await authService.resetXP();
      // Refetch user data after reset
      const profile = await authService.getProfile();
      setUserData(profile.user);
      
      // Update rank as well
      const leaderboard = await authService.getLeaderboard();
      const userEntry = leaderboard.find(entry => entry.name === profile.user.name);
      setUserRank(userEntry ? userEntry.rank : null);
      // Clear client-side unlocks for sorting game and notify components
      try {
        localStorage.setItem('sortingGameUnlockedLevels', '1');
        window.dispatchEvent(new CustomEvent('sortingGameReset'));
        
        // Clear all quiz scores and timestamps to allow XP earning again after reset
        const quizScoreKeys = Object.keys(localStorage).filter(key => key.startsWith('quiz_score_'));
        quizScoreKeys.forEach(key => localStorage.removeItem(key));
        
        // Also clear timestamp keys
        const quizTimestampKeys = Object.keys(localStorage).filter(key => key.startsWith('quiz_score_') && key.endsWith('_timestamp'));
        quizTimestampKeys.forEach(key => localStorage.removeItem(key));
        
        // Clear first quiz completion flag to allow badge popup again
        localStorage.removeItem('firstQuizCompleted');
        
        console.log('Cleared quiz scores and first quiz completion flag on reset');
      } catch (err) {
        console.warn('Unable to reset client-side locks:', err);
      }
    } catch (error) {
      console.error('Failed to reset XP:', error);
    } finally {
      setResetting(false);
    }
  };

  // Calculate values from real user data
  const txp = userData?.xp || 0;
  const level = userData?.level || 1;
  const nxp = level * 1000; // Next level XP
  const pct = Math.round(((txp % 1000) / 1000) * 100);
  const xpCount = useCountUp(txp, 1400, visible && !loading);

  
  const topStat=(label,value,color,delay)=>(
    <div className="stat-hex" style={{animationDelay:`${delay}s`,position:"relative",borderRadius:18,padding:"20px 16px",textAlign:"center",
      background:`linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.02))`,
      border:`1px solid ${color}35`,backdropFilter:"blur(12px)",
      boxShadow:`0 8px 32px ${color}18`,overflow:"hidden",
    }}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 0%,${color}15,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(1.4rem,2.5vw,2rem)",color:color,marginBottom:4}}>{value}</div>
      <div style={{fontSize:".58rem",color:"#8899bb",letterSpacing:".12em"}}>{label}</div>
    </div>
  );

  return(
    <>
      <div style={{minHeight:"100vh",paddingTop:90,paddingBottom:60,padding:"90px 28px 60px",maxWidth:1200,margin:"0 auto"}}>
        <style>{CSS}</style>
      {/* Header */}
      <div style={{marginBottom:40,animation:"fiu .6s ease forwards"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 14px",borderRadius:20,background:"rgba(74,158,255,.08)",border:"1px solid rgba(74,158,255,.22)",marginBottom:14}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:"#4A9EFF",boxShadow:"0 0 8px #4A9EFF",display:"inline-block",animation:"orbFloat 2s ease-in-out infinite"}}/>
          <span style={{fontSize:".6rem",letterSpacing:".2em",color:"#4A9EFF",fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>COMMAND DASHBOARD</span>
        </div>
        <h1 style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(2rem,4vw,3.4rem)",letterSpacing:".04em",background:"linear-gradient(135deg,#e8f0fe 0%,#4A9EFF 60%,#A8D8EA 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>NEUROVERSE PROGRESS</h1>
      </div>
      {/* XP Banner */}
      <div style={{borderRadius:22,padding:"28px 32px",marginBottom:28,position:"relative",overflow:"hidden",
        background:"linear-gradient(135deg,rgba(74,158,255,.12),rgba(74,158,255,.04))",
        border:"1px solid rgba(74,158,255,.25)",backdropFilter:"blur(16px)",
        animation:"progressIn .7s ease forwards",
      }}>
        <div style={{position:"absolute",top:0,right:0,bottom:0,width:"40%",background:"radial-gradient(ellipse at right center,rgba(74,158,255,.15),transparent 60%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.01) 20px,rgba(255,255,255,.01) 21px)",pointerEvents:"none"}}/>
        <div style={{display:"flex",alignItems:"center",gap:32,flexWrap:"wrap",position:"relative"}}>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:".6rem",letterSpacing:".2em",color:"rgba(74,158,255,.7)",fontFamily:"'Rajdhani',sans-serif",marginBottom:6}}>TOTAL EXPERIENCE POINTS</div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(2.5rem,5vw,3.8rem)",lineHeight:1,color:"#4A9EFF",letterSpacing:".02em",textShadow:"0 0 40px rgba(74,158,255,.4)"}}>
                {xpCount.toLocaleString()}<span style={{fontSize:"40%",color:"rgba(74,158,255,.5)",marginLeft:8}}>XP</span>
              </div>
              <button 
                onClick={handleResetXP}
                disabled={resetting}
                style={{
                  padding:"6px 12px",
                  borderRadius:8,
                  fontSize:".7rem",
                  fontFamily:"'Rajdhani',sans-serif",
                  fontWeight:600,
                  cursor:resetting?"not-allowed":"pointer",
                  border:"1px solid rgba(255,68,68,.4)",
                  color:resetting?"#999":"#ff4444",
                  background:resetting?"rgba(255,255,255,.05)":"rgba(255,68,68,.08)",
                  transition:"all .2s ease"
                }}
              >
                {resetting ? "Resetting..." : "Reset XP"}
              </button>
            </div>
          </div>
          <div style={{flex:2,minWidth:250}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:".6rem",color:"#8899bb",marginBottom:8,fontFamily:"'Rajdhani',sans-serif",letterSpacing:".08em"}}>
              <span>LEVEL {level}</span><span style={{color:"#4A9EFF"}}>{pct}% TO LEVEL {level + 1}</span><span>{(txp % 1000).toLocaleString()}/{1000} XP</span>
            </div>
            <div style={{height:12,borderRadius:6,background:"rgba(255,255,255,.06)",overflow:"hidden",position:"relative",boxShadow:"inset 0 2px 4px rgba(0,0,0,.3)"}}>
              <div style={{width:`${pct}%`,height:"100%",borderRadius:6,background:"linear-gradient(90deg,#0d47a1,#1565c0,#4A9EFF,#64B5F6)",boxShadow:"0 0 20px rgba(74,158,255,.6)",position:"relative",overflow:"hidden",transition:"width 1.5s cubic-bezier(.4,0,.2,1)"}}>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)",animation:"shimmer 2s 1s infinite"}}/>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:".54rem",color:"rgba(255,255,255,.3)",marginTop:4}}>
              {[0,25,50,75,100].map(m=><span key={m}>{m}%</span>)}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.8rem",color:"#8899bb",lineHeight:1}}>BADGES</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"3rem",color:"#4A9EFF",lineHeight:1}}>{BADGES.filter(b=>b.earned).length}</div>
            <div style={{fontSize:".55rem",color:"#8899bb"}}>of all pilots</div>
          </div>
        </div>
      </div>
      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
        {topStat("TOTAL XP",txp.toLocaleString(),"#FFB347",.1)}
        {topStat("CURRENT LEVEL",level,"#A8D8EA",.18)}
        {topStat("PROGRESS",`${pct}%`,"#C8A2FF",.26)}
      </div>
      {/* Main 2-col */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:22,alignItems:"start"}}>
        {/* Planet progress list - All planets */}
        <div>
          <div style={{fontSize:".6rem",letterSpacing:".2em",color:"#8899bb",fontFamily:"'Rajdhani',sans-serif",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
            <div style={{flex:1,height:1,background:"rgba(255,255,255,.06)"}}/>
            PLANET MASTERY
            <div style={{flex:1,height:1,background:"rgba(255,255,255,.06)"}}/>
          </div>
          {loading ? (
            <div style={{padding:"40px",textAlign:"center",color:"#8899bb"}}>
              Loading progress data...
            </div>
          ) : (
            PLANETS.map((p,i)=>{
              // Calculate dynamic lessons for DSA
              const getDynamicLessons = (planetId) => {
                const pXP = (userData?.planetXP && userData.planetXP[planetId]) || 0;
                const currentLevel = Math.floor(pXP / 1000) + 1;
                return p.lessons.map((lesson, index) => {
                  const lessonNumber = index + 1; // Lesson 1, 2, 3, 4...
                  if (lessonNumber < currentLevel) {
                    return { ...lesson, status: "complete" };
                  } else if (lessonNumber === currentLevel) {
                    return { ...lesson, status: "active" };
                  } else {
                    return { ...lesson, status: "upcoming" };
                  }
                });
              };
              
              const pXP = (userData?.planetXP && userData.planetXP[p.id]) || 0;
              const pLevel = Math.floor(pXP / 1000) + 1;
              const activeLevel = Math.min(pLevel, p.checkpoints.length);
              
              return <PlanetProgressRow key={p.id} planet={{
                ...p,
                lessons: getDynamicLessons(p.id),
                xp: pXP, 
                activeLevel: activeLevel, 
                currentLevel: pXP > 0 ? `Level ${pLevel}` : "Level 0",
                progress: pXP > 0 ? Math.round(((pXP % 1000) / 1000) * 100) : 0 
              }} index={i} active={visible}/>;
            })
          )}
        </div>
        {/* Right: Radar + Orbital */}
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          {/* Radar */}
          <div style={{borderRadius:20,padding:"20px 16px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",backdropFilter:"blur(12px)",textAlign:"center",animation:"cardFlip .7s ease .4s both"}}>
            <div style={{fontSize:".58rem",letterSpacing:".18em",color:"#8899bb",fontFamily:"'Rajdhani',sans-serif",marginBottom:10}}>MASTERY RADAR</div>
            <div style={{display:"flex",justifyContent:"center"}}><RadarChart planets={PLANETS.map(p => {
              const pXP = (userData?.planetXP && userData.planetXP[p.id]) || 0;
              return {
                ...p,
                activeLevel: Math.min(Math.floor(pXP / 1000) + 1, p.checkpoints.length)
              };
            })} /></div>
          </div>
          {/* Orbital */}
          <div style={{borderRadius:20,padding:"20px 16px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",backdropFilter:"blur(12px)",textAlign:"center",animation:"cardFlip .7s ease .55s both"}}>
            <div style={{fontSize:".58rem",letterSpacing:".18em",color:"#8899bb",fontFamily:"'Rajdhani',sans-serif",marginBottom:10}}>ORBITAL VIEW</div>
            <div style={{display:"flex",justifyContent:"center"}}><OrbitalMap planets={PLANETS.map(p => {
              const pXP = (userData?.planetXP && userData.planetXP[p.id]) || 0;
              return {
                ...p,
                xp: pXP,
                activeLevel: Math.min(Math.floor(pXP / 1000) + 1, p.checkpoints.length)
              };
            })} /></div>
            <div style={{fontSize:".52rem",color:"#8899bb",marginTop:8,lineHeight:1.6}}>Planet size = XP earned<br/>Brightness = completion</div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
