'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Car, User, Phone, Mail, MapPin, Clock, Calculator, FileText } from 'lucide-react';
import { Button } from './Button';
import { consultationService } from '@/lib/consultationService';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuoteFormData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  rental_start_date: string;
  rental_end_date: string;
  pickup_location: string;
  return_location: string;
  preferred_vehicle: string;
  passengers: string;
  additional_options: string[];
  special_requests: string;
  budget_range: string;
}

export const QuoteModal = ({ isOpen, onClose }: QuoteModalProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    rental_start_date: '',
    rental_end_date: '',
    pickup_location: '',
    return_location: '',
    preferred_vehicle: '',
    passengers: '',
    additional_options: [],
    special_requests: '',
    budget_range: ''
  });

  const vehicleTypes = [
    '소형차 (경차/소형)',
    '중형차 (중형세단)',
    '대형차 (대형세단)',
    'SUV (소형/중형)',
    '대형SUV',
    '승합차 (7-9인승)',
    '대형승합차 (11-15인승)',
    '고급차 (프리미엄)',
    '전기차',
    '기타'
  ];

  const additionalOptions = [
    '내비게이션',
    '하이패스',
    '블랙박스',
    '아이카시트',
    '부스터시트',
    '스키랙',
    '자전거랙',
    '추가운전자',
    '완전자차보험',
    '해외운전면허'
  ];

  const budgetRanges = [
    '5만원 이하/일',
    '5-10만원/일',
    '10-15만원/일',
    '15-20만원/일',
    '20만원 이상/일',
    '예산 무관'
  ];

  const locations = [
    '서울 강남구',
    '서울 종로구',
    '서울 마포구',
    '인천공항',
    '김포공항',
    '부산역',
    '부산 해운대',
    '제주공항',
    '제주 서귀포',
    '기타 (직접입력)'
  ];

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionToggle = (option: string) => {
    setFormData(prev => ({
      ...prev,
      additional_options: prev.additional_options.includes(option)
        ? prev.additional_options.filter(opt => opt !== option)
        : [...prev.additional_options, option]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // 견적문의 데이터를 상담 테이블에 저장
      const consultationData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email,
        type: 'booking' as const,
        subject: '렌터카 견적 문의',
        content: `
견적 문의 상세정보:

【대여 정보】
• 대여일: ${formData.rental_start_date}
• 반납일: ${formData.rental_end_date}
• 대여지: ${formData.pickup_location}
• 반납지: ${formData.return_location}

【차량 정보】
• 희망차종: ${formData.preferred_vehicle}
• 탑승인원: ${formData.passengers}명
• 예산범위: ${formData.budget_range}

【추가 옵션】
${formData.additional_options.length > 0 ? formData.additional_options.join(', ') : '없음'}

【특별 요청사항】
${formData.special_requests || '없음'}
        `.trim(),
        rental_start_date: formData.rental_start_date,
        rental_end_date: formData.rental_end_date,
        preferred_vehicle: formData.preferred_vehicle,
      };

      await consultationService.create(consultationData);
      
      alert('견적 문의가 성공적으로 접수되었습니다.\n담당자가 24시간 내에 연락드리겠습니다.');
      
      // 폼 초기화
      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        rental_start_date: '',
        rental_end_date: '',
        pickup_location: '',
        return_location: '',
        preferred_vehicle: '',
        passengers: '',
        additional_options: [],
        special_requests: '',
        budget_range: ''
      });
      setStep(1);
      onClose();
      
    } catch (error) {
      console.error('견적 문의 제출 오류:', error);
      alert('견적 문의 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const isStep1Valid = formData.customer_name && formData.customer_phone && formData.customer_email;
  const isStep2Valid = formData.rental_start_date && formData.rental_end_date && 
                      formData.pickup_location && formData.preferred_vehicle;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calculator className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">렌터카 견적 문의</h2>
                  <p className="text-blue-100 text-sm">맞춤형 견적을 받아보세요</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 진행단계 표시 */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {stepNum}
                    </div>
                    <div className="ml-2 text-sm">
                      {stepNum === 1 && '고객정보'}
                      {stepNum === 2 && '대여정보'}
                      {stepNum === 3 && '추가옵션'}
                    </div>
                    {stepNum < 3 && (
                      <div className={`w-16 h-1 mx-4 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 폼 내용 */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <User className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-gray-900">고객 정보 입력</h3>
                    <p className="text-gray-600">견적 안내를 위한 연락처 정보를 입력해주세요</p>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="이름을 입력하세요"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="010-0000-0000"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-gray-900">대여 정보 입력</h3>
                    <p className="text-gray-600">언제, 어디서 차량을 이용하실 예정인가요?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        대여일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.rental_start_date}
                        onChange={(e) => handleInputChange('rental_start_date', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        반납일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.rental_end_date}
                        onChange={(e) => handleInputChange('rental_end_date', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        대여지 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.pickup_location}
                        onChange={(e) => handleInputChange('pickup_location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">대여지를 선택하세요</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        반납지
                      </label>
                      <select
                        value={formData.return_location}
                        onChange={(e) => handleInputChange('return_location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">반납지를 선택하세요 (대여지와 동일시 선택안함)</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        희망 차종 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.preferred_vehicle}
                        onChange={(e) => handleInputChange('preferred_vehicle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">차종을 선택하세요</option>
                        {vehicleTypes.map((vehicle) => (
                          <option key={vehicle} value={vehicle}>{vehicle}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        탑승 인원
                      </label>
                      <select
                        value={formData.passengers}
                        onChange={(e) => handleInputChange('passengers', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">인원을 선택하세요</option>
                        {Array.from({length: 15}, (_, i) => i + 1).map(num => (
                          <option key={num} value={num.toString()}>{num}명</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Car className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-gray-900">추가 옵션 및 요청사항</h3>
                    <p className="text-gray-600">필요한 추가 서비스를 선택해주세요</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      예산 범위
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {budgetRanges.map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => handleInputChange('budget_range', range)}
                          className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                            formData.budget_range === range
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      추가 옵션 (복수 선택 가능)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {additionalOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleOptionToggle(option)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            formData.additional_options.includes(option)
                              ? 'bg-blue-100 text-blue-700 border-blue-300'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      특별 요청사항
                    </label>
                    <textarea
                      value={formData.special_requests}
                      onChange={(e) => handleInputChange('special_requests', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="추가로 요청하실 사항이나 문의사항을 입력해주세요..."
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* 푸터 버튼 */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {step}/3 단계
              </div>
              
              <div className="flex space-x-3">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="px-6 py-2"
                  >
                    이전
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button
                    variant="primary"
                    onClick={nextStep}
                    disabled={
                      (step === 1 && !isStep1Valid) ||
                      (step === 2 && !isStep2Valid)
                    }
                    className="px-6 py-2"
                  >
                    다음
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-2"
                  >
                    {isSubmitting ? '제출 중...' : '견적 요청'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
