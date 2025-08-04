'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/lib/iconMap';
import { useTheme } from '@/lib/ThemeContext';

export const ThemeFooter = () => {
  const { theme } = useTheme();
  const { footer } = theme;

  return (
    <footer className="bg-dark text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-4">
              <DynamicIcon name="car" className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold">{footer.companyName}</span>
            </div>
            <p className="text-gray-300 mb-4">{footer.description}</p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <DynamicIcon name="map-pin" className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{footer.address}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <DynamicIcon name="phone" className="h-4 w-4 mr-2" />
                <span className="text-sm">{footer.contact.phone}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <DynamicIcon name="mail" className="h-4 w-4 mr-2" />
                <span className="text-sm">{footer.contact.email}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <DynamicIcon name="clock" className="h-4 w-4 mr-2" />
                <span className="text-sm">{footer.contact.hours}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">사업자 정보</h3>
            <ul className="space-y-2">
              {footer.businessInfo.map((info, index) => (
                <li key={index} className="text-gray-300 text-sm">
                  {info}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">약관 및 정책</h3>
            <ul className="space-y-2">
              {footer.links.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.url}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-sm">{footer.copyright}</p>
        </motion.div>
      </div>
    </footer>
  );
}; 