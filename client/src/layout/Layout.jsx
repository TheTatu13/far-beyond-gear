import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCartCount, subscribeCart, unsubscribeCart } from "../lib/cart.js";
import { useAuth } from "../context/AuthContext.jsx";
import { grantAchievement } from "../lib/api.js";

export default function Layout({ children }) {
  const { user, token, logoutUser } = useAuth();
  const [cartCount, setCartCount] = useState(getCartCount());
  const location = useLocation();

  useEffect(() => {
    const handler = () => setCartCount(getCartCount());
    subscribeCart(handler);
    return () => unsubscribeCart(handler);
  }, []);

  const [showScroll, setShowScroll] = useState(false);

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
                    alert("Sharing interface simulated! Achievement checked.");
                  }}
                >
                  <i className="bi bi-share me-2"></i> Share
                </button>
                <button className="btn btn-outline-light rounded-pill px-4 fw-medium shadow-sm border-2 opacity-75">
                  <i className="bi bi-envelope me-2"></i> Email
                </button>
                <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
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
    </div>
  );
}
