import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArtist } from "../lib/api.js";

export default function ArtistDetails() {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;
        async function fetchGear() {
            try {
                const data = await getArtist(id);
                if (mounted) setArtist(data);
            } catch (err) {
                console.error(err);
                if (mounted) setError("Artistul nu a fost găsit sau a apărut o eroare.");
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchGear();
        return () => { mounted = false; };
    }, [id]);

    if (loading) {
        return <div className="container py-5 text-center text-muted">Se încarcă detaliile artistului...</div>;
    }

    if (error || !artist) {
        return (
            <div className="container py-5 text-center text-muted">
                <h2>{error || "Artistul nu a fost găsit."}</h2>
                <Link to="/brands" className="btn btn-outline-light mt-3">Înapoi la branduri</Link>
            </div>
        );
    }

    // Fallback map in caz ca seed-ul a folosit imagini vechi statice pentru artist image, si modelul ImageField primeste inca un path pe /assets/ (seed_artists.py doar le-a creat gol)
    // Pentru viitor pozele se uploadeaza din admin, deci vor veni cum /media/...
    const artistImage = artist.image || artist.hero_image || (
        artist.name.includes("Slash") ? "/assets/img/artists/Slash_3.jpg" :
            artist.name.includes("Kerry") ? "/assets/img/artists/kerry-king.jpg" :
                artist.name.includes("Max") ? "/assets/img/artists/Slayer_München_2016_(3_von_6) (1).jpg" :
                    artist.name.includes("Chuck") ? "/assets/img/artists/Photo-Chuck-Schuldiner.jpg" : "/assets/img/placeholder.svg"
    );

    return (
        <main className="py-5">
            <div className="container">
                {artist.brands && artist.brands.length > 0 && (
                    <div className="mb-4 d-flex flex-wrap gap-2">
                        {artist.brands.map(b => (
                            <Link key={b.id} to={`/brands/${b.id}`} className="btn btn-outline-light btn-sm">
                                ← Înapoi la {b.name}
                            </Link>
                        ))}
                    </div>
                )}

                <div className="surface-card p-4 mb-5 glow-card">
                    <div className="row g-5 align-items-start">
                        <div className="col-md-5 position-sticky" style={{ top: "120px", zIndex: 10 }}>
                            <div
                                className="artist-thumb shadow-lg"
                                style={{
                                    backgroundImage: `url('${artistImage}')`,
                                    borderRadius: "var(--radius-lg)",
                                    height: "650px",
                                    width: "100%",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center top",
                                    border: "1px solid rgba(255,193,7, 0.2)"
                                }}
                            ></div>
                        </div>
                        <div className="col-md-7 ps-md-4">
                            <p className="text-warning fw-bold mb-1 letter-spacing-1 text-uppercase small">
                                Artist Oficial {artist.brands?.map(b => b.name).join(" & ") || "The Far Beyond Gear"}
                            </p>
                            <h1 className="display-4 text-white mb-2 fw-bolder" style={{ letterSpacing: "-1px" }}>{artist.name}</h1>
                            <p className="lead text-muted mb-4 border-bottom border-secondary pb-3">{artist.role}</p>

                            {artist.quote && (
                                <blockquote className="blockquote bg-dark p-4 rounded mb-5 shadow" style={{ borderLeft: "4px solid var(--bs-warning)" }}>
                                    <p className="fst-italic text-light fs-5 mb-0" style={{ lineHeight: "1.6" }}>
                                        <span className="text-warning display-6 me-2" style={{ verticalAlign: "bottom", lineHeight: 0 }}>&ldquo;</span>
                                        {artist.quote}
                                        <span className="text-warning display-6 ms-2" style={{ verticalAlign: "bottom", lineHeight: 0 }}>&rdquo;</span>
                                    </p>
                                </blockquote>
                            )}

                            <div className="mt-4">
                                <h4 className="h5 text-white mb-3 fw-bold text-uppercase letter-spacing-1">Biografie & Istoric</h4>
                                <div className="text-white-50" style={{ lineHeight: "1.9", fontSize: "1.05rem", whiteSpace: "pre-line", opacity: 0.85 }}>
                                    {artist.bio || "Nu există o biografie adăugată pentru acest artist încă."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-5 pattern-bg artist-section">
                <div className="container">
                    <h2 className="h4 text-white mb-4 fw-bold border-bottom border-primary pb-2 d-inline-block">Echipament {artist.name} (Shop)</h2>
                    <div className="row g-4 glow-container">
                        {(!artist.products_detail || artist.products_detail.length === 0) ? (
                            <div className="col-12 text-center">
                                <div className="alert alert-secondary border-secondary bg-dark text-muted">Așteptăm restocarea sau asocierea echipamentelor în shop pentru acest artist.</div>
                            </div>
                        ) : (
                            artist.products_detail.map((p) => {
                                const price = Number(p.price || 0).toFixed(2);
                                return (
                                    <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                                        <Link to={`/product/${p.id}`} className="product-card text-decoration-none h-100 d-flex flex-column">
                                            <div className="product-card-thumb" style={{ backgroundImage: `url('${p.image || "/assets/img/placeholder.svg"}')` }}></div>
                                            <div className="product-card-body p-3 flex-grow-1 d-flex flex-column">
                                                {p.brand && <p className="product-card-brand text-warning mb-1 small fw-bold text-uppercase">{p.brand.name}</p>}
                                                <h3 className="product-card-name h6 mb-2 text-white flex-grow-1" style={{ fontWeight: 600 }}>{p.name}</h3>
                                                <p className="product-card-price h5 mb-0 text-accent fw-bold">{price} €</p>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
