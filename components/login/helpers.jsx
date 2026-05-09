export const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function pwStrength(pw) {
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
 const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];
  const labels = ["Too short", "Fair", "Good", "Strong"];
  return { score, color: colors[Math.max(score - 1, 0)], label: score > 0 ? labels[score - 1] : "" };
}
