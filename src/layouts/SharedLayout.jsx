import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "../components/Footer/Footer";
import OfflineIndicator from "../components/OfflineIndicator";
import { LoadingPage } from "../components/ui/loading";
import React, { Suspense } from "react";

export default function SharedLayout() {
  const Chat = React.lazy(() => import("../pages/Chat/Chat"));

  return (
    <>
      <Navbar />
      <OfflineIndicator />
      <div style={{ minHeight: 'calc(100vh - 437px)' }}>
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
      <Toaster />
      <Footer />
    </>
  );
}
