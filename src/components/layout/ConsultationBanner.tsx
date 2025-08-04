'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';

export const ConsultationBanner = () => {
  const { theme } = useTheme();
  const { consultationBanner } = theme;

  return (
    <section className="py-4 bg-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['100%', '-100%'] }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {consultationBanner.items.map((item, index) => (
            <span
              key={index}
              className="inline-block px-8 text-sm font-medium"
            >
              {item}
            </span>
          ))}
          {/* 반복을 위한 복사본 */}
          {consultationBanner.items.map((item, index) => (
            <span
              key={`duplicate-${index}`}
              className="inline-block px-8 text-sm font-medium"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}; 