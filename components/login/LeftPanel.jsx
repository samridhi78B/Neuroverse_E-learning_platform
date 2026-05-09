import BrandMark from "./BrandMark";

export default function LeftPanel() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "60px 64px",
      borderRight: "1px solid rgba(139,148,158,0.15)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ marginBottom: 56 }}>
        <BrandMark size="lg" />
      </div>

      <div style={{ width: "100%", maxWidth: 420, margin: "0 auto 52px", animation: "floatY 6s ease-in-out infinite" }}>
  <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg">
    
    <rect x="30" y="40" width="360" height="240" rx="18"
      fill="rgba(22,27,40,0.9)"
      stroke="rgba(59,130,246,0.2)"
      strokeWidth="1"/>

    <circle cx="60" cy="68" r="5" fill="#e05252" opacity=".7"/>
    <circle cx="78" cy="68" r="5" fill="#3b82f6" opacity=".7"/>
    <circle cx="96" cy="68" r="5" fill="#4caf88" opacity=".7"/>

    <rect x="112" y="60" width="230" height="16" rx="4"
      fill="rgba(59,130,246,0.1)"
      stroke="rgba(59,130,246,0.2)"
      strokeWidth="1"/>

    <circle cx="126" cy="68" r="4" fill="rgba(59,130,246,0.35)"/>

    <rect x="136" y="64" width="100" height="8" rx="2" fill="rgba(59,130,246,0.2)"/>

    <rect x="46" y="92" width="70" height="172" rx="10"
      fill="rgba(16,22,34,0.8)"
      stroke="rgba(59,130,246,0.15)"
      strokeWidth="1"/>

    <rect x="56" y="108" width="50" height="8" rx="3" fill="rgba(59,130,246,0.45)"/>
    <rect x="56" y="126" width="40" height="7" rx="3" fill="rgba(59,130,246,0.2)"/>
    <rect x="56" y="143" width="44" height="7" rx="3" fill="rgba(59,130,246,0.2)"/>
    <rect x="56" y="160" width="36" height="7" rx="3" fill="rgba(59,130,246,0.2)"/>
    <rect x="56" y="177" width="48" height="7" rx="3" fill="rgba(59,130,246,0.2)"/>

    <circle cx="71" cy="226" r="18"
      stroke="rgba(59,130,246,0.15)"
      strokeWidth="3"/>

    <path d="M 71 208 A 18 18 0 1 1 54.7 236"
      stroke="#3b82f6"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"/>

    <text x="71" y="230"
      textAnchor="middle"
      fontFamily="Sora,sans-serif"
      fontSize="7"
      fill="rgba(200,210,255,0.8)"
      fontWeight="600">72%</text>

    <rect x="128" y="96" width="112" height="76" rx="10"
      fill="rgba(59,130,246,0.12)"
      stroke="rgba(59,130,246,0.2)"
      strokeWidth="1"/>

    <rect x="138" y="108" width="40" height="28" rx="5"
      fill="rgba(59,130,246,0.25)"/>

    <polygon points="148,117 148,127 158,122"
      fill="rgba(230,240,255,0.7)"/>

    <rect x="138" y="144" width="60" height="6" rx="3"
      fill="rgba(230,240,255,0.4)"/>

    <rect x="138" y="156" width="44" height="5" rx="2"
      fill="rgba(59,130,246,0.3)"/>

    <rect x="250" y="96" width="112" height="76" rx="10"
      fill="rgba(59,130,246,0.08)"
      stroke="rgba(59,130,246,0.15)"
      strokeWidth="1"/>

    <rect x="260" y="108" width="40" height="28" rx="5"
      fill="rgba(76,175,136,0.18)"/>

    <text x="280" y="127"
      textAnchor="middle"
      fontFamily="Sora,sans-serif"
      fontSize="14"
      fill="rgba(76,175,136,0.8)">&lt;/&gt;</text>

    <rect x="260" y="144" width="55" height="6" rx="3"
      fill="rgba(230,240,255,0.35)"/>

    <rect x="260" y="156" width="40" height="5" rx="2"
      fill="rgba(59,130,246,0.25)"/>

    <rect x="128" y="184" width="234" height="68" rx="10"
      fill="rgba(16,22,34,0.7)"
      stroke="rgba(59,130,246,0.12)"
      strokeWidth="1"/>

    <text x="140" y="200"
      fontFamily="Sora,sans-serif"
      fontSize="8"
      fill="rgba(200,220,255,0.6)"
      fontWeight="600"
      letterSpacing=".5">CURRENT COURSE</text>

    <rect x="140" y="207" width="140" height="6" rx="3"
      fill="rgba(200,220,255,0.2)"/>

    <rect x="140" y="217" width="80" height="5" rx="2"
      fill="rgba(59,130,246,0.25)"/>

    <rect x="140" y="231" width="200" height="6" rx="3"
      fill="rgba(255,255,255,0.08)"/>

    <rect x="140" y="231" width="130" height="6" rx="3"
      fill="#3b82f6"/>

    <text x="349" y="238"
      fontFamily="Sora,sans-serif"
      fontSize="7"
      fill="#60a5fa">65%</text>

    <rect x="290" y="36" width="70" height="24" rx="6"
      fill="rgba(22,27,40,0.95)"
      stroke="rgba(59,130,246,0.25)"
      strokeWidth="1"/>

    <circle cx="304" cy="48" r="4" fill="rgba(76,175,136,0.6)"/>

    <rect x="313" y="44" width="38" height="5" rx="2"
      fill="rgba(220,230,255,0.4)"/>

    <rect x="313" y="51" width="26" height="4" rx="2"
      fill="rgba(59,130,246,0.3)"/>

    <rect x="32" y="268" width="84" height="24" rx="6"
      fill="rgba(22,27,40,0.95)"
      stroke="rgba(59,130,246,0.2)"
      strokeWidth="1"/>

    <text x="44" y="283"
      fontFamily="Sora,sans-serif"
      fontSize="8"
      fill="rgba(76,175,136,0.8)">+240 XP earned</text>

  </svg>
</div>

      <h1 style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.8px", color: "var(--text)", marginBottom: 18 }}>
        Learn without<br />
       <em style={{
  fontStyle: "normal",
  color: "transparent",
  background: "linear-gradient(90deg,#3b82f6,#60a5fa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
}}>
  boundaries
</em>
      </h1>
      <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 360, marginBottom: 48 }}>
        A focused, distraction-free space to master new skills
        from code and design to data science and beyond.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {["4,800+ structured courses", "Expert instructors, real projects", "Track progress with XP & certificates"].map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--text-muted)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}