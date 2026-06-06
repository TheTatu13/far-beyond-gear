import { useEffect, useState, useRef, useCallback } from "react";
import { getProducts, getBrands, getCategories } from "../lib/api.js";
import { Link } from "react-router-dom";
import GearConstellation from "./GearConstellation.jsx";

// ─── Color palette ────────────────────────────────────────────────────────────
const P = {
  bg: "#0c0804",
  panel: "#130d08",
  panelAlt: "#100a05",
  primary: "#ff6030",
  accent: "#ffaa50",
  gold: "#ffbb00",
  text: "#d4c0a8",
  muted: "#8a7060",
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});

  // Fetch data
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [prods, brnds] = await Promise.all([
          getProducts({ page_size: 8 }),
          getBrands(),
        ]);
        if (mounted) {
          setItems(prods);
          setBrands(brnds.slice(0, 6));
        }
      } catch (err) {
        if (mounted) setError(err.message || "Eroare la încărcare.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  // Banners data
  const banners = [
    {
      id: 1, title: "Getcha Pull!", subtitle: "DIMEBAG DARRELL TRIBUTE",
      desc: "Tonul legendar al thrash metalului american. Echipamente cu atitudine — de la Dean ML la Randall signature.",
      img: "/assets/img/banners/dimebag.png", badge: "TRIBUTE", badgeColor: "#ef4444",
      accentColor: "#f04060", link: "/products?search=dimebag", fit: "contain",
    },
    {
      id: 2, title: "Agresivitate Dean ML", subtitle: "FLYING V EVOLVED",
      desc: "Forma iconică, riff-uri extreme. Echipamentul ales de cei care nu fac compromisuri.",
      img: "/assets/img/banners/dean_ml.png", badge: "HOT DEAL", badgeColor: "#ef4444",
      accentColor: "#ff6b35", link: "/products?search=dean", fit: "contain",
    },
    {
      id: 3, title: "Teroarea Jackson V", subtitle: "PRECISION SHRED MACHINE",
      desc: "Viteză și precizie la un alt nivel. Floyd Rose, ebony fretboard, EMG activ — perfecțiune sonoră.",
      img: "/assets/img/banners/jackson_king_v.png", badge: "NOU VENIT", badgeColor: "#3b82f6",
      accentColor: "#66c0f4", link: "/products?search=jackson", fit: "contain",
    },
    {
      id: 4, title: "Legenda Marshall", subtitle: "THE BRITISH SOUND",
      desc: "De la JCM800 la DSL — sunetul care a definit rock-ul britanic timp de 6 decenii.",
      img: "/assets/img/banners/marshall_amp.png", badge: "TOP SELLER", badgeColor: "#f59e0b",
      accentColor: "#f0c040", link: "/products?search=marshall", fit: "contain",
    },
    {
      id: 5, title: "Pro Studio Kits", subtitle: "PREMIUM PERCUSSION",
      desc: "Seturi de tobe și percuție de studio. De la jazz intimate la blast beats devastatoare.",
      img: "/assets/img/banners/drumset.png", badge: "PRO STUDIO", badgeColor: "#8b5cf6",
      accentColor: "#9060f0", link: "/products?search=drum", fit: "contain",
    },
    {
      id: 6, title: "Pedalboard Heaven", subtitle: "SCULPT YOUR TONE",
      desc: "Overdrive, distortion, delay, reverb — construiește-ți pedalboard-ul de vis piesa cu piesă.",
      img: "/assets/img/banners/pedalboard.png", badge: "ESSENTIALS", badgeColor: "#10b981",
      accentColor: "#34d399", link: "/products?search=pedal", fit: "contain",
    },
  ];

  const infiniteBanners = [...banners, ...banners, ...banners];

  // Category tiles
  const categoryTiles = [
    { name: "Chitare Electrice", icon: "🎸", color: "#66c0f4", link: "/products?category=guitare", count: "120+" },
    { name: "Amplificatoare", icon: "🔊", color: "#f0c040", link: "/products?category=amplificatoare", count: "85+" },
    { name: "Pedale & Efecte", icon: "🎛️", color: "#34d399", link: "/products?category=pedale", count: "200+" },
    { name: "Studio & Recording", icon: "🎚️", color: "#a78bfa", link: "/products?category=studio", count: "60+" },
    { name: "Accesorii", icon: "🔧", color: "#fb923c", link: "/products?category=accesorii", count: "300+" },
    { name: "Tobe & Percuție", icon: "🥁", color: "#f472b6", link: "/products?category=tobe", count: "45+" },
  ];

  // Slider logic
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const originalCount = banners.length;

    const centerSlider = () => {
      const cards = slider.querySelectorAll('.promo-slide');
      const targetCard = cards[originalCount + 2];
      if (targetCard) {
        const centerScroll = targetCard.offsetLeft - (slider.clientWidth / 2) + (targetCard.clientWidth / 2);
        slider.style.scrollSnapType = 'none';
        slider.scrollTo({ left: centerScroll, behavior: 'instant' });
        setTimeout(() => { slider.style.scrollSnapType = 'x mandatory'; }, 50);
      }
    };
    setTimeout(centerSlider, 250);

    let isJumping = false;
    const handleScroll = () => {
      if (isJumping) return;
      const cards = slider.querySelectorAll('.promo-slide');
      if (cards.length < originalCount * 2) return;
      const setWidth = cards[originalCount].offsetLeft - cards[0].offsetLeft;
      if (slider.scrollLeft < cards[originalCount - 1].offsetLeft) {
        isJumping = true;
        slider.style.scrollSnapType = 'none';
        slider.scrollTo({ left: slider.scrollLeft + setWidth, behavior: 'instant' });
        setTimeout(() => { slider.style.scrollSnapType = 'x mandatory'; isJumping = false; }, 50);
      } else if (slider.scrollLeft > cards[originalCount * 2].offsetLeft) {
        isJumping = true;
        slider.style.scrollSnapType = 'none';
        slider.scrollTo({ left: slider.scrollLeft - setWidth, behavior: 'instant' });
        setTimeout(() => { slider.style.scrollSnapType = 'x mandatory'; isJumping = false; }, 50);
      }
    };

    slider.addEventListener('scroll', handleScroll);
    return () => slider.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const scrollSlider = useCallback((dir) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.querySelector('.promo-slide');
    if (card) slider.scrollBy({ left: dir * (card.clientWidth + 32), behavior: 'smooth' });
  }, []);

  const sectionStyle = (id) => ({
    opacity: visibleSections[id] ? 1 : 0,
    transform: visibleSections[id] ? 'translateY(0)' : 'translateY(40px)',
    transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
  });

  return (
    <div style={{ backgroundColor: '#0c0804' }}>

      {/* ══════════════════════════════════════════════════════════════════════
           1. HERO 3D — GearConstellation
         ══════════════════════════════════════════════════════════════════════ */}
      <GearConstellation />

      {/* ══════════════════════════════════════════════════════════════════════
           1.5. FIRE MANIFESTO — Pyro Concert
         ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        width: "100%",
        height: "75vh",
        minHeight: "520px",
        overflow: "hidden",
      }}>
        {/* Imagine fundal concert */}
        <img
          src="/assets/img/fire_stage.jpg"
          alt="Metal concert pyro"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 30%",
            filter: "brightness(0.72) saturate(1.3) contrast(1.05)",
            transform: "scale(1.04)",
            transition: "transform 8s ease",
          }}
        />

        {/* Gradient sus — legătură cu hero */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "180px",
          background: "linear-gradient(180deg, #0d0503 0%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Gradient jos — legătură cu slider */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "200px",
          background: "linear-gradient(0deg, #0a0e1a 0%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Vigneta laterala */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 25%, rgba(5,1,0,0.75) 100%)",
        }} />

        {/* Overlay foc */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(180,30,0,0.08) 0%, rgba(255,60,0,0.12) 45%, rgba(10,5,0,0.3) 100%)",
          mixBlendMode: "screen",
        }} />

        {/* Scanlines subtile */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)",
          opacity: 0.4,
        }} />

        {/* Text content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "2rem",
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.68rem", letterSpacing: "0.55em", textTransform: "uppercase",
            color: "#ff8040", marginBottom: "1.2rem", fontWeight: 700,
            textShadow: "0 0 20px rgba(255,100,20,0.6)",
          }}>
            🔥 BORN IN FIRE · FORGED IN METAL
          </div>

          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(2.8rem, 7.5vw, 5.5rem)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "0.06em",
            lineHeight: 1.0,
            margin: "0 0 0.3rem",
            textShadow: "0 0 100px rgba(255,70,10,0.9), 0 0 200px rgba(255,40,0,0.5), 0 4px 12px rgba(0,0,0,0.95)",
            animation: "fireTextPulse 4s ease-in-out infinite",
          }}>
            UNDE METALUL
          </h2>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(2.8rem, 7.5vw, 5.5rem)",
            fontWeight: 900,
            color: "#ff6030",
            letterSpacing: "0.06em",
            lineHeight: 1.0,
            margin: "0 0 1.4rem",
            textShadow: "0 0 80px #ff6030, 0 0 160px rgba(255,60,20,0.6)",
            animation: "fireTextPulse 4s ease-in-out infinite 0.5s",
          }}>
            PRINDE VIAȚĂ
          </h2>

          {/* Linie separator foc */}
          <div style={{
            width: "140px", height: "2px",
            background: "linear-gradient(90deg, transparent, #ff6030, #ff9900, #ff6030, transparent)",
            boxShadow: "0 0 25px rgba(255,80,20,0.8)",
            marginBottom: "1.4rem",
          }} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(0.85rem, 1.6vw, 1.05rem)",
            color: "rgba(255,255,255,0.92)",
            maxWidth: "480px",
            lineHeight: 1.65,
            marginBottom: "2.2rem",
            letterSpacing: "0.02em",
          }}>
            Echipamente construite pentru cei care trăiesc prin sunet —
            de la primul riff până la ultimul solo devastator.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/products" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "14px 36px",
              background: "linear-gradient(135deg, #ff5520, #cc2200)",
              color: "#fff", fontWeight: 700, fontSize: "0.9rem",
              textDecoration: "none", borderRadius: "6px",
              boxShadow: "0 0 50px rgba(255,60,20,0.55), 0 8px 25px rgba(0,0,0,0.6)",
              letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif",
              border: "1px solid rgba(255,100,40,0.5)",
              textTransform: "uppercase", transition: "all 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 0 70px rgba(255,60,20,0.7), 0 12px 30px rgba(0,0,0,0.7)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 50px rgba(255,60,20,0.55), 0 8px 25px rgba(0,0,0,0.6)"; }}
            >
              🔥 Explorează Arsenalul
            </Link>
            <Link to="/artists" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "14px 32px",
              background: "rgba(255,60,10,0.08)",
              color: "#ffb080", fontWeight: 600, fontSize: "0.9rem",
              textDecoration: "none", borderRadius: "6px",
              border: "1px solid rgba(255,80,20,0.25)",
              letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif",
              backdropFilter: "blur(10px)", transition: "all 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,60,10,0.16)"; e.currentTarget.style.borderColor = "rgba(255,80,20,0.5)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,60,10,0.08)"; e.currentTarget.style.borderColor = "rgba(255,80,20,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Artiști Legendari →
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes fireTextPulse {
            0%, 100% { text-shadow: 0 0 100px rgba(255,70,10,0.9), 0 0 200px rgba(255,40,0,0.5), 0 4px 12px rgba(0,0,0,0.95); }
            50%      { text-shadow: 0 0 140px rgba(255,90,10,1.0), 0 0 280px rgba(255,60,0,0.7), 0 4px 12px rgba(0,0,0,0.95); }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
           2. PREMIUM SLIDER — Colecții Legendare
         ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        padding: "5rem 0 4.5rem",
        background: "linear-gradient(180deg, #0a0602 0%, #0c0804 40%, #0e0906 100%)",
        overflow: "hidden",
      }}>
        {/* Decorative glow spots */}
        <div style={{ position:"absolute", top:"5%", left:"15%", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle, rgba(255,80,20,0.04) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"10%", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle, rgba(255,140,30,0.03) 0%, transparent 70%)", pointerEvents:"none" }} />

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3rem", padding: "0 2rem" }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem",
            letterSpacing: "0.4em", textTransform: "uppercase",
            color: P.primary, marginBottom: "0.6rem", fontWeight: 600,
          }}>★ COLECȚII PREMIUM</div>
          <h2 style={{
            fontFamily: "'Cinzel', serif", fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
            fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "0.04em",
            textShadow: "0 2px 25px rgba(0,0,0,0.5)",
          }}>Echipamente Legendare</h2>
          <div style={{ margin:"0.8rem auto 0", width:"60px", height:"2px", background:`linear-gradient(90deg, transparent, ${P.primary}88, transparent)`, boxShadow:`0 0 10px ${P.primary}33` }} />
        </div>

        {/* Slider nav */}
        {[{ dir: -1, pos: "left", icon: "‹" }, { dir: 1, pos: "right", icon: "›" }].map(btn => (
          <button key={btn.pos}
            onClick={() => scrollSlider(btn.dir)}
            className="slider-nav-btn"
            style={{
              position:"absolute", [btn.pos]:"1.2rem", top:"58%", transform:"translateY(-50%)",
              zIndex:10, width:"50px", height:"50px", borderRadius:"50%",
              border:"1px solid rgba(255,80,20,0.2)", background:"rgba(10,5,2,0.92)",
              backdropFilter:"blur(12px)", color:P.primary, fontSize:"1.5rem", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.3s", boxShadow:"0 8px 25px rgba(0,0,0,0.6)",
            }}
          >{btn.icon}</button>
        ))}

        {/* Slider track */}
        <div ref={sliderRef} className="slider-track" style={{
          display:"flex", gap:"2rem", overflowX:"auto",
          scrollSnapType:"x mandatory", scrollBehavior:"smooth",
          paddingLeft:"calc(50vw - 310px)", paddingRight:"calc(50vw - 310px)",
          paddingTop:"0.5rem", paddingBottom:"1rem", scrollbarWidth:"none",
        }}>
          {infiniteBanners.map((b, idx) => (
            <div key={idx} className="promo-slide"
              onMouseEnter={() => setActiveSlide(idx)}
              onMouseLeave={() => setActiveSlide(null)}
              style={{
                scrollSnapAlign:"center", flexShrink:0, width:"620px", height:"520px",
                borderRadius:"16px", position:"relative", overflow:"hidden", cursor:"pointer",
                border:`1px solid ${activeSlide===idx ? b.accentColor+'44' : 'rgba(255,255,255,0.04)'}`,
                transition:"all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                transform: activeSlide===idx ? "translateY(-10px) scale(1.015)" : "translateY(0) scale(1)",
                boxShadow: activeSlide===idx
                  ? `0 35px 70px rgba(0,0,0,0.7), 0 0 50px ${b.accentColor}12, inset 0 1px 0 rgba(255,255,255,0.05)`
                  : "0 15px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              <Link to={b.link} style={{ textDecoration:"none", display:"block", height:"100%" }}>
                {/* Blurred bg */}
                <img src={b.img} alt="" style={{
                  position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
                  filter:"blur(45px) brightness(0.2) saturate(1.8)", transform:"scale(1.3)",
                }} />
                {/* Accent radial */}
                <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 30%, ${b.accentColor}15, transparent 65%)` }} />

                {/* Main image */}
                <img src={b.img} alt={b.title} style={{
                  position:"relative", width:"100%", height:"100%",
                  objectFit: b.fit || "cover",
                  transition:"transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                  transform: activeSlide===idx ? "scale(1.08)" : "scale(1)", zIndex:1,
                }} />

                {/* Badge */}
                <div style={{ position:"absolute", top:"1.2rem", left:"1.2rem", zIndex:3 }}>
                  <span style={{
                    display:"inline-flex", alignItems:"center", gap:"4px", padding:"6px 16px",
                    borderRadius:"4px", fontSize:"0.62rem", fontWeight:800, letterSpacing:"0.12em",
                    textTransform:"uppercase", background:b.badgeColor, color:"#fff",
                    boxShadow:`0 4px 18px ${b.badgeColor}55`, fontFamily:"'DM Sans', sans-serif",
                  }}>{b.badge}</span>
                </div>

                {/* Bottom overlay */}
                <div style={{
                  position:"absolute", bottom:0, left:0, right:0, zIndex:2,
                  padding:"3rem 1.8rem 1.5rem",
                  background:"linear-gradient(0deg, rgba(6,2,0,0.98) 0%, rgba(6,2,0,0.8) 55%, transparent 100%)",
                }}>
                  <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"0.62rem", letterSpacing:"0.35em", textTransform:"uppercase", color:b.accentColor, marginBottom:"0.35rem", fontWeight:700 }}>
                    {b.subtitle}
                  </div>
                  <h3 style={{ fontFamily:"'Cinzel', serif", fontSize:"1.7rem", fontWeight:800, color:"#fff", margin:"0 0 0.45rem", textShadow:"0 2px 15px rgba(0,0,0,0.8)", letterSpacing:"0.02em" }}>
                    {b.title}
                  </h3>
                  <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"0.84rem", color:"rgba(180,200,220,0.6)", lineHeight:1.5, margin:"0 0 1rem", maxWidth:"460px" }}>
                    {b.desc}
                  </p>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontFamily:"'DM Sans', sans-serif", fontSize:"0.76rem", fontWeight:700, color:b.accentColor, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                    Explorează <span style={{ display:"inline-block", transition:"transform 0.3s", transform:activeSlide===idx?"translateX(5px)":"translateX(0)" }}>→</span>
                  </div>
                </div>

                {/* Side accent */}
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"3px", background:`linear-gradient(to bottom, transparent, ${b.accentColor}, transparent)`, opacity:activeSlide===idx?0.85:0.15, transition:"opacity 0.5s", zIndex:3 }} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
           3. CATEGORII — Quick Access Grid
         ══════════════════════════════════════════════════════════════════════ */}
      <section id="section-categories" className="reveal-section" style={{
        padding: "4.5rem 2rem",
        background: "linear-gradient(180deg, #0e0906 0%, #0c0804 100%)",
        ...sectionStyle('section-categories'),
      }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"0.7rem", letterSpacing:"0.4em", textTransform:"uppercase", color:P.primary, marginBottom:"0.5rem", fontWeight:600 }}>
              🗂 CATEGORII
            </div>
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:"clamp(1.4rem, 2.8vw, 2.2rem)", fontWeight:800, color:"#fff", margin:0 }}>
              Găsește Ce Cauți
            </h2>
          </div>

          <div style={{
            display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",
            gap:"1rem",
          }}>
            {categoryTiles.map((cat, i) => (
              <CategoryTile key={i} cat={cat} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
           4. PRODUCTS — Selecție Rapidă
         ══════════════════════════════════════════════════════════════════════ */}
      <section id="section-products" className="reveal-section" style={{
        position: "relative",
        padding: "4.5rem 2rem 5rem",
        background: "linear-gradient(180deg, #0c0804 0%, #0e0906 50%, #0c0804 100%)",
        ...sectionStyle('section-products'),
      }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          {/* Header */}
          <div style={{
            display:"flex", justifyContent:"space-between", alignItems:"flex-end",
            marginBottom:"2.5rem", flexWrap:"wrap", gap:"1rem",
          }}>
            <div>
              <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"0.7rem", letterSpacing:"0.4em", textTransform:"uppercase", color:P.primary, marginBottom:"0.5rem", fontWeight:600 }}>
                ⚡ SELECȚIE RAPIDĂ
              </div>
              <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:"clamp(1.4rem, 2.5vw, 2rem)", fontWeight:800, color:"#fff", margin:0 }}>
                Cele Mai Căutate
              </h2>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"0.86rem", color:"rgba(200,160,120,0.45)", margin:"0.4rem 0 0 0" }}>
                Echipamente verificate de profesioniști, livrate instant.
              </p>
            </div>
            <Link to="/products" className="catalog-link" style={{
              display:"inline-flex", alignItems:"center", gap:"6px",
              padding:"10px 24px", borderRadius:"999px",
              border:"1px solid rgba(255,80,20,0.18)", background:"rgba(255,80,20,0.04)",
              color:P.primary, textDecoration:"none", fontFamily:"'DM Sans', sans-serif",
              fontSize:"0.82rem", fontWeight:600, letterSpacing:"0.04em", transition:"all 0.3s",
            }}>
              Vezi catalogul complet →
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign:"center", padding:"3rem", color:P.muted, fontFamily:"'DM Sans', sans-serif" }}>
              <div className="loading-spinner" style={{ width:"40px", height:"40px", border:`2px solid ${P.primary}22`, borderTop:`2px solid ${P.primary}`, borderRadius:"50%", margin:"0 auto 1rem" }} />
              Se încarcă...
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ padding:"1.5rem 2rem", borderRadius:"12px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#fca5a5", fontFamily:"'DM Sans', sans-serif", fontSize:"0.9rem" }}>
              ⚠ Nu pot încărca produsele: {error}
            </div>
          )}

          {/* Grid */}
          {!loading && !error && (
            <div style={{
              display:"grid", gap:"1.5rem",
              gridTemplateColumns:"repeat(auto-fill, minmax(270px, 1fr))",
            }}>
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 60} />
              ))}
              {items.length === 0 && (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"3rem", color:P.muted }}>
                  Nu avem produse disponibile momentan.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
           5. BRANDS SHOWCASE
         ══════════════════════════════════════════════════════════════════════ */}
      {brands.length > 0 && (
        <section id="section-brands" className="reveal-section" style={{
          padding: "4.5rem 2rem",
          background: "linear-gradient(180deg, #0c0804 0%, #100906 50%, #0c0804 100%)",
          ...sectionStyle('section-brands'),
        }}>
          <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:"3rem" }}>
              <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"0.7rem", letterSpacing:"0.4em", textTransform:"uppercase", color:P.gold, marginBottom:"0.5rem", fontWeight:600 }}>
                🏆 BRANDURI AUTORIZATE
              </div>
              <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:"clamp(1.4rem, 2.8vw, 2.2rem)", fontWeight:800, color:"#fff", margin:0 }}>
                Parteneri Premium
              </h2>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"0.86rem", color:"rgba(200,160,120,0.4)", margin:"0.5rem 0 0 0", maxWidth:"500px", marginLeft:"auto", marginRight:"auto" }}>
                Doar branduri cu reputație mondială. Fiecare produs — autentic și garantat.
              </p>
            </div>

            <div style={{
              display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",
              gap:"1.2rem",
            }}>
              {brands.map((b, i) => (
                <BrandCard key={b.id} brand={b} delay={i * 80} />
              ))}
            </div>

            <div style={{ textAlign:"center", marginTop:"2.5rem" }}>
              <Link to="/brands" className="catalog-link" style={{
                display:"inline-flex", alignItems:"center", gap:"8px",
                padding:"12px 28px", borderRadius:"999px",
                border:"1px solid rgba(255,180,0,0.2)", background:"rgba(255,180,0,0.04)",
                color:P.gold, textDecoration:"none", fontFamily:"'DM Sans', sans-serif",
                fontSize:"0.82rem", fontWeight:600, letterSpacing:"0.04em", transition:"all 0.3s",
              }}>
                Vezi toate brandurile →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
           6. STATS BAR
         ══════════════════════════════════════════════════════════════════════ */}
      <section id="section-stats" className="reveal-section" style={{
        padding: "3.5rem 2rem",
        background: `linear-gradient(135deg, rgba(255,80,20,0.05) 0%, rgba(12,8,4,0.98) 50%, rgba(255,140,30,0.04) 100%)`,
        borderTop: "1px solid rgba(255,80,20,0.08)",
        borderBottom: "1px solid rgba(255,80,20,0.08)",
        ...sectionStyle('section-stats'),
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem", textAlign: "center",
        }}>
          {[
            { value: "2,500+", label: "Produse în stoc", color: P.primary },
            { value: "50+", label: "Branduri autorizate", color: P.gold },
            { value: "15,000+", label: "Clienți mulțumiți", color: "#34d399" },
            { value: "24/7", label: "Suport dedicat", color: "#a78bfa" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "1rem" }}>
              <div style={{
                fontFamily: "'Cinzel', serif", fontSize: "2.2rem", fontWeight: 900,
                color: stat.color, marginBottom: "0.3rem",
                textShadow: `0 0 30px ${stat.color}33`,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 500,
                color: "rgba(200,160,120,0.5)", letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
           7. FEATURES BAR — Trust signals
         ══════════════════════════════════════════════════════════════════════ */}
      <section id="section-features" className="reveal-section" style={{
        padding: "4rem 2rem",
        background: "linear-gradient(180deg, #0c0804 0%, #0e0906 100%)",
        ...sectionStyle('section-features'),
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "1.5rem",
        }}>
          {[
            { icon: "🚚", title: "Livrare Rapidă", desc: "Transport gratuit peste 500€. Livrare în 24-48h oriunde în țară.", color: P.primary },
            { icon: "🛡️", title: "Garanție Extinsă", desc: "Până la 5 ani garanție pentru produse premium. Retur gratuit 30 zile.", color: "#34d399" },
            { icon: "🎸", title: "Echipament Verificat", desc: "Fiecare instrument — testat și reglat de profesioniști activi.", color: P.gold },
            { icon: "💎", title: "Autenticitate 100%", desc: "Doar produse originale de la distribuitori autorizați. Zero replici.", color: "#a78bfa" },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{
              textAlign: "center", padding: "2rem 1.5rem",
              borderRadius: "14px", background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.04)",
              transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: "80px", height: "2px",
                background: `linear-gradient(90deg, transparent, ${f.color}44, transparent)`,
                opacity: 0.5,
              }} />
              <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem" }}>{f.icon}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem", fontWeight: 700,
                color: "#fff", marginBottom: "0.4rem", letterSpacing: "0.02em",
              }}>{f.title}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
                color: "rgba(200,160,120,0.45)", lineHeight: 1.5,
              }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
           8. CTA BANNER — Newsletter
         ══════════════════════════════════════════════════════════════════════ */}
      <section id="section-cta" className="reveal-section" style={{
        padding: "5rem 2rem",
        background: `radial-gradient(ellipse at 50% 50%, rgba(255,80,20,0.06) 0%, transparent 60%), linear-gradient(180deg, #0e0906 0%, #0c0804 100%)`,
        textAlign: "center",
        ...sectionStyle('section-cta'),
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎵</div>
          <h2 style={{
            fontFamily: "'Cinzel', serif", fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
            fontWeight: 800, color: "#fff", margin: "0 0 0.8rem 0",
          }}>
            Stay Plugged In
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
            color: "rgba(200,160,120,0.5)", lineHeight: 1.6, margin: "0 0 2rem 0",
          }}>
            Abonează-te pentru oferte exclusive, lansări noi și ghiduri de echipament direct în inbox.
          </p>
          <div style={{
            display: "flex", gap: "0.6rem", maxWidth: "480px", margin: "0 auto",
            flexWrap: "wrap", justifyContent: "center",
          }}>
            <input
              type="email"
              placeholder="adresa@email.com"
              style={{
                flex: "1 1 250px", padding: "14px 20px",
                borderRadius: "8px", border: "1px solid rgba(102,192,244,0.15)",
                background: "rgba(255,255,255,0.03)", color: "#fff",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
                outline: "none", transition: "all 0.3s",
                backdropFilter: "blur(8px)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = P.primary;
                e.target.style.boxShadow = `0 0 20px ${P.primary}22`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,80,20,0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
            <button className="cta-subscribe-btn" style={{
              padding: "14px 28px", borderRadius: "8px", border: "none",
              background: `linear-gradient(135deg, ${P.primary}, ${P.accent})`,
              color: "#fff", fontWeight: 700, fontSize: "0.88rem",
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              letterSpacing: "0.04em", transition: "all 0.3s",
              boxShadow: `0 0 25px ${P.primary}33`,
            }}>
              Abonare →
            </button>
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem",
            color: "rgba(200,160,120,0.25)", marginTop: "1rem",
          }}>
            Fără spam. Dezabonare oricând. 🤘
          </p>
        </div>
      </section>

      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-spinner { animation: spin 1s linear infinite; }

        .slider-track::-webkit-scrollbar { display: none; }
        .slider-track { scrollbar-width: none; }

        .slider-nav-btn:hover {
          border-color: ${P.primary} !important;
          box-shadow: 0 0 30px ${P.primary}22 !important;
          transform: translateY(-50%) scale(1.05) !important;
        }

        .catalog-link:hover {
          border-color: ${P.primary} !important;
          background: rgba(255,80,20,0.1) !important;
          box-shadow: 0 0 25px ${P.primary}20 !important;
        }

        .feature-card:hover {
          background: rgba(255,80,20,0.04) !important;
          border-color: rgba(255,80,20,0.14) !important;
          transform: translateY(-4px) !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.4) !important;
        }

        .cta-subscribe-btn:hover {
          box-shadow: 0 0 45px ${P.primary}55 !important;
          transform: translateY(-2px) !important;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function CategoryTile({ cat, delay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={cat.link}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: "none", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem 1rem", borderRadius: "14px",
        background: hovered ? `rgba(${hexToRgb(cat.color)}, 0.06)` : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? cat.color + '30' : 'rgba(255,255,255,0.04)'}`,
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${cat.color}10` : "0 5px 15px rgba(0,0,0,0.2)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: hovered ? "60%" : "0%", height: "2px",
        background: cat.color, transition: "width 0.4s", opacity: 0.7,
      }} />

      <div style={{ fontSize: "2rem", marginBottom: "0.7rem" }}>{cat.icon}</div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 700,
        color: hovered ? "#fff" : "#c0d0e0", textAlign: "center",
        marginBottom: "0.3rem", letterSpacing: "0.02em",
      }}>{cat.name}</div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem",
        color: hovered ? cat.color : "rgba(200,160,120,0.4)",
        fontWeight: 600, letterSpacing: "0.08em",
        transition: "color 0.3s",
      }}>{cat.count} produse</div>
    </Link>
  );
}

function BrandCard({ brand, delay }) {
  const [hovered, setHovered] = useState(false);
  const hasLogo = brand.logo_url || brand.logo;
  const logoSrc = brand.logo_url || brand.logo || "";

  return (
    <Link
      to={`/brands/${brand.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: "none",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "2rem 1rem", borderRadius: "14px",
        background: hovered ? "rgba(255,160,0,0.05)" : "rgba(255,255,255,0.015)",
        border: `1px solid ${hovered ? 'rgba(255,160,0,0.22)' : 'rgba(255,100,30,0.06)'}`,
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? "0 18px 35px rgba(0,0,0,0.4)" : "0 5px 15px rgba(0,0,0,0.2)",
        minHeight: "140px",
      }}
    >
      {hasLogo ? (
        <img src={logoSrc} alt={brand.name} style={{
          maxWidth: "80px", maxHeight: "50px", objectFit: "contain",
          marginBottom: "0.8rem",
          filter: hovered ? "brightness(1.2)" : "brightness(0.8) grayscale(0.3)",
          transition: "filter 0.3s",
        }} />
      ) : (
        <div style={{
          fontSize: "1.8rem", marginBottom: "0.6rem",
          filter: hovered ? "none" : "grayscale(0.5)",
          transition: "filter 0.3s",
        }}>🏷️</div>
      )}
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 700,
        color: hovered ? "#fff" : "#a08870", textAlign: "center",
        letterSpacing: "0.03em", transition: "color 0.3s",
      }}>{brand.name}</div>
    </Link>
  );
}

function ProductCard({ product: p, delay }) {
  const [hovered, setHovered] = useState(false);
  const brandName = p.brand?.name || p.brand_name || "Far Beyond Gear";

  return (
    <Link
      to={`/product/${p.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: "none", display: "block", borderRadius: "14px",
        overflow: "hidden",
        background: hovered
          ? "linear-gradient(155deg, #1e0e06, #140804)"
          : "linear-gradient(155deg, #150a04, #100704)",
        border: `1px solid ${hovered ? 'rgba(255,100,30,0.25)' : 'rgba(255,100,30,0.06)'}`,
        transition: "all 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,80,20,0.08)`
          : "0 8px 20px rgba(0,0,0,0.35)",
        position: "relative",
      }}
    >
      {/* Image */}
      <div style={{
        position: "relative", paddingTop: "75%",
        background: "linear-gradient(180deg, rgba(25,10,4,0.4) 0%, rgba(12,5,2,0.55) 100%)",
        overflow: "hidden",
      }}>
        <img
          src={p.image || "/assets/img/placeholder.svg"}
          alt={p.name}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
          background: "linear-gradient(0deg, rgba(12,5,2,0.92) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
        {/* Hover glow */}
        {hovered && <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(255,80,20,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />}
      </div>

      {/* Content */}
      <div style={{ padding: "1.3rem 1.4rem 1.4rem" }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: P.primary, marginBottom: "0.4rem",
        }}>{brandName}</div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 600,
          color: "#d4c0a8", lineHeight: 1.35, marginBottom: "0.9rem",
          minHeight: "2.6rem",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{p.name}</div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "1.35rem", fontWeight: 800, color: "#fff",
          }}>
            {Number(p.price || 0).toFixed(2)}
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", marginLeft: "4px" }}>€</span>
          </div>
          <div style={{
            width: "36px", height: "36px", borderRadius: "8px",
            background: hovered ? "rgba(255,100,30,0.15)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${hovered ? 'rgba(255,100,30,0.3)' : 'rgba(255,100,30,0.06)'}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s", fontSize: "0.9rem",
          }}>🛒</div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div style={{
        height: "2px",
        background: hovered ? `linear-gradient(90deg, transparent, ${P.primary}, transparent)` : "transparent",
        transition: "background 0.4s",
      }} />
    </Link>
  );
}

// Helper
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
