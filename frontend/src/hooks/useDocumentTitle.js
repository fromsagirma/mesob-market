import { useEffect } from 'react';
import { formatPageTitle, BRAND_FULL_TITLE } from '../lib/brand.js';

/**
 * Custom hook to manage document head title dynamically.
 * Appends standard branding suffix '| Mesob Market'.
 */
export const useDocumentTitle = (title, preserveOnUnmount = false) => {
  useEffect(() => {
    const formattedTitle = formatPageTitle(title);
    const previousTitle = document.title;

    document.title = formattedTitle;

    return () => {
      if (!preserveOnUnmount) {
        document.title = previousTitle || BRAND_FULL_TITLE;
      }
    };
  }, [title, preserveOnUnmount]);
};

export default useDocumentTitle;
