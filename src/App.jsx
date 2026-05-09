import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import SubjectsPage from "./pages/SubjectsPage";
import ProgressPage  from "./pages/ProgressPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import IslandPage from "./pages/IslandPage";
import NeuroVerseAuth from "./components/login/NeuroVerseAuth";
import SortingGame from "./components/SortingGame";
import MysqlQuest from "./components/quest/MysqlQuest";
import NeuroverseAbout from "./components/NeuroverseAbout";
import authService from "./services/authService";


// ─── SHARED DATA ─────────────────────────────────────────────────────────────
export const PLANETS = [
  { id:"dsa", name:"Data Structures & Algorithms", shortName:"DSA",
    color:"#4A9EFF", glowColor:"rgba(74,158,255,0.45)",
    grad:["#0d2a5e","#1a4a9a","#4A9EFF","#0a1a3a"],
    ring1:"rgba(74,158,255,0.55)", ring2:"rgba(74,158,255,0.2)",
    checkpoints:[{number:1,x:10,y:68,label:"Arrays"},{number:2,x:22,y:48,label:"Linked Lists"},{number:3,x:32,y:30,label:"Stacks"},{number:4,x:38,y:65,label:"Queues"},{number:5,x:50,y:46,label:"Trees"},{number:6,x:58,y:28,label:"Graphs"},{number:7,x:65,y:65,label:"Heaps"},{number:8,x:80,y:44,label:"DP"}],
    pathSegments:["M 10 68 Q 15 57 22 48","M 22 48 Q 26 38 32 30","M 32 30 Q 34 47 38 65","M 38 65 Q 43 55 50 46","M 50 46 Q 53 36 58 28","M 58 28 Q 61 47 65 65","M 65 65 Q 72 53 80 44"],
    activeLevel:3, currentQuest:"Stack Implementation", currentLevel:"Level 3",
    xp:650, maxXp:1000, coins:100, gems:80,
    lessons:[{id:"1.0",title:"Introduction to Arrays",icon:"check",status:"complete"},{id:"2.0",title:"Linked List Traversal",icon:"check",status:"complete"},{id:"3.0",title:"Stack Implementation",icon:"play",status:"active",duration:"12:30"},{id:"3.1",title:"Queue Patterns & BFS",icon:"circle",status:"upcoming",duration:"09:45"}],
    todos:[{text:"3.0 Challenge – Implement Min Stack",due:"Mar 12",done:false},{text:"3.1 Practice – Valid Parentheses",due:"Mar 14",done:false}],
  },
  { id:"ai", name:"Artificial Intelligence", shortName:"AI",
    color:"#A8D8EA", glowColor:"rgba(168,216,234,0.4)",
    grad:["#0a2030","#144060","#A8D8EA","#081828"],
    ring1:"rgba(168,216,234,0.5)", ring2:"rgba(168,216,234,0.18)",
    checkpoints:[{number:1,x:10,y:68,label:"Basics"},{number:2,x:22,y:48,label:"Search"},{number:3,x:33,y:30,label:"ML Intro"},{number:4,x:40,y:65,label:"Neural Nets"},{number:5,x:52,y:44,label:"CNN"},{number:6,x:60,y:27,label:"NLP"},{number:7,x:68,y:64,label:"RL"},{number:8,x:80,y:44,label:"AGI"}],
    pathSegments:["M 10 68 Q 15 57 22 48","M 22 48 Q 26 38 33 30","M 33 30 Q 35 48 40 65","M 40 65 Q 45 54 52 44","M 52 44 Q 55 35 60 27","M 60 27 Q 63 47 68 64","M 68 64 Q 74 52 80 44"],
    activeLevel:2, currentQuest:"Search Strategies", currentLevel:"Level 2",
    xp:320, maxXp:800, coins:60, gems:45,
    lessons:[{id:"1.0",title:"What is Artificial Intelligence?",icon:"check",status:"complete"},{id:"2.0",title:"Search Strategies",icon:"play",status:"active",duration:"14:20"},{id:"2.1",title:"Heuristics & A* Algorithm",icon:"circle",status:"upcoming",duration:"11:05"},{id:"3.0",title:"Intro to Machine Learning",icon:"circle",status:"upcoming",duration:"16:00"}],
    todos:[{text:"2.0 Challenge – Implement BFS on a graph",due:"Mar 13",done:false},{text:"2.1 Quiz – A* Pathfinding",due:"Mar 15",done:true}],
  },
  { id:"web", name:"Web Development", shortName:"Web Dev",
    color:"#FFB347", glowColor:"rgba(255,179,71,0.4)",
    grad:["#3a1a00","#6a3000","#FFB347","#250f00"],
    ring1:"rgba(255,179,71,0.5)", ring2:"rgba(255,179,71,0.18)",
    checkpoints:[{number:1,x:10,y:68,label:"HTML"},{number:2,x:22,y:50,label:"CSS"},{number:3,x:32,y:32,label:"JS"},{number:4,x:40,y:65,label:"React"},{number:5,x:52,y:44,label:"Node.js"},{number:6,x:60,y:27,label:"APIs"},{number:7,x:68,y:65,label:"DevOps"},{number:8,x:80,y:44,label:"Full Stack"}],
    pathSegments:["M 10 68 Q 15 58 22 50","M 22 50 Q 26 40 32 32","M 32 32 Q 34 49 40 65","M 40 65 Q 45 54 52 44","M 52 44 Q 55 35 60 27","M 60 27 Q 63 47 68 65","M 68 65 Q 74 53 80 44"],
    activeLevel:4, currentQuest:"React Hooks & State", currentLevel:"Level 4",
    xp:880, maxXp:1200, coins:200, gems:120,
    lessons:[{id:"1.0",title:"HTML5 Semantics & Structure",icon:"check",status:"complete"},{id:"2.0",title:"CSS Grid & Flexbox",icon:"check",status:"complete"},{id:"3.0",title:"JavaScript ES6+",icon:"check",status:"complete"},{id:"4.0",title:"React Hooks & State",icon:"play",status:"active",duration:"18:15"},{id:"4.1",title:"useEffect & Side Effects",icon:"circle",status:"upcoming",duration:"13:40"}],
    todos:[{text:"4.0 Build – Counter with useState",due:"Mar 11",done:true},{text:"4.1 Challenge – Fetch API with useEffect",due:"Mar 14",done:false}],
  },
  { id:"os", name:"Operating Systems", shortName:"OS",
    color:"#C8A2FF", glowColor:"rgba(200,162,255,0.4)",
    grad:["#1a0a30","#350a6a","#C8A2FF","#0f0520"],
    ring1:"rgba(200,162,255,0.5)", ring2:"rgba(200,162,255,0.18)",
    checkpoints:[{number:1,x:10,y:68,label:"Processes"},{number:2,x:22,y:48,label:"Threads"},{number:3,x:32,y:30,label:"Scheduling"},{number:4,x:38,y:65,label:"Memory"},{number:5,x:50,y:46,label:"Deadlocks"},{number:6,x:58,y:28,label:"File Sys"},{number:7,x:65,y:65,label:"I/O"},{number:8,x:80,y:44,label:"Security"}],
    pathSegments:["M 10 68 Q 15 57 22 48","M 22 48 Q 26 38 32 30","M 32 30 Q 34 47 38 65","M 38 65 Q 43 55 50 46","M 50 46 Q 53 36 58 28","M 58 28 Q 61 47 65 65","M 65 65 Q 72 53 80 44"],
    activeLevel:1, currentQuest:"Kernel Architecture", currentLevel:"Level 1",
    xp:80, maxXp:600, coins:20, gems:10,
    lessons:[{id:"1.0",title:"What is an OS? Kernel Architecture",icon:"play",status:"active",duration:"15:00"},{id:"1.1",title:"Process vs Thread",icon:"circle",status:"upcoming",duration:"10:30"},{id:"2.0",title:"CPU Scheduling Algorithms",icon:"circle",status:"upcoming",duration:"14:00"}],
    todos:[{text:"1.0 Reading – OS Concepts Ch. 1–2",due:"Mar 12",done:false}],
  },
  { id:"db", name:"Databases", shortName:"Databases",
    color:"#4DFFC3", glowColor:"rgba(77,255,195,0.35)",
    grad:["#002a1e","#005540","#4DFFC3","#001510"],
    ring1:"rgba(77,255,195,0.5)", ring2:"rgba(77,255,195,0.18)",
    checkpoints:[{number:1,x:10,y:68,label:"SQL Basics"},{number:2,x:22,y:48,label:"Joins"},{number:3,x:32,y:30,label:"Indexes"},{number:4,x:38,y:65,label:"NoSQL"},{number:5,x:50,y:46,label:"Transactions"},{number:6,x:58,y:28,label:"Optimization"},{number:7,x:65,y:65,label:"Sharding"},{number:8,x:80,y:44,label:"Distributed"}],
    pathSegments:["M 10 68 Q 15 57 22 48","M 22 48 Q 26 38 32 30","M 32 30 Q 34 47 38 65","M 38 65 Q 43 55 50 46","M 50 46 Q 53 36 58 28","M 58 28 Q 61 47 65 65","M 65 65 Q 72 53 80 44"],
    activeLevel:1, currentQuest:"MySQL Quest: SQL Basics", currentLevel:"Level 1",
    xp:240, maxXp:700, coins:55, gems:35,
    lessons:[{id:"1.0",title:"Relational Model & SQL Intro",icon:"check",status:"complete"},{id:"2.0",title:"SQL Joins Explained",icon:"play",status:"active",duration:"11:45"},{id:"2.1",title:"Subqueries & Aggregations",icon:"circle",status:"upcoming",duration:"09:30"}],
    todos:[{text:"2.0 Challenge – Write 5 JOIN queries",due:"Mar 13",done:false},{text:"2.1 Quiz – GROUP BY & HAVING",due:"Mar 16",done:false}],
  },
  { id:"cn", name:"Computer Networks", shortName:"Networks",
    color:"#FF6B9D", glowColor:"rgba(255,107,157,0.4)",
    grad:["#2a0018","#550030","#FF6B9D","#180010"],
    ring1:"rgba(255,107,157,0.5)", ring2:"rgba(255,107,157,0.18)",
    checkpoints:[{number:1,x:10,y:68,label:"OSI Model"},{number:2,x:22,y:48,label:"TCP/IP"},{number:3,x:32,y:30,label:"HTTP/S"},{number:4,x:38,y:65,label:"DNS"},{number:5,x:50,y:46,label:"Routing"},{number:6,x:58,y:28,label:"Security"},{number:7,x:65,y:65,label:"Wireless"},{number:8,x:80,y:44,label:"Cloud Net"}],
    pathSegments:["M 10 68 Q 15 57 22 48","M 22 48 Q 26 38 32 30","M 32 30 Q 34 47 38 65","M 38 65 Q 43 55 50 46","M 50 46 Q 53 36 58 28","M 58 28 Q 61 47 65 65","M 65 65 Q 72 53 80 44"],
    activeLevel:1, currentQuest:"OSI Model: 7 Layers", currentLevel:"Level 1",
    xp:50, maxXp:600, coins:15, gems:8,
    lessons:[{id:"1.0",title:"OSI Model & Network Layers",icon:"play",status:"active",duration:"16:20"},{id:"1.1",title:"Physical & Data Link Layers",icon:"circle",status:"upcoming",duration:"12:00"},{id:"2.0",title:"TCP vs UDP",icon:"circle",status:"upcoming",duration:"14:10"}],
    todos:[{text:"1.0 Reading – OSI vs TCP/IP models",due:"Mar 14",done:false}],
  },
  { id:"cyber", name:"Cybersecurity", shortName:"CyberSec",
    color:"#FF4444", glowColor:"rgba(255,68,68,0.4)",
    grad:["#2a0000","#550000","#FF4444","#180000"],
    ring1:"rgba(255,68,68,0.5)", ring2:"rgba(255,68,68,0.18)",
    checkpoints:[{number:1,x:10,y:68,label:"Threats"},{number:2,x:22,y:48,label:"Crypto"},{number:3,x:32,y:30,label:"Auth"},{number:4,x:38,y:65,label:"Web Sec"},{number:5,x:50,y:46,label:"Forensics"},{number:6,x:58,y:28,label:"Pen Test"},{number:7,x:65,y:65,label:"Malware"},{number:8,x:80,y:44,label:"Defence"}],
    pathSegments:["M 10 68 Q 15 57 22 48","M 22 48 Q 26 38 32 30","M 32 30 Q 34 47 38 65","M 38 65 Q 43 55 50 46","M 50 46 Q 53 36 58 28","M 58 28 Q 61 47 65 65","M 65 65 Q 72 53 80 44"],
    activeLevel:1, currentQuest:"Threat Landscape & CIA Triad", currentLevel:"Level 1",
    xp:100, maxXp:600, coins:25, gems:12,
    lessons:[{id:"1.0",title:"Security Fundamentals & CIA Triad",icon:"play",status:"active",duration:"13:00"},{id:"1.1",title:"Common Attack Types",icon:"circle",status:"upcoming",duration:"11:20"},{id:"2.0",title:"Cryptography Basics",icon:"circle",status:"upcoming",duration:"15:00"}],
    todos:[{text:"1.0 Quiz – CIA Triad scenarios",due:"Mar 15",done:false}],
  },
];

// Leaderboard data is now fetched dynamically from the backend

export const BADGES=[
  {id:1,name:"First Star",icon:"★",earned:false,rarity:"common"},
  {id:2,name:"Algorithm Ace",icon:"⬡",earned:false,rarity:"rare"},
  {id:3,name:"Neural Pioneer",icon:"◎",earned:false,rarity:"epic"},
  {id:4,name:"Web Weaver",icon:"⬟",earned:false,rarity:"rare"},
  {id:5,name:"Streak Master",icon:"🔥",earned:false,rarity:"epic"},
  {id:6,name:"XP Hunter",icon:"◈",earned:false,rarity:"common"},
  {id:7,name:"Speed Coder",icon:"⚡",earned:false,rarity:"legendary"},
  {id:8,name:"Galaxy Brain",icon:"◉",earned:false,rarity:"legendary"},
];

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700;800&family=Press+Start+2P&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#050b1a;color:#e8f0fe;font-family:'Exo 2',sans-serif;overflow-x:hidden;min-height:100%}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:rgba(255,255,255,.02)}
::-webkit-scrollbar-thumb{background:rgba(74,158,255,.3);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:rgba(74,158,255,.5)}
.rj{font-family:'Rajdhani',sans-serif!important}
.px{font-family:'Press Start 2P',monospace!important}
.gc{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.stars-bg{position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;display:block}

@keyframes twk{0%,100%{opacity:.1}50%{opacity:.9}}
@keyframes nd{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(16px,-11px) scale(1.05)}}
@keyframes flt{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes flt2{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-8px) rotate(1deg)}66%{transform:translateY(-4px) rotate(-1deg)}}
@keyframes pg{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.6;transform:scale(1.07)}}
@keyframes ringSpin{from{transform:rotateX(75deg) rotateZ(0deg)}to{transform:rotateX(75deg) rotateZ(360deg)}}
@keyframes ringSpinR{from{transform:rotateX(75deg) rotateZ(0deg)}to{transform:rotateX(75deg) rotateZ(-360deg)}}
@keyframes fiu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes islandIn{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
@keyframes ping{0%{transform:scale(1);opacity:.75}100%{transform:scale(2.4);opacity:0}}
@keyframes cloudDrift{0%,100%{transform:translateX(0)}50%{transform:translateX(18px)}}
@keyframes treeSway{0%,100%{transform:rotate(0deg)}50%{transform:rotate(2deg)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes scanline{0%{top:-5%}100%{top:105%}}
@keyframes orbPulse{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.15);opacity:.7}}
@keyframes spin3d{0%{transform:perspective(600px) rotateY(0deg)}100%{transform:perspective(600px) rotateY(360deg)}}
@keyframes countUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes neonBlink{0%,100%{text-shadow:0 0 8px currentColor,0 0 20px currentColor}50%{text-shadow:0 0 4px currentColor}}
@keyframes particleFly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes hexPulse{0%,100%{opacity:.04}50%{opacity:.09}}
@keyframes slideInLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideInRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
@keyframes barFill{from{width:0}to{width:var(--w)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 10px var(--glow),0 0 20px var(--glow)50}50%{box-shadow:0 0 20px var(--glow),0 0 40px var(--glow)}}
@keyframes trophySpin{0%{transform:rotateY(0deg)}50%{transform:rotateY(20deg)}100%{transform:rotateY(0deg)}}
@keyframes avatarHover{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.03)}}
@keyframes profileRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

.af{animation:flt2 6s ease-in-out infinite}
.af2{animation:flt2 7s ease-in-out 1.5s infinite}
.af3{animation:flt2 8s ease-in-out 3s infinite}
.afu{animation:fiu .55s ease forwards}
.island-enter{animation:islandIn .5s cubic-bezier(.22,1,.36,1) forwards}
.ping-anim{animation:ping 1.8s cubic-bezier(0,0,.2,1) infinite}
.nl{position:relative;transition:color .2s}
.nl::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:#4A9EFF;transition:width .3s ease}
.nl:hover::after,.nl.act::after{width:100%}
.bp{background:linear-gradient(135deg,rgba(74,158,255,.18),rgba(74,158,255,.08));border:1px solid rgba(74,158,255,.4);color:#4A9EFF;transition:all .3s ease}
.bp:hover{border-color:rgba(74,158,255,.7);box-shadow:0 0 20px rgba(74,158,255,.2);transform:translateY(-1px)}
.ph{transition:transform .4s cubic-bezier(.34,1.56,.64,1),filter .3s ease;cursor:pointer}
.ph:hover{transform:scale(1.07) translateY(-4px);filter:brightness(1.16)}
`;

// ─── STAR FIELD ───────────────────────────────────────────────────────────────
function StarField(){
  const stars = useMemo(() => Array.from({length:220},(_,i)=>({
    id:i, x:Math.random()*1440, y:Math.random()*900,
    r:Math.random()*1.8+.3, delay:Math.random()*10, dur:2.5+Math.random()*5,
  })), []);
  return(
    <svg className="stars-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      {stars.map(s=>(
        <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill="white"
          style={{animation:`twk ${s.dur}s ease-in-out ${s.delay}s infinite`,opacity:.15}}/>
      ))}
      <ellipse cx="280" cy="240" rx="220" ry="110" fill="rgba(74,158,255,0.03)" style={{animation:'nd 22s ease-in-out infinite'}}/>
      <ellipse cx="1160" cy="650" rx="190" ry="130" fill="rgba(168,216,234,0.025)" style={{animation:'nd 28s ease-in-out 6s infinite'}}/>
      <ellipse cx="720" cy="780" rx="260" ry="85" fill="rgba(255,179,71,0.02)" style={{animation:'nd 32s ease-in-out 12s infinite'}}/>
      <ellipse cx="1300" cy="180" rx="170" ry="95" fill="rgba(200,162,255,0.025)" style={{animation:'nd 25s ease-in-out 4s infinite'}}/>
    </svg>
  );
}

// ─── PLANET 3D ────────────────────────────────────────────────────────────────
function Planet3D({planet,size=160}){
  const r=size/2,c=planet;
  return(
    <svg width={size+70} height={size+55} viewBox={`0 0 ${size+70} ${size+55}`}>
      <defs>
        <radialGradient id={`pg${c.id}`} cx="34%" cy="28%" r="70%">
          <stop offset="0%" stopColor={c.grad[2]} stopOpacity=".92"/>
          <stop offset="38%" stopColor={c.grad[1]} stopOpacity=".87"/>
          <stop offset="72%" stopColor={c.grad[0]} stopOpacity=".92"/>
          <stop offset="100%" stopColor={c.grad[3]} stopOpacity=".96"/>
        </radialGradient>
        <radialGradient id={`sp${c.id}`} cx="29%" cy="24%" r="38%">
          <stop offset="0%" stopColor="white" stopOpacity=".2"/><stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`am${c.id}`} cx="72%" cy="76%" r="50%">
          <stop offset="0%" stopColor={c.grad[3]} stopOpacity=".5"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
        <clipPath id={`cl${c.id}`}><circle cx={r+35} cy={r+8} r={r}/></clipPath>
      </defs>
      <ellipse cx={r+35} cy={r+8+r*.12} rx={r*1.55} ry={r*.22} fill="none" stroke={c.ring1} strokeWidth="2.5"
        style={{animation:'ringSpin 20s linear infinite',transformOrigin:`${r+35}px ${r+8+r*.12}px`}}/>
      <ellipse cx={r+35} cy={r+8+r*.12} rx={r*1.72} ry={r*.29} fill="none" stroke={c.ring2} strokeWidth="7" strokeDasharray="4 9"
        style={{animation:'ringSpinR 30s linear infinite',transformOrigin:`${r+35}px ${r+8+r*.12}px`}}/>
      <circle cx={r+35} cy={r+8} r={r} fill={`url(#pg${c.id})`}/>
      <g clipPath={`url(#cl${c.id})`}>
        <ellipse cx={r+35} cy={r-6} rx={r*.94} ry={r*.11} fill={`${c.grad[2]}28`}/>
        <ellipse cx={r+25} cy={r+18} rx={r*.8} ry={r*.09} fill={`${c.grad[2]}20`}/>
        <ellipse cx={r+45} cy={r+44} rx={r*.68} ry={r*.07} fill={`${c.grad[2]}18`}/>
        <circle cx={r+12} cy={r-8} r={r*.09} fill={`${c.grad[0]}cc`}/>
        <circle cx={r+58} cy={r+22} r={r*.07} fill={`${c.grad[1]}aa`}/>
        <circle cx={r+28} cy={r+48} r={r*.055} fill={`${c.grad[0]}bb`}/>
      </g>
      <circle cx={r+35} cy={r+8} r={r} fill={`url(#sp${c.id})`}/>
      <circle cx={r+35} cy={r+8} r={r} fill={`url(#am${c.id})`}/>
    </svg>
  );
}

// ─── PIXEL CHARACTERS ─────────────────────────────────────────────────────────
function PixelChar({type,color,fr}){
  const sz="clamp(14px,1.6vw,26px)";
  const s={width:sz,height:sz,transform:fr?"scaleX(1)":"scaleX(-1)",filter:"drop-shadow(0 2px 4px rgba(0,0,0,.6))"};
  if(type==="knight")return(<svg viewBox="0 0 16 16" style={s}><rect x="5" y="1" width="6" height="2" fill="#90A4AE"/><rect x="6" y="0" width="4" height="1" fill="#B0BEC5"/><rect x="5" y="3" width="6" height="4" fill="#FFCC80"/><rect x="7" y="4" width="1" height="1" fill="#3E2723"/><rect x="9" y="4" width="1" height="1" fill="#3E2723"/><rect x="4" y="7" width="8" height="4" fill={color}/><rect x="5" y="8" width="6" height="2" fill="#B0BEC5"/><rect x="2" y="7" width="2" height="3" fill="#78909C"/><rect x="12" y="6" width="2" height="4" fill="#FFCC80"/><rect x="13" y="3" width="1" height="4" fill="#E0E0E0"/><rect x="5" y="11" width="2" height="3" fill="#5D4037"/><rect x="9" y="11" width="2" height="3" fill="#5D4037"/><rect x="4" y="14" width="3" height="2" fill="#4E342E"/><rect x="9" y="14" width="3" height="2" fill="#4E342E"/></svg>);
  if(type==="mage")return(<svg viewBox="0 0 16 16" style={s}><rect x="7" y="0" width="2" height="1" fill={color}/><rect x="5" y="1" width="6" height="2" fill={color}/><rect x="4" y="3" width="8" height="1" fill={color}/><rect x="7" y="1" width="2" height="2" fill="#FFD54F"/><rect x="5" y="4" width="6" height="3" fill="#FFCC80"/><rect x="6" y="5" width="1" height="1" fill="#7B1FA2"/><rect x="9" y="5" width="1" height="1" fill="#7B1FA2"/><rect x="4" y="7" width="8" height="5" fill={color}/><rect x="6" y="8" width="4" height="1" fill="#FFD54F"/><rect x="12" y="4" width="1" height="10" fill="#8D6E63"/><rect x="11" y="2" width="3" height="3" rx="1" fill="#7E57C2"/><rect x="3" y="12" width="10" height="2" fill={color}/><rect x="4" y="14" width="3" height="2" fill={color}/><rect x="9" y="14" width="3" height="2" fill={color}/></svg>);
  if(type==="scout")return(<svg viewBox="0 0 16 16" style={s}><rect x="5" y="1" width="6" height="3" fill={color}/><rect x="4" y="2" width="2" height="2" fill={color}/><rect x="5" y="4" width="6" height="3" fill="#FFCC80"/><rect x="7" y="5" width="1" height="1" fill="#2E7D32"/><rect x="9" y="5" width="1" height="1" fill="#2E7D32"/><rect x="5" y="7" width="6" height="4" fill={color}/><rect x="6" y="8" width="4" height="1" fill="#4E342E"/><rect x="12" y="5" width="1" height="6" fill="#8D6E63"/><rect x="13" y="6" width="1" height="4" fill="#F5F5DC"/><rect x="3" y="7" width="2" height="5" fill="#2E7D32"/><rect x="5" y="11" width="2" height="3" fill="#5D4037"/><rect x="9" y="11" width="2" height="3" fill="#5D4037"/><rect x="4" y="14" width="3" height="2" fill="#3E2723"/><rect x="9" y="14" width="3" height="2" fill="#3E2723"/></svg>);
  return(<svg viewBox="0 0 20 16" style={s}><rect x="3" y="2" width="2" height="1" fill={color}/><rect x="2" y="3" width="4" height="1" fill={color}/><rect x="1" y="4" width="5" height="2" fill={color}/><rect x="13" y="2" width="2" height="1" fill={color}/><rect x="12" y="3" width="4" height="1" fill={color}/><rect x="12" y="4" width="5" height="2" fill={color}/><rect x="7" y="1" width="4" height="3" fill={color}/><rect x="8" y="2" width="1" height="1" fill="#FFF176"/><rect x="10" y="2" width="1" height="1" fill="#FFF176"/><rect x="7" y="0" width="1" height="1" fill="#FFD54F"/><rect x="10" y="0" width="1" height="1" fill="#FFD54F"/><rect x="6" y="4" width="6" height="5" fill={color}/><rect x="7" y="5" width="4" height="3" fill="#FFAB91"/><rect x="4" y="8" width="2" height="1" fill={color}/><rect x="2" y="9" width="3" height="1" fill={color}/><rect x="6" y="9" width="2" height="3" fill={color}/><rect x="10" y="9" width="2" height="3" fill={color}/><rect x="5" y="12" width="3" height="1" fill={color}/><rect x="10" y="12" width="3" height="1" fill={color}/><rect x="12" y="1" width="1" height="2" fill="#FFAB40"/><rect x="13" y="0" width="1" height="1" fill="#FF6D00"/></svg>);
}

function AnimChar({ch}){
  const [pos,setPos]=useState(ch.pts[0]);
  const [fr,setFr]=useState(true);
  const [bob,setBob]=useState(0);
  const t0=useRef(Date.now());
  useEffect(()=>{
    let raf;
    const tick=()=>{
      const el=Date.now()-t0.current;
      const tt=(el%ch.speed)/ch.speed;
      const pts=ch.pts,segs=pts.length-1;
      const si=Math.min(Math.floor(tt*segs),segs-1);
      const st=tt*segs-si;
      const p1=pts[si],p2=pts[si+1];
      setFr(p2.x>=p1.x);
      setPos({x:p1.x+(p2.x-p1.x)*st,y:p1.y+(p2.y-p1.y)*st});
      setBob(Math.sin(el/200)*.4);
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[ch]);
  return(
    <div style={{position:"absolute",zIndex:8,pointerEvents:"none",left:`${pos.x}%`,top:`${pos.y+bob}%`,transform:"translate(-50%,-50%)",transition:"left .05s linear,top .05s linear"}}>
      <div style={{position:"absolute",width:"clamp(8px,1.1vw,15px)",height:"clamp(2px,.3vw,4px)",background:"rgba(0,0,0,.4)",bottom:-3,left:"50%",transform:"translateX(-50%)",borderRadius:"50%",filter:"blur(2px)"}}/>
      <PixelChar type={ch.type} color={ch.color} fr={fr}/>
    </div>
  );
}


// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({activePage,setPage,user,onLogout}){
  const links=user ? ["Home","Subjects","Progress","Profile","About"] : [];
  const [sc,setSc]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>20);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:50,padding:"12px 24px",background:sc?"rgba(5,11,26,.92)":"rgba(5,11,26,.5)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.05)",transition:"background .3s"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>user ? setPage("home") : setPage("auth")} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer"}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,rgba(0,188,212,.3),rgba(124,77,255,.1))",border:"1px solid rgba(0,188,212,.4)",boxShadow:"0 0 12px rgba(0,188,212,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#00BCD4"}}>◎</div>
          <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.2rem",letterSpacing:".12em",color:"#e8f0fe"}}>NEURO<span style={{color:"#00BCD4"}}>VERSE</span></span>
        </button>
        {user && (
          <div style={{display:"flex",alignItems:"center",gap:32}}>
            {links.map(l=>(
              <button key={l} onClick={()=>setPage(l.toLowerCase())} className={`nl${activePage===l.toLowerCase()?" act":""}`} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".08em",fontSize:".78rem",fontWeight:600,color:activePage===l.toLowerCase()?"#4A9EFF":"#8899bb",transition:"color .2s"}}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {user ? (
            <>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px rgba(34,197,94,0.5)"}}/>
                <span style={{color:"#8899bb",fontSize:".72rem",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".1em"}}>{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
               style={{padding:"6px 18px",borderRadius:8,fontSize:".72rem",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".12em",fontWeight:700,cursor:"pointer",border:"1.5px solid rgba(255,80,80,.8)",color:"#ff7070",background:"linear-gradient(135deg,rgba(255,60,60,.2),rgba(255,60,60,.1))",boxShadow:"0 0 12px rgba(255,60,60,.25), inset 0 1px 0 rgba(255,255,255,.07)",transition:"all .25s ease"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,80,80,1)";e.currentTarget.style.color="#ff9999";e.currentTarget.style.background="linear-gradient(135deg,rgba(255,60,60,.3),rgba(255,60,60,.16))";e.currentTarget.style.boxShadow="0 0 22px rgba(255,60,60,.4)";e.currentTarget.style.transform="translateY(-1px)"}}
onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,80,80,.8)";e.currentTarget.style.color="#ff7070";e.currentTarget.style.background="linear-gradient(135deg,rgba(255,60,60,.2),rgba(255,60,60,.1))";e.currentTarget.style.boxShadow="0 0 12px rgba(255,60,60,.25)";e.currentTarget.style.transform="translateY(0)"}}
              >
                LOGOUT
              </button>
              <div onClick={()=>setPage("profile")} style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#1a3a6b,#0d2044)",border:"1px solid rgba(74,158,255,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#4A9EFF",cursor:"pointer",fontFamily:"'Rajdhani',sans-serif"}}>{user.avatar}</div>
            </>
          ) : (
            <div onClick={()=>setPage("auth")} style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#1a3a6b,#0d2044)",border:"1px solid rgba(74,158,255,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#4A9EFF",cursor:"pointer",fontFamily:"'Rajdhani',sans-serif"}}>ME</div>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({setPage,openPlanet}){
  const [cur,setCur]=useState(0);
  const [zoom,setZoom]=useState(false);
  const tot=PLANETS.length;
  const handleClick=(planet)=>{setZoom(true);setTimeout(()=>{openPlanet(planet);setZoom(false);},500);};
  const vis=[-1,0,1].map(o=>({planet:PLANETS[(cur+o+tot)%tot],offset:o}));
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",paddingTop:80}}>
      <div style={{textAlign:"center",zIndex:10,marginBottom:32,animation:"fiu .55s ease forwards"}}>
        <div style={{display:"inline-block",padding:"3px 14px",borderRadius:20,background:"rgba(0,188,212,.08)",border:"1px solid rgba(0,188,212,.2)",color:"#00BCD4",fontSize:".62rem",letterSpacing:".2em",fontFamily:"'Rajdhani',sans-serif",marginBottom:14}}>◎ LEARNING UNIVERSE</div>
        <h1 style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(2.5rem,6vw,4.8rem)",lineHeight:1.05,background:"linear-gradient(135deg, #E1BEE7 0%, #B388FF 50%, #00BCD4 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:".05em",textShadow:"0 0 40px rgba(124,77,255,0.4)"}}>EXPLORE THE<br/>NEUROVERSE</h1>
        <p style={{color:"#8899bb",fontSize:".85rem",maxWidth:420,margin:"15px auto 0",lineHeight:1.75}}>Navigate through subject planets. Master skills. Earn XP. Rise through the neuroverse.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:20}}>
        
<button style={{padding:"11px 28px",borderRadius:12,fontSize:".9rem",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".14em",fontWeight:700,cursor:"pointer",border:"2px solid rgba(74,158,255,.9)",color:"#ffffff",background:"linear-gradient(135deg,rgba(74,158,255,.35),rgba(74,158,255,.15))",boxShadow:"0 0 18px rgba(74,158,255,.35), inset 0 1px 0 rgba(255,255,255,.15)",transition:"all .25s ease"}} onClick={()=>setPage("subjects")} onMouseEnter={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(74,158,255,.5),rgba(74,158,255,.25))";e.currentTarget.style.boxShadow="0 0 28px rgba(74,158,255,.5)";e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(74,158,255,.35),rgba(74,158,255,.15))";e.currentTarget.style.boxShadow="0 0 18px rgba(74,158,255,.35)";e.currentTarget.style.transform="translateY(0)"}}>BEGIN JOURNEY</button>
<button style={{padding:"11px 28px",borderRadius:12,fontSize:".9rem",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".14em",fontWeight:700,cursor:"pointer",border:"2px solid rgba(255,255,255,.35)",color:"#ccd6f6",background:"rgba(255,255,255,.08)",boxShadow:"0 0 10px rgba(255,255,255,.06), inset 0 1px 0 rgba(255,255,255,.1)",transition:"all .25s ease"}} onClick={()=>document.getElementById('about-section').scrollIntoView({behavior:'smooth'})} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.65)";e.currentTarget.style.color="#ffffff";e.currentTarget.style.background="rgba(255,255,255,.14)";e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.35)";e.currentTarget.style.color="#ccd6f6";e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.transform="translateY(0)"}}>ABOUT NEUROVERSE</button>
        </div>
      </div>
      <div style={{position:"relative",width:"100%",height:430,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .5s ease,opacity .5s ease",transform:zoom?"scale(1.12)":"scale(1)",opacity:zoom?0:1}}>
        <button onClick={()=>setCur(p=>(p-1+tot)%tot)} style={{position:"absolute",left:"clamp(10px,4vw,55px)",zIndex:20,width:40,height:40,borderRadius:10,background:"rgba(74,158,255,.08)",border:"1px solid rgba(74,158,255,.25)",color:"#4A9EFF",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(74,158,255,.18)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(74,158,255,.08)"}>‹</button>
        {vis.map(({planet,offset})=>{
          const isC=offset===0;
          return(
            <div key={planet.id} style={{position:"absolute",transform:`translateX(${offset*320}px) scale(${isC?1.15:.55})`,opacity:isC?1:.35,zIndex:isC?10:5,transition:"all .6s cubic-bezier(.34,1.2,.64,1)"}}>
              <div className={isC?"af":offset===-1?"af2":"af3"}>
                <div className="ph" onClick={()=>isC&&handleClick(planet)} style={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",cursor:"pointer", transition:"transform 0.3s ease", transform: isC ? "translateY(-5px)" : "none"}}>
                  {isC&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-60%)",width:290,height:290,borderRadius:"50%",background:`radial-gradient(circle,${planet.glowColor} 0%,transparent 70%)`,animation:"pg 2.5s ease-in-out infinite",pointerEvents:"none"}}/>}
                  <button 
                    onClick={() => isC && setPage("island")}
                    style={{background:"none",border:"none",cursor:isC?"pointer":"default",padding:0}}
                  >
                    <Planet3D planet={planet} size={isC?172:128}/>
                  </button>
                  <div style={{textAlign:"center",marginTop:3,opacity:isC?1:.65}}>
<div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:800,letterSpacing:".25em",fontSize:"1.6rem",color:planet.color,textShadow:`0 0 20px ${planet.color}, 0 0 50px ${planet.color}`}}>{planet.shortName}</div>
<div style={{fontSize:"1rem",color:"#ffffff",marginTop:4,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",letterSpacing:".06em",textShadow:`0 0 12px rgba(0,0,0,1), 0 0 24px rgba(0,0,0,1)`}}>{planet.name}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={()=>setCur(p=>(p+1)%tot)} style={{position:"absolute",right:"clamp(10px,4vw,55px)",zIndex:20,width:40,height:40,borderRadius:10,background:"rgba(74,158,255,.08)",border:"1px solid rgba(74,158,255,.25)",color:"#4A9EFF",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(74,158,255,.18)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(74,158,255,.08)"}>›</button>
      </div>
      <div style={{display:"flex",gap:6,marginTop:6,zIndex:10}}>
        {PLANETS.map((_,i)=><button key={i} onClick={()=>setCur(i)} style={{width:i===cur?20:6,height:6,borderRadius:3,background:i===cur?"#4A9EFF":"rgba(74,158,255,.28)",transition:"all .3s",border:"none",cursor:"pointer"}}/>)}
      </div>
      <div style={{color:"rgba(136,153,187,.4)",fontSize:".58rem",letterSpacing:".12em",marginTop:8,zIndex:10}}>CLICK PLANET TO EXPLORE · {tot} WORLDS</div>
      
      {/* About Section */}
      <div id="about-section" style={{marginTop:80}}>
        <NeuroverseAbout setPage={setPage} />
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("auth"); // Start with auth page instead of home
  const [island,setIsland]=useState(null);
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [sortingGame, setSortingGame] = useState(false);
  const [mysqlQuest, setMysqlQuest] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const go=(p)=>{setPage(p);window.scrollTo({top:0,behavior:"smooth"});};
  
  // Function to open planet with dynamic level calculation
  const openPlanetWithDynamicLevel = (planet) => {
    const currentLevel = Math.floor((userData?.xp || 0) / 1000) + 1;
    
    // Update lessons based on current level
    let updatedLessons = [...planet.lessons];
    if (planet.id === "dsa") {
      // Show lessons up to current level
      updatedLessons = planet.lessons.map((lesson, index) => {
        const lessonNumber = index + 1; // Lesson 1, 2, 3, 4...
        if (lessonNumber < currentLevel) {
          return { ...lesson, status: "complete" };
        } else if (lessonNumber === currentLevel) {
          return { ...lesson, status: "active" };
        } else {
          return { ...lesson, status: "upcoming" };
        }
      });
    }
    
    // For Databases planet, Level 1 is always the active (glowing) entry point
    // because MySQL Quest is at Level 1
    const activeLevel = planet.id === "db" ? 1 : currentLevel;

    const planetWithDynamicLevel = {
      ...planet,
      activeLevel,
      lessons: updatedLessons
    };
    setIsland(planetWithDynamicLevel);
  };
  
  // Check for existing user session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          
          // Verify token is still valid by fetching profile
          try {
            const profile = await authService.getProfile();
            setUserData(profile.user); // Set user data for XP calculations
            setPage("home"); // Redirect to home if already authenticated
          } catch (error) {
            // Token invalid, logout user
            authService.logout();
            setUser(null);
            setUserData(null);
            setPage("auth"); // Show auth page
          }
        } else {
          setPage("auth"); // Show auth page if not authenticated
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
        setUser(null);
        setPage("auth"); // Show auth page
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);
  
  const handleLogin = (userData) => {
    setUser(userData);
    setUserData(userData); // Set user data for XP calculations
    setPage("home"); // Navigate to home after login
  };
  
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setUserData(null);
    setPage("auth"); // Return to auth page
  };
  useEffect(() => {
    const storedUser = localStorage.getItem('neuroverse_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('neuroverse_user');
      }
    }
  }, []);

  // If user is not logged in, show login page
  if (!user) {
    return <NeuroVerseAuth onAuthSuccess={handleLogin} />;
  }

  // If sorting game is active, show sorting game
  if (sortingGame) {
    return <SortingGame onBackToIsland={() => setSortingGame(false)} />;
  }

  // If mysql quest is active, show mysql quest
  if (mysqlQuest) {
    return <MysqlQuest onBackToIsland={() => setMysqlQuest(false)} />;
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050b1a",
        color: "#e8f0fe",
        fontFamily: "'Exo 2', sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(74,158,255,0.2)",
            borderTop: "3px solid #4A9EFF",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }} />
          <div>Loading Neuroverse...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#050b1a 0%,#07101f 50%,#05080f 100%)"}}>
        <StarField/>
        <Navbar activePage={page} setPage={go} user={user} onLogout={handleLogout}/>
        <div style={{position:"relative",zIndex:1}}>
          {page==="auth" && <NeuroVerseAuth onAuthSuccess={handleLogin} />}
          {page==="home" && user && <HomePage setPage={go} openPlanet={openPlanetWithDynamicLevel} />}
          {page==="subjects"&&<SubjectsPage openPlanet={openPlanetWithDynamicLevel}/>}
          {page==="progress"&&<ProgressPage/>}
          {page==="profile"&&<ProfilePage setPage={go}/>}
          {page==="about"&&<NeuroverseAbout setPage={go}/>}
        </div>
      </div>
      {island&&<IslandPage planet={island} setPage={go} onClose={()=>setIsland(null)} onOpenSortingGame={()=>setSortingGame(true)} onOpenMysqlQuest={()=>setMysqlQuest(true)} userData={userData}/>}
    </>
  );
}
