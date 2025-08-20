'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { DynamicIcon } from '@/lib/iconMap';
import { useTheme } from '@/lib/ThemeContext';
import { SearchField } from '@/types/theme';
import { getVehicleCategories, getVehicleLocations } from '@/lib/vehicleService';

export const HeroSection = () => {
  const { theme } = useTheme();
  const { hero } = theme;
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // DB에서 카테고리와 지역 데이터 로드
  useEffect(() => {
    const loadSearchOptions = async () => {
      try {
        setLoading(true);
        
        // 카테고리 데이터 로드
        try {
          const categoriesData = await getVehicleCategories();
          const categoryNames = categoriesData.map(cat => cat.name);
          setCategories(categoryNames);
        } catch (error) {
          console.warn('카테고리 로드 실패, 기본값 사용:', error);
          setCategories(['SUV', '경차', '대형세단', '소형', '승합차', '전기차', '중형세단']);
        }

        // 지역 데이터 로드
        try {
          const locationsData = await getVehicleLocations();
          const locationNames = locationsData.map(loc => loc.name);
          setLocations(locationNames);
        } catch (error) {
          console.warn('지역 로드 실패, 기본값 사용:', error);
          setLocations(['강남점', '본점', '부산점', '대구점', '홍대점']);
        }
        
      } catch (error) {
        console.error('검색 옵션 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSearchOptions();
  }, []);

  const handleFieldChange = (placeholder: string, value: string) => {
    setFormData(prev => ({ ...prev, [placeholder]: value }));
  };

  const handleSearch = () => {
    const selectedCategory = formData['차종 선택'];
    const selectedLocation = formData['지역'];
    
    // URL 파라미터 구성
    const params = new URLSearchParams();
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    if (selectedLocation) {
      params.append('location', selectedLocation);
    }
    
    // 차량정보 페이지로 이동 (필터 선택된 상태)
    const url = `/vehicles${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
  };

  const renderField = (field: SearchField, index: number) => {
    const commonClasses = "w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900";
    
    // 실제 DB 데이터로 옵션 교체
    let options: string[] = [];
    if (field.placeholder === '차종 선택') {
      options = categories;
    } else if (field.placeholder === '지역') {
      options = locations;
    } else {
      options = field.options || [];
    }
    
    switch (field.type) {
      case 'select':
        return (
          <select
            key={index}
            className={commonClasses}
            value={formData[field.placeholder] || ''}
            onChange={(e) => handleFieldChange(field.placeholder, e.target.value)}
            disabled={loading}
          >
            <option value="">{loading ? '로딩 중...' : field.placeholder}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
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
            disabled={loading}
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
            disabled={loading}
          />
        );
    }
  };

  return (
    <section 
      className="relative text-white min-h-screen flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/img/home/hero.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full min-h-screen flex flex-col">
        {/* Hero Content - Left Aligned */}
        <motion.div
          className="text-left flex-1 flex flex-col justify-center mb-32"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg mb-4 opacity-90">
            최적가로 원하는 차량을 빠르게!
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-wider">
            {hero.title}
          </h1>
          <p className="text-xl mb-4 opacity-90">
            {hero.subtitle}
          </p>
        </motion.div>

        {/* Search Form - Bottom Left */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-0.5 bg-white mr-4"></div>
              <h2 className="text-xl font-bold tracking-wider">
                {hero.searchForm.title}
              </h2>
            </div>
            <p className="text-gray-300 ml-16">
              {hero.searchForm.subtitle}
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm p-8 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                {hero.searchForm.fields.map((field, index) => (
                  <div key={index}>
                    {renderField(field, index)}
                  </div>
                ))}
                <div className="flex items-end">
                  <button 
                    className="w-full py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? '로딩 중...' : hero.searchForm.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 