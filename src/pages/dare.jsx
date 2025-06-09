import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../components/navbar';


export default function Dare() {
  const [dare, setDare] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDares = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, 'dares'));
      const daresArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (daresArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * daresArray.length);
        setDare(daresArray[randomIndex].text || 'No dare text available');
      } else {
        setDare('No dares found in the database');
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching dares:', error);
      setError('Failed to fetch dares. Please try again.');
      setDare('Oops! Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDares();
  }, []);

  const handleNewDare = () => {
    fetchDares();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />

      {/* Main Content */}
      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6">
            <span className="block text-lg sm:text-xl md:text-2xl font-medium text-indigo-300 mb-1 sm:mb-2">Your Daily</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Dare Challenge
            </span>
          </h1>
          <p className="mt-2 sm:mt-3 max-w-md mx-auto text-sm sm:text-base md:text-lg text-gray-300 md:max-w-3xl px-2 sm:px-0">
            Accept the challenge and step out of your comfort zone!
          </p>
        </motion.div>

        {/* Dare Card */}
        <motion.div
          key={dare}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50 mx-2 sm:mx-0"
        >
          <div className="p-5 sm:p-8 md:p-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-indigo-500/10 mb-4 sm:mb-6">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                {isLoading ? 'Loading your dare...' : 'Your Dare Is:'}
              </h2>
              
              <div className="min-h-24 sm:min-h-32 flex items-center justify-center px-2 sm:px-0">
                {error ? (
                  <p className="text-red-400 text-sm sm:text-base">{error}</p>
                ) : (
                  <p className="text-lg sm:text-xl text-gray-200 font-medium">
                    {dare}
                  </p>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewDare}
                disabled={isLoading}
                className={`mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-white ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg'
                } transition-all duration-200 flex items-center mx-auto text-sm sm:text-base`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                    Get New Dare
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 px-4 text-center text-gray-400 text-xs sm:text-sm">
          <p className="leading-tight sm:leading-normal">© {new Date().getFullYear()} Dare of the Day. All dares are meant to be fun and safe.</p>
          <p className="mt-1 leading-tight sm:leading-normal">Challenge yourself, but always know your limits!</p>
        </footer>
      </div>
    </div>
  );
}