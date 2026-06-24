import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getCartCount, subscribeCart, unsubscribeCart } from "../lib/cart.js";
import { useAuth } from "../context/AuthContext.jsx";
import { grantAchievement } from "../lib/api.js";
import { toast } from "react-toastify";

export default function Layout({ children }) {
  const { user, authTokens, logoutUser } = useAuth();
  const token = authTokens?.access;
  const [cartCount, setCartCount] = useState(getCartCount());
  const location = useLocation();

  useEffect(() => {
    const handler = () => setCartCount(getCartCount());
    subscribeCart(handler);
    return () => unsubscribeCart(handler);
  }, []);

  const [showScroll, setShowScroll] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [fbRating, setFbRating] = useState(5);
  const [fbHover, setFbHover] = useState(0);
  const [fbMessage, setFbMessage] = useState("");
  const [fbName, setFbName] = useState(user?.username || "");
  const [fbSending, setFbSending] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!fbMessage.trim()) { toast.error("Te rugăm să scrii un mesaj."); return; }
    setFbSending(true);
    setTimeout(() => {
      setFbSending(false);
      setShowFeedback(false);
      setFbMessage("");
      setFbRating(5);
      toast.success("Mulțumim pentru feedback! Îl apreciem enorm. 🎸", { theme: "dark", autoClose: 4000 });
      grantAchievement("Social Butterfly", token);
    }, 900);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close nav on route change (mobile)
  useEffect(() => {
    const nav = document.getElementById("mainNav");
    if (nav?.classList.contains("show")) {
      const bsCollapse = window.bootstrap?.Collapse;
      if (bsCollapse) {
        const inst = bsCollapse.getInstance(nav);
        inst?.hide();
      } else {
        nav.classList.remove("show");
      }
    }
  }, [location.pathname]);

  return (
    <div className="page-shell min-vh-100 d-flex flex-column">
      <div className="benefits-bar py-2">
        <div className="container d-flex flex-wrap justify-content-center gap-4">
          <div className="benefit-item">↩ Retur 30 zile</div>
          <div className="benefit-item">🛡️ Garanție extinsă</div>
          <div className="benefit-item">🚚 Livrare rapidă</div>
          <div className="benefit-item">🎧 Suport dedicat</div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-dark global-nav">
        <div className="container py-3">
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <svg width="34" height="34" viewBox="0 0 100 100" className="me-2" style={{ filter: 'drop-shadow(0 0 12px rgba(255, 90, 20, 0.7))' }}>
              <path d="M50 0 C80 0 100 25 100 50 C100 85 55 100 50 100 C45 100 0 85 0 50 C0 25 20 0 50 0 Z" fill="url(#pickGrad)" />
              <path d="M42 32 L68 50 L42 68 Z" fill="#0c0804" />
              <defs>
                <linearGradient id="pickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff9940" />
                  <stop offset="100%" stopColor="#ff4010" />
                </linearGradient>
              </defs>
            </svg>
            <span className="fw-bold text-white mb-0" style={{ letterSpacing: '0.03em', fontSize: '1.35rem' }}>
              FAR BEYOND <span style={{ color: '#ff6030', textShadow: '0 0 20px rgba(255,80,20,0.6)' }}>GEAR</span>
            </span>
          </NavLink>
          <button
            className="navbar-toggler text-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-label="Deschide meniul"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto mb-3 mb-lg-0 me-lg-3">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Acasă
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  Produse
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/brands">
                  Branduri
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/categories">
                  Categorii
                </NavLink>
              </li>

              {/* AUTH LINKS */}
              {!user ? (
                <>
                  <li className="nav-item ms-lg-3">
                    <NavLink className="nav-link text-info" to="/login">
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-warning" to="/register">
                      Register
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item ms-lg-3">
                    <NavLink className="nav-link text-info fw-bold" to="/profile">
                      ✦ {user.username || 'Profil'}
                    </NavLink>
                  </li>
                  {user?.is_staff && (
                    <li className="nav-item">
                      <NavLink
                        className="nav-link fw-bold"
                        to="/admin-panel"
                        style={{ color: '#ff6030', textShadow: '0 0 8px rgba(255,80,20,0.5)' }}
                      >
                        ⚙ Admin
                      </NavLink>
                    </li>
                  )}
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link text-danger text-start"
                      onClick={logoutUser}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

            </ul>
            <NavLink to="/cart" className="btn cart-button ms-lg-3">
              🛒 Coș ({cartCount})
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1 animate-fade-in" key={location.pathname}>
        {children}
      </main>

      <button 
        className={`back-to-top ${showScroll ? 'visible' : ''}`} 
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i className="bi bi-chevron-up"></i>
      </button>

      <footer className="footer mt-auto" style={{ borderTop: '1px solid rgba(255,80,20,0.12)' }}>
        {/* UPPER PART - DARK BLUE/GRAY (Adequate Colors) */}
        <div className="py-5" style={{ backgroundColor: '#0e0804' }}>
          <div className="container">
            <div className="text-center mb-5">
              <h4 className="text-white fw-bold mb-4">Îți place ceea ce vezi?</h4>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  className="btn btn-outline-light rounded-pill px-4 fw-medium shadow-sm border-2 opacity-75"
                  onClick={() => {
                    grantAchievement("Social Butterfly", token);
                    if (navigator.share) {
                      navigator.share({ title: "Far Beyond Gear", url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copiat în clipboard!", { theme: "dark" });
                    }
                  }}
                >
                  <i className="bi bi-share me-2"></i> Share
                </button>
                <a
                  href="mailto:contact@farbeyondgear.ro?subject=Mesaj Far Beyond Gear"
                  className="btn btn-outline-light rounded-pill px-4 fw-medium shadow-sm border-2 opacity-75"
                >
                  <i className="bi bi-envelope me-2"></i> Email
                </a>
                <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShowFeedback(true)}>
                  <i className="bi bi-megaphone me-2"></i> Trimite feedback-ul tau
                </button>
              </div>
            </div>

            <div className="row g-4 text-white">
              {/* Payment Section */}
              <div className="col-12 col-md-4">
                <h5 className="fw-bold mb-4 text-white">Cumpărați și plătiți în siguranță</h5>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <div className="p-1 px-2 border border-secondary rounded bg-dark shadow-sm small fw-bold text-white opacity-75">Maestro</div>
                  <div className="p-1 px-2 border border-secondary rounded bg-dark shadow-sm small fw-bold text-white opacity-75">Mastercard</div>
                  <div className="p-1 px-2 border border-secondary rounded bg-dark shadow-sm small fw-bold text-white opacity-75">VISA</div>
                  <div className="p-1 px-2 border border-secondary rounded bg-dark shadow-sm small fw-bold text-white opacity-75">AMEX</div>
                  <div className="p-1 px-2 border border-secondary rounded bg-dark shadow-sm small fw-bold text-white opacity-75">GIROPAY</div>
                  <div className="p-1 px-2 border border-secondary rounded bg-dark shadow-sm small fw-bold text-white opacity-75">Card</div>
                </div>
                <p className="text-light opacity-50 small lh-base">
                  plata se poate efectua în siguranță cu Ramburs, Transfer Bancar sau Card de credit.
                </p>
              </div>

              {/* Benefits Section */}
              <div className="col-12 col-md-4">
                <h5 className="fw-bold mb-4 text-white">Beneficiile tale</h5>
                <ul className="list-unstyled small lh-lg opacity-75">
                  <li className="mb-1"><span className="text-success fw-bold me-2">✓</span> 3 Ani Garanție Far Beyond Gear</li>
                  <li className="mb-1"><span className="text-success fw-bold me-2">✓</span> Garanția returnării banilor în 30 de zile</li>
                  <li className="mb-1"><span className="text-success fw-bold me-2">✓</span> Service Reparații</li>
                  <li className="mb-1"><span className="text-success fw-bold me-2">✓</span> Sfaturi de la experții noștri</li>
                  <li className="mb-1"><span className="text-success fw-bold me-2">✓</span> Satisfacție Garantată</li>
                  <li><span className="text-success fw-bold me-2">✓</span> Cel mai mare depozit din Europa</li>
                </ul>
              </div>

              {/* Service Section */}
              <div className="col-12 col-md-4">
                <h5 className="fw-bold mb-4 text-white">Service</h5>
                <ul className="list-unstyled small lh-lg">
                  <li className="mb-2">
                    <NavLink to="/faq#list-comenzi" className="text-decoration-none text-light opacity-75 hover-opacity-100 transition">
                      Costuri de livrare și intervale de livrare
                    </NavLink>
                  </li>
                  <li className="mb-3">
                    <NavLink to="/faq" className="btn btn-warning btn-sm text-dark fw-bold shadow-sm px-3" style={{ borderRadius: '6px' }}>
                      <i className="bi bi-question-circle me-1"></i> Ajutor & FAQ
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER PART - DARK */}
        <div className="py-5" style={{ backgroundColor: '#080402', color: '#fff', borderTop: '1px solid rgba(255,80,20,0.1)' }}>
          <div className="container">
            <div className="row gy-4 align-items-center mb-5">
              <div className="col-12 col-md-6 d-flex gap-3 fs-3">
                <a href="#" className="text-white opacity-75"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-white opacity-75"><i className="bi bi-youtube"></i></a>
                <a href="#" className="text-white opacity-75"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-white opacity-75"><i className="bi bi-pinterest"></i></a>
                <a href="#" className="text-white opacity-75"><i className="bi bi-tiktok"></i></a>
              </div>
              <div className="col-12 col-md-6 text-md-end">
                <div className="d-inline-flex gap-2">
                  <div className="border border-secondary rounded p-2 px-3 small opacity-75" style={{ cursor: 'pointer' }}>App Store</div>
                  <div className="border border-secondary rounded p-2 px-3 small opacity-75" style={{ cursor: 'pointer' }}>Google Play</div>
                </div>
              </div>
            </div>

            <div className="row g-4 small pt-4 border-top border-secondary border-opacity-25">
              <div className="col-12 col-md-3">
                <ul className="list-unstyled lh-lg opacity-75">
                  <li><NavLink to="/terms" className="text-white text-decoration-none hover-opacity-100 transition">Termeni și Condiții / Datele Firmei</NavLink></li>
                  <li><NavLink to="/privacy" className="text-white text-decoration-none hover-opacity-100 transition">Politica de Confidențialitate</NavLink></li>
                  <li><NavLink to="/cookies" className="text-white text-decoration-none hover-opacity-100 transition">Setări cookie</NavLink></li>
                  <li><NavLink to="/withdrawal" className="text-white text-decoration-none hover-opacity-100 transition">Dreptul de reziliere al contractului</NavLink></li>
                </ul>
              </div>
              <div className="col-12 col-md-3">
                <ul className="list-unstyled lh-lg opacity-75">
                  <li><NavLink to="/about" className="text-white text-decoration-none hover-opacity-100 transition">Despre noi</NavLink></li>
                  <li><NavLink to="/careers" className="text-white text-decoration-none hover-opacity-100 transition">Cariere</NavLink></li>
                  <li><NavLink to="/blog" className="text-white text-decoration-none hover-opacity-100 transition">Blog</NavLink></li>
                </ul>
              </div>
              <div className="col-12 col-md-6 text-md-end">
                <p className="mb-0 fw-bold">© 1996–2026 Far Beyond Gear.</p>
                <p className="mb-0 fst-italic opacity-50">Far Beyond Gear loves you, because you rock!</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Feedback Modal */}
      {showFeedback && createPortal(
        <div
          onClick={() => setShowFeedback(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: "520px",
              background: "linear-gradient(145deg, #1a0d06, #0e0804)",
              border: "1px solid rgba(255,100,30,0.3)",
              borderRadius: "20px",
              boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
              padding: "2.5rem",
            }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <p className="text-warning fw-bold small text-uppercase mb-1" style={{ letterSpacing: "0.15em" }}>
                  ★ Spune-ne cum te simți
                </p>
                <h2 className="text-white fw-bolder mb-0 h4">Feedback pentru Far Beyond Gear</h2>
              </div>
              <button
                onClick={() => setShowFeedback(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "1.5rem", cursor: "pointer", lineHeight: 1 }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit}>
              {/* Star rating */}
              <div className="mb-4">
                <label className="form-label text-muted small text-uppercase fw-bold mb-2" style={{ letterSpacing: "0.1em" }}>
                  Experiența ta generală
                </label>
                <div className="d-flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFbRating(star)}
                      onMouseEnter={() => setFbHover(star)}
                      onMouseLeave={() => setFbHover(0)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "2rem", lineHeight: 1, padding: "0 2px",
                        color: star <= (fbHover || fbRating) ? "#ffb347" : "rgba(255,255,255,0.15)",
                        transition: "color 0.15s, transform 0.15s",
                        transform: star <= (fbHover || fbRating) ? "scale(1.15)" : "scale(1)",
                      }}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ms-2 align-self-center text-muted small">
                    {["", "Dezamăgitor", "Slab", "OK", "Bun", "Excelent!"][fbHover || fbRating]}
                  </span>
                </div>
              </div>

              {/* Name */}
              <div className="mb-3">
                <label className="form-label text-muted small text-uppercase fw-bold" style={{ letterSpacing: "0.1em" }}>
                  Numele tău (opțional)
                </label>
                <input
                  type="text"
                  className="form-control border-0 text-white"
                  placeholder="Ex: Mihai"
                  value={fbName}
                  onChange={e => setFbName(e.target.value)}
                  style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px 16px" }}
                />
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="form-label text-muted small text-uppercase fw-bold" style={{ letterSpacing: "0.1em" }}>
                  Mesajul tău <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control border-0 text-white"
                  rows="4"
                  placeholder="Ce îți place? Ce am putea îmbunătăți?"
                  value={fbMessage}
                  onChange={e => setFbMessage(e.target.value)}
                  required
                  style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px 16px", resize: "none" }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-100 fw-bold py-3 rounded-pill"
                disabled={fbSending}
                style={{ fontSize: "1rem", letterSpacing: "0.05em" }}
              >
                {fbSending
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Se trimite...</>
                  : <><i className="bi bi-send-fill me-2"></i>Trimite Feedback</>
                }
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
