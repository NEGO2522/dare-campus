import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import confetti from 'canvas-confetti';

export default function Dare() {
  const [dare, setDare] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDares = async () => {
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      const querySnapshot = await getDocs(collection(db, 'dares'));
      
      // Filter out the current user's dares
      let daresArray = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        // Only include dares that don't belong to the current user
        if (!user || data.userId !== user.uid) {
          daresArray.push({
            id: doc.id,
            ...data
          });
        }
      });

      if (daresArray.length > 0) {
        // Get a random dare from the filtered list
        const randomIndex = Math.floor(Math.random() * daresArray.length);
        setDare(daresArray[randomIndex]);
        setError(null);
      } else {
        // If no dares are available (or only the user's dares exist)
        setDare(null);
        setError('No new dares available. Check back later or create a new one!');
      }
    } catch (err) {
      console.error('Error fetching dares:', err);
      setError('Failed to fetch dares. Please try again.');
      setDare(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDares();
  }, []);

  const handleNewDare = useCallback(() => {
    fetchDares();
  }, [fetchDares]);

  const navigate = useNavigate();

  const handleSubmitDare = () => {
    if (dare) {
      // Trigger confetti effect when submitting a dare
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      navigate('/submit-dare', { state: { dare } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />

      {/* Main Content */}
      <div className="pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3 sm:mb-4">
            <span className="block text-xl sm:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2 sm:mb-3">
              Your Daily
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Dare Challenge
            </span>
          </h1>
          <p className="mt-3 sm:mt-4 max-w-md mx-auto text-sm sm:text-base md:text-lg text-gray-300 md:max-w-2xl px-2 sm:px-0">
            Push your boundaries and discover something new about yourself!
          </p>
        </motion.div>

        {/* Dare Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dare ? dare.id : 'loading'}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="relative group w-full max-w-2xl mx-auto"
          >
            
            <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
              <div className="p-5 sm:p-6 md:p-7">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-4 sm:mb-6 transform transition-transform group-hover:scale-110">
                    <svg
                      className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>

                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-700/50 rounded-full w-3/4 mx-auto animate-pulse"></div>
                      <div className="h-5 bg-gray-700/50 rounded-full w-1/2 mx-auto animate-pulse"></div>
                      <div className="h-4 bg-gray-700/50 rounded-full w-1/3 mx-auto animate-pulse mt-4"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-400 text-sm sm:text-base">{error}</div>
                  ) : dare ? (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                        {dare.title}
                      </h2>
                      <div className="min-h-20 sm:min-h-24 flex items-center justify-center px-2 sm:px-4">
                        <p className="text-base sm:text-lg text-gray-200 font-medium leading-relaxed">
                          {dare.description}
                        </p>
                      </div>
                      <div className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <span className="text-indigo-300 font-bold text-sm sm:text-base">
                          🏆 {dare.points} Points
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400">No dares available</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 sm:mt-8">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNewDare}
                      disabled={isLoading}
                      className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium text-white ${
                        isLoading
                          ? 'bg-gray-600/50 cursor-not-allowed'
                          : 'bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 shadow-sm'
                      } transition-all duration-300 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                          </svg>
                          Change Dare
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSubmitDare}
                      disabled={!dare || isLoading}
                      className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium text-white ${
                        !dare || isLoading
                          ? 'bg-indigo-500/30 cursor-not-allowed border border-indigo-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 hover:border-indigo-400 shadow-sm'
                      } transition-all duration-300 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Prove Your Dare!
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 sm:mt-20 px-4 text-center"
        >
          <div className="inline-block bg-gray-800/50 backdrop-blur-md rounded-full px-6 py-3 border border-gray-700/50">
            <p className="text-xs sm:text-sm text-gray-400">
              <span className="block sm:inline"> 2024 Dare of the Day</span>
              <span className="hidden sm:inline mx-2">•</span>
              <span className="block sm:inline mt-1 sm:mt-0">Challenge yourself, but always know your limits!</span>
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
