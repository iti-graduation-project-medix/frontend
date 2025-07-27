import { useOffline } from "@/hooks/useOffline";
import OfflinePage from "./OfflinePage";
import React from "react";

export default function OfflineRouteGuard({ children }) {
  const isOffline = useOffline();
  const currentPath = window.location.pathname;
  if (isOffline && currentPath !== "/") {
    return <OfflinePage />;
  }
  return children;
}
