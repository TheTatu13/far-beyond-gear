import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const STATUS_COLORS = {
  pending:   "#f0c040",
  confirmed: "#66c0f4",
  shipped:   "#34d399",
  delivered: "#a78bfa",
  cancelled: "#ef4444",
};
const STATUS_LABELS = {
  pending: "În așteptare", confirmed: "Confirmat",
  shipped: "Expediat",    delivered: "Livrat", cancelled: "Anulat",
};

// ─── helpers ─────────────────────────────────────────────────────────────────
function useAdminApi(token) {
  const headers = { Authorization: `Bearer ${token}` };

  const get  = (path) => axios.get(`${API}${path}`, { headers }).then(r => r.data);
  const del  = (path) => axios.delete(`${API}${path}`, { headers });
  const patch = (path, data) => axios.patch(`${API}${path}`, data, { headers }).then(r => r.data);
  const post  = (path, data) => axios.post(`${API}${path}`, data, { headers }).then(r => r.data);
  const put   = (path, data) => axios.put(`${API}${path}`, data, { headers }).then(r => r.data);

  return { get, del, patch, post, put };
}

// ─── stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color = "#ff6030", sub }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #1a0a04, #120704)",
      border: `1px solid ${color}22`,
      borderTop: `3px solid ${color}`,
      borderRadius: "10px", padding: "1.4rem 1.6rem",
      minWidth: "160px", flex: "1 1 160px",
    }}>
      <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontSize: "1.9rem", fontWeight: 800, color, fontFamily: "'Cinzel',serif", lineHeight: 1 }}>
        {value ?? "—"}
      </div>
      <div style={{ fontSize: "0.72rem", color: "#8a7060", marginTop: "0.3rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: "0.68rem", color: "#ff6030", marginTop: "0.2rem" }}>{sub}</div>}
    </div>
  );
}

// ─── confirm modal ────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#1a0a04", border:"1px solid rgba(255,80,20,0.3)", borderRadius:"12px", padding:"2rem", maxWidth:"380px", width:"90%", textAlign:"center" }}>
        <div style={{ fontSize:"2rem", marginBottom:"0.8rem" }}>⚠️</div>
        <p style={{ color:"#d4c0a8", marginBottom:"1.5rem", lineHeight:1.5 }}>{message}</p>
        <div style={{ display:"flex", gap:"0.8rem", justifyContent:"center" }}>
          <button onClick={onCancel} style={{ padding:"10px 24px", borderRadius:"6px", border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#8a7060", cursor:"pointer", fontWeight:600 }}>
            Anulează
          </button>
          <button onClick={onConfirm} style={{ padding:"10px 24px", borderRadius:"6px", border:"none", background:"linear-gradient(135deg,#ff4010,#cc2000)", color:"#fff", cursor:"pointer", fontWeight:700 }}>
            Confirmă
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── product modal ────────────────────────────────────────────────────────────
function ProductModal({ product, brands, categories, token, onClose, onSaved }) {
  const api = useAdminApi(token);
  const isEdit = !!product?.id;
  const [form, setForm] = useState({
    name: product?.name || "",
    brand: product?.brand?.id || product?.brand || "",
    price: product?.price || "",
    stock: product?.stock || "",
    description: product?.description || "",
    categories: product?.categories?.map(c => c.id || c) || [],
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const toggle = (id) => setForm(f => ({
    ...f,
    categories: f.categories.includes(id)
      ? f.categories.filter(c => c !== id)
      : [...f.categories, id],
  }));

  const save = async () => {
    setSaving(true); setErr("");
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (isEdit) await api.put(`/api/products/${product.id}/`, payload);
      else         await api.post(`/api/products/`, payload);
      onSaved();
      onClose();
    } catch (e) {
      setErr(e.response?.data ? JSON.stringify(e.response.data) : "Eroare la salvare");
    } finally { setSaving(false); }
  };

  const inp = {
    background: "#0c0804", border: "1px solid rgba(255,100,30,0.2)",
    color: "#d4c0a8", borderRadius: "6px", padding: "10px 14px",
    fontSize: "0.9rem", width: "100%", outline: "none",
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div style={{ background:"#130d08", border:"1px solid rgba(255,80,20,0.25)", borderTop:"3px solid #ff6030", borderRadius:"12px", padding:"2rem", width:"100%", maxWidth:"520px", maxHeight:"90vh", overflowY:"auto" }}>
        <h3 style={{ color:"#ff6030", fontFamily:"'Cinzel',serif", margin:"0 0 1.5rem", fontSize:"1.1rem" }}>
          {isEdit ? "✏️ Editează Produs" : "➕ Produs Nou"}
        </h3>

        <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
          <input style={inp} placeholder="Nume produs" value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))} />

          <select style={inp} value={form.brand} onChange={e => setForm(f=>({...f, brand:e.target.value}))}>
            <option value="">— Alege brand —</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          <div style={{ display:"flex", gap:"0.8rem" }}>
            <input style={inp} placeholder="Preț (€)" type="number" value={form.price} onChange={e => setForm(f=>({...f, price:e.target.value}))} />
            <input style={inp} placeholder="Stoc" type="number" value={form.stock} onChange={e => setForm(f=>({...f, stock:e.target.value}))} />
          </div>

          <textarea style={{...inp, minHeight:"80px", resize:"vertical"}} placeholder="Descriere" value={form.description} onChange={e => setForm(f=>({...f, description:e.target.value}))} />

          <div>
            <div style={{ color:"#8a7060", fontSize:"0.72rem", marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Categorii</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
              {categories.map(c => (
                <button key={c.id} onClick={() => toggle(c.id)} style={{
                  padding:"4px 12px", borderRadius:"999px", fontSize:"0.75rem", cursor:"pointer",
                  background: form.categories.includes(c.id) ? "#ff6030" : "transparent",
                  border: `1px solid ${form.categories.includes(c.id) ? "#ff6030" : "rgba(255,100,30,0.2)"}`,
                  color: form.categories.includes(c.id) ? "#fff" : "#8a7060",
                }}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {err && <div style={{ color:"#ef4444", fontSize:"0.8rem" }}>{err}</div>}

          <div style={{ display:"flex", gap:"0.8rem", marginTop:"0.5rem" }}>
            <button onClick={onClose} style={{ flex:1, padding:"11px", borderRadius:"6px", border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#8a7060", cursor:"pointer", fontWeight:600 }}>
              Anulează
            </button>
            <button onClick={save} disabled={saving} style={{ flex:2, padding:"11px", borderRadius:"6px", border:"none", background:"linear-gradient(135deg,#ff6030,#cc2800)", color:"#fff", cursor:"pointer", fontWeight:700 }}>
              {saving ? "Se salvează..." : isEdit ? "Salvează" : "Adaugă Produs"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminPanel() {
  const { user, authTokens } = useAuth();
  const navigate = useNavigate();
  const token = authTokens?.access;
  const api = useAdminApi(token);

  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  // Data
  const [overview, setOverview]   = useState(null);
  const [products, setProducts]   = useState([]);
  const [orders,   setOrders]     = useState([]);
  const [users,    setUsers]      = useState([]);
  const [reviews,  setReviews]    = useState([]);
  const [brands,   setBrands]     = useState([]);
  const [categories, setCategories] = useState([]);

  // UI state
  const [confirm, setConfirm]     = useState(null); // { message, onConfirm }
  const [prodModal, setProdModal] = useState(null); // null | {} | product obj
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast]         = useState("");

  // Auth guard
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!user.is_staff) { navigate("/"); return; }
  }, [user]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Load on tab change
  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      if (tab === "overview") {
        const [ov, br, cat] = await Promise.all([
          api.get("/api/admin/overview/"),
          api.get("/api/brands/?page_size=100"),
          api.get("/api/categories/?page_size=100"),
        ]);
        setOverview(ov);
        setBrands(br.results || br);
        setCategories(cat.results || cat);
      }
      else if (tab === "products") {
        const [prods, br, cat] = await Promise.all([
          api.get("/api/products/?page_size=100&ordering=name"),
          api.get("/api/brands/?page_size=100"),
          api.get("/api/categories/?page_size=100"),
        ]);
        setProducts(prods.results || prods);
        setBrands(br.results || br);
        setCategories(cat.results || cat);
      }
      else if (tab === "orders")  { setOrders(await api.get("/api/admin/orders/")); }
      else if (tab === "users")   { setUsers(await api.get("/api/admin/users/")); }
      else if (tab === "reviews") { setReviews(await api.get("/api/admin/reviews/")); }
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }, [tab, token]);

  useEffect(() => { load(); }, [load]);

  // ── Styles ────────────────────────────────────────────────────────────────
  const tableHead = { background: "#0e0906", borderBottom: "2px solid rgba(255,80,20,0.15)" };
  const th = { padding:"10px 14px", color:"#8a7060", fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:700, whiteSpace:"nowrap" };
  const td = { padding:"12px 14px", color:"#d4c0a8", fontSize:"0.85rem", borderBottom:"1px solid rgba(255,100,30,0.06)", verticalAlign:"middle" };
  const actionBtn = (color="#ff6030") => ({
    padding:"4px 12px", borderRadius:"4px", border:`1px solid ${color}44`,
    background:`${color}11`, color, fontSize:"0.72rem", fontWeight:700,
    cursor:"pointer", transition:"all 0.2s",
  });
  const inp = { background:"#0c0804", border:"1px solid rgba(255,100,30,0.2)", color:"#d4c0a8", borderRadius:"6px", padding:"8px 12px", fontSize:"0.85rem", outline:"none" };

  const TABS = [
    { id:"overview", label:"Dashboard",    icon:"📊" },
    { id:"products", label:"Produse",      icon:"🎸" },
    { id:"orders",   label:"Comenzi",      icon:"📦" },
    { id:"users",    label:"Utilizatori",  icon:"👥" },
    { id:"reviews",  label:"Review-uri",   icon:"⭐" },
  ];

  // ── Filters ───────────────────────────────────────────────────────────────
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.name?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredOrders = orders.filter(o => {
    const matchSearch = search === "" ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredReviews = reviews.filter(r =>
    r.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Delete helpers ────────────────────────────────────────────────────────
  const deleteProduct = (p) => setConfirm({
    message: `Ștergi produsul "${p.name}"? Acțiunea este ireversibilă.`,
    onConfirm: async () => {
      await api.del(`/api/products/${p.id}/`);
      setConfirm(null); load(); showToast("Produs șters.");
    },
  });

  const deleteUser = (u) => setConfirm({
    message: `Ștergi utilizatorul "${u.username}"? Toate datele sale vor fi pierdute.`,
    onConfirm: async () => {
      await api.del(`/api/admin/users/${u.id}/`);
      setConfirm(null); load(); showToast("Utilizator șters.");
    },
  });

  const deleteReview = (r) => setConfirm({
    message: `Ștergi review-ul lui ${r.user} pentru "${r.product_name}"?`,
    onConfirm: async () => {
      await api.del(`/api/admin/reviews/${r.id}/`);
      setConfirm(null); load(); showToast("Review șters.");
    },
  });

  const toggleActive = async (u) => {
    await api.patch(`/api/admin/users/${u.id}/`, { is_active: !u.is_active });
    load(); showToast(`Utilizator ${!u.is_active ? "activat" : "dezactivat"}.`);
  };

  const changeOrderStatus = async (o, status) => {
    await api.patch(`/api/admin/orders/${o.id}/status/`, { status });
    load(); showToast("Status actualizat.");
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0c0804", fontFamily:"'DM Sans','Inter',sans-serif" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{
        width:"230px", flexShrink:0,
        background:"linear-gradient(180deg, #110704 0%, #0c0502 100%)",
        borderRight:"1px solid rgba(255,80,20,0.12)",
        display:"flex", flexDirection:"column", padding:"0",
        position:"sticky", top:0, height:"100vh", overflowY:"auto",
      }}>
        {/* Logo */}
        <div style={{ padding:"1.8rem 1.5rem 1.2rem", borderBottom:"1px solid rgba(255,80,20,0.1)" }}>
          <div style={{ fontFamily:"'Cinzel',serif", color:"#ff6030", fontSize:"1.1rem", fontWeight:900, letterSpacing:"0.08em", lineHeight:1.1 }}>
            FAR BEYOND
          </div>
          <div style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:"0.72rem", letterSpacing:"0.3em", marginTop:"2px" }}>
            ADMIN PANEL
          </div>
          <div style={{ marginTop:"0.6rem", fontSize:"0.68rem", color:"#8a7060" }}>
            👤 {user?.username}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"1rem 0.8rem" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch(""); setStatusFilter("all"); }}
              style={{
                display:"flex", alignItems:"center", gap:"10px",
                width:"100%", padding:"10px 12px", marginBottom:"4px",
                borderRadius:"8px", border:"none", cursor:"pointer",
                background: tab===t.id ? "rgba(255,80,20,0.12)" : "transparent",
                color: tab===t.id ? "#ff6030" : "#8a7060",
                fontWeight: tab===t.id ? 700 : 500, fontSize:"0.88rem",
                borderLeft: tab===t.id ? "3px solid #ff6030" : "3px solid transparent",
                transition:"all 0.2s", textAlign:"left",
              }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        <div style={{ padding:"1rem 1.5rem", borderTop:"1px solid rgba(255,80,20,0.08)" }}>
          <button onClick={() => navigate("/")} style={{ width:"100%", padding:"9px", borderRadius:"6px", border:"1px solid rgba(255,80,20,0.15)", background:"transparent", color:"#8a7060", fontSize:"0.8rem", cursor:"pointer" }}>
            ← Înapoi la site
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main style={{ flex:1, padding:"2rem", overflowX:"auto" }}>

        {/* Toast */}
        {toast && (
          <div style={{ position:"fixed", top:"1.5rem", right:"1.5rem", zIndex:999, background:"#1a0a04", border:"1px solid #ff6030", borderRadius:"8px", padding:"12px 20px", color:"#ff9940", fontWeight:600, fontSize:"0.85rem", boxShadow:"0 10px 30px rgba(0,0,0,0.5)" }}>
            ✓ {toast}
          </div>
        )}

        {/* Modals */}
        {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
        {prodModal !== null && (
          <ProductModal
            product={prodModal || null}
            brands={brands} categories={categories} token={token}
            onClose={() => setProdModal(null)}
            onSaved={() => { load(); showToast("Produs salvat."); }}
          />
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display:"flex", alignItems:"center", gap:"12px", color:"#8a7060", padding:"2rem" }}>
            <div style={{ width:"24px", height:"24px", border:"2px solid rgba(255,80,20,0.2)", borderTop:"2px solid #ff6030", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
            Se încarcă...
          </div>
        )}

        {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
        {!loading && tab === "overview" && overview && (
          <div>
            <h2 style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:"1.3rem", margin:"0 0 1.8rem" }}>
              📊 Dashboard
            </h2>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem", marginBottom:"2rem" }}>
              <StatCard icon="🎸" label="Produse totale"    value={overview.total_products} color="#ff6030" />
              <StatCard icon="📦" label="Comenzi totale"    value={overview.total_orders}   color="#ffaa00"
                sub={`${overview.pending_orders} în așteptare`} />
              <StatCard icon="👥" label="Utilizatori"       value={overview.total_users}    color="#34d399" />
              <StatCard icon="💰" label="Venituri (conf.)"  value={`${overview.total_revenue.toFixed(0)} €`} color="#a78bfa" />
              <StatCard icon="⭐" label="Review-uri"        value={overview.total_reviews}  color="#f0c040" />
              <StatCard icon="🚫" label="Epuizate"          value={overview.out_of_stock}   color="#ef4444" />
            </div>

            <div style={{ background:"#130d08", border:"1px solid rgba(255,80,20,0.1)", borderRadius:"10px", padding:"1.5rem" }}>
              <div style={{ color:"#8a7060", fontSize:"0.72rem", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"1rem" }}>
                Acțiuni rapide
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.8rem" }}>
                {[
                  { label:"➕ Produs nou",      action:() => { setTab("products"); setProdModal({}); } },
                  { label:"📦 Vezi comenzi",    action:() => setTab("orders") },
                  { label:"👥 Utilizatori",     action:() => setTab("users") },
                  { label:"⭐ Review-uri",      action:() => setTab("reviews") },
                ].map((b,i) => (
                  <button key={i} onClick={b.action} style={{ padding:"10px 18px", borderRadius:"6px", border:"1px solid rgba(255,80,20,0.2)", background:"rgba(255,80,20,0.06)", color:"#ff9040", cursor:"pointer", fontWeight:600, fontSize:"0.84rem" }}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ──────────────────────────────────────────────────── */}
        {!loading && tab === "products" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
              <h2 style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:"1.3rem", margin:0 }}>🎸 Produse</h2>
              <div style={{ display:"flex", gap:"0.8rem", alignItems:"center", flexWrap:"wrap" }}>
                <input style={inp} placeholder="Caută produs..." value={search} onChange={e=>setSearch(e.target.value)} />
                <button onClick={() => setProdModal({})} style={{ padding:"9px 20px", borderRadius:"6px", border:"none", background:"linear-gradient(135deg,#ff6030,#cc2800)", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:"0.85rem", whiteSpace:"nowrap" }}>
                  + Produs Nou
                </button>
              </div>
            </div>

            <div style={{ background:"#130d08", border:"1px solid rgba(255,80,20,0.1)", borderRadius:"10px", overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={tableHead}>
                      <th style={th}>ID</th><th style={th}>Produs</th><th style={th}>Brand</th>
                      <th style={th}>Preț</th><th style={th}>Stoc</th><th style={th}>Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id}>
                        <td style={{...td, color:"#8a7060"}}># {p.id}</td>
                        <td style={td}>
                          <div style={{ fontWeight:600, color:"#d4c0a8" }}>{p.name}</div>
                        </td>
                        <td style={{...td, color:"#8a7060"}}>{p.brand?.name || "—"}</td>
                        <td style={{...td, color:"#ffaa50", fontWeight:700}}>{parseFloat(p.price||0).toFixed(2)} €</td>
                        <td style={td}>
                          <span style={{ color: p.stock > 5 ? "#34d399" : p.stock > 0 ? "#f0c040" : "#ef4444", fontWeight:700 }}>
                            {p.stock}
                          </span>
                        </td>
                        <td style={td}>
                          <div style={{ display:"flex", gap:"6px" }}>
                            <button onClick={() => setProdModal(p)} style={actionBtn("#66c0f4")}>Editează</button>
                            <button onClick={() => deleteProduct(p)} style={actionBtn("#ef4444")}>Șterge</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr><td colSpan={6} style={{...td, textAlign:"center", color:"#8a7060", padding:"2rem"}}>Niciun produs găsit.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ────────────────────────────────────────────────────── */}
        {!loading && tab === "orders" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
              <h2 style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:"1.3rem", margin:0 }}>📦 Comenzi</h2>
              <div style={{ display:"flex", gap:"0.8rem", flexWrap:"wrap" }}>
                <input style={inp} placeholder="Caută comandă..." value={search} onChange={e=>setSearch(e.target.value)} />
                <select style={inp} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                  <option value="all">Toate statusurile</option>
                  {Object.entries(STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ background:"#130d08", border:"1px solid rgba(255,80,20,0.1)", borderRadius:"10px", overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={tableHead}>
                      <th style={th}>Comandă</th><th style={th}>Client</th><th style={th}>Total</th>
                      <th style={th}>Plată</th><th style={th}>Status</th><th style={th}>Data</th><th style={th}>Schimbă status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.id}>
                        <td style={{...td, fontFamily:"monospace", color:"#ff9040"}}>{o.order_number}</td>
                        <td style={td}>
                          <div style={{ fontWeight:600 }}>{o.customer_name}</div>
                          <div style={{ fontSize:"0.72rem", color:"#8a7060" }}>{o.email}</div>
                        </td>
                        <td style={{...td, color:"#ffaa50", fontWeight:700}}>{o.total?.toFixed(2)} €</td>
                        <td style={{...td, color:"#8a7060", textTransform:"capitalize"}}>{o.payment_method}</td>
                        <td style={td}>
                          <span style={{ background:`${STATUS_COLORS[o.status]}22`, color:STATUS_COLORS[o.status], padding:"3px 10px", borderRadius:"4px", fontSize:"0.72rem", fontWeight:700 }}>
                            {STATUS_LABELS[o.status] || o.status}
                          </span>
                        </td>
                        <td style={{...td, color:"#8a7060", fontSize:"0.78rem"}}>{o.created_at}</td>
                        <td style={td}>
                          <select
                            value={o.status}
                            onChange={e => changeOrderStatus(o, e.target.value)}
                            style={{ ...inp, padding:"4px 8px", fontSize:"0.75rem" }}
                          >
                            {Object.entries(STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan={7} style={{...td, textAlign:"center", color:"#8a7060", padding:"2rem"}}>Nicio comandă găsită.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ─────────────────────────────────────────────────────── */}
        {!loading && tab === "users" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
              <h2 style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:"1.3rem", margin:0 }}>👥 Utilizatori</h2>
              <input style={inp} placeholder="Caută utilizator..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>

            <div style={{ background:"#130d08", border:"1px solid rgba(255,80,20,0.1)", borderRadius:"10px", overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={tableHead}>
                      <th style={th}>ID</th><th style={th}>Username</th><th style={th}>Email</th>
                      <th style={th}>Status</th><th style={th}>Rol</th><th style={th}>Înregistrat</th><th style={th}>Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td style={{...td, color:"#8a7060"}}>{u.id}</td>
                        <td style={{...td, fontWeight:600}}>{u.username}</td>
                        <td style={{...td, color:"#8a7060"}}>{u.email}</td>
                        <td style={td}>
                          <span style={{ color: u.is_active ? "#34d399" : "#ef4444", fontWeight:700, fontSize:"0.78rem" }}>
                            {u.is_active ? "✓ Activ" : "✗ Inactiv"}
                          </span>
                        </td>
                        <td style={td}>
                          <span style={{ color: u.is_staff ? "#a78bfa" : "#8a7060", fontSize:"0.75rem" }}>
                            {u.is_staff ? "Staff" : "User"}
                          </span>
                        </td>
                        <td style={{...td, color:"#8a7060", fontSize:"0.78rem"}}>{u.date_joined}</td>
                        <td style={td}>
                          <div style={{ display:"flex", gap:"6px" }}>
                            <button onClick={() => toggleActive(u)} style={actionBtn(u.is_active ? "#f0c040" : "#34d399")}>
                              {u.is_active ? "Dezactivează" : "Activează"}
                            </button>
                            <button onClick={() => deleteUser(u)} style={actionBtn("#ef4444")}>Șterge</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={7} style={{...td, textAlign:"center", color:"#8a7060", padding:"2rem"}}>Niciun utilizator găsit.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── REVIEWS ───────────────────────────────────────────────────── */}
        {!loading && tab === "reviews" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
              <h2 style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:"1.3rem", margin:0 }}>⭐ Review-uri</h2>
              <input style={inp} placeholder="Caută review..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>

            <div style={{ background:"#130d08", border:"1px solid rgba(255,80,20,0.1)", borderRadius:"10px", overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={tableHead}>
                      <th style={th}>Produs</th><th style={th}>User</th><th style={th}>Rating</th>
                      <th style={th}>Comentariu</th><th style={th}>Data</th><th style={th}>Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviews.map(r => (
                      <tr key={r.id}>
                        <td style={{...td, fontWeight:600, maxWidth:"180px"}}>
                          <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.product_name}</div>
                        </td>
                        <td style={{...td, color:"#8a7060"}}>{r.user}</td>
                        <td style={td}>
                          <span style={{ color:"#f0c040", letterSpacing:"2px" }}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                        </td>
                        <td style={{...td, color:"#8a7060", maxWidth:"260px"}}>
                          <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.comment}</div>
                        </td>
                        <td style={{...td, color:"#8a7060", fontSize:"0.78rem", whiteSpace:"nowrap"}}>{r.created_at}</td>
                        <td style={td}>
                          <button onClick={() => deleteReview(r)} style={actionBtn("#ef4444")}>Șterge</button>
                        </td>
                      </tr>
                    ))}
                    {filteredReviews.length === 0 && (
                      <tr><td colSpan={6} style={{...td, textAlign:"center", color:"#8a7060", padding:"2rem"}}>Niciun review găsit.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        select option { background: #130d08; color: #d4c0a8; }
      `}</style>
    </div>
  );
}
