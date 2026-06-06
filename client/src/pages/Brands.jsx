import { useEffect, useState } from "react";
import { getBrands, grantAchievement } from "../lib/api.js";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Brands() {
  const { authTokens } = useAuth();
  const token = authTokens?.access;
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Gear Head Achievement Logic
    const visits = parseInt(localStorage.getItem("brand_visits") || "0") + 1;
    localStorage.setItem("brand_visits", visits.toString());
    
    if (visits === 5 && token) {
      grantAchievement("Gear Head", token);
    }
  }, [token]);

  useEffect(() => {
    let mounted = true;
    getBrands()
      .then((res) => mounted && setBrands(res))
      .catch((err) => mounted && setError(err.message || "Eroare la încărcare."))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container py-5">
      <header className="mb-4">
        <p className="section-title mb-1">În centrul scenei</p>
        <h1 className="h3 text-white mb-0">Branduri</h1>
      </header>

      {loading && <div className="text-light opacity-75">Se încarcă brandurile...</div>}
      {error && <div className="alert alert-danger">Nu s-au putut încărca: {error}</div>}

      {!loading && !error && (
        <div id="brandList" className="row g-4">
          {brands.length === 0 && <div className="text-light opacity-75">Nu există branduri înregistrate.</div>}
          {brands.map((b) => {
            const info = b.country ? `Țară: ${b.country}` : "Brand de echipamente muzicale.";
            const target = `/brands/${b.id}`;
            const img = b.hero_image || b.logo || "/assets/img/placeholder.svg";
            const tags = [b.country || "Brand", "Gear"];
            return (
              <div className="col-md-4" key={b.id}>
                <Link className="brand-feature-card text-decoration-none" to={target} aria-label={`Vezi produsele ${b.name}`}>
                  <div className="brand-feature-hero" style={{ backgroundImage: `url('${img}')` }} aria-hidden="true" />
                  <div className="brand-feature-overlay">
                    <div className="brand-feature-title">
                      <p className="section-title mb-1 text-uppercase">Pentru fanii {b.name}</p>
                      <h2 className="h5 text-white mb-2">{b.name}</h2>
                      <p className="text-light opacity-75 small mb-3">{info}</p>
                    </div>
                    <div className="brand-feature-tags">
                      {tags.map((t) => (
                        <span className="brand-tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      <span className="brand-cta btn btn-primary btn-sm">Vezi produsele</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
