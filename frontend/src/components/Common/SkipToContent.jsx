import React from 'react';

/**
 * Accessible Skip to Content anchor for keyboard and screen-reader users (WCAG 2.1 AA).
 * Stays visually hidden until focused via Tab key.
 */
export const SkipToContent = ({ targetId = 'main-content' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabIndex', '-1');
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-emerald-600 focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-400 transition"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
