import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────── GLOBAL STYLES (injected once) ─────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&family=JetBrains+Mono:wght@400;600&display=swap');

*{margin:0;padding:0;box-sizing:border-box;}

body{
  font-family:'Nunito',sans-serif;
  background:#0f1117;
  color:#e8e0d5;
  min-height:100vh;
  overflow-x:hidden;
}

:root{
  --bg:#0f1117;
  --bg2:#181c25;
  --card:#1e2130;
  --card2:#161926;
  --border:#2e3347;
  --border2:#3d4460;
  --blue:#3b82f6;
  --blue-dim:#1d4ed8;
  --blue-glow:rgba(59,130,246,.15);
  --green:#22c55e;
  --green-dim:#16a34a;
  --green-glow:rgba(34,197,94,.12);
  --red:#f87171;
  --red-dim:#dc2626;
  --red-glow:rgba(248,113,113,.1);
  --orange:#6366f1;
  --orange-dim:#4f46e5;
  --text:#e8e0d5;
  --text2:#c4bdb4;
  --muted:#7c8499;
  --muted2:#4e566b;
}

/* Dark dot grid background */
.nv-bg-grid{
  background-color:#0f1117;
  background-image:radial-gradient(rgba(59,130,246,.12) 1.5px, transparent 1.5px);
  background-size:28px 28px;
}
.nv-bg-glow{}

@keyframes fadeSlide{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-10px)}}
@keyframes wiggle{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@keyframes popIn{0%{transform:scale(.85);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}

.fade-slide{animation:fadeSlide .35s ease;}
.bounce-anim{animation:bounce .9s ease infinite alternate;}
.pop-in{animation:popIn .3s ease forwards;}

/* Drag chips */
.drag-chip{
  background:#252a3a;
  border:2px solid #3d4460;
  border-radius:10px;
  padding:7px 14px;
  font-family:'JetBrains Mono',monospace;
  font-size:12px;
  cursor:grab;
  user-select:none;
  transition:all .15s;
  color:#e8e0d5;
  font-weight:600;
  box-shadow:0 2px 0 #1a1e2b;
}
.drag-chip:hover{transform:translateY(-3px);box-shadow:0 5px 0 #1a1e2b;border-color:#3b82f6;}
.drag-chip:active{transform:translateY(0);box-shadow:0 1px 0 #1a1e2b;}
.drag-chip.kw-chip{color:#93c5fd;background:#0f1a2e;border-color:#3b82f6;box-shadow:0 2px 0 #1d4ed8;}
.drag-chip.tbl-chip{color:#4ade80;background:#0f1f14;border-color:#22c55e;box-shadow:0 2px 0 #15532d;}
.drag-chip.col-chip{color:#6366f1;background:#080f1e;border-color:#6366f1;box-shadow:0 2px 0 #1e3a5f;}

/* Drag zone */
.drag-zone{
  min-height:60px;
  border:2.5px dashed #3d4460;
  border-radius:14px;
  padding:12px;
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  transition:all .2s;
  background:#161926;
}
.drag-zone.over{border-color:#3b82f6;background:#1f1d0a;}

/* SQL textarea */
.sql-textarea{
  width:100%;
  min-height:100px;
  background:transparent;
  border:none;
  outline:none;
  color:#93c5fd;
  font-family:'JetBrains Mono',monospace;
  font-size:13px;
  line-height:1.8;
  padding:16px 20px;
  resize:vertical;
  caret-color:#3b82f6;
}

/* Table row hover */
.tbl-hover tr:hover td{background:#252a3a !important;}

/* Card hover lift */
.level-card-hover{transition:all .25s cubic-bezier(.34,1.56,.64,1);}
.level-card-hover:hover{transform:translateY(-8px) scale(1.01);}

/* MCQ option hover */
.mcq-opt-hover:hover{
  border-color:#3b82f6 !important;
  background:#252010 !important;
  color:#93c5fd !important;
}

/* Read button hover */
.read-btn-base:hover{background:#252010;border-color:#3b82f6;}

/* Scrollbar */
::-webkit-scrollbar{width:8px;height:8px;}
::-webkit-scrollbar-track{background:#0f1117;}
::-webkit-scrollbar-thumb{background:#3d4460;border-radius:4px;}
::-webkit-scrollbar-thumb:hover{background:#3b82f6;}

/* Selection */
::selection{background:#3b82f633;color:#93c5fd;}

@media(max-width:700px){
  .level-grid{grid-template-columns:1fr !important;}
  .intro-topics-grid{grid-template-columns:1fr !important;}
  .bottom-nav-wrap{flex-direction:column;}
}
@media(max-width:600px){
  .module-pad{padding:20px 14px 80px !important;}
}
`;

/* ─────────────── DATA ─────────────── */

export default GLOBAL_CSS;
