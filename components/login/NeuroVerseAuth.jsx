import { useState, useEffect, useRef } from "react";
import useWindowWidth from "./hooks";
import { GLOBAL_CSS } from "./globalStyles";

import AuthCard from "./authCard";
import BrandMark from "./BrandMark";
import LeftPanel from "./LeftPanel";
function Toast({ msg, type, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      padding: "14px 20px", borderRadius: 12,
      fontSize: 13, fontWeight: 500,
      background: type === "success" ? "#1e2d25" : "#261a12",
      border: `1px solid ${type === "success" ? "rgba(76,175,136,0.3)" : "rgba(200,98,42,0.3)"}`,
      color: type === "success" ? "#4caf88" : "#e07840",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      animation: "toastIn .3s cubic-bezier(.16,1,.3,1)",
      maxWidth: "calc(100vw - 40px)",
    }}>{msg}</div>
  );
}

export default function NeuroVerseAuth({ onAuthSuccess }) {
  const [tab, setTab]     = useState("login");
  const [toast, setToast] = useState({ msg: "", type: "info", visible: false });
  const timerRef          = useRef(null);
  const width             = useWindowWidth();

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  function showToast(msg, type = "info") {
    clearTimeout(timerRef.current);
    setToast({ msg, type, visible: true });
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }

  const backgrounds = (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 50% at 15% 20%, rgba(180,80,30,0.13) 0%, transparent 65%),
          radial-gradient(ellipse 50% 60% at 88% 80%, rgba(160,70,25,0.1) 0%, transparent 60%),
          #0d1117`,
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(rgba(200,98,42,0.09) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />
    </>
  );

  if (isMobile) {
    return (
      <>
        {backgrounds}
        <Toast {...toast} />
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          {/* Compact top bar */}
          <div style={{
            padding: "20px 20px 0",
            display: "flex", justifyContent: "center",
          }}>
            <BrandMark size="sm" />
          </div>
          <div style={{
            flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center",
            padding: "24px 16px 40px",
            overflowY: "auto",
          }}>
            <AuthCard tab={tab} setTab={setTab} showToast={showToast} padding="28px 20px" onAuthSuccess={onAuthSuccess} />
          </div>
        </div>
      </>
    );
  }

  if (isTablet) {
    return (
      <>
        {backgrounds}
        <Toast {...toast} />
        <div style={{
          position: "relative", zIndex: 1, minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "48px 32px",
          overflowY: "auto",
        }}>
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <BrandMark size="lg" />
            </div>
            <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, letterSpacing: "-0.6px", color: "var(--text)", marginBottom: 10, lineHeight: 1.25 }}>
              Learn without{" "}
    <em style={{  fontStyle: "normal", color: "transparent",background: "linear-gradient(90deg,#3b82f6,#60a5fa)",WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",backgroundClip: "text"
}}>
  boundaries
</em>
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 380, margin: "0 auto" }}>
              4,800+ structured courses · Expert instructors · XP &amp; certificates
            </p>
          </div>
          <div style={{ width: "100%", maxWidth: 460 }}>
            <AuthCard tab={tab} setTab={setTab} showToast={showToast} padding="40px 36px" onAuthSuccess={onAuthSuccess} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {backgrounds}
      <Toast {...toast} />
      <div style={{
        position: "relative", zIndex: 1, minHeight: "100vh",
        display: "grid", gridTemplateColumns: "1fr 1fr",
      }}>
        <LeftPanel />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 56px" }}>
          <AuthCard tab={tab} setTab={setTab} showToast={showToast} onAuthSuccess={onAuthSuccess} />
        </div>
      </div>
    </>
  );
}
