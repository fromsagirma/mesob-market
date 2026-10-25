/**
 * Mesob Market - Pagination Calculation Utilities
 */

/**
 * Calculates total number of pages.
 * @param {number} total - Total item count
 * @param {number} pageSize - Number of items per page
 * @returns {number} Total pages (at least 1)
 */
export function calculateTotalPages(total = 0, pageSize = 12) {
  const safeTotal = Math.max(0, Number(total) || 0);
  const safePageSize = Math.max(1, Number(pageSize) || 12);
  return Math.ceil(safeTotal / safePageSize) || 1;
}

/**
 * Generates an array of page numbers and ellipsis indicators for pagination controls.
 * @param {number} current - Currently active page
 * @param {number} totalPages - Total number of pages
 * @param {number} [delta=1] - Number of adjacent page buttons to show around current
 * @returns {Array<number | string>} Array of numbers and '…'
 */
export function calculatePaginationPages(current = 1, totalPages = 1, delta = 1) {
  const safeCurrent = Math.max(1, Math.min(totalPages, Number(current) || 1));
  if (totalPages <= 1) return [1];

  const pages = [];
  pages.push(1);

  const left = safeCurrent - delta;
  const right = safeCurrent + delta;

  if (left > 2) {
    pages.push('…');
  }

  for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
    pages.push(i);
  }

  if (right < totalPages - 1) {
    pages.push('…');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export function hasPreviousPage(current) {
  return (Number(current) || 1) > 1;
}

export function hasNextPage(current, totalPages) {
  return (Number(current) || 1) < (Number(totalPages) || 1);
}

export default {
  calculateTotalPages,
  calculatePaginationPages,
  hasPreviousPage,
  hasNextPage
};
