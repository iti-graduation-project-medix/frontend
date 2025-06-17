import Navbar from "./components/Navbar";
import Advertise from "./pages/Advertise";
import Login from "./pages/Login";

export default function Page() {
  return (
    <>
      <Navbar />
      <Login />
      <Advertise/>
    </>
  );
}
