// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Navbar from '../components/navbar';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // First, get all users
        const querySnapshot = await getDocs(collection(db, 'users'));
        let leaderboardData = [];
        
        // Convert to array and ensure points is a number
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          leaderboardData.push({
            id: doc.id,
            ...userData,
            points: Number(userData.points) || 0 // Ensure points is a number
          });
        });
        
        // Sort by points in descending order (highest first)
        leaderboardData.sort((a, b) => b.points - a.points);
        
        setUsers(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar hideGetDared={false} />
      
      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            <span className="block text-lg sm:text-xl font-medium text-indigo-300 mb-2">Global Rankings</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Leaderboard 🏆
            </span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
            See where you stand among the bravest daredevils. The more dares you complete, the higher you climb! 🚀
          </p>
        </motion.div>

        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-indigo-100 uppercase tracking-wider">Rank</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-indigo-100 uppercase tracking-wider">Player</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-indigo-100 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/50 divide-y divide-gray-700/50">
                {users.slice(0, 5).map((user, index) => ( // Show only top 5 users
                  <motion.tr 
                    key={user.id} 
                    className="group hover:bg-gray-700/30 transition-colors duration-200"
                    whileHover={{ scale: 1.005 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-900 font-bold' : 'bg-gray-700 text-gray-300'}`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                          {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name || 'Anonymous'}</div>
                          <div className="text-xs text-gray-400">{user.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-300">
                        {user.points?.toLocaleString() || 0} pts
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No players on the leaderboard yet. Be the first to complete a dare! 🎯</p>
            </div>
          ) : users.length > 5 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              <p>Showing top 5 players out of {users.length} total players</p>
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link 
            to="/dare" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg transition-all duration-200"
          >
            <span>Take a Dare Challenge</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
