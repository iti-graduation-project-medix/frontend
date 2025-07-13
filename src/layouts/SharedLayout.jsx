import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "../components/Footer/Footer";
import OfflineIndicator from "../components/OfflineIndicator";
import { LoaderPinwheelIcon } from "lucide-react";

import React, { Suspense } from "react";

export default function SharedLayout() {
  const Chat = React.lazy(() => import("../pages/Chat/Chat"));

  return (
    <Suspense fallback={<LoaderPinwheelIcon />}>
      <Navbar />
      <OfflineIndicator />

      <Outlet />
      <Toaster />
      <Chat />

      <Footer />
    </Suspense>
  );
}
