'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicIcon } from '@/lib/iconMap';
import { Button } from '@/components/ui';
import { VehicleWithBrand } from '@/lib/vehicleService';
import { Booking } from '@/lib/bookingService';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  vehicle: VehicleWithBrand | null;
}

export const BookingSuccessModal = ({
  isOpen,
  onClose,
  booking,
  vehicle
}: BookingSuccessModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!booking || !vehicle) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5); // HH:mm 형식으로 변환
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const calculateDays = () => {
    const start = new Date(booking.start_date);
    const end = new Date(booking.end_date);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const copyBookingId = () => {
    navigator.clipboard.writeText(booking.id);
    // 간단한 툴팁 표시를 위해 임시로 버튼 텍스트 변경
    const button = document.getElementById('copy-button');
    if (button) {
      const originalText = button.textContent;
      button.textContent = '복사됨!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    }
  };

  const downloadBookingDetails = () => {
    const bookingDetails = `
예약 확인서
━━━━━━━━━━━━━━━━━━━━━━━━━━

예약번호: ${booking.id}
예약일시: ${new Date(booking.created_at).toLocaleString('ko-KR')}

고객 정보
- 이름: ${booking.customer_name}
- 연락처: ${booking.customer_phone}
- 이메일: ${booking.customer_email}

차량 정보
- 차량: ${vehicle.vehicle_brands?.name || vehicle.brand} ${vehicle.model}
- 연식: ${vehicle.year}년
- 색상: ${vehicle.color}
- 차량번호: ${vehicle.vehicle_number}

예약 정보
- 시작일: ${formatDate(booking.start_date)} ${formatTime(booking.start_time)}
- 종료일: ${formatDate(booking.end_date)} ${formatTime(booking.end_time)}
- 대여기간: ${calculateDays()}일
- 총 금액: ${formatCurrency(booking.total_amount)}원

요청사항: ${booking.notes || '없음'}

예약 상태: ${booking.status === 'pending' ? '확인 대기' : booking.status}

━━━━━━━━━━━━━━━━━━━━━━━━━━
렌트카 예약 시스템
    `;

    const blob = new Blob([bookingDetails], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `예약확인서_${booking.id.slice(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: isClosing ? 0.9 : 1, opacity: isClosing ? 0 : 1, y: isClosing ? 20 : 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <DynamicIcon name="check" className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">예약 신청 완료!</h2>
                    <p className="text-green-100 text-sm">예약 신청이 접수되었습니다. 관리자 확인 후 연락드리겠습니다.</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                >
                  <DynamicIcon name="x" className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 예약번호 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">예약번호</p>
                    <p className="text-lg font-mono font-bold text-green-800">{booking.id}</p>
                  </div>
                  <button
                    id="copy-button"
                    onClick={copyBookingId}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    복사
                  </button>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  📞 고객센터 문의 시 위 예약번호를 알려주세요
                </p>
              </div>

              {/* 차량 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <DynamicIcon name="car" className="h-5 w-5 mr-2 text-blue-600" />
                  예약 차량
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                    {vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0 ? (
                      <img 
                        src={(vehicle.images[0] as any)?.url || ''} 
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <DynamicIcon name="car" className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {vehicle.vehicle_brands?.name || vehicle.brand} {vehicle.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      {vehicle.year}년 • {vehicle.color} • {vehicle.vehicle_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* 예약 정보 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <DynamicIcon name="calendar" className="h-5 w-5 mr-2 text-blue-600" />
                  예약 정보
                </h3>
                
                <div className="grid grid-cols-1 gap-3 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="text-sm text-gray-600">시작일시</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(booking.start_date)} {formatTime(booking.start_time)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="text-sm text-gray-600">종료일시</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(booking.end_date)} {formatTime(booking.end_time)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="text-sm text-gray-600">대여기간</span>
                    <span className="font-medium text-blue-600">{calculateDays()}일</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">총 금액</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(booking.total_amount)}원
                    </span>
                  </div>
                </div>
              </div>

              {/* 고객 정보 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <DynamicIcon name="user" className="h-5 w-5 mr-2 text-blue-600" />
                  예약자 정보
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">이름</span>
                    <span className="font-medium text-gray-900">{booking.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">연락처</span>
                    <span className="font-medium text-gray-900">{booking.customer_phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">이메일</span>
                    <span className="font-medium text-gray-900">{booking.customer_email}</span>
                  </div>
                </div>
              </div>

              {/* 요청사항 */}
              {booking.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <DynamicIcon name="message-square" className="h-5 w-5 mr-2 text-blue-600" />
                    요청사항
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{booking.notes}</p>
                  </div>
                </div>
              )}

              {/* 다음 단계 안내 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <DynamicIcon name="info" className="h-4 w-4 mr-2" />
                  다음 단계 안내
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>관리자 검토</strong>: 예약 신청을 검토한 후 연락드리겠습니다</li>
                  <li>• <strong>예약 확정</strong>: 승인 시 예약이 확정되며 결제 안내를 해드립니다</li>
                  <li>• <strong>차량 인수</strong>: 신분증과 운전면허증을 지참해주세요</li>
                  <li>• <strong>문의사항</strong>: 변경이나 취소는 고객센터로 연락주세요</li>
                </ul>
              </div>

              {/* 액션 버튼들 */}
              <div className="space-y-3 pt-4">
                <div className="flex space-x-3">
                  <Button
                    onClick={downloadBookingDetails}
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <DynamicIcon name="download" className="h-4 w-4 mr-2" />
                    예약서 다운로드
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(`/booking-history?email=${booking.customer_email}`, '_blank');
                    }}
                    variant="outline"
                    className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <DynamicIcon name="calendar" className="h-4 w-4 mr-2" />
                    예약 내역 조회
                  </Button>
                </div>
                <Button
                  onClick={handleClose}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  확인
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
