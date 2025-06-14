import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ hideGetDared = false }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest('.mobile-menu-container') &&
        !event.target.closest('button[aria-label="Toggle menu"]')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md shadow-xl fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center justify-center w-full sm:justify-between sm:w-auto">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
            >
              Campus Vibes
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden text-gray-300 hover:text-white focus:outline-none p-2 -mr-2 absolute right-4"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                isActive('/') ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              } transition-colors duration-200 whitespace-nowrap`}
            >
              Home
            </Link>
            {!hideGetDared && (
              <Link
                to="/feed"
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                  isActive('/feed') ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                } transition-colors duration-200 whitespace-nowrap`}
              >
                Raise Your Voice
              </Link>
            )}
            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                  <span className="text-sm sm:text-base">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                        <p className="font-medium">{user.name || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-2">
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200 whitespace-nowrap"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div
            className={`sm:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40 pt-14 transition-all duration-300 ease-in-out transform ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              height: 'calc(100vh - 3.5rem)',
              top: '3.5rem',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
            }}
            role="dialog"
            aria-modal="true"
            aria-hidden={!isMobileMenuOpen}
          >
            <div className="px-4 py-2 space-y-1 mobile-menu-container">
              <Link
                to="/"
                className={`block px-3 py-2 text-sm font-medium ${
                  isActive('/') ? 'text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/feed"
                className="block px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Raise Your Voice
              </Link>
              {user ? (
                <>
                  <div className="px-3 py-2 border-t border-gray-800">
                    <div className="text-sm font-medium text-white">{user.name || 'User'}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="block px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
