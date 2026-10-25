import { parseMonetaryValue } from './payment.service.js';

/**
 * Financial analytics and aggregation service.
 * Handles transaction monetary resolution, status classification,
 * revenue summarization, and time-series aggregation.
 */

export const SUCCESS_PAYMENT_STATUSES = new Set(['success', 'successful', 'paid', 'completed', 'complete']);
export const FAILED_PAYMENT_STATUSES = new Set(['failed', 'cancelled', 'canceled', 'error', 'expired']);
export const STALE_PENDING_MINUTES = Number(process.env.FINANCE_PENDING_FAIL_AFTER_MINUTES ?? 0);

export const normalizeStatus = (value) => String(value || '').trim().toLowerCase();

export const isStalePending = (createdAt) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return true;
  const ageMs = Date.now() - date.getTime();
  return ageMs >= STALE_PENDING_MINUTES * 60 * 1000;
};

export const normalizeFinanceStatus = (status, createdAt) => {
  const normalized = normalizeStatus(status);
  if (SUCCESS_PAYMENT_STATUSES.has(normalized)) return 'success';
  if (FAILED_PAYMENT_STATUSES.has(normalized)) return 'failed';
  if (normalized === 'pending') {
    return isStalePending(createdAt) ? 'failed' : 'pending';
  }
  return 'failed';
};

export const resolveTransactionDate = (transaction) => {
  return (
    transaction?.createdAt ||
    transaction?.created_at ||
    transaction?.updatedAt ||
    transaction?.updated_at ||
    transaction?.date ||
    null
  );
};

export const resolveTransactionAmount = (transaction) => {
  const amount = parseMonetaryValue(
    transaction?.amount ??
      transaction?.total_amount ??
      transaction?.paid_amount ??
      transaction?.charged_amount
  );

  if (amount > 0) return amount;
  return parseMonetaryValue(transaction?.orderId?.totalPrice);
};

export const extractChapaTransactions = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.transactions)) return payload.data.transactions;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.transactions)) return payload.transactions;
  return [];
};

export const normalizeChapaTransaction = (transaction = {}, index = 0) => {
  const txRef =
    transaction?.tx_ref ||
    transaction?.reference ||
    transaction?.ref_id ||
    transaction?.id ||
    `chapa-${index}`;

  const resolvedStatus = normalizeStatus(
    transaction?.status || transaction?.payment_status || transaction?.transaction_status
  );
  const transactionDate = resolveTransactionDate(transaction);

  const firstName = transaction?.first_name || transaction?.customer?.first_name || '';
  const lastName = transaction?.last_name || transaction?.customer?.last_name || '';
  const customerName = `${firstName} ${lastName}`.trim();
  const customerEmail = transaction?.email || transaction?.customer?.email || '';

  return {
    _id: String(transaction?.id || txRef),
    tx_ref: String(txRef),
    amount: resolveTransactionAmount(transaction),
    currency: String(transaction?.currency || 'ETB').toUpperCase(),
    status: normalizeFinanceStatus(resolvedStatus, transactionDate),
    chapa_reference: transaction?.reference || transaction?.chapa_reference || null,
    createdAt: transactionDate,
    userId: {
      _id: String(transaction?.customer?.id || customerEmail || txRef),
      name: customerName || customerEmail || 'Chapa Customer'
    },
    source: 'chapa'
  };
};

export const computeFinancialMetrics = (transactions = []) => {
  let totalRevenue = 0;
  let successCount = 0;
  let pendingCount = 0;
  let failedCount = 0;

  for (const tx of transactions) {
    const status = normalizeFinanceStatus(tx.status, resolveTransactionDate(tx));
    const amount = resolveTransactionAmount(tx);

    if (status === 'success') {
      totalRevenue += amount;
      successCount++;
    } else if (status === 'pending') {
      pendingCount++;
    } else {
      failedCount++;
    }
  }

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    successCount,
    pendingCount,
    failedCount,
    totalTransactions: transactions.length
  };
};

export default {
  SUCCESS_PAYMENT_STATUSES,
  FAILED_PAYMENT_STATUSES,
  normalizeStatus,
  normalizeFinanceStatus,
  resolveTransactionDate,
  resolveTransactionAmount,
  extractChapaTransactions,
  normalizeChapaTransaction,
  computeFinancialMetrics
};
