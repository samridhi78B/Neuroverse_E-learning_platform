import { useState, useEffect, useRef, useCallback } from "react";

/* ───────────────────── PIXEL CHARACTERS ───────────────────── */
function PixelCharacter({ type, color, facingRight }) {
  const size = "clamp(16px, 1.8vw, 28px)";
  const style = { width: size, height: size, transform: facingRight ? "scaleX(1)" : "scaleX(-1)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" };
  if (type === "knight") return (
    <svg viewBox="0 0 16 16" style={style}><rect x="5" y="1" width="6" height="2" fill="#90A4AE"/><rect x="6" y="0" width="4" height="1" fill="#B0BEC5"/><rect x="5" y="3" width="6" height="4" fill="#FFCC80"/><rect x="7" y="4" width="1" height="1" fill="#3E2723"/><rect x="9" y="4" width="1" height="1" fill="#3E2723"/><rect x="4" y="7" width="8" height="4" fill={color}/><rect x="5" y="8" width="6" height="2" fill="#B0BEC5"/><rect x="2" y="7" width="2" height="3" fill="#78909C"/><rect x="12" y="6" width="2" height="4" fill="#FFCC80"/><rect x="13" y="3" width="1" height="4" fill="#E0E0E0"/><rect x="5" y="11" width="2" height="3" fill="#5D4037"/><rect x="9" y="11" width="2" height="3" fill="#5D4037"/><rect x="4" y="14" width="3" height="2" fill="#4E342E"/><rect x="9" y="14" width="3" height="2" fill="#4E342E"/></svg>
  );
  if (type === "mage") return (
    <svg viewBox="0 0 16 16" style={style}><rect x="7" y="0" width="2" height="1" fill={color}/><rect x="5" y="1" width="6" height="2" fill={color}/><rect x="4" y="3" width="8" height="1" fill={color}/><rect x="7" y="1" width="2" height="2" fill="#FFD54F"/><rect x="5" y="4" width="6" height="3" fill="#FFCC80"/><rect x="6" y="5" width="1" height="1" fill="#7B1FA2"/><rect x="9" y="5" width="1" height="1" fill="#7B1FA2"/><rect x="4" y="7" width="8" height="5" fill={color}/><rect x="6" y="8" width="4" height="1" fill="#FFD54F"/><rect x="12" y="4" width="1" height="10" fill="#8D6E63"/><rect x="11" y="2" width="3" height="3" rx="1" fill="#7E57C2"/><rect x="12" y="3" width="1" height="1" fill="#E1BEE7"/><rect x="3" y="12" width="10" height="2" fill={color}/><rect x="4" y="14" width="3" height="2" fill={color}/><rect x="9" y="14" width="3" height="2" fill={color}/></svg>
  );
  if (type === "scout") return (
    <svg viewBox="0 0 16 16" style={style}><rect x="5" y="1" width="6" height="3" fill={color}/><rect x="4" y="2" width="2" height="2" fill={color}/><rect x="5" y="4" width="6" height="3" fill="#FFCC80"/><rect x="7" y="5" width="1" height="1" fill="#2E7D32"/><rect x="9" y="5" width="1" height="1" fill="#2E7D32"/><rect x="5" y="7" width="6" height="4" fill={color}/><rect x="6" y="8" width="4" height="1" fill="#4E342E"/><rect x="12" y="5" width="1" height="6" fill="#8D6E63"/><rect x="13" y="6" width="1" height="4" fill="#F5F5DC"/><rect x="3" y="7" width="2" height="5" fill="#2E7D32"/><rect x="5" y="11" width="2" height="3" fill="#5D4037"/><rect x="9" y="11" width="2" height="3" fill="#5D4037"/><rect x="4" y="14" width="3" height="2" fill="#3E2723"/><rect x="9" y="14" width="3" height="2" fill="#3E2723"/></svg>
  );
  return (
    <svg viewBox="0 0 20 16" style={style}><rect x="3" y="2" width="2" height="1" fill={color}/><rect x="2" y="3" width="4" height="1" fill={color}/><rect x="1" y="4" width="5" height="2" fill={color}/><rect x="13" y="2" width="2" height="1" fill={color}/><rect x="12" y="3" width="4" height="1" fill={color}/><rect x="12" y="4" width="5" height="2" fill={color}/><rect x="7" y="1" width="4" height="3" fill={color}/><rect x="8" y="2" width="1" height="1" fill="#FFF176"/><rect x="10" y="2" width="1" height="1" fill="#FFF176"/><rect x="7" y="0" width="1" height="1" fill="#FFD54F"/><rect x="10" y="0" width="1" height="1" fill="#FFD54F"/><rect x="6" y="4" width="6" height="5" fill={color}/><rect x="7" y="5" width="4" height="3" fill="#FFAB91"/><rect x="4" y="8" width="2" height="1" fill={color}/><rect x="2" y="9" width="3" height="1" fill={color}/><rect x="1" y="10" width="2" height="1" fill={color}/><rect x="6" y="9" width="2" height="3" fill={color}/><rect x="10" y="9" width="2" height="3" fill={color}/><rect x="5" y="12" width="3" height="1" fill={color}/><rect x="10" y="12" width="3" height="1" fill={color}/><rect x="11" y="1" width="1" height="1" fill="#FFF176"/><rect x="12" y="0" width="1" height="2" fill="#FFAB40"/><rect x="13" y="0" width="1" height="1" fill="#FF6D00"/></svg>
  );
}

/* ───────────────────── ANIMATED CHARACTER ───────────────────── */
function AnimatedCharacter({ character }) {
  const [pos, setPos] = useState(character.pathPoints[0]);
  const [facingRight, setFacingRight] = useState(true);
  const [bobOffset, setBobOffset] = useState(0);
  const startTime = useRef(Date.now());
  useEffect(() => {
    let rafId;
    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const totalT = (elapsed % character.speed) / character.speed;
      const pts = character.pathPoints;
      const segCount = pts.length - 1;
      const segIdx = Math.floor(totalT * segCount);
      const segT = totalT * segCount - segIdx;
      const p1 = pts[segIdx];
      const p2 = pts[Math.min(segIdx + 1, pts.length - 1)];
      setFacingRight(p2.x >= p1.x);
      setPos({ x: p1.x + (p2.x - p1.x) * segT, y: p1.y + (p2.y - p1.y) * segT });
      setBobOffset(Math.sin(elapsed / 200) * 0.4);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [character]);
  return (
    <div style={{ position: "absolute", zIndex: 8, pointerEvents: "none", left: `${pos.x}%`, top: `${pos.y + bobOffset}%`, transform: "translate(-50%, -50%)", transition: "left 0.05s linear, top 0.05s linear" }}>
      <div style={{ position: "absolute", width: "clamp(10px, 1.4vw, 18px)", height: "clamp(3px, 0.4vw, 6px)", background: "rgba(0,0,0,0.3)", bottom: "-3px", left: "50%", transform: "translateX(-50%)", filter: "blur(2px)", borderRadius: "50%" }} />
      <PixelCharacter type={character.type} color={character.color} facingRight={facingRight} />
    </div>
  );
}

/* ───────────────────── GREEN SCREEN REMOVAL ───────────────────── */
function removeGreenScreen(canvas, img) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (g > 100 && g > r * 1.4 && g > b * 1.4) {
      data[i + 3] = 0;
    } else if (g > 80 && g > r * 1.2 && g > b * 1.2) {
      const greenness = (g - Math.max(r, b)) / g;
      data[i + 3] = Math.max(0, Math.min(255, Math.round(255 * (1 - greenness * 1.5))));
      data[i + 1] = Math.round(g * 0.7);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

/* ───────────────────── LESSON ICON ───────────────────── */
function LessonIcon({ icon }) {
  if (icon === "flag") return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}><path d="M4 2V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M4 2H13L10 5.5L13 9H4" fill="white" fillOpacity="0.8" /></svg>
  );
  if (icon === "check") return (
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
  );
  if (icon === "play") return (
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="8" height="10" viewBox="0 0 8 10" fill="none"><path d="M1 1L7 5L1 9V1Z" fill="white" /></svg></div>
  );
  return <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", flexShrink: 0 }} />;
}

/* ───────────────────── ISLAND MAP ───────────────────── */
function IslandMapView({ planet, onOpenSortingGame, onOpenMysqlQuest, planetXP }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [canvasStyle, setCanvasStyle] = useState({});

  const al = planet.activeLevel;
  const characters = [
    { id: "knight", color: "#4FC3F7", pathPoints: [{ x: 14, y: 60 }, { x: 18, y: 53 }, { x: 16, y: 58 }, { x: 12, y: 63 }, { x: 14, y: 60 }], speed: 8000, type: "knight" },
    { id: "mage", color: "#CE93D8", pathPoints: [{ x: 44, y: 38 }, { x: 48, y: 34 }, { x: 52, y: 40 }, { x: 46, y: 43 }, { x: 44, y: 38 }], speed: 10000, type: "mage" },
    { id: "scout", color: "#81C784", pathPoints: [{ x: 70, y: 53 }, { x: 74, y: 48 }, { x: 77, y: 54 }, { x: 72, y: 58 }, { x: 70, y: 53 }], speed: 7000, type: "scout" },
    { id: "dragon", color: "#FF8A65", pathPoints: [{ x: 62, y: 20 }, { x: 67, y: 15 }, { x: 72, y: 22 }, { x: 65, y: 25 }, { x: 62, y: 20 }], speed: 12000, type: "dragon" },
  ];

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !canvas.width) return;
    const cW = container.clientWidth, cH = container.clientHeight;
    const imgRatio = canvas.width / canvas.height;
    let drawW, drawH;
    if (cW / cH > imgRatio) { drawH = cH; drawW = cH * imgRatio; }
    else { drawW = cW; drawH = cW / imgRatio; }
    const offsetX = (cW - drawW) / 2;
    const offsetY = cH - drawH;
    setCanvasStyle({ position: "absolute", left: `${offsetX}px`, top: `${offsetY}px`, width: `${drawW}px`, height: `${drawH}px` });
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/island-map-v2.jpg";
    img.onload = () => {
      if (canvasRef.current) {
        removeGreenScreen(canvasRef.current, img);
        setLoaded(true);
        fitCanvas();
      }
    };
  }, [fitCanvas]);

  useEffect(() => {
    if (!loaded) return;
    window.addEventListener("resize", fitCanvas);
    fitCanvas();
    return () => window.removeEventListener("resize", fitCanvas);
  }, [loaded, fitCanvas]);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.7s", ...canvasStyle }} />

      {/* NEUROVERSE title */}
      {loaded && (
        <div style={{ position: "absolute", left: "50%", top: "25%", transform: "translate(-50%, -50%)", pointerEvents: "none", userSelect: "none", zIndex: 10, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontWeight: 700, textAlign: "center", whiteSpace: "nowrap", fontSize: "clamp(1.8rem, 4vw, 4.5rem)", color: "#F5E6C8", textShadow: "0 0 30px rgba(92,61,143,0.9), 0 0 80px rgba(92,61,143,0.6), 0 0 120px rgba(124,77,255,0.5), 4px 4px 0px #2D1B4E, -2px -2px 0px rgba(255,255,255,0.1)", letterSpacing: "0.3em", WebkitTextStroke: "1px rgba(45,27,78,0.4)" }}>
            NEUROVERSE
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
            <div style={{ width: "25%", height: 3, background: "linear-gradient(90deg, transparent, #F5E6C8)" }} />
            <div style={{ width: 8, height: 8, background: "#FFD54F", transform: "rotate(45deg)", boxShadow: "0 0 8px rgba(255,213,79,0.6)" }} />
            <div style={{ width: "15%", height: 3, background: "#F5E6C8" }} />
            <div style={{ width: 8, height: 8, background: "#FFD54F", transform: "rotate(45deg)", boxShadow: "0 0 8px rgba(255,213,79,0.6)" }} />
            <div style={{ width: "25%", height: 3, background: "linear-gradient(270deg, transparent, #F5E6C8)" }} />
          </div>
        </div>
      )}

      {/* Characters */}
      {loaded && characters.map(ch => <AnimatedCharacter key={ch.id} character={ch} />)}

      {/* Dotted path */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5, opacity: loaded ? 1 : 0 }} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
        {planet.pathSegments.map((d, i) => (
          <path key={i} d={d} stroke={i < al - 1 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)"} strokeWidth="0.4" strokeDasharray="1.2 0.8" fill="none" />
        ))}
      </svg>

      {/* Level nodes */}
      {loaded && planet.checkpoints.map(cp => {
        const isDone = cp.number < al, isCur = cp.number === al, isLock = cp.number > al;
        return (
          <div key={cp.number} style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10, left: `${cp.x}%`, top: `${cp.y}%`, transform: "translate(-50%, -50%)" }}>
            {isCur && <div style={{ position: "absolute", width: "clamp(36px, 4vw, 60px)", height: "clamp(36px, 4vw, 60px)", borderRadius: "50%", background: "rgba(255,193,7,0.25)", animation: "ping 1s cubic-bezier(0,0,.2,1) infinite" }} />}
            {isCur && <div style={{ position: "absolute", width: "clamp(44px, 5vw, 68px)", height: "clamp(44px, 5vw, 68px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,193,7,0.35) 0%, transparent 70%)" }} />}
            {isDone && <div style={{ position: "absolute", width: "clamp(38px, 4.5vw, 62px)", height: "clamp(38px, 4.5vw, 62px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(76,175,80,0.25) 0%, transparent 70%)" }} />}
            <button style={{
              position: "relative", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, transition: "transform 0.2s",
              width: "clamp(30px, 3.5vw, 52px)", height: "clamp(30px, 3.5vw, 52px)", fontSize: "clamp(11px, 1.5vw, 20px)", fontFamily: "'Press Start 2P', monospace",
              background: isDone ? "linear-gradient(135deg, #1B5E20, #43A047)" : isCur ? "linear-gradient(135deg, #E65100, #FB8C00)" : "linear-gradient(135deg, #1A237E, #3949AB)",
              border: isDone ? "3px solid #66BB6A" : isCur ? "3px solid #FFD54F" : "3px solid #5C6BC0",
              boxShadow: isDone ? "0 4px 16px rgba(76,175,80,0.5), inset 0 1px 0 rgba(255,255,255,0.25)" : isCur ? "0 4px 24px rgba(255,152,0,0.65), inset 0 1px 0 rgba(255,255,255,0.25)" : "0 4px 12px rgba(63,81,181,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
              opacity: isLock ? 0.55 : 1, cursor: isLock ? "not-allowed" : "pointer",
            }}
            onClick={() => {
              if (cp.number === 1 && planet.id === "dsa") {
                onOpenSortingGame();
              } else if (cp.number === 1 && planet.id === "db") {
                onOpenMysqlQuest();
              }
            }}
            >
              {cp.number}
            </button>
            <span style={{ marginTop: 4, fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(7px, 0.8vw, 11px)", color: isDone ? "#A5D6A7" : isCur ? "#FFD54F" : "rgba(255,255,255,0.45)", textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
              {isDone ? "DONE" : `LVL ${cp.number}`}
            </span>
            {/* Show XP for database planet */}
            {planet.id === "db" && cp.number === 1 && (
              <span style={{ 
                marginTop: 2, 
                fontFamily: "'Rajdhani', sans-serif", 
                fontSize: "clamp(8px, 0.9vw, 12px)", 
                color: "#4DFFC3", 
                textShadow: "0 1px 4px rgba(77,255,195,0.5)",
                fontWeight: 700,
                letterSpacing: "0.5px"
              }}>
                {planetXP} XP
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────── ISLAND PAGE ───────────────────── */
export default function IslandPage({ planet, setPage, onClose, onOpenSortingGame, onOpenMysqlQuest, userData }) {
  const al = planet.activeLevel;
  
  // Get planet-specific XP
  const planetXP = userData?.planetXP?.[planet.id] || 0;

  const handleBackToHome = () => {
    // Close island and navigate to main home page
    onClose(); // Close the island first
    setPage("home"); // Then navigate to home
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "linear-gradient(180deg, #050b1a 0%, #0a1628 15%, #0d1f3c 35%, #101a30 55%, #0c1424 75%, #080e1a 100%)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ──── FLOATING BACK BUTTON ──── */}
      <button onClick={handleBackToHome} style={{ position: "absolute", top: 16, left: 16, zIndex: 1001, display: "flex", alignItems: "center", gap: 8, color: "#ffffff", fontSize: ".85rem", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, letterSpacing: ".1em", background: "rgba(74,158,255,0.9)", border: "2px solid rgba(74,158,255,0.6)", borderRadius: 10, padding: "8px 18px", cursor: "pointer", backdropFilter: "blur(10px)", transition: "all .2s", boxShadow: "0 4px 12px rgba(74,158,255,0.3)" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "#4A9EFF"; e.currentTarget.style.background = "rgba(74,158,255,1)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(74,158,255,0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "rgba(74,158,255,0.6)"; e.currentTarget.style.background = "rgba(74,158,255,0.9)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(74,158,255,0.3)"; }}>
        ← BACK
      </button>

      {/* ──── MAIN CONTENT ──── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: "100%", height: "100%", transform: "scale(0.85)", transformOrigin: "center center" }}>
          <IslandMapView planet={planet} onOpenSortingGame={onOpenSortingGame} onOpenMysqlQuest={onOpenMysqlQuest} planetXP={planetXP} />
        </div>
      </div>


      {/* ──── PING ANIMATION ──── */}
      <style>{`@keyframes ping{75%,100%{transform:scale(2);opacity:0}}`}</style>
    </div>
  );
}
