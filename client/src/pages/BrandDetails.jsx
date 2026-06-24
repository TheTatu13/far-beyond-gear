import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBrand, getProducts, getArtists } from "../lib/api.js";

export default function BrandDetails() {
    const { id } = useParams();
    const [brand, setBrand] = useState(null);
    const [products, setProducts] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function fetchData() {
            try {
                const [brandData, productsData] = await Promise.all([
                    getBrand(id),
                    getProducts({ brand: id, page_size: 100 }),
                ]);

                let artistsData = [];
                try {
                    artistsData = await getArtists({ brands: id });
                } catch (err) {
                    console.warn("API de artiști indisponibil momentan", err);
                }

                if (!mounted) return;

                setBrand(brandData);
                setProducts(productsData || []);
                setArtists(artistsData || []);
            } catch (err) {
                if (mounted) setError(err.message || "Eroare la încărcare brand.");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchData();

        return () => {
            mounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center text-muted">Se încarcă detaliile brandului...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    if (!brand) return null;

    // Folosește hero_image din backend, cu un fallback doar pentru branding default
    const heroImage = brand.hero_image || brand.image || (brand.name.toLowerCase().includes("bc rich") ? "/assets/img/BC_Rich_Guitars_Logo.png" : null);

    return (
        <main>
            <section className="brand-hero" id="brandHero">
                <div className="container py-4">
                    <div
                        className={`brand-hero-card ${!heroImage ? 'd-none' : ''}`}
                        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : {}}
                    ></div>
                </div>
            </section>

            <section className="brand-tabs-shell">
                <div className="container py-3 d-flex justify-content-between align-items-center">
                    <Link to="/brands" className="btn btn-outline-light btn-sm rounded-pill px-3">
                        ← Înapoi la branduri
                    </Link>
                    {brand.website_url && (
                        <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm rounded-pill px-3">
                            Website Oficial
                        </a>
                    )}
                </div>
            </section>

            {/* Despre Brand */}
            <section className="py-5 brand-section">
                <div className="container">
                    <div className="surface-card p-4 glow-card mb-5">
                        <div className="glow-card-inner p-4">
                            <h1 className="h2 text-white mb-1 fw-bold">{brand.name}</h1>
                            {brand.country && <p className="text-warning small mb-4 fw-bold">PROVENIENȚĂ: {brand.country.toUpperCase()}</p>}
                            <h3 className="h4 text-white mb-3 fw-bold">Despre brand</h3>
                            <p className="text-muted mb-0" style={{ fontSize: "1.05rem", lineHeight: "1.8", whiteSpace: "pre-line" }}>
                                {brand.description || "Completează aici descrierea brandului și povestea sa din panoul de administrare."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Artisti */}
            <section className="py-2 brand-section">
                <div className="container mb-5">
                    <div className="d-flex justify-content-between align-items-end mb-4 border-bottom border-secondary pb-2">
                        <h3 className="h4 text-white mb-0 fw-bold">Artiști Reprezentanți</h3>
                        <span className="text-muted small">Inspirație pentru propriul tău sunet</span>
                    </div>
                    <div className="row g-4 glow-container">
                        {artists.length === 0 ? (
                            <div className="col-12 text-muted">Nu există artiști reprezentanți pentru acest brand.</div>
                        ) : (
                            artists.map((a) => (
                                <div className="col-12 col-sm-6 col-lg-4" key={a.id}>
                                    <Link className="text-decoration-none d-block" to={`/artist/${a.id}`}>
                                        <article className="glow-card overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                                            <div className="glow-card-inner">
                                                {/* Image area – 3:4 aspect ratio (portrait), uniform for all cards */}
                                                <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                                                    <img
                                                        src={a.hero_image || a.image || "/assets/img/placeholder.svg"}
                                                        alt={a.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                                                        loading="lazy"
                                                    />
                                                </div>
                                                {/* Text area – fixed height so all rows align */}
                                                <div style={{ height: '72px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 12px' }}>
                                                    <h3 className="h6 text-white mb-1 fw-bold text-center" style={{ lineHeight: '1.2' }}>{a.name}</h3>
                                                    <p className="text-warning mb-0 text-uppercase text-center" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>{a.role}</p>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </div>
                            ))
                        )}

                    </div>
                </div>
            </section>

            {/* Produse */}
            <section className="py-5 pattern-bg brand-section">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-4 border-bottom border-secondary pb-2">
                        <h2 className="h4 text-white mb-0 fw-bold">Echipamente {brand.name}</h2>
                    </div>
                    <div className="row g-4 glow-container">
                        {products.length === 0 ? (
                            <div className="col-12">
                                <div className="alert alert-info text-center">Nu există produse pentru acest brand.</div>
                            </div>
                        ) : (
                            products.map((p) => {
                                const imageUrl = p.image || "/assets/img/placeholder.svg";
                                const price = Number(p.price || 0).toFixed(2);
                                return (
                                    <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
                                        <article className="product-card h-100 d-flex flex-column glow-card position-relative">
                                            <div className="glow-card-inner">
                                                <div className="product-thumb-wrapper position-relative">
                                                    <Link to={`/product/${p.id}`} className="product-thumb d-block text-decoration-none">
                                                        <img src={imageUrl} alt={p.name} className="product-thumb-img" loading="lazy" />
                                                    </Link>
                                                </div>
                                                <div className="product-card-body d-flex flex-column flex-grow-1">
                                                    <small className="text-uppercase text-warning fw-bold mb-1">{p.brand?.name || ""}</small>
                                                    <h3 className="product-card-name h6 mb-2 flex-grow-1">
                                                        <Link to={`/product/${p.id}`} className="text-reset text-decoration-none">{p.name}</Link>
                                                    </h3>
                                                    <div className="mt-auto pt-2 border-top border-secondary d-flex justify-content-between align-items-center">
                                                        <div className="product-card-price fw-bold">{price} €</div>
                                                        <Link className="btn btn-outline-light btn-sm" to={`/product/${p.id}`}>Detalii</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
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
