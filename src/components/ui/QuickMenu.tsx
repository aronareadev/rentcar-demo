'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { DynamicIcon } from '@/lib/iconMap';
import { rentCarTheme } from '@/data/theme';
import { QuoteModal } from './QuoteModal';

export const QuickMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 100px 이상 스크롤하면 퀵메뉴 표시
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCall = () => {
    window.location.href = `tel:${rentCarTheme.phoneNumber}`;
  };

  const handleSMS = () => {
    window.location.href = `sms:${rentCarTheme.phoneNumber}`;
  };

  const handleSearch = () => {
    // 차량검색 페이지로 이동
    window.location.href = '/vehicles';
  };

  const handleQuote = () => {
    setShowQuoteModal(true);
  };

  const handleKakaoTalk = () => {
    // 카카오톡 상담 로직
    console.log('카카오톡 상담');
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white shadow-2xl border border-gray-200 w-20">
              {/* Header */}
              <div className="bg-gray-800 text-white p-3 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-white p-1.5 rounded mb-1">
                    <DynamicIcon name="car" className="h-4 w-4 text-gray-800" />
                  </div>
                  <span className="text-xs font-bold">QUICK</span>
                </div>
              </div>

              {/* Phone Number */}
              <div className="bg-white p-2 text-center border-b">
                <div className="text-sm font-bold text-gray-900 leading-tight">
                  1544<br />6062
                </div>
                <div className="text-xs text-gray-600 mt-1">문의전화</div>
              </div>

              {/* Menu Items */}
              <div className="bg-white">
                {/* SMS 상담 */}
                <button 
                  onClick={handleSMS}
                  className="w-full p-3 flex flex-col items-center border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <DynamicIcon name="message-circle" className="h-4 w-4 text-gray-600 mb-1" />
                  <span className="text-xs text-gray-700">SMS 상담</span>
                </button>

                {/* 차량검색 */}
                <button 
                  onClick={handleSearch}
                  className="w-full p-3 flex flex-col items-center border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <DynamicIcon name="search" className="h-4 w-4 text-gray-600 mb-1" />
                  <span className="text-xs text-gray-700">차량검색</span>
                </button>

                {/* 견적문의 */}
                <button 
                  onClick={handleQuote}
                  className="w-full p-3 flex flex-col items-center border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <DynamicIcon name="edit" className="h-4 w-4 text-gray-600 mb-1" />
                  <span className="text-xs text-gray-700">견적문의</span>
                </button>

                {/* TOP */}
                <button 
                  onClick={scrollToTop}
                  className="w-full p-3 flex flex-col items-center border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <DynamicIcon name="arrow-up" className="h-4 w-4 text-gray-600 mb-1" />
                  <span className="text-xs text-gray-700">TOP</span>
                </button>
              </div>

              {/* KakaoTalk Section */}
              <div className="bg-yellow-400 p-2 text-center">
                <button 
                  onClick={handleKakaoTalk}
                  className="text-black font-bold text-xs mb-1 leading-tight"
                >
                  카카오톡<br />상담
                </button>
                <div className="text-xs text-black/80 mb-1">바로가기</div>
                
                {/* KakaoTalk QR/Image Placeholder */}
                <div className="bg-white w-full h-8 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">[QR]</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <QuoteModal 
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
      />
    </>
  );
}; 