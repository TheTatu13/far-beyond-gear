/**
 * analytics.js — Far Beyond Gear
 * Trimite evenimente de activitate la backend pentru stocare și statistici.
 * Silent fail: niciodată nu aruncă erori care ar strica UX-ul.
 */

const SESSION_KEY = "fbg_session_id";

function getSession() {
  let s = sessionStorage.getItem(SESSION_KEY);
  if (!s) {
    s = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, s);
  }
  return s;
}

async function track(event, payload = {}) {
  try {
    const token = localStorage.getItem("access_token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    await fetch("/api/track/", {
      method: "POST",
      headers,
      body: JSON.stringify({
        event,
        session: getSession(),
        page: window.location.pathname + window.location.search,
        ...payload,
      }),
    });
  } catch {
    // tracking nu trebuie să blocheze nimic
  }
}

// ── Helpers exportați ────────────────────────────────────────────────────────

/** Vizualizare pagină — apelat la fiecare schimbare de rută */
export const trackPageView = (page) =>
  track("page_view", { page: page || window.location.pathname });

/** Vizualizare produs individual */
export const trackProductView = (productId, productName) =>
  track("product_view", { product_id: productId, extra: { name: productName } });

/** Căutare — apelat când utilizatorul tastează în search */
export const trackSearch = (query) =>
  track("search", { query });

/** Adăugare în coș */
export const trackAddToCart = (productId, productName, price) =>
  track("add_to_cart", { product_id: productId, extra: { name: productName, price } });

/** Achiziție finalizată */
export const trackPurchase = (orderNumber, total) =>
  track("purchase", { extra: { order_number: orderNumber, total } });

/** Înregistrare cont nou */
export const trackRegister = () => track("register");

/** Autentificare */
export const trackLogin = () => track("login");
