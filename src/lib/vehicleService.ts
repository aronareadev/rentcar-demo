'use client';

import { supabase } from './supabase';
import { Tables } from './supabase';

export type Vehicle = Tables<'vehicles'>;
export type VehicleWithBrand = Vehicle & {
  vehicle_brands?: {
    id: string;
    name: string;
    logo_url: string | null;
    country: string | null;
  } | null;
  vehicle_locations?: {
    id: string;
    name: string;
    address: string;
    manager_name: string | null;
    manager_phone: string | null;
  } | null;
  vehicle_categories?: {
    id: string;
    name: string;
    description: string | null;
    base_daily_rate: number;
    price_multiplier: number | null;
  } | null;
};

// 차량 목록 조회
export const getVehicles = async (filters?: {
  status?: string;
  category?: string;
  location?: string;
  search?: string;
}) => {
  try {
    let query = supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_brands!fk_vehicles_brand (
          id,
          name,
          logo_url,
          country
        ),
        vehicle_locations!fk_vehicles_location (
          id,
          name,
          address,
          manager_name,
          manager_phone
        ),
        vehicle_categories!fk_vehicles_category (
          id,
          name,
          description,
          base_daily_rate,
          price_multiplier
        )
      `)
      .order('created_at', { ascending: false });

    // 필터 적용
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.category) {
      // 카테고리 이름으로 필터링
      query = query.eq('vehicle_categories.name', filters.category);
    }
    
    if (filters?.location) {
      // 위치 이름으로 필터링
      query = query.eq('vehicle_locations.name', filters.location);
    }
    
    if (filters?.search) {
      query = query.or(`model.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,vehicle_brands.name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('차량 조회 오류:', error);
      throw error;
    }

    return (data as VehicleWithBrand[]) || [];
  } catch (error) {
    console.error('차량 목록 조회 실패:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
};

// 특정 차량 조회
export const getVehicleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_brands!fk_vehicles_brand (
          id,
          name,
          logo_url,
          country
        ),
        vehicle_locations!fk_vehicles_location (
          id,
          name,
          address,
          manager_name,
          manager_phone
        ),
        vehicle_categories!fk_vehicles_category (
          id,
          name,
          description,
          base_daily_rate,
          price_multiplier
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('차량 상세 조회 오류:', error);
      throw error;
    }

    return data as VehicleWithBrand;
  } catch (error) {
    console.error('차량 상세 조회 실패:', error);
    throw error;
  }
};

// 차량 가용성 확인
export const checkVehicleAvailability = async (
  vehicleId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('vehicle_id', vehicleId)
      .eq('status', 'confirmed')
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

    if (error) {
      console.error('차량 가용성 확인 오류:', error);
      throw error;
    }

    // 예약이 있으면 false, 없으면 true
    return data.length === 0;
  } catch (error) {
    console.error('차량 가용성 확인 실패:', error);
    throw error;
  }
};

// 차량 카테고리 목록 조회
export const getVehicleCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('vehicle_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('카테고리 조회 오류:', error);
      // 카테고리 테이블이 없을 수 있으므로 기본값 반환
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    // 오류 발생 시 기본 카테고리 반환
    return [];
  }
};

// 차량 위치 목록 조회
export const getVehicleLocations = async () => {
  try {
    const { data, error } = await supabase
      .from('vehicle_locations')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('위치 조회 오류:', error);
      // 위치 테이블이 없을 수 있으므로 기본값 반환
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('위치 조회 실패:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
};

// 차량 브랜드 목록 조회
export const getVehicleBrands = async () => {
  try {
    const { data, error } = await supabase
      .from('vehicle_brands')
      .select('*')
      .order('name');

    if (error) {
      console.error('브랜드 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('브랜드 조회 실패:', error);
    return [];
  }
};
