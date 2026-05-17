import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, Link } from "react-router-dom";
import { getProduct, getProductReviews, postProductReview, grantAchievement } from "../lib/api.js";
import { addToCart } from "../lib/cart.js";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { trackProductView, trackAddToCart } from "../lib/analytics.js";

export default function ProductDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [activeTab, setActiveTab] = useState("descriere");
  
  // Gallery state
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    Promise.all([getProduct(id), getProductReviews(id)])
      .then(([prodRes, revRes]) => {
        if (mounted) {
          setProduct(prodRes);
          setReviews(revRes);
          setSelectedImage(prodRes.image);
          trackProductView(prodRes.id, prodRes.name);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Eroare la încărcare.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Comentariul nu poate fi gol.");
      return;
    }
    setSubmitting(true);
    try {
      const newReview = await postProductReview(id, { rating, comment }, token);
      setReviews(prev => [newReview, ...prev]);
      setComment("");
      setRating(5);
      toast.success("Recenzia a fost adăugată cu succes!");
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Nu am putut salva recenzia.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-5 text-muted">Se încarcă detaliile produsului...</div>;
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || "Produsul nu a fost găsit."}</div>
      </div>
    );
  }

  const price = Number(product.price || 0).toFixed(2);
  const imageUrl = product.image || "/assets/img/placeholder.svg";

  return (
    <div className="container py-5">
      {/* 1. HERO PRODUCT SECTION */}
      <div className="row g-5 mb-5 align-items-start">
        <div className="col-lg-5">
          <div className="product-detail-img-container position-relative cursor-zoom-in" 
               onClick={() => {
                 setIsLightboxOpen(true);
               }}>
            <img 
              src={selectedImage || imageUrl} 
              alt={product.name} 
              key={selectedImage}
              className="img-fluid" 
            />
            <div className="position-absolute bottom-0 end-0 p-3 bg-dark bg-opacity-50 text-white rounded-start-top small">
               <i className="bi bi-arrows-fullscreen me-1"></i> Zoom
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="d-flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hidden">
              <div 
                className={`thumbnail-item rounded border-2 cursor-pointer transition-all ${selectedImage === product.image ? 'border-primary shadow' : 'border-transparent opacity-50'}`}
                style={{ width: '80px', height: '80px', flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => {
                  setSelectedImage(product.image);
                }}
              >
                <img src={product.image} alt="Main" className="w-100 h-100 object-fit-cover" />
              </div>
              {product.images.map((img) => (
                <div 
                  key={img.id}
                  className={`thumbnail-item rounded border-2 cursor-pointer transition-all ${selectedImage === img.image ? 'border-primary shadow' : 'border-transparent opacity-50'}`}
                  style={{ width: '80px', height: '80px', flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedImage(img.image);
                  }}
                >
                  <img src={img.image} alt={img.alt_text || "Gallery"} className="w-100 h-100 object-fit-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-lg-7">
          <p className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 text-uppercase letter-spacing-1 rounded-pill">
            ★ Detalii Produs
          </p>
          <h1 className="h1 text-white fw-bolder mb-3" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>{product.name}</h1>
          <div className="mb-4 d-flex align-items-center gap-2">
            <span className="text-muted small text-uppercase fw-bold" style={{ letterSpacing: '0.1em' }}>BRAND:</span>
            <span className="badge bg-secondary text-white px-3 py-2 shadow-sm" style={{ fontSize: '0.85rem' }}>
              {product.brand_name || "—"}
            </span>
          </div>
          
          <div className="product-card-price h1 mb-5 fw-bold" style={{ color: '#fff' }}>{price} €</div>

          <div className="d-flex flex-wrap gap-3 mb-4">
            <button className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow position-relative overflow-hidden" 
                    onClick={() => { 
                      addToCart(product);
                      trackAddToCart(product.id, product.name, product.price);
                      toast.success("Adăugat în coș!", { theme: "dark" });
                      grantAchievement("Window Shopper", token); 
                    }}>
              <i className="bi bi-cart-plus me-2 fs-5"></i> Adaugă în coș
            </button>
            <Link to="/cart" className="btn btn-outline-light btn-lg px-5 py-3 d-flex align-items-center transition">
              Mergi la Checkout <i className="bi bi-arrow-right ms-2 mt-1"></i>
            </Link>
          </div>

          <div className="d-flex align-items-center gap-3">
            <p className="small mb-0 text-success fw-bold d-flex align-items-center">
              <i className="bi bi-check-circle-fill me-2 fs-5"></i> În stoc
            </p>
            <p className="small mb-0 text-light opacity-50 d-flex align-items-center">
              <i className="bi bi-shield-check me-2 fs-5"></i> Garanție 3 ani
            </p>
          </div>
        </div>
      </div>

      {/* 2. TABS SECTION (Description & Specs) */}
      <div className="row mb-5">
        <div className="col-12">
          <ul className="nav nav-pills mb-4 border-bottom border-secondary border-opacity-25 pb-3">
            <li className="nav-item">
              <button className={`nav-link text-white fw-bold me-2 px-4 py-2 rounded-pill ${activeTab === 'descriere' ? 'bg-primary shadow' : 'bg-transparent border border-secondary text-muted'}`} 
                      onClick={() => setActiveTab('descriere')}>
                Descriere
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-white fw-bold px-4 py-2 rounded-pill ${activeTab === 'specificatii' ? 'bg-primary shadow' : 'bg-transparent border border-secondary text-muted'}`} 
                      onClick={() => setActiveTab('specificatii')}>
                Specificații
              </button>
            </li>
          </ul>

          <div className="p-4 p-md-5 rounded shadow-lg border border-secondary border-opacity-25" style={{ background: 'var(--bg-panel)' }}>
            {activeTab === 'descriere' && (
              <div className="text-light opacity-75 lh-lg" style={{ fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                {product.description || "Ne pare rău, acest produs nu are o descriere detaliată momentan."}
              </div>
            )}
            {activeTab === 'specificatii' && (
              <div className="text-light opacity-75">
                {product.specifications ? (
                  <div style={{ whiteSpace: 'pre-line' }}>{product.specifications}</div>
                ) : (
                  <p>Nu există specificații tehnice listate pentru acest produs.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. REVIEWS SECTION */}
      <div className="row pt-5 border-top border-secondary border-opacity-25">
        <div className="col-lg-8">
          <h2 className="h3 mb-4 text-white fw-bold">Recenzii Clienți ({reviews.length})</h2>
          
          {/* List existing reviews */}
          <div className="mb-5 d-flex flex-column gap-3">
            {reviews.length === 0 ? (
              <p className="text-muted fst-italic">Fii primul care lasă o recenzie pentru acest produs!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded border border-secondary border-opacity-10 shadow-sm" style={{ background: 'linear-gradient(145deg, var(--bg-panel), rgba(13,20,38,0.5))' }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm" style={{ width: '45px', height: '45px' }}>
                        {rev.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong className="text-white d-block">{rev.username}</strong>
                        <span className="small text-muted">{new Date(rev.created_at).toLocaleDateString('ro-RO')}</span>
                      </div>
                    </div>
                    <div className="text-warning fs-5" style={{ letterSpacing: '2px' }}>
                      {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                    </div>
                  </div>
                  <p className="mb-0 text-light opacity-75 lh-base">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Leave a review form */}
          <div className="p-4 p-md-5 rounded border border-primary border-opacity-25 shadow" style={{ background: 'var(--bg-soft)' }}>
            <h3 className="h5 text-white mb-4 fw-bold">Lasă o recenzie</h3>
            
            {!user ? (
              <div className="alert bg-dark border-secondary text-center py-4">
                <i className="bi bi-lock fs-1 text-muted d-block mb-3"></i>
                <h4 className="h6 text-white">Trebuie să fii autentificat pentru a lăsa o recenzie.</h4>
                <Link to="/login" className="btn btn-outline-light mt-2 px-4 rounded-pill">Intră în cont</Link>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="form-label text-light opacity-75 small text-uppercase fw-bold letter-spacing-1">Rating</label>
                  <select 
                    className="form-select bg-dark border-secondary text-white w-auto shadow-sm" 
                    value={rating} 
                    onChange={e => setRating(Number(e.target.value))}
                  >
                    <option value="5">★★★★★ - Excelent</option>
                    <option value="4">★★★★☆ - Foarte Bun</option>
                    <option value="3">★★★☆☆ - Mediu</option>
                    <option value="2">★★☆☆☆ - Slab</option>
                    <option value="1">★☆☆☆☆ - Foarte Slab</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label text-light opacity-75 small text-uppercase fw-bold letter-spacing-1">Comentariu</label>
                  <textarea 
                    className="form-control bg-dark border-secondary text-white shadow-sm" 
                    rows="4" 
                    placeholder="Cum ți se pare acest produs? Ai recomanda altora?"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary px-4 py-2 fw-bold shadow" disabled={submitting}>
                  {submitting ? 'Se trimite...' : 'Trimite Recenzia'}
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Right Sidebar (Trust signals) */}
        <div className="col-lg-4 mt-5 mt-lg-0">
           <div className="glass-card p-4 rounded border border-secondary border-opacity-25 shadow-sm text-center" style={{ background: 'var(--bg-panel)' }}>
             <i className="bi bi-shield-check display-3 text-primary mb-3"></i>
             <h4 className="h6 text-white fw-bold mb-3">Cumpărături Securizate</h4>
             <p className="small text-muted mb-0">La Far Beyond Gear, tranzacțiile tale sunt 100% securizate. Părerile clienților noștri certifică calitatea.</p>
           </div>
        </div>
      </div>

      {/* 4. LIGHTBOX MODAL (PORTAL) */}
      {isLightboxOpen && createPortal(
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 999999 }}
             onClick={() => setIsLightboxOpen(false)}>
          <button className="position-absolute top-0 end-0 m-4 btn btn-link text-white text-decoration-none p-2" 
                  style={{ fontSize: '2rem' }}
                  onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}>
            <i className="bi bi-x-lg"></i>
          </button>
          <img src={selectedImage || imageUrl} 
               alt={product.name} 
               className="img-fluid" 
               style={{ maxHeight: '90vh', maxWidth: '90vw', cursor: 'default', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}
               onClick={(e) => e.stopPropagation()} />
        </div>,
        document.body
      )}
    </div>
  );
}
