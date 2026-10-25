/**
 * Mesob Market - Brand Configuration and Title Formatting Utilities
 */

export const BRAND_NAME = 'Mesob Market';
export const BRAND_TAGLINE = 'Ethiopian E-Commerce Platform';
export const BRAND_FULL_TITLE = `${BRAND_NAME} — ${BRAND_TAGLINE}`;

export const LOGO_SIZE_MAP = {
  sm: 'h-8 sm:h-9 md:h-10 lg:h-11',
  md: 'h-20 sm:h-22 md:h-24 lg:h-26 xl:h-28',
  lg: 'h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40'
};

/**
 * Formats a page-specific title with standard brand suffix.
 * @param {string} [pageTitle] - Optional page title prefix
 * @returns {string} Formatted title string
 */
export function formatPageTitle(pageTitle) {
  if (!pageTitle || typeof pageTitle !== 'string' || !pageTitle.trim()) {
    return BRAND_FULL_TITLE;
  }
  return `${pageTitle.trim()} | ${BRAND_NAME}`;
}

/**
 * Returns Tailwind size classes for logo rendering.
 * @param {'sm' | 'md' | 'lg'} [size='md']
 * @returns {string}
 */
export function getLogoSizeClasses(size = 'md') {
  return LOGO_SIZE_MAP[size] || LOGO_SIZE_MAP.md;
}

export default {
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_FULL_TITLE,
  LOGO_SIZE_MAP,
  formatPageTitle,
  getLogoSizeClasses
};
