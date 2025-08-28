'use client';

import { useEffect, useState } from 'react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  daily_rate: number;
  category: string;
  features: string[];
  image: string;
}

export const VehicleSection = () => {
  const [mounted, setMounted] = useState(false);
  const [SwiperComponents, setSwiperComponents] = useState<any>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [typingComplete, setTypingComplete] = useState(false);

  const vehicles: Vehicle[] = [
    {
      id: 'cb7ff09f-e63f-4bac-a2aa-253dacf816a0',
      brand: '현대',
      model: '캐스퍼',
      year: 2024,
      daily_rate: 70000,
      category: '경차',
      features: ['네비게이션', '후방카메라', '스마트키'],
      image: 'https://lieorhwpkxoeqobftkig.supabase.co/storage/v1/object/public/vehicle-images/hyundai/hyundai_kr_1754903578511.jpg'
    },
    {
      id: '69a0e4c4-8f3e-48e3-a96d-2aeb39848838',
      brand: '기아',
      model: '모닝',
      year: 2024,
      daily_rate: 65000,
      category: '경차',
      features: ['네비게이션', '후방카메라'],
      image: 'https://lieorhwpkxoeqobftkig.supabase.co/storage/v1/object/public/vehicle-images/kia/kia_krnewkr_1754903149377.jpg'
    },
    {
      id: '1abfef24-bcb2-497a-870a-439fc2b4bfd0',
      brand: '기아',
      model: '레이 EV',
      year: 2022,
      daily_rate: 85000,
      category: '전기차',
      features: ['네비게이션', '후방카메라', '스마트키'],
      image: 'https://lieorhwpkxoeqobftkig.supabase.co/storage/v1/object/public/vehicle-images/kia/kia_krev_1754903154186.jpg'
    },
    {
      id: '2f11cb54-ae28-4806-8c1c-bba2c18cde7b',
      brand: '현대',
      model: '쏘나타',
      year: 2024,
      daily_rate: 85000,
      category: '중형',
      features: ['네비게이션', '열선시트', '스마트크루즈'],
      image: 'https://lieorhwpkxoeqobftkig.supabase.co/storage/v1/object/public/vehicle-images/hyundai/hyundai_kr_1754903584906.jpg'
    },
    {
      id: '48a40b8b-9495-4945-9a84-9f6f1d901304',
      brand: '기아',
      model: '카니발',
      year: 2024,
      daily_rate: 150000,
      category: '승합',
      features: ['네비게이션', '가죽시트', '듀얼존 에어컨'],
      image: 'https://lieorhwpkxoeqobftkig.supabase.co/storage/v1/object/public/vehicle-images/kia/kia_krnewcarnival_1754903152929.jpg'
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // 타이핑 애니메이션 타이머
    const timer = setTimeout(() => {
      setTypingComplete(true);
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // 이미지 미리 로드 (안전한 방식)
    const preloadImages = () => {
      vehicles.forEach(vehicle => {
        const img = new Image();
        img.onload = () => handleImageLoad(vehicle.image);
        img.onerror = () => {
          // 실패한 이미지 추가 (무한 요청 방지)
          setFailedImages(prev => new Set([...prev, vehicle.image]));
          // 로딩 완료로 표시 (fallback CSS로 처리됨)
          handleImageLoad(`fallback-${vehicle.id}`);
        };
        img.src = vehicle.image;
      });
    };
    
    // Swiper 동적 로드
    const loadSwiper = async () => {
      try {
        const { Swiper, SwiperSlide } = await import('swiper/react');
        const { EffectCreative, Pagination, Autoplay } = await import('swiper/modules');
        
        // CSS 추가
        if (typeof window !== 'undefined' && !document.querySelector('#swiper-css')) {
          const link = document.createElement('link');
          link.id = 'swiper-css';
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css';
          document.head.appendChild(link);
        }
        
        setSwiperComponents({
          Swiper,
          SwiperSlide,
          modules: [EffectCreative, Pagination, Autoplay]
        });
      } catch (error) {
        console.error('Swiper 로드 실패:', error);
      }
    };

    loadSwiper();
    preloadImages();
  }, [mounted]);

  // 이미지 로딩 핸들러
  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => new Set([...prev, imageUrl]));
  };

  // 이미지 에러 핸들러 (무한 루프 방지)
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, vehicleId: string, brand: string, model: string) => {
    const currentSrc = e.currentTarget.src;
    
    // 이미 실패한 이미지라면 처리하지 않음 (무한 루프 방지)
    if (failedImages.has(currentSrc)) {
      return;
    }

    // 실패한 이미지로 표시
    setFailedImages(prev => new Set([...prev, currentSrc]));

    // placeholder URL이 실패한 경우라면 기본 배경만 사용
    if (currentSrc.includes('placeholder.com') || currentSrc.includes('via.placeholder')) {
      e.currentTarget.style.display = 'none'; // 이미지 숨김
      return;
    }

    // 첫 번째 실패: 안전한 로컬 fallback 사용
    const fallbackId = `fallback-${vehicleId}`;
    if (!failedImages.has(fallbackId)) {
      // 부모 요소에 fallback 클래스 추가
      const imgContainer = e.currentTarget.parentElement;
      if (imgContainer) {
        imgContainer.classList.add('fallback-text');
      }
      
      // CSS로 배경 이미지 스타일 적용 (이미지 요청 없음)
      e.currentTarget.style.background = '#ffffff';
      e.currentTarget.style.display = 'flex';
      e.currentTarget.style.alignItems = 'center';
      e.currentTarget.style.justifyContent = 'center';
      e.currentTarget.style.color = '#333';
      e.currentTarget.style.fontSize = '20px';
      e.currentTarget.style.fontWeight = 'bold';
      e.currentTarget.style.textAlign = 'center';
      e.currentTarget.style.lineHeight = '1.2';
      e.currentTarget.style.textShadow = 'none';
      e.currentTarget.style.padding = '20px';
      e.currentTarget.style.border = '2px solid #007BFF';
      e.currentTarget.innerHTML = `${brand}<br/>${model}`;
      e.currentTarget.removeAttribute('src'); // src 제거로 추가 요청 방지
      setFailedImages(prev => new Set([...prev, fallbackId]));
      handleImageLoad(fallbackId); // 로딩 완료로 표시
    }
  };

  if (!mounted || !SwiperComponents) {
    return (
      <section style={{ padding: '100px 0', textAlign: 'center' }}>
        <div>로딩 중...</div>
      </section>
    );
  }

  const { Swiper, SwiperSlide, modules } = SwiperComponents;

  return (
    <>
      <style jsx>{`
        .vehicle-section {
          overflow: hidden;
          position: relative;
          z-index: 2;
          padding: 50px 50px 180px;
          font-size: 15px;
          line-height: 1.8;
          color: #333;
          font-family: inherit;
          background: 
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 0, 0, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, #ffffff 0%, #f8f9fa 25%, #e9ecef 50%, #dee2e6 75%, #ced4da 100%);
        }
        

        
        .bg {
          display: block;
          width: 130%;
          height: 400px;
          position: absolute;
          bottom: 0;
          left: -15%;
          border-radius: 100%;
          background-color: rgba(0, 0, 0, 0.02);
          transition: transform 0.6s cubic-bezier(0.32, 0.94, 0.6, 1);
        }
        
        .inner {
          display: flex;
          align-items: center;
          position: relative;
          max-width: 1320px;
          margin: 0 auto;
          padding-top: 120px;
        }
        
        .txt-area {
          position: relative;
          z-index: 2;
          transform: translateY(-60px);
          width: 50%;
        }
        
        .stxt {
          font-weight: bold;
          color: #333;
        }
        
        .btxt {
          margin: 50px 0 60px;
          font-size: 97px;
          line-height: 1.1;
          font-weight: bold;
          color: #3b82f6; /* fallback */
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }
        
        .typing-text {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(40, end), sparkle 3s ease-in-out infinite 2s;
        }
        
        .typing-text::after {
          content: '|';
          display: inline-block;
          animation: blink 1s infinite;
        }
        
        .typing-complete::after {
          display: none;
        }
        
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes sparkle {
          0%, 100% { text-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
        }
        
        .btxt span {
          padding-left: 100px;
          background: inherit;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        
        .btxt b {
          font-size: 77px;
          font-weight: normal;
          background: inherit;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        
        .stxt2 {
          padding-left: 220px;
          font-weight: bold;
          letter-spacing: 0.3px;
          color: #000;
        }
        
        .view-btn {
          display: inline-block;
          position: relative;
          margin-top: 60px;
          text-align: center;
          line-height: 105px;
          text-decoration: none;
          color: inherit;
        }
        
        .view-btn svg {
          position: relative;
          color: #fff;
          z-index: 2;
        }
        
        .view-btn:before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 105px;
          height: 105px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%);
          box-shadow: 20px 20px 40px rgba(59, 130, 246, 0.4);
          transition: all 0.3s cubic-bezier(0.32, 0.94, 0.6, 1);
        }
        
        .view-btn:hover:before {
          width: 95px;
          height: 95px;
          box-shadow: 20px 20px 30px rgba(59, 130, 246, 0.5);
        }
        
        .pager-dot {
          margin-top: 50px;
          padding-right: 90px;
          text-align: right;
        }
        
        .slide {
          position: relative;
          z-index: 1;
          transform: translateY(-20px);
          width: 50%;
          margin-left: -90px;
        }
        
        :global(.vehicle-swiper) {
          overflow: visible;
          width: 550px;
          height: 600px;
          perspective: 1000px;
        }
        
        :global(.vehicle-swiper .swiper-slide) {
          text-align: center;
          color: #fff;
          width: 550px;
          height: 600px;
        }
        
        .img {
          overflow: hidden;
          border-radius: 26px;
          background: linear-gradient(180deg, #ffffff 60%, #f1f5f9 85%, #e2e8f0 100%);
          height: 100%;
          position: relative;
          cursor: pointer;
        }
        
        .img::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-left: 45px solid rgba(4, 100, 255, 0.9);
          border-right:50px solid transparent;
          border-bottom: 50px solid transparent;
          z-index: 3;
          border-radius: 26px 0 0 0;
        }
        
        .img img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 10px;
          transform: translateY(-10px);
        }
        
        .img img.loading {
          opacity: 0;
        }
        
        .img img.loaded {
          opacity: 1;
        }

        /* Fallback 텍스트 스타일 */
        .img.fallback-text {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          line-height: 1.2;
          text-shadow: none;
          border: 2px solidrgb(20, 71, 241);
        }
        
        .img.fallback-text br {
          content: '';
        }
        

        
        :global(.vehicle-swiper .swiper-slide) {
          overflow: visible;
          width: 400px;
          height: 520px;
          text-align: center;
          transition-timing-function: cubic-bezier(0.32, 0.94, 0.6, 1);
        }
        
        :global(.vehicle-swiper .swiper-slide) .img {
          transition: all 0.2s;
        }
        
        :global(.vehicle-swiper .swiper-slide) .img img {
          opacity: 0.7;
          transition: all 0.2s;
        }
        
        :global(.vehicle-swiper .swiper-slide-active) .img {
          box-shadow: 34px 34px 60px rgba(0, 0, 0, 0.25);
        }
        
        :global(.vehicle-swiper .swiper-slide-active) .img img {
          opacity: 1;
        }
        
        .txt-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          padding: 0 20px 80px 55px;
          font-size: 16px;
          font-weight: 500;
          color: #333;
          text-align: left;
          background: transparent;
        }
        
        .vehicle-name {
          position: absolute;
          bottom: 80px;
          right: 20px;
          font-size: 28px;
          font-weight: 800;
          color: #333;
          margin: 0;
          text-align: right;
          line-height: 1.2;
        }
        
        .vehicle-info {
          position: absolute;
          bottom: 48px;
          right: 20px;
          margin: 0;
          color: #666;
          font-size: 14px;
          text-align: right;
        }
        
        .features {
          position: absolute;
          bottom: 130px;
          left: 55px;
          right: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0;
        }
        
        .features span {
          background: rgba(0, 123, 255, 0.1);
          color: #007BFF;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          border: 1px solid rgba(0, 123, 255, 0.2);
        }
        
        .price {
          position: absolute;
          bottom: 20px;
          right: 20px;
          font-size: 18px;
          font-weight: 700;
          color: #007BFF;
          animation: countup 1s ease-out;
          margin: 0;
          text-align: right;
        }
        
        @keyframes countup {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        /* Swiper pagination 스타일 */
        :global(.pager-dot .swiper-pagination-bullet) {
          width: 6px !important;
          height: 6px !important;
          background: rgba(0, 0, 0, 0.3) !important;
          opacity: 1 !important;
          margin: 0 6px !important;
          border-radius: 50%;
        }
        
        :global(.pager-dot .swiper-pagination-bullet-active) {
          width: 14px !important;
          height: 14px !important;
          background: #333 !important;
        }
        
        /* 반응형 */
        @media (max-width: 1500px) {
          .inner { width: 100%; }
          .txt-area { width: 40%; }
          .btxt { 
            text-align: center; 
            font-size: 57px; 
            color: #3b82f6; /* fallback */
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .btxt b { 
            font-size: 57px; 
            background: inherit;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
          .btxt span { 
            padding-left: 0; 
            background: inherit;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
          .stxt2 { padding-left: 0; text-align: center; }
          .pager-dot { text-align: center; padding-right: 0; }
          .slide { width: 60%; margin-left: -120px; }
          :global(.vehicle-swiper .swiper-slide) { width: 350px; height: 480px; }
          .img img { padding: 15px; }
        }
        
        @media (max-width: 1024px) {
          .vehicle-section { padding: 50px 30px 100px; }
          .slide { margin-left: -80px; }
          :global(.vehicle-swiper) { width: 350px; height: 380px; }
          :global(.vehicle-swiper .swiper-slide) { width: 250px; height: 380px; }
          .inner { padding-top: 40px; }
          .btxt { 
            margin: 40px 0 50px; 
            font-size: 47px; 
            color: #3b82f6; /* fallback */
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .btxt b { 
            font-size: 47px; 
            background: inherit;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
          .img img { padding: 12px; }
        }
        
        @media (max-width: 768px) {
          .vehicle-section { text-align: center; }
          .inner { flex-direction: column; }
          .txt-area, .slide { width: 100%; margin-left: 0; }
          .btxt { 
            margin: 30px 0 40px; 
            color: #3b82f6; /* fallback */
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .view-btn { line-height: 45px; margin-top: 40px; }
          .view-btn:before { width: 45px; height: 45px; }
          .view-btn:hover:before { width: 45px; height: 45px; }
          .pager-dot { margin: 40px 0 0; }
          :global(.vehicle-swiper .swiper-slide) { width: 170px; height: 280px; }
        }
        
        @media (max-width: 480px) {
          .vehicle-section { padding: 30px 30px 80px; }
          .inner { padding-top: 30px; }
          .btxt { 
            margin: 30px; 
            font-size: 33px; 
            color: #3b82f6; /* fallback */
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .btxt b { 
            display: block; 
            font-size: 33px; 
            background: inherit;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
          .view-btn { margin-top: 35px; }
          :global(.vehicle-swiper) { width: 220px; height: 280px; }
          :global(.vehicle-swiper .swiper-slide) { width: 220px; height: 280px; }

        }
      `}</style>
      
      <section className="vehicle-section">
        <div className="bg"></div>
        <div className="inner">
          <div className="txt-area">
            <p className="btxt">
              <span className={`typing-text ${typingComplete ? 'typing-complete' : ''}`}>Premium</span><br />
              <span>Rent <b>Car</b></span>
            </p>
            <div className="stxt2">
              <p>고객 만족도 최고의 프리미엄<br />렌트카 서비스를 만나보세요.</p>
              <a className="view-btn" href="/vehicles">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
            <div className="pager-dot"></div>
          </div>

          <div className="slide">
            <Swiper
              className="vehicle-swiper"
              modules={modules}
              slidesPerView="auto"
              centeredSlides={true}
              grabCursor={true}
              loop={true}
              speed={600}
              autoplay={{
                delay: 1800,
                disableOnInteraction: false,
              }}
              pagination={{
                el: '.pager-dot',
                clickable: true,
              }}
              effect="creative"
              creativeEffect={{
                limitProgress: 1,
                prev: { 
                  opacity: 1, 
                  scale: 0.9, 
                  rotate: [0, 25, 0], 
                  translate: ["-50%", 0, -200] 
                },
                next: { 
                  scale: 0.9, 
                  rotate: [0, -25, 0], 
                  translate: ["50%", 0, -200] 
                }
              }}
              breakpoints={{
                768: {
                  creativeEffect: { 
                    limitProgress: 2, 
                    prev: { opacity: 0 } 
                  }
                }
              }}
            >
              {vehicles.map((vehicle) => (
                <SwiperSlide key={vehicle.id}>
                  <div className="img">
                    <img 
                      src={vehicle.image} 
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      onLoad={() => handleImageLoad(vehicle.image)}
                      onError={(e) => handleImageError(e, vehicle.id, vehicle.brand, vehicle.model)}
                      className={loadedImages.has(vehicle.image) || loadedImages.has(`fallback-${vehicle.id}`) ? 'loaded' : 'loading'}
                    />
                    <div className="txt-content">
                      <div className="vehicle-name">
                        {vehicle.brand} {vehicle.model}
                      </div>
                      <div className="vehicle-info">
                        {vehicle.year}년식 • {vehicle.category}
                      </div>
                      <div className="features">
                        {vehicle.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx}>{feature}</span>
                ))}
              </div>
                      <div className="price">
                        일 {vehicle.daily_rate.toLocaleString()}원
          </div>
        </div>
      </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
      </div>
    </section>
    </>
  );
}; 