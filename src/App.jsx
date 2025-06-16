import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<div>Sign Up</div>} />
          <Route path="/advertise" element={<div>Advertise</div>} />
        </Routes>
      </div>
    </Router>
  );
}
