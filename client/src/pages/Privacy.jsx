import React from 'react';

export default function Privacy() {
    return (
        <div className="pb-5 text-white" style={{ backgroundColor: '#1b2838', minHeight: '100vh' }}>
            {/* Premium Hero Header */}
            <header className="info-hero mb-5">
                <div className="container px-4">
                    <div className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', background: 'rgba(102, 192, 232, 0.1)' }}>
                        CONFIDENȚIALITATE
                    </div>
                    <h1 className="display-4 fw-bold mb-3 info-title">Politica de Confidențialitate</h1>
                    <p className="lead text-light opacity-50 mx-auto" style={{ maxWidth: '600px' }}>
                        Transparență totală asupra modului în care protejăm și utilizăm datele tale.
                    </p>
                </div>
            </header>

            <div className="container px-4">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="glass-card p-4 p-md-5 lh-lg shadow-lg">
                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4 d-flex align-items-center">
                                    <i className="bi bi-shield-lock me-3 text-primary"></i> 1. Colectarea Datelor
                                </h2>
                                <p className="text-light opacity-50 ps-4">
                                    Colectăm informațiile pe care ni le furnizați direct atunci când vă creați un cont, plasați o comandă sau vă abonați la newsletter. Acestea includ numele, adresa de e-mail, adresa de livrare și detaliile de plată.
                                </p>
                            </section>

                            <div className="section-divider"></div>

                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4">2. Utilizarea Datelor</h2>
                                <p className="text-light opacity-50">
                                    Datele tale sunt utilizate exclusiv pentru procesarea comenzilor, îmbunătățirea serviciilor noastre și comunicarea ofertelor relevante. **Nu vindem și nu închiriem niciodată datele tale către terți.**
                                </p>
                            </section>

                            <section className="mb-5">
                                <h2 className="h4 fw-bold text-white mb-4">3. Drepturile Tale (GDPR)</h2>
                                <p className="text-light opacity-50">
                                    Conform legislației în vigoare, ai dreptul de a solicita accesul, rectificarea sau ștergerea completă a datelor tale din sistemele noastre. Pentru orice solicitare, ne poți contacta la <span className="text-primary">dpo@farbeyondgear.com</span>.
                                </p>
                            </section>

                            <p className="mt-5 small fst-italic text-center opacity-25">Protejăm pasiunea ta. Protejăm datele tale.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
