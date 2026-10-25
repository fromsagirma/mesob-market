import crypto from 'crypto';

/**
 * Chapa payment gateway integration and transaction resolution service.
 */

export const SUCCESS_PAYMENT_STATUSES = new Set(['success', 'successful', 'paid', 'completed', 'complete']);
export const FAILED_PAYMENT_STATUSES = new Set(['failed', 'cancelled', 'canceled', 'error', 'expired']);

export const normalizeStatus = (value) => String(value || '').trim().toLowerCase();

export const parseMonetaryValue = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/[^0-9.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const resolvePaymentStatus = (payload) => {
  const apiStatus = normalizeStatus(payload?.status);
  const paymentStatus = normalizeStatus(payload?.data?.status);
  const resolved = paymentStatus || apiStatus;

  if (SUCCESS_PAYMENT_STATUSES.has(resolved)) return 'success';
  if (FAILED_PAYMENT_STATUSES.has(resolved)) return 'failed';
  return 'pending';
};

export const verifyWebhookSignature = (body, signature, secretKey) => {
  if (!signature || !secretKey) return false;
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(typeof body === 'string' ? body : JSON.stringify(body))
    .digest('hex');
  return hash === signature;
};

export const clearUserCartAfterPayment = async (userId, cartModel = null) => {
  if (!userId) return null;
  const Model = cartModel || (await import('../models/cart.model.js')).default;
  return Model.findOneAndUpdate(
    { user: userId },
    { items: [], totalPrice: 0 },
    { new: true }
  );
};

export default {
  SUCCESS_PAYMENT_STATUSES,
  FAILED_PAYMENT_STATUSES,
  normalizeStatus,
  parseMonetaryValue,
  resolvePaymentStatus,
  verifyWebhookSignature,
  clearUserCartAfterPayment
};
