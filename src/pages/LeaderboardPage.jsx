import { useState, useEffect, useRef } from "react";
import authService from "../services/authService";

const CSS = `
@keyframes podiumRise{from{opacity:0;transform:scaleY(0) translateY(30px)}to{opacity:1;transform:scaleY(1) translateY(0)}}
@keyframes crownSpin{0%,100%{transform:rotateY(0deg) scale(1)}50%{transform:rotateY(20deg) scale(1.05)}}
@keyframes rowSlide{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
@keyframes xpBar{from{width:0}to{width:var(--w)}}
@keyframes avatarPulse{0%,100%{box-shadow:0 0 0 0 var(--ac)}50%{box-shadow:0 0 0 6px transparent}}
@keyframes rankGlow{0%,100%{text-shadow:0 0 10px currentColor}50%{text-shadow:0 0 25px currentColor,0 0 50px currentColor}}
@keyframes firework{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--fx),var(--fy)) scale(0);opacity:0}}
@keyframes streakFire{0%,100%{transform:scale(1)}50%{transform:scale(1.2) rotate(5deg)}}
@keyframes holoPodium{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.podium-bar{animation:podiumRise .8s cubic-bezier(.34,1.56,.64,1) both;transform-origin:bottom}
.lb-row{animation:rowSlide .5s cubic-bezier(.22,1,.36,1) both}
.lb-xp{animation:xpBar 1.2s cubic-bezier(.4,0,.2,1) both}
`;

const RANK_COLORS=["#FFD700","#C0C0C0","#CD7F32"];
const RANK_GLOW=["rgba(255,215,0,.5)","rgba(192,192,192,.4)","rgba(205,127,50,.4)"];
const TROPHIES=["🥇","🥈","🥉"];
const PODIUM_HEIGHTS=[180,220,155];
const PODIUM_ORDER=[1,0,2]; // silver, gold, bronze left to right

function Fireworks({color}){
  const parts=Array.from({length:8},(_,i)=>({angle:(i/8)*360,r:30+Math.random()*20}));
  return(
    <div style={{position:"absolute",top:"20%",left:"50%",pointerEvents:"none",zIndex:0}}>
      {parts.map((p,i)=>(
        <div key={i} style={{position:"absolute",width:4,height:4,borderRadius:"50%",background:color,
          "--fx":`${Math.cos(p.angle*Math.PI/180)*p.r}px`,
          "--fy":`${Math.sin(p.angle*Math.PI/180)*p.r}px`,
          animation:`firework 1.5s ease-out ${i*.1}s infinite`,transform:"translate(-50%,-50%)",
        }}/>
      ))}
    </div>
  );
}

function PodiumPillar({user,rank,height,delay,maxXp}){
  const color=RANK_COLORS[rank];
  const glow=RANK_GLOW[rank];
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:0,zIndex:rank===0?10:5}}>
      {/* User info above pillar */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:12,animation:`fiu .6s ease ${delay+.2}s both`}}>
        {rank===0&&<div style={{fontSize:"1.5rem",marginBottom:4,animation:"crownSpin 3s ease-in-out infinite"}}>👑</div>}
        <div style={{position:"relative"}}>
          <div style={{width:rank===0?64:52,height:rank===0?64:52,borderRadius:"50%",
            background:`linear-gradient(135deg,${color}30,${color}10)`,
            border:`2px solid ${color}`,boxShadow:`0 0 20px ${glow},inset 0 1px 0 rgba(255,255,255,.2)`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:rank===0?".9rem":".75rem",
            color:color,
            "--ac":glow,animation:"avatarPulse 2.5s ease-in-out infinite",
          }}>{user.avatar}</div>
          {rank===0&&<Fireworks color={color}/>}
        </div>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:rank===0?".85rem":".72rem",color:rank===0?"#e8f0fe":"#8899bb",marginTop:6,letterSpacing:".04em"}}>{user.name}</div>
        <div style={{fontSize:".6rem",color:color,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{user.xp.toLocaleString()} XP</div>
        <div style={{fontSize:".5rem",color:"#8899bb",marginTop:2}}>{user.streak}🔥 streak</div>
      </div>
      {/* Pillar */}
      <div className="podium-bar" style={{
        animationDelay:`${delay}s`,
        width:rank===0?90:70,height:height,borderRadius:"8px 8px 0 0",
        position:"relative",overflow:"hidden",
        background:`linear-gradient(180deg,${color}22 0%,${color}08 60%,rgba(0,0,0,.3) 100%)`,
        border:`1px solid ${color}40`,borderBottom:"none",
        boxShadow:`0 -10px 40px ${glow},inset 0 1px 0 rgba(255,255,255,.15)`,
      }}>
        {/* Animated gradient */}
        <div style={{position:"absolute",inset:0,background:`linear-gradient(270deg,${color}15,transparent,${color}15)`,backgroundSize:"200% 100%",animation:"holoPodium 3s ease infinite"}}/>
        {/* Rank number */}
        <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.6rem",color:`${color}88`,animation:"rankGlow 2s ease-in-out infinite"}}>{TROPHIES[rank]}</div>
        {/* XP fill bar */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:`${(user.xp/maxXp)*100}%`,background:`linear-gradient(180deg,transparent,${color}15)`,transition:"height 1.5s ease"}}/>
        {/* Shimmer */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(255,255,255,.06) 0%,transparent 50%,rgba(0,0,0,.2) 100%)"}}/>
      </div>
    </div>
  );
}

export default function LeaderboardPage(){
  const [hov,setHov]=useState(null);
  const [visible,setVisible]=useState(false);
  const [leaderboard,setLeaderboard]=useState([]);
  const [loading,setLoading]=useState(true);
  const [currentUser,setCurrentUser]=useState(null);

  useEffect(()=>{
    const fetchLeaderboard = async () => {
      try {
        const data = await authService.getLeaderboard();
        const user = authService.getCurrentUser();
        
        // Mark current user in leaderboard
        const updatedLeaderboard = data.map(entry => ({
          ...entry,
          isUser: user && entry.name === user.name
        }));
        
        setLeaderboard(updatedLeaderboard);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        // Fallback to empty array
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const t=setTimeout(()=>setVisible(true),100);
    return()=>clearTimeout(t);
  }, []);

  const maxXp=leaderboard.length > 0 ? leaderboard[0].xp : 0;
  const podiumOrder=leaderboard.length > 0 ? PODIUM_ORDER.map(i=>({
    user:leaderboard[i] || {rank:i+1,name:'---',xp:0,planets:0,avatar:'??',streak:0}, 
    rank:i
  })) : [];

  return(
    <div style={{minHeight:"100vh",paddingTop:90,paddingBottom:60,padding:"90px 28px 60px",maxWidth:1100,margin:"0 auto"}}>
      <style>{CSS}</style>
      {/* Header */}
      <div style={{marginBottom:44,animation:"fiu .6s ease forwards"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 14px",borderRadius:20,background:"rgba(255,179,71,.08)",border:"1px solid rgba(255,179,71,.22)",marginBottom:14}}>
          <span style={{fontSize:".6rem",letterSpacing:".2em",color:"#FFB347",fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>⚡ GALACTIC RANKINGS</span>
        </div>
        <h1 style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(2rem,4vw,3.4rem)",letterSpacing:".04em",background:"linear-gradient(135deg,#e8f0fe 0%,#FFB347 60%,#FFD54F 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>LEADERBOARD</h1>
      </div>

      {/* 3D Podium */}
      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:6,marginBottom:48,padding:"0 0 0",overflow:"hidden"}}>
        {podiumOrder.map(({user,rank},i)=>(
          <PodiumPillar key={rank} user={user} rank={rank} height={PODIUM_HEIGHTS[i]} delay={i*.1} maxXp={maxXp}/>
        ))}
      </div>

      {/* Table */}
      <div style={{borderRadius:22,overflow:"hidden",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",backdropFilter:"blur(14px)"}}>
        {/* Header */}
        <div style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr 90px 90px",padding:"12px 22px",background:"rgba(255,255,255,.04)",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
          {["RANK","PILOT","XP","PLANETS","STREAK"].map(h=>(
            <span key={h} style={{fontSize:".54rem",letterSpacing:".15em",color:"#8899bb",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,textAlign:h==="RANK"||h==="PILOT"?"left":"right"}}>{h}</span>
          ))}
        </div>
        {/* Rows */}
        {loading ? (
          <div style={{padding:"40px",textAlign:"center",color:"#8899bb"}}>
            Loading leaderboard...
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{padding:"40px",textAlign:"center",color:"#8899bb"}}>
            No leaderboard data available. Complete some games to see your ranking!
          </div>
        ) : (
          leaderboard.map((u,i)=>{
          const rankColor=i<3?RANK_COLORS[i]:null;
          const isHov=hov===i;
          return(
            <div key={u.rank} className="lb-row" style={{animationDelay:`${.1+i*.06}s`,
              display:"grid",gridTemplateColumns:"60px 1fr 1fr 90px 90px",padding:"14px 22px",alignItems:"center",
              borderBottom:"1px solid rgba(255,255,255,.04)",
              background:u.isUser?"rgba(74,158,255,.06)":isHov?"rgba(255,255,255,.03)":"transparent",
              transition:"background .2s",cursor:"default",position:"relative",
            }}
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
            >
              {/* User highlight edge */}
              {u.isUser&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:"linear-gradient(180deg,#4A9EFF,#A8D8EA)",borderRadius:"0 2px 2px 0"}}/>}
              {/* Rank */}
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                {i<3
                  ?<span style={{fontSize:"1.2rem"}}>{TROPHIES[i]}</span>
                  :<span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1rem",color:"rgba(255,255,255,.3)"}}>#{u.rank}</span>
                }
              </div>
              {/* Avatar + name */}
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:36,height:36,borderRadius:"50%",flexShrink:0,
                  background:rankColor?`linear-gradient(135deg,${rankColor}30,${rankColor}10)`:u.isUser?"rgba(74,158,255,.2)":"rgba(255,255,255,.06)",
                  border:`2px solid ${rankColor||( u.isUser?"rgba(74,158,255,.5)":"rgba(255,255,255,.1)")}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".7rem",
                  color:rankColor||( u.isUser?"#4A9EFF":"#8899bb"),
                  boxShadow:rankColor?`0 0 12px ${RANK_GLOW[i]}`:"none",
                  animation:i===0?"avatarPulse 2s infinite":"none","--ac":RANK_GLOW[0],
                }}>{u.avatar}</div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:".85rem",color:u.isUser?"#4A9EFF":"#e8f0fe"}}>{u.name}</span>
                    {u.isUser&&<span style={{fontSize:".46rem",padding:"1px 6px",borderRadius:10,background:"rgba(74,158,255,.18)",color:"#4A9EFF",border:"1px solid rgba(74,158,255,.3)",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".1em"}}>YOU</span>}
                    {i===0&&<span style={{fontSize:".46rem",padding:"1px 6px",borderRadius:10,background:"rgba(255,215,0,.15)",color:"#FFD700",border:"1px solid rgba(255,215,0,.3)",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".1em"}}>CHAMPION</span>}
                  </div>
                  <div style={{fontSize:".5rem",color:"#8899bb",marginTop:1}}>{"◎".repeat(Math.min(u.planets,5))} · Level {7+i}</div>
                </div>
              </div>
              {/* XP with mini bar */}
              <div style={{textAlign:"right",paddingRight:16}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".88rem",color:rankColor||( u.isUser?"#4A9EFF":"#e8f0fe")}}>{u.xp.toLocaleString()}</div>
                <div style={{marginTop:4,height:3,borderRadius:2,background:"rgba(255,255,255,.06)",overflow:"hidden"}}>
                  <div className="lb-xp" style={{"--w":`${(u.xp/maxXp)*100}%`,width:`${(u.xp/maxXp)*100}%`,height:"100%",borderRadius:2,background:rankColor||(u.isUser?"#4A9EFF":"rgba(255,255,255,.25)"),animationDelay:`${.4+i*.06}s`}}/>
                </div>
              </div>
              {/* Planets */}
              <div style={{textAlign:"right"}}>
                <div style={{display:"flex",justifyContent:"flex-end",gap:3}}>
                  {Array.from({length:u.planets}).map((_,pi)=>(
                    <div key={pi} style={{width:8,height:8,borderRadius:"50%",background:rankColor||"rgba(74,158,255,.5)",boxShadow:rankColor?`0 0 4px ${rankColor}`:"none"}}/>
                  ))}
                </div>
              </div>
              {/* Streak */}
              <div style={{textAlign:"right"}}>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".82rem",color:u.streak>30?"#FF6B35":u.streak>20?"#FFB347":"#8899bb"}}>{u.streak}</span>
                <span style={{fontSize:".9rem",animation:u.streak>20?"streakFire .8s ease-in-out infinite":"none",display:"inline-block",marginLeft:2}}>🔥</span>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
