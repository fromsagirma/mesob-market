import React from 'react';

/**
 * Atomic skeleton loading placeholder with subtle pulse animation.
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
