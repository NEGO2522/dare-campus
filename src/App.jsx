// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Landing from "./pages/landing";
import Dare from "./pages/dare";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Leaderboard from "./pages/Leaderboard";
import SubmitDare from "./pages/SubmitDare";
import Navbar from "./components/navbar";

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide "Get Dared" button on auth pages
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isSubmitPage = location.pathname === "/submit-dare";

  const handleNextDare = () => {
    // Reload the page to get a new random dare
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {!isSubmitPage && <Navbar 
        hideGetDared={isAuthPage} 
        onNextDare={location.pathname === '/dare' ? handleNextDare : null} 
      />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dare" element={<Dare />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/submit-dare" element={<SubmitDare />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
