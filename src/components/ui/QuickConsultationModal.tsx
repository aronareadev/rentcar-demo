'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Phone, Mail, User } from 'lucide-react';
import { Button } from './Button';
import { consultationService } from '@/lib/consultationService';

interface QuickConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuickFormData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  consultation_type: string;
  content: string;
}

export const QuickConsultationModal = ({ isOpen, onClose }: QuickConsultationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<QuickFormData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    consultation_type: '',
    content: ''
  });

  const consultationTypes = [
    '일반문의',
    '예약문의', 
    '기술문의',
    '불만접수'
  ];

  const handleInputChange = (field: keyof QuickFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.customer_phone || !formData.customer_email || 
        !formData.consultation_type || !formData.content) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 상담유형을 type으로 매핑
      const getConsultationType = (koreanType: string) => {
        switch (koreanType) {
          case '일반문의': return 'general';
          case '예약문의': return 'booking';
          case '기술문의': return 'technical';
          case '불만접수': return 'complaint';
          default: return 'general';
        }
      };

      const consultationData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email,
        type: getConsultationType(formData.consultation_type),
        subject: '렌터카 상담 신청',
        content: formData.content,
        rental_start_date: undefined,
        rental_end_date: undefined,
        preferred_vehicle: undefined,
      };

      await consultationService.create(consultationData);
      
      alert('상담 신청이 완료되었습니다.\n빠른 시일 내에 연락드리겠습니다.');
      
      // 폼 초기화
      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        consultation_type: '',
        content: ''
      });
      
      onClose();
      
    } catch (error) {
      console.error('상담 신청 오류:', error);
      alert('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">빠른 상담 신청</h2>
                  <p className="text-green-100 text-sm">간편하게 상담을 신청하세요</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 폼 내용 */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="text-gray-600">기본 정보만 입력하시면 빠르게 연락드립니다</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="이름을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="010-0000-0000"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => handleInputChange('customer_email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상담유형 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.consultation_type}
                    onChange={(e) => handleInputChange('consultation_type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">상담유형을 선택하세요</option>
                    {consultationTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    문의내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="문의하실 내용을 간단히 입력해주세요..."
                    required
                  />
                </div>
              </div>

              {/* 개인정보 동의 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">
                  상담 신청 시 개인정보 수집 및 이용에 동의한 것으로 간주됩니다.
                </p>
                <p className="text-xs text-gray-500">
                  • 수집항목: 이름, 연락처, 이메일, 문의내용<br/>
                  • 이용목적: 상담 서비스 제공 및 답변<br/>
                  • 보유기간: 상담 완료 후 3년
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? '신청 중...' : '빠른 상담 신청'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
