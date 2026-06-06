import React from 'react';

export default function Terms() {
    return (
        <div className="pb-5 text-white" style={{ backgroundColor: '#1b2838', minHeight: '100vh' }}>
            {/* Premium Hero Header */}
            <header className="info-hero mb-5">
                <div className="container px-4">
                    <div className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', background: 'rgba(102, 192, 232, 0.1)' }}>
                        LEGAL
                    </div>
                    <h1 className="display-4 fw-bold mb-3 info-title">Termeni și Condiții</h1>
                    <p className="lead text-light opacity-50 mx-auto" style={{ maxWidth: '600px' }}>
                        Regulamentul oficial și datele de identificare ale Far Beyond Gear S.R.L.
                    </p>
                </div>
            </header>

            <div className="container px-4">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="glass-card p-4 p-md-5 lh-lg shadow-lg">
                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4 d-flex align-items-center">
                                    <i className="bi bi-info-circle me-3 text-primary"></i> 1. Datele Firmei
                                </h2>
                                <div className="ps-4 border-start border-primary border-opacity-25 ms-2">
                                    <p className="mb-2 text-light"><strong>Denumire:</strong> Far Beyond Gear S.R.L.</p>
                                    <p className="mb-2 text-light"><strong>Cod Unic de Înregistrare:</strong> RO12345678</p>
                                    <p className="mb-2 text-light"><strong>Număr Reg. Com.:</strong> J40/1234/2026</p>
                                    <p className="mb-0 text-light"><strong>Sediu Social:</strong> Str. Muzicii Nr. 1, București, România</p>
                                </div>
                            </section>

                            <div className="section-divider"></div>

                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4">2. Condiții de Utilizare</h2>
                                <p className="text-light opacity-50">
                                    Prin utilizarea acestui site, sunteți de acord să respectați întocmai termenii și condițiile prezentate. Far Beyond Gear își rezervă dreptul de a actualiza acești termeni fără o notificare prealabilă, versiunea actuală fiind mereu disponibilă pe această pagină.
                                </p>
                            </section>

                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4">3. Drepturi de Autor</h2>
                                <p className="text-light opacity-50">
                                    Întreg conținutul site-ului Far Beyond Gear (text, imagini, logo-uri, cod sursă) este protejat de legislația privind drepturile de autor. Reproducerea neautorizată este strict interzisă.
                                </p>
                            </section>

                            <p className="mt-5 small fst-italic text-center opacity-25">Ultima actualizare: 09 Martie 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
