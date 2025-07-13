import MainLayout from "./layouts/MainLayout";
import OfflinePage from "./components/OfflinePage";
import InstallApp from "./components/InstallApp";
import { useOffline } from "./hooks/useOffline";

export default function App() {
  const isOffline = useOffline();
  const currentPath = window.location.pathname;

  // Allow home page to show in offline mode
  if (isOffline && currentPath !== "/") {
    return (
      <>
        <OfflinePage />
        <InstallApp />
      </>
    );
  }

  if (isOffline && currentPath == "/") {
    return (
      <>
        <MainLayout />
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
