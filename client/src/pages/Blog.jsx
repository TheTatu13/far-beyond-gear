import React from 'react';

export default function Blog() {
    const posts = [
        {
            id: 1,
            tag: "GHIDURI",
            title: "Cum să alegi prima chitară electrică",
            desc: "Un ghid complet pentru începătorii care vor să facă primul pas în lumea rock-ului fără să dea greș.",
            img: "https://images.unsplash.com/photo-1550985543-f47f38aee65e?auto=format&fit=crop&q=80&w=800",
            date: "05 Martie 2026"
        },
        {
            id: 2,
            tag: "TEHNOLOGIE",
            title: "Analog vs Digital în 2026",
            desc: "Mai merită să cari un combo de 40kg sau un procesor de ultimă generație este suficient pentru scenă?",
            img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
            date: "02 Martie 2026"
        },
        {
            id: 3,
            tag: "INTERVIU",
            title: "Secretele tonului de studio",
            desc: "Am stat de vorbă cu inginerii de sunet de la Abbey Road despre cum se captează corect un cabinet 4x12.",
            img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
            date: "28 Februarie 2026"
        }
    ];

    return (
        <div className="pb-5 text-white" style={{ backgroundColor: '#1b2838', minHeight: '100vh' }}>
            {/* Premium Hero Header */}
            <header className="info-hero mb-5">
                <div className="container px-4">
                    <div className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', background: 'rgba(102, 192, 232, 0.1)' }}>
                        ZONA DE ȘTIRI
                    </div>
                    <h1 className="display-4 fw-bold mb-3 info-title">Blog & Resurse</h1>
                    <p className="lead text-light opacity-50 mx-auto" style={{ maxWidth: '600px' }}>
                        Află ultimele noutăți din industrie, tutoriale de mentenanță și recenzii de echipamente premium.
                    </p>
                </div>
            </header>

            <div className="container px-4">
                <div className="row g-4 mb-5">
                    {posts.map(post => (
                        <div key={post.id} className="col-lg-4 col-md-6">
                            <div className="glass-card h-100 overflow-hidden group">
                                <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                                    <img src={post.img} alt={post.title} className="w-100 h-100 object-fit-cover transition-transform" style={{ transition: 'transform 0.5s ease' }} />
                                    <div className="position-absolute top-0 start-0 p-3">
                                        <span className="badge bg-primary rounded-pill px-3 py-2 shadow-sm">{post.tag}</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="small text-light opacity-50 mb-2">{post.date}</div>
                                    <h3 className="h5 fw-bold mb-3 text-white transition-colors">{post.title}</h3>
                                    <p className="small text-light opacity-50 mb-4 lh-lg">{post.desc}</p>
                                    <a href="#" className="btn btn-link p-0 text-primary text-decoration-none fw-bold small">
                                        CITEȘTE TOT <i className="bi bi-arrow-right ms-2 transition-transform"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter / Call to action */}
                <div className="glass-card p-5 text-center mt-5 mb-5 position-relative overflow-hidden">
                    <h2 className="h4 fw-bold mb-3">Rămâi la curent cu noutățile</h2>
                    <p className="text-light opacity-50 mb-4 px-lg-5 mx-auto" style={{ maxWidth: '500px' }}>Abonează-te la newsletter-ul nostru pentru a primi direct pe mail cele mai noi tutoriale și oferte exclusive.</p>
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-2" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <input type="email" className="form-control bg-dark border-secondary border-opacity-25 text-white px-4 py-2 rounded-pill" placeholder="Adresa ta de email" />
                        <button className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow">Abonează-te</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
