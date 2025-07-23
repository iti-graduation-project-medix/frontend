import React, { useEffect } from 'react';
import { useSubscribe } from '@/store/useSubscribe';
import { useAuth } from '@/store/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingPage } from '@/components/ui/loading';

export default function SubscriptionRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const currentSubscription = useSubscribe(state => state.currentSubscription);
  const subscriptionLoading = useSubscribe(state => state.subscriptionLoading);
  const fetchCurrentSubscription = useSubscribe(state => state.fetchCurrentSubscription);
  const location = useLocation();

  // Always fetch subscription on mount and on route change
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentSubscription();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return children;
  }

  const isSubscribed =
    currentSubscription && currentSubscription.status === true;

  // If we don't know yet (still loading or currentSubscription is null), show loading
  if (subscriptionLoading || typeof subscriptionLoading === 'undefined' || currentSubscription === null) {
    return <LoadingPage message="Checking subscription..." />;
  }

  // If we know the user is not subscribed, redirect
  if (!isSubscribed) {
    return <Navigate to="/subscription?reason=not_subscribed" />;
  }

  // If we know the user is subscribed, allow access
  return children;
} 