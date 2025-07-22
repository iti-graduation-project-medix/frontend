import { useEffect, useState } from "react";
import MainLayout from "./layouts/MainLayout";
import OfflinePage from "./components/OfflinePage";
import InstallApp from "./components/InstallApp";
import LoadingScreen from "./components/LoadingScreen";
import { useOffline } from "./hooks/useOffline";
import { initializeStores } from "./utils/stateManager";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isOffline = useOffline();
  const currentPath = window.location.pathname;

  // Initialize stores when the app loads
  useEffect(() => {
    initializeStores();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // // Show loading screen first
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  if (isOffline && currentPath === "/") {
    return (
      <>
        <MainLayout />
        <InstallApp />
      </>
    );
  }

  if (isOffline && currentPath !== "/") {
    return (
      <>
        <OfflinePage />
        <InstallApp />
      </>
    );
  }

  return (
    <>
      <MainLayout />
      <InstallApp />
    </>
  );
}
