import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "../components/Footer/Footer";
import OfflineIndicator from "../components/OfflineIndicator";
import { Suspense } from "react";
import { LoadingCard } from "../components/ui/loading";

export default function SharedLayout() {
  return (
    <>
      <Navbar />
      <OfflineIndicator />
      <Suspense fallback={<LoadingCard />}>
        <Outlet />
      </Suspense>
      <Toaster />
      {/* <Footer /> */}
    </>
  );
}
