import React from 'react';

export default function AboutUs() {
    return (
        <div className="pb-5 text-white" style={{ backgroundColor: '#1b2838', minHeight: '100vh' }}>
            {/* Premium Hero Header */}
            <header className="info-hero mb-5">
                <div className="container px-4">
                    <div className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', background: 'rgba(102, 192, 232, 0.1)' }}>
                        POVESTEA NOASTRĂ
                    </div>
                    <h1 className="display-4 fw-bold mb-3 info-title">Far Beyond Gear</h1>
                    <p className="lead text-light opacity-50 mx-auto" style={{ maxWidth: '600px' }}>
                        Mai mult decât un magazin. O comunitate dedicată celor care trăiesc prin muzică.
                    </p>
                </div>
            </header>

            <div className="container px-4">
                {/* Section 1: Vision */}
                <div className="row g-5 align-items-center mb-5 pb-5">
                    <div className="col-lg-6">
                        <h2 className="h2 fw-bold mb-4">Viziunea Noastră</h2>
                        <p className="lead text-primary opacity-75 mb-4 font-monospace">"Găsește-ți tonul. Câștigă scena."</p>
                        <p className="text-light opacity-50 lh-lg">
                            Far Beyond Gear a luat naștere dintr-o nevoie simplă dar profundă: accesul la instrumente de elită pentru muzicienii care nu acceptă compromisuri.
                            Fie că ești la început de drum sau un veteran al scenelor mari, misiunea noastră este să devii cea mai bună versiune a ta prin sunetul corect.
                        </p>
                        <div className="row g-4 mt-2">
                            <div className="col-6">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-patch-check-fill text-primary fs-3 me-3"></i>
                                    <span className="small fw-bold opacity-75">Calitate Garantată</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-people-fill text-primary fs-3 me-3"></i>
                                    <span className="small fw-bold opacity-75">Comunitate Unită</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="glass-card p-2 overflow-hidden position-relative shadow-lg">
                            <div className="p-4 border border-secondary border-opacity-10 rounded overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800" alt="Studio" className="img-fluid rounded transition-transform" style={{ filter: 'grayscale(0.5) brightness(0.8)', transition: 'transform 0.5s ease' }} />
                                <div className="position-absolute top-50 start-50 translate-middle">
                                    <div className="bg-primary rounded-circle p-3 shadow-lg" style={{ cursor: 'pointer' }}>
                                        <i className="bi bi-play-fill fs-3 text-dark"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Section 2: Values */}
                <div className="text-center mb-5 py-5">
                    <h2 className="h4 fw-bold opacity-25 text-uppercase letter-spacing-lg mb-5" style={{ letterSpacing: '0.2em' }}>Valorile Noastre</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="glass-card p-4 h-100">
                                <i className="bi bi-gem text-primary fs-1 mb-3 d-block"></i>
                                <h3 className="h5 fw-bold">Excelență</h3>
                                <p className="small text-light opacity-50">Selectăm doar brandurile care au dovedit de-a lungul deceniilor că pot face față rigorilor turneelor mondiale.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="glass-card p-4 h-100">
                                <i className="bi bi-lightning-charge text-primary fs-1 mb-3 d-block"></i>
                                <h3 className="h5 fw-bold">Inovație</h3>
                                <p className="small text-light opacity-50">Suntem mereu la curent cu noile tehnologii de procesare și amplificare digitală de ultimă generație.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="glass-card p-4 h-100">
                                <i className="bi bi-heart text-primary fs-1 mb-3 d-block"></i>
                                <h3 className="h5 fw-bold">Pasiune</h3>
                                <p className="small text-light opacity-50">Suntem noi înșine muzicieni. Știm ce înseamnă să cauți acel "anume" sunet nopți la rând în studio.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Call to action */}
                <div className="glass-card p-5 text-center mt-5 mb-5 position-relative overflow-hidden">
                    <div className="position-relative z-index-1 py-4">
                        <h2 className="h2 fw-bold mb-3">Vrei să faci parte din familie?</h2>
                        <p className="text-light opacity-50 mb-4 mx-auto" style={{ maxWidth: '500px' }}>Urmărește-ne pe rețelele sociale sau vizitează blogul nostru pentru noutăți, tutoriale și oferte exclusive.</p>
                        <div className="d-flex justify-content-center gap-3">
                            <a href="/blog" className="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow">Vezi Blog</a>
                            <a href="/careers" className="btn btn-outline-light px-5 py-2 rounded-pill fw-bold border-opacity-25">Cariere</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
