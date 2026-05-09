import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import SubjectsPage from "./pages/SubjectsPage";
import ProgressPage from "./pages/ProgressPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
export const PLANETS = [
  {
    id: "dsa", name: "Data Structures & Algorithms", shortName: "DSA",
    color: "#4A9EFF", glowColor: "rgba(74,158,255,0.45)",
    grad: ["#0d2a5e", "#1a4a9a", "#4A9EFF", "#0a1a3a"],
    ring1: "rgba(74,158,255,0.55)", ring2: "rgba(74,158,255,0.2)",
    checkpoints: [{ number: 1, x: 10, y: 68, label: "Arrays" }, { number: 2, x: 22, y: 48, label: "Linked Lists" }, { number: 3, x: 32, y: 30, label: "Stacks" }, { number: 4, x: 38, y: 65, label: "Queues" }, { number: 5, x: 50, y: 46, label: "Trees" }, { number: 6, x: 58, y: 28, label: "Graphs" }, { number: 7, x: 65, y: 65, label: "Heaps" }, { number: 8, x: 80, y: 44, label: "DP" }],
    pathSegments: ["M 10 68 Q 15 57 22 48", "M 22 48 Q 26 38 32 30", "M 32 30 Q 34 47 38 65", "M 38 65 Q 43 55 50 46", "M 50 46 Q 53 36 58 28", "M 58 28 Q 61 47 65 65", "M 65 65 Q 72 53 80 44"],
    activeLevel: 3, currentQuest: "Stack Implementation", currentLevel: "Level 3",
    xp: 650, maxXp: 1000, coins: 100, gems: 80,
    lessons: [{ id: "1.0", title: "Introduction to Arrays", icon: "check", status: "complete" }, { id: "2.0", title: "Linked List Traversal", icon: "check", status: "complete" }, { id: "3.0", title: "Stack Implementation", icon: "play", status: "active", duration: "12:30" }, { id: "3.1", title: "Queue Patterns & BFS", icon: "circle", status: "upcoming", duration: "09:45" }],
    todos: [{ text: "3.0 Challenge – Implement Min Stack", due: "Mar 12", done: false }, { text: "3.1 Practice – Valid Parentheses", due: "Mar 14", done: false }],
  },
  {
    id: "ai", name: "Artificial Intelligence", shortName: "AI",
    color: "#A8D8EA", glowColor: "rgba(168,216,234,0.4)",
    grad: ["#0a2030", "#144060", "#A8D8EA", "#081828"],
    ring1: "rgba(168,216,234,0.5)", ring2: "rgba(168,216,234,0.18)",
    checkpoints: [{ number: 1, x: 10, y: 68, label: "Basics" }, { number: 2, x: 22, y: 48, label: "Search" }, { number: 3, x: 33, y: 30, label: "ML Intro" }, { number: 4, x: 40, y: 65, label: "Neural Nets" }, { number: 5, x: 52, y: 44, label: "CNN" }, { number: 6, x: 60, y: 27, label: "NLP" }, { number: 7, x: 68, y: 64, label: "RL" }, { number: 8, x: 80, y: 44, label: "AGI" }],
    pathSegments: ["M 10 68 Q 15 57 22 48", "M 22 48 Q 26 38 33 30", "M 33 30 Q 35 48 40 65", "M 40 65 Q 45 54 52 44", "M 52 44 Q 55 35 60 27", "M 60 27 Q 63 47 68 64", "M 68 64 Q 74 52 80 44"],
    activeLevel: 2, currentQuest: "Search Strategies", currentLevel: "Level 2",
    xp: 320, maxXp: 800, coins: 60, gems: 45,
    lessons: [{ id: "1.0", title: "What is Artificial Intelligence?", icon: "check", status: "complete" }, { id: "2.0", title: "Search Strategies", icon: "play", status: "active", duration: "14:20" }, { id: "2.1", title: "Heuristics & A* Algorithm", icon: "circle", status: "upcoming", duration: "11:05" }, { id: "3.0", title: "Intro to Machine Learning", icon: "circle", status: "upcoming", duration: "16:00" }],
    todos: [{ text: "2.0 Challenge – Implement BFS on a graph", due: "Mar 13", done: false }, { text: "2.1 Quiz – A* Pathfinding", due: "Mar 15", done: true }],
  },
  {
    id: "web", name: "Web Development", shortName: "Web Dev",
    color: "#FFB347", glowColor: "rgba(255,179,71,0.4)",
    grad: ["#3a1a00", "#6a3000", "#FFB347", "#250f00"],
    ring1: "rgba(255,179,71,0.5)", ring2: "rgba(255,179,71,0.18)",
    checkpoints: [{ number: 1, x: 10, y: 68, label: "HTML" }, { number: 2, x: 22, y: 50, label: "CSS" }, { number: 3, x: 32, y: 32, label: "JS" }, { number: 4, x: 40, y: 65, label: "React" }, { number: 5, x: 52, y: 44, label: "Node.js" }, { number: 6, x: 60, y: 27, label: "APIs" }, { number: 7, x: 68, y: 65, label: "DevOps" }, { number: 8, x: 80, y: 44, label: "Full Stack" }],
    pathSegments: ["M 10 68 Q 15 58 22 50", "M 22 50 Q 26 40 32 32", "M 32 32 Q 34 49 40 65", "M 40 65 Q 45 54 52 44", "M 52 44 Q 55 35 60 27", "M 60 27 Q 63 47 68 65", "M 68 65 Q 74 53 80 44"],
    activeLevel: 4, currentQuest: "React Hooks & State", currentLevel: "Level 4",
    xp: 880, maxXp: 1200, coins: 200, gems: 120,
    lessons: [{ id: "1.0", title: "HTML5 Semantics & Structure", icon: "check", status: "complete" }, { id: "2.0", title: "CSS Grid & Flexbox", icon: "check", status: "complete" }, { id: "3.0", title: "JavaScript ES6+", icon: "check", status: "complete" }, { id: "4.0", title: "React Hooks & State", icon: "play", status: "active", duration: "18:15" }, { id: "4.1", title: "useEffect & Side Effects", icon: "circle", status: "upcoming", duration: "13:40" }],
    todos: [{ text: "4.0 Build – Counter with useState", due: "Mar 11", done: true }, { text: "4.1 Challenge – Fetch API with useEffect", due: "Mar 14", done: false }],
  },
  {
    id: "os", name: "Operating Systems", shortName: "OS",
    color: "#C8A2FF", glowColor: "rgba(200,162,255,0.4)",
    grad: ["#1a0a30", "#350a6a", "#C8A2FF", "#0f0520"],
    ring1: "rgba(200,162,255,0.5)", ring2: "rgba(200,162,255,0.18)",
    checkpoints: [{ number: 1, x: 10, y: 68, label: "Processes" }, { number: 2, x: 22, y: 48, label: "Threads" }, { number: 3, x: 32, y: 30, label: "Scheduling" }, { number: 4, x: 38, y: 65, label: "Memory" }, { number: 5, x: 50, y: 46, label: "Deadlocks" }, { number: 6, x: 58, y: 28, label: "File Sys" }, { number: 7, x: 65, y: 65, label: "I/O" }, { number: 8, x: 80, y: 44, label: "Security" }],
    pathSegments: ["M 10 68 Q 15 57 22 48", "M 22 48 Q 26 38 32 30", "M 32 30 Q 34 47 38 65", "M 38 65 Q 43 55 50 46", "M 50 46 Q 53 36 58 28", "M 58 28 Q 61 47 65 65", "M 65 65 Q 72 53 80 44"],
    activeLevel: 1, currentQuest: "Kernel Architecture", currentLevel: "Level 1",
    xp: 80, maxXp: 600, coins: 20, gems: 10,
    lessons: [{ id: "1.0", title: "What is an OS? Kernel Architecture", icon: "play", status: "active", duration: "15:00" }, { id: "1.1", title: "Process vs Thread", icon: "circle", status: "upcoming", duration: "10:30" }, { id: "2.0", title: "CPU Scheduling Algorithms", icon: "circle", status: "upcoming", duration: "14:00" }],
    todos: [{ text: "1.0 Reading – OS Concepts Ch. 1–2", due: "Mar 12", done: false }],
  },
  {
    id: "db", name: "Databases", shortName: "Databases",
    color: "#4DFFC3", glowColor: "rgba(77,255,195,0.35)",
    grad: ["#002a1e", "#005540", "#4DFFC3", "#001510"],
    ring1: "rgba(77,255,195,0.5)", ring2: "rgba(77,255,195,0.18)",
    checkpoints: [{ number: 1, x: 10, y: 68, label: "SQL Basics" }, { number: 2, x: 22, y: 48, label: "Joins" }, { number: 3, x: 32, y: 30, label: "Indexes" }, { number: 4, x: 38, y: 65, label: "NoSQL" }, { number: 5, x: 50, y: 46, label: "Transactions" }, { number: 6, x: 58, y: 28, label: "Optimization" }, { number: 7, x: 65, y: 65, label: "Sharding" }, { number: 8, x: 80, y: 44, label: "Distributed" }],
    pathSegments: ["M 10 68 Q 15 57 22 48", "M 22 48 Q 26 38 32 30", "M 32 30 Q 34 47 38 65", "M 38 65 Q 43 55 50 46", "M 50 46 Q 53 36 58 28", "M 58 28 Q 61 47 65 65", "M 65 65 Q 72 53 80 44"],
    activeLevel: 2, currentQuest: "SQL Joins: INNER, LEFT, RIGHT", currentLevel: "Level 2",
    xp: 240, maxXp: 700, coins: 55, gems: 35,
    lessons: [{ id: "1.0", title: "Relational Model & SQL Intro", icon: "check", status: "complete" }, { id: "2.0", title: "SQL Joins Explained", icon: "play", status: "active", duration: "11:45" }, { id: "2.1", title: "Subqueries & Aggregations", icon: "circle", status: "upcoming", duration: "09:30" }],
    todos: [{ text: "2.0 Challenge – Write 5 JOIN queries", due: "Mar 13", done: false }, { text: "2.1 Quiz – GROUP BY & HAVING", due: "Mar 16", done: false }],
  },
  {
    id: "cn", name: "Computer Networks", shortName: "Networks",
    color: "#FF6B9D", glowColor: "rgba(255,107,157,0.4)",
    grad: ["#2a0018", "#550030", "#FF6B9D", "#180010"],
    ring1: "rgba(255,107,157,0.5)", ring2: "rgba(255,107,157,0.18)",
    checkpoints: [{ number: 1, x: 10, y: 68, label: "OSI Model" }, { number: 2, x: 22, y: 48, label: "TCP/IP" }, { number: 3, x: 32, y: 30, label: "HTTP/S" }, { number: 4, x: 38, y: 65, label: "DNS" }, { number: 5, x: 50, y: 46, label: "Routing" }, { number: 6, x: 58, y: 28, label: "Security" }, { number: 7, x: 65, y: 65, label: "Wireless" }, { number: 8, x: 80, y: 44, label: "Cloud Net" }],
    pathSegments: ["M 10 68 Q 15 57 22 48", "M 22 48 Q 26 38 32 30", "M 32 30 Q 34 47 38 65", "M 38 65 Q 43 55 50 46", "M 50 46 Q 53 36 58 28", "M 58 28 Q 61 47 65 65", "M 65 65 Q 72 53 80 44"],
    activeLevel: 1, currentQuest: "OSI Model: 7 Layers", currentLevel: "Level 1",
    xp: 50, maxXp: 600, coins: 15, gems: 8,
    lessons: [{ id: "1.0", title: "OSI Model & Network Layers", icon: "play", status: "active", duration: "16:20" }, { id: "1.1", title: "Physical & Data Link Layers", icon: "circle", status: "upcoming", duration: "12:00" }, { id: "2.0", title: "TCP vs UDP", icon: "circle", status: "upcoming", duration: "14:10" }],
    todos: [{ text: "1.0 Reading – OSI vs TCP/IP models", due: "Mar 14", done: false }],
  },
  {
    id: "cyber", name: "Cybersecurity", shortName: "CyberSec",
    color: "#FF4444", glowColor: "rgba(255,68,68,0.4)",
    grad: ["#2a0000", "#550000", "#FF4444", "#180000"],
    ring1: "rgba(255,68,68,0.5)", ring2: "rgba(255,68,68,0.18)",
    checkpoints: [{ number: 1, x: 10, y: 68, label: "Threats" }, { number: 2, x: 22, y: 48, label: "Crypto" }, { number: 3, x: 32, y: 30, label: "Auth" }, { number: 4, x: 38, y: 65, label: "Web Sec" }, { number: 5, x: 50, y: 46, label: "Forensics" }, { number: 6, x: 58, y: 28, label: "Pen Test" }, { number: 7, x: 65, y: 65, label: "Malware" }, { number: 8, x: 80, y: 44, label: "Defence" }],
    pathSegments: ["M 10 68 Q 15 57 22 48", "M 22 48 Q 26 38 32 30", "M 32 30 Q 34 47 38 65", "M 38 65 Q 43 55 50 46", "M 50 46 Q 53 36 58 28", "M 58 28 Q 61 47 65 65", "M 65 65 Q 72 53 80 44"],
    activeLevel: 1, currentQuest: "Threat Landscape & CIA Triad", currentLevel: "Level 1",
    xp: 100, maxXp: 600, coins: 25, gems: 12,
    lessons: [{ id: "1.0", title: "Security Fundamentals & CIA Triad", icon: "play", status: "active", duration: "13:00" }, { id: "1.1", title: "Common Attack Types", icon: "circle", status: "upcoming", duration: "11:20" }, { id: "2.0", title: "Cryptography Basics", icon: "circle", status: "upcoming", duration: "15:00" }],
    todos: [{ text: "1.0 Quiz – CIA Triad scenarios", due: "Mar 15", done: false }],
  },
];

export const LEADERBOARD = [
  { rank: 1, name: "Zara Nova", xp: 12480, planets: 5, avatar: "ZN", streak: 42 },
  { rank: 2, name: "Kai Orison", xp: 11230, planets: 4, avatar: "KO", streak: 38 },
  { rank: 3, name: "Lyra Chen", xp: 10890, planets: 4, avatar: "LC", streak: 31 },
  { rank: 4, name: "Atlas Renn", xp: 9760, planets: 3, avatar: "AR", streak: 28 },
  { rank: 5, name: "Nyx Vael", xp: 8920, planets: 3, avatar: "NV", streak: 22 },
  { rank: 6, name: "Orion Flux", xp: 7650, planets: 2, avatar: "OF", streak: 19 },
  { rank: 7, name: "You", xp: 6840, planets: 3, avatar: "ME", streak: 15, isUser: true },
  { rank: 8, name: "Sera Kold", xp: 5430, planets: 2, avatar: "SK", streak: 12 },
];

export const BADGES = [
  { id: 1, name: "First Star", icon: "★", earned: true, rarity: "common" },
  { id: 2, name: "Algorithm Ace", icon: "⬡", earned: true, rarity: "rare" },
  { id: 3, name: "Neural Pioneer", icon: "◎", earned: true, rarity: "epic" },
  { id: 4, name: "Web Weaver", icon: "⬟", earned: true, rarity: "rare" },
  { id: 5, name: "Streak Master", icon: "🔥", earned: true, rarity: "epic" },
  { id: 6, name: "XP Hunter", icon: "◈", earned: true, rarity: "common" },
  { id: 7, name: "Speed Coder", icon: "⚡", earned: false, rarity: "legendary" },
  { id: 8, name: "Galaxy Brain", icon: "◉", earned: false, rarity: "legendary" },
];

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

function StarField() {
  const stars = useMemo(() => Array.from({ length: 220 }, (_, i) => ({
    id: i, x: Math.random() * 1440, y: Math.random() * 900,
    r: Math.random() * 1.8 + .3, delay: Math.random() * 10, dur: 2.5 + Math.random() * 5,
  })), []);
  return (
    <svg className="stars-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      {stars.map(s => (
        <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill="white"
          style={{ animation: `twk ${s.dur}s ease-in-out ${s.delay}s infinite`, opacity: .15 }} />
      ))}
      <ellipse cx="280" cy="240" rx="220" ry="110" fill="rgba(74,158,255,0.03)" style={{ animation: 'nd 22s ease-in-out infinite' }} />
      <ellipse cx="1160" cy="650" rx="190" ry="130" fill="rgba(168,216,234,0.025)" style={{ animation: 'nd 28s ease-in-out 6s infinite' }} />
      <ellipse cx="720" cy="780" rx="260" ry="85" fill="rgba(255,179,71,0.02)" style={{ animation: 'nd 32s ease-in-out 12s infinite' }} />
      <ellipse cx="1300" cy="180" rx="170" ry="95" fill="rgba(200,162,255,0.025)" style={{ animation: 'nd 25s ease-in-out 4s infinite' }} />
    </svg>
  );
}

function Planet3D({ planet, size = 160 }) {
  const r = size / 2, c = planet;
  return (
    <svg width={size + 70} height={size + 55} viewBox={`0 0 ${size + 70} ${size + 55}`}>
      <defs>
        <radialGradient id={`pg${c.id}`} cx="34%" cy="28%" r="70%">
          <stop offset="0%" stopColor={c.grad[2]} stopOpacity=".92" />
          <stop offset="38%" stopColor={c.grad[1]} stopOpacity=".87" />
          <stop offset="72%" stopColor={c.grad[0]} stopOpacity=".92" />
          <stop offset="100%" stopColor={c.grad[3]} stopOpacity=".96" />
        </radialGradient>
        <radialGradient id={`sp${c.id}`} cx="29%" cy="24%" r="38%">
          <stop offset="0%" stopColor="white" stopOpacity=".2" /><stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`am${c.id}`} cx="72%" cy="76%" r="50%">
          <stop offset="0%" stopColor={c.grad[3]} stopOpacity=".5" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`cl${c.id}`}><circle cx={r + 35} cy={r + 8} r={r} /></clipPath>
      </defs>
      <ellipse cx={r + 35} cy={r + 8 + r * .12} rx={r * 1.55} ry={r * .22} fill="none" stroke={c.ring1} strokeWidth="2.5"
        style={{ animation: 'ringSpin 20s linear infinite', transformOrigin: `${r + 35}px ${r + 8 + r * .12}px` }} />
      <ellipse cx={r + 35} cy={r + 8 + r * .12} rx={r * 1.72} ry={r * .29} fill="none" stroke={c.ring2} strokeWidth="7" strokeDasharray="4 9"
        style={{ animation: 'ringSpinR 30s linear infinite', transformOrigin: `${r + 35}px ${r + 8 + r * .12}px` }} />
      <circle cx={r + 35} cy={r + 8} r={r} fill={`url(#pg${c.id})`} />
      <g clipPath={`url(#cl${c.id})`}>
        <ellipse cx={r + 35} cy={r - 6} rx={r * .94} ry={r * .11} fill={`${c.grad[2]}28`} />
        <ellipse cx={r + 25} cy={r + 18} rx={r * .8} ry={r * .09} fill={`${c.grad[2]}20`} />
        <ellipse cx={r + 45} cy={r + 44} rx={r * .68} ry={r * .07} fill={`${c.grad[2]}18`} />
        <circle cx={r + 12} cy={r - 8} r={r * .09} fill={`${c.grad[0]}cc`} />
        <circle cx={r + 58} cy={r + 22} r={r * .07} fill={`${c.grad[1]}aa`} />
        <circle cx={r + 28} cy={r + 48} r={r * .055} fill={`${c.grad[0]}bb`} />
      </g>
      <circle cx={r + 35} cy={r + 8} r={r} fill={`url(#sp${c.id})`} />
      <circle cx={r + 35} cy={r + 8} r={r} fill={`url(#am${c.id})`} />
    </svg>
  );
}

function PixelChar({ type, color, fr }) {
  const sz = "clamp(14px,1.6vw,26px)";
  const s = { width: sz, height: sz, transform: fr ? "scaleX(1)" : "scaleX(-1)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,.6))" };
  if (type === "knight") return (<svg viewBox="0 0 16 16" style={s}><rect x="5" y="1" width="6" height="2" fill="#90A4AE" /><rect x="6" y="0" width="4" height="1" fill="#B0BEC5" /><rect x="5" y="3" width="6" height="4" fill="#FFCC80" /><rect x="7" y="4" width="1" height="1" fill="#3E2723" /><rect x="9" y="4" width="1" height="1" fill="#3E2723" /><rect x="4" y="7" width="8" height="4" fill={color} /><rect x="5" y="8" width="6" height="2" fill="#B0BEC5" /><rect x="2" y="7" width="2" height="3" fill="#78909C" /><rect x="12" y="6" width="2" height="4" fill="#FFCC80" /><rect x="13" y="3" width="1" height="4" fill="#E0E0E0" /><rect x="5" y="11" width="2" height="3" fill="#5D4037" /><rect x="9" y="11" width="2" height="3" fill="#5D4037" /><rect x="4" y="14" width="3" height="2" fill="#4E342E" /><rect x="9" y="14" width="3" height="2" fill="#4E342E" /></svg>);
  if (type === "mage") return (<svg viewBox="0 0 16 16" style={s}><rect x="7" y="0" width="2" height="1" fill={color} /><rect x="5" y="1" width="6" height="2" fill={color} /><rect x="4" y="3" width="8" height="1" fill={color} /><rect x="7" y="1" width="2" height="2" fill="#FFD54F" /><rect x="5" y="4" width="6" height="3" fill="#FFCC80" /><rect x="6" y="5" width="1" height="1" fill="#7B1FA2" /><rect x="9" y="5" width="1" height="1" fill="#7B1FA2" /><rect x="4" y="7" width="8" height="5" fill={color} /><rect x="6" y="8" width="4" height="1" fill="#FFD54F" /><rect x="12" y="4" width="1" height="10" fill="#8D6E63" /><rect x="11" y="2" width="3" height="3" rx="1" fill="#7E57C2" /><rect x="3" y="12" width="10" height="2" fill={color} /><rect x="4" y="14" width="3" height="2" fill={color} /><rect x="9" y="14" width="3" height="2" fill={color} /></svg>);
  if (type === "scout") return (<svg viewBox="0 0 16 16" style={s}><rect x="5" y="1" width="6" height="3" fill={color} /><rect x="4" y="2" width="2" height="2" fill={color} /><rect x="5" y="4" width="6" height="3" fill="#FFCC80" /><rect x="7" y="5" width="1" height="1" fill="#2E7D32" /><rect x="9" y="5" width="1" height="1" fill="#2E7D32" /><rect x="5" y="7" width="6" height="4" fill={color} /><rect x="6" y="8" width="4" height="1" fill="#4E342E" /><rect x="12" y="5" width="1" height="6" fill="#8D6E63" /><rect x="13" y="6" width="1" height="4" fill="#F5F5DC" /><rect x="3" y="7" width="2" height="5" fill="#2E7D32" /><rect x="5" y="11" width="2" height="3" fill="#5D4037" /><rect x="9" y="11" width="2" height="3" fill="#5D4037" /><rect x="4" y="14" width="3" height="2" fill="#3E2723" /><rect x="9" y="14" width="3" height="2" fill="#3E2723" /></svg>);
  return (<svg viewBox="0 0 20 16" style={s}><rect x="3" y="2" width="2" height="1" fill={color} /><rect x="2" y="3" width="4" height="1" fill={color} /><rect x="1" y="4" width="5" height="2" fill={color} /><rect x="13" y="2" width="2" height="1" fill={color} /><rect x="12" y="3" width="4" height="1" fill={color} /><rect x="12" y="4" width="5" height="2" fill={color} /><rect x="7" y="1" width="4" height="3" fill={color} /><rect x="8" y="2" width="1" height="1" fill="#FFF176" /><rect x="10" y="2" width="1" height="1" fill="#FFF176" /><rect x="7" y="0" width="1" height="1" fill="#FFD54F" /><rect x="10" y="0" width="1" height="1" fill="#FFD54F" /><rect x="6" y="4" width="6" height="5" fill={color} /><rect x="7" y="5" width="4" height="3" fill="#FFAB91" /><rect x="4" y="8" width="2" height="1" fill={color} /><rect x="2" y="9" width="3" height="1" fill={color} /><rect x="6" y="9" width="2" height="3" fill={color} /><rect x="10" y="9" width="2" height="3" fill={color} /><rect x="5" y="12" width="3" height="1" fill={color} /><rect x="10" y="12" width="3" height="1" fill={color} /><rect x="12" y="1" width="1" height="2" fill="#FFAB40" /><rect x="13" y="0" width="1" height="1" fill="#FF6D00" /></svg>);
}

function AnimChar({ ch }) {
  const [pos, setPos] = useState(ch.pts[0]);
  const [fr, setFr] = useState(true);
  const [bob, setBob] = useState(0);
  const t0 = useRef(Date.now());
  useEffect(() => {
    let raf;
    const tick = () => {
      const el = Date.now() - t0.current;
      const tt = (el % ch.speed) / ch.speed;
      const pts = ch.pts, segs = pts.length - 1;
      const si = Math.min(Math.floor(tt * segs), segs - 1);
      const st = tt * segs - si;
      const p1 = pts[si], p2 = pts[si + 1];
      setFr(p2.x >= p1.x);
      setPos({ x: p1.x + (p2.x - p1.x) * st, y: p1.y + (p2.y - p1.y) * st });
      setBob(Math.sin(el / 200) * .4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ch]);
  return (
    <div style={{ position: "absolute", zIndex: 8, pointerEvents: "none", left: `${pos.x}%`, top: `${pos.y + bob}%`, transform: "translate(-50%,-50%)", transition: "left .05s linear,top .05s linear" }}>
      <div style={{ position: "absolute", width: "clamp(8px,1.1vw,15px)", height: "clamp(2px,.3vw,4px)", background: "rgba(0,0,0,.4)", bottom: -3, left: "50%", transform: "translateX(-50%)", borderRadius: "50%", filter: "blur(2px)" }} />
      <PixelChar type={ch.type} color={ch.color} fr={fr} />
    </div>
  );
}

function IslandTerrain() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2 }} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax meet">
      <defs>
        <radialGradient id="islandGrad" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="#5D4037" /><stop offset="40%" stopColor="#4E342E" /><stop offset="100%" stopColor="#3E2723" />
        </radialGradient>
        <linearGradient id="grassTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#388E3C" /><stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#43A047" /><stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1565C0" stopOpacity=".8" /><stop offset="100%" stopColor="#0D47A1" stopOpacity=".9" />
        </linearGradient>
        <filter id="softBlur"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <ellipse cx="500" cy="560" rx="520" ry="80" fill="url(#waterGrad)" />
      <ellipse cx="500" cy="490" rx="430" ry="110" fill="url(#islandGrad)" />
      <path d="M 85 490 Q 180 370 280 340 Q 350 320 420 340 Q 480 355 500 340 Q 540 325 600 330 Q 680 340 750 360 Q 830 385 900 430 Q 930 450 915 490 Z" fill="url(#grassTop)" />
      <path d="M 200 430 Q 240 380 290 370 Q 330 365 360 385 Q 380 398 370 430 Z" fill="url(#hillGrad)" opacity=".9" />
      <path d="M 580 390 Q 620 345 680 355 Q 720 365 730 395 Q 735 415 710 430 Z" fill="url(#hillGrad)" opacity=".85" />
      {[{ x: 160, y: 438, s: 1.1 }, { x: 195, y: 422, s: .9 }, { x: 240, y: 398, s: 1.0 }, { x: 320, y: 362, s: 1.2 }, { x: 358, y: 355, s: .85 }, { x: 400, y: 358, s: .95 }, { x: 510, y: 348, s: 1.1 }, { x: 560, y: 350, s: .9 }, { x: 610, y: 352, s: 1.0 }, { x: 670, y: 362, s: 1.15 }, { x: 720, y: 375, s: .88 }, { x: 760, y: 388, s: 1.0 }, { x: 820, y: 408, s: .92 }, { x: 860, y: 425, s: 1.05 }].map((t, i) => (
        <g key={i} transform={`translate(${t.x},${t.y}) scale(${t.s})`} style={{ animation: `treeSway ${3 + i * .4}s ease-in-out ${i * .3}s infinite`, transformOrigin: `${t.x}px ${t.y}px` }}>
          <rect x="-3" y="-6" width="6" height="22" fill="#5D4037" rx="2" />
          <ellipse cx="0" cy="-14" rx="14" ry="16" fill="#2E7D32" />
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="#388E3C" />
          <ellipse cx="-2" cy="-22" rx="7" ry="9" fill="#43A047" />
        </g>
      ))}
      {[{ x: 280, y: 462 }, { x: 450, y: 372 }, { x: 640, y: 405 }, { x: 740, y: 442 }, { x: 180, y: 468 }].map((r, i) => (
        <g key={i}><ellipse cx={r.x} cy={r.y + 4} rx="10" ry="5" fill="rgba(0,0,0,.2)" /><ellipse cx={r.x} cy={r.y} rx="11" ry="9" fill="#78909C" /><ellipse cx={r.x - 3} cy={r.y - 3} rx="5" ry="4" fill="#90A4AE" /></g>
      ))}
      <path d="M 130 478 Q 200 455 280 432 Q 340 415 400 418 Q 460 420 510 408 Q 570 395 620 388 Q 680 380 730 392 Q 790 408 850 435 Q 880 448 900 465" fill="none" stroke="#A1887F" strokeWidth="8" strokeLinecap="round" opacity=".5" />
      {[{ x: 120, y: 200 }, { x: 380, y: 150 }, { x: 650, y: 180 }, { x: 880, y: 160 }].map((cl, i) => (
        <g key={i} style={{ animation: `cloudDrift ${8 + i * 2}s ease-in-out ${i * 1.5}s infinite`, opacity: .35 }}>
          <ellipse cx={cl.x} cy={cl.y} rx="55" ry="22" fill="rgba(255,255,255,.6)" filter="url(#softBlur)" />
          <ellipse cx={cl.x + 25} cy={cl.y - 8} rx="38" ry="18" fill="rgba(255,255,255,.5)" filter="url(#softBlur)" />
          <ellipse cx={cl.x - 22} cy={cl.y - 5} rx="30" ry="15" fill="rgba(255,255,255,.5)" filter="url(#softBlur)" />
        </g>
      ))}
    </svg>
  );
}

function IslandWorld({ planet, onClose }) {
  const al = planet.activeLevel;
  const [selLesson, setSelLesson] = useState(null);
  const [todos, setTodos] = useState(planet.todos.map(t => ({ ...t })));
  const [addTodo, setAddTodo] = useState(false);
  const [nt, setNt] = useState(""); const [nd, setNd] = useState("");
  const [navLink, setNavLink] = useState("My Startup");
  const chars = [
    { id: "k", color: "#4FC3F7", pts: [{ x: 14, y: 60 }, { x: 18, y: 53 }, { x: 16, y: 58 }, { x: 12, y: 63 }, { x: 14, y: 60 }], speed: 8000, type: "knight" },
    { id: "m", color: "#CE93D8", pts: [{ x: 44, y: 38 }, { x: 48, y: 34 }, { x: 52, y: 40 }, { x: 46, y: 43 }, { x: 44, y: 38 }], speed: 10000, type: "mage" },
    { id: "s", color: "#81C784", pts: [{ x: 70, y: 53 }, { x: 74, y: 48 }, { x: 77, y: 54 }, { x: 72, y: 58 }, { x: 70, y: 53 }], speed: 7000, type: "scout" },
    { id: "d", color: "#FF8A65", pts: [{ x: 62, y: 20 }, { x: 67, y: 15 }, { x: 72, y: 22 }, { x: 65, y: 25 }, { x: 62, y: 20 }], speed: 12000, type: "dragon" },
  ];
  const LIcon = ({ icon }) => {
    if (icon === "check") return (<div style={{ width: 18, height: 18, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>);
    if (icon === "play") return (<div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="8" height="10" viewBox="0 0 8 10" fill="none"><path d="M1 1L7 5L1 9V1Z" fill="white" /></svg></div>);
    return (<div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,.4)", flexShrink: 0 }} />);
  };
  const navLinks = [{ label: "My Startup", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" }, { label: "Portfolio", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }, { label: "Marketplace", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" }];
  return (
    <div className="island-enter" style={{ position: "fixed", inset: 0, zIndex: 100, background: "linear-gradient(180deg,#1E0F3B 0%,#2D1B4E 15%,#4A2D7A 35%,#6B4A9E 55%,#9B7CC4 75%,#C4A8D8 90%,#D4B8A0 100%)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <nav style={{ position: "relative", zIndex: 20, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 0 20px", background: "linear-gradient(90deg,rgba(15,8,35,0.97) 0%,rgba(30,18,60,0.95) 50%,rgba(15,8,35,0.97) 100%)", borderBottom: "1px solid rgba(124,77,255,0.15)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.5)", fontSize: ".7rem", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".1em", background: "none", border: "1px solid rgba(255,255,255,.1)", borderRadius: 6, padding: "3px 10px", cursor: "pointer", transition: "all .2s" }} onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,.3)"; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; }}>← BACK</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#7C4DFF 0%,#00BCD4 100%)", boxShadow: "0 2px 12px rgba(124,77,255,.5),0 0 20px rgba(0,188,212,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.2)" /><circle cx="6" cy="16" r="2" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.2)" /><circle cx="18" cy="16" r="2" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.2)" /><line x1="12" y1="11" x2="7" y2="14.5" stroke="white" strokeWidth="1" opacity=".7" /><line x1="12" y1="11" x2="17" y2="14.5" stroke="white" strokeWidth="1" opacity=".7" /><line x1="8" y1="16" x2="16" y2="16" stroke="white" strokeWidth="1" opacity=".4" /></svg>
            </div>
            <span style={{ fontSize: "1.05rem", fontWeight: 700, letterSpacing: ".15em", background: "linear-gradient(90deg,#FFFFFF 0%,#B388FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NEUROVERSE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navLinks.map(l => {
              const isA = navLink === l.label; return (
                <button key={l.label} onClick={() => setNavLink(l.label)} style={{ position: "relative", display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 8, fontSize: ".8rem", fontWeight: 500, color: isA ? "#E1BEE7" : "rgba(255,255,255,.5)", background: isA ? "rgba(124,77,255,.15)" : "transparent", border: "none", cursor: "pointer", transition: "all .2s" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: isA ? 1 : .6 }}><path d={l.icon} /></svg>
                  {l.label}
                  {isA && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 2, borderRadius: 1, background: "linear-gradient(90deg,#7C4DFF,#00BCD4)", boxShadow: "0 0 8px rgba(124,77,255,.6)" }} />}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "rgba(255,215,0,.08)", border: "1px solid rgba(255,215,0,.2)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="url(#cg)" stroke="#FFC107" strokeWidth=".5" /><text x="8" y="11" textAnchor="middle" fontSize="8" fill="#795548" fontWeight="bold">$</text><defs><linearGradient id="cg" x1="0" y1="0" x2="16" y2="16"><stop offset="0%" stopColor="#FFD54F" /><stop offset="100%" stopColor="#FF8F00" /></linearGradient></defs></svg>
            <span style={{ fontSize: ".72rem", fontWeight: 600, color: "#FFD54F" }}>{planet.coins}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "rgba(0,188,212,.08)", border: "1px solid rgba(0,188,212,.2)" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 5.5L8 15L14 5.5L8 1Z" fill="url(#gg)" /><path d="M8 1L2 5.5L8 6.5L14 5.5L8 1Z" fill="#B3E5FC" fillOpacity=".8" /><defs><linearGradient id="gg" x1="2" y1="1" x2="14" y2="15"><stop offset="0%" stopColor="#4FC3F7" /><stop offset="100%" stopColor="#0288D1" /></linearGradient></defs></svg>
            <span style={{ fontSize: ".72rem", fontWeight: 600, color: "#4FC3F7" }}>{planet.gems}</span>
          </div>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,.1)" }} />
          <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7C4DFF,#00BCD4)", border: "2px solid rgba(255,255,255,.2)", boxShadow: "0 2px 10px rgba(124,77,255,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontSize: ".72rem", fontWeight: 700 }}>M</span></div>
            <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: "#4CAF50", border: "2px solid rgba(15,8,35,.97)" }} />
          </button>
        </div>
      </nav>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <IslandTerrain />
        {chars.map(ch => <AnimChar key={ch.id} ch={ch} />)}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
          {planet.pathSegments.map((d, i) => (<path key={i} d={d} stroke={i < al - 1 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)"} strokeWidth=".4" strokeDasharray="1.2 0.8" fill="none" />))}
        </svg>
        {planet.checkpoints.map(cp => {
          const isDone = cp.number < al, isCur = cp.number === al, isLock = cp.number > al;
          const sz = "clamp(30px,3.5vw,52px)", fs = "clamp(11px,1.5vw,20px)";
          return (
            <div key={cp.number} style={{ position: "absolute", left: `${cp.x}%`, top: `${cp.y}%`, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
              {isCur && <div className="ping-anim" style={{ position: "absolute", width: "clamp(36px,4vw,60px)", height: "clamp(36px,4vw,60px)", borderRadius: "50%", background: "rgba(255,193,7,.25)" }} />}
              <button style={{
                width: sz, height: sz, fontSize: fs, fontFamily: "'Press Start 2P',monospace", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700,
                background: isDone ? "linear-gradient(135deg,#1B5E20,#43A047)" : isCur ? "linear-gradient(135deg,#E65100,#FB8C00)" : "linear-gradient(135deg,#1A237E,#3949AB)",
                border: isDone ? "3px solid #66BB6A" : isCur ? "3px solid #FFD54F" : "3px solid #5C6BC0",
                boxShadow: isDone ? "0 4px 16px rgba(76,175,80,.5)" : isCur ? "0 4px 24px rgba(255,152,0,.65)" : "0 4px 12px rgba(63,81,181,.35)",
                opacity: isLock ? .55 : 1, cursor: isLock ? "not-allowed" : "pointer", transition: "transform .2s",
              }}>
                {isDone ? (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: "55%", height: "55%" }}><polyline points="20 6 9 17 4 12" /></svg>)
                  : isLock ? (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "50%", height: "50%", opacity: .7 }}><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2z" /></svg>)
                    : cp.number}
              </button>
              <span style={{ marginTop: 4, fontFamily: "'Press Start 2P',monospace", fontSize: "clamp(6px,0.75vw,10px)", color: isDone ? "#A5D6A7" : isCur ? "#FFD54F" : "rgba(255,255,255,.45)", textShadow: "0 1px 6px rgba(0,0,0,.8)", whiteSpace: "nowrap" }}>{isDone ? "DONE" : cp.label}</span>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: "50%", top: "28%", transform: "translate(-50%,-50%)", pointerEvents: "none", textAlign: "center", zIndex: 10, width: "100%" }}>
          <h2 style={{ fontFamily: "'Press Start 2P',monospace", textAlign: "center", color: "#F5E6C8", letterSpacing: ".3em", textShadow: "0 0 30px rgba(92,61,143,0.9),0 0 80px rgba(92,61,143,0.6),4px 4px 0px #2D1B4E", fontSize: "clamp(2rem,6vw,6rem)" }}>NEUROVERSE</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
            <div style={{ width: "25%", height: 3, background: "linear-gradient(90deg,transparent,#F5E6C8)" }} />
            <div style={{ width: 8, height: 8, background: "#FFD54F", transform: "rotate(45deg)", boxShadow: "0 0 8px rgba(255,213,79,.6)" }} />
            <div style={{ width: "15%", height: 3, background: "#F5E6C8" }} />
            <div style={{ width: 8, height: 8, background: "#FFD54F", transform: "rotate(45deg)" }} />
            <div style={{ width: "25%", height: 3, background: "linear-gradient(270deg,transparent,#F5E6C8)" }} />
          </div>
        </div>
        <div style={{ position: "absolute", right: 14, top: 10, bottom: 10, width: "clamp(210px,22vw,290px)", zIndex: 15, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
          <div style={{ borderRadius: 12, padding: "12px 14px", background: "rgba(255,255,255,.93)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#FF9800,#F57C00)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L13.5 8H19L14.5 12L16 18L11 14.5L6 18L7.5 12L3 8H8.5L11 2Z" fill="white" /></svg></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}><p style={{ fontSize: ".6rem", fontWeight: 700, color: "#1f2937", letterSpacing: ".05em", textTransform: "uppercase" }}>Current Quest</p><span style={{ fontSize: ".52rem", fontWeight: 700, padding: "1px 5px", borderRadius: 20, background: "#FFF3E0", color: "#E65100" }}>{planet.currentLevel}</span></div>
              <p style={{ fontSize: ".65rem", color: "#4B5563", lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{planet.currentQuest}</p>
              <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${(planet.xp / planet.maxXp) * 100}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#FF9800,#FFB74D)" }} /></div>
                <span style={{ fontSize: ".52rem", fontWeight: 600, color: "#6B7280", whiteSpace: "nowrap" }}>{planet.xp}/{planet.maxXp} XP</span>
              </div>
            </div>
            <button style={{ padding: "7px 11px", borderRadius: 8, background: "linear-gradient(135deg,#2DD4A8,#3BB89C)", color: "white", fontWeight: 700, fontSize: ".65rem", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>PLAY</button>
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", background: "rgba(20,60,70,.92)", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 5px" }}><h3 style={{ color: "white", fontWeight: 700, fontSize: ".78rem" }}>Lessons</h3><span style={{ color: "rgba(255,255,255,.75)", fontSize: ".65rem", fontWeight: 500 }}>Checkpoint {al}</span></div>
            <div style={{ padding: "0 14px 12px" }}>
              {planet.lessons.map((l, i) => (
                <div key={i}>{i > 0 && <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", margin: "6px 0" }} />}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "4px 0", cursor: l.status !== "upcoming" ? "pointer" : "default" }} onClick={() => l.status !== "upcoming" && setSelLesson(l)}>
                    <div style={{ marginTop: 1, flexShrink: 0 }}><LIcon icon={l.icon} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}><p style={{ color: "white", fontSize: ".68rem", lineHeight: 1.45 }}><span style={{ fontWeight: 700 }}>{l.id}</span> {l.title}</p></div>
                    {l.duration && <span style={{ color: "rgba(255,255,255,.55)", fontSize: ".6rem", whiteSpace: "nowrap", marginLeft: 5 }}>{l.duration}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", background: "rgba(20,60,70,.92)", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 5px" }}>
              <h3 style={{ color: "white", fontWeight: 700, fontSize: ".78rem" }}>My To-Do List</h3>
              <button onClick={() => setAddTodo(true)} style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#2DD4A8,#3BB89C)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 2V10" stroke="white" strokeWidth="2" strokeLinecap="round" /><path d="M2 6H10" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg></button>
            </div>
            <div style={{ padding: "0 14px 12px" }}>
              {todos.map((t, i) => (
                <div key={i}>{i > 0 && <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", margin: "5px 0" }} />}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "4px 0" }}>
                    <button onClick={() => setTodos(tt => tt.map((x, j) => j === i ? { ...x, done: !x.done } : x))} style={{ marginTop: 2, width: 15, height: 15, borderRadius: 3, flexShrink: 0, border: t.done ? "none" : "1.8px solid rgba(255,255,255,.5)", background: t.done ? "linear-gradient(135deg,#2DD4A8,#3BB89C)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {t.done && <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </button>
                    <p style={{ flex: 1, fontSize: ".65rem", color: t.done ? "rgba(255,255,255,.38)" : "white", textDecoration: t.done ? "line-through" : "none", lineHeight: 1.4 }}>{t.text}</p>
                    <span style={{ color: "rgba(255,255,255,.65)", fontSize: ".6rem", whiteSpace: "nowrap", marginLeft: 5 }}>{t.due}</span>
                  </div>
                </div>
              ))}
              {addTodo && (
                <div><div style={{ borderTop: "1px solid rgba(255,255,255,.1)", margin: "5px 0" }} />
                  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    <input value={nt} onChange={e => setNt(e.target.value)} placeholder="New task..." autoFocus style={{ flex: 1, background: "rgba(255,255,255,.1)", border: "none", borderRadius: 5, padding: "4px 7px", color: "white", fontSize: ".62rem", outline: "none" }} onKeyDown={e => { if (e.key === "Enter") { setTodos(tt => [...tt, { text: nt, due: nd || "No date", done: false }]); setNt(""); setNd(""); setAddTodo(false); } if (e.key === "Escape") { setAddTodo(false); } }} />
                    <input value={nd} onChange={e => setNd(e.target.value)} placeholder="Date" style={{ width: 50, background: "rgba(255,255,255,.1)", border: "none", borderRadius: 5, padding: "4px 6px", color: "white", fontSize: ".6rem", outline: "none" }} />
                    <button onClick={() => { setTodos(tt => [...tt, { text: nt, due: nd || "No date", done: false }]); setNt(""); setNd(""); setAddTodo(false); }} style={{ padding: "4px 8px", borderRadius: 5, background: "linear-gradient(135deg,#2DD4A8,#3BB89C)", color: "white", fontWeight: 700, fontSize: ".6rem", border: "none", cursor: "pointer" }}>Add</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {selLesson && (
        <div style={{ position: "absolute", inset: 0, zIndex: 30, background: "rgba(0,0,0,.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSelLesson(null)}>
          <div style={{ background: "rgba(15,8,35,.97)", border: "1px solid rgba(124,77,255,.3)", borderRadius: 16, padding: 26, maxWidth: 500, width: "100%", animation: "fiu .3s ease forwards" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div><div style={{ fontSize: ".62rem", letterSpacing: ".12em", color: "#B388FF", fontFamily: "'Rajdhani',sans-serif", marginBottom: 4 }}>{planet.shortName} · LESSON {selLesson.id}</div><h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.15rem", letterSpacing: ".04em", color: "white" }}>{selLesson.title}</h3></div>
              <button onClick={() => setSelLesson(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.4)", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <p style={{ fontSize: ".75rem", color: "rgba(255,255,255,.8)", lineHeight: 1.75 }}>This lesson covers <strong style={{ color: "white" }}>{selLesson.title}</strong> — one of the core topics in {planet.name}.</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Start Lesson", "Practice", "Take Quiz"].map((btn, i) => (
                <button key={btn} onClick={() => setSelLesson(null)} style={{ flex: 1, padding: "9px 0", borderRadius: 9, fontSize: ".65rem", fontWeight: 600, fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".1em", cursor: "pointer", background: i === 0 ? "linear-gradient(135deg,rgba(124,77,255,.3),rgba(124,77,255,.15))" : "rgba(255,255,255,.06)", border: `1px solid ${i === 0 ? "rgba(124,77,255,.5)" : "rgba(255,255,255,.1)"}`, color: i === 0 ? "#B388FF" : "rgba(255,255,255,.6)" }}>{btn.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar({ activePage, setPage }) {
  const links = ["Home", "Subjects", "Progress", "Leaderboard", "Profile"];
  const [sc, setSc] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 20); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h) }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "12px 24px", background: sc ? "rgba(5,11,26,.92)" : "rgba(5,11,26,.5)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.05)", transition: "background .3s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,rgba(74,158,255,.3),rgba(74,158,255,.1))", border: "1px solid rgba(74,158,255,.4)", boxShadow: "0 0 12px rgba(74,158,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#4A9EFF" }}>◎</div>
          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.2rem", letterSpacing: ".12em", color: "#e8f0fe" }}>EDU<span style={{ color: "#4A9EFF" }}>GALAXY</span></span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map(l => (
            <button key={l} onClick={() => setPage(l.toLowerCase())} className={`nl${activePage === l.toLowerCase() ? " act" : ""}`} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".08em", fontSize: ".78rem", fontWeight: 600, color: activePage === l.toLowerCase() ? "#4A9EFF" : "#8899bb", transition: "color .2s" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="bp" style={{ padding: "6px 16px", borderRadius: 8, fontSize: ".72rem", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".1em", cursor: "pointer", border: "1px solid rgba(74,158,255,.4)" }}>LOG IN</button>
          <div onClick={() => setPage("profile")} style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a6b,#0d2044)", border: "1px solid rgba(74,158,255,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#4A9EFF", cursor: "pointer", fontFamily: "'Rajdhani',sans-serif" }}>ME</div>
        </div>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setPage, openPlanet }) {
  const [cur, setCur] = useState(0);
  const [zoom, setZoom] = useState(false);
  const tot = PLANETS.length;
  const handleClick = (planet) => { setZoom(true); setTimeout(() => { openPlanet(planet); setZoom(false); }, 500); };
  const vis = [-1, 0, 1].map(o => ({ planet: PLANETS[(cur + o + tot) % tot], offset: o }));
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
      <div style={{ textAlign: "center", zIndex: 10, marginBottom: 32, animation: "fiu .55s ease forwards" }}>
        <div style={{ display: "inline-block", padding: "3px 14px", borderRadius: 20, background: "rgba(74,158,255,.08)", border: "1px solid rgba(74,158,255,.2)", color: "#4A9EFF", fontSize: ".62rem", letterSpacing: ".2em", fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>◎ LEARNING UNIVERSE</div>
        <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "clamp(2.2rem,5.5vw,4.2rem)", lineHeight: 1.1, background: "linear-gradient(135deg,#e8f0fe 0%,#4A9EFF 50%,#A8D8EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: ".05em" }}>EXPLORE THE<br />KNOWLEDGE GALAXY</h1>
        <p style={{ color: "#8899bb", fontSize: ".78rem", maxWidth: 390, margin: "10px auto 0", lineHeight: 1.75 }}>Navigate through subject planets. Master skills. Earn XP. Rise through the cosmos.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
          <button className="bp" style={{ padding: "10px 24px", borderRadius: 12, fontSize: ".85rem", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".12em", cursor: "pointer", border: "1px solid rgba(74,158,255,.4)" }} onClick={() => setPage("subjects")}>BEGIN JOURNEY</button>
          <button style={{ padding: "10px 24px", borderRadius: 12, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "#8899bb", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".12em", fontSize: ".85rem", cursor: "pointer" }} onClick={() => setPage("leaderboard")}>LEADERBOARD</button>
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", height: 430, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .5s ease,opacity .5s ease", transform: zoom ? "scale(1.12)" : "scale(1)", opacity: zoom ? 0 : 1 }}>
        <button onClick={() => setCur(p => (p - 1 + tot) % tot)} style={{ position: "absolute", left: "clamp(10px,4vw,55px)", zIndex: 20, width: 40, height: 40, borderRadius: 10, background: "rgba(74,158,255,.08)", border: "1px solid rgba(74,158,255,.25)", color: "#4A9EFF", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(74,158,255,.18)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(74,158,255,.08)"}>‹</button>
        {vis.map(({ planet, offset }) => {
          const isC = offset === 0;
          return (
            <div key={planet.id} style={{ position: "absolute", transform: `translateX(${offset * 290}px) scale(${isC ? 1 : .58})`, opacity: isC ? 1 : .35, zIndex: isC ? 10 : 5, transition: "all .55s cubic-bezier(.34,1.2,.64,1)" }}>
              <div className={isC ? "af" : offset === -1 ? "af2" : "af3"}>
                <div className="ph" onClick={() => isC && handleClick(planet)} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {isC && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-60%)", width: 290, height: 290, borderRadius: "50%", background: `radial-gradient(circle,${planet.glowColor} 0%,transparent 70%)`, animation: "pg 2.5s ease-in-out infinite", pointerEvents: "none" }} />}
                  <Planet3D planet={planet} size={isC ? 172 : 128} />
                  <div style={{ textAlign: "center", marginTop: 3, opacity: isC ? 1 : .65 }}>
                    <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, letterSpacing: ".15em", fontSize: ".72rem", color: planet.color, textShadow: `0 0 10px ${planet.color}` }}>{planet.shortName}</div>
                    <div style={{ fontSize: ".58rem", color: "#8899bb", marginTop: 2 }}>{planet.name}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={() => setCur(p => (p + 1) % tot)} style={{ position: "absolute", right: "clamp(10px,4vw,55px)", zIndex: 20, width: 40, height: 40, borderRadius: 10, background: "rgba(74,158,255,.08)", border: "1px solid rgba(74,158,255,.25)", color: "#4A9EFF", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(74,158,255,.18)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(74,158,255,.08)"}>›</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 6, zIndex: 10 }}>
        {PLANETS.map((_, i) => <button key={i} onClick={() => setCur(i)} style={{ width: i === cur ? 20 : 6, height: 6, borderRadius: 3, background: i === cur ? "#4A9EFF" : "rgba(74,158,255,.28)", transition: "all .3s", border: "none", cursor: "pointer" }} />)}
      </div>
      <div style={{ color: "rgba(136,153,187,.4)", fontSize: ".58rem", letterSpacing: ".12em", marginTop: 8, zIndex: 10 }}>CLICK PLANET TO EXPLORE · {tot} WORLDS</div>
      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", justifyContent: "center", padding: "0 16px", zIndex: 10 }}>
        {[{ l: "ACTIVE LEARNERS", v: "24,891" }, { l: "TOTAL XP AWARDED", v: "2.4M" }, { l: "SUBJECT PLANETS", v: "7" }].map(s => (
          <div key={s.l} className="gc" style={{ padding: "10px 20px", borderRadius: 12, textAlign: "center", minWidth: 118 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#4A9EFF" }}>{s.v}</div>
            <div style={{ fontSize: ".56rem", color: "#8899bb", letterSpacing: ".1em", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [island, setIsland] = useState(null);
  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#050b1a 0%,#07101f 50%,#05080f 100%)" }}>
        <StarField />
        <Navbar activePage={page} setPage={go} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {page === "home" && <HomePage setPage={go} openPlanet={setIsland} />}
          {page === "subjects" && <SubjectsPage openPlanet={setIsland} />}
          {page === "progress" && <ProgressPage />}
          {page === "leaderboard" && <LeaderboardPage />}
          {page === "profile" && <ProfilePage setPage={go} />}
        </div>
        <footer style={{ borderTop: "1px solid rgba(255,255,255,.04)", padding: 18, textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: ".62rem", letterSpacing: ".2em", color: "rgba(136,153,187,.25)" }}>EDU<span style={{ color: "rgba(74,158,255,.25)" }}>GALAXY</span> · KNOWLEDGE UNIVERSE · 7 WORLDS</span>
        </footer>
      </div>
      {island && <IslandWorld planet={island} onClose={() => setIsland(null)} />}
    </>
  );
}

const CSS_SUB = `
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
.planet-card:hover .enter-btn{opacity:1;transform:translateY(0)}
.planet-card:hover .badge-row{opacity:1}
.enter-btn{opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s}
.badge-row{opacity:0;transition:opacity .4s .1s}
.scan-line{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);pointer-events:none;z-index:6;top:-10%;transition:none}
.holo-border{background:linear-gradient(270deg,#4A9EFF,#A8D8EA,#4DFFC3,#FFB347,#FF6B9D,#4A9EFF);background-size:400% 400%;animation:holoBorder 4s ease infinite}
.shimmer-line{position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none}
.shimmer-line::after{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);animation:shimmer 3s infinite}
`;

function Planet3DSub({ planet, size = 160 }) {
  const r = size / 2, c = planet;
  return (
    <svg width={size + 70} height={size + 55} viewBox={`0 0 ${size + 70} ${size + 55}`}>
      <defs>
        <radialGradient id={`spg${c.id}`} cx="34%" cy="28%" r="70%">
          <stop offset="0%" stopColor={c.grad[2]} stopOpacity=".92" />
          <stop offset="38%" stopColor={c.grad[1]} stopOpacity=".87" />
          <stop offset="72%" stopColor={c.grad[0]} stopOpacity=".92" />
          <stop offset="100%" stopColor={c.grad[3]} stopOpacity=".96" />
        </radialGradient>
        <radialGradient id={`ssp${c.id}`} cx="29%" cy="24%" r="38%">
          <stop offset="0%" stopColor="white" stopOpacity=".2" /><stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`scl${c.id}`}><circle cx={r + 35} cy={r + 8} r={r} /></clipPath>
      </defs>
      <ellipse cx={r + 35} cy={r + 8 + r * .12} rx={r * 1.55} ry={r * .22} fill="none" stroke={c.ring1} strokeWidth="2.5"
        style={{ animation: 'ringSpin 20s linear infinite', transformOrigin: `${r + 35}px ${r + 8 + r * .12}px` }} />
      <ellipse cx={r + 35} cy={r + 8 + r * .12} rx={r * 1.72} ry={r * .29} fill="none" stroke={c.ring2} strokeWidth="7" strokeDasharray="4 9"
        style={{ animation: 'ringSpinR 30s linear infinite', transformOrigin: `${r + 35}px ${r + 8 + r * .12}px` }} />
      <circle cx={r + 35} cy={r + 8} r={r} fill={`url(#spg${c.id})`} />
      <g clipPath={`url(#scl${c.id})`}>
        <ellipse cx={r + 35} cy={r - 6} rx={r * .94} ry={r * .11} fill={`${c.grad[2]}28`} />
        <ellipse cx={r + 25} cy={r + 18} rx={r * .8} ry={r * .09} fill={`${c.grad[2]}20`} />
        <ellipse cx={r + 45} cy={r + 44} rx={r * .68} ry={r * .07} fill={`${c.grad[2]}18`} />
      </g>
      <circle cx={r + 35} cy={r + 8} r={r} fill={`url(#ssp${c.id})`} />
    </svg>
  );
}

function PlanetCard({ planet, index, onOpen }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 });
  const [hov, setHov] = useState(false);
  const done = planet.checkpoints.filter(c => c.number < planet.activeLevel).length;
  const total = planet.checkpoints.length;
  const pct = Math.round((done / total) * 100);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width;
    const dy = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (dy - .5) * -18, y: (dx - .5) * 18, gx: dx * 100, gy: dy * 100 });
  };

  return (
    <div className="planet-card" ref={cardRef} style={{
      animationDelay: `${index * .08}s`, position: "relative", borderRadius: 22, cursor: "pointer", transformStyle: "preserve-3d",
      transform: `perspective(900px) rotateX(${hov ? tilt.x : 0}deg) rotateY(${hov ? tilt.y : 0}deg) translateZ(${hov ? 12 : 0}px)`,
      transition: hov ? "transform .1s ease" : "transform .4s cubic-bezier(.34,1.2,.64,1)",
      boxShadow: hov ? `0 35px 70px -10px ${planet.color}55,0 15px 35px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.15)` : "0 8px 30px rgba(0,0,0,.5)",
    }}
      onMouseMove={handleMouseMove} onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0, gx: 50, gy: 50 }); }}
      onClick={() => onOpen(planet)}
    >
      {/* Holographic border */}
      <div style={{ position: "absolute", inset: -1, borderRadius: 23, padding: 1, background: hov ? `radial-gradient(farthest-corner at ${tilt.gx}% ${tilt.gy}%, ${planet.color}88, ${planet.color}22 40%, transparent 70%)` : `${planet.color}22`, zIndex: 0 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 22, background: "#07101f" }} />
      </div>
      {/* Inner card */}
      <div style={{
        position: "relative", zIndex: 1, borderRadius: 22, padding: "24px 20px 20px", overflow: "hidden",
        background: `linear-gradient(145deg, rgba(255,255,255,.06) 0%, rgba(${planet.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')},0.04) 50%, rgba(0,0,0,.2) 100%)`,
        backdropFilter: "blur(14px)",
      }}>
        <div className="scan-line" />
        <div className="shimmer-line" />
        {/* Hex grid bg */}
        <div style={{ position: "absolute", inset: 0, opacity: hov ? .07 : .03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='46'%3E%3Cpath d='M20 2l18 10v22L20 44 2 34V12L20 2z' fill='none' stroke='white' stroke-width='.5'/%3E%3C/svg%3E\")", transition: "opacity .3s" }} />
        {/* Glow orb bg */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle,${planet.glowColor} 0%,transparent 65%)`, opacity: hov ? .8 : .35, transition: "opacity .3s", pointerEvents: "none", animation: `orbFloat ${5 + index * .5}s ease-in-out ${index * .3}s infinite` }} />
        {/* Status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: ".52rem", letterSpacing: ".18em", color: planet.color, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: `${planet.color}18`, border: `1px solid ${planet.color}35` }}>
            {planet.activeLevel > 1 ? "▶ ACTIVE" : "◉ START"}
          </div>
          <div style={{ fontSize: ".52rem", color: "#8899bb", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".1em" }}>{planet.checkpoints.length} LEVELS</div>
        </div>
        {/* Planet orb */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, position: "relative", zIndex: 2 }}>
          {hov && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 100, height: 100, borderRadius: "50%", border: `1px solid ${planet.color}50`, animation: "ringExpand 1.5s ease-out infinite" }} />}
          <div style={{ animation: `orbFloat ${5 + index * .4}s ease-in-out ${index * .2}s infinite` }}>
            <Planet3DSub planet={planet} size={88} />
          </div>
        </div>
        {/* Name */}
        <div style={{ textAlign: "center", marginBottom: 16, position: "relative", zIndex: 2 }}>
          <h3 style={{
            fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: ".06em", color: "#e8f0fe", marginBottom: 3,
            ...(hov ? { textShadow: `0 0 20px ${planet.color}88` } : {})
          }}>{planet.name}</h3>
          <div style={{ fontSize: ".58rem", color: "#8899bb", letterSpacing: ".1em" }}>{planet.shortName}</div>
        </div>
        {/* Stat chips */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 14, position: "relative", zIndex: 2 }}>
          {[{ l: "DONE", v: `${done}/${total}` }, { l: "XP", v: planet.xp.toLocaleString() }, { l: "LVL", v: `Lv.${planet.activeLevel}` }].map((s, i) => (
            <div key={s.l} style={{ textAlign: "center", padding: "7px 4px", borderRadius: 10, background: `${planet.color}0a`, border: `1px solid ${planet.color}20`, transition: "all .2s", boxShadow: hov ? `0 0 12px ${planet.color}22` : "none" }}>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".9rem", color: planet.color }}>{s.v}</div>
              <div style={{ fontSize: ".48rem", color: "#8899bb", letterSpacing: ".1em", marginTop: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* XP Progress */}
        <div style={{ marginBottom: 16, position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".56rem", color: "#8899bb", marginBottom: 5, fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".06em" }}>
            <span>MASTERY</span><span style={{ color: planet.color, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,.06)", overflow: "hidden", position: "relative" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${planet.color}66,${planet.color},${planet.color}cc)`, boxShadow: `0 0 12px ${planet.color}88`, transition: "box-shadow .3s", position: "relative", overflow: "hidden", animation: hov ? "none" : "xpBar 1.5s ease backwards" }}>
              {hov && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)", animation: "shimmer 1.5s infinite" }} />}
            </div>
            {/* Tick marks */}
            {[25, 50, 75].map(t => (
              <div key={t} style={{ position: "absolute", top: 0, left: `${t}%`, width: 1, height: "100%", background: "rgba(0,0,0,.3)" }} />
            ))}
          </div>
        </div>
        {/* Hover badges */}
        <div className="badge-row" style={{ display: "flex", gap: 4, marginBottom: 12, position: "relative", zIndex: 2 }}>
          {planet.lessons.slice(0, 4).map((l, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: l.status === "complete" ? planet.color : l.status === "active" ? `${planet.color}66` : "rgba(255,255,255,.1)" }} />
          ))}
        </div>
        {/* Enter button */}
        <button className="enter-btn" style={{
          width: "100%", padding: "10px 0", borderRadius: 12, background: `linear-gradient(135deg,${planet.color}30,${planet.color}15)`, border: `1px solid ${planet.color}55`, color: planet.color, fontSize: ".65rem", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".18em", fontWeight: 700, cursor: "pointer", position: "relative", zIndex: 2,
          boxShadow: `0 4px 20px ${planet.color}33`,
        }}>
          ENTER WORLD ›
        </button>
      </div>
    </div>
  );
}

function SubjectsPage({ openPlanet }) {
  return (
    <div style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 60, padding: "90px 28px 60px", maxWidth: 1300, margin: "0 auto" }}>
      <style>{CSS_SUB}</style>
      {/* Header */}
      <div style={{ marginBottom: 44, animation: "fiu .6s ease forwards" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 20, background: "rgba(74,158,255,.08)", border: "1px solid rgba(74,158,255,.22)", marginBottom: 14 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4A9EFF", display: "inline-block", boxShadow: "0 0 8px #4A9EFF", animation: "orbFloat 2s ease-in-out infinite" }} />
          <span style={{ fontSize: ".6rem", letterSpacing: ".2em", color: "#4A9EFF", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>7 WORLDS · CHOOSE YOUR PLANET</span>
        </div>
        <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3.4rem)", letterSpacing: ".04em", background: "linear-gradient(135deg,#e8f0fe 0%,#4A9EFF 60%,#A8D8EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>SUBJECT PLANETS</h1>
        <p style={{ color: "#8899bb", fontSize: ".8rem", maxWidth: 480 }}>Each planet is a subject domain. Hover to reveal details. Click to enter the island world and start your quest.</p>
      </div>
      {/* 3D card grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(272px,1fr))", gap: 24, perspective: 1200 }}>
        {PLANETS.map((planet, i) => (
          <PlanetCard key={planet.id} planet={planet} index={i} onOpen={openPlanet} />
        ))}
      </div>
    </div>
  );
}




const CSS_PROG = `
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

function useCountUp(target, duration = 1200, start = true) {
  const [val, setVal] = useState(0);
  const frame = useRef();
  useEffect(() => {
    if (!start) return;
    const s = performance.now();
    const tick = (now) => {
      const p = Math.min((now - s) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(target * ease));
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration, start]);
  return val;
}

function Planet3DProg({ planet, size = 60 }) {
  const r = size / 2, c = planet;
  return (
    <svg width={size + 30} height={size + 25} viewBox={`0 0 ${size + 30} ${size + 25}`}>
      <defs>
        <radialGradient id={`ppg${c.id}`} cx="34%" cy="28%" r="70%">
          <stop offset="0%" stopColor={c.grad[2]} stopOpacity=".92" />
          <stop offset="60%" stopColor={c.grad[1]} stopOpacity=".87" />
          <stop offset="100%" stopColor={c.grad[0]} stopOpacity=".95" />
        </radialGradient>
        <radialGradient id={`psp${c.id}`} cx="29%" cy="24%" r="38%">
          <stop offset="0%" stopColor="white" stopOpacity=".22" /><stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`pcl${c.id}`}><circle cx={r + 15} cy={r + 5} r={r} /></clipPath>
      </defs>
      <ellipse cx={r + 15} cy={r + 5 + r * .15} rx={r * 1.5} ry={r * .2} fill="none" stroke={c.ring1} strokeWidth="1.5"
        style={{ animation: 'ringSpin 18s linear infinite', transformOrigin: `${r + 15}px ${r + 5 + r * .15}px` }} />
      <circle cx={r + 15} cy={r + 5} r={r} fill={`url(#ppg${c.id})`} />
      <g clipPath={`url(#pcl${c.id})`}>
        <ellipse cx={r + 15} cy={r} rx={r * .9} ry={r * .1} fill={`${c.grad[2]}25`} />
        <ellipse cx={r + 10} cy={r + 12} rx={r * .7} ry={r * .08} fill={`${c.grad[2]}18`} />
      </g>
      <circle cx={r + 15} cy={r + 5} r={r} fill={`url(#psp${c.id})`} />
    </svg>
  );
}

function RadarChart({ planets }) {
  const cx = 120, cy = 120, r = 80;
  const n = planets.length;
  const angles = planets.map((_, i) => ((i / n) * 2 * Math.PI) - Math.PI / 2);
  const getPoint = (angle, dist) => ({ x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) });
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = planets.map((p, i) => {
    const pct = p.checkpoints.filter(c => c.number < p.activeLevel).length / p.checkpoints.length;
    return getPoint(angles[i], pct * r);
  });
  const polyPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
  return (
    <svg width={240} height={240} viewBox="0 0 240 240">
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4A9EFF" stopOpacity=".3" />
          <stop offset="100%" stopColor="#4A9EFF" stopOpacity=".05" />
        </radialGradient>
        <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A9EFF" stopOpacity=".8" />
          <stop offset="100%" stopColor="#A8D8EA" stopOpacity=".8" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {gridLevels.map((lv, li) => (
        <polygon key={li} points={angles.map(a => { const p = getPoint(a, r * lv); return `${p.x},${p.y}`; }).join(" ")}
          fill="none" stroke={`rgba(255,255,255,${.04 + li * .02})`} strokeWidth="1" />
      ))}
      {/* Spokes */}
      {angles.map((a, i) => {
        const p = getPoint(a, r);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,.06)" strokeWidth="1" />;
      })}
      {/* Radar sweep */}
      <g style={{ animation: "radarSpin 6s linear infinite", transformOrigin: `${cx}px ${cy}px` }}>
        <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke="rgba(74,158,255,.5)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(74,158,255,.04)" strokeWidth={r * 2} strokeDasharray={`${r * Math.PI / 2} ${r * Math.PI * 2}`} strokeDashoffset="0" />
      </g>
      {/* Data shape */}
      <path d={polyPath} fill="url(#radarFill)" stroke="url(#radarStroke)" strokeWidth="2" strokeLinejoin="round" />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={planets[i].color} style={{ animation: `radarPing 2s ease-out ${i * .3}s infinite` }} />
          <circle cx={p.x} cy={p.y} r={3} fill={planets[i].color} />
        </g>
      ))}
      {/* Labels */}
      {angles.map((a, i) => {
        const p = getPoint(a, r + 18);
        return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill={planets[i].color} fontFamily="'Rajdhani',sans-serif" fontWeight="700">{planets[i].shortName}</text>;
      })}
      {/* Ping at center */}
      <circle cx={cx} cy={cy} r={3} fill="rgba(74,158,255,.8)" />
    </svg>
  );
}

function PlanetProgressRow({ planet, index, active }) {
  const done = planet.checkpoints.filter(c => c.number < planet.activeLevel).length;
  const total = planet.checkpoints.length;
  const pct = Math.round((done / total) * 100);
  const [hov, setHov] = useState(false);

  return (
    <div className="prog-card" style={{
      animationDelay: `${.1 + index * .07}s`, position: "relative", borderRadius: 16, padding: "16px 18px", marginBottom: 10,
      background: hov ? `linear-gradient(135deg,rgba(255,255,255,.07),${planet.color}08)` : "rgba(255,255,255,.04)",
      border: `1px solid ${hov ? planet.color + "44" : "rgba(255,255,255,.07)"}`,
      backdropFilter: "blur(10px)", cursor: "pointer", transition: "all .25s cubic-bezier(.34,1.2,.64,1)",
      transform: hov ? "translateX(6px) scale(1.01)" : "none",
      boxShadow: hov ? `0 10px 30px ${planet.color}22,inset 0 1px 0 rgba(255,255,255,.1)` : "none",
    }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {/* Accent line */}
      <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3, borderRadius: "0 2px 2px 0", background: planet.color, opacity: hov ? 1 : .4, transition: "opacity .2s", boxShadow: hov ? `0 0 10px ${planet.color}` : "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Mini planet */}
        <div style={{ flexShrink: 0, filter: `drop-shadow(0 0 8px ${planet.color}66)`, transform: hov ? "scale(1.1)" : "scale(1)", transition: "transform .2s", animation: `orbFloat ${5 + index * .3}s ease-in-out ${index * .2}s infinite` }}>
          <Planet3DProg planet={planet} size={36} />
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div>
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".88rem", color: "#e8f0fe", letterSpacing: ".04em" }}>{planet.name}</span>
              <span style={{ marginLeft: 8, fontSize: ".52rem", color: planet.color, fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".1em", padding: "2px 6px", borderRadius: 10, background: `${planet.color}18`, border: `1px solid ${planet.color}30` }}>{planet.currentLevel}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.1rem", color: planet.color }}>{pct}<span style={{ fontSize: ".5em", opacity: .7 }}>%</span></div>
              <div style={{ fontSize: ".5rem", color: "#8899bb" }}>{done}/{total} LVL</div>
            </div>
          </div>
          {/* Progress track */}
          <div style={{ height: 7, borderRadius: 4, background: "rgba(255,255,255,.06)", overflow: "hidden", position: "relative" }}>
            {/* Segmented background */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(90deg,transparent,transparent ${100 / total - 1}%,rgba(0,0,0,.25) ${100 / total - 1}%,rgba(0,0,0,.25) ${100 / total}%)` }} />
            <div className="prog-bar" style={{ "--pw": `${pct}%`, width: `${active ? pct : 0}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg,${planet.color}77,${planet.color},${planet.color}ee)`, boxShadow: `0 0 14px ${planet.color}88`, position: "relative", overflow: "hidden", animationDelay: `${.3 + index * .1}s` }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)", animation: "shimmer 2s infinite" }} />
            </div>
            {/* Milestone dots */}
            {[25, 50, 75].map(m => (
              <div key={m} style={{ position: "absolute", top: "50%", left: `${m}%`, transform: "translate(-50%,-50%)", width: 5, height: 5, borderRadius: "50%", background: pct >= m ? planet.color : "rgba(255,255,255,.2)", boxShadow: pct >= m ? `0 0 8px ${planet.color}` : "" }} />
            ))}
          </div>
          {/* Checkpoint pills */}
          {hov && <div style={{ display: "flex", gap: 3, marginTop: 6, flexWrap: "wrap" }}>
            {planet.checkpoints.map(cp => (
              <div key={cp.number} style={{
                fontSize: ".45rem", padding: "1px 5px", borderRadius: 8, fontFamily: "'Rajdhani',sans-serif",
                background: cp.number < planet.activeLevel ? `${planet.color}22` : cp.number === planet.activeLevel ? `${planet.color}12` : "rgba(255,255,255,.04)",
                color: cp.number < planet.activeLevel ? planet.color : cp.number === planet.activeLevel ? "#e8f0fe" : "#8899bb",
                border: `1px solid ${cp.number < planet.activeLevel ? planet.color + "30" : "rgba(255,255,255,.06)"}`,
              }}>{cp.label}</div>
            ))}
          </div>}
        </div>
        {/* XP badge */}
        <div style={{ flexShrink: 0, textAlign: "center", padding: "8px 10px", borderRadius: 10, background: `${planet.color}0d`, border: `1px solid ${planet.color}20` }}>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".8rem", color: planet.color }}>{planet.xp}</div>
          <div style={{ fontSize: ".45rem", color: "#8899bb", letterSpacing: ".08em" }}>XP</div>
        </div>
      </div>
    </div>
  );
}

function OrbitalMap() {
  const [rot, setRot] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRot(r => (r + .3) % 360), 50);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: "relative", width: 260, height: 260, flexShrink: 0 }}>
      {/* Rings */}
      {[100, 80, 60].map((rr, i) => (
        <div key={i} style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%,-50%)`, width: rr * 2, height: rr * 2, borderRadius: "50%", border: `1px solid rgba(74,158,255,${.06 + i * .03})` }} />
      ))}
      {/* Orbiting planets */}
      {PLANETS.slice(0, 5).map((p, i) => {
        const orb = 55 + i * 18;
        const angle = (rot * (1 + i * .2) + i * (360 / 5)) * Math.PI / 180;
        const x = 130 + orb * Math.cos(angle);
        const y = 130 + orb * Math.sin(angle);
        const done = p.checkpoints.filter(c => c.number < p.activeLevel).length / p.checkpoints.length;
        return (
          <div key={p.id} style={{ position: "absolute", transform: "translate(-50%,-50%)", left: x, top: y, zIndex: 5 }}>
            <div style={{ width: 12 + done * 8, height: 12 + done * 8, borderRadius: "50%", background: p.color, boxShadow: `0 0 ${8 + done * 10}px ${p.color}`, opacity: .85 + done * .15 }} />
          </div>
        );
      })}
      {/* Center */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#1a4a9a,#4A9EFF)", boxShadow: "0 0 20px rgba(74,158,255,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 10, color: "white" }}>◉</span>
      </div>
      {/* Radar ping */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(74,158,255,.5)", animation: "radarPing 2.5s ease-out infinite" }} />
    </div>
  );
}

function ProgressPage() {
  const txp = 6840, nxp = 8000;
  const pct = Math.round((txp / nxp) * 100);
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t); }, []);
  const xpCount = useCountUp(txp, 1400, visible);

  const topStat = (label, value, color, delay) => (
    <div className="stat-hex" style={{
      animationDelay: `${delay}s`, position: "relative", borderRadius: 18, padding: "20px 16px", textAlign: "center",
      background: `linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.02))`,
      border: `1px solid ${color}35`, backdropFilter: "blur(12px)",
      boxShadow: `0 8px 32px ${color}18`, overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 0%,${color}15,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: ".58rem", color: "#8899bb", letterSpacing: ".12em" }}>{label}</div>
    </div>
  );

  return (
    <div ref={ref} style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 60, padding: "90px 28px 60px", maxWidth: 1280, margin: "0 auto" }}>
      <style>{CSS_PROG}</style>
      {/* Header */}
      <div style={{ marginBottom: 40, animation: "fiu .6s ease forwards" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 20, background: "rgba(74,158,255,.08)", border: "1px solid rgba(74,158,255,.22)", marginBottom: 14 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4A9EFF", boxShadow: "0 0 8px #4A9EFF", display: "inline-block", animation: "orbFloat 2s ease-in-out infinite" }} />
          <span style={{ fontSize: ".6rem", letterSpacing: ".2em", color: "#4A9EFF", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>COMMAND DASHBOARD</span>
        </div>
        <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3.4rem)", letterSpacing: ".04em", background: "linear-gradient(135deg,#e8f0fe 0%,#4A9EFF 60%,#A8D8EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GALAXY PROGRESS</h1>
      </div>
      {/* XP Banner */}
      <div style={{
        borderRadius: 22, padding: "28px 32px", marginBottom: 28, position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg,rgba(74,158,255,.12),rgba(74,158,255,.04))",
        border: "1px solid rgba(74,158,255,.25)", backdropFilter: "blur(16px)",
        animation: "progressIn .7s ease forwards",
      }}>
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "40%", background: "radial-gradient(ellipse at right center,rgba(74,158,255,.15),transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.01) 20px,rgba(255,255,255,.01) 21px)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap", position: "relative" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: ".6rem", letterSpacing: ".2em", color: "rgba(74,158,255,.7)", fontFamily: "'Rajdhani',sans-serif", marginBottom: 6 }}>TOTAL EXPERIENCE POINTS</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "clamp(2.5rem,5vw,3.8rem)", lineHeight: 1, color: "#4A9EFF", letterSpacing: ".02em", textShadow: "0 0 40px rgba(74,158,255,.4)" }}>
              {xpCount.toLocaleString()}<span style={{ fontSize: "40%", color: "rgba(74,158,255,.5)", marginLeft: 8 }}>XP</span>
            </div>
          </div>
          <div style={{ flex: 2, minWidth: 250 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".6rem", color: "#8899bb", marginBottom: 8, fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".08em" }}>
              <span>LEVEL 12</span><span style={{ color: "#4A9EFF" }}>{pct}% TO LEVEL 13</span><span>{nxp.toLocaleString()} XP</span>
            </div>
            <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,.06)", overflow: "hidden", position: "relative", boxShadow: "inset 0 2px 4px rgba(0,0,0,.3)" }}>
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 6, background: "linear-gradient(90deg,#0d47a1,#1565c0,#4A9EFF,#64B5F6)", boxShadow: "0 0 20px rgba(74,158,255,.6)", position: "relative", overflow: "hidden", transition: "width 1.5s cubic-bezier(.4,0,.2,1)" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)", animation: "shimmer 2s 1s infinite" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".54rem", color: "rgba(255,255,255,.3)", marginTop: 4 }}>
              {[0, 25, 50, 75, 100].map(m => <span key={m}>{m}%</span>)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.8rem", color: "#8899bb", lineHeight: 1 }}>RANK</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "3rem", color: "#4A9EFF", lineHeight: 1 }}>#7</div>
            <div style={{ fontSize: ".55rem", color: "#8899bb" }}>of 8 pilots</div>
          </div>
        </div>
      </div>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {topStat("LESSONS DONE", "24", "#4ade80", .1)}
        {topStat("STREAK", "15 🔥", "#FFB347", .18)}
        {topStat("PLANETS ACTIVE", "3/7", "#A8D8EA", .26)}
        {topStat("QUIZZES PASSED", "18", "#C8A2FF", .34)}
      </div>
      {/* Main 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 22, alignItems: "start" }}>
        {/* Planet progress list */}
        <div>
          <div style={{ fontSize: ".6rem", letterSpacing: ".2em", color: "#8899bb", fontFamily: "'Rajdhani',sans-serif", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
            PLANET MASTERY
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
          </div>
          {PLANETS.map((p, i) => <PlanetProgressRow key={p.id} planet={p} index={i} active={visible} />)}
        </div>
        {/* Right: Radar + Orbital */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Radar */}
          <div style={{ borderRadius: 20, padding: "20px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", backdropFilter: "blur(12px)", textAlign: "center", animation: "cardFlip .7s ease .4s both" }}>
            <div style={{ fontSize: ".58rem", letterSpacing: ".18em", color: "#8899bb", fontFamily: "'Rajdhani',sans-serif", marginBottom: 10 }}>MASTERY RADAR</div>
            <div style={{ display: "flex", justifyContent: "center" }}><RadarChart planets={PLANETS} /></div>
          </div>
          {/* Orbital */}
          <div style={{ borderRadius: 20, padding: "20px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", backdropFilter: "blur(12px)", textAlign: "center", animation: "cardFlip .7s ease .55s both" }}>
            <div style={{ fontSize: ".58rem", letterSpacing: ".18em", color: "#8899bb", fontFamily: "'Rajdhani',sans-serif", marginBottom: 10 }}>ORBITAL VIEW</div>
            <div style={{ display: "flex", justifyContent: "center" }}><OrbitalMap /></div>
            <div style={{ fontSize: ".52rem", color: "#8899bb", marginTop: 8, lineHeight: 1.6 }}>Planet size = XP earned<br />Brightness = completion</div>
          </div>
        </div>
      </div>
    </div>
  );
}


const CSS_LB = `
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

const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];
const RANK_GLOW = ["rgba(255,215,0,.5)", "rgba(192,192,192,.4)", "rgba(205,127,50,.4)"];
const TROPHIES = ["🥇", "🥈", "🥉"];
const PODIUM_HEIGHTS = [180, 220, 155];
const PODIUM_ORDER = [1, 0, 2]; // silver, gold, bronze left to right

function Fireworks({ color }) {
  const parts = Array.from({ length: 8 }, (_, i) => ({ angle: (i / 8) * 360, r: 30 + Math.random() * 20 }));
  return (
    <div style={{ position: "absolute", top: "20%", left: "50%", pointerEvents: "none", zIndex: 0 }}>
      {parts.map((p, i) => (
        <div key={i} style={{
          position: "absolute", width: 4, height: 4, borderRadius: "50%", background: color,
          "--fx": `${Math.cos(p.angle * Math.PI / 180) * p.r}px`,
          "--fy": `${Math.sin(p.angle * Math.PI / 180) * p.r}px`,
          animation: `firework 1.5s ease-out ${i * .1}s infinite`, transform: "translate(-50%,-50%)",
        }} />
      ))}
    </div>
  );
}

function PodiumPillar({ user, rank, height, delay }) {
  const color = RANK_COLORS[rank];
  const glow = RANK_GLOW[rank];
  const maxXp = LEADERBOARD[0].xp;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, zIndex: rank === 0 ? 10 : 5 }}>
      {/* User info above pillar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 12, animation: `fiu .6s ease ${delay + .2}s both` }}>
        {rank === 0 && <div style={{ fontSize: "1.5rem", marginBottom: 4, animation: "crownSpin 3s ease-in-out infinite" }}>👑</div>}
        <div style={{ position: "relative" }}>
          <div style={{
            width: rank === 0 ? 64 : 52, height: rank === 0 ? 64 : 52, borderRadius: "50%",
            background: `linear-gradient(135deg,${color}30,${color}10)`,
            border: `2px solid ${color}`, boxShadow: `0 0 20px ${glow},inset 0 1px 0 rgba(255,255,255,.2)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: rank === 0 ? ".9rem" : ".75rem",
            color: color,
            "--ac": glow, animation: "avatarPulse 2.5s ease-in-out infinite",
          }}>{user.avatar}</div>
          {rank === 0 && <Fireworks color={color} />}
        </div>
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: rank === 0 ? ".85rem" : ".72rem", color: rank === 0 ? "#e8f0fe" : "#8899bb", marginTop: 6, letterSpacing: ".04em" }}>{user.name}</div>
        <div style={{ fontSize: ".6rem", color: color, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>{user.xp.toLocaleString()} XP</div>
        <div style={{ fontSize: ".5rem", color: "#8899bb", marginTop: 2 }}>{user.streak}🔥 streak</div>
      </div>
      {/* Pillar */}
      <div className="podium-bar" style={{
        animationDelay: `${delay}s`,
        width: rank === 0 ? 90 : 70, height: height, borderRadius: "8px 8px 0 0",
        position: "relative", overflow: "hidden",
        background: `linear-gradient(180deg,${color}22 0%,${color}08 60%,rgba(0,0,0,.3) 100%)`,
        border: `1px solid ${color}40`, borderBottom: "none",
        boxShadow: `0 -10px 40px ${glow},inset 0 1px 0 rgba(255,255,255,.15)`,
      }}>
        {/* Animated gradient */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(270deg,${color}15,transparent,${color}15)`, backgroundSize: "200% 100%", animation: "holoPodium 3s ease infinite" }} />
        {/* Rank number */}
        <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.6rem", color: `${color}88`, animation: "rankGlow 2s ease-in-out infinite" }}>{TROPHIES[rank]}</div>
        {/* XP fill bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${(user.xp / maxXp) * 100}%`, background: `linear-gradient(180deg,transparent,${color}15)`, transition: "height 1.5s ease" }} />
        {/* Shimmer */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(255,255,255,.06) 0%,transparent 50%,rgba(0,0,0,.2) 100%)" }} />
      </div>
    </div>
  );
}

function LeaderboardPage() {
  const [hov, setHov] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);
  const maxXp = LEADERBOARD[0].xp;

  const podiumOrder = PODIUM_ORDER.map(i => ({ user: LEADERBOARD[i], rank: i }));

  return (
    <div style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 60, padding: "90px 28px 60px", maxWidth: 1100, margin: "0 auto" }}>
      <style>{CSS_LB}</style>
      {/* Header */}
      <div style={{ marginBottom: 44, animation: "fiu .6s ease forwards" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 20, background: "rgba(255,179,71,.08)", border: "1px solid rgba(255,179,71,.22)", marginBottom: 14 }}>
          <span style={{ fontSize: ".6rem", letterSpacing: ".2em", color: "#FFB347", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>⚡ GALACTIC RANKINGS</span>
        </div>
        <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3.4rem)", letterSpacing: ".04em", background: "linear-gradient(135deg,#e8f0fe 0%,#FFB347 60%,#FFD54F 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LEADERBOARD</h1>
      </div>

      {/* 3D Podium */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 6, marginBottom: 48, padding: "0 0 0", overflow: "hidden" }}>
        {podiumOrder.map(({ user, rank }, i) => (
          <PodiumPillar key={rank} user={user} rank={rank} height={PODIUM_HEIGHTS[i]} delay={i * .1} />
        ))}
      </div>

      {/* Table */}
      <div style={{ borderRadius: 22, overflow: "hidden", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", backdropFilter: "blur(14px)" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 90px 90px", padding: "12px 22px", background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          {["RANK", "PILOT", "XP", "PLANETS", "STREAK"].map(h => (
            <span key={h} style={{ fontSize: ".54rem", letterSpacing: ".15em", color: "#8899bb", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, textAlign: h === "RANK" || h === "PILOT" ? "left" : "right" }}>{h}</span>
          ))}
        </div>
        {/* Rows */}
        {LEADERBOARD.map((u, i) => {
          const rankColor = i < 3 ? RANK_COLORS[i] : null;
          const isHov = hov === i;
          return (
            <div key={u.rank} className="lb-row" style={{
              animationDelay: `${.1 + i * .06}s`,
              display: "grid", gridTemplateColumns: "60px 1fr 1fr 90px 90px", padding: "14px 22px", alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,.04)",
              background: u.isUser ? "rgba(74,158,255,.06)" : isHov ? "rgba(255,255,255,.03)" : "transparent",
              transition: "background .2s", cursor: "default", position: "relative",
            }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            >
              {/* User highlight edge */}
              {u.isUser && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(180deg,#4A9EFF,#A8D8EA)", borderRadius: "0 2px 2px 0" }} />}
              {/* Rank */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i < 3
                  ? <span style={{ fontSize: "1.2rem" }}>{TROPHIES[i]}</span>
                  : <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1rem", color: "rgba(255,255,255,.3)" }}>#{u.rank}</span>
                }
              </div>
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: rankColor ? `linear-gradient(135deg,${rankColor}30,${rankColor}10)` : u.isUser ? "rgba(74,158,255,.2)" : "rgba(255,255,255,.06)",
                  border: `2px solid ${rankColor || (u.isUser ? "rgba(74,158,255,.5)" : "rgba(255,255,255,.1)")}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".7rem",
                  color: rankColor || (u.isUser ? "#4A9EFF" : "#8899bb"),
                  boxShadow: rankColor ? `0 0 12px ${RANK_GLOW[i]}` : "none",
                  animation: i === 0 ? "avatarPulse 2s infinite" : "none", "--ac": RANK_GLOW[0],
                }}>{u.avatar}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: ".85rem", color: u.isUser ? "#4A9EFF" : "#e8f0fe" }}>{u.name}</span>
                    {u.isUser && <span style={{ fontSize: ".46rem", padding: "1px 6px", borderRadius: 10, background: "rgba(74,158,255,.18)", color: "#4A9EFF", border: "1px solid rgba(74,158,255,.3)", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".1em" }}>YOU</span>}
                    {i === 0 && <span style={{ fontSize: ".46rem", padding: "1px 6px", borderRadius: 10, background: "rgba(255,215,0,.15)", color: "#FFD700", border: "1px solid rgba(255,215,0,.3)", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".1em" }}>CHAMPION</span>}
                  </div>
                  <div style={{ fontSize: ".5rem", color: "#8899bb", marginTop: 1 }}>{"◎".repeat(Math.min(u.planets, 5))} · Level {7 + i}</div>
                </div>
              </div>
              {/* XP with mini bar */}
              <div style={{ textAlign: "right", paddingRight: 16 }}>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".88rem", color: rankColor || (u.isUser ? "#4A9EFF" : "#e8f0fe") }}>{u.xp.toLocaleString()}</div>
                <div style={{ marginTop: 4, height: 3, borderRadius: 2, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
                  <div className="lb-xp" style={{ "--w": `${(u.xp / maxXp) * 100}%`, width: `${(u.xp / maxXp) * 100}%`, height: "100%", borderRadius: 2, background: rankColor || (u.isUser ? "#4A9EFF" : "rgba(255,255,255,.25)"), animationDelay: `${.4 + i * .06}s` }} />
                </div>
              </div>
              {/* Planets */}
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                  {Array.from({ length: u.planets }).map((_, pi) => (
                    <div key={pi} style={{ width: 8, height: 8, borderRadius: "50%", background: rankColor || "rgba(74,158,255,.5)", boxShadow: rankColor ? `0 0 4px ${rankColor}` : "none" }} />
                  ))}
                </div>
              </div>
              {/* Streak */}
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".82rem", color: u.streak > 30 ? "#FF6B35" : u.streak > 20 ? "#FFB347" : "#8899bb" }}>{u.streak}</span>
                <span style={{ fontSize: ".9rem", animation: u.streak > 20 ? "streakFire .8s ease-in-out infinite" : "none", display: "inline-block", marginLeft: 2 }}>🔥</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CSS_PROF = `
@keyframes avatarRotate{0%,100%{transform:perspective(500px) rotateY(0deg) rotateX(0deg)}25%{transform:perspective(500px) rotateY(8deg) rotateX(-4deg)}75%{transform:perspective(500px) rotateY(-8deg) rotateX(4deg)}}
@keyframes ringRotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes ringRotateR{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
@keyframes statCount{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes badgePop{from{opacity:0;transform:scale(.4) rotate(-15deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}
@keyframes badgeShine{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes profileIn{from{opacity:0;transform:translateY(30px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes activityBar{from{height:0}to{height:var(--h)}}
@keyframes lockedShake{0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}
@keyframes glassReveal{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes orbitDot{0%{transform:rotate(0deg) translateX(28px) rotate(0deg)}100%{transform:rotate(360deg) translateX(28px) rotate(-360deg)}}
.badge-item{animation:badgePop .5s cubic-bezier(.34,1.56,.64,1) both}
.stat-panel{animation:profileIn .6s cubic-bezier(.22,1,.36,1) both}
.prog-reveal{animation:glassReveal .5s ease both}
`;

const RARITY_COLORS = { common: "#4A9EFF", rare: "#A8D8EA", epic: "#C8A2FF", legendary: "#FFD54F" };
const RARITY_GLOW = { common: "rgba(74,158,255,.4)", rare: "rgba(168,216,234,.4)", epic: "rgba(200,162,255,.5)", legendary: "rgba(255,213,79,.6)" };

function AvatarOrb({ name }) {
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef();
  const handleMM = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - .5;
    const dy = (e.clientY - rect.top) / rect.height - .5;
    setTilt({ x: dy * -20, y: dx * 20 });
  };
  return (
    <div ref={ref} style={{
      position: "relative", width: 160, height: 160, margin: "0 auto", cursor: "pointer",
      transform: `perspective(600px) rotateX(${hov ? tilt.x : 0}deg) rotateY(${hov ? tilt.y : 0}deg)`,
      transition: hov ? "transform .1s ease" : "transform .5s ease",
      animation: hov ? "none" : "avatarRotate 6s ease-in-out 1s infinite",
    }}
      onMouseMove={handleMM} onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0 }); }}
    >
      {/* Outer rings */}
      {[{ r: 78, spd: "18s", col: "rgba(74,158,255,.15)", dash: "12 8" }, { r: 66, spd: "12s", col: "rgba(74,158,255,.2)", dash: "8 6", rev: true }].map((ring, i) => (
        <div key={i} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: ring.r * 2, height: ring.r * 2, borderRadius: "50%", animation: `${ring.rev ? "ringRotateR" : "ringRotate"} ${ring.spd} linear infinite`, zIndex: i + 1 }}>
          <svg width={ring.r * 2} height={ring.r * 2} viewBox={`0 0 ${ring.r * 2} ${ring.r * 2}`}>
            <circle cx={ring.r} cy={ring.r} r={ring.r - 2} fill="none" stroke={ring.col} strokeWidth="1.5" strokeDasharray={ring.dash} />
          </svg>
        </div>
      ))}
      {/* Glow halo */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,rgba(74,158,255,.2) 0%,transparent 70%)", animation: "orbFloat 3s ease-in-out infinite" }} />
      {/* Avatar circle */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 5,
        width: 100, height: 100, borderRadius: "50%",
        background: "linear-gradient(135deg,rgba(74,158,255,.35),rgba(74,158,255,.08))",
        border: "2px solid rgba(74,158,255,.6)",
        boxShadow: `0 0 30px rgba(74,158,255,.35),inset 0 1px 0 rgba(255,255,255,.2)`,
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2,
      }}>
        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#4A9EFF", letterSpacing: ".08em" }}>ME</span>
        <span style={{ fontSize: ".45rem", color: "rgba(74,158,255,.7)", letterSpacing: ".1em" }}>PILOT</span>
      </div>
      {/* Online dot */}
      <div style={{ position: "absolute", bottom: 24, right: 22, zIndex: 10, width: 14, height: 14, borderRadius: "50%", background: "#4ade80", border: "2px solid #050b1a", boxShadow: "0 0 8px #4ade80" }} />
      {/* Orbiting dot */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 10, height: 10, marginTop: -5, marginLeft: -5, zIndex: 6, animation: "orbitDot 4s linear infinite" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFB347", boxShadow: "0 0 6px #FFB347" }} />
      </div>
    </div>
  );
}

function BadgeCard({ badge, index }) {
  const [hov, setHov] = useState(false);
  const col = RARITY_COLORS[badge.rarity];
  const glow = RARITY_GLOW[badge.rarity];
  return (
    <div className="badge-item" style={{
      animationDelay: `${index * .06}s`, textAlign: "center", cursor: "pointer",
      transform: hov ? "translateY(-6px) scale(1.05)" : "none",
      transition: "transform .25s cubic-bezier(.34,1.5,.64,1)",
      opacity: badge.earned ? 1 : .35,
    }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, margin: "0 auto 6px", position: "relative", overflow: "hidden",
        background: badge.earned ? `linear-gradient(135deg,${col}22,${col}08)` : "rgba(255,255,255,.04)",
        border: `1.5px solid ${badge.earned ? col + "44" : "rgba(255,255,255,.08)"}`,
        boxShadow: hov && badge.earned ? `0 0 20px ${glow},inset 0 1px 0 rgba(255,255,255,.15)` : "none",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
        transition: "all .25s",
      }}>
        {badge.earned && hov && (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,transparent,${col}15,transparent)`, backgroundSize: "200% 100%", animation: "badgeShine 1.2s ease infinite" }} />
        )}
        {!badge.earned && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}><span style={{ fontSize: ".8rem" }}>🔒</span></div>}
        <span style={{ position: "relative", zIndex: 1 }}>{badge.icon}</span>
        {badge.earned && <div style={{ position: "absolute", top: 4, right: 4, width: 6, height: 6, borderRadius: "50%", background: col, boxShadow: `0 0 6px ${col}` }} />}
      </div>
      <div style={{ fontSize: ".55rem", color: badge.earned ? col : "#8899bb", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, letterSpacing: ".06em", lineHeight: 1.3 }}>{badge.name}</div>
      <div style={{ fontSize: ".45rem", color: badge.earned ? RARITY_COLORS[badge.rarity] + "88" : "rgba(255,255,255,.2)", letterSpacing: ".08em", marginTop: 2, textTransform: "uppercase" }}>{badge.rarity}</div>
    </div>
  );
}

function ActivityHeatmap() {
  const weeks = 12;
  const days = 7;
  const data = Array.from({ length: weeks * days }, () => Math.floor(Math.random() * 5));
  const cols = ["#0f172a", "#1e3a5f", "#1d4ed8", "#3b82f6", "#93c5fd"];
  return (
    <div>
      <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {data.map((v, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: cols[v], transition: "transform .1s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.5)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 8, alignItems: "center" }}>
        <span style={{ fontSize: ".48rem", color: "#8899bb" }}>Less</span>
        {cols.map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: 1, background: c }} />)}
        <span style={{ fontSize: ".48rem", color: "#8899bb" }}>More</span>
      </div>
    </div>
  );
}

function ProfilePage({ setPage }) {
  const [ed, setEd] = useState(false);
  const [name, setName] = useState("Galaxy Pilot");
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 150); return () => clearTimeout(t); }, []);

  const stats = [
    { l: "TOTAL XP", v: "6,840", color: "#4A9EFF" }, { l: "STREAK", v: "15 🔥", color: "#FFB347" },
    { l: "RANK", v: "#7", color: "#C8A2FF" }, { l: "LESSONS", v: "24", color: "#4DFFC3" },
    { l: "QUIZZES", v: "18", color: "#FF6B9D" }, { l: "PLANETS", v: "3/7", color: "#A8D8EA" },
  ];

  return (
    <div style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 60, padding: "90px 28px 60px", maxWidth: 1200, margin: "0 auto" }}>
      <style>{CSS_PROF}</style>
      {/* Header */}
      <div style={{ marginBottom: 32, animation: "fiu .5s ease forwards" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 20, background: "rgba(74,158,255,.08)", border: "1px solid rgba(74,158,255,.22)", marginBottom: 12 }}>
          <span style={{ fontSize: ".6rem", letterSpacing: ".2em", color: "#4A9EFF", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>◎ PILOT PROFILE</span>
        </div>
        <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3.4rem)", letterSpacing: ".04em", background: "linear-gradient(135deg,#e8f0fe 0%,#4A9EFF 60%,#A8D8EA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>YOUR COMMAND CENTER</h1>
      </div>
      {/* Top layout */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22, marginBottom: 22 }}>
        {/* Left: Avatar panel */}
        <div className="stat-panel" style={{ animationDelay: ".05s", borderRadius: 24, padding: "32px 20px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", backdropFilter: "blur(14px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#4A9EFF,#A8D8EA,#4DFFC3)", borderRadius: "24px 24px 0 0" }} />
          <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translate(-50%,-50%)", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(74,158,255,.08) 0%,transparent 70%)", pointerEvents: "none" }} />
          <AvatarOrb name={name} />
          <div style={{ marginTop: 20 }}>
            {ed
              ? <input value={name} onChange={e => setName(e.target.value)} onBlur={() => setEd(false)} autoFocus style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(74,158,255,.5)", textAlign: "center", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#e8f0fe", width: "100%", outline: "none", marginBottom: 4 }} />
              : <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.2rem", letterSpacing: ".06em", marginBottom: 4, color: "#e8f0fe" }}>{name}</h3>
            }
            <div style={{ fontSize: ".65rem", color: "#8899bb", marginBottom: 18 }}>Galaxy Pilot · Level 12 · Active 2h ago</div>
            {/* Mini stat grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 18 }}>
              {stats.slice(0, 3).map((s, i) => (
                <div key={s.l} style={{ padding: "10px 6px", borderRadius: 12, background: `${s.color}0a`, border: `1px solid ${s.color}20`, animation: `statCount .5s ease ${.2 + i * .08}s both` }}>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1rem", color: s.color }}>{s.v}</div>
                  <div style={{ fontSize: ".46rem", color: "#8899bb", letterSpacing: ".08em" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
              {stats.slice(3).map((s, i) => (
                <div key={s.l} style={{ padding: "10px 6px", borderRadius: 12, background: `${s.color}0a`, border: `1px solid ${s.color}20`, animation: `statCount .5s ease ${.35 + i * .08}s both` }}>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1rem", color: s.color }}>{s.v}</div>
                  <div style={{ fontSize: ".46rem", color: "#8899bb", letterSpacing: ".08em" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setEd(true)} style={{ width: "100%", padding: "9px 0", borderRadius: 12, background: "rgba(74,158,255,.08)", border: "1px solid rgba(74,158,255,.25)", color: "#4A9EFF", fontSize: ".65rem", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".15em", cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,158,255,.16)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,158,255,.08)"; }}>
              ✎ EDIT PROFILE
            </button>
          </div>
        </div>
        {/* Right: Planet progress */}
        <div className="stat-panel" style={{ animationDelay: ".12s", borderRadius: 24, padding: "24px 22px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", backdropFilter: "blur(14px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#C8A2FF,#FF6B9D,#4DFFC3)", borderRadius: "24px 24px 0 0" }} />
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".72rem", letterSpacing: ".15em", color: "#8899bb", marginBottom: 18 }}>SUBJECT MASTERY</div>
          {PLANETS.map((planet, i) => {
            const done = planet.checkpoints.filter(c => c.number < planet.activeLevel).length;
            const total = planet.checkpoints.length;
            const pct = Math.round((done / total) * 100);
            return (
              <div key={planet.id} className="prog-reveal" style={{ animationDelay: `${.15 + i * .07}s`, marginBottom: 13, cursor: "pointer" }}
                onClick={() => setPage && setPage("subjects")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: planet.color, boxShadow: `0 0 6px ${planet.color}`, flexShrink: 0, animation: `orbFloat ${4 + i * .3}s ease-in-out ${i * .2}s infinite` }} />
                    <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: ".78rem", color: "#e8f0fe" }}>{planet.name}</span>
                    <span style={{ fontSize: ".48rem", color: planet.color, padding: "1px 5px", borderRadius: 8, background: `${planet.color}18`, border: `1px solid ${planet.color}25` }}>{planet.currentLevel}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: ".6rem", color: planet.color, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700 }}>{pct}%</span>
                    <span style={{ fontSize: ".52rem", color: "#8899bb" }}>{done}/{total}</span>
                  </div>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,.06)", overflow: "hidden", position: "relative" }}>
                  <div style={{
                    width: visible ? `${pct}%` : "0%", height: "100%", borderRadius: 3,
                    background: `linear-gradient(90deg,${planet.color}77,${planet.color},${planet.color}cc)`,
                    boxShadow: `0 0 10px ${planet.color}66`,
                    transition: `width 1.2s cubic-bezier(.4,0,.2,1) ${.2 + i * .1}s`,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)", animation: "shimmer 2s infinite" }} />
                  </div>
                  {/* Segment marks */}
                  {[25, 50, 75].map(m => (
                    <div key={m} style={{ position: "absolute", top: 0, left: `${m}%`, width: 1, height: "100%", background: "rgba(0,0,0,.25)" }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Bottom layout: Badges + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {/* Badges */}
        <div className="stat-panel" style={{ animationDelay: ".2s", borderRadius: 24, padding: "24px 22px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", backdropFilter: "blur(14px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#FFD54F,#C8A2FF,#FF6B9D,#FFD54F)", backgroundSize: "200%", animation: "badgeShine 3s linear infinite", borderRadius: "24px 24px 0 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".72rem", letterSpacing: ".15em", color: "#8899bb" }}>ACHIEVEMENT BADGES</div>
            <div style={{ fontSize: ".55rem", color: "#8899bb", fontFamily: "'Rajdhani',sans-serif" }}>{BADGES.filter(b => b.earned).length}/{BADGES.length} EARNED</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {BADGES.map((b, i) => <BadgeCard key={b.id} badge={b} index={i} />)}
          </div>
          {/* Rarity legend */}
          <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.entries(RARITY_COLORS).map(([r, c]) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
                <span style={{ fontSize: ".48rem", color: "#8899bb", textTransform: "uppercase", letterSpacing: ".08em" }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Activity */}
        <div className="stat-panel" style={{ animationDelay: ".28s", borderRadius: 24, padding: "24px 22px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", backdropFilter: "blur(14px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#4ade80,#4A9EFF,#4ade80)", backgroundSize: "200%", animation: "badgeShine 3s linear infinite", borderRadius: "24px 24px 0 0" }} />
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".72rem", letterSpacing: ".15em", color: "#8899bb", marginBottom: 18 }}>LEARNING ACTIVITY · LAST 12 WEEKS</div>
          <ActivityHeatmap />
          {/* Recent activity list */}
          <div style={{ marginTop: 22 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: ".62rem", letterSpacing: ".12em", color: "#8899bb", marginBottom: 12 }}>RECENT SESSIONS</div>
            {[
              { label: "Stack Implementation", planet: "DSA", xp: "+45 XP", ago: "2h ago", color: "#4A9EFF" },
              { label: "Search Strategies", planet: "AI", xp: "+30 XP", ago: "Yesterday", color: "#A8D8EA" },
              { label: "React Hooks & State", planet: "Web Dev", xp: "+60 XP", ago: "2 days ago", color: "#FFB347" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0, boxShadow: `0 0 6px ${a.color}`, animation: `orbFloat ${3 + i * .5}s ease-in-out ${i * .3}s infinite` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: ".72rem", color: "#e8f0fe" }}>{a.label}</div>
                  <div style={{ fontSize: ".52rem", color: "#8899bb" }}>{a.planet}</div>
                </div>
                <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".68rem", color: a.color }}>{a.xp}</span>
                <span style={{ fontSize: ".5rem", color: "rgba(255,255,255,.25)" }}>{a.ago}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
