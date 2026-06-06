import { useEffect, useState } from "react";
import { loadCart, updateQty, removeFromCart, clearCart, cartTotals } from "../lib/cart.js";
import { Link } from "react-router-dom";

export default function Cart() {
  const [items, setItems] = useState(loadCart());
  const [totals, setTotals] = useState(cartTotals());

  useEffect(() => {
    const handler = () => {
      setItems(loadCart());
      setTotals(cartTotals());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleQtyChange = (id, val) => {
    updateQty(id, val);
    setItems(loadCart());
    setTotals(cartTotals());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setItems(loadCart());
    setTotals(cartTotals());
  };

  const handleClear = () => {
    clearCart();
    setItems([]);
    setTotals(cartTotals());
  };

  return (
    <div className="container py-5 page-cart">
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <p className="section-title mb-1">Coșul tău</p>
          <h1 className="h4 text-white mb-0">Produse selectate</h1>
        </div>
        <div>
          <Link to="/products" className="btn btn-outline-light btn-sm">
            Continuă cumpărăturile
          </Link>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="alert alert-info">
          Coșul este gol. <Link to="/products">Începe cumpărăturile.</Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="table-responsive surface-card p-3">
              <table className="table table-cart align-middle">
                <thead>
                  <tr>
                    <th>Produs</th>
                    <th>Preț</th>
                    <th>Cantitate</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.image || "/assets/img/placeholder.svg"}
                              alt={item.name}
                              width="64"
                              height="64"
                              style={{ objectFit: "cover", borderRadius: "8px" }}
                            />
                          <div>
                            <div className="fw-semibold text-white">{item.name}</div>
                            <div className="text-muted small">{item.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td>{Number(item.price || 0).toFixed(2)} €</td>
                      <td style={{ maxWidth: "120px" }}>
                        <input
                          type="number"
                          min="1"
                          className="form-control form-control-sm"
                          value={item.qty || 1}
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        />
                      </td>
                      <td>{(Number(item.price || 0) * (item.qty || 1)).toFixed(2)} €</td>
                      <td>
                        <button className="btn btn-link text-danger" onClick={() => handleRemove(item.id)}>
                          Șterge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="surface-card p-4 total-summary border border-primary border-opacity-10 shadow-lg" style={{ borderRadius: '16px' }}>
              <h5 className="mb-3 text-white fw-bold">Rezumat Comandă</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="opacity-75">Subtotal</span>
                <span className="fw-bold">{totals.subtotal.toFixed(2)} €</span>
              </div>
              <div className="d-flex justify-content-between mb-4 pb-2 border-bottom border-secondary border-opacity-25">
                <span className="text-white fw-bold fs-5">Total</span>
                <span className="text-primary fw-bold fs-5">{totals.total.toFixed(2)} €</span>
              </div>
              <div className="d-grid gap-3">
                <Link to="/checkout" className="btn btn-primary btn-lg py-3 fw-bold rounded-pill shadow">
                  Continuă la checkout
                </Link>
                <button className="btn btn-link text-muted btn-sm" onClick={handleClear}>
                  Golește coșul
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
