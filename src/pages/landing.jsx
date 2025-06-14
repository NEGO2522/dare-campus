import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleStartChallenge = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/feed'); // Changed from /dare to /feed (assuming new route)
    } else {
      navigate('/login', { state: { from: '/feed' } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar hideGetDared={true} />

      {/* Hero Section */}
      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6">
            <span className="block text-lg sm:text-xl md:text-2xl font-medium text-indigo-300 mb-2">Welcome to</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2 sm:px-4">
            Your campus, your voice. Share your experiences, stories, thoughts, and opinions — all in one student-powered space! 🧠📢
          </p>
          
          <motion.div 
            className="mt-8 sm:mt-12 px-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <button 
              onClick={handleStartChallenge}
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-full text-base sm:text-lg shadow-lg transform transition-all duration-200 flex items-center justify-center mx-auto"
            >
              <span>Start Sharing</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </motion.div>
        </motion.div>

        {/* Features */}
        <div className="mt-16 sm:mt-20 md:mt-24 grid gap-6 sm:gap-8 md:grid-cols-3">
          {[
            {
              icon: '📝',
              title: 'Open Expression',
              description: 'Post your thoughts, confessions, or stories without filters — anonymously or openly.'
            },
            {
              icon: '🏫',
              title: 'Campus-Focused',
              description: 'Built exclusively for Poornima students. Stay updated and connected with your college life.'
            },
            {
              icon: '💬',
              title: 'Engaging Community',
              description: 'React, comment, and connect with others who vibe with your experiences.'
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-lg p-5 sm:p-6 rounded-2xl border border-gray-700/50 hover:border-indigo-500/50 transition-colors duration-300"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 text-center text-gray-400 text-xs sm:text-sm">
        <p className="leading-tight sm:leading-normal">© {new Date().getFullYear()} Poornima Pulse. Created for the voices of Poornima.</p>
        <p className="mt-1 leading-tight sm:leading-normal">Be respectful. Be real. Be heard.</p>
      </footer>
    </div>
  );
}

export default Landing;
