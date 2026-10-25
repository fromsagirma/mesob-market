import { useEffect } from 'react';

/**
 * Custom hook to manage document head title dynamically.
 * Appends standard branding suffix '| Mesob Market'.
 */
export const useDocumentTitle = (title, preserveOnUnmount = false) => {
  useEffect(() => {
    const defaultTitle = 'Mesob Market — Ethiopian E-Commerce Platform';
    const formattedTitle = title ? `${title} | Mesob Market` : defaultTitle;
    const previousTitle = document.title;

    document.title = formattedTitle;

    return () => {
      if (!preserveOnUnmount) {
        document.title = previousTitle || defaultTitle;
      }
    };
  }, [title, preserveOnUnmount]);
};

export default useDocumentTitle;
