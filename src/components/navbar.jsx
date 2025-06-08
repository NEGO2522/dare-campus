import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ hideGetDared = false }) => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md shadow-xl fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Dare of the Day
            </span>
          </div>
          <div className="flex space-x-2 sm:space-x-4">
            <Link 
              to="/" 
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                window.location.pathname === '/' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              } transition-colors duration-200 whitespace-nowrap`}
            >
              Home
            </Link>
            {!hideGetDared && (
              <Link 
                to="/dare" 
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                  window.location.pathname === '/dare' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                } transition-colors duration-200 whitespace-nowrap`}
              >
                Get Dared
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;