import React, { useEffect, useRef } from 'react';
import { useSubscribe } from '@/store/useSubscribe';
import { useAuth } from '@/store/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export default function SubscriptionRoute({ children }) {
  const { isAuthenticated } = useAuth(state => state);
  const { currentSubscription, fetchCurrentSubscription, subscriptionLoading } = useSubscribe();
  const location = useLocation();
  const toastShownRef = useRef({});

  // Always refetch subscription when route changes if missing or expired
  useEffect(() => {
    if (
      isAuthenticated &&
      (!currentSubscription || !currentSubscription.status) &&
      !subscriptionLoading
    ) {
      fetchCurrentSubscription();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    // Only show toast once per location (route)
    if (
      !subscriptionLoading &&
      (!currentSubscription || !currentSubscription.status)
    ) {
      if (!toastShownRef.current[location.pathname]) {
        toast.error('Please subscribe to use our services.');
        toastShownRef.current[location.pathname] = true;
      }
    }
  }, [currentSubscription, subscriptionLoading, location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (subscriptionLoading) {
    return null;
  }

  if (!currentSubscription || !currentSubscription.status) {
    return <Navigate to="/subscription" />;
  }

  return children;
} 