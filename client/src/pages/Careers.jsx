import React from 'react';

export default function Careers() {
    return (
        <div className="container py-5 my-5">
            <div className="surface-card p-5 rounded shadow-lg" style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h1 className="text-white mb-4 fw-bold border-bottom pb-3 border-secondary">Cariere</h1>

                <div className="text-light opacity-75 lh-lg text-center py-5">
                    <i className="bi bi-briefcase fs-1 mb-3 d-block text-primary"></i>
                    <h4 className="text-white">Alătură-te echipei noastre!</h4>
                    <p>Momentan nu avem poziții deschise, dar suntem mereu în căutare de oameni talentați și pasionați de muzică.</p>
                    <p>Trimite-ne CV-ul tău la <span className="text-primary">careers@farbeyondgear.com</span> și te vom contacta când apare o oportunitate.</p>
                </div>
            </div>
        </div>
    );
}
