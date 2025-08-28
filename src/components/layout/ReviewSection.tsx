'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { DynamicIcon } from '@/lib/iconMap';
import { useTheme } from '@/lib/ThemeContext';

export const ReviewSection = () => {
  const { theme } = useTheme();
  const { reviewSection } = theme;

  const stats = [
    { label: '누적 이용 고객', value: '50,000+', numericValue: 50000, suffix: '+', icon: 'users' },
    { label: '고객 만족도', value: '99%', numericValue: 99, suffix: '%', icon: 'heart' },
    { label: '운영 경력', value: '15년', numericValue: 15, suffix: '년', icon: 'clock' },
    { label: '보유 차량', value: '500+', numericValue: 500, suffix: '+', icon: 'car' }
  ];

  const testimonials = [
    { rating: 5, comment: "친절하고 차량 상태가 매우 좋았어요. 직원분이 상세하게 설명해주셔서 안심하고 이용할 수 있었습니다.", author: "김○○", date: "2024.01.15" },
    { rating: 5, comment: "예약부터 반납까지 모든 과정이 편리했습니다. 온라인으로 쉽게 예약하고 빠른 처리가 인상적이었어요.", author: "이○○", date: "2024.01.12" },
    { rating: 5, comment: "합리적인 가격에 좋은 서비스 받았어요. 다음에도 꼭 이용하고 싶습니다.", author: "박○○", date: "2024.01.10" },
    { rating: 5, comment: "차량 상태도 좋고 가격도 저렴해서 만족스러웠습니다. 추천합니다!", author: "최○○", date: "2024.01.08" },
    { rating: 5, comment: "처음 이용해봤는데 정말 편리하고 좋았어요. 직원분들도 친절하시고 차량도 깨끗했습니다.", author: "정○○", date: "2024.01.05" },
    { rating: 5, comment: "24시간 서비스가 정말 편리해요. 늦은 시간에도 이용할 수 있어서 좋았습니다.", author: "한○○", date: "2024.01.03" }
  ];

  const [translateX, setTranslateX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [hasStartedCounting, setHasStartedCounting] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setTranslateX(prev => {
        // 첫 번째 세트가 완전히 지나가면 리셋
        const resetPoint = -(6 * 320); // testimonials.length는 6으로 고정
        if (prev <= resetPoint) {
          return 0;
        }
        return prev - 1; // 1픽셀씩 계속 이동
      });
    }, 30); // 30ms마다 1픽셀씩 이동 (부드러운 애니메이션)

    return () => clearInterval(interval);
  }, [isHovered]);

  // 카운터 애니메이션
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedCounting) {
          setHasStartedCounting(true);
          
          stats.forEach((stat, index) => {
            let current = 0;
            const target = stat.numericValue;
            const duration = 2000; // 2초
            const steps = 60;
            const increment = target / steps;
            const stepDuration = duration / steps;
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              setCounters(prev => {
                const newCounters = [...prev];
                newCounters[index] = Math.floor(current);
                return newCounters;
              });
            }, stepDuration);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasStartedCounting]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + ',000';
    }
    return num.toString();
  };

  return (
    <section className="py-20 bg-gradient-to-b from-sky-50 to-blue-100 relative">
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
          ref={statsRef}
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
              <div className="text-3xl font-bold mb-2 gradient-text-blue">
                {stat.numericValue === 50000 ? 
                  `${formatNumber(counters[index])}${counters[index] >= stat.numericValue ? stat.suffix : ''}` :
                  `${counters[index]}${counters[index] >= stat.numericValue ? stat.suffix : ''}`
                }
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Customer Reviews Horizontal Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">실제 이용 고객 후기</h3>
          <div 
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="flex gap-6"
              style={{ 
                transform: `translateX(${translateX}px)`,
                width: `${testimonials.length * 2 * 320}px`, // 두 배로 확장하여 무한 스크롤 효과
                transition: 'none'
              }}
            >
              {/* 원본 리뷰들 */}
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex-shrink-0 cursor-pointer relative"
                  style={{ width: '300px' }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <DynamicIcon key={i} name="star" className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm h-20 overflow-hidden">
                    "{testimonial.comment}"
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <DynamicIcon name="user" className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">{testimonial.author}</span>
                        <span className="text-xs text-gray-500">verified customer</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 text-right">{testimonial.date}</div>
                  </div>
                </motion.div>
              ))}
              {/* 복제된 리뷰들 (무한 스크롤용) */}
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={`duplicate-${index}`}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex-shrink-0 cursor-pointer relative"
                  style={{ width: '300px' }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <DynamicIcon key={i} name="star" className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm h-20 overflow-hidden">
                    "{testimonial.comment}"
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <DynamicIcon name="user" className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">{testimonial.author}</span>
                        <span className="text-xs text-gray-500">verified customer</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 text-right">{testimonial.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            

          </div>
        </motion.div>

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