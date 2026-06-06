import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getBrands, getCategories, getProducts, grantAchievement } from "../lib/api.js";
import { addToCart } from "../lib/cart.js";
import { Link } from "react-router-dom";
import { trackSearch, trackAddToCart } from "../lib/analytics.js";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const emptyFilters = {
  brand: "",
  min: "",
  max: "",
  search: ""
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authTokens } = useAuth();
  const token = authTokens?.access;
  const [brands, setBrands] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [filters, setFilters] = useState(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      brand: params.brand || "",
      categories: params.categories || "",
      min: params.min || "",
      max: params.max || "",
      search: params.search || ""
    };
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBrands()
      .then(setBrands)
      .catch((err) => setError(err.message || "Eroare la încărcarea brandurilor."));

    getCategories()
      .then(setCategoriesList)
      .catch((err) => console.error("Eroare categ:", err));
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilters({
      brand: params.brand || "",
      categories: params.categories || "",
      min: params.min || "",
      max: params.max || "",
      search: params.search || ""
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getProducts({
      brand: filters.brand || undefined,
      categories: filters.categories || undefined,
      min: filters.min || undefined,
      max: filters.max || undefined,
      search: filters.search || undefined,
      page_size: 100
    })
      .then((res) => {
        if (mounted) setItems(res);
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Eroare la încărcarea produselor.");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [filters]);

  const productStats = useMemo(() => {
    if (!items.length) return "0 produse";
    const prices = items.map((p) => Number(p.price || 0));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return `${items.length} produse | €${min.toFixed(2)} - €${max.toFixed(2)}`;
  }, [items]);

  return (
    <div className="container py-5">
      <div className="row g-4">
        <aside className="col-12 col-lg-3">
          <div className="surface-card p-4 filter-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 text-white">Tot filtre</h5>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setFilters(emptyFilters)}
              >
                Șterge
              </button>
            </div>

            <div className="mb-4">
              <label className="form-label text-white fw-semibold small mb-2">Brand</label>
              <select
                className="form-select filter-select"
                value={filters.brand}
                onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
              >
                <option value="">Toate brandurile</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <small className="text-muted d-block mt-1">Selectează brandul favorit</small>
            </div>

            <div className="mb-4">
              <label className="form-label text-white fw-semibold small mb-2">Categorie</label>
              <select
                className="form-select filter-select"
                value={filters.categories}
                onChange={(e) => setFilters((f) => ({ ...f, categories: e.target.value }))}
              >
                <option value="">Toate categoriile</option>
                {categoriesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <small className="text-muted d-block mt-1">Filtrează după topologie</small>
            </div>

            <div className="mb-4">
              <label className="form-label text-white fw-semibold small mb-2">Interval preț</label>
              <div className="d-flex gap-2 mb-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  className="form-control form-control-sm filter-input"
                  value={filters.min}
                  onChange={(e) => setFilters((f) => ({ ...f, min: e.target.value }))}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  className="form-control form-control-sm filter-input"
                  value={filters.max}
                  onChange={(e) => setFilters((f) => ({ ...f, max: e.target.value }))}
                />
              </div>
              <small className="text-muted">€ {filters.min || filters.max ? `${filters.min || 0} - ${filters.max || "∞"}` : "Orice"}</small>
            </div>

            <div className="mb-4">
              <label className="form-label text-white fw-semibold small mb-2">Căutare</label>
              <input
                type="text"
                placeholder="Caută produs..."
                className="form-control filter-input"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              />
            </div>

            <div className="d-grid gap-2">
              <button
                className="btn btn-primary fw-bold"
                onClick={() => {
                  const params = {};
                  if (filters.brand) params.brand = filters.brand;
                  if (filters.categories) params.categories = filters.categories;
                  if (filters.min) params.min = filters.min;
                  if (filters.max) params.max = filters.max;
                  if (filters.search) { params.search = filters.search; trackSearch(filters.search); }
                  setSearchParams(params);
                }}
              >
                Aplică filtre
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setFilters(emptyFilters);
                  navigate("/products", { replace: true });
                }}
              >
                Resetare
              </button>
            </div>

            <hr className="bg-secondary mt-4 mb-3" />
            <small className="text-muted d-block" role="status" aria-live="polite">
              Statistici filtre: <strong>{productStats}</strong>
            </small>

            <div className="mt-4 p-3 rounded border border-primary border-opacity-25" style={{ background: 'rgba(102, 192, 244, 0.05)' }}>
              <h6 className="text-white fw-bold mb-2">🎸 Nu știi ce să alegi?</h6>
              <p className="text-muted small mb-3">Ghidul nostru de specialitate te ajută să găsești instrumentul perfect pentru tonul tău.</p>
              <Link to="/guitar-guide" className="btn btn-outline-primary btn-sm w-100 fw-bold">Vezi Ghidul de Alegere</Link>
            </div>
          </div>
        </aside>

        <section className="col-12 col-lg-9">
          <header className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <p className="section-title mb-0 text-uppercase small text-primary fw-bold" style={{ letterSpacing: '0.08em' }}>Catalog complet</p>
              <h1 className="hero-meta__title h4 text-white mb-0">Produse</h1>
            </div>
            <span className="badge-soft" role="status" aria-live="polite">
              {loading ? "Se încarcă..." : `${items.length} produse`}
            </span>
          </header>

          {error && <div className="alert alert-danger">⚠️ {error}</div>}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Se încarcă...</span>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="row g-4" id="productList">
              {items.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-info text-center">
                    <h6>😔 Nu s-a găsit nimic</h6>
                    <small>Încearcă alte filtre sau resetează căutarea</small>
                  </div>
                </div>
              )}
              {items.map((p) => {
                const imageUrl = p.image || "assets/img/placeholder.svg";
                const price = Number(p.price || 0).toFixed(2);
                return (
                  <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
                    <article className="product-card h-100 d-flex flex-column">
                      <div className="product-thumb-wrapper position-relative">
                        <Link to={`/product/${p.id}`} className="product-thumb d-block text-decoration-none">
                          <img src={imageUrl} alt={p.name} className="product-thumb-img" loading="lazy" />
                        </Link>
                      </div>
                      <div className="product-card-body d-flex flex-column flex-grow-1">
                        <small className="text-uppercase text-warning fw-bold mb-1">
                          {p.brand_name || "—"}
                        </small>
                        <h3 className="product-card-name h6 mb-2 flex-grow-1">
                          <Link to={`/product/${p.id}`} className="text-reset text-decoration-none">
                            {p.name}
                          </Link>
                        </h3>
                        {p.review_count > 0 && (
                          <div className="d-flex align-items-center gap-1 mb-2">
                            <span className="text-warning small" style={{ letterSpacing: '1px' }}>
                              {"★".repeat(Math.round(p.average_rating))}{"☆".repeat(5 - Math.round(p.average_rating))}
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.72rem' }}>({p.review_count})</span>
                          </div>
                        )}
                        <div className="mt-auto pt-2 border-top border-secondary d-flex justify-content-between align-items-center">
                          <div className="product-card-price fw-bold">{price} €</div>
                          <button
                            className="btn btn-add-cart btn-sm transition"
                            disabled={p.stock === 0}
                            onClick={() => {
                              addToCart(p);
                              trackAddToCart(p.id, p.name, p.price);
                              toast.success("Adăugat în coș!", { theme: "dark" });
                              grantAchievement("Window Shopper", token);
                            }}
                          >
                            {p.stock === 0 ? "Epuizat" : "🛒 Adaugă"}
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
