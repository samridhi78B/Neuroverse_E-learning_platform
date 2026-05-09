import { useState } from "react";
import { IconEyeOpen, IconEyeClosed } from "./icons";

function FieldInput({ id, label, type, placeholder, icon, value, onChange, error, showToggle }) {
  const [show, setShow] = useState(false);
  const inputType = type === "password" && show ? "text" : type;

  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{
        display: "block", fontSize: 11.5, fontWeight: 600,
        color: "var(--text-muted)", letterSpacing: ".6px",
        textTransform: "uppercase", marginBottom: 7,
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        {icon}
        <input
          id={id} type={inputType} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", padding: "11px 40px",
            background: error ? "var(--error-bg)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? "var(--error)" : "rgba(139,148,158,0.15)"}`,
            borderRadius: 10, color: "var(--text)",
            fontFamily: "'Sora', sans-serif", fontSize: 13.5,
            outline: "none",
            boxShadow: error ? "0 0 0 3px rgba(224,82,82,0.08)" : "none",
            transition: "border-color var(--transition), background var(--transition), box-shadow var(--transition)",
          }}
          onFocus={e => { if (!error) { e.target.style.borderColor = "rgba(210,110,40,0.55)"; e.target.style.background = "rgba(200,98,42,0.05)"; e.target.style.boxShadow = "0 0 0 3px rgba(200,98,42,0.1)"; } }}
          onBlur={e => { if (!error) { e.target.style.borderColor = "rgba(139,148,158,0.15)"; e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.boxShadow = "none"; } }}
        />
        {showToggle && (
          <button type="button" onClick={() => setShow(s => !s)} style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-dim)", padding: 2, opacity: show ? 0.45 : 1,
          }}>
            {show ? <IconEyeClosed /> : <IconEyeOpen />}
          </button>
        )}
      </div>
      {error && <div style={{ fontSize: 11.5, color: "var(--error)", marginTop: 5, animation: "msgIn .18s ease" }}>⚠ {error}</div>}
    </div>
  );
}

export default FieldInput;