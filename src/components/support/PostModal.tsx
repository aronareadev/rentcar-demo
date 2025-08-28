'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DynamicIcon } from '@/lib/iconMap';
import { createSupportPost } from '@/lib/supportService';

interface PostModalProps {
  type: 'notice' | 'community';
  onClose: () => void;
  onSuccess: () => void;
}

export const PostModal = ({ type, onClose, onSuccess }: PostModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author_name: '',
    author_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.author_name.trim()) {
      setError('제목, 내용, 작성자명을 모두 입력해주세요.');
      return;
    }

    if (type === 'community' && !formData.author_password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const success = await createSupportPost({
        title: formData.title,
        content: formData.content,
        type,
        author_name: formData.author_name,
        author_password: type === 'community' ? formData.author_password : undefined,
        is_admin: false
      });

      if (success) {
        onSuccess();
      } else {
        setError('게시글 작성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      setError('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {type === 'notice' ? '공지사항' : '커뮤니티'} 작성
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <DynamicIcon name="x" className="w-6 h-6" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 작성자명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              작성자명 *
            </label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="작성자명을 입력하세요"
              disabled={loading}
            />
          </div>

          {/* 비밀번호 (커뮤니티만) */}
          {type === 'community' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 *
              </label>
              <input
                type="password"
                name="author_password"
                value={formData.author_password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="게시글 수정/삭제 시 사용할 비밀번호"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                이 비밀번호는 추후 게시글 수정/삭제 시 필요합니다.
              </p>
            </div>
          )}

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="제목을 입력하세요"
              disabled={loading}
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="내용을 입력하세요"
              disabled={loading}
            />
          </div>

          {/* 안내문구 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <DynamicIcon name="info" className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">게시글 작성 안내</p>
                <ul className="space-y-1 text-xs">
                  <li>• 모든 게시글은 관리자 검수 후 게시됩니다.</li>
                  <li>• 부적절한 내용의 게시글은 삭제될 수 있습니다.</li>
                  <li>• 개인정보나 연락처 기재는 권하지 않습니다.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 오류 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <DynamicIcon name="alert-circle" className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {loading ? '작성 중...' : '작성하기'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
