/**
 * Currency formatting utility with primary support for Ethiopian Birr (ETB).
 */

export const formatCurrency = (amount, currency = 'ETB') => {
  const numericAmount = typeof amount === 'number' ? amount : Number(amount) || 0;

  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
    .format(numericAmount)
    .replace('ETB', 'ETB ');
};

export const formatETB = (amount) => {
  const numericAmount = typeof amount === 'number' ? amount : Number(amount) || 0;
  return `ETB ${numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatCompactETB = (amount) => {
  const numeric = typeof amount === 'number' ? amount : Number(amount) || 0;
  if (numeric >= 1_000_000) {
    return `${(numeric / 1_000_000).toFixed(1)}M ETB`;
  }
  if (numeric >= 1_000) {
    return `${(numeric / 1_000).toFixed(1)}K ETB`;
  }
  return `${numeric.toFixed(0)} ETB`;
};

export default {
  formatCurrency,
  formatETB,
  formatCompactETB
};
