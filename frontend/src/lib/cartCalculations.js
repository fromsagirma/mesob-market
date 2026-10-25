/**
 * Mesob Market - Pure Shopping Cart Transformation & Calculation Utilities
 */

export const resolveProductId = (item) => {
  if (!item) return null;
  return item?.product?._id || item?.product || item?.productId?._id || item?.productId || item?.id || null;
};

/**
 * Merges a new item into the cart items list, incrementing quantity if already present.
 */
export function mergeCartItem(items = [], newItem) {
  const currentList = Array.isArray(items) ? [...items] : [];
  const targetId = resolveProductId(newItem);

  if (!targetId) {
    throw new Error('Invalid product data');
  }

  const existingIndex = currentList.findIndex(i => resolveProductId(i) === targetId);
  const quantityToAdd = Math.max(1, Number(newItem.quantity) || 1);

  if (existingIndex > -1) {
    currentList[existingIndex] = {
      ...currentList[existingIndex],
      quantity: currentList[existingIndex].quantity + quantityToAdd
    };
  } else {
    currentList.push({
      ...newItem,
      quantity: quantityToAdd
    });
  }

  return currentList;
}

/**
 * Updates the quantity for a specific product item.
 */
export function updateCartItemQuantity(items = [], productId, quantity) {
  const newQty = Number(quantity);
  if (newQty <= 0) {
    return removeCartItem(items, productId);
  }

  return (items || []).map(item => {
    if (resolveProductId(item) === productId) {
      return { ...item, quantity: newQty };
    }
    return item;
  });
}

/**
 * Removes an item by product ID.
 */
export function removeCartItem(items = [], productId) {
  return (items || []).filter(item => resolveProductId(item) !== productId);
}

/**
 * Sanitizes items and calculates total price.
 */
export function calculateCartTotals(items = []) {
  const sanitized = (items || [])
    .map(i => {
      const prodId = resolveProductId(i);
      const price = Number(i.price) || 0;
      const qty = Math.max(0, Number(i.quantity) || 0);
      return {
        product: prodId,
        quantity: qty,
        price,
        color: i.color
      };
    })
    .filter(i => Boolean(i.product));

  const totalPrice = sanitized.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  return {
    items: sanitized,
    totalPrice: Number(totalPrice.toFixed(2)),
    totalCount: sanitized.reduce((acc, curr) => acc + curr.quantity, 0)
  };
}

export default {
  resolveProductId,
  mergeCartItem,
  updateCartItemQuantity,
  removeCartItem,
  calculateCartTotals
};
