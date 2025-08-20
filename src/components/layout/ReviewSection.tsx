'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/lib/iconMap';
import { useTheme } from '@/lib/ThemeContext';

export const ReviewSection = () => {
  const { theme } = useTheme();
  const { reviewSection } = theme;

  const stats = [
    { label: '누적 이용 고객', value: '50,000+', icon: 'users' },
    { label: '고객 만족도', value: '99%', icon: 'heart' },
    { label: '운영 경력', value: '15년', icon: 'clock' },
    { label: '보유 차량', value: '500+', icon: 'car' }
  ];

  const testimonials = [
    { rating: 5, comment: "친절하고 차량 상태가 매우 좋았어요", author: "김○○" },
    { rating: 5, comment: "예약부터 반납까지 모든 과정이 편리했습니다", author: "이○○" },
    { rating: 5, comment: "합리적인 가격에 좋은 서비스 받았어요", author: "박○○" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <DynamicIcon name="star" className="w-4 h-4" />
            고객 만족도 99% 생생한 이용 후기
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {reviewSection.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {reviewSection.subtitle}
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DynamicIcon name={stat.icon} className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Review Images and Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Review Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">실제 이용 후기</h3>
            <div className="grid grid-cols-2 gap-4">
              {reviewSection.reviewImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {index === 2 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center text-white">
                        <DynamicIcon name="play" className="w-12 h-12 mx-auto mb-2" />
                        <span className="font-bold text-sm">실제 이용고객 리뷰보기</span>
                      </div>
                    </div>
                  )}
                  {index < 2 && (
                    <div className="absolute top-3 left-3 bg-white/90 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                      리뷰 #{index + 1}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Customer Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">고객 후기</h3>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <DynamicIcon key={i} name="star" className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <DynamicIcon name="user" className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{testimonial.author}</span>
                    <span className="text-xs text-gray-400">verified customer</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-600 mb-8">
            {reviewSection.ctaText}
          </p>
          <button className="bg-primary text-white px-10 py-4 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <span className="flex items-center gap-2">
              전체 리뷰 보기
              <DynamicIcon name="external-link" className="w-5 h-5" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}; 