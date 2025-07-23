import React, { useEffect, useRef } from 'react';
import { useSubscribe } from '@/store/useSubscribe';
import { useAuth } from '@/store/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingPage } from '@/components/ui/loading';
import { toast } from 'sonner';

export default function SubscriptionRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const {
    currentSubscription,
    fetchCurrentSubscription,
    subscriptionLoading,
  } = useSubscribe();
  const location = useLocation();
  const toastShownRef = useRef({});

  // Always fetch subscription on mount and on route change
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentSubscription();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, location.pathname]);

  // Show loading spinner while fetching
  if (subscriptionLoading || typeof subscriptionLoading === 'undefined') {
    return <LoadingPage message="Checking subscription..." />;
  }

  // If not authenticated, let login guard handle it
  if (!isAuthenticated) {
    return children;
  }

  // If not subscribed, show toast and redirect
  const isSubscribed =
    currentSubscription &&
    (currentSubscription.status === true || currentSubscription.status === 'active');

  if (!isSubscribed) {
    // Only add query param to signal redirect reason
    return <Navigate to="/subscription?reason=not_subscribed" />;
  }

  // If subscribed, render children
  return children;
} 