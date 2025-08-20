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
    
    // 이미지 미리 로드
    const preloadImages = () => {
      vehicles.forEach(vehicle => {
        const img = new Image();
        img.onload = () => handleImageLoad(vehicle.image);
        img.onerror = () => {
          const fallbackUrl = `https://via.placeholder.com/400x800/667eea/ffffff?text=${vehicle.brand}+${vehicle.model}`;
          handleImageLoad(fallbackUrl);
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

    if (mounted) {
      loadSwiper();
      preloadImages();
    }
  }, [mounted, vehicles]);

  // 이미지 로딩 핸들러
  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => new Set([...prev, imageUrl]));
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
          color: #111;
          font-family: inherit;
        }
        
        .bg {
          display: block;
          width: 130%;
          height: 400px;
          position: absolute;
          bottom: 0;
          left: -15%;
          border-radius: 100%;
          background-color: #fff;
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
        }
        
        .btxt {
          margin: 50px 0 60px;
          font-size: 97px;
          line-height: 1.1;
          font-weight: bold;
        }
        
        .btxt span {
          padding-left: 100px;
        }
        
        .btxt b {
          font-size: 77px;
          font-weight: normal;
        }
        
        .stxt2 {
          padding-left: 220px;
          font-weight: bold;
          letter-spacing: 0.3px;
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
          background-color: #007BFF;
          box-shadow: 20px 20px 40px rgba(0, 0, 0, 0.25);
          transition: all 0.3s cubic-bezier(0.32, 0.94, 0.6, 1);
        }
        
        .view-btn:hover:before {
          width: 95px;
          height: 95px;
          box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.3);
        }
        
        .pager-dot {
          margin-top: 50px;
          padding-right: 90px;
          text-align: right;
        }
        
        .slide {
          position: relative;
          z-index: 1;
          transform: translateY(80px);
          width: 50%;
          margin-left: -90px;
        }
        
        :global(.vehicle-swiper) {
          overflow: visible;
          width: 400px;
          height: 800px;
        }
        
        :global(.vehicle-swiper .swiper-slide) {
          text-align: center;
          color: #fff;
          width: 400px;
          height: 800px;
        }
        
        .img {
          overflow: hidden;
          border-radius: 26px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.2s;
          height: 100%;
          position: relative;
        }
        
        .img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s ease-in-out;
        }
        
        .img img.loading {
          opacity: 0;
        }
        
        .img img.loaded {
          opacity: 1;
        }
        
        :global(.vehicle-swiper .swiper-slide-active .img) {
          box-shadow: 34px 34px 60px rgba(0, 0, 0, 0.25);
        }
        
        :global(.vehicle-swiper .swiper-slide-active .img) img.loaded {
          transform: scale(1.01);
          opacity: 1;
        }
        
        :global(.vehicle-swiper .swiper-slide:not(.swiper-slide-active) .img) img.loaded {
          opacity: 0.7;
        }
        
        .txt-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          padding: 0 0 60px 55px;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          text-align: left;
        }
        
        .vehicle-name {
          margin-bottom: 10px;
          font-size: 28px;
          font-weight: 700;
        }
        
        .vehicle-info {
          margin-bottom: 15px;
        }
        
        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }
        
        .features span {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          backdrop-filter: blur(10px);
        }
        
        .price {
          font-size: 20px;
          font-weight: 700;
          color: #007BFF;
        }
        
        /* Swiper pagination 스타일 */
        :global(.pager-dot .swiper-pagination-bullet) {
          width: 6px !important;
          height: 6px !important;
          background: #111 !important;
          opacity: 1 !important;
          margin: 0 6px !important;
          border-radius: 50%;
        }
        
        :global(.pager-dot .swiper-pagination-bullet-active) {
          width: 14px !important;
          height: 14px !important;
        }
        
        /* 반응형 */
        @media (max-width: 1500px) {
          .inner { width: 100%; }
          .txt-area { width: 40%; }
          .btxt { text-align: center; font-size: 57px; }
          .btxt b { font-size: 57px; }
          .btxt span { padding-left: 0; }
          .stxt2 { padding-left: 0; text-align: center; }
          .pager-dot { text-align: center; padding-right: 0; }
          .slide { width: 60%; margin-left: -120px; }
          :global(.vehicle-swiper) { width: 350px; height: 600px; }
          :global(.vehicle-swiper .swiper-slide) { width: 350px; height: 600px; }
        }
        
        @media (max-width: 1024px) {
          .vehicle-section { padding: 50px 30px 100px; }
          .slide { margin-left: -80px; }
          :global(.vehicle-swiper) { width: 250px; height: 450px; }
          :global(.vehicle-swiper .swiper-slide) { width: 250px; height: 450px; }
          .inner { padding-top: 40px; }
          .btxt { margin: 40px 0 50px; font-size: 47px; }
          .btxt b { font-size: 47px; }
        }
        
        @media (max-width: 768px) {
          .vehicle-section { text-align: center; }
          .inner { flex-direction: column; }
          .txt-area, .slide { width: 100%; margin-left: 0; }
          .btxt { margin: 30px 0 40px; }
          .view-btn { line-height: 45px; margin-top: 40px; }
          .view-btn:before { width: 45px; height: 45px; }
          .view-btn:hover:before { width: 45px; height: 45px; }
          .pager-dot { margin: 40px 0 0; }
        }
        
        @media (max-width: 480px) {
          .vehicle-section { padding: 30px 30px 80px; }
          .inner { padding-top: 30px; }
          .btxt { margin: 30px; font-size: 33px; }
          .btxt b { display: block; font-size: 33px; }
          .view-btn { margin-top: 35px; }
          :global(.vehicle-swiper) { width: 170px; height: 300px; }
          :global(.vehicle-swiper .swiper-slide) { width: 170px; height: 300px; }
        }
      `}</style>
      
      <section className="vehicle-section">
        <div className="bg"></div>
        <div className="inner">
          <div className="txt-area">
            <span className="stxt">(FEATURED)</span>
            <p className="btxt">
              Premium<br />
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
              spaceBetween={30}
              centeredSlides={true}
              loop={true}
              initialSlide={0}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                el: '.pager-dot',
                clickable: true,
              }}
              effect="creative"
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: ["-15%", 0, -200],
                  rotate: [0, 0, -3],
                },
                next: {
                  translate: ["15%", 0, -200],
                  rotate: [0, 0, 3],
                },
              }}
            >
              {vehicles.map((vehicle) => (
                <SwiperSlide key={vehicle.id}>
                  <div className="img">
                    <img 
                      src={vehicle.image} 
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      onLoad={() => handleImageLoad(vehicle.image)}
                      onError={(e) => {
                        const fallbackUrl = `https://via.placeholder.com/400x800/667eea/ffffff?text=${vehicle.brand}+${vehicle.model}`;
                        e.currentTarget.src = fallbackUrl;
                        handleImageLoad(fallbackUrl);
                      }}
                      className={loadedImages.has(vehicle.image) ? 'loaded' : 'loading'}
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