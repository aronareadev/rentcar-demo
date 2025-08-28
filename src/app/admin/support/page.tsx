'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DynamicIcon } from '@/lib/iconMap';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  getAllSupportPosts, 
  updatePostStatus, 
  deleteSupportPost, 
  type SupportPost 
} from '@/lib/supportService';

export default function AdminSupportPage() {
  const [posts, setPosts] = useState<SupportPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedPost, setSelectedPost] = useState<SupportPost | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllSupportPosts();
      setPosts(data);
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (postId: string, status: 'approved' | 'rejected') => {
    try {
      setActionLoading(postId);
      const success = await updatePostStatus(postId, status);
      
      if (success) {
        setPosts(prev => 
          prev.map(post => 
            post.id === postId ? { ...post, status } : post
          )
        );
      } else {
        alert('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('상태 변경 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      setActionLoading(postId);
      const success = await deleteSupportPost(postId);
      
      if (success) {
        setPosts(prev => prev.filter(post => post.id !== postId));
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '승인됨';
      case 'rejected': return '거부됨';
      case 'pending': return '대기중';
      default: return status;
    }
  };

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">게시글 관리</h1>
            <p className="text-gray-600 mt-1">고객센터 게시글을 관리하세요</p>
          </div>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <DynamicIcon name="filter" className="w-5 h-5 text-gray-500" />
            <span className="font-medium">상태별 필터</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: '전체', count: posts.length },
              { key: 'pending', label: '검수 대기', count: posts.filter(p => p.status === 'pending').length },
              { key: 'approved', label: '승인됨', count: posts.filter(p => p.status === 'approved').length },
              { key: 'rejected', label: '거부됨', count: posts.filter(p => p.status === 'rejected').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="bg-white rounded-xl shadow-sm border">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <DynamicIcon name="file-text" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">게시글이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      게시글 정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작성자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      유형
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작성일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {post.content.substring(0, 100)}...
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <DynamicIcon name="eye" className="w-3 h-3" />
                              {post.views}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{post.author_name}</span>
                          {post.is_admin && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              관리자
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.type === 'notice' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {post.type === 'notice' ? '공지사항' : '커뮤니티'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                          {getStatusText(post.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {post.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(post.id, 'approved')}
                                disabled={actionLoading === post.id}
                                className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                              >
                                승인
                              </button>
                              <button
                                onClick={() => handleStatusChange(post.id, 'rejected')}
                                disabled={actionLoading === post.id}
                                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                              >
                                거부
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedPost(post)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            보기
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={actionLoading === post.id}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 상세 보기 모달 */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedPost.title}</h2>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <DynamicIcon name="x" className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>작성자: {selectedPost.author_name}</span>
                  <span>작성일: {formatDate(selectedPost.created_at)}</span>
                  <span>조회수: {selectedPost.views}</span>
                </div>
              </div>
              
              <div className="prose max-w-none mb-6">
                <div className="whitespace-pre-wrap text-gray-700">
                  {selectedPost.content}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                {selectedPost.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedPost.id, 'approved');
                        setSelectedPost(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedPost.id, 'rejected');
                        setSelectedPost(null);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      거부
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  닫기
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
