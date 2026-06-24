import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { trackLogin } from "../lib/analytics.js";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { loginUser, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/profile");
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await loginUser(username, password);
        if (result.success) {
            trackLogin();
            toast.success("Te-ai autentificat cu succes!");
            navigate("/profile");
        } else {
            toast.error(result.message || "Eroare la autentificare.");
        }
        setIsLoading(false);
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
            <div style={{
                width: "100%", maxWidth: "440px",
                background: "linear-gradient(145deg, #1a0d06, #0e0804)",
                border: "1px solid rgba(255,100,30,0.25)",
                borderRadius: "20px",
                boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
                padding: "2.5rem",
            }}>
                {/* Header */}
                <div className="text-center mb-4">
                    <p className="text-warning fw-bold small text-uppercase mb-2" style={{ letterSpacing: "0.15em" }}>
                        ★ Far Beyond Gear
                    </p>
                    <h2 className="text-white fw-bolder mb-1" style={{ fontSize: "1.8rem" }}>
                        Autentificare
                    </h2>
                    <p className="text-muted small mb-0">Intră în contul tău pentru a continua</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted small text-uppercase fw-bold" style={{ letterSpacing: "0.08em" }}>
                            Nume utilizator
                        </label>
                        <input
                            type="text"
                            className="form-control border-0 text-white"
                            style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px 16px" }}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted small text-uppercase fw-bold" style={{ letterSpacing: "0.08em" }}>
                            Parolă
                        </label>
                        <input
                            type="password"
                            className="form-control border-0 text-white"
                            style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px 16px" }}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold py-3 rounded-pill"
                        style={{ fontSize: "1rem", letterSpacing: "0.05em" }}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <><span className="spinner-border spinner-border-sm me-2"></span>Se autentifică...</>
                            : <><i className="bi bi-box-arrow-in-right me-2"></i>Intră în cont</>
                        }
                    </button>
                </form>

                <p className="text-center mt-4 mb-0 text-muted small">
                    Nu ai cont?{" "}
                    <Link to="/register" className="text-warning fw-bold text-decoration-none">
                        Înregistrează-te
                    </Link>
                </p>
            </div>
        </div>
    );
}
