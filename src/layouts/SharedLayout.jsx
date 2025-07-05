import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "../components/Footer/Footer";

export default function SharedLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster />
      <Footer />
    </>
  );
}
