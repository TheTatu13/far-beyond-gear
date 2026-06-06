import React from 'react';

export default function Withdrawal() {
    return (
        <div className="pb-5 text-white" style={{ backgroundColor: '#1b2838', minHeight: '100vh' }}>
            {/* Premium Hero Header */}
            <header className="info-hero mb-5">
                <div className="container px-4">
                    <div className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', background: 'rgba(102, 192, 232, 0.1)' }}>
                        POLITICA DE RETUR
                    </div>
                    <h1 className="display-4 fw-bold mb-3 info-title">Dreptul de Retragere</h1>
                    <p className="lead text-light opacity-50 mx-auto" style={{ maxWidth: '600px' }}>
                        Siguranța achiziției tale este prioritatea noastră. Returnează fără griji în 30 de zile.
                    </p>
                </div>
            </header>

            <div className="container px-4">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="glass-card p-4 p-md-5 lh-lg shadow-lg">
                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4 d-flex align-items-center">
                                    <i className="bi bi-arrow-left-right me-3 text-primary"></i> 1. Perioada de Retur
                                </h2>
                                <p className="text-light opacity-50 ps-4">
                                    La Far Beyond Gear, oferim o perioadă extinsă de **30 de zile calendaristice** (față de cele 14 zile legale) în care poți returna orice produs achiziționat, fără a fi nevoie de o justificare.
                                </p>
                            </section>

                            <div className="section-divider"></div>

                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4">2. Condiții de Acceptare</h2>
                                <p className="text-light opacity-50">
                                    Pentru a fi acceptat la retur, produsul trebuie să fie în aceeași stare în care a fost livrat (fără urme de utilizare, zgârieturi sau lovituri), în ambalajul original și cu toate accesoriile incluse.
                                </p>
                            </section>

                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4">3. Cum inițiezi un retur?</h2>
                                <p className="text-light opacity-50 mb-4">
                                    Trimite un e-mail la <span className="text-primary fw-bold">retur@farbeyondgear.com</span> cu numărul comenzii tale sau folosește formularul de contact rapid din contul tău de client.
                                </p>
                                <div className="bg-primary bg-opacity-10 border border-primary border-opacity-25 p-4 rounded-3">
                                    <h4 className="h6 fw-bold text-white mb-2"><i className="bi bi-lightning-fill me-2"></i> Procesare Rapidă</h4>
                                    <p className="small text-light opacity-75 mb-0">Restituirea banilor se face în maximum 5 zile lucrătoare de la recepția și verificarea produsului în depozitul nostru.</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
