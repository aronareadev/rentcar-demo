'use client';

import { supabase } from './supabase';
import { BookingFormData } from '@/components/booking/BookingModal';

export interface Booking {
  id: string;
  vehicle_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// 예약 생성 (비회원 지원)
export const createBooking = async (bookingData: BookingFormData, totalAmount: number): Promise<any> => {
  try {
    // 예약번호 생성 (형식: RENT-YYYYMMDD-XXXX)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const reservationNumber = `RENT-${dateStr}-${randomNum}`;

    // 비회원 예약으로 처리 (customer_id는 null)
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        reservation_number: reservationNumber,
        vehicle_id: bookingData.vehicleId,
        customer_id: null, // 비회원은 null
        guest_name: bookingData.customerName, // 비회원 정보
        guest_phone: bookingData.customerPhone,
        guest_email: bookingData.customerEmail,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        start_time: bookingData.startTime,
        end_time: bookingData.endTime,
        pickup_location: '본점', // 기본값
        return_location: '본점', // 기본값
        total_amount: totalAmount,
        status: 'pending', // 예약 대기중
        payment_status: 'pending', // 결제 대기중 (관리자 확정 후 결제)
        notes: bookingData.notes,
      })
      .select()
      .single();

    if (error) {
      console.error('예약 생성 오류:', error);
      throw new Error('예약 생성에 실패했습니다.');
    }

    // 반환할 데이터를 우리 인터페이스에 맞게 변환
    return {
      id: data.id,
      vehicle_id: data.vehicle_id,
      customer_name: data.guest_name,
      customer_phone: data.guest_phone,
      customer_email: data.guest_email,
      start_date: data.start_date,
      end_date: data.end_date,
      start_time: data.start_time,
      end_time: data.end_time,
      status: data.status,
      total_amount: data.total_amount,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('예약 서비스 오류:', error);
    throw error;
  }
};

// 차량 가용성 확인
export const checkVehicleAvailability = async (
  vehicleId: string,
  startDate: string,
  endDate: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('vehicle_id', vehicleId)
      .in('status', ['pending', 'confirmed']) // 확정된 예약만 체크
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

    if (error) {
      console.error('가용성 확인 오류:', error);
      throw new Error('차량 가용성 확인에 실패했습니다.');
    }

    // 겹치는 예약이 없으면 사용 가능
    return data.length === 0;
  } catch (error) {
    console.error('가용성 확인 서비스 오류:', error);
    throw error;
  }
};

// 고객 예약 목록 조회 (비회원 포함)
export const getCustomerBookings = async (customerEmail: string): Promise<any[]> => {
  try {
    // 비회원 예약 조회 (guest_email 기반)
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        vehicles (
          brand,
          model,
          year,
          color,
          vehicle_brands (name),
          vehicle_locations (name)
        )
      `)
      .eq('guest_email', customerEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('예약 조회 오류:', error);
      throw new Error('예약 목록 조회에 실패했습니다.');
    }

    // 데이터를 우리 인터페이스에 맞게 변환
    return (data || []).map(reservation => ({
      id: reservation.id,
      vehicle_id: reservation.vehicle_id,
      customer_name: reservation.guest_name,
      customer_phone: reservation.guest_phone,
      customer_email: reservation.guest_email,
      start_date: reservation.start_date,
      end_date: reservation.end_date,
      start_time: reservation.start_time || '09:00',
      end_time: reservation.end_time || '18:00',
      status: reservation.status,
      total_amount: reservation.total_amount,
      notes: reservation.notes,
      created_at: reservation.created_at,
      updated_at: reservation.updated_at,
      vehicles: reservation.vehicles
    }));
  } catch (error) {
    console.error('고객 예약 서비스 오류:', error);
    throw error;
  }
};

// 예약 상태 업데이트
export const updateBookingStatus = async (
  bookingId: string,
  status: Booking['status']
): Promise<Booking> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('예약 상태 업데이트 오류:', error);
      throw new Error('예약 상태 업데이트에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('예약 상태 서비스 오류:', error);
    throw error;
  }
};

// 예약 상세 조회
export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        vehicles (
          brand,
          model,
          year,
          color,
          daily_rate,
          vehicle_brands (name),
          vehicle_locations (name, address),
          vehicle_categories (name)
        )
      `)
      .eq('id', bookingId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // 예약을 찾을 수 없음
      }
      console.error('예약 조회 오류:', error);
      throw new Error('예약 조회에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('예약 조회 서비스 오류:', error);
    throw error;
  }
};

// 특정 차량의 예약된 날짜 범위 조회 (캘린더용)
export const getVehicleBookedDates = async (
  vehicleId: string,
  startDate: string,
  endDate: string
): Promise<Array<{ start_date: string; end_date: string }>> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('start_date, end_date')
      .eq('vehicle_id', vehicleId)
      .in('status', ['pending', 'confirmed']) // 확정된 예약만
      .gte('end_date', startDate)
      .lte('start_date', endDate);

    if (error) {
      console.error('예약 날짜 조회 오류:', error);
      throw new Error('예약 날짜 조회에 실패했습니다.');
    }

    return data || [];
  } catch (error) {
    console.error('예약 날짜 서비스 오류:', error);
    throw error;
  }
};