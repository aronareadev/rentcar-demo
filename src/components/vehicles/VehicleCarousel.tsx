'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicIcon } from '@/lib/iconMap';
import { Button } from '@/components/ui';
import { VehicleWithBrand } from '@/lib/vehicleService';

interface VehicleCarouselProps {
  vehicles: VehicleWithBrand[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onBookingClick: (vehicle: VehicleWithBrand) => void;
}

export const VehicleCarousel = ({ 
  vehicles, 
  currentIndex, 
  onIndexChange, 
  onBookingClick 
}: VehicleCarouselProps) => {
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // 자동 재생
  useEffect(() => {
    if (!isAutoPlay || vehicles.length <= 1) return;

    const interval = setInterval(() => {
      setSlideDirection('right'); // 자동재생은 항상 오른쪽으로
      onIndexChange((currentIndex + 1) % vehicles.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, vehicles.length, isAutoPlay, onIndexChange]);

  const nextVehicle = () => {
    setIsAutoPlay(false);
    setSlideDirection('right');
    onIndexChange((currentIndex + 1) % vehicles.length);
  };

  const prevVehicle = () => {
    setIsAutoPlay(false);
    setSlideDirection('left');
    onIndexChange((currentIndex - 1 + vehicles.length) % vehicles.length);
  };

  const goToVehicle = (index: number) => {
    setIsAutoPlay(false);
    // 썸네일 클릭 시 방향 결정
    setSlideDirection(index > currentIndex ? 'right' : 'left');
    onIndexChange(index);
  };



  // 유효성 검사 추가
  if (!vehicles || vehicles.length === 0 || currentIndex < 0 || currentIndex >= vehicles.length) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <DynamicIcon name="car" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">표시할 차량이 없습니다.</p>
        </div>
      </div>
    );
  }

  const currentVehicle = vehicles[currentIndex];
  const prevIndex = (currentIndex - 1 + vehicles.length) % vehicles.length;
  const nextIndex = (currentIndex + 1) % vehicles.length;

  const getVehicleImage = (vehicle: VehicleWithBrand | undefined) => {
    if (!vehicle) return null;
    if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      return (vehicle.images[0] as any)?.url;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* 메인 캐러셀 */}
      <div className="relative h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-center h-full px-4 sm:px-20">
          
          {/* 이전 차량 (좌측) */}
          <motion.div
            key={`prev-${prevIndex}`}
            className="hidden lg:block absolute left-8 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
            whileHover={{ scale: 1.05 }}
            onClick={prevVehicle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-44 h-28 bg-white rounded-lg shadow-lg opacity-70 hover:opacity-90 transition-all duration-200 overflow-hidden border border-gray-200">
              {getVehicleImage(vehicles[prevIndex]) ? (
                <img
                  src={getVehicleImage(vehicles[prevIndex])!}
                  alt={`${vehicles[prevIndex].brand} ${vehicles[prevIndex].model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <DynamicIcon name="car" className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs font-medium text-gray-700 truncate">
                {vehicles[prevIndex]?.vehicle_brands?.name || vehicles[prevIndex]?.brand} {vehicles[prevIndex]?.model}
              </p>
              <p className="text-xs text-gray-500">
                {vehicles[prevIndex]?.daily_rate?.toLocaleString()}원/일
              </p>
            </div>
          </motion.div>

          {/* 메인 차량 (중앙) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="flex-1 max-w-2xl mx-auto px-4 lg:px-8"
              initial={{ 
                opacity: 0, 
                x: slideDirection === 'right' ? 300 : -300,
                scale: 0.9
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                x: slideDirection === 'right' ? -300 : 300,
                scale: 0.9
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto flex flex-col">
                {/* 차량 이미지 */}
                <div className="relative h-64 mb-6 rounded-xl overflow-hidden bg-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`image-${currentIndex}`}
                      initial={{ 
                        opacity: 0,
                        x: slideDirection === 'right' ? 100 : -100
                      }}
                      animate={{ 
                        opacity: 1,
                        x: 0
                      }}
                      exit={{ 
                        opacity: 0,
                        x: slideDirection === 'right' ? -100 : 100
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeInOut",
                        delay: 0.1
                      }}
                      className="w-full h-full"
                    >
                      {getVehicleImage(currentVehicle) ? (
                        <img
                          src={getVehicleImage(currentVehicle)!}
                          alt={`${currentVehicle?.brand || ''} ${currentVehicle?.model || ''}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <DynamicIcon name="car" className="h-20 w-20 text-gray-400" />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* 브랜드 로고 오버레이 */}
                  {currentVehicle?.vehicle_brands?.logo_url && (
                    <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-md">
                      <img
                        src={currentVehicle.vehicle_brands.logo_url}
                        alt={currentVehicle.vehicle_brands.name}
                        className="h-8 w-auto"
                      />
                    </div>
                  )}

                  {/* 상태 배지 */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      currentVehicle?.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentVehicle?.status === 'available' ? '예약가능' : '예약불가'}
                    </span>
                  </div>
                </div>

                {/* 차량 정보 */}
                <motion.div 
                  key={`info-${currentIndex}`}
                  initial={{ 
                    opacity: 0,
                    y: 20
                  }}
                  animate={{ 
                    opacity: 1,
                    y: 0
                  }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeOut",
                    delay: 0.2
                  }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-4 shadow-lg">
                    <h3 className="text-2xl font-bold text-white">
                      {currentVehicle?.vehicle_brands?.name || currentVehicle?.brand} {currentVehicle?.model}
                    </h3>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-blue-100 mt-2">
                      <span>{currentVehicle?.year}년</span>
                      <span>•</span>
                      <span>{currentVehicle?.color}</span>
                      <span>•</span>
                      <span>{currentVehicle?.transmission === 'automatic' ? '자동' : '수동'}</span>
                      <span>•</span>
                      <span>{currentVehicle?.passengers}인승</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <DynamicIcon name="map-pin" className="h-3 w-3 text-blue-200" />
                        <span className="text-xs text-blue-200">지점:</span>
                        <span className="font-medium text-white">
                          {currentVehicle?.vehicle_locations?.name || currentVehicle?.location}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <DynamicIcon name="tag" className="h-3 w-3 text-blue-200" />
                        <span className="text-xs text-blue-200">차량종류:</span>
                        <span className="font-medium text-white">
                          {currentVehicle?.vehicle_categories?.name || currentVehicle?.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-blue-600">
                        {currentVehicle?.daily_rate?.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-500">일일 기준</div>
                    </div>
                  </div>

                  {/* 특징 */}
                  {currentVehicle?.features && Array.isArray(currentVehicle.features) && (
                    <div className="flex flex-wrap gap-2">
                      {currentVehicle.features.slice(0, 4).map((feature: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {feature.name || feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 예약 버튼 */}
                  <Button
                    onClick={() => currentVehicle && onBookingClick(currentVehicle)}
                    disabled={currentVehicle?.status !== 'available'}
                    className={`w-full py-3 text-lg font-semibold ${
                      currentVehicle?.status === 'available'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {currentVehicle?.status === 'available' ? '예약하기' : '예약불가'}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 다음 차량 (우측) */}
          <motion.div
            key={`next-${nextIndex}`}
            className="hidden lg:block absolute right-8 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
            whileHover={{ scale: 1.05 }}
            onClick={nextVehicle}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-44 h-28 bg-white rounded-lg shadow-lg opacity-70 hover:opacity-90 transition-all duration-200 overflow-hidden border border-gray-200">
              {getVehicleImage(vehicles[nextIndex]) ? (
                <img
                  src={getVehicleImage(vehicles[nextIndex])!}
                  alt={`${vehicles[nextIndex].brand} ${vehicles[nextIndex].model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <DynamicIcon name="car" className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs font-medium text-gray-700 truncate">
                {vehicles[nextIndex]?.vehicle_brands?.name || vehicles[nextIndex]?.brand} {vehicles[nextIndex]?.model}
              </p>
              <p className="text-xs text-gray-500">
                {vehicles[nextIndex]?.daily_rate?.toLocaleString()}원/일
              </p>
            </div>
          </motion.div>
        </div>

        {/* 네비게이션 화살표 */}
        <button
          onClick={prevVehicle}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-20"
        >
          <DynamicIcon name="chevron-left" className="h-5 w-5 text-gray-700" />
        </button>
        
        <button
          onClick={nextVehicle}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-20"
        >
          <DynamicIcon name="chevron-right" className="h-5 w-5 text-gray-700" />
        </button>

        {/* 자동재생 토글 */}
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="absolute bottom-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
        >
          <DynamicIcon 
            name={isAutoPlay ? "pause" : "play"} 
            className="h-4 w-4 text-gray-700" 
          />
        </button>
      </div>

      {/* 하단 썸네일 리스트 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">전체 차량 ({vehicles.length}대)</h4>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {vehicles.length}
          </div>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                index === currentIndex 
                  ? 'transform scale-105' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              whileHover={{ scale: index === currentIndex ? 1.05 : 1.02 }}
              onClick={() => goToVehicle(index)}
            >
              <div className={`w-20 h-12 rounded-lg overflow-hidden border-2 ${
                index === currentIndex 
                  ? 'border-blue-500' 
                  : 'border-transparent'
              }`}>
                {getVehicleImage(vehicle) ? (
                  <img
                    src={getVehicleImage(vehicle)!}
                    alt={`${vehicle?.brand || ''} ${vehicle?.model || ''}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <DynamicIcon name="car" className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-xs text-center mt-1 truncate w-20">
                {vehicle?.model}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
