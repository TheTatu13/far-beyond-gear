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
        // Dacă e deja logat, nu are ce căuta pe pagina de login
        if (user) {
            navigate('/profile');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await loginUser(username, password);
        if (result.success) {
            trackLogin();
            toast.success("Te-ai autentificat cu succes!");
            navigate('/profile');
        } else {
            toast.error(result.message || "Eroare la autentificare.");
        }
        setIsLoading(false);
    };

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div
                className="card p-4 shadow-lg text-white"
                style={{ width: "100%", maxWidth: "450px", backgroundColor: "#171a21", border: "1px solid #2a475e" }}
            >
                <h2 className="text-center mb-4" style={{ fontWeight: 300 }}>Autentificare</h2>

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

                    <div className="mb-4">
                        <label className="form-label" style={{ color: "#8f98a0" }}>Parolă</label>
                        <input
                            type="password"
                            className="form-control"
                            style={{ backgroundColor: "#1b2838", color: "#fff", borderColor: "#3d4450" }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 fw-bold"
                        style={{ backgroundImage: "linear-gradient(90deg, #2a475e 0%, #66c0f4 100%)", color: "#fff", border: "none" }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Se autentifică..." : "Log In"}
                    </button>
                </form>

                <p className="text-center mt-4 mb-0" style={{ color: "#8f98a0", fontSize: "14px" }}>
                    Nu ai cont încă? <Link to="/register" style={{ color: "#66c0f4" }}>Înregistrează-te</Link>
                </p>
            </div>
        </div>
    );
}
