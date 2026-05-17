import { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";
import { useAuth } from "../context/AuthContext";


export default function UserProfile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { authTokens } = useAuth();

    useEffect(() => {
        // API Call to fetch the logged-in user's gamification profile
        // Note: This relies on the backend session cookie (or auth token if you use JWT)
        // Since we are setting up a frontend, we use fetch to call the endpoint created in Django
        const fetchProfile = async () => {
            if (!authTokens) {
                setError("You must be logged in to view your profile.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/profiles/me/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authTokens.access}`
                    }
                });

                if (response.status === 401 || response.status === 403) {
                    throw new Error("You must be logged in to view your profile.");
                }

                if (!response.ok) {
                    throw new Error("Failed to load profile data.");
                }

                const data = await response.json();

                // Tragem si toate achievement-urile globale pentru a le afisa pe cele blocate 
                const allAchResponse = await fetch("http://127.0.0.1:8000/api/achievements/");
                let globalAch = [];
                if (allAchResponse.ok) {
                    const achData = await allAchResponse.json();
                    globalAch = achData.results || achData;
                }

                // Tragem comenzile utilizatorului pentru istoricul comenzilor
                let orders = [];
                const ordersResponse = await fetch("http://127.0.0.1:8000/api/orders/", {
                    headers: { "Authorization": `Bearer ${authTokens.access}` }
                });
                if (ordersResponse.ok) {
                    const ordersData = await ordersResponse.json();
                    orders = ordersData.results || ordersData;
                }

                setProfileData({ ...data, globalAchievements: globalAch, orders });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [authTokens]);


    if (loading) {
        return <div className={styles.loading}>Loading Profile...</div>;
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <p style={{ fontSize: "14px", marginTop: "10px", color: "#8f98a0" }}>
                    (Make sure you are logged in using the backend or have a valid session!)
                </p>
            </div>
        );
    }

    if (!profileData) return null;

    const { username, level, xp, balance, title, next_level_progress, user_achievements, globalAchievements, orders } = profileData;

    // Calculăm lista completă de achievement-uri cu starea de 'unlocked'
    const displayAchievements = (globalAchievements || []).map(globalAch => {
        const isUnlocked = user_achievements?.some(ua => ua.achievement && ua.achievement.id === globalAch.id);
        return {
            ...globalAch,
            unlocked: isUnlocked
        };
    });

    // Filtrare comenzi după numărul comenzii sau numele produsului
    const filteredOrders = (orders || []).filter(order => {
        const query = searchQuery.toLowerCase();
        const orderNumMatch = (order.order_number || "").toLowerCase().includes(query);
        const itemMatch = (order.items || []).some(item =>
            (item.product_detail?.name || "").toLowerCase().includes(query)
        );
        return orderNumMatch || itemMatch;
    });

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>

                <div className={styles.header}>
                    <img
                        src={`https://ui-avatars.com/api/?name=${username}&background=2a475e&color=66c0f4&size=120`}
                        alt={`${username}'s avatar`}
                        className={styles.avatar}
                    />

                    <div className={styles.userInfo}>
                        <div className={styles.usernameWrapper}>
                            <div>
                                <h1 className={styles.username}>{username}</h1>
                                <p className={styles.title}>{title}</p>
                            </div>

                            <div className={styles.levelBadge}>
                                <span className={styles.levelLabel}>Level</span>
                                <div className={styles.levelIcon}>{level}</div>
                            </div>
                        </div>

                        <div className={styles.xpSection}>
                            <div className={styles.xpLabels}>
                                <span>Current XP: {xp}</span>
                                <span>Next Level: {next_level_progress}%</span>
                            </div>
                            <div className={styles.xpBarContainer}>
                                <div
                                    className={styles.xpBarFill}
                                    style={{ width: `${next_level_progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.statsRow}>
                    <div className={styles.statItem} style={{ width: '100%', alignItems: 'center', textAlign: 'center' }}>
                        <span className={styles.statLabel}>Total XP Earned</span>
                        <span className={styles.statValue} style={{ fontSize: '32px' }}>{xp}</span>
                    </div>
                </div>

                <div className={styles.ordersSection}>
                    <div className={styles.ordersHeader}>
                        <h2 className={styles.sectionTitle} style={{ borderBottom: 'none', marginBottom: 0 }}>Comenzile mele</h2>
                        <div className={styles.searchBox}>
                            <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8f98a0' }}></i>
                            <input
                                type="text"
                                placeholder="Caută"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.ordersList}>
                        {filteredOrders.length === 0 ? (
                            <p className={styles.textMuted}>Nu există comenzi pentru această căutare.</p>
                        ) : (
                            filteredOrders.map(order => {
                                const orderDate = new Date(order.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                return (
                                    <div key={order.id} className={styles.orderRow}>
                                        <div className={styles.orderImages}>
                                            {(order.items || []).slice(0, 3).map((item, idx) => (
                                                <div key={idx} className={styles.orderImageThumb}>
                                                    <img src={item.product_detail?.image || "/assets/img/placeholder.svg"} alt={item.product_detail?.name} />
                                                </div>
                                            ))}
                                            {(order.items || []).length > 3 && (
                                                <div className={styles.orderImageMore}>
                                                    +{(order.items || []).length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.orderDetailsGrid}>
                                            <div className={styles.orderDetailCol}>
                                                <span className={styles.detailLabel}>Formular de comandă</span>
                                                <span className={styles.detailValue}>{orderDate}</span>
                                            </div>
                                            <div className={styles.orderDetailCol}>
                                                <span className={styles.detailLabel}>Comanda #</span>
                                                <span className={styles.detailValue}>{order.order_number || `#${order.id}`}</span>
                                            </div>
                                            <div className={styles.orderDetailCol}>
                                                <span className={styles.detailLabel}>Preț total</span>
                                                <span className={styles.detailValue}>{parseFloat(order.total).toFixed(2)} RON</span>
                                            </div>
                                            <div className={styles.orderDetailCol}>
                                                <span className={styles.detailLabel}>Statut</span>
                                                <span className={styles.detailStatus}>închis(ă)</span>
                                            </div>
                                            <div className={styles.orderAction}>
                                                <button
                                                    className={styles.detailsBtn}
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    Detalii <i className="bi bi-arrow-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className={styles.achievementsSection}>
                    <h2 className={styles.sectionTitle}>Recent Achievements</h2>
                    <div className={styles.achievementsGrid}>
                        {displayAchievements.map((ach) => {
                            // Usually from the API relation, achievements means "unlocked"
                            // The logic below deals with mock vs real
                            const isUnlocked = ach.unlocked !== undefined ? ach.unlocked : true;

                            return (
                                <div key={ach.id} className={styles.achievementContainer}>
                                    <div
                                        className={`${styles.achievementBadge} ${!isUnlocked ? styles.locked : ''}`}
                                    >
                                        <div className={styles.achievementWrapper}>
                                            <img
                                                src={ach.icon_url || `https://ui-avatars.com/api/?name=${ach.name ? ach.name.substring(0, 1) : '?'}&background=${isUnlocked ? '66c0f4' : '2a475e'}&color=fff&size=64&bold=true`}
                                                alt={ach.name}
                                                className={styles.achievementIcon}
                                            />
                                            {ach.discount_percentage > 0 && (
                                                <div className={styles.couponBadge}>
                                                    -{ach.discount_percentage}%
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Custom Steam-style Tooltip */}
                                    <div className={`${styles.achievementTooltip} ${!isUnlocked ? styles.locked : ''}`}>
                                        <img
                                            src={ach.icon_url || `https://ui-avatars.com/api/?name=${ach.name ? ach.name.substring(0, 1) : '?'}&background=${isUnlocked ? '66c0f4' : '2a475e'}&color=fff&size=64&bold=true`}
                                            alt={ach.name}
                                            className={styles.tooltipIcon}
                                        />
                                        <div className={styles.tooltipContent}>
                                            <h4 className={styles.tooltipName}>{ach.name}</h4>
                                            <p className={styles.tooltipDesc}>{ach.description}</p>
                                            <span className={styles.tooltipStatus}>
                                                {isUnlocked ? "Unlocked" : "Locked"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Receipt Modal */}
            {selectedOrder && (
                <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-4">
                            <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-3" style={{ width: "64px", height: "64px" }}>
                                <i className="bi bi-check-lg" style={{ fontSize: "2rem" }}></i>
                            </div>
                            <h2 className="h4 text-white mb-1">Chitanță Comandă</h2>
                            <p className="text-muted small mb-0">{selectedOrder.order_number || `#${selectedOrder.id}`}</p>
                            <p className="text-muted small">{new Date(selectedOrder.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>

                        <div className="receipt-details bg-dark p-4 rounded mb-4 border border-secondary border-opacity-25 shadow-sm">
                            <h6 className="text-uppercase text-muted small fw-bold mb-3 letter-spacing-1">Sumar Plată</h6>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-white-50">Subtotal</span>
                                <span className="text-white">{parseFloat(selectedOrder.total).toFixed(2)} RON</span>
                            </div>

                            <div className="d-flex justify-content-between mt-3 pt-3 border-top border-secondary border-opacity-50">
                                <strong className="text-white">Total</strong>
                                <strong className="text-white fs-5">{parseFloat(selectedOrder.total).toFixed(2)} RON</strong>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h6 className="text-uppercase text-muted small fw-bold mb-3 letter-spacing-1">Produse ({selectedOrder.items?.length || 0})</h6>
                            <ul className="list-group list-group-flush bg-transparent">
                                {selectedOrder.items?.map((item, idx) => (
                                    <li key={idx} className="list-group-item bg-transparent text-white border-secondary border-opacity-25 px-0 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-3">
                                            <img src={item.product_detail?.image || "/assets/img/placeholder.svg"} alt={item.product_detail?.name} style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: '#fff', borderRadius: '4px' }} />
                                            <span>
                                                {item.product_detail?.name}
                                                <small className="text-info ms-2">x{item.qty}</small>
                                            </span>
                                        </div>
                                        <span>{(parseFloat(item.price) * item.qty).toFixed(2)} RON</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="d-grid gap-2">
                            <button onClick={() => setSelectedOrder(null)} className="btn btn-outline-light py-2 rounded-pill fw-bold">
                                Închide
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
