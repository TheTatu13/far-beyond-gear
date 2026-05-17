import { Link } from "react-router-dom";

export default function GuitarGuide() {
  return (
    <div className="py-5 animate-fade-in">
      {/* HERO SECTION */}
      <section className="container mb-5">
        <div className="hero p-5 rounded shadow-lg position-relative overflow-hidden" 
             style={{ background: 'linear-gradient(135deg, #16202d 0%, #1b2838 100%)', border: '1px solid var(--border)' }}>
          <div className="position-absolute top-0 end-0 p-5 opacity-10 d-none d-lg-block">
            <i className="bi bi-book-half" style={{ fontSize: '12rem', color: 'var(--primary)' }}></i>
          </div>
          <div className="position-relative z-1">
            <p className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 text-uppercase letter-spacing-1 rounded-pill">
              ★ Ghidul Expertului
            </p>
            <h1 className="display-4 text-white fw-bold mb-4">Cum să-ți alegi <span className="text-primary">chitara perfectă</span></h1>
            <p className="lead text-white-50 max-width-600 mb-0">
              Alegerea unui instrument este o călătorie personală. Fie că ești la prima chitară sau cauți "acea" piesă de colecție, 
              am pregătit acest ghid pentru a te ajuta să navighezi prin specificațiile tehnice și tonurile legendare.
            </p>
          </div>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="container mb-5 text-white">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="surface-card p-4 h-100 border-top border-3 border-primary">
              <div className="fs-1 mb-3 text-primary"><i className="bi bi-music-note-beamed"></i></div>
              <h3 className="h5 fw-bold mb-3">1. Definește-ți Stilul</h3>
              <p className="text-muted small">
                Metal-ul cere doze active și gâturi rapide (ESP, Jackson), în timp ce Blues-ul strălucește pe doze single-coil sau hollow-body. 
                Începe prin a identifica artiștii care te inspiră.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="surface-card p-4 h-100 border-top border-3 border-warning">
              <div className="fs-1 mb-3 text-warning"><i className="bi bi-gear-wide-connected"></i></div>
              <h3 className="h5 fw-bold mb-3">2. Configurația Dozelor</h3>
              <p className="text-muted small">
                <strong>Humbuckers:</strong> Sunet gros, fără zgomot, perfect pentru distors. 
                <br /><strong>Single-Coils:</strong> Claritate, "twang" și dinamica incredibilă pentru cleans și funk.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="surface-card p-4 h-100 border-top border-3 border-info">
              <div className="fs-1 mb-3 text-info"><i className="bi bi-hammer"></i></div>
              <h3 className="h5 fw-bold mb-3">3. Tipul Lemnului</h3>
              <p className="text-muted small">
                Mahonul oferă căldură și sustain infinit. Arțarul (Maple) aduce atac și strălucire. 
                Corpul instrumentului dictează rezonanța fundamentală a tonului tău.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRO TIP BANNER */}
      <section className="container mb-5">
        <div className="p-4 rounded border border-primary border-opacity-25" style={{ background: 'rgba(102, 192, 244, 0.05)' }}>
          <div className="d-flex align-items-center gap-4 flex-wrap flex-md-nowrap">
            <div className="fs-1 text-primary"><i className="bi bi-lightbulb-fill"></i></div>
            <div>
              <h4 className="h5 fw-bold text-white mb-2">Sfat de la Profesioniști</h4>
              <p className="text-white-50 mb-0 small">
                Nu neglija confortul! O chitară poate suna incredibil, dar dacă profilul gâtului (C-shape, U-shape, Thin-U) nu se potrivește mâinii tale, 
                nu te vei bucura de ea la potențial maxim. Verifică mereu specificația "Neck Shape" în catalogul nostru.
              </p>
            </div>
            <div className="ms-md-auto">
              <Link to="/products" className="btn btn-primary px-4 fw-bold text-nowrap">Vezi Catalogul</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="container text-center py-5">
        <h2 className="text-white fw-bold mb-4">Ești gata să îți găsești tonul?</h2>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/products" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold">Explorează Produsele</Link>
          <Link to="/faq" className="btn btn-warning btn-lg px-5 py-3 rounded-pill fw-bold text-dark">Întreabă un Expert</Link>
        </div>
      </section>
    </div>
  );
}
