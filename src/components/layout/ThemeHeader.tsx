'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { DynamicIcon } from '@/lib/iconMap';
import { useTheme } from '@/lib/ThemeContext';

export const ThemeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <motion.header
      className="absolute top-0 left-0 right-0 z-50 bg-transparent"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Bar with Phone */}
      <div className="bg-black/30 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-10">
            <div className="flex items-center text-sm">
              <DynamicIcon name="phone" className="h-4 w-4 mr-2" />
              <span className="font-medium">{theme.header.contact.phone}</span>
              <span className="ml-2 text-gray-300">09:00~18:00 (주말/공휴일 휴무)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors cursor-pointer">
              {theme.siteName}
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {theme.header.navigation.map((item) => (
              <motion.div key={item.title} whileHover={{ scale: 1.05 }}>
                <Link
                  href={item.link}
                  className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.title}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href={`tel:${theme.header.contact.phone}`}
              className="flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <DynamicIcon name="phone" className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{theme.header.contact.displayText}</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 p-2"
            >
              <DynamicIcon name={isMenuOpen ? "x" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/20 bg-black/30">
              {theme.header.navigation.map((item) => (
                <Link
                  key={item.title}
                  href={item.link}
                  className="block px-3 py-2 text-base font-medium text-white hover:text-gray-300 hover:bg-white/10 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <div className="pt-4">
                <a 
                  href={`tel:${theme.header.contact.phone}`}
                  className="flex items-center px-3 py-2 text-base font-medium text-white hover:text-gray-300 hover:bg-white/10 rounded-md"
                >
                  <DynamicIcon name="phone" className="h-4 w-4 mr-2" />
                  {theme.header.contact.displayText}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}; 