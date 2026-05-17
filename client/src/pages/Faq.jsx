import { useState } from "react";
import { Link } from "react-router-dom";

const C = {
  bg:      "#0c0804",
  panel:   "#130d08",
  soft:    "#1a1008",
  primary: "#ff6030",
  accent:  "#ffaa50",
  border:  "rgba(255,96,48,0.12)",
  text:    "#d4c0a8",
  muted:   "rgba(212,192,168,0.5)",
};

const FAQS = [
  {
    icon: "bi-cart3",
    q: "Cum pot plasa o comandă?",
    a: "Navigați prin catalogul nostru, adăugați produsele dorite în coș și urmați pașii de checkout. Acceptăm plăți securizate via card, transfer bancar sau ramburs la livrare.",
  },
  {
    icon: "bi-truck",
    q: "Care sunt timpii și costurile de livrare?",
    a: "Livrarea se face prin curier rapid în 24-48h lucrătoare de la confirmarea comenzii. Livrare gratuită pentru comenzi peste 500 RON. Taxa standard: 19 RON.",
  },
  {
    icon: "bi-shield-check",
    q: "Ce garanție au instrumentele?",
    a: "Toate produsele noi beneficiază de garanție extinsă de 3 ani, acoperind defectele de fabricație. Service-ul nostru autorizat se ocupă rapid de orice problemă tehnică.",
  },
  {
    icon: "bi-arrow-left-right",
    q: "Pot returna un produs?",
    a: "Absolut. Oferim 30 de zile 'Money Back Guarantee'. Dacă nu ești mulțumit, returnezi produsul fără nicio întrebare, în starea originală.",
  },
  {
    icon: "bi-credit-card",
    q: "Ce metode de plată acceptați?",
    a: "Acceptăm: card Visa/Mastercard/AMEX, plată la livrare (ramburs), transfer bancar și plata în rate prin partenerii noștri bancari.",
  },
  {
    icon: "bi-tools",
    q: "Oferiți servicii de service și reparații?",
    a: "Da! Avem un atelier autorizat cu tehnicieni specializați în chitare electrice, amplificatoare și pedale de efect. Contactați-ne pentru o estimare gratuită.",
  },
];

function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Numele este obligatoriu.";
  if (!form.email.trim()) {
    errs.email = "Email-ul este obligatoriu.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = "Email invalid.";
  }
  if (!form.subject.trim()) errs.subject = "Subiectul este obligatoriu.";
  if (!form.message.trim()) {
    errs.message = "Mesajul este obligatoriu.";
  } else if (form.message.trim().length < 20) {
    errs.message = "Mesajul trebuie să aibă cel puțin 20 de caractere.";
  }
  return errs;
}

function TicketModal({ onClose }) {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [errs, setErrs]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrs(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    // Simulare trimitere (2s) — înlocuiește cu fetch('/api/ticket/', ...) când ai endpoint
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1800);
  };

  const inputStyle = (field) => ({
    background: "#0e0804",
    border: `1px solid ${errs[field] ? "#ff4040" : C.border}`,
    color: C.text,
    borderRadius: "6px",
    padding: "10px 14px",
    width: "100%",
    outline: "none",
    fontSize: "0.9rem",
    transition: "border-color 0.2s",
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderTop: `3px solid ${C.primary}`,
          borderRadius: "14px",
          padding: "36px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: `0 0 60px rgba(255,80,20,0.15), 0 30px 60px rgba(0,0,0,0.6)`,
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "none", border: "none", color: C.muted,
            fontSize: "1.3rem", cursor: "pointer", lineHeight: 1,
          }}
        >×</button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔥</div>
            <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: "10px" }}>Ticket trimis!</h3>
            <p style={{ color: C.muted, marginBottom: "24px" }}>
              Îți vom răspunde în maxim 24h pe adresa <strong style={{ color: C.accent }}>{form.email}</strong>.
            </p>
            <button
              onClick={onClose}
              style={{
                background: `linear-gradient(135deg, ${C.primary}, #d03010)`,
                color: "#fff", border: "none", borderRadius: "6px",
                padding: "10px 28px", fontWeight: 700, cursor: "pointer",
              }}
            >Închide</button>
          </div>
        ) : (
          <>
            <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: "6px", fontSize: "1.3rem" }}>
              🎫 Trimite un Ticket
            </h2>
            <p style={{ color: C.muted, fontSize: "0.85rem", marginBottom: "24px" }}>
              Completează formularul și te contactăm în 24h.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Nume */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ color: C.text, fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Nume complet *
                </label>
                <input
                  type="text" placeholder="Ion Popescu"
                  value={form.name} onChange={set("name")}
                  style={inputStyle("name")}
                  onFocus={(e) => e.target.style.borderColor = C.primary}
                  onBlur={(e) => e.target.style.borderColor = errs.name ? "#ff4040" : C.border}
                />
                {errs.name && <span style={{ color: "#ff6060", fontSize: "0.78rem" }}>{errs.name}</span>}
              </div>

              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ color: C.text, fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Email *
                </label>
                <input
                  type="email" placeholder="ion@exemplu.ro"
                  value={form.email} onChange={set("email")}
                  style={inputStyle("email")}
                  onFocus={(e) => e.target.style.borderColor = C.primary}
                  onBlur={(e) => e.target.style.borderColor = errs.email ? "#ff4040" : C.border}
                />
                {errs.email && <span style={{ color: "#ff6060", fontSize: "0.78rem" }}>{errs.email}</span>}
              </div>

              {/* Subiect */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ color: C.text, fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Subiect *
                </label>
                <select
                  value={form.subject} onChange={set("subject")}
                  style={{ ...inputStyle("subject"), cursor: "pointer" }}
                  onFocus={(e) => e.target.style.borderColor = C.primary}
                  onBlur={(e) => e.target.style.borderColor = errs.subject ? "#ff4040" : C.border}
                >
                  <option value="">— Alege subiectul —</option>
                  <option value="Comandă / Livrare">Comandă / Livrare</option>
                  <option value="Retur / Refund">Retur / Refund</option>
                  <option value="Garanție / Service">Garanție / Service</option>
                  <option value="Produs / Disponibilitate">Produs / Disponibilitate</option>
                  <option value="Altele">Altele</option>
                </select>
                {errs.subject && <span style={{ color: "#ff6060", fontSize: "0.78rem" }}>{errs.subject}</span>}
              </div>

              {/* Mesaj */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ color: C.text, fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Mesaj * <span style={{ color: C.muted, fontWeight: 400 }}>(min. 20 caractere)</span>
                </label>
                <textarea
                  rows={4} placeholder="Descrie problema sau întrebarea ta..."
                  value={form.message} onChange={set("message")}
                  style={{ ...inputStyle("message"), resize: "vertical", minHeight: "100px", fontFamily: "inherit" }}
                  onFocus={(e) => e.target.style.borderColor = C.primary}
                  onBlur={(e) => e.target.style.borderColor = errs.message ? "#ff4040" : C.border}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {errs.message
                    ? <span style={{ color: "#ff6060", fontSize: "0.78rem" }}>{errs.message}</span>
                    : <span />
                  }
                  <span style={{ color: C.muted, fontSize: "0.75rem" }}>{form.message.length} / 20+</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "rgba(255,96,48,0.4)" : `linear-gradient(135deg, ${C.primary}, #d03010)`,
                  color: "#fff", border: "none", borderRadius: "6px",
                  padding: "12px", fontWeight: 700, fontSize: "0.95rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  boxShadow: loading ? "none" : `0 0 30px rgba(255,80,20,0.35)`,
                }}
              >
                {loading ? "Se trimite..." : "🔥 Trimite Ticket"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Faq() {
  const [openIdx,     setOpenIdx]     = useState(null);
  const [showTicket,  setShowTicket]  = useState(false);

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.text }}>

      {/* ── Hero ── */}
      <header style={{
        background: `radial-gradient(ellipse at 50% 0%, #2d0a00 0%, #180500 50%, ${C.bg} 100%)`,
        borderBottom: `1px solid ${C.border}`,
        padding: "72px 0 56px",
        textAlign: "center",
      }}>
        <div className="container">
          <span style={{
            display: "inline-block", marginBottom: "14px",
            background: "rgba(255,96,48,0.1)", color: C.primary,
            border: `1px solid rgba(255,96,48,0.25)`,
            padding: "5px 16px", borderRadius: "99px",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em",
          }}>SUPORT CLIENȚI</span>
          <h1 style={{
            fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 900,
            color: "#fff", marginBottom: "14px", letterSpacing: "0.02em",
          }}>Centru de Ajutor &amp; FAQ</h1>
          <p style={{ color: C.muted, maxWidth: "540px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.6 }}>
            Tot ce trebuie să știi despre experiența ta la Far Beyond Gear, de la prima comandă până la service.
          </p>
        </div>
      </header>

      <div className="container py-5 px-4">
        <div className="row g-5 justify-content-center">

          {/* ── Accordion FAQ ── */}
          <div className="col-lg-8">
            <h2 style={{ color: "#fff", fontWeight: 700, marginBottom: "24px", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="bi bi-question-circle" style={{ color: C.primary }} />
              Întrebări Frecvente
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: openIdx === i ? C.soft : C.panel,
                    border: `1px solid ${openIdx === i ? "rgba(255,96,48,0.30)" : C.border}`,
                    borderLeft: `3px solid ${openIdx === i ? C.primary : "transparent"}`,
                    borderRadius: "10px",
                    overflow: "hidden",
                    transition: "all 0.2s",
                  }}
                >
                  <button
                    onClick={() => toggle(i)}
                    style={{
                      width: "100%", background: "none", border: "none",
                      padding: "18px 20px", textAlign: "left",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: "12px", cursor: "pointer", color: "#fff",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "12px", fontWeight: 600, fontSize: "0.95rem" }}>
                      <i className={`bi ${faq.icon}`} style={{ color: C.primary, fontSize: "1rem", opacity: 0.8 }} />
                      {faq.q}
                    </span>
                    <i
                      className="bi bi-chevron-down"
                      style={{
                        color: C.primary, flexShrink: 0, fontSize: "0.85rem",
                        transition: "transform 0.2s",
                        transform: openIdx === i ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {openIdx === i && (
                    <div style={{
                      padding: "0 20px 20px 44px",
                      color: C.muted, fontSize: "0.9rem", lineHeight: 1.7,
                      borderTop: `1px solid ${C.border}`,
                      paddingTop: "16px",
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="col-lg-4">
            {/* Ticket card */}
            <div style={{
              background: C.panel, border: `1px solid ${C.border}`,
              borderRadius: "12px", padding: "28px 24px",
              textAlign: "center", marginBottom: "16px",
            }}>
              <div style={{
                width: "70px", height: "70px", borderRadius: "50%",
                background: "rgba(255,96,48,0.1)",
                border: `1px solid rgba(255,96,48,0.2)`,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                marginBottom: "16px", fontSize: "1.8rem",
              }}>📞</div>

              <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: "8px", fontSize: "1.05rem" }}>
                Ai nevoie de ajutor?
              </h3>
              <p style={{ color: C.muted, fontSize: "0.83rem", lineHeight: 1.6, marginBottom: "20px" }}>
                Echipa noastră de suport este disponibilă de luni până vineri între <strong style={{ color: C.accent }}>09:00 - 18:00</strong>.
              </p>
              <button
                onClick={() => setShowTicket(true)}
                style={{
                  width: "100%",
                  background: `linear-gradient(135deg, ${C.primary}, #d03010)`,
                  color: "#fff", border: "none", borderRadius: "8px",
                  padding: "12px", fontWeight: 700, fontSize: "0.92rem",
                  cursor: "pointer",
                  boxShadow: "0 0 30px rgba(255,80,20,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 50px rgba(255,80,20,0.5)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 0 30px rgba(255,80,20,0.3)"}
              >
                🎫 Trimite un Ticket
              </button>
            </div>

            {/* Resurse utile */}
            <div style={{
              background: C.panel, border: `1px solid ${C.border}`,
              borderRadius: "12px", padding: "24px",
            }}>
              <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: "16px", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="bi bi-link-45deg" style={{ color: C.primary }} />
                Resurse Utile
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  { to: "/terms",      icon: "bi-file-text",  label: "Termeni și Condiții" },
                  { to: "/privacy",    icon: "bi-lock",       label: "Intimitate și Date" },
                  { to: "/withdrawal", icon: "bi-reply",      label: "Politica de Retur" },
                ].map(({ to, icon, label }) => (
                  <li key={to} style={{ marginBottom: "10px" }}>
                    <Link
                      to={to}
                      style={{
                        color: C.muted, textDecoration: "none", fontSize: "0.85rem",
                        display: "flex", alignItems: "center", gap: "8px",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = C.accent}
                      onMouseLeave={(e) => e.currentTarget.style.color = C.muted}
                    >
                      <i className={`bi ${icon}`} style={{ color: C.primary, opacity: 0.7 }} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showTicket && <TicketModal onClose={() => setShowTicket(false)} />}
    </div>
  );
}
