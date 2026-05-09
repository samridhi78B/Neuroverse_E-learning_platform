import { IconGoogle, IconGitHub } from "./icons";
export default function PrimaryButton({ onClick, loading, label, loadingLabel }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width: "100%", padding: 13,

         background: "linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)",
      border: "none", borderRadius: 10,
      cursor: loading ? "not-allowed" : "pointer",
      fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 600,
      color: "#fff", letterSpacing: ".1px",
     boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
      marginBottom: 20, opacity: loading ? 0.6 : 1,
      transition: "transform var(--transition), box-shadow var(--transition), filter var(--transition)",
    }}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(200,98,42,0.35)"; e.currentTarget.style.filter = "brightness(1.08)"; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(200,98,42,0.25)"; e.currentTarget.style.filter = "none"; }}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}

export  function OrDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--text-dim)", marginBottom: 16 }}>
      <div style={{ flex: 1, height: 1, background: "rgba(139,148,158,0.15)" }} />
      {label}
      <div style={{ flex: 1, height: 1, background: "rgba(139,148,158,0.15)" }} />
    </div>
  );
}

export function SocialButtons({ onClick }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[{ label: "Google", icon: <IconGoogle /> }, { label: "GitHub", icon: <IconGitHub /> }].map(({ label, icon }) => (
        <button key={label} onClick={() => onClick(label)} style={{
          padding: "10px 14px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(139,148,158,0.15)",
          borderRadius: 10, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 500,
          color: "var(--text-muted)", transition: "background var(--transition), color var(--transition)",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  );
}
