import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArtists } from "../lib/api.js";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getArtists()
      .then(data => {
        const list = Array.isArray(data) ? data : (data.results ?? []);
        list.sort((a, b) => a.name.localeCompare(b.name, "ro"));
        setArtists(list);
      })
      .catch(() => setError("Nu am putut încărca artiștii."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = artists.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, artist) => {
    const letter = artist.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(artist);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort();

  const getArtistImage = (artist) => {
    if (artist.image) return artist.image;
    if (artist.hero_image) return artist.hero_image;
    if (artist.name.includes("Slash")) return "/assets/img/artists/Slash_3.jpg";
    if (artist.name.includes("Kerry")) return "/assets/img/artists/kerry-king.jpg";
    if (artist.name.includes("Max")) return "/assets/img/artists/Slayer_München_2016_(3_von_6) (1).jpg";
    if (artist.name.includes("Chuck")) return "/assets/img/artists/Photo-Chuck-Schuldiner.jpg";
    return "/assets/img/placeholder.svg";
  };

  return (
    <main className="py-5">
      <div className="container">

        {/* Header */}
        <div className="mb-5">
          <p className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 text-uppercase letter-spacing-1 rounded-pill">
            ★ Hall of Fame
          </p>
          <h1 className="display-5 text-white fw-bolder mb-2" style={{ letterSpacing: "-1px" }}>
            Artiști Legendari
          </h1>
          <p className="text-muted lead mb-4">
            Muzicienii care au definit sunetul metal-ului — și echipamentul cu care au făcut-o.
          </p>

          {/* Search */}
          <div className="col-12 col-md-6 col-lg-5">
            <div
              style={{
                position: "relative",
                background: "linear-gradient(135deg, rgba(20,10,4,0.97), rgba(30,15,5,0.95))",
                border: "1px solid rgba(255,100,30,0.25)",
                borderRadius: "50px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
              onFocusCapture={e => {
                e.currentTarget.style.borderColor = "rgba(255,100,30,0.6)";
                e.currentTarget.style.boxShadow = "0 4px 30px rgba(255,80,20,0.18), inset 0 1px 0 rgba(255,255,255,0.04)";
              }}
              onBlurCapture={e => {
                e.currentTarget.style.borderColor = "rgba(255,100,30,0.25)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)";
              }}
            >
              <i
                className="bi bi-search"
                style={{
                  position: "absolute", left: "20px", top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,130,60,0.6)", fontSize: "1rem", pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Caută artist..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", border: "none", outline: "none",
                  background: "transparent",
                  padding: "14px 48px 14px 50px",
                  color: "#fff", fontSize: "0.95rem",
                  letterSpacing: "0.02em",
                  borderRadius: "50px",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute", right: "14px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,100,30,0.15)", border: "none",
                    color: "rgba(255,180,120,0.8)", borderRadius: "50%",
                    width: "28px", height: "28px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,100,30,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,100,30,0.15)"}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center text-muted py-5">Se încarcă artiștii...</div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-muted fst-italic">Niciun artist găsit.</div>
        )}

        {/* Grouped by letter */}
        {!loading && letters.map(letter => (
          <div key={letter} className="mb-5">
            <h2
              className="h4 fw-bolder mb-4 pb-2 border-bottom"
              style={{ color: "var(--primary)", borderColor: "rgba(255,100,30,0.25) !important" }}
            >
              {letter}
            </h2>
            <div className="row g-4">
              {grouped[letter].map(artist => (
                <div key={artist.id} className="col-6 col-md-4 col-lg-3">
                  <Link
                    to={`/artist/${artist.id}`}
                    className="text-decoration-none d-block"
                  >
                    <div
                      className="surface-card overflow-hidden"
                      style={{ borderRadius: "var(--radius-lg)", transition: "transform 0.2s, box-shadow 0.2s" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 20px 50px rgba(255,80,20,0.25)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "";
                      }}
                    >
                      {/* Artist photo */}
                      <div
                        style={{
                          height: "220px",
                          backgroundImage: `url('${getArtistImage(artist)}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center top",
                        }}
                      />
                      {/* Info */}
                      <div className="p-3">
                        <h3 className="h6 text-white fw-bold mb-1">{artist.name}</h3>
                        <p className="small text-muted mb-1">{artist.role || "—"}</p>
                        {artist.brands && artist.brands.length > 0 && (
                          <p className="small text-warning mb-0 fw-bold">
                            {artist.brands.map(b => b.name).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
