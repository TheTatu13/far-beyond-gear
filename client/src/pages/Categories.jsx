import { useEffect, useState } from "react";
import { getCategories } from "../lib/api.js";
import { Link } from "react-router-dom";

// Custom SVG icons for each music category
const CategoryIcon = ({ name }) => {
  const n = name.toLowerCase();

  // Electric guitar
  if (n.includes("electri")) return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <path d="M44 8 L56 20 L38 38 C36 40 33 41 30 40 L24 46 C22 48 19 48 17 46 L18 42 C16 40 16 37 18 35 L24 29 C23 26 24 23 26 21 Z" stroke="#66c0f4" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="20" cy="44" r="3" fill="#66c0f4"/>
      <line x1="48" y1="12" x2="53" y2="17" stroke="#a5e7f5" strokeWidth="2" strokeLinecap="round"/>
      <line x1="44" y1="16" x2="49" y2="21" stroke="#a5e7f5" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="33" cy="27" r="2" fill="#66c0f4"/>
    </svg>
  );

  // Acoustic guitar
  if (n.includes("acustic")) return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <ellipse cx="32" cy="38" rx="14" ry="16" stroke="#f59e0b" strokeWidth="2.5"/>
      <ellipse cx="32" cy="38" rx="5" ry="5" stroke="#f59e0b" strokeWidth="1.5"/>
      <line x1="32" y1="10" x2="32" y2="22" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="28" y="8" width="8" height="4" rx="2" fill="#f59e0b"/>
      <line x1="26" y1="38" x2="38" y2="38" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  // Bass
  if (n.includes("bas")) return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <path d="M40 10 L52 22 L36 42 C33 46 27 48 22 45 C19 43 21 39 24 40 C28 41 30 38 28 35 C25 30 27 24 32 22 Z" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="25" cy="42" r="3.5" fill="#a78bfa"/>
      <line x1="44" y1="14" x2="50" y2="20" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="18" x2="46" y2="24" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
      <line x1="36" y1="22" x2="42" y2="28" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  // Amplificator / Amp
  if (n.includes("amplif") || n.includes("amp")) return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <rect x="8" y="16" width="48" height="34" rx="4" stroke="#34d399" strokeWidth="2.5"/>
      <circle cx="32" cy="33" r="11" stroke="#34d399" strokeWidth="2"/>
      <circle cx="32" cy="33" r="5" fill="#34d399" fillOpacity="0.3"/>
      <rect x="12" y="20" width="5" height="5" rx="2.5" fill="#34d399"/>
      <rect x="20" y="20" width="5" height="5" rx="2.5" fill="#34d399" fillOpacity="0.5"/>
      <line x1="46" y1="20" x2="51" y2="20" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  // Cabinet / Cab
  if (n.includes("cab")) return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <rect x="8" y="10" width="48" height="44" rx="4" stroke="#fb923c" strokeWidth="2.5"/>
      <circle cx="24" cy="32" r="10" stroke="#fb923c" strokeWidth="2"/>
      <circle cx="24" cy="32" r="4" fill="#fb923c" fillOpacity="0.4"/>
      <circle cx="44" cy="32" r="10" stroke="#fb923c" strokeWidth="2"/>
      <circle cx="44" cy="32" r="4" fill="#fb923c" fillOpacity="0.4"/>
      <line x1="8" y1="18" x2="56" y2="18" stroke="#fb923c" strokeWidth="1.5"/>
    </svg>
  );

  // Pedale efect
  if (n.includes("pedal") || n.includes("efect")) return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <rect x="12" y="18" width="40" height="28" rx="6" stroke="#f472b6" strokeWidth="2.5"/>
      <circle cx="32" cy="32" r="9" stroke="#f472b6" strokeWidth="2"/>
      <circle cx="32" cy="32" r="4" fill="#f472b6" fillOpacity="0.5"/>
      <circle cx="18" cy="24" r="3" fill="#f472b6" fillOpacity="0.6"/>
      <circle cx="46" cy="24" r="3" fill="#f472b6" fillOpacity="0.6"/>
      <line x1="12" y1="52" x2="8" y2="56" stroke="#f472b6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="52" y1="52" x2="56" y2="56" stroke="#f472b6" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  // Pickups
  if (n.includes("pickup")) return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <rect x="14" y="22" width="36" height="20" rx="4" stroke="#facc15" strokeWidth="2.5"/>
      <line x1="22" y1="22" x2="22" y2="42" stroke="#facc15" strokeWidth="1.5"/>
      <line x1="30" y1="22" x2="30" y2="42" stroke="#facc15" strokeWidth="1.5"/>
      <line x1="38" y1="22" x2="38" y2="42" stroke="#facc15" strokeWidth="1.5"/>
      <circle cx="22" cy="32" r="3" fill="#facc15"/>
      <circle cx="30" cy="32" r="3" fill="#facc15"/>
      <circle cx="38" cy="32" r="3" fill="#facc15"/>
      <line x1="32" y1="12" x2="32" y2="20" stroke="#facc15" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="42" x2="32" y2="52" stroke="#facc15" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  // Corzi / Strings
  if (n.includes("corz") || n.includes("string")) return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <line x1="16" y1="12" x2="16" y2="52" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round"/>
      <line x1="24" y1="12" x2="24" y2="52" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="32" y1="12" x2="32" y2="52" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="12" x2="40" y2="52" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="12" x2="48" y2="52" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="14" y1="20" x2="50" y2="20" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="44" x2="50" y2="44" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  // Mixer audio
  if (n.includes("mixer") || n.includes("mix") || n.includes("audio")) return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <rect x="8" y="12" width="48" height="40" rx="4" stroke="#2dd4bf" strokeWidth="2.5"/>
      <line x1="20" y1="20" x2="20" y2="44" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="20" x2="32" y2="44" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="44" y1="20" x2="44" y2="44" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="16" y="26" width="8" height="5" rx="2.5" fill="#2dd4bf"/>
      <rect x="28" y="33" width="8" height="5" rx="2.5" fill="#2dd4bf"/>
      <rect x="40" y="22" width="8" height="5" rx="2.5" fill="#2dd4bf"/>
    </svg>
  );

  // Default: Accesorii / tag
  return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <path d="M12 12 H36 L52 28 L32 48 L12 28 Z" stroke="#94a3b8" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="22" cy="22" r="4" fill="#94a3b8"/>
    </svg>
  );
};

// Accent color per category for the icon background circle
const getCategoryAccent = (name) => {
  const n = name.toLowerCase();
  if (n.includes("electri")) return { bg: 'rgba(102,192,244,0.12)', border: 'rgba(102,192,244,0.3)' };
  if (n.includes("acustic")) return { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' };
  if (n.includes("bas")) return { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' };
  if (n.includes("amplif") || n.includes("amp")) return { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' };
  if (n.includes("cab")) return { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)' };
  if (n.includes("pedal") || n.includes("efect")) return { bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)' };
  if (n.includes("pickup")) return { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.3)' };
  if (n.includes("corz") || n.includes("string")) return { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)' };
  if (n.includes("mixer") || n.includes("audio")) return { bg: 'rgba(45,212,191,0.12)', border: 'rgba(45,212,191,0.3)' };
  return { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)' };
};

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getCategories()
      .then((res) => mounted && setCats(res))
      .catch((err) => mounted && setError(err.message || "Eroare la încărcare."))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="container py-5">
      <header className="mb-4">
        <p className="section-title mb-1 text-primary fw-bold text-uppercase small" style={{ letterSpacing: '0.05em' }}>Organizare Profesională</p>
        <h1 className="h3 text-white mb-0">Categorii</h1>
      </header>
      {loading && <div className="text-muted">Se încarcă categoriile...</div>}
      {error && <div className="alert alert-danger">Nu s-au putut încărca: {error}</div>}
      {!loading && !error && (
        <div className="row g-4" id="categoryList">
          {cats.length === 0 && <div className="text-muted col-12">Nu există categorii înregistrate.</div>}
          {cats.map((c) => {
            const accent = getCategoryAccent(c.name);
            return (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={c.id}>
                <Link
                  className="surface-card p-4 d-flex flex-column align-items-center text-decoration-none hover-translate-y h-100"
                  to={`/products?categories=${c.id}`}
                  style={{
                    borderRadius: '16px',
                    border: `1px solid ${accent.border}`,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: accent.bg,
                      border: `1.5px solid ${accent.border}`,
                      boxShadow: `0 0 18px ${accent.border}`
                    }}
                  >
                    <CategoryIcon name={c.name} />
                  </div>
                  <h3 className="h6 fw-bold text-white mb-0 text-center" style={{ letterSpacing: '0.02em' }}>{c.name}</h3>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
