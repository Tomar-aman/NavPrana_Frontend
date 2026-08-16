/**
 * Cart for shoppers who are not signed in.
 *
 * Rows are stored in the SAME shape the cart API returns
 * ({ id, product, product_detail, quantity }) so the cart and checkout screens
 * render local and server carts through one code path. On guest checkout the
 * rows get pushed to /cart/sync/ and this store is cleared.
 */

const STORAGE_KEY = "navprana_guest_cart";

const canUseStorage = () =>
  typeof window !== "undefined" && Boolean(window.localStorage);

const read = () => {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt or unreadable (private mode) — behave as an empty cart.
    return [];
  }
};

const write = (items) => {
  if (!canUseStorage()) return items;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota or private mode — the in-memory Redux copy still works this session.
  }
  return items;
};

/** Local rows carry a string id so they never collide with server row ids. */
const localId = (productId) => `guest-${productId}`;

/** Trim a full product object down to what the cart UI renders. */
const toProductDetail = (product) => ({
  id: product.id,
  name: product.name,
  size: product.size,
  price: product.price,
  max_price: product.max_price,
  discount_precent: product.discount_precent,
  images: product.images || [],
});

export const getGuestCart = () => read();

export const addGuestItem = (product, quantity = 1) => {
  const items = read();
  const existing = items.find((item) => item.product === product.id);

  if (existing) {
    existing.quantity += quantity;
    existing.product_detail = toProductDetail(product);
  } else {
    items.push({
      id: localId(product.id),
      product: product.id,
      product_detail: toProductDetail(product),
      quantity,
    });
  }

  return write(items);
};

export const updateGuestQuantity = (rowId, quantity) => {
  const items = read().map((item) =>
    item.id === rowId ? { ...item, quantity: Math.max(1, quantity) } : item,
  );
  write(items);
  return items.find((item) => item.id === rowId);
};

export const removeGuestItem = (rowId) =>
  write(read().filter((item) => item.id !== rowId));

export const clearGuestCart = () => write([]);

/** Payload shape expected by POST /api/v1/cart/sync/ */
export const guestCartSyncPayload = () =>
  read().map(({ product, quantity }) => ({ product, quantity }));
