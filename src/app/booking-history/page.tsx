'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeLayout } from '@/components/layout/ThemeLayout';
import { SubPageHeader } from '@/components/layout/SubPageHeader';
import { Button } from '@/components/ui';
import { getCustomerBookings, Booking } from '@/lib/bookingService';
import { DynamicIcon } from '@/lib/iconMap';

export default function BookingHistoryPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // URL 파라미터에서 이메일 자동 설정
  useEffect(() => {
    const emailParam = searchParams?.get('email');
    if (emailParam) {
      setEmail(emailParam);
      // 자동으로 검색 실행
      handleSearchWithEmail(emailParam);
    }
  }, [searchParams]);

  const handleSearchWithEmail = async (searchEmail: string) => {
    if (!searchEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const customerBookings = await getCustomerBookings(searchEmail);
      setBookings(customerBookings);
      setSearched(true);
    } catch (error) {
      console.error('예약 조회 오류:', error);
      alert('예약 조회 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    handleSearchWithEmail(email);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { label: '예약 신청', color: 'bg-yellow-100 text-yellow-800' },
      'confirmed': { label: '예약 확정', color: 'bg-green-100 text-green-800' },
      'active': { label: '대여중', color: 'bg-blue-100 text-blue-800' },
      'completed': { label: '반납 완료', color: 'bg-gray-100 text-gray-800' },
      'cancelled': { label: '취소됨', color: 'bg-red-100 text-red-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <ThemeLayout>
      <SubPageHeader
        title="예약 내역 조회"
        subtitle="이메일로 예약 내역을 조회하실 수 있습니다."
        prevPage={{ title: "차량정보", href: "/vehicles" }}
        nextPage={{ title: "메인으로", href: "/" }}
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 검색 영역 */}
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">예약 내역 검색</h2>
            <div className="flex space-x-4">
              <input
                type="email"
                placeholder="예약 시 사용한 이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>검색 중...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <DynamicIcon name="search" className="h-4 w-4" />
                    <span>검색</span>
                  </div>
                )}
              </Button>
            </div>
          </motion.div>

          {/* 검색 결과 */}
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {bookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <DynamicIcon name="calendar" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">예약 내역이 없습니다</h3>
                  <p className="text-gray-500">해당 이메일로 등록된 예약이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      예약 내역 ({bookings.length}건)
                    </h2>
                    <p className="text-sm text-gray-600">
                      {email}님의 예약 내역입니다
                    </p>
                  </div>

                  {bookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                예약번호: {booking.id}
                              </h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <p className="text-sm text-gray-600">
                              예약일: {new Date(booking.created_at).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 차량 정보 */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <DynamicIcon name="car" className="h-4 w-4 mr-2 text-blue-600" />
                              차량 정보
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                              <p className="text-sm">
                                <span className="text-gray-600">차량:</span>
                                <span className="font-medium ml-2">
                                  {(booking as any).vehicles?.vehicle_brands?.name || (booking as any).vehicles?.brand} {(booking as any).vehicles?.model}
                                </span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-600">연식:</span>
                                <span className="ml-2">{(booking as any).vehicles?.year}년</span>
                              </p>
                            </div>
                          </div>

                          {/* 예약 정보 */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <DynamicIcon name="calendar" className="h-4 w-4 mr-2 text-blue-600" />
                              예약 정보
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                              <p className="text-sm">
                                <span className="text-gray-600">시작:</span>
                                <span className="ml-2">{formatDate(booking.start_date)} {formatTime(booking.start_time)}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-600">종료:</span>
                                <span className="ml-2">{formatDate(booking.end_date)} {formatTime(booking.end_time)}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-600">총 금액:</span>
                                <span className="font-semibold text-blue-600 ml-2">
                                  {booking.total_amount.toLocaleString()}원
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 요청사항 */}
                        {booking.notes && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                              <DynamicIcon name="message-square" className="h-4 w-4 mr-2 text-blue-600" />
                              요청사항
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-700">{booking.notes}</p>
                            </div>
                          </div>
                        )}

                        {/* 연락처 정보 */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div>
                              <span>예약자: {booking.customer_name}</span>
                              <span className="mx-2">•</span>
                              <span>{booking.customer_phone}</span>
                            </div>
                            <span>{booking.customer_email}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </ThemeLayout>
  );
}
