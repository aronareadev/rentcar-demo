'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeLayout } from '@/components/layout/ThemeLayout';
import { SubPageHeader } from '@/components/layout/SubPageHeader';
import { Button } from '@/components/ui';
import { getVehicles, getVehicleCategories, getVehicleLocations, getVehicleBrands, VehicleWithBrand } from '@/lib/vehicleService';
import { createBooking, checkVehicleAvailability } from '@/lib/bookingService';
import { DynamicIcon } from '@/lib/iconMap';
import { VehicleCarousel } from '@/components/vehicles/VehicleCarousel';
import { BookingModal, BookingFormData } from '@/components/booking/BookingModal';
import { BookingSuccessModal } from '@/components/booking/BookingSuccessModal';
import { Booking } from '@/lib/bookingService';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleWithBrand[]>([]);
  const [categories, setCategories] = useState<string[]>(['전체']);
  const [locations, setLocations] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('전체');
  const [activeLocation, setActiveLocation] = useState('전체');
  const [activeBrand, setActiveBrand] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'carousel'>('table');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithBrand | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // 뷰 모드 변경 시 필터 상태 조정
  useEffect(() => {
    if (viewMode === 'carousel') {
      setIsFiltersOpen(false); // 캐러셀 뷰에서는 기본적으로 필터 닫기
    } else {
      setIsFiltersOpen(true); // 테이블 뷰에서는 기본적으로 필터 열기
    }
  }, [viewMode]);

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 차량 데이터 우선 로드
        const vehiclesData = await getVehicles();
        setVehicles(vehiclesData);
        
                // 카테고리, 위치, 브랜드는 오류가 나도 기본값 사용
        try {
          const categoriesData = await getVehicleCategories();
          const categoryNames = categoriesData.map(cat => cat.name);
          setCategories(['전체', ...categoryNames]);
        } catch (error) {
          console.warn('카테고리 로드 실패, 기본값 사용:', error);
          setCategories(['전체']);
        }

        try {
          const locationsData = await getVehicleLocations();
          setLocations([{ name: '전체' }, ...locationsData]);
        } catch (error) {
          console.warn('위치 로드 실패, 기본값 사용:', error);
          setLocations([{ name: '전체' }]);
        }

        try {
          const brandsData = await getVehicleBrands();
          setBrands([{ name: '전체', logo_url: null }, ...brandsData]);
        } catch (error) {
          console.warn('브랜드 로드 실패, 기본값 사용:', error);
          setBrands([{ name: '전체', logo_url: null }]);
        }
        
      } catch (error) {
        console.error('차량 데이터 로드 실패:', error);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 필터링된 차량 목록
  const filteredVehicles = vehicles.filter(vehicle => {
    const categoryName = vehicle.vehicle_categories?.name || vehicle.category;
    const locationName = vehicle.vehicle_locations?.name || vehicle.location;
    const brandName = vehicle.vehicle_brands?.name || vehicle.brand;
    
    const matchesCategory = activeCategory === '전체' || categoryName === activeCategory;
    const matchesLocation = activeLocation === '전체' || locationName === activeLocation;
    const matchesBrand = activeBrand === '전체' || brandName === activeBrand;
    const matchesSearch = 
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brandName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLocation && matchesBrand && matchesSearch;
  });

  // 예약하기 버튼 클릭 핸들러
  const handleBookingClick = (vehicle: VehicleWithBrand) => {
    setSelectedVehicle(vehicle);
    setIsBookingModalOpen(true);
  };

  // 예약 제출 핸들러
  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    try {
      if (!selectedVehicle?.daily_rate) {
        throw new Error('차량 정보가 올바르지 않습니다.');
      }

      // 차량 가용성 확인
      const isAvailable = await checkVehicleAvailability(
        bookingData.vehicleId,
        bookingData.startDate,
        bookingData.endDate
      );

      if (!isAvailable) {
        alert('선택하신 기간에는 해당 차량을 이용할 수 없습니다. 다른 날짜를 선택해주세요.');
        return;
      }

      // 총 금액 계산
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const totalAmount = selectedVehicle.daily_rate * diffDays;

      // 예약 생성
      const booking = await createBooking(bookingData, totalAmount);
      
      // 예약 모달 닫기
      setIsBookingModalOpen(false);
      
      // 성공 모달 표시
      setCompletedBooking(booking);
      setIsSuccessModalOpen(true);
      
    } catch (error) {
      console.error('예약 처리 오류:', error);
      alert('예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 예약 모달 닫기 핸들러
  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false);
    setSelectedVehicle(null);
  };

  // 성공 모달 닫기 핸들러
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setCompletedBooking(null);
    setSelectedVehicle(null);
  };

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

          {/* View Mode Tabs */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <DynamicIcon name="list" className="h-4 w-4" />
                  <span>테이블 뷰</span>
                </div>
              </button>
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'carousel'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <DynamicIcon name="grid" className="h-4 w-4" />
                  <span>카드 뷰</span>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* 필터 헤더 (항상 표시) */}
            <div className={`${viewMode === 'carousel' ? 'p-3' : 'p-4'} border-b border-gray-100`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className={`font-medium text-gray-900 ${viewMode === 'carousel' ? 'text-base' : 'text-lg'}`}>
                    검색 및 필터
                  </h3>
                  <div className={`text-gray-500 ${viewMode === 'carousel' ? 'text-xs' : 'text-sm'}`}>
                    {filteredVehicles.length}대 차량
                  </div>
                  
                  {/* 캐러셀 뷰일 때 활성 필터 표시 */}
                  {viewMode === 'carousel' && !isFiltersOpen && (
                    <div className="flex items-center space-x-1">
                      {activeBrand !== '전체' && (
                        <span className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {activeBrand}
                        </span>
                      )}
                      {activeCategory !== '전체' && (
                        <span className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          {activeCategory}
                        </span>
                      )}
                      {activeLocation !== '전체' && (
                        <span className="px-1 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                          {activeLocation}
                        </span>
                      )}
                      {searchTerm && (
                        <span className="px-1 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                          "{searchTerm}"
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors ${
                    viewMode === 'carousel' ? 'text-xs' : 'text-sm'
                  }`}
                >
                  <span>{isFiltersOpen ? '접기' : '펼치기'}</span>
                  <DynamicIcon 
                    name={isFiltersOpen ? "chevron-up" : "chevron-down"} 
                    className="h-4 w-4" 
                  />
                </button>
              </div>
            </div>

            {/* 필터 내용 (접을 수 있음) */}
            <AnimatePresence>
              {isFiltersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    {/* 브랜드 필터 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">브랜드</label>
                      <div className="flex flex-wrap gap-1">
                        {brands.map((brand) => (
                          <button
                            key={brand.name}
                            onClick={() => setActiveBrand(brand.name)}
                            className={`flex items-center px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                              activeBrand === brand.name
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {brand.logo_url && brand.name !== '전체' && (
                              <img 
                                src={brand.logo_url} 
                                alt={brand.name}
                                className="w-4 h-4 mr-1 object-contain"
                              />
                            )}
                            {brand.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* 카테고리, 지역, 검색 - 한 줄로 배치 */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                      {/* 카테고리 필터 */}
                      <div className="lg:col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-2">차량 카테고리</label>
                        <div className="flex flex-wrap gap-1">
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => setActiveCategory(category)}
                              className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                                activeCategory === category
                                  ? 'bg-green-600 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* 지역 */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">지역</label>
                        <select 
                          value={activeLocation}
                          onChange={(e) => setActiveLocation(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          {locations.map((location) => (
                            <option key={location.name} value={location.name}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* 차량 검색 */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">검색</label>
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="차량명/브랜드"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded-l text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent min-w-0"
                          />
                          <button className="px-2 py-1 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition-colors flex-shrink-0">
                            <DynamicIcon name="search" className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 빠른 필터 리셋 */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center flex-wrap gap-1 text-xs text-gray-600">
                        <span className="text-xs">활성:</span>
                        {activeBrand !== '전체' && (
                          <span className="px-1 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                            {activeBrand}
                          </span>
                        )}
                        {activeCategory !== '전체' && (
                          <span className="px-1 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                            {activeCategory}
                          </span>
                        )}
                        {activeLocation !== '전체' && (
                          <span className="px-1 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                            {activeLocation}
                          </span>
                        )}
                        {searchTerm && (
                          <span className="px-1 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                            "{searchTerm}"
                          </span>
                        )}
                      </div>
                      
                      {(activeBrand !== '전체' || activeCategory !== '전체' || activeLocation !== '전체' || searchTerm) && (
                        <button
                          onClick={() => {
                            setActiveBrand('전체');
                            setActiveCategory('전체');
                            setActiveLocation('전체');
                            setSearchTerm('');
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          초기화
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              className="bg-white rounded-lg shadow-sm p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">차량 정보를 불러오는 중...</span>
              </div>
            </motion.div>
          )}

          {/* Content based on view mode */}
          {!loading && (
            <AnimatePresence mode="wait">
              {viewMode === 'table' ? (
                /* Table View */
                <motion.div
                  key="table"
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">No</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">차량번호</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">차량정보</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">카테고리</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">일일요금</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">연료/승차</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">상태</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">예약</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredVehicles.map((vehicle, index) => (
                          <motion.tr
                            key={vehicle.id}
                            className="hover:bg-gray-50 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-6 py-4 text-sm font-mono text-gray-700">
                              {vehicle.vehicle_number}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                                  {vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0 ? (
                                    <img 
                                      src={(vehicle.images[0] as any)?.url || ''} 
                                      alt={(vehicle.images[0] as any)?.alt || `${vehicle.brand} ${vehicle.model}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <DynamicIcon name="car" className="h-6 w-6 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {vehicle.vehicle_brands?.name || vehicle.brand} {vehicle.model}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {vehicle.year}년 • {vehicle.color} • {vehicle.transmission === 'automatic' ? '자동' : '수동'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {vehicle.vehicle_categories?.name || vehicle.category || '일반'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {vehicle.daily_rate?.toLocaleString()}원
                              </div>
                              <div className="text-xs text-gray-500">일일 기준</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div>{vehicle.fuel_type}</div>
                              <div>{vehicle.passengers}인승</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                vehicle.status === 'available'
                                  ? 'bg-green-100 text-green-800'
                                  : vehicle.status === 'rented'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {vehicle.status === 'available' ? '예약가능' : 
                                 vehicle.status === 'rented' ? '대여중' : '예약불가'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                onClick={() => handleBookingClick(vehicle)}
                                disabled={vehicle.status !== 'available'}
                                size="sm"
                                className={`
                                  ${vehicle.status === 'available' 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }
                                  px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                `}
                              >
                                {vehicle.status === 'available' ? '예약하기' : '예약불가'}
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                /* Carousel View */
                <motion.div
                  key="carousel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <VehicleCarousel
                    vehicles={filteredVehicles}
                    currentIndex={currentIndex}
                    onIndexChange={setCurrentIndex}
                    onBookingClick={handleBookingClick}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Empty State */}
          {!loading && filteredVehicles.length === 0 && (
            <motion.div
              className="bg-white rounded-lg shadow-sm p-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-center">
                <DynamicIcon name="car" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-500 mb-4">검색 조건에 맞는 차량이 없습니다. 다른 조건으로 검색해보세요.</p>
                <Button
                  onClick={() => {
                    setActiveCategory('전체');
                    setActiveLocation('전체');
                    setSearchTerm('');
                  }}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  필터 초기화
                </Button>
              </div>
            </motion.div>
          )}

          {/* 검색 결과 요약 (테이블 뷰에서만 표시) */}
          {!loading && filteredVehicles.length > 0 && viewMode === 'table' && (
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DynamicIcon name="info" className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    총 <strong>{filteredVehicles.length}대</strong>의 차량이 검색되었습니다.
                  </span>
                </div>
                <div className="text-sm text-blue-600">
                  예약 가능: <strong>{filteredVehicles.filter(v => v.status === 'available').length}대</strong>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 예약 모달 */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
        vehicle={selectedVehicle}
        onBookingSubmit={handleBookingSubmit}
      />

      {/* 예약 성공 모달 */}
      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        booking={completedBooking}
        vehicle={selectedVehicle}
      />
    </ThemeLayout>
  );
} 