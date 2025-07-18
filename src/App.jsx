import MainLayout from "./layouts/MainLayout";
import OfflinePage from "./components/OfflinePage";
import InstallApp from "./components/InstallApp";
import { useOffline } from "./hooks/useOffline";

export default function App() {
  const isOffline = useOffline();
  const currentPath = window.location.pathname;

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
