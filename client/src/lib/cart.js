const STORAGE_KEY = "cart";
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn());
}

export function subscribeCart(fn) {
  listeners.add(fn);
}

export function unsubscribeCart(fn) {
  listeners.delete(fn);
}

export function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  emit();
}

export function getCartCount() {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
}

export function addToCart(product) {
  if (!product?.id) return;
  const cart = loadCart();
  const existing = cart.find((c) => c.id === product.id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      brand: product.brand?.name || "",
      image: product.image || "",
      qty: 1
    });
  }
  saveCart(cart);
}

export function updateQty(id, qty) {
  const cart = loadCart();
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  const val = Math.max(1, Number(qty) || 1);
  item.qty = val;
  saveCart(cart);
}

export function removeFromCart(id) {
  const cart = loadCart().filter((c) => c.id !== id);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function cartTotals() {
  const cart = loadCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  return { subtotal, total: subtotal };
}
