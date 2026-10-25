import React from 'react';
import Skeleton from './ui/Skeleton';

/**
 * Product Card Skeleton component to provide responsive visual feedback during data fetching.
 */
export const ProductCardSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-4 shadow-sm"
    >
      {/* Product Image Skeleton */}
      <Skeleton className="w-full h-48 rounded-xl" />

      {/* Category & Rating Row */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-4 rounded-md" />
        <Skeleton className="w-12 h-4 rounded-md" />
      </div>

      {/* Title */}
      <Skeleton className="w-3/4 h-5 rounded-md" />

      {/* Description Snippet */}
      <Skeleton className="w-full h-3.5 rounded-md" />
      <Skeleton className="w-2/3 h-3.5 rounded-md" />

      {/* Price and Action Button */}
      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <Skeleton className="w-24 h-6 rounded-md" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
