import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Home, BookOpen, Users } from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { currentFamily, clearFamilyData } = useFamily();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg"
            >
              <Heart className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Family Connect
              </span>
              <span className="text-xs text-gray-500 -mt-1">Bridge the Gap</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            {!currentFamily && (
              <Link
                to="/setup"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/setup') 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Setup Family</span>
              </Link>
            )}

            {currentFamily && (
              <Link
                to={`/journal/${currentFamily.id}`}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(`/journal/${currentFamily.id}`) 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Journal</span>
              </Link>
            )}
          </nav>

          {/* Family Info / Actions */}
          <div className="flex items-center space-x-4">
            {currentFamily && (
              <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-lg border border-indigo-200">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">{currentFamily.name}</span>
                  <span className="text-xs text-gray-600">
                    {currentFamily.parent.name} & {currentFamily.teen.name}
                  </span>
                </div>
                <button
                  onClick={clearFamilyData}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  title="Switch Family"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;