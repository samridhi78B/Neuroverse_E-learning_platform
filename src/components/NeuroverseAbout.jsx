import { useEffect, useRef, useState } from "react";
import authService from "../services/authService";
import emailjs from 'emailjs-com';

const SUBJECTS_BASE = [
  { id: "dsa", name: "Data Structures & Algorithms", tag: "DSA", total: 8, color: "#3a8fff", glow: "#3a8fff", grad: ["#1a3a7a", "#0a1a3a"] },
  { id: "ai", name: "Artificial Intelligence", tag: "AI", total: 8, color: "#5ab8c8", glow: "#5ab8c8", grad: ["#0e2a32", "#080f14"] },
  { id: "web", name: "Web Development", tag: "Web Dev", total: 8, color: "#d4901a", glow: "#d4901a", grad: ["#3a2200", "#1a1000"] },
  { id: "os", name: "Operating Systems", tag: "OS", total: 8, color: "#9b5fff", glow: "#9b5fff", grad: ["#1a0a3a", "#0a0520"] },
  { id: "db", name: "Databases", tag: "Databases", total: 8, color: "#22c97a", glow: "#22c97a", grad: ["#001f14", "#000f0a"] },
  { id: "cn", name: "Computer Networks", tag: "Networks", total: 8, color: "#e0407a", glow: "#e0407a", grad: ["#2a000f", "#100006"] },
  { id: "cyber", name: "Cybersecurity", tag: "CyberSec", total: 8, color: "#ff4444", glow: "#ff4444", grad: ["#2a0000", "#100000"] },
];

/* ── Planet SVG rendered with radial gradients ── */
function Planet({ color, glow, size = 110 }) {
  const id = color.replace("#", "pg");
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 18px ${glow}88)` }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="35%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="55%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000816" stopOpacity="1" />
        </radialGradient>
        <radialGradient id={id + "a"} cx="38%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id + "c"}><circle cx="50" cy="50" r="42" /></clipPath>
      </defs>
      <circle cx="50" cy="50" r="42" fill={`url(#${id})`} />
      {/* atmosphere bands */}
      <ellipse cx="50" cy="54" rx="42" ry="7" fill="none" stroke={color} strokeOpacity="0.1" strokeWidth="8" clipPath={`url(#${id}c)`} />
      <ellipse cx="50" cy="44" rx="42" ry="5" fill="none" stroke={color} strokeOpacity="0.07" strokeWidth="5" clipPath={`url(#${id}c)`} />
      {/* gloss */}
      <circle cx="50" cy="50" r="42" fill={`url(#${id}a)`} />
    </svg>
  );
}

/* ── Subject Card ── */
function SubjectCard({ s, idx }) {
  const [hovered, setHovered] = useState(false);
  const statusColor = s.status === "ACTIVE" ? "#22c97a" : "#9b5fff";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: `linear-gradient(160deg, ${s.grad[0]} 0%, ${s.grad[1]} 100%)`,
        border: `1px solid ${hovered ? s.color + "55" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16,
        padding: "28px 24px 24px",
        display: "flex", flexDirection: "column", gap: 0,
        cursor: "pointer",
        transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 16px 48px ${s.glow}22, 0 0 0 1px ${s.color}33` : "0 4px 24px rgba(0,0,0,0.4)",
        animation: `cardIn 0.6s ease both`,
        animationDelay: `${idx * 0.07}s`,
        overflow: "hidden",
      }}
    >
      {/* top glow blob */}
      <div style={{
        position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
        width: 160, height: 160, borderRadius: "50%",
        background: `radial-gradient(circle, ${s.color}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif", fontSize: 9, letterSpacing: 2,
          color: statusColor, border: `1px solid ${statusColor}55`,
          borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusColor, display: "inline-block" }} />
          {s.status}
        </span>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9, color: "#334a66", letterSpacing: 1 }}>
          {s.total} LEVELS
        </span>
      </div>

      {/* planet */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, minHeight: 110 }}>
        <Planet color={s.color} glow={s.glow} />
      </div>

      {/* title */}
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 700, color: "#dff0ff", marginBottom: 4, lineHeight: 1.3 }}>
        {s.name}
      </div>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9, color: "#334a66", letterSpacing: 2, marginBottom: 18 }}>
        {s.tag}
      </div>

      {/* stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 16 }}>
        {[
          { val: `${s.done}/${s.total}`, label: "DONE" },
          { val: s.xp, label: "XP" },
          { val: `Lv.${s.lvl}`, label: "LVL" },
        ].map((st) => (
          <div key={st.label} style={{
            background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8, padding: "10px 4px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 700, color: s.color }}>{st.val}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9, letterSpacing: 2, color: "#334a66", marginTop: 2 }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* mastery bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 8, letterSpacing: 3, color: "#334a66" }}>MASTERY</span>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9, color: s.color }}>{s.mastery}%</span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${s.mastery}%`, borderRadius: 2,
          background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
          transition: "width 1s ease",
          boxShadow: `0 0 8px ${s.color}`,
        }} />
      </div>
    </div>
  );
}

/* ── Neural canvas hook ── */
function useNeuralCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, nodes = [], signals = [], raf;
    const COLORS = ["#00d4ff", "#9b5fff", "#00ffcc", "#ff6cbe", "#4df0ff"];
    const DIST = 150;

    function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
    resize();

    function initNodes() {
      nodes = [];
      const N = Math.min(70, Math.floor(W / 22));
      for (let i = 0; i < N; i++) nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
        r: Math.random() * 2 + .7,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        p: Math.random(), pd: Math.random() > .5 ? 1 : -1, ps: Math.random() * .016 + .005,
      });
    }
    initNodes();

    function h2r(hex) { return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)]; }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y, d = Math.hypot(dx, dy);
        if (d < DIST) { ctx.strokeStyle = `rgba(0,180,220,${(1-d/DIST)*.13})`; ctx.lineWidth = .4; ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke(); }
      }
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i]; s.t += .013;
        if (s.t >= 1) { signals.splice(i, 1); continue; }
        const x = s.ax + (s.bx - s.ax) * s.t, y = s.ay + (s.by - s.ay) * s.t;
        const a = Math.sin(s.t * Math.PI), [r,g,b] = h2r(s.color);
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a*.9})`; ctx.shadowBlur = 10; ctx.shadowColor = s.color; ctx.fill(); ctx.shadowBlur = 0;
      }
      for (const n of nodes) {
        n.p += n.ps * n.pd; if (n.p > 1 || n.p < 0) n.pd *= -1;
        const [r,g,b] = h2r(n.color);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${.2+n.p*.6})`; ctx.shadowBlur = n.p * 12; ctx.shadowColor = n.color; ctx.fill(); ctx.shadowBlur = 0;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      if (Math.random() < .009) {
        const a = nodes[Math.floor(Math.random()*nodes.length)], b = nodes[Math.floor(Math.random()*nodes.length)];
        if (a !== b && Math.hypot(b.x-a.x, b.y-a.y) < DIST) signals.push({ ax:a.x, ay:a.y, bx:b.x, by:b.y, t:0, color:a.color });
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    const ro = new ResizeObserver(() => { resize(); initNodes(); });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef]);
}

function useReveal(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return visible;
}

function RevealBlock({ children, delay = 0 }) {
  const ref = useRef();
  const vis = useReveal(ref);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(28px)",
      transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function NeuroverseAbout() {
  const canvasRef = useRef();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("tPTFUgxPZeW3vl99M");
  }, []);
  const [submitMessage, setSubmitMessage] = useState('');
  const [userData, setUserData] = useState(null);

  useNeuralCanvas(canvasRef);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (authService.isAuthenticated()) {
          const profile = await authService.getProfile();
          setUserData(profile.user);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const activeSubjects = SUBJECTS_BASE.map(base => {
    const pXP = (userData?.planetXP && userData.planetXP[base.id]) || 0;
    const lvl = Math.floor(pXP / 1000) + 1;
    const done = Math.min(lvl, base.total);
    const mastery = pXP > 0 ? Math.round(((pXP % 1000) / 1000) * 100) : 0;
    const status = pXP > 0 ? "ACTIVE" : "START";
    return { ...base, xp: pXP, lvl, done, mastery, status };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const templateParams = {
        email: email, // Send to the person who wrote the email
        user_name: email.split('@')[0], // Use the part before @ as name
        from_name: 'EduGalaxy Team',
        message: `Welcome to EduGalaxy! 

🚀 Your learning adventure begins now!

🎯 What happens next:
• Explore 7 subject planets (DSA, AI, Web Dev, OS, Databases, Networks, Cybersecurity)
• Track your progress with XP and levels
• Connect with thousands of learners
• Unlock new challenges as you advance

📚 How we can help:
• Personalized learning paths tailored to your goals
• Interactive coding challenges and quizzes
• Real-time progress tracking
• Community of fellow explorers

🔗 Next steps:
1. Complete your profile to personalize your experience
2. Start with your first subject planet
3. Join our community Discord for support
4. Track your daily learning streak

🌟 EduGalaxy Team
Learning Beyond Boundaries`,
        subject: 'Welcome to EduGalaxy - Your Learning Adventure Begins!'
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        'service_hj5rayl', // Your new service ID
        'template_93w8qi7', // Password Reset template
        templateParams,
        'tPTFUgxPZeW3vl99M' // Your EmailJS public key
      );
      
      if (response.status === 200) {
        setSubmitMessage(`Welcome! Check your inbox at ${email} for confirmation.`);
      } else {
        setSubmitMessage(` Submission failed: Please try again later.`);
      }
    } catch (error) {
      console.error('EmailJS submission error:', error);
      console.error('Error details:', error.text || error.message);
      
      let errorMessage = ' Please try again later.';
      if (error.text && error.text.includes('insufficient authentication scopes')) {
        errorMessage = ' Email service authentication issue. Please contact support or try again later.';
      } else if (error.text) {
        errorMessage = ` ${error.text}`;
      } else if (error.message) {
        errorMessage = ` ${error.message}`;
      }
      
      setSubmitMessage(` Email service error:${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setEmail('');
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",paddingTop:40}} id="about-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        @keyframes cardIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes blip { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes scanPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #050b1a; } ::-webkit-scrollbar-thumb { background: #4A9EFF33; border-radius:2px; }
      `}</style>

      {/* Neural canvas fixed bg */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.55, pointerEvents: "none" }} />

      {/* Scanlines */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>

        {/* ── HERO ── */}
        <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }}>

          {/* Left */}
          <div style={{ padding: "100px 64px 80px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid rgba(0,188,212,0.12)", position: "relative" }}>
            <div style={{ position: "absolute", right: 0, top: "15%", bottom: "15%", width: 1, background: "linear-gradient(to bottom, transparent, #00BCD4, transparent)", opacity: .4 }} />

            <RevealBlock>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "Rajdhani,sans-serif", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#00BCD4", marginBottom: 20, marginLeft: 20 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00BCD4", boxShadow: "0 0 10px #00BCD4", animation: "blip 1.8s ease-in-out infinite", display: "inline-block" }} />
                About Neuroverse
              </div>

              <h1 style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, lineHeight: 1.05, letterSpacing: ".05em", fontSize: "clamp(2.5rem,6vw,4.8rem)", background: "linear-gradient(135deg, #E1BEE7 0%, #B388FF 50%, #00BCD4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "0 0 40px rgba(124,77,255,0.4)" }}>
              </h1>

              <div style={{ width: 48, height: 1, background: "linear-gradient(90deg,#00BCD4,transparent)", margin: "36px 0" }} />

              <p style={{ fontSize: ".85rem", lineHeight: 1.75, color: "#8899bb", maxWidth: 480, margin: "0 auto" }}>
                Neuroverse was built on a single conviction: <strong style={{ color: "#e8f0fe" }}>learning should feel like the best game you have ever played.</strong>
                <br /><br />
                We mapped every discipline onto a living cosmos. Each subject is a <strong style={{ color: "#e8f0fe" }}>planet</strong> with its own atmosphere, terrain, and lore. You do not take courses here. You <strong style={{ color: "#e8f0fe" }}>land on worlds and conquer them.</strong>
              </p>

            </RevealBlock>
          </div>

          {/* Right: signal strength bars */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 56px" }}>
            <RevealBlock delay={0.2}>
              <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 8, letterSpacing: 6, color: "#334a66", textTransform: "uppercase", marginBottom: 32, borderLeft: "2px solid #334a66", paddingLeft: 14 }}>
                Active Learning Planets // Signal Strength
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {activeSubjects.map((s) => (
                  <div key={s.tag} style={{ display: "grid", gridTemplateColumns: "160px 1fr 56px", alignItems: "center", gap: 20, padding: "16px 20px", border: "1px solid transparent", transition: "background .25s, border-color .25s", cursor: "default" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,158,255,0.04)"; e.currentTarget.style.borderColor = "rgba(74,158,255,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                    <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: ".68rem", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#9ab8d4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name.split(" ").slice(0,2).join(" ")}</span>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.max(s.mastery, 4)}%`, background: `linear-gradient(90deg,${s.color},${s.color}55)`, borderRadius: 2, boxShadow: `0 0 6px ${s.color}` }} />
                    </div>
                    <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: ".65rem", color: s.color, textAlign: "right", opacity: .8 }}>{s.mastery}%</span>
                  </div>
                ))}
              </div>
            </RevealBlock>
          </div>
        </div>

        {/* ── PHILOSOPHY STRIP ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: "1px solid rgba(0,188,212,0.12)" }}>
          {[
            { n: "01", tag: "Doctrine", head: "Play is how humans actually learn", body: "Every neurological study on retention points the same direction: challenge, reward, repetition. That is not school. That is game design. We built the engine accordingly." },
            { n: "02", tag: "Architecture", head: "Knowledge mapped as territory", body: "Abstract concepts become physical space. Difficulty becomes elevation. Mastery becomes surface area explored. When knowledge has geography, navigation becomes instinct." },
            { n: "03", tag: "Progression", head: "No ceiling. No final level.", body: "The neuroverse expands as you do. Expert-level content, cross-planet synergies, procedurally generated boss challenges. The horizon keeps moving." },
          ].map((p, i) => (
            <RevealBlock key={p.n} delay={i * 0.15}>
              <div style={{ padding: "72px 52px", borderRight: i < 2 ? "1px solid rgba(0,188,212,0.12)" : "none", position: "relative" }}>
                <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "5rem", fontWeight: 900, lineHeight: 1, color: "rgba(0,188,212,0.05)", position: "absolute", top: 28, right: 28, userSelect: "none", pointerEvents: "none" }}>{p.n}</div>
                <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 8, letterSpacing: 4, textTransform: "uppercase", color: "#00BCD4", display: "block", marginBottom: 20 }}>{p.tag}</span>
                <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1.1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#e8f0fe", marginBottom: 16, lineHeight: 1.3 }}>{p.head}</div>
                <p style={{ fontSize: ".95rem", lineHeight: 1.8, color: "#8899bb" }}>{p.body}</p>
              </div>
            </RevealBlock>
          ))}
        </div>

        {/* ── STATS ── */}
        <RevealBlock>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", maxWidth: 1280, margin: "0 auto", padding: "90px 5vw" }}>
            {[["12+","Subject Worlds"],["500+","Active Missions"],["50K","Explorers Active"],["∞","XP Ceiling"]].map(([n,l],i) => (
              <div key={l} style={{ padding: "48px 32px", borderRight: i < 3 ? "1px solid rgba(0,188,212,0.12)" : "none" }}>
                <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "clamp(2.4rem,4vw,4rem)", fontWeight: 900, letterSpacing: -2, background: "linear-gradient(135deg,#fff,#00BCD4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
                <div style={{ fontSize: ".8rem", letterSpacing: 3, textTransform: "uppercase", color: "#334a66", marginTop: 12 }}>{l}</div>
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* ── MANIFESTO ── */}
        <RevealBlock>
          <div style={{ padding: "120px 5vw", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,188,212,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto" }}>
              <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: 8, letterSpacing: 6, textTransform: "uppercase", color: "#334a66", display: "block", marginBottom: 40 }}>Transmission // Neuroverse HQ</span>
              <p style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "clamp(1.3rem,3vw,2.1rem)", fontWeight: 600, lineHeight: 1.5, color: "#e8f0fe" }}>
                "We built Neuroverse because learning should feel like the best game you have ever played."
              </p>
              <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom,#00BCD4,transparent)", margin: "48px auto 0" }} />
            </div>
          </div>
        </RevealBlock>

        {/* ── FOOTER ── */}
        <div style={{ minHeight: "50vh", background: "linear-gradient(180deg, #050b1a 0%, #0a1528 100%)", borderTop: "1px solid rgba(0,188,212,0.12)", padding: "80px 5vw 40px", position: "relative", overflow: "hidden" }}>
          {/* Background effects */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 20% 50%, rgba(74,158,255,0.03) 0%, transparent 50%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 80% 50%, rgba(0,188,212,0.03) 0%, transparent 50%)", pointerEvents: "none" }} />
          
          <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40, marginBottom: 60 }}>
              {/* Column 1 */}
              <div>
                <h3 style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#e8f0fe", marginBottom: 20, letterSpacing: 1 }}>NEUROVERSE</h3>
                <p style={{ fontFamily: "Rajdhani,sans-serif", fontSize: ".9rem", lineHeight: 1.6, color: "#8899bb", marginBottom: 20 }}>
                  The ultimate learning universe where education meets gaming. Explore planets, master skills, and rise through the cosmos.
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(74,158,255,0.1)", border: "1px solid rgba(74,158,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4A9EFF", cursor: "pointer" }}>◎</div>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,188,212,0.1)", border: "1px solid rgba(0,188,212,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00BCD4", cursor: "pointer" }}>◈</div>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(34,201,122,0.1)", border: "1px solid rgba(34,201,122,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c97a", cursor: "pointer" }}>●</div>
                </div>
              </div>

              {/* Column 2 */}
              <div>
                <h4 style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1rem", fontWeight: 600, color: "#e8f0fe", marginBottom: 16, letterSpacing: 1 }}>EXPLORE</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Subjects", "Progress", "Leaderboard", "Profile"].map((item) => (
                    <li key={item} style={{ marginBottom: 12 }}>
                      <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: ".9rem", color: "#8899bb", cursor: "pointer", transition: "color 0.3s" }} onMouseEnter={(e) => e.target.style.color = "#4A9EFF"} onMouseLeave={(e) => e.target.style.color = "#8899bb"}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 */}
              <div>
                <h4 style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1rem", fontWeight: 600, color: "#e8f0fe", marginBottom: 16, letterSpacing: 1 }}>RESOURCES</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Documentation", "Tutorials", "Community", "Support"].map((item) => (
                    <li key={item} style={{ marginBottom: 12 }}>
                      <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: ".9rem", color: "#8899bb", cursor: "pointer", transition: "color 0.3s" }} onMouseEnter={(e) => e.target.style.color = "#00BCD4"} onMouseLeave={(e) => e.target.style.color = "#8899bb"}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4 */}
              <div>
                <h4 style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "1rem", fontWeight: 600, color: "#e8f0fe", marginBottom: 16, letterSpacing: 1 }}>CONNECT</h4>
                <p style={{ fontFamily: "Rajdhani,sans-serif", fontSize: ".9rem", lineHeight: 1.6, color: "#8899bb", marginBottom: 20 }}>
                  Join thousands of explorers mastering skills across the neuroverse.
                </p>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ position: "relative" }}>
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ 
                        width: "100%",
                        padding: "14px 18px 14px 45px", 
                        background: "rgba(255,255,255,0.08)", 
                        border: "2px solid rgba(74,158,255,0.2)", 
                        borderRadius: 12, 
                        color: "#e8f0fe", 
                        fontFamily: "Rajdhani,sans-serif", 
                        fontSize: ".95rem",
                        outline: "none",
                        transition: "all 0.3s ease",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#4A9EFF";
                        e.target.style.background = "rgba(255,255,255,0.12)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(74,158,255,0.1), inset 0 2px 4px rgba(0,0,0,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(74,158,255,0.2)";
                        e.target.style.background = "rgba(255,255,255,0.08)";
                        e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.1)";
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#4A9EFF",
                      fontSize: "1.1rem"
                    }}>
                      
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    style={{ 
                      padding: "14px 24px", 
                      background: isSubmitting 
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                      border: "none", 
                      borderRadius: 12, 
                      color: "#fff", 
                      fontFamily: "Rajdhani,sans-serif", 
                      fontSize: "1rem", 
                      fontWeight: 700, 
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      opacity: isSubmitting ? 0.8 : 1,
                      boxShadow: isSubmitting 
                        ? "none" 
                        : "0 4px 15px rgba(102,126,234,0.4)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      position: "relative",
                      overflow: "hidden"
                    }} 
                    onMouseEnter={(e) => { 
                      if (!isSubmitting) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 8px 25px rgba(102,126,234,0.5)";
                        e.target.style.background = "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
                      }
                    }} 
                    onMouseLeave={(e) => { 
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(102,126,234,0.4)";
                      e.target.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      {isSubmitting ? (
                        <>
                          <div style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid #ffffff",
                            borderTop: "2px solid transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite"
                          }}></div>
                          JOINING...
                        </>
                      ) : (
                        <>
                           JOIN MISSION
                        </>
                      )}
                    </span>
                  </button>
                </form>
                {submitMessage && (
                  <div style={{
                    marginTop: 16,
                    padding: 18,
                    background: submitMessage.includes('✅') 
                      ? "linear-gradient(135deg, rgba(74,255,158,0.1), rgba(102,126,234,0.1))" 
                      : "linear-gradient(135deg, rgba(255,74,74,0.1), rgba(255,126,102,0.1))",
                    border: submitMessage.includes('✅')
                      ? "2px solid rgba(74,255,158,0.3)"
                      : "2px solid rgba(255,74,74,0.3)",
                    borderRadius: 12,
                    color: "#e8f0fe",
                    fontFamily: "Rajdhani,sans-serif",
                    fontSize: ".9rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                    maxHeight: "300px",
                    overflowY: "auto",
                    boxShadow: submitMessage.includes('✅')
                      ? "0 4px 15px rgba(74,255,158,0.2)"
                      : "0 4px 15px rgba(255,74,74,0.2)",
                    animation: "slideInUp 0.5s ease-out",
                    position: "relative"
                  }}>
                    {submitMessage.includes('✅') && (
                      <div style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        fontSize: "1.2rem"
                      }}>
                        🎉
                      </div>
                    )}
                    {submitMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              <p style={{ fontFamily: "Rajdhani,sans-serif", fontSize: ".8rem", color: "#667799", margin: 0 }}>
                © 2026 Neuroverse. All rights reserved.
              </p>
              <div style={{ display: "flex", gap: 24 }}>
                {["Privacy", "Terms", "Cookies"].map((item) => (
                  <span key={item} style={{ fontFamily: "Rajdhani,sans-serif", fontSize: ".8rem", color: "#667799", cursor: "pointer", transition: "color 0.3s" }} onMouseEnter={(e) => e.target.style.color = "#8899bb"} onMouseLeave={(e) => e.target.style.color = "#667799"}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
