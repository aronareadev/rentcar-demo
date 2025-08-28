'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DynamicIcon } from '@/lib/iconMap';
import { ThemeLayout } from '@/components/layout/ThemeLayout';
import { SubPageHeader } from '@/components/layout/SubPageHeader';
import { PostModal } from '@/components/support/PostModal';
import { PostDetailModal } from '@/components/support/PostDetailModal';
import { getSupportPosts, type SupportPost } from '@/lib/supportService';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'notice' | 'community'>('notice');
  const [posts, setPosts] = useState<SupportPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SupportPost | null>(null);

  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getSupportPosts(activeTab);
      setPosts(data);
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post: SupportPost) => {
    setSelectedPost(post);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <ThemeLayout>
      <SubPageHeader
        title="고객센터"
        subtitle="공지사항과 커뮤니티를 통해 소통하세요."
        prevPage={{ title: "메인으로", href: "/" }}
        nextPage={{ title: "차량정보", href: "/vehicles" }}
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            className="flex items-center text-sm text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DynamicIcon name="chevron-right" className="h-4 w-4 mr-1" />
            <span>홈</span>
            <DynamicIcon name="chevron-right" className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">고객센터</span>
          </motion.div>

          {/* 탭 메뉴 */}
          <div className="flex justify-center mb-12">
            <div className="relative flex bg-gray-100 rounded-full p-1 shadow-sm border border-gray-200">
              <div 
                className={`absolute top-1 bottom-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg transition-all duration-300 ease-in-out ${
                  activeTab === 'notice' ? 'left-1 right-1/2 mr-0.5' : 'left-1/2 right-1 ml-0.5'
                }`}
              />
              <button
                onClick={() => setActiveTab('notice')}
                className={`relative z-10 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'notice'
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <DynamicIcon name="bell" className="w-4 h-4 inline mr-2" />
                공지사항
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`relative z-10 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'community'
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <DynamicIcon name="users" className="w-4 h-4 inline mr-2" />
                커뮤니티
              </button>
            </div>
          </div>

          {/* 작성 버튼 (커뮤니티만) */}
          {activeTab === 'community' && (
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setShowPostModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <DynamicIcon name="plus" className="w-4 h-4" />
              글 작성하기
            </button>
          </div>
        )}

          {/* 게시글 목록 */}
          <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <DynamicIcon name="file-text" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">등록된 게시글이 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.is_admin && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                            관리자
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {post.author_name}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <DynamicIcon name="eye" className="w-4 h-4" />
                        {post.views}
                      </div>
                      <DynamicIcon name="chevron-right" className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        </div>
      </section>

      {/* 글 작성 모달 */}
      {showPostModal && (
        <PostModal
          type={activeTab}
          onClose={() => setShowPostModal(false)}
          onSuccess={() => {
            setShowPostModal(false);
            loadPosts();
          }}
        />
      )}

      {/* 게시글 상세 모달 */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </ThemeLayout>
  );
}
