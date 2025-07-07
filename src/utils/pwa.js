// PWA Utilities for offline/online handling

export const isOnline = () => {
  return navigator.onLine;
};

export const isOffline = () => {
  return !navigator.onLine;
};

export const showOfflinePage = () => {
  // Only show offline page if we're actually offline
  if (isOffline()) {
    window.location.href = '/offline.html';
  }
};

export const handleOnlineStatus = () => {
  const handleOnline = () => {
    console.log('Back online!');
    // Redirect to home page when back online
    if (window.location.pathname === '/offline.html') {
      window.location.href = '/';
    }
  };

  const handleOffline = () => {
    console.log('Gone offline!');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

export const checkNetworkStatus = async () => {
  try {
    const response = await fetch('/api/health', {
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const navigateToHome = () => {
  window.location.href = '/';
};

export const retryConnection = async () => {
  const isConnected = await checkNetworkStatus();
  if (isConnected) {
    navigateToHome();
    return true;
  }
  return false;
};
