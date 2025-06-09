// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/landing";
import Dare from "./pages/dare";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "./components/navbar";

const AppContent = () => {
  const location = useLocation();

  // Hide "Get Dared" button on auth pages
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar hideGetDared={isAuthPage} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dare" element={<Dare />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
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
