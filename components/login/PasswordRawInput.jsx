import { useState } from "react";
import { IconEyeOpen, IconEyeClosed } from "./icons";


function PasswordRawInput({ id, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <input id={id} type={show ? "text" : "password"} placeholder="Min. 8 chars" value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "11px 40px",
          background: error ? "var(--error-bg)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${error ? "var(--error)" : "rgba(139,148,158,0.15)"}`,
          borderRadius: 10, color: "var(--text)",
          fontFamily: "'Sora',sans-serif", fontSize: 13.5, outline: "none",
          transition: "border-color var(--transition), background var(--transition), box-shadow var(--transition)",
        }}
       onFocus={e => {
  if (!error) {
    e.target.style.borderColor = "rgba(59,130,246,0.55)";
    e.target.style.background = "rgba(59,130,246,0.05)";
    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
  }
}}
onBlur={e => {
  if (!error) {
    e.target.style.borderColor = "rgba(139,148,158,0.15)";
    e.target.style.background = "rgba(255,255,255,0.04)";
    e.target.style.boxShadow = "none";
  }
}}
      />
      <button type="button" onClick={() => setShow(s => !s)} style={{
        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
        background: "none", border: "none", cursor: "pointer",
        color: "var(--text-dim)", padding: 2, opacity: show ? 0.45 : 1,
      }}>
        {show ? <IconEyeClosed /> : <IconEyeOpen />}
      </button>
    </>
  );
}

export default PasswordRawInput;