export default function BrandMark({ size = "lg" }) {
  const isLg = size === "lg";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: isLg ? 12 : 10 }}>
      
      <div
        style={{
          width: isLg ? 38 : 32,
          height: isLg ? 38 : 32,
          borderRadius: isLg ? 10 : 8,

          /* Blue gradient */
          background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          fontSize: isLg ? 18 : 15,

          /* Blue glow */
          boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
        }}
      >
        ⬡
      </div>

      <div
        style={{
          fontSize: isLg ? 20 : 17,
          fontWeight: 700,
          color: "var(--text)"
        }}
      >
        Neuro<span style={{ color: "var(--slate)" }}>Verse</span>
      </div>

    </div>
  );
}