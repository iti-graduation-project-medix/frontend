import { useEffect, useState } from 'react';

// Simple utility functions
const isOnline = () => navigator.onLine;
const isOffline = () => !navigator.onLine;

export const usePWA = () => {
  const [isOnlineStatus, setIsOnlineStatus] = useState(isOnline());

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnlineStatus(isOnline());
    };

    // Set initial status
    updateOnlineStatus();

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Cleanup function
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return {
    isOnline: isOnlineStatus,
    isOffline: !isOnlineStatus
  };
};

export const useOfflineDetection = () => {
  const [isOfflineStatus, setIsOfflineStatus] = useState(isOffline());

  useEffect(() => {
    const updateOfflineStatus = () => {
      setIsOfflineStatus(isOffline());
    };

    // Set initial status
    updateOfflineStatus();

    // Add event listeners
    window.addEventListener('online', updateOfflineStatus);
    window.addEventListener('offline', updateOfflineStatus);

    // Cleanup function
    return () => {
      window.removeEventListener('online', updateOfflineStatus);
      window.removeEventListener('offline', updateOfflineStatus);
    };
  }, []);

  return isOfflineStatus;
};
