import { supabase } from './supabase';

// Create a typed supabase client for support_posts table
const supportPostsTable = supabase.from('support_posts' as any);

export interface SupportPost {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'community';
  author_name: string;
  author_password?: string;
  is_admin: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  views: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  type: 'notice' | 'community';
  author_name: string;
  author_password?: string;
  is_admin?: boolean;
}

// 게시글 목록 조회
export const getSupportPosts = async (type?: 'notice' | 'community'): Promise<SupportPost[]> => {
  try {
    let query = supportPostsTable
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data as any) || [];
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    return [];
  }
};

// 게시글 생성
export const createSupportPost = async (postData: CreatePostData): Promise<boolean> => {
  try {
    // 비회원 게시글의 경우 비밀번호 해시화
    let hashedPassword = undefined;
    if (postData.author_password) {
      // 간단한 해시화 (실제 운영에서는 bcrypt 등 사용)
      hashedPassword = btoa(postData.author_password);
    }

    const { error } = await supportPostsTable
      .insert([{
        ...postData,
        author_password: hashedPassword,
        status: postData.is_admin ? 'approved' : 'pending' // 관리자 글은 즉시 승인
      }]);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('게시글 생성 실패:', error);
    return false;
  }
};

// 게시글 상세 조회 (조회수 증가)
export const getSupportPostById = async (id: string): Promise<SupportPost | null> => {
  try {
    // 조회수 증가
    await (supabase as any).rpc('increment_post_views', { post_id: id });

    const { data, error } = await supportPostsTable
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error) throw error;

    return data as any;
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error);
    return null;
  }
};

// 비밀번호 확인
export const verifyPostPassword = async (id: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supportPostsTable
      .select('author_password')
      .eq('id', id)
      .single();

    if (error) throw error;

    const hashedPassword = btoa(password);
    return (data as any).author_password === hashedPassword;
  } catch (error) {
    console.error('비밀번호 확인 실패:', error);
    return false;
  }
};

// 관리자용: 모든 게시글 조회
export const getAllSupportPosts = async (): Promise<SupportPost[]> => {
  try {
      const { data, error } = await supportPostsTable
    .select('*')
    .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as any) || [];
  } catch (error) {
    console.error('전체 게시글 조회 실패:', error);
    return [];
  }
};

// 관리자용: 게시글 상태 변경
export const updatePostStatus = async (id: string, status: 'approved' | 'rejected'): Promise<boolean> => {
  try {
    const { error } = await supportPostsTable
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('게시글 상태 변경 실패:', error);
    return false;
  }
};

// 관리자용: 게시글 삭제
export const deleteSupportPost = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supportPostsTable
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    return false;
  }
};
