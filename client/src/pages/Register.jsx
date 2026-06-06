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
        if (user) {
            navigate('/profile');
        }
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
            navigate('/profile');
        } else {
            toast.error(result.message || "Eroare la creare cont.");
        }
        setIsLoading(false);
    };

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div
                className="card p-4 shadow-lg text-white"
                style={{ width: "100%", maxWidth: "450px", backgroundColor: "#171a21", border: "1px solid #2a475e" }}
            >
                <h2 className="text-center mb-4" style={{ fontWeight: 300 }}>Creare cont nou</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: "#8f98a0" }}>Nume utilizator</label>
                        <input
                            type="text"
                            className="form-control"
                            style={{ backgroundColor: "#1b2838", color: "#fff", borderColor: "#3d4450" }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" style={{ color: "#8f98a0" }}>Email (Opțional)</label>
                        <input
                            type="email"
                            className="form-control"
                            style={{ backgroundColor: "#1b2838", color: "#fff", borderColor: "#3d4450" }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" style={{ color: "#8f98a0" }}>Parolă</label>
                        <input
                            type="password"
                            className="form-control"
                            style={{ backgroundColor: "#1b2838", color: "#fff", borderColor: "#3d4450" }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={4}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label" style={{ color: "#8f98a0" }}>Confirmă Parola</label>
                        <input
                            type="password"
                            className="form-control"
                            style={{ backgroundColor: "#1b2838", color: "#fff", borderColor: "#3d4450" }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={4}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 fw-bold"
                        style={{ backgroundImage: "linear-gradient(90deg, #2a475e 0%, #66c0f4 100%)", color: "#fff", border: "none" }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Se creează contul..." : "Înregistrează-te"}
                    </button>
                </form>

                <p className="text-center mt-4 mb-0" style={{ color: "#8f98a0", fontSize: "14px" }}>
                    Ai deja cont? <Link to="/login" style={{ color: "#66c0f4" }}>Loghează-te</Link>
                </p>
            </div>
        </div>
    );
}
