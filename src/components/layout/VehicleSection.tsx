'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { DynamicIcon } from '@/lib/iconMap';
import { useTheme } from '@/lib/ThemeContext';
import { Vehicle } from '@/types/theme';

export const VehicleSection = () => {
  const { theme } = useTheme();
  const { vehicleSection } = theme;
  const [activeCategory, setActiveCategory] = useState(
    vehicleSection.categories.find(cat => cat.active)?.name || vehicleSection.categories[0]?.name
  );

  const filteredVehicles = vehicleSection.vehicles.filter(vehicle => {
    if (activeCategory === '인기차량 베스트') {
      return vehicle.isPromoted || vehicle.badge === '인기';
    }
    if (activeCategory === '프리미엄 차량') {
      return vehicle.category === '프리미엄' || vehicle.category === '신차';
    }
    if (activeCategory === '경제형 차량') {
      return vehicle.category === '소형차' || vehicle.category === '중형차';
    }
    if (activeCategory === '전기차 라인업') {
      return vehicle.category === '전기차';
    }
    return true;
  });

  const VehicleCard = ({ vehicle, index }: { vehicle: Vehicle; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-48 object-cover"
          />
          {vehicle.badge && (
            <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded text-xs font-bold">
              {vehicle.badge}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{vehicle.name}</h3>
            <p className="text-xs text-gray-500">{vehicle.category}</p>
          </div>

          {vehicle.features && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {vehicle.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-gray-600"
                  >
                    {feature}{idx < vehicle.features!.length - 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {vehicle.originalPrice && vehicle.discount ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{vehicle.price}</span>
                  <span className="text-sm text-gray-400 line-through">{vehicle.originalPrice}</span>
                </div>
                <p className="text-sm text-red-500 font-medium">{vehicle.discount}</p>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-900">{vehicle.price}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gray-600 mb-2">
            믿고 찾을 수 있는 렌트카, 실력 검증된!
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {vehicleSection.title}
          </h2>
          <p className="text-gray-600">
            {vehicleSection.subtitle}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-6">
            {vehicleSection.categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-2 font-medium transition-all duration-300 border-b-2 ${
                  activeCategory === category.name
                    ? 'text-primary border-primary'
                    : 'text-gray-600 border-transparent hover:text-primary'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle, index) => (
            <VehicleCard key={vehicle.name} vehicle={vehicle} index={index} />
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <DynamicIcon name="car" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">해당 카테고리에 차량이 없습니다.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}; 