import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found Page for unmatched client-side routes.
 */
export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-4xl mb-8 shadow-inner">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Explore our marketplace catalog or return to the storefront.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition shadow-sm"
          >
            Back to Home
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl text-sm border border-gray-200 dark:border-gray-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
