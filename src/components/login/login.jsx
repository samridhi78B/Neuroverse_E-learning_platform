import { useState } from "react";

import FieldInput from "./FieldInput";
import PrimaryButton, { OrDivider, SocialButtons } from "./buttons";

import { IconEmail, IconLock } from "./icons";
import { emailRe } from "./helpers";
import authService from "../../services/authService";

export default function login({ showToast, onAuthSuccess }) {
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  async function submit() {
    const e = {};
    if (!email)                    e.email = "Email is required.";
    else if (!emailRe.test(email)) e.email = "Enter a valid email address.";
    if (!pass)                     e.pass = "Password is required.";
    else if (pass.length < 6)      e.pass = "Password seems too short.";
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const response = await authService.login({ email, password: pass });
      setLoading(false);
      showToast("Signed in successfully!", "success");
      if (onAuthSuccess) {
        onAuthSuccess(response.user);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.error || "Login failed. Please try again.";
      showToast(errorMessage, "error");
      if (error.error?.includes('credentials')) {
        setErrors({ pass: errorMessage });
      } else {
        setErrors({ email: errorMessage });
      }
    }
  }

  return (
    <div style={{ animation: "panelIn .3s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.4px", color: "var(--text)", marginBottom: 5, fontFamily: "'Rajdhani', sans-serif" }}>Welcome back</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, fontFamily: "'Rajdhani', sans-serif" }}>Sign in to continue your learning journey.</div>
      </div>
      <FieldInput id="l-email" label="Email Address" type="email" placeholder="you@example.com"
        icon={<IconEmail />} value={email} onChange={v => { setEmail(v); setErrors(p => ({ ...p, email: "" })); }} error={errors.email} />
      <FieldInput id="l-pass" label="Password" type="password" placeholder="••••••••"
        icon={<IconLock />} value={pass} onChange={v => { setPass(v); setErrors(p => ({ ...p, pass: "" })); }} error={errors.pass} showToggle />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <label style={{
          display: "flex", alignItems: "center", gap: 8, fontSize: 13,
          color: "var(--text-muted)", cursor: "pointer",
          textTransform: "none", letterSpacing: "normal", fontWeight: 400,
          fontFamily: "'Rajdhani', sans-serif"
        }}>
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
            style={{ width: 15, height: 15, accentColor: "var(--accent)", cursor: "pointer" }} />
          Remember me
        </label>
        <a href="#" style={{ fontSize: 12, color: "var(--accent2)", textDecoration: "none", fontFamily: "'Rajdhani', sans-serif" }}
          onMouseEnter={e => e.target.style.textDecoration = "underline"}
          onMouseLeave={e => e.target.style.textDecoration = "none"}>
          Forgot password?
        </a>
      </div>
      <PrimaryButton onClick={submit} loading={loading} label="Sign In" loadingLabel="Signing in…" />
      <OrDivider label="or continue with" />
      <SocialButtons onClick={p => showToast(`Connecting to ${p}…`, "info")} />
    </div>
  );
}