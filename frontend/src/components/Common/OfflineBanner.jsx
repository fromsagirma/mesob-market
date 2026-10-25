import React from 'react';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { WifiOff } from 'lucide-react';

/**
 * Accessible offline notification banner.
 * Displays when network connection drops to alert the user about offline mode.
 */
export const OfflineBanner = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-[999] px-4 py-2.5 bg-amber-500 text-amber-950 font-medium text-xs sm:text-sm rounded-full shadow-lg flex items-center gap-2 border border-amber-600/30 animate-bounce"
    >
      <WifiOff size={16} className="shrink-0" />
      <span>You are currently offline. Viewing cached catalog items.</span>
    </div>
  );
};

export default OfflineBanner;
