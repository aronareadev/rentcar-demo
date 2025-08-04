'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { DynamicIcon } from '@/lib/iconMap';
import { useTheme } from '@/lib/ThemeContext';

export const FloatingButtons = () => {
  const { theme } = useTheme();
  const { floatingButtons } = theme;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCall = () => {
    if (floatingButtons.call.phone) {
      window.location.href = `tel:${floatingButtons.call.phone}`;
    }
  };

  const handleChat = () => {
    // 채팅 상담 로직 구현
    console.log('채팅 상담 시작');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
      {/* 채팅 상담 버튼 */}
      <motion.button
        onClick={handleChat}
        className="flex items-center bg-accent hover:bg-accent/90 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DynamicIcon name={floatingButtons.chat.icon} className="h-5 w-5" />
        <span className="ml-2 text-sm font-medium hidden group-hover:block">
          {floatingButtons.chat.text}
        </span>
      </motion.button>

      {/* 전화 상담 버튼 */}
      <motion.button
        onClick={handleCall}
        className="flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <DynamicIcon name={floatingButtons.call.icon} className="h-5 w-5" />
        <span className="ml-2 text-sm font-medium hidden group-hover:block">
          {floatingButtons.call.text}
        </span>
      </motion.button>

      {/* 맨 위로 버튼 */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DynamicIcon name={floatingButtons.top.icon} className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  );
}; 