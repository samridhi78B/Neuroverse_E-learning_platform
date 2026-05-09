import { useState } from "react";

import FieldInput from "./FieldInput";
import PasswordRawInput from "./PasswordRawInput";

import PrimaryButton, { OrDivider, SocialButtons } from "./buttons";

import { IconEmail, IconLock, IconUser } from "./icons";

import { emailRe, pwStrength } from "./helpers";

export default function SignupForm({ showToast, onAuthSuccess }) {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const strength = pass.length > 0 ? pwStrength(pass) : null;

  function submit() {
    const e = {};
    if (!name || name.length < 2)  e.name = "Enter your full name.";
    if (!email)                     e.email = "Email is required.";
    else if (!emailRe.test(email))  e.email = "Enter a valid email address.";
    if (!pass)                      e.pass = "Password is required.";
    else if (pass.length < 8)       e.pass = "Minimum 8 characters required.";
    else if (!/[A-Z]/.test(pass))   e.pass = "Include at least one uppercase letter.";
    else if (!/[0-9]/.test(pass))   e.pass = "Include at least one number.";
    if (!confirm)                   e.confirm = "Please confirm your password.";
    else if (confirm !== pass)      e.confirm = "Passwords do not match.";
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { 
      setLoading(false); 
      showToast("Account created! Welcome to NeuroVerse!", "success");
      if (onAuthSuccess) {
        onAuthSuccess({ email, name });
      }
    }, 1500);
  }

  return (
    <div style={{ animation: "panelIn .3s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.4px", color: "var(--text)", marginBottom: 5 }}>Create account</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>Start your learning journey for free.</div>
      </div>
      <FieldInput id="s-name" label="Full Name" type="text" placeholder="Jane Smith"
        icon={<IconUser />} value={name} onChange={v => { setName(v); setErrors(p => ({ ...p, name: "" })); }} error={errors.name} />
      <FieldInput id="s-email" label="Email Address" type="email" placeholder="you@example.com"
        icon={<IconEmail />} value={email} onChange={v => { setEmail(v); setErrors(p => ({ ...p, email: "" })); }} error={errors.email} />
      {/* Password + Strength */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="s-pass" style={{
          display: "block", fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)",
          letterSpacing: ".6px", textTransform: "uppercase", marginBottom: 7,
        }}>Password</label>
        <div style={{ position: "relative" }}>
          <IconLock />
          <PasswordRawInput id="s-pass" value={pass} onChange={v => { setPass(v); setErrors(p => ({ ...p, pass: "" })); }} error={errors.pass} />
        </div>
        {strength && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 99,
                  background: i < strength.score ? strength.color : "rgba(255,255,255,0.08)",
                  transition: "background .35s",
                }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: strength.color }}>{strength.label}</div>
          </div>
        )}
        {errors.pass && <div style={{ fontSize: 11.5, color: "var(--error)", marginTop: 5, animation: "msgIn .18s ease" }}>⚠ {errors.pass}</div>}
      </div>
      <FieldInput id="s-confirm" label="Confirm Password" type="password" placeholder="Repeat password"
        icon={<IconLock />} value={confirm} onChange={v => { setConfirm(v); setErrors(p => ({ ...p, confirm: "" })); }} error={errors.confirm} showToggle />
      <PrimaryButton onClick={submit} loading={loading} label="Create Account" loadingLabel="Creating account…" />
      <OrDivider label="or sign up with" />
      <SocialButtons onClick={p => showToast(`Connecting to ${p}…`, "info")} />
    </div>
  );
}
