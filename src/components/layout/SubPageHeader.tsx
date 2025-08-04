'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SubPageHeaderProps {
  title: string;
  subtitle: string;
  prevPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
  backgroundImage?: string;
}

export const SubPageHeader = ({ 
  title, 
  subtitle, 
  prevPage, 
  nextPage,
  backgroundImage = '/img/home/hero.jpg'
}: SubPageHeaderProps) => {
  return (
    <section 
      className="relative text-white py-32"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Previous Page */}
          {prevPage ? (
            <motion.a
              href={prevPage.href}
              className="flex items-center text-white/80 hover:text-white transition-colors group"
              whileHover={{ x: -5 }}
            >
              <ChevronLeft className="h-6 w-6 mr-2" />
              <span className="text-sm">{prevPage.title}</span>
            </motion.a>
          ) : (
            <div></div>
          )}

          {/* Center Content */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {title}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </motion.div>

          {/* Next Page */}
          {nextPage ? (
            <motion.a
              href={nextPage.href}
              className="flex items-center text-white/80 hover:text-white transition-colors group"
              whileHover={{ x: 5 }}
            >
              <span className="text-sm">{nextPage.title}</span>
              <ChevronRight className="h-6 w-6 ml-2" />
            </motion.a>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </section>
  );
}; 