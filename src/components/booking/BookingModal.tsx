'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicIcon } from '@/lib/iconMap';
import { Button } from '@/components/ui';
import { VehicleWithBrand } from '@/lib/vehicleService';
import { BookingCalendar } from './BookingCalendar';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleWithBrand | null;
  onBookingSubmit: (bookingData: BookingFormData) => void;
}

export interface BookingFormData {
  vehicleId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export const BookingModal = ({ 
  isOpen, 
  onClose, 
  vehicle, 
  onBookingSubmit 
}: BookingModalProps) => {
  // 오늘 날짜 구하기 (기본값용)
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<BookingFormData>({
    vehicleId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    startDate: today,
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 차량 변경 시 formData 업데이트
  useEffect(() => {
    if (vehicle) {
      setFormData(prev => ({
        ...prev,
        vehicleId: vehicle.id
      }));
    }
  }, [vehicle]);

  // 모달이 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        vehicleId: vehicle?.id || '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        startDate: today,
        endDate: '',
        startTime: '09:00',
        endTime: '18:00',
        notes: ''
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, vehicle?.id, today]);

  // 종료일 최소값 계산 (시작일과 같거나 이후)
  const minEndDate = formData.startDate || today;

  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = '이름을 입력해주세요';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = '연락처를 입력해주세요';
    } else if (!/^[0-9-+\s()]*$/.test(formData.customerPhone)) {
      newErrors.customerPhone = '올바른 연락처 형식이 아닙니다';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.startDate) {
      newErrors.startDate = '대여 시작일을 선택해주세요';
    }

    if (!formData.endDate) {
      newErrors.endDate = '대여 종료일을 선택해주세요';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = '종료일은 시작일 이후여야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onBookingSubmit(formData);
      onClose();
    } catch (error) {
      console.error('예약 제출 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 대여 일수 계산
  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    }
    return 1;
  };

  // 총 금액 계산
  const calculateTotal = () => {
    if (vehicle?.daily_rate) {
      return vehicle.daily_rate * calculateDays();
    }
    return 0;
  };

  if (!vehicle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #374151;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #6b7280;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />
          
          {/* 모달 컨텐츠 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gray-900/95 backdrop-blur-md shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-700/50"
          >
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-gray-800/90 to-black/90 backdrop-blur-sm text-white p-3 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">렌트 차량 예약</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <DynamicIcon name="x" className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 스크롤 가능한 컨텐츠 */}
            <div 
              className="overflow-y-auto flex-1 custom-scrollbar"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#6b7280 #374151'
              }}
            >
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 좌측 폼 영역 */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                {/* 차량 정보 요약 */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">
                        {vehicle.vehicle_brands?.name || vehicle.brand} {vehicle.model}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span>{vehicle.year}년</span>
                        <span>•</span>
                        <span>{vehicle.color}</span>
                        <span>•</span>
                        <span>{vehicle.passengers}인승</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">
                        {vehicle.daily_rate?.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-400">일일 요금</div>
                    </div>
                  </div>
                </div>

                {/* 고객 정보 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      고객 정보
                    </h3>
                  </div>
                  
                  {/* 비회원 예약 안내 */}
                  <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <DynamicIcon name="info" className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-200">
                        <p className="font-medium mb-1">비회원 예약 안내</p>
                        <p>입력하신 <strong>이메일 주소</strong>로 예약 조회가 가능합니다. 정확한 이메일을 입력해주세요.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-3">
                      <label className="block text-xs font-medium text-white mb-2">
                        이름 *
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className={`w-full px-3 py-2 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                          errors.customerName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="김렌트"
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    <div className="lg:col-span-4">
                      <label className="block text-xs font-medium text-white mb-2">
                        연락처 *
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        className={`w-full px-3 py-2 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                          errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="010-1234-5678"
                      />
                      {errors.customerPhone && (
                        <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>
                      )}
                    </div>

                    <div className="lg:col-span-5">
                      <label className="block text-xs font-medium text-white mb-2">
                        이메일 * <span className="text-blue-400">(예약 조회용)</span>
                      </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                        errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="hong@example.com"
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">이 이메일로 예약 내역을 조회하실 수 있습니다</p>
                    </div>
                  </div>
                </div>

                {/* 대여 기간 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                    대여 기간
                  </h3>
                  
                  {/* 캘린더 */}
                  <div className="bg-white rounded-lg p-4">
                    <BookingCalendar
                      vehicleId={formData.vehicleId}
                      onDateChange={(startDate, endDate) => {
                        handleInputChange('startDate', startDate);
                        handleInputChange('endDate', endDate);
                      }}
                      initialStartDate={formData.startDate}
                      initialEndDate={formData.endDate}
                    />
                  </div>

                  {/* 시간 선택 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white mb-2">
                        픽업 시간
                      </label>
                      <select
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <option key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white mb-2">
                        반납 시간
                      </label>
                      <select
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <option key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* 에러 메시지 */}
                  {(errors.startDate || errors.endDate) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      {errors.startDate && (
                        <p className="text-red-600 text-sm">{errors.startDate}</p>
                      )}
                      {errors.endDate && (
                        <p className="text-red-600 text-sm">{errors.endDate}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* 요청사항 */}
                <div>
                  <label className="block text-xs font-medium text-white mb-2">
                    요청사항 (선택)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="특별한 요청사항이 있으시면 입력해주세요..."
                  />
                </div>

                </form>

                {/* 우측 요금 요약 및 버튼 영역 */}
                <div className="lg:col-span-1 space-y-4">
                  {/* 요금 요약 */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 sticky top-4">
                    <h3 className="font-semibold text-white border-b border-gray-700 pb-2 mb-3">요금 요약</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white">일일 요금</span>
                        <span className="text-white">{vehicle.daily_rate?.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white">대여 일수</span>
                        <span className="text-white">{calculateDays()}일</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white">소계</span>
                        <span className="text-white">{calculateTotal().toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-white">첫 런칭 할인</span>
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">5%</span>
                        </div>
                        <span className="text-white font-medium">-{Math.round(calculateTotal() * 0.05).toLocaleString()}원</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span className="text-white">최종 금액</span>
                          <span className="text-white drop-shadow-lg">{Math.round(calculateTotal() * 0.95).toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>

                    {/* 버튼들을 요금 요약 안으로 이동 */}
                    <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-gray-600">
                      <Button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 text-sm"
                        disabled={isSubmitting}
                      >
                        취소
                      </Button>
                      <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            처리중...
                          </div>
                        ) : (
                          '예약하기'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </motion.div>
        </div>
        </>
      )}
    </AnimatePresence>
  );
};
