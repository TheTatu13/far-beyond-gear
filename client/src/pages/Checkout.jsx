import { useMemo, useState, useEffect } from "react";
import { cartTotals, loadCart, clearCart } from "../lib/cart.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { trackPurchase } from "../lib/analytics.js";

// ─── Detectare tip card ───────────────────────────────────────────────────────
function getCardType(num) {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n))      return "visa";
  if (/^5[1-5]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n))  return "amex";
  return "generic";
}

function formatCardNumber(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function luhn(num) {
  const n = num.replace(/\s/g, "");
  if (n.length < 13) return false;
  let sum = 0;
  for (let i = 0; i < n.length; i++) {
    let d = parseInt(n[n.length - 1 - i]);
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
}

// ─── Visual Credit Card ───────────────────────────────────────────────────────
function CreditCard({ cardData, flipped }) {
  const type = getCardType(cardData.number);
  const masked = cardData.number
    ? cardData.number.padEnd(19, " ").replace(/\d(?=.{5})/g, "*")
    : "**** **** **** ****";
  const displayExpiry = cardData.expiry || "MM/YY";
  const displayName   = cardData.name   || "CARDHOLDER NAME";

  const cardBrand = type === "visa"       ? { label: "VISA",       style: { fontStyle: "italic", fontSize: "1.4rem", fontWeight: 900, letterSpacing: "0.02em" } }
                  : type === "mastercard" ? { label: "●● mastercard", style: { fontSize: "0.9rem", fontWeight: 700 } }
                  : type === "amex"       ? { label: "AMEX",        style: { fontSize: "1rem", fontWeight: 700 } }
                  :                        { label: "",              style: {} };

  return (
    <div style={{ perspective: "1000px", width: "340px", height: "200px", margin: "0 auto 28px" }}>
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Front */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          borderRadius: "16px", padding: "22px 26px",
          background: "linear-gradient(135deg, #1a0a02, #3a1200, #1a0800)",
          border: "1px solid rgba(255,96,48,0.25)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,60,20,0.1)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,150,80,0.6)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Far Beyond Gear
            </div>
            <div style={{ color: "#fff", ...cardBrand.style }}>{cardBrand.label}</div>
          </div>

          {/* Chip + Number */}
          <div>
            <div style={{
              width: "38px", height: "28px", borderRadius: "5px",
              background: "linear-gradient(135deg, #ff9900, #ff6030)",
              marginBottom: "14px", opacity: 0.9,
              display: "grid", gridTemplateColumns: "1fr 1fr",
              border: "1px solid rgba(255,200,100,0.3)",
            }} />
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "1.15rem", letterSpacing: "0.14em",
              color: "#fff", textShadow: "0 0 12px rgba(255,100,40,0.5)",
            }}>{masked}</div>
          </div>

          {/* Bottom row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,150,80,0.5)", letterSpacing: "0.1em", marginBottom: "2px" }}>CARD HOLDER</div>
              <div style={{ color: "#e0c0a0", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em" }}>
                {displayName.toUpperCase().slice(0, 22)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,150,80,0.5)", letterSpacing: "0.1em", marginBottom: "2px" }}>EXPIRES</div>
              <div style={{ color: "#e0c0a0", fontSize: "0.85rem", fontWeight: 600 }}>{displayExpiry}</div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #1a0a02, #3a1200)",
          border: "1px solid rgba(255,96,48,0.25)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}>
          <div style={{ background: "#111", height: "44px", marginTop: "30px" }} />
          <div style={{ padding: "16px 24px" }}>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,150,80,0.5)", marginBottom: "6px" }}>CVV</div>
            <div style={{
              background: "rgba(255,255,255,0.9)", borderRadius: "4px",
              padding: "8px 14px", color: "#111",
              fontFamily: "'Courier New', monospace", fontSize: "1rem",
              letterSpacing: "0.3em", textAlign: "right",
            }}>
              {cardData.cvv ? "•".repeat(cardData.cvv.length) : "•••"}
            </div>
            <div style={{ textAlign: "right", marginTop: "16px", color: "#fff", ...cardBrand.style }}>
              {cardBrand.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Checkout ─────────────────────────────────────────────────────────────
export default function Checkout() {
  const totals   = useMemo(() => cartTotals(), []);
  const items    = useMemo(() => loadCart(), []);
  const { authTokens, user, updateToken } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile]             = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [loading, setLoading]             = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [step, setStep]                   = useState(1); // 1=livrare, 2=card
  const [cardFlipped, setCardFlipped]     = useState(false);
  const [cardProcessing, setCardProcessing] = useState(false);
  const [cardError, setCardError]         = useState("");

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "",
    address: "", city: "", county: "", zip: "", country: "",
    paymentMethod: "ramburs",
  });

  const [cardData, setCardData] = useState({
    number: "", name: "", expiry: "", cvv: "",
  });

  useEffect(() => {
    if (authTokens?.access) {
      fetch("/api/profiles/me/", {
        headers: { "Authorization": `Bearer ${authTokens.access}`, "Content-Type": "application/json" },
      })
        .then(r => r.ok ? r.json() : null)
        .then(d => setProfile(d))
        .catch(() => {});
    }
  }, [authTokens]);

  const coupons = profile?.user_achievements?.filter(
    ua => !ua.is_redeemed && ua.achievement?.discount_percentage
  ) || [];

  const handleInput = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCardInput = e => {
    let { name, value } = e.target;
    if (name === "number")  value = formatCardNumber(value);
    if (name === "expiry")  value = value.replace(/\D/g, "").slice(0,4).replace(/(.{2})/, "$1/");
    if (name === "cvv")     value = value.replace(/\D/g, "").slice(0, 4);
    setCardData({ ...cardData, [name]: value });
    setCardError("");
  };

  // Step 1 → Step 2 sau submit direct
  const handleStep1 = e => {
    e.preventDefault();
    if (items.length === 0) return toast.warning("Coșul este gol!");
    if (formData.paymentMethod === "card") {
      setCardData(d => ({ ...d, name: formData.fullName.toUpperCase() }));
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      submitOrder();
    }
  };

  // Validare card + submit cu processing animation
  const handleCardPayment = async e => {
    e.preventDefault();
    const rawNum = cardData.number.replace(/\s/g, "");
    if (rawNum.length < 16)        return setCardError("Numărul cardului este incomplet.");
    if (!luhn(rawNum))             return setCardError("Numărul cardului este invalid.");
    if (cardData.expiry.length < 5) return setCardError("Data expirării incompletă.");
    if (cardData.cvv.length < 3)   return setCardError("CVV-ul este incomplet.");

    const [mm, yy] = cardData.expiry.split("/");
    const expDate = new Date(2000 + parseInt(yy), parseInt(mm) - 1);
    if (expDate < new Date()) return setCardError("Cardul este expirat.");

    setCardProcessing(true);
    setCardError("");

    // Simulare procesare plată (2.5s)
    await new Promise(r => setTimeout(r, 2500));
    setCardProcessing(false);
    await submitOrder();
  };

  const submitOrder = async () => {
    setLoading(true);
    const payload = {
      customer: {
        fullName: formData.fullName, email: formData.email,
        phone: formData.phone, address: formData.address,
        city: formData.city, county: formData.county,
        zip: formData.zip, country: formData.country,
        paymentMethod: formData.paymentMethod,
      },
      items: items.map(i => ({ id: i.id, qty: i.qty })),
      coupon_id: selectedCoupon ? parseInt(selectedCoupon) : null,
    };

    const send = async (tokens) => fetch("/api/checkout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(tokens ? { "Authorization": `Bearer ${tokens.access}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    try {
      let res = await send(authTokens);
      let data = await res.json();
      if (res.status === 401 && authTokens) {
        const refreshed = await updateToken();
        if (refreshed) {
          const newT = JSON.parse(localStorage.getItem("authTokens"));
          res = await send(newT);
          data = await res.json();
        }
      }
      if (res.ok) {
        clearCart();
        trackPurchase(data.order_number, data.total_paid);
        setOrderSuccessData(data);
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        toast.error(`❌ ${data.error || "Eroare la plasarea comenzii."}`);
      }
    } catch {
      toast.error("❌ Eroare de rețea.");
    } finally {
      setLoading(false);
    }
  };

  // ── SUCCESS PAGE ────────────────────────────────────────────────────────────
  if (orderSuccessData) {
    const d = orderSuccessData;
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
        <div style={{
          width: "100%", maxWidth: "560px",
          background: "linear-gradient(160deg, #1a0800, #0d0503)",
          border: "1px solid rgba(255,96,48,0.2)",
          borderTop: "3px solid #ff6030",
          borderRadius: "16px", padding: "2.5rem",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(255,60,20,0.06)",
        }}>
          {/* Icon */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(255,96,48,0.1)",
              border: "2px solid #ff6030",
              fontSize: "2rem", marginBottom: "1rem",
            }}>🤘</div>
            <h2 style={{ color: "#fff", fontFamily: "'Cinzel', serif", margin: 0, fontSize: "1.5rem" }}>
              Comandă Confirmată!
            </h2>
            <p style={{ color: "rgba(255,180,120,0.6)", margin: "0.4rem 0 0", fontSize: "0.88rem" }}>
              Mulțumim, <strong style={{ color: "#ffb080" }}>{d.customer}</strong>!
            </p>
          </div>

          {/* Receipt */}
          <div style={{
            background: "rgba(0,0,0,0.3)", borderRadius: "10px",
            border: "1px solid rgba(255,96,48,0.1)", padding: "1.2rem 1.4rem",
            marginBottom: "1.4rem",
          }}>
            {[
              ["Nr. Comandă", d.order_number, "#ff7040"],
              ["Status", "✓ Confirmat", "#34d399"],
              ["Data", d.date, "#c0d0e0"],
            ].map(([lbl, val, col]) => (
              <div key={lbl} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ color: "rgba(255,150,80,0.5)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{lbl}</span>
                <span style={{ color: col, fontWeight: 700, fontSize: "0.9rem" }}>{val}</span>
              </div>
            ))}

            {/* AWB */}
            <div style={{
              marginTop: "1rem", padding: "1rem",
              background: "rgba(255,96,48,0.06)", borderRadius: "8px",
              border: "1px dashed rgba(255,96,48,0.2)", textAlign: "center",
            }}>
              <div style={{ fontSize: "0.68rem", color: "rgba(255,150,80,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                📦 AWB Tracking — {d.courier}
              </div>
              <div style={{
                fontFamily: "'Courier New', monospace", fontSize: "1.3rem",
                color: "#ff7040", fontWeight: 700, letterSpacing: "0.1em",
                textShadow: "0 0 20px rgba(255,80,20,0.5)",
              }}>{d.awb_number}</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,150,80,0.4)", marginTop: "4px" }}>
                Estimat livrare: 24-48h lucrătoare
              </div>
            </div>
          </div>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", padding: "0.8rem 1.2rem", background: "rgba(255,96,48,0.06)", borderRadius: "8px" }}>
            <span style={{ color: "rgba(255,150,80,0.7)", fontSize: "0.85rem" }}>
              {d.discount_amount > 0 && <span style={{ color: "#34d399", marginRight: "8px" }}>-{d.discount_amount.toFixed(2)} € reducere aplicat</span>}
              Total plătit
            </span>
            <strong style={{ color: "#fff", fontSize: "1.2rem" }}>{d.total_paid.toFixed(2)} €</strong>
          </div>

          {d.xp_gained > 0 && (
            <div style={{ textAlign: "center", marginBottom: "1.2rem", color: "#f0c040", fontSize: "0.85rem", fontWeight: 600 }}>
              ★ +{d.xp_gained} XP acumulat în cont
            </div>
          )}

          <button onClick={() => navigate("/")} style={{
            width: "100%", padding: "13px", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, #ff5520, #cc2200)",
            color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
            boxShadow: "0 0 30px rgba(255,60,20,0.4)",
          }}>
            Înapoi la Magazin →
          </button>

          <p style={{ textAlign: "center", color: "rgba(255,150,80,0.35)", fontSize: "0.72rem", marginTop: "1rem" }}>
            Email de confirmare trimis la <strong>{d.email}</strong>
          </p>
        </div>
      </div>
    );
  }

  // ── CARD STEP ───────────────────────────────────────────────────────────────
  if (step === 2) {
    const total = totals.total;
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>
          <button onClick={() => setStep(1)} style={{
            background: "none", border: "none", color: "rgba(255,150,80,0.5)",
            fontSize: "0.82rem", cursor: "pointer", marginBottom: "1.2rem",
            display: "flex", alignItems: "center", gap: "6px",
          }}>← Înapoi la livrare</button>

          <CreditCard cardData={cardData} flipped={cardFlipped} />

          <div style={{
            background: "linear-gradient(160deg, #1a0800, #0d0503)",
            border: "1px solid rgba(255,96,48,0.2)",
            borderTop: "3px solid #ff6030",
            borderRadius: "14px", padding: "2rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}>
            <h3 style={{ color: "#ff8050", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 1.4rem", fontWeight: 700 }}>
              🔒 Plată Securizată cu Card
            </h3>

            <form onSubmit={handleCardPayment}>
              {/* Card number */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={lbl}>Număr card</label>
                <input
                  name="number" value={cardData.number}
                  onChange={handleCardInput} onFocus={() => setCardFlipped(false)}
                  placeholder="1234 5678 9012 3456"
                  style={{ ...inp, fontFamily: "'Courier New', monospace", fontSize: "1.05rem", letterSpacing: "0.1em" }}
                  inputMode="numeric" autoComplete="cc-number"
                />
              </div>

              {/* Name */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={lbl}>Titular card</label>
                <input
                  name="name" value={cardData.name}
                  onChange={handleCardInput} onFocus={() => setCardFlipped(false)}
                  placeholder="NUME PRENUME"
                  style={{ ...inp, textTransform: "uppercase" }}
                  autoComplete="cc-name"
                />
              </div>

              {/* Expiry + CVV */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.4rem" }}>
                <div>
                  <label style={lbl}>Expiră (LL/AA)</label>
                  <input
                    name="expiry" value={cardData.expiry}
                    onChange={handleCardInput} onFocus={() => setCardFlipped(false)}
                    placeholder="MM/YY"
                    style={inp} inputMode="numeric" autoComplete="cc-exp"
                  />
                </div>
                <div>
                  <label style={lbl}>CVV</label>
                  <input
                    name="cvv" value={cardData.cvv}
                    onChange={handleCardInput}
                    onFocus={() => setCardFlipped(true)}
                    onBlur={() => setCardFlipped(false)}
                    placeholder="•••"
                    style={{ ...inp, letterSpacing: "0.3em" }}
                    inputMode="numeric" autoComplete="cc-csc"
                  />
                </div>
              </div>

              {cardError && (
                <div style={{ color: "#ff4444", fontSize: "0.82rem", marginBottom: "1rem", background: "rgba(255,0,0,0.07)", padding: "8px 12px", borderRadius: "6px", border: "1px solid rgba(255,0,0,0.15)" }}>
                  ⚠ {cardError}
                </div>
              )}

              <button type="submit" disabled={cardProcessing} style={{
                width: "100%", padding: "15px", border: "none", borderRadius: "8px",
                background: cardProcessing
                  ? "linear-gradient(135deg, #5a2010, #3a1000)"
                  : "linear-gradient(135deg, #ff5520, #cc2200)",
                color: "#fff", fontWeight: 700, fontSize: "1rem",
                cursor: cardProcessing ? "not-allowed" : "pointer",
                boxShadow: cardProcessing ? "none" : "0 0 40px rgba(255,60,20,0.45)",
                transition: "all 0.3s", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "10px",
              }}>
                {cardProcessing ? (
                  <>
                    <span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin360 0.8s linear infinite" }} />
                    Se procesează plata...
                  </>
                ) : (
                  `🔒 Plătește ${total.toFixed(2)} €`
                )}
              </button>

              <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "1rem", opacity: 0.4 }}>
                {["VISA", "MC", "AMEX"].map(b => (
                  <span key={b} style={{ fontSize: "0.65rem", border: "1px solid rgba(255,150,80,0.3)", padding: "2px 8px", borderRadius: "3px", color: "rgba(255,150,80,0.7)", fontWeight: 700 }}>{b}</span>
                ))}
                <span style={{ fontSize: "0.65rem", color: "rgba(255,150,80,0.5)" }}>🔒 SSL Encrypted</span>
              </div>
            </form>
          </div>
        </div>

        <style>{`@keyframes spin360 { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── STEP 1: LIVRARE ─────────────────────────────────────────────────────────
  return (
    <div className="container py-5 page-checkout">
      <header className="mb-4">
        <p className="section-title mb-1">Finalizare</p>
        <h1 className="h4 text-white mb-0">Checkout</h1>
      </header>

      {items.length === 0 && (
        <div className="alert alert-info">Coșul este gol. <Link to="/products">Înapoi la produse</Link></div>
      )}

      {items.length > 0 && (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="surface-card p-4">
              <h5 className="mb-3 text-white">Date de livrare</h5>
              <form onSubmit={handleStep1} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nume complet</label>
                  <input type="text" name="fullName" className="form-control" required value={formData.fullName} onChange={handleInput} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleInput} />
                </div>
                <div className="col-12">
                  <label className="form-label">Telefon</label>
                  <input type="text" name="phone" className="form-control" placeholder="07xx xxx xxx" required value={formData.phone} onChange={handleInput} />
                </div>
                <div className="col-12">
                  <label className="form-label">Adresă</label>
                  <input type="text" name="address" className="form-control" required value={formData.address} onChange={handleInput} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Oraș</label>
                  <input type="text" name="city" className="form-control" required value={formData.city} onChange={handleInput} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Județ</label>
                  <input type="text" name="county" className="form-control" required value={formData.county} onChange={handleInput} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Cod poștal</label>
                  <input type="text" name="zip" className="form-control" required value={formData.zip} onChange={handleInput} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Țară</label>
                  <input type="text" name="country" className="form-control" required value={formData.country} onChange={handleInput} />
                </div>

                {/* Metodă plată */}
                <div className="col-12 mt-3">
                  <label className="form-label">Metodă de plată</label>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {[
                      { value: "ramburs", label: "💵 Ramburs (la livrare)", desc: "Plătești când primești coletul" },
                      { value: "card",    label: "💳 Card Online",           desc: "Visa, Mastercard, Amex" },
                    ].map(opt => (
                      <label key={opt.value} style={{
                        flex: "1 1 200px", cursor: "pointer",
                        padding: "14px 18px", borderRadius: "10px",
                        border: `2px solid ${formData.paymentMethod === opt.value ? "#ff6030" : "rgba(255,255,255,0.1)"}`,
                        background: formData.paymentMethod === opt.value ? "rgba(255,96,48,0.08)" : "rgba(255,255,255,0.02)",
                        transition: "all 0.25s",
                      }}>
                        <input type="radio" name="paymentMethod" value={opt.value}
                          checked={formData.paymentMethod === opt.value}
                          onChange={handleInput} style={{ display: "none" }} />
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>{opt.label}</div>
                        <div style={{ color: "rgba(255,150,80,0.5)", fontSize: "0.75rem", marginTop: "3px" }}>{opt.desc}</div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cupoane */}
                {coupons.length > 0 && (
                  <div className="col-12 mt-3">
                    <label className="form-label" style={{ color: "#f0c040" }}>★ Cupon Achievement</label>
                    <select className="form-select bg-dark text-white border-secondary"
                      value={selectedCoupon} onChange={e => setSelectedCoupon(e.target.value)}
                      style={{ borderLeft: "4px solid #ff6030" }}>
                      <option value="">-- Fără cupon --</option>
                      {coupons.map(ua => (
                        <option key={ua.achievement.id} value={ua.achievement.id}>
                          {ua.achievement.name} (-{ua.achievement.discount_percentage}%)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="col-12 d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary px-4 py-2" disabled={loading} style={{
                    background: "linear-gradient(135deg, #ff5520, #cc2200)", border: "none",
                    boxShadow: "0 0 25px rgba(255,60,20,0.35)",
                  }}>
                    {loading ? "Se procesează..." : formData.paymentMethod === "card" ? "Continuă spre plată →" : "✓ Plasează comanda"}
                  </button>
                  <button type="button" className="btn btn-outline-light px-4 py-2"
                    onClick={() => { if (window.confirm("Anulezi comanda?")) { clearCart(); navigate("/"); window.dispatchEvent(new Event("cart-updated")); } }}>
                    Anulează
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="surface-card p-4 h-100">
              <h5 className="mb-3 text-white border-bottom pb-2" style={{ borderColor: "rgba(255,96,48,0.2) !important" }}>Rezumat Comandă</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="opacity-75">Subtotal</span>
                <strong>{totals.subtotal.toFixed(2)} €</strong>
              </div>
              <div className="my-3">
                <p className="small text-uppercase fw-bold opacity-50 mb-2">Articole</p>
                {items.map(i => (
                  <div key={i.id} className="d-flex justify-content-between small mb-1">
                    <span className="text-truncate me-2" style={{ maxWidth: "150px" }}>{i.name}</span>
                    <span className="opacity-50">×{i.qty || 1}</span>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                <span className="text-white">Total</span>
                <strong className="text-white fs-5">{totals.total.toFixed(2)} €</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stiluri shared ────────────────────────────────────────────────────────────
const lbl = {
  display: "block", marginBottom: "6px",
  fontSize: "0.75rem", color: "rgba(255,150,80,0.6)",
  textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
};
const inp = {
  width: "100%", padding: "11px 14px", borderRadius: "8px",
  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,96,48,0.2)",
  color: "#fff", fontSize: "0.92rem", outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};
