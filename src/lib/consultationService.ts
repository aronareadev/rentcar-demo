import { supabase } from './supabase';

// Helper function to convert database data to TypeScript compatible format
const convertToConsultation = (item: any): Consultation => ({
  ...item,
  type: item.type || undefined,
  admin_memo: item.admin_memo || undefined,
  rental_start_date: item.rental_start_date || undefined,
  rental_end_date: item.rental_end_date || undefined,
  preferred_vehicle: item.preferred_vehicle || undefined,
  status: item.status || 'pending',
  priority: item.priority || 'normal',
  created_at: item.created_at || new Date().toISOString(),
  updated_at: item.updated_at || new Date().toISOString(),
});

export interface Consultation {
  id: string;
  consultation_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  type?: string;
  subject: string;
  content: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  rental_start_date?: string;
  rental_end_date?: string;
  preferred_vehicle?: string;
  admin_memo?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateConsultationData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  subject: string;
  content: string;
  rental_start_date?: string;
  rental_end_date?: string;
  preferred_vehicle?: string;
}

export const consultationService = {
  // 상담 신청 생성
  async create(data: CreateConsultationData): Promise<Consultation> {
    const consultation_number = `CONS${Date.now()}`;
    
    const { data: consultation, error } = await supabase
      .from('consultations')
      .insert([{
        consultation_number,
        ...data,
        customer_email: data.customer_email || 'noemail@temp.com', // 이메일이 없을 경우 임시값
        status: 'pending',
        priority: 'normal',
        is_read: false
      }])
      .select()
      .single();

    if (error) throw error;
    
    return convertToConsultation(consultation);
  },

  // 모든 상담 조회 (관리자용)
  async getAll(): Promise<Consultation[]> {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(convertToConsultation);
  },

  // 읽지 않은 상담 조회
  async getUnread(): Promise<Consultation[]> {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(convertToConsultation);
  },

  // 상담 읽음 처리
  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('consultations')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
  },

  // 상담 상태 업데이트
  async updateStatus(id: string, status: Consultation['status'], admin_memo?: string): Promise<void> {
    const updateData: any = { status };
    if (admin_memo !== undefined) {
      updateData.admin_memo = admin_memo;
    }

    const { error } = await supabase
      .from('consultations')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  },

  // 특정 상담 조회
  async getById(id: string): Promise<Consultation | null> {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? convertToConsultation(data) : null;
  },

  // 상담 삭제
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // 실시간 구독 설정
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('consultations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'consultations' }, 
        callback
      )
      .subscribe();
  }
};
