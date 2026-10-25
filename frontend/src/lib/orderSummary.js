/**
 * Mesob Market - Order Fee, Tax, and Shipping Calculation Utilities
 */

export const DEFAULT_TAX_RATE = 0.08; // 8% VAT
export const FREE_SHIPPING_THRESHOLD = 1500; // Free shipping on orders >= 1,500 ETB
export const STANDARD_SHIPPING_FEE = 150; // 150 ETB standard delivery

/**
 * Calculates comprehensive order breakdown including taxes and delivery fee.
 * @param {object} params
 * @param {number} params.subtotal - Cart subtotal amount
 * @param {number} [params.taxRate=0.08] - Tax rate decimal (e.g. 0.08 for 8%)
 * @param {number} [params.discount=0] - Promo or discount deduction
 * @param {boolean} [params.includeShipping=false] - Whether to apply delivery shipping fee
 * @returns {object} Breakdown of subtotal, tax, shipping, discount, and grand total
 */
export function calculateOrderSummary({
  subtotal = 0,
  taxRate = DEFAULT_TAX_RATE,
  discount = 0,
  includeShipping = false
} = {}) {
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);
  const safeTaxRate = Math.max(0, Number(taxRate) || 0);
  const safeDiscount = Math.max(0, Math.min(safeSubtotal, Number(discount) || 0));

  const discountedSubtotal = safeSubtotal - safeDiscount;
  const tax = Number((discountedSubtotal * safeTaxRate).toFixed(2));

  let shipping = 0;
  if (includeShipping && safeSubtotal > 0) {
    shipping = safeSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  }

  const grandTotal = Number((discountedSubtotal + tax + shipping).toFixed(2));

  return {
    subtotal: Number(safeSubtotal.toFixed(2)),
    discount: Number(safeDiscount.toFixed(2)),
    discountedSubtotal: Number(discountedSubtotal.toFixed(2)),
    taxRate: safeTaxRate,
    tax,
    shipping,
    isFreeShipping: shipping === 0 && safeSubtotal > 0,
    grandTotal
  };
}

export default {
  DEFAULT_TAX_RATE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  calculateOrderSummary
};
