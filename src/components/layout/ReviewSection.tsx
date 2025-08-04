'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';

export const ReviewSection = () => {
  const { theme } = useTheme();
  const { reviewSection } = theme;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gray-600 mb-2">
            고객 만족도 99% 생생한 이용 후기
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {reviewSection.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {reviewSection.subtitle}
          </p>
        </motion.div>

        {/* Review Images Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {reviewSection.reviewImages.map((image, index) => (
            <motion.div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg bg-gray-200"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={image}
                alt={`리뷰 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 2 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-sm bg-primary px-3 py-1 rounded">
                    실제 이용고객 리뷰보기
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-6">
            {reviewSection.ctaText}
          </p>
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            전체 리뷰 보기
          </button>
        </motion.div>
      </div>
    </section>
  );
}; 