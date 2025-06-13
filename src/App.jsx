// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Landing from "./pages/landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/navbar";
import Feed from "./pages/Feed"; // 👈 NEW import

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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/feed" element={<Feed />} />
        
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
