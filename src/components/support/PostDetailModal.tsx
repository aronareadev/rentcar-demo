'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/lib/iconMap';
import { SupportPost } from '@/lib/supportService';

interface PostDetailModalProps {
  post: SupportPost;
  onClose: () => void;
}

export const PostDetailModal = ({ post, onClose }: PostDetailModalProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    // 줄바꿈을 <br> 태그로 변환
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <DynamicIcon 
                name={post.type === 'notice' ? 'bell' : 'users'} 
                className="w-5 h-5 text-primary" 
              />
              <span className="text-sm font-medium text-primary">
                {post.type === 'notice' ? '공지사항' : '커뮤니티'}
              </span>
            </div>
            {post.is_admin && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                관리자
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <DynamicIcon name="x" className="w-6 h-6" />
          </button>
        </div>

        {/* 게시글 정보 */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <DynamicIcon name="user" className="w-4 h-4" />
                <span>{post.author_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <DynamicIcon name="calendar" className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <DynamicIcon name="eye" className="w-4 h-4" />
                <span>{post.views} 조회</span>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 내용 */}
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {formatContent(post.content)}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {post.created_at !== post.updated_at && (
                <span>마지막 수정: {formatDate(post.updated_at)}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              {!post.is_admin && (
                <button 
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
                  onClick={() => {
                    // TODO: 게시글 신고 기능
                    alert('신고 기능은 준비 중입니다.');
                  }}
                >
                  <DynamicIcon name="flag" className="w-4 h-4" />
                  신고하기
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
