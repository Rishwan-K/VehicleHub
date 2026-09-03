import React from "react";

// Shared split-screen shell for every auth page (Login, Register, Forgot/Reset
// Password). Left panel carries the brand + trust message; right panel holds
// whatever form the page passes in as children. On small screens the left
// panel collapses to a compact strip above the form.
const AuthLayout = ({ eyebrow, title, subtitle, children }) => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#fff" }}>
      <div
        className="auth-brand-panel"
        style={{
          flex: "0 0 42%",
          background: "linear-gradient(160deg, #0b1f35 0%, #123659 100%)",
          color: "#fff",
          padding: "56px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#E8963A",
              color: "#0b1f35",
              fontFamily: "Archivo, sans-serif",
              fontWeight: 800,
              fontSize: 19,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            V
          </div>
          <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 20 }}>
            VehicleHub
          </span>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 380 }}>
          <div style={{ color: "#E8963A", fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
            {eyebrow || "Buy and sell vehicles directly"}
          </div>
          <h1 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 34, lineHeight: 1.2, margin: 0 }}>
            {title || "A marketplace built on trust, not middlemen."}
          </h1>
          <p style={{ color: "#C9D3DC", marginTop: 16, fontSize: 15, lineHeight: 1.6 }}>
            {subtitle ||
              "Talk to sellers directly, see real seller ratings, and post your own listing in minutes."}
          </p>
        </div>

        {/* Simple road motif at the base of the panel — a quiet, on-subject
            decorative touch rather than a generic gradient blob. */}
        <div style={{ position: "relative", zIndex: 1, opacity: 0.5 }}>
          <svg width="100%" height="24" viewBox="0 0 400 24" preserveAspectRatio="none">
            <line x1="0" y1="12" x2="400" y2="12" stroke="#4A6483" strokeWidth="2" strokeDasharray="18 14" />
          </svg>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>{children}</div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-brand-panel { display: none; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
