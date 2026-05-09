import LoginForm from "./login";
import SignupForm from "./signup";

export default function authCard({ tab, setTab, showToast, padding, onAuthSuccess }) {
  return (
    <div style={{
      width: "100%", maxWidth: 430,
      background: "rgba(22,27,34,0.82)",
      border: "1px solid rgba(139,148,158,0.15)",
      borderRadius: 20,
      padding: padding || "44px 40px",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 32px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(200,98,42,0.06)",
      animation: "cardIn .55s cubic-bezier(.16,1,.3,1) both",
    }}>
      <div style={{
        display: "flex", background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(139,148,158,0.15)",
        borderRadius: 10, padding: 3, marginBottom: 32, position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 3, bottom: 3, width: "calc(50% - 3px)",
          borderRadius: 8, background: "#1c2333",
          border: "1px solid rgba(200,98,42,0.2)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          transform: tab === "signup" ? "translateX(calc(100%))" : "translateX(0)",
          transition: "transform 0.22s cubic-bezier(.4,0,.2,1)", zIndex: 0,
        }} />
        {["login", "signup"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "9px 16px",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 500,
            color: tab === t ? "var(--text)" : "var(--text-muted)",
            borderRadius: 8, position: "relative", zIndex: 1,
            transition: "color 0.22s cubic-bezier(.4,0,.2,1)",
          }}>
            {t === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      {tab === "login"
        ? <LoginForm key="login" showToast={showToast} onAuthSuccess={onAuthSuccess} />
        : <SignupForm key="signup" showToast={showToast} onAuthSuccess={onAuthSuccess} />
      }
    </div>
  );
}