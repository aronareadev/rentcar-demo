'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { DynamicIcon } from '@/lib/iconMap';
import { useTheme } from '@/lib/ThemeContext';

export const FeaturesSection = () => {
  const { theme } = useTheme();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {theme.features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col items-center text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full group-hover:bg-primary/10 transition-colors duration-300">
                    <DynamicIcon 
                      name={feature.icon} 
                      className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors duration-300" 
                    />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-auto pt-4">
                  <DynamicIcon 
                    name="chevron-right" 
                    className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors duration-300" 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 