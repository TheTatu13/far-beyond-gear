import React from 'react';

export default function Cookies() {
    return (
        <div className="pb-5 text-white" style={{ backgroundColor: '#1b2838', minHeight: '100vh' }}>
            {/* Premium Hero Header */}
            <header className="info-hero mb-5">
                <div className="container px-4">
                    <div className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', background: 'rgba(102, 192, 232, 0.1)' }}>
                        EXPERIENȚĂ DIGITALĂ
                    </div>
                    <h1 className="display-4 fw-bold mb-3 info-title">Politica de Cookie-uri</h1>
                    <p className="lead text-light opacity-50 mx-auto" style={{ maxWidth: '600px' }}>
                        Folosim tehnologia pentru a-ți personaliza experiența pe Far Beyond Gear.
                    </p>
                </div>
            </header>

            <div className="container px-4">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="glass-card p-4 p-md-5 lh-lg shadow-lg">
                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4 d-flex align-items-center">
                                    <i className="bi bi-cookie me-3 text-primary"></i> 1. Ce sunt Cookie-urile?
                                </h2>
                                <p className="text-light opacity-50 ps-4">
                                    Cookie-urile sunt fișiere de mici dimensiuni stocate pe dispozitivul tău care ne permit să reținem preferințele tale, să analizăm traficul și să îți oferim conținut personalizat.
                                </p>
                            </section>

                            <div className="section-divider"></div>

                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4">2. Categorii Utilizate</h2>
                                <div className="row g-4 mt-2">
                                    <div className="col-md-4">
                                        <div className="p-3 border border-secondary border-opacity-10 rounded">
                                            <h3 className="h6 fw-bold text-primary mb-2">Esențiale</h3>
                                            <p className="small text-light opacity-50 mb-0">Necesare pentru funcționarea coșului de cumpărături și a logării.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="p-3 border border-secondary border-opacity-10 rounded">
                                            <h3 className="h6 fw-bold text-primary mb-2">Analitice</h3>
                                            <p className="small text-light opacity-50 mb-0">Ne ajută să înțelegem cum navighezi pe site pentru a-l îmbunătăți.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="p-3 border border-secondary border-opacity-10 rounded">
                                            <h3 className="h6 fw-bold text-primary mb-2">Marketing</h3>
                                            <p className="small text-light opacity-50 mb-0">Utilizate pentru a-ți afișa produse relevante pe alte platforme.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4">3. Controlul Tău</h2>
                                <p className="text-light opacity-50">
                                    Poți modifica oricând setările browserului tău pentru a bloca sau șterge cookie-urile. Reține însă că acest lucru poate afecta funcționalitatea anumitor secțiuni ale site-ului.
                                </p>
                            </section>

                            <button className="btn btn-outline-primary rounded-pill px-4 fw-bold small">Administrează Consimțământul</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
