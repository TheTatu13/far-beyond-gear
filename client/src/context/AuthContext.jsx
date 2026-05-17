import { createContext, useState, useEffect, useContext } from 'react';

// Creăm contextul
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens')
            ? JSON.parse(localStorage.getItem('authTokens'))
            : null
    );
    const [loading, setLoading] = useState(true);

    // Funcție de login
    const loginUser = async (username, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setAuthTokens(data);
                setUser(parseJwt(data.access)); // Decodează JWT pentru a extrage info
                localStorage.setItem('authTokens', JSON.stringify(data));
                return { success: true };
            } else {
                return { success: false, message: data.detail || 'Eroare la autentificare.' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Eroare de conexiune la server.' };
        }
    };

    // Funcție de register
    const registerUser = async (username, email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Logăm automat userul după înregistrare
                return await loginUser(username, password);
            } else {
                // Construiește un mesaj de eroare din răspunsul DRF
                const errorMsg = Object.values(data).flat().join(' ');
                return { success: false, message: errorMsg || 'Eroare la înregistrare.' };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Eroare de conexiune.' };
        }
    };

    // Funcție de logout
    const logoutUser = async () => {
        if (authTokens?.refresh) {
            try {
                await fetch('http://127.0.0.1:8000/api/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh: authTokens.refresh }),
                });
            } catch (err) {
                console.error('Logout error:', err);
            }
        }
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    };

    // Funcție de refresh token
    const updateToken = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: authTokens?.refresh }),
            });

            const data = await response.json();

            if (response.ok) {
                const newTokens = { ...authTokens, access: data.access };
                setAuthTokens(newTokens);
                setUser(parseJwt(data.access));
                localStorage.setItem('authTokens', JSON.stringify(newTokens));
                return true;
            } else {
                logoutUser();
                return false;
            }
        } catch (error) {
            console.error('Refresh token error:', error);
            return false;
        }
    };

    // Utilitate pentru a decoda JWT (ca să extragem user id/name dacă există in token payload)
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    // La încărcarea aplicației, dacă avem token, setăm userul
    useEffect(() => {
        if (authTokens) {
            setUser(parseJwt(authTokens.access));
        }
        setLoading(false);
    }, [authTokens]);

    // Interval pentru refresh automat (la fiecare 4 minute)
    useEffect(() => {
        if (authTokens) {
            const fourMinutes = 1000 * 60 * 4;
            const interval = setInterval(() => {
                updateToken();
            }, fourMinutes);
            return () => clearInterval(interval);
        }
    }, [authTokens]);

    const contextData = {
        user,
        authTokens,
        token: authTokens?.access ?? null,
        loginUser,
        registerUser,
        logoutUser,
        updateToken,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook personalizat
export const useAuth = () => {
    return useContext(AuthContext);
};
