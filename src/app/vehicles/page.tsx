'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeLayout } from '@/components/layout/ThemeLayout';
import { SubPageHeader } from '@/components/layout/SubPageHeader';
import { Card, Button } from '@/components/ui';
import { rentCarTheme } from '@/data/theme';
import { DynamicIcon } from '@/lib/iconMap';

export default function VehiclesPage() {
  const { vehicleSection } = rentCarTheme;
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['전체', ...vehicleSection.categories.map(cat => cat.name)];
  
  const filteredVehicles = vehicleSection.vehicles.filter(vehicle => {
    const matchesCategory = activeCategory === '전체' || 
      (activeCategory === '인기차량 베스트' && (vehicle.isPromoted || vehicle.badge === '인기')) ||
      (activeCategory === '프리미엄 차량' && (vehicle.category === '프리미엄' || vehicle.category === '신차')) ||
      (activeCategory === '경제형 차량' && (vehicle.category === '소형차' || vehicle.category === '중형차')) ||
      (activeCategory === '전기차 라인업' && vehicle.category === '전기차');
    
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <ThemeLayout>
      <SubPageHeader
        title="차량정보"
        subtitle="다양한 서비스와 최신 차종으로 원하는 차량을 제공해드립니다."
        prevPage={{ title: "메인으로", href: "/" }}
        nextPage={{ title: "실시간 예약", href: "/booking" }}
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            className="flex items-center text-sm text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DynamicIcon name="chevron-right" className="h-4 w-4 mr-1" />
            <span>홈</span>
            <DynamicIcon name="chevron-right" className="h-4 w-4 mx-2" />
            <span>고객센터</span>
            <DynamicIcon name="chevron-right" className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">차량정보</span>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>제목</option>
                  <option>차량명</option>
                  <option>카테고리</option>
                </select>
                
                <div className="flex">
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-l-lg text-sm w-64"
                  />
                  <button className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-primary/90 transition-colors">
                    <DynamicIcon name="search" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vehicles Table */}
          <motion.div
            className="bg-white rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">No</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">차량 이미지</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">차량명</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">카테고리</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">가격</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">특징</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVehicles.map((vehicle, index) => (
                    <motion.tr
                      key={vehicle.name}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-16 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{vehicle.name}</span>
                          {vehicle.badge && (
                            <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded">
                              {vehicle.badge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{vehicle.category}</td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{vehicle.price}</span>
                          {vehicle.originalPrice && (
                            <div className="text-xs text-gray-500 line-through">
                              {vehicle.originalPrice}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features?.slice(0, 2).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {feature}
                            </span>
                          ))}
                          {vehicle.features && vehicle.features.length > 2 && (
                            <span className="text-xs text-gray-500">+{vehicle.features.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          vehicle.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {vehicle.available ? '예약가능' : '예약불가'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <DynamicIcon name="car" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">검색 조건에 맞는 차량이 없습니다.</p>
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {filteredVehicles.length > 0 && (
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  이전
                </button>
                <button className="px-3 py-2 text-sm bg-primary text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  다음
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </ThemeLayout>
  );
} 