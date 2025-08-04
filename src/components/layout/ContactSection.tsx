'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { useTheme } from '@/lib/ThemeContext';
import { SearchField } from '@/types/theme';

export const ContactSection = () => {
  const { theme } = useTheme();
  const { contactSection } = theme;
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleFieldChange = (placeholder: string, value: string) => {
    setFormData(prev => ({ ...prev, [placeholder]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('상담 신청:', formData);
    // 상담 신청 로직 구현
  };

  const renderField = (field: SearchField, index: number) => {
    const commonClasses = "w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-800 text-white placeholder-gray-400";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={index}
            className={`${commonClasses} resize-none`}
            placeholder={field.placeholder}
            rows={4}
            value={formData[field.placeholder] || ''}
            onChange={(e) => handleFieldChange(field.placeholder, e.target.value)}
            required={field.required}
          />
        );
      default:
        return (
          <input
            key={index}
            type={field.type}
            className={commonClasses}
            placeholder={field.placeholder}
            value={formData[field.placeholder] || ''}
            onChange={(e) => handleFieldChange(field.placeholder, e.target.value)}
            required={field.required}
          />
        );
    }
  };

  return (
    <section 
      className="py-20 text-white relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(/img/home/car-back.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {contactSection.title}
            </h2>
            <p className="text-xl text-gray-300">
              {contactSection.subtitle}
            </p>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {contactSection.form.fields.map((field, index) => (
                <div key={index}>
                  {renderField(field, index)}
                </div>
              ))}
              
              <Button 
                type="submit"
                className="w-full py-4 text-lg font-semibold bg-primary hover:bg-primary/90"
              >
                {contactSection.form.submitText}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 