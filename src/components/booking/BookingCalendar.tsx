'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getVehicleBookedDates } from '@/lib/bookingService';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface BookingCalendarProps {
  vehicleId: string;
  onDateChange: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

export const BookingCalendar = ({ 
  vehicleId, 
  onDateChange, 
  initialStartDate, 
  initialEndDate 
}: BookingCalendarProps) => {
  const [selectedRange, setSelectedRange] = useState<Value>(null);
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // 초기 날짜 설정
  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      setSelectedRange([new Date(initialStartDate), new Date(initialEndDate)]);
    }
  }, [initialStartDate, initialEndDate]);

  // 예약 불가능한 날짜들을 미리 로드
  useEffect(() => {
    const loadUnavailableDates = async () => {
      if (!vehicleId) return;
      
      setLoading(true);
      const unavailable = new Set<string>();
      
      try {
        // 향후 3개월간의 예약 데이터 조회
        const today = new Date();
        const futureDate = new Date();
        futureDate.setMonth(today.getMonth() + 3);
        
        const startDate = today.toISOString().split('T')[0];
        const endDate = futureDate.toISOString().split('T')[0];
        
        // 예약된 날짜 범위들을 가져옴
        const bookedRanges = await getVehicleBookedDates(vehicleId, startDate, endDate);
        
        // 예약된 날짜 범위를 개별 날짜로 변환
        bookedRanges.forEach(range => {
          const start = new Date(range.start_date);
          const end = new Date(range.end_date);
          
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            unavailable.add(dateStr);
          }
        });
        
        setUnavailableDates(unavailable);
      } catch (error) {
        console.error('예약 날짜 로딩 실패:', error);
        // 에러 시 빈 Set으로 설정 (모든 날짜 사용 가능으로 표시)
        setUnavailableDates(new Set());
      } finally {
        setLoading(false);
      }
    };

    loadUnavailableDates();
  }, [vehicleId]);

  // 날짜 선택 핸들러
  const handleDateChange = (value: Value) => {
    setSelectedRange(value);
    
    if (Array.isArray(value) && value[0] && value[1]) {
      const startDate = value[0].toISOString().split('T')[0];
      const endDate = value[1].toISOString().split('T')[0];
      onDateChange(startDate, endDate);
    } else if (value instanceof Date) {
      const dateStr = value.toISOString().split('T')[0];
      onDateChange(dateStr, dateStr);
    }
  };

  // 날짜가 비활성화되어야 하는지 확인
  const isDateDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 과거 날짜는 비활성화
    if (date < today) return true;
    
    // 예약 불가능한 날짜는 비활성화
    const dateStr = date.toISOString().split('T')[0];
    return unavailableDates.has(dateStr);
  };

  // 특별한 날짜에 클래스 추가
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    const dateStr = date.toISOString().split('T')[0];
    const classes = [];
    
    // 예약 불가능한 날짜
    if (unavailableDates.has(dateStr)) {
      classes.push('unavailable-date');
    }
    
    // 오늘 날짜
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      classes.push('today');
    }
    
    return classes.join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 text-sm">캘린더 로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-calendar">
      <style jsx global>{`
        .booking-calendar .react-calendar {
          width: 100%;
          max-width: 100%;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-family: inherit;
          line-height: 1.125em;
        }
        
        .booking-calendar .react-calendar--doubleView {
          width: 700px;
        }
        
        .booking-calendar .react-calendar__navigation {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          height: 3rem;
          margin-bottom: 0;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .booking-calendar .react-calendar__navigation button {
          color: #374151;
          min-width: 2.5rem;
          background: none;
          font-size: 1rem;
          margin-top: 0.5rem;
        }
        
        .booking-calendar .react-calendar__navigation button:enabled:hover,
        .booking-calendar .react-calendar__navigation button:enabled:focus {
          background-color: #e5e7eb;
          border-radius: 0.25rem;
        }
        
        .booking-calendar .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.75rem;
          color: #6b7280;
          background: #f9fafb;
        }
        
        .booking-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .booking-calendar .react-calendar__tile {
          max-width: 100%;
          padding: 0.75rem 0.25rem;
          background: none;
          text-align: center;
          line-height: 1rem;
          font-size: 0.875rem;
          border: none;
          transition: all 0.2s ease;
        }
        
        .booking-calendar .react-calendar__tile:enabled:hover,
        .booking-calendar .react-calendar__tile:enabled:focus {
          background-color: #dbeafe;
          color: #1e40af;
          border-radius: 0.25rem;
        }
        
        .booking-calendar .react-calendar__tile--active {
          background: #3b82f6;
          color: white;
          border-radius: 0.25rem;
        }
        
        .booking-calendar .react-calendar__tile--rangeStart,
        .booking-calendar .react-calendar__tile--rangeEnd {
          background: #1e40af;
          color: white;
          border-radius: 0.25rem;
        }
        
        .booking-calendar .react-calendar__tile--rangeBetween {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .booking-calendar .unavailable-date {
          background: #fee2e2 !important;
          color: #dc2626 !important;
          text-decoration: line-through;
          cursor: not-allowed !important;
        }
        
        .booking-calendar .unavailable-date:hover {
          background: #fecaca !important;
        }
        
        .booking-calendar .today {
          background: #fef3c7;
          color: #d97706;
          font-weight: 600;
        }
        
        .booking-calendar .react-calendar__tile:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">예약 날짜 선택</h4>
        <p className="text-xs text-gray-600">
          시작일과 종료일을 선택하세요. <span className="text-red-600">빨간색 날짜</span>는 예약 불가능합니다.
        </p>
      </div>
      
      <Calendar
        onChange={handleDateChange}
        value={selectedRange}
        selectRange={true}
        tileDisabled={isDateDisabled}
        tileClassName={getTileClassName}
        minDate={new Date()}
        maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 3개월 후까지
        locale="ko-KR"
        formatShortWeekday={(locale, date) => {
          const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
          return weekdays[date.getDay()];
        }}
      />
      
      {selectedRange && Array.isArray(selectedRange) && selectedRange[0] && selectedRange[1] && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-600">선택한 기간:</span>
              <span className="font-medium text-gray-900 ml-2">
                {selectedRange[0].toLocaleDateString('ko-KR')} ~ {selectedRange[1].toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div>
              <span className="text-gray-600">총</span>
              <span className="font-bold text-blue-600 ml-1">
                {Math.ceil((selectedRange[1].getTime() - selectedRange[0].getTime()) / (1000 * 60 * 60 * 24)) + 1}일
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
