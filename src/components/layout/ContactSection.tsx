'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { useTheme } from '@/lib/ThemeContext';
import { SearchField } from '@/types/theme';
import { X, Shield, CheckCircle, XCircle } from 'lucide-react';
import { consultationService } from '@/lib/consultationService';

export const ContactSection = () => {
  const { theme } = useTheme();
  const { contactSection } = theme;
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (placeholder: string, value: string) => {
    setFormData(prev => ({ ...prev, [placeholder]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    if (!formData['이름'] || !formData['연락처'] || !formData['문의내용']) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const consultationData = {
        customer_name: formData['이름'] || '',
        customer_phone: formData['연락처'] || '',
        customer_email: '', // 홈화면 퀵상담에서는 이메일 미수집
        type: 'general' as const,
        subject: '렌터카 상담 신청',
        content: formData['문의내용'] || '',
        rental_start_date: undefined,
        rental_end_date: undefined,
        preferred_vehicle: undefined,
      };

      await consultationService.create(consultationData);
      
      alert('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
      
      // 폼 초기화
      setFormData({});
      setPrivacyAgreed(false);
      
    } catch (error) {
      console.error('상담 신청 오류:', error);
      alert('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrivacyAgree = () => {
    setPrivacyAgreed(true);
    setShowPrivacyModal(false);
  };

  const handlePrivacyDisagree = () => {
    setPrivacyAgreed(false);
    setShowPrivacyModal(false);
  };

  const renderField = (field: SearchField, index: number) => {
    const commonClasses = "w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-800 text-white placeholder-gray-400";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={index}
            className={`${commonClasses} resize-none`}
            placeholder={field.placeholder}
            rows={4}
            value={formData[field.placeholder] || ''}
            onChange={(e) => handleFieldChange(field.placeholder, e.target.value)}
            required={field.required}
          />
        );
      default:
        return (
          <input
            key={index}
            type={field.type}
            className={commonClasses}
            placeholder={field.placeholder}
            value={formData[field.placeholder] || ''}
            onChange={(e) => handleFieldChange(field.placeholder, e.target.value)}
            required={field.required}
          />
        );
    }
  };



  return (
    <section 
      className="py-20 text-white relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(/img/home/car-back.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {contactSection.title}
            </h2>
            <p className="text-xl text-gray-300">
              {contactSection.subtitle}
            </p>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {contactSection.form.fields.map((field, index) => (
                <div key={index}>
                  {renderField(field, index)}
                </div>
              ))}
              
              {/* 개인정보 수집 이용동의 체크박스 */}
              <div className="flex items-start space-x-3 py-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="privacy-agreement"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="w-5 h-5 text-primary bg-gray-800 border-gray-600 rounded focus:ring-primary focus:ring-2"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="privacy-agreement" className="text-sm text-gray-300">
                    <span className="text-red-400">*</span> 개인정보 수집 및 이용에 동의합니다.{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-primary underline hover:text-primary/80 transition-colors"
                    >
                      [내용 보기]
                    </button>
                  </label>
                </div>
              </div>
              
              <Button 
                type="submit"
                disabled={!privacyAgreed || isSubmitting}
                className={`w-full py-4 text-lg font-semibold transition-all ${
                  privacyAgreed && !isSubmitting
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                {isSubmitting ? '전송 중...' : contactSection.form.submitText}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>



      {/* 개인정보 수집 이용동의 모달 */}
      {showPrivacyModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPrivacyModal(false)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6" />
                <h2 className="text-xl font-bold">개인정보 수집 및 이용 동의</h2>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6 overflow-y-auto max-h-[60vh] text-gray-800">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">1. 개인정보 수집 목적</h3>
                  <p className="text-sm leading-relaxed">
                    렌터카 상담 서비스 제공, 고객 문의 응답, 예약 관련 안내, 서비스 개선을 위한 분석
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">2. 수집하는 개인정보 항목</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>필수항목: 이름, 연락처, 상담내용</li>
                    <li>선택항목: 이메일, 기타 추가 정보</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">3. 개인정보 보유 및 이용기간</h3>
                  <p className="text-sm leading-relaxed">
                    상담 완료 후 <strong>3년간 보관</strong>하며, 관련 법령에 따라 보존이 필요한 경우 해당 기간까지 보관합니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">4. 개인정보 제3자 제공</h3>
                  <p className="text-sm leading-relaxed">
                    고객의 별도 동의 없이는 제3자에게 개인정보를 제공하지 않습니다. 
                    단, 법령에 근거하거나 수사기관의 요구가 있는 경우 예외로 합니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">5. 개인정보 처리 거부권</h3>
                  <p className="text-sm leading-relaxed">
                    개인정보 수집에 동의하지 않으실 권리가 있으나, 동의를 거부하실 경우 
                    상담 서비스 이용에 제한이 있을 수 있습니다.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600">
                    <strong>문의처:</strong> 개인정보보호책임자 (privacy@rentcar.com, 02-1234-5678)<br/>
                    <strong>시행일:</strong> 2024년 1월 1일
                  </p>
                </div>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="bg-gray-50 px-6 py-4 flex space-x-3 justify-end border-t">
              <button
                onClick={handlePrivacyDisagree}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>동의하지 않음</span>
              </button>
              <button
                onClick={handlePrivacyAgree}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>동의함</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}; 