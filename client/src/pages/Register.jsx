import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { trackRegister } from "../lib/analytics.js";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { registerUser, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/profile");
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (password !== confirmPassword) {
            toast.error("Parolele nu se potrivesc!");
            setIsLoading(false);
            return;
        }
        const result = await registerUser(username, email, password);
        if (result.success) {
            trackRegister();
            toast.success("Cont creat cu succes!");
            navigate("/profile");
        } else {
            toast.error(result.message || "Eroare la creare cont.");
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
                        Creare cont nou
                    </h2>
                    <p className="text-muted small mb-0">Alătură-te comunității Far Beyond Gear</p>
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

                    <div className="mb-3">
                        <label className="form-label text-muted small text-uppercase fw-bold" style={{ letterSpacing: "0.08em" }}>
                            Email <span className="text-muted fw-normal">(opțional)</span>
                        </label>
                        <input
                            type="email"
                            className="form-control border-0 text-white"
                            style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px 16px" }}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
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
                            minLength={4}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted small text-uppercase fw-bold" style={{ letterSpacing: "0.08em" }}>
                            Confirmă parola
                        </label>
                        <input
                            type="password"
                            className="form-control border-0 text-white"
                            style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px 16px" }}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            minLength={4}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold py-3 rounded-pill"
                        style={{ fontSize: "1rem", letterSpacing: "0.05em" }}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <><span className="spinner-border spinner-border-sm me-2"></span>Se creează contul...</>
                            : <><i className="bi bi-person-plus-fill me-2"></i>Înregistrează-te</>
                        }
                    </button>
                </form>

                <p className="text-center mt-4 mb-0 text-muted small">
                    Ai deja cont?{" "}
                    <Link to="/login" className="text-warning fw-bold text-decoration-none">
                        Loghează-te
                    </Link>
                </p>
            </div>
        </div>
    );
}
