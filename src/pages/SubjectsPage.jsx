import { useState, useRef, useEffect } from "react";
import { PLANETS } from "../App";
import authService from "../services/authService";

const CSS = `
@keyframes cardIn{from{opacity:0;transform:translateY(50px) rotateX(20deg) scale(.92)}to{opacity:1;transform:translateY(0) rotateX(0) scale(1)}}
@keyframes holoBorder{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes scanPulse{0%{top:-10%;opacity:0}20%{opacity:.7}80%{opacity:.7}100%{top:110%;opacity:0}}
@keyframes orbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes ringExpand{0%{transform:scale(.7);opacity:.8}100%{transform:scale(1.9);opacity:0}}
@keyframes dataFlow{0%,100%{opacity:0}30%,70%{opacity:1}100%{transform:translateY(20px)}}
@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
@keyframes glitch{0%,90%,100%{transform:translate(0)}92%{transform:translate(-2px,1px)}94%{transform:translate(2px,-1px)}96%{transform:translate(-1px,2px)}}
@keyframes xpBar{from{width:0!important}to{}}
.planet-card{animation:cardIn .7s cubic-bezier(.22,1,.36,1) both}
.planet-card:hover .scan-line{animation:scanPulse 2s ease-in-out infinite}
.enter-btn{opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s;visibility:hidden}
.planet-card:hover .enter-btn{opacity:1;transform:translateY(0);visibility:visible}
.badge-row{opacity:0;visibility:hidden;transition:opacity .4s .1s,visibility .4s .1s}
.planet-card:hover .badge-row{opacity:1;visibility:visible}
.scan-line{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);pointer-events:none;z-index:6;top:-10%;transition:none}
.holo-border{background:linear-gradient(270deg,#4A9EFF,#A8D8EA,#4DFFC3,#FFB347,#FF6B9D,#4A9EFF);background-size:400% 400%;animation:holoBorder 4s ease infinite}
.shimmer-line{position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none}
.shimmer-line::after{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);animation:shimmer 3s infinite}
`;

function Planet3D({planet,size=160}){
  const r=size/2,c=planet;
  return(
    <svg width={size+70} height={size+55} viewBox={`0 0 ${size+70} ${size+55}`}>
      <defs>
        <radialGradient id={`spg${c.id}`} cx="34%" cy="28%" r="70%">
          <stop offset="0%" stopColor={c.grad[2]} stopOpacity=".92"/>
          <stop offset="38%" stopColor={c.grad[1]} stopOpacity=".87"/>
          <stop offset="72%" stopColor={c.grad[0]} stopOpacity=".92"/>
          <stop offset="100%" stopColor={c.grad[3]} stopOpacity=".96"/>
        </radialGradient>
        <radialGradient id={`ssp${c.id}`} cx="29%" cy="24%" r="38%">
          <stop offset="0%" stopColor="white" stopOpacity=".2"/><stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <clipPath id={`scl${c.id}`}><circle cx={r+35} cy={r+8} r={r}/></clipPath>
      </defs>
      <ellipse cx={r+35} cy={r+8+r*.12} rx={r*1.55} ry={r*.22} fill="none" stroke={c.ring1} strokeWidth="2.5"
        style={{animation:'ringSpin 20s linear infinite',transformOrigin:`${r+35}px ${r+8+r*.12}px`}}/>
      <ellipse cx={r+35} cy={r+8+r*.12} rx={r*1.72} ry={r*.29} fill="none" stroke={c.ring2} strokeWidth="7" strokeDasharray="4 9"
        style={{animation:'ringSpinR 30s linear infinite',transformOrigin:`${r+35}px ${r+8+r*.12}px`}}/>
      <circle cx={r+35} cy={r+8} r={r} fill={`url(#spg${c.id})`}/>
      <g clipPath={`url(#scl${c.id})`}>
        <ellipse cx={r+35} cy={r-6} rx={r*.94} ry={r*.11} fill={`${c.grad[2]}28`}/>
        <ellipse cx={r+25} cy={r+18} rx={r*.8} ry={r*.09} fill={`${c.grad[2]}20`}/>
        <ellipse cx={r+45} cy={r+44} rx={r*.68} ry={r*.07} fill={`${c.grad[2]}18`}/>
      </g>
      <circle cx={r+35} cy={r+8} r={r} fill={`url(#ssp${c.id})`}/>
    </svg>
  );
}

function PlanetCard({planet,index,onOpen,userData}){
  const cardRef=useRef(null);
  const [tilt,setTilt]=useState({x:0,y:0,gx:50,gy:50});
  const [hov,setHov]=useState(false);

  // Count completed checkpoints from user data
  // Completed checkpoints are those whose number is <= the user's current level for that planet
  const completedCheckpoints = planet.checkpoints.filter(cp => {
    if (!userData) return false;
    // Check if this checkpoint is marked complete in user progress
    // userData.progress is expected to be an object: { [planetId]: { completedCheckpoints: number[] } }
    const planetProgress = userData.progress?.[planet.id];
    if (!planetProgress) return false;
    const completed = planetProgress.completedCheckpoints || [];
    return completed.includes(cp.number);
  });

  const done = completedCheckpoints.length;
  const total = planet.checkpoints.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // XP earned for this planet specifically
  const planetXP = userData?.progress?.[planet.id]?.xp || 0;

  // Level for this planet
  const planetLevel = Math.floor(planetXP / 1000) + 1;

  // Dynamic lessons: mark complete/active/upcoming based on done count
  const dynamicLessons = planet.lessons.map((lesson, i) => {
    if (i < done) return { ...lesson, status: "complete" };
    if (i === done) return { ...lesson, status: "active" };
    return { ...lesson, status: "upcoming" };
  });

  const handleMouseMove=(e)=>{
    const rect=cardRef.current.getBoundingClientRect();
    const dx=(e.clientX-rect.left)/rect.width;
    const dy=(e.clientY-rect.top)/rect.height;
    setTilt({x:(dy-.5)*-18,y:(dx-.5)*18,gx:dx*100,gy:dy*100});
  };

  return(
    <div className="planet-card" ref={cardRef} style={{animationDelay:`${index*.08}s`,position:"relative",borderRadius:22,cursor:"pointer",transformStyle:"preserve-3d",
      transform:`perspective(900px) rotateX(${hov?tilt.x:0}deg) rotateY(${hov?tilt.y:0}deg) translateZ(${hov?12:0}px)`,
      transition:hov?"transform .1s ease":"transform .4s cubic-bezier(.34,1.2,.64,1)",
      boxShadow:hov?`0 35px 70px -10px ${planet.color}55,0 15px 35px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.15)`:"0 8px 30px rgba(0,0,0,.5)",
    }}
      onMouseMove={handleMouseMove} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setTilt({x:0,y:0,gx:50,gy:50});}}
      onClick={()=>onOpen(planet)}
    >
      {/* Holographic border */}
      <div style={{position:"absolute",inset:-1,borderRadius:23,padding:1,background:hov?`radial-gradient(farthest-corner at ${tilt.gx}% ${tilt.gy}%, ${planet.color}88, ${planet.color}22 40%, transparent 70%)`:`${planet.color}22`,zIndex:0}}>
        <div style={{width:"100%",height:"100%",borderRadius:22,background:"#07101f"}}/>
      </div>
      {/* Inner card */}
      <div style={{position:"relative",zIndex:1,borderRadius:22,padding:"24px 20px 20px",overflow:"hidden",
        background:`linear-gradient(145deg, rgba(255,255,255,.06) 0%, rgba(${planet.color.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',')},0.04) 50%, rgba(0,0,0,.2) 100%)`,
        backdropFilter:"blur(14px)",
      }}>
        <div className="scan-line"/>
        <div className="shimmer-line"/>
        {/* Hex grid bg */}
        <div style={{position:"absolute",inset:0,opacity:hov?.07:.03,backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='46'%3E%3Cpath d='M20 2l18 10v22L20 44 2 34V12L20 2z' fill='none' stroke='white' stroke-width='.5'/%3E%3C/svg%3E\")",transition:"opacity .3s"}}/>
        {/* Glow orb bg */}
        <div style={{position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",width:180,height:180,borderRadius:"50%",background:`radial-gradient(circle,${planet.glowColor} 0%,transparent 65%)`,opacity:hov?.8:.35,transition:"opacity .3s",pointerEvents:"none",animation:`orbFloat ${5+index*.5}s ease-in-out ${index*.3}s infinite`}}/>
        {/* Status */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,position:"relative",zIndex:2}}>
          <div style={{fontSize:".52rem",letterSpacing:".18em",color:planet.color,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,padding:"3px 8px",borderRadius:20,background:`${planet.color}18`,border:`1px solid ${planet.color}35`}}>
            {done > 0 ? "▶ ACTIVE" : "◉ START"}
          </div>
          <div style={{fontSize:".52rem",color:"#8899bb",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".1em"}}>{planet.checkpoints.length} LEVELS</div>
        </div>
        {/* Planet orb */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:10,position:"relative",zIndex:2}}>
          {hov&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:100,height:100,borderRadius:"50%",border:`1px solid ${planet.color}50`,animation:"ringExpand 1.5s ease-out infinite"}}/>}
          <div style={{animation:`orbFloat ${5+index*.4}s ease-in-out ${index*.2}s infinite`}}>
            <Planet3D planet={planet} size={88}/>
          </div>
        </div>
        {/* Name */}
        <div style={{textAlign:"center",marginBottom:16,position:"relative",zIndex:2}}>
          <h3 style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem",letterSpacing:".06em",color:"#e8f0fe",marginBottom:3,
            ...(hov?{textShadow:`0 0 20px ${planet.color}88`}:{})
          }}>{planet.name}</h3>
          <div style={{fontSize:".58rem",color:"#8899bb",letterSpacing:".1em"}}>{planet.shortName}</div>
        </div>
        {/* Stat chips */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:14,position:"relative",zIndex:2}}>
          {[
            {l:"DONE", v:`${done}/${total}`},
            {l:"XP",   v:planetXP.toLocaleString()},
            {l:"LVL",  v:`Lv.${planetLevel}`}
          ].map((s)=>(
            <div key={s.l} style={{textAlign:"center",padding:"7px 4px",borderRadius:10,background:`${planet.color}0a`,border:`1px solid ${planet.color}20`,transition:"all .2s",boxShadow:hov?`0 0 12px ${planet.color}22`:"none"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".9rem",color:planet.color}}>{s.v}</div>
              <div style={{fontSize:".48rem",color:"#8899bb",letterSpacing:".1em",marginTop:1}}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* XP Progress — single bar based on completed checkpoints */}
        <div style={{marginBottom:16,position:"relative",zIndex:2}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:".56rem",color:"#8899bb",marginBottom:5,fontFamily:"'Rajdhani',sans-serif",letterSpacing:".06em"}}>
            <span>MASTERY</span>
            <span style={{color:planet.color,fontWeight:600}}>{pct}%</span>
          </div>
          <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,.06)",overflow:"hidden",position:"relative"}}>
            <div style={{
              width:`${pct}%`,
              height:"100%",
              borderRadius:3,
              background:`linear-gradient(90deg,${planet.color}66,${planet.color},${planet.color}cc)`,
              boxShadow:`0 0 12px ${planet.color}88`,
              transition:"width .6s cubic-bezier(.22,1,.36,1), box-shadow .3s",
              position:"relative",
              overflow:"hidden",
            }}>
              {hov&&<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)",animation:"shimmer 1.5s infinite"}}/>}
            </div>
            {[25,50,75].map(t=>(
              <div key={t} style={{position:"absolute",top:0,left:`${t}%`,width:1,height:"100%",background:"rgba(0,0,0,.3)"}}/>
            ))}
          </div>
        </div>
        {/* Hover badges — only visible on hover via CSS .badge-row opacity */}
        <div className="badge-row" style={{display:"flex",gap:4,marginBottom:12,position:"relative",zIndex:2,pointerEvents:"none"}}>
          {dynamicLessons.slice(0,4).map((l,i)=>(
            <div key={i} style={{flex:1,height:3,borderRadius:2,
              background:l.status==="complete"?planet.color:l.status==="active"?`${planet.color}66`:"rgba(255,255,255,.1)"
            }}/>
          ))}
        </div>
        {/* Enter button — only visible on hover via CSS .enter-btn opacity */}
        <button className="enter-btn" style={{width:"100%",padding:"10px 0",borderRadius:12,
          background:`linear-gradient(135deg,${planet.color}30,${planet.color}15)`,
          border:`1px solid ${planet.color}55`,color:planet.color,fontSize:".65rem",
          fontFamily:"'Rajdhani',sans-serif",letterSpacing:".18em",fontWeight:700,
          cursor:"pointer",position:"relative",zIndex:2,
          boxShadow:`0 4px 20px ${planet.color}33`,
          visibility: hov ? "visible" : "hidden",
        }}>
          ENTER WORLD ›
        </button>
      </div>
    </div>
  );
}

export default function SubjectsPage({openPlanet}){
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profile = await authService.getProfile();
        setUserData(profile.user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return(
    <div style={{minHeight:"100vh",paddingTop:90,paddingBottom:60,padding:"90px 28px 60px",maxWidth:1300,margin:"0 auto"}}>
      <style>{CSS}</style>
      {/* Header */}
      <div style={{marginBottom:44,animation:"fiu .6s ease forwards"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 14px",borderRadius:20,background:"rgba(74,158,255,.08)",border:"1px solid rgba(74,158,255,.22)",marginBottom:14}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:"#4A9EFF",display:"inline-block",boxShadow:"0 0 8px #4A9EFF",animation:"orbFloat 2s ease-in-out infinite"}}/>
          <span style={{fontSize:".6rem",letterSpacing:".2em",color:"#4A9EFF",fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>7 WORLDS · CHOOSE YOUR PLANET</span>
        </div>
        <h1 style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(2rem,4vw,3.4rem)",letterSpacing:".04em",background:"linear-gradient(135deg,#e8f0fe 0%,#4A9EFF 60%,#A8D8EA 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>SUBJECT PLANETS</h1>
        <p style={{color:"#8899bb",fontSize:".8rem",maxWidth:480}}>Each planet is a subject domain. Hover to reveal details. Click to enter the island world and start your quest.</p>
      </div>
      {/* 3D card grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(272px,1fr))",gap:24,perspective:1200}}>
        {loading ? (
          <div style={{padding:"40px",textAlign:"center",color:"#8899bb"}}>Loading subjects...</div>
        ) : (
          PLANETS.map((planet,i)=>(
            <PlanetCard
              key={planet.id}
              planet={planet}
              index={i}
              onOpen={openPlanet}
              userData={userData}
            />
          ))
        )}
      </div>
    </div>
  );
}
