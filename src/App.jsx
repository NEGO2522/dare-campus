// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Landing from "./pages/landing"; // 👈 Added back
import Navbar from "./components/navbar";
import Profile from "./pages/Profile";

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = ["/", "/login", "/signup"].includes(location.pathname);
  const isSubmitPage = location.pathname === "/submit-dare";

  const handleNextDare = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {!isSubmitPage && (
        <Navbar
          hideGetDared={isAuthPage}
          onNextDare={location.pathname === "/dare" ? handleNextDare : null}
        />
      )}
      <Routes>
        <Route path="/" element={<Login />} /> {/* 👈 Default page is Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/landing" element={<Landing />} /> {/* 👈 Landing route */}
        <Route path="/profile" element={<Profile />} />
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
