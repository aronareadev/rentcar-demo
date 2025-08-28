'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const slideRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const section = sectionRef.current;
    const slide = slideRef.current;
    
    if (section && slide) {
      gsap.to(slide, {
        x: () => -(slide.scrollWidth - document.documentElement.clientWidth) + 'px',
        ease: 'none',
        scrollTrigger: {
          start: 'top',
          trigger: section,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          end: () => `+=${slide.offsetWidth}`
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      title: "24시간 예약",
      description: "언제든지 편리한 온라인 예약\n24시간 실시간 예약 서비스",
      image: "/img/home/features/fea-1.jpg"
    },
    {
      title: "차량 관리",
      description: "정기적인 점검과 관리로\n안전하고 깨끗한 차량 제공",
      image: "/img/home/features/fea-2.jpg"
    },
    {
      title: "안전 보장",
      description: "종합보험 가입과 전문적인\n사후 서비스로 안심 렌트",
      image: "/img/home/features/fea-3.jpg"
    }
  ];

  return (
    <>
      <style jsx>{`
        .features-section {
          position: relative;
          height: 100vh;
          font-size: 16px;
          color: #777;
          line-height: 1.8;
          letter-spacing: -0.3px;
          font-family: inherit;
          background: #f8f9fa;
        }
        
        .tit-area {
          position: relative;
          max-width: 1600px;
          margin: 0 auto 100px;
          padding-top: 12vh;
        }
        
        .tit {
          font-size: 52px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        
        .txt {
          font-size: 18px;
          color: #777;
          white-space: pre-line;
        }
        
        .img-slide-wrap {
          padding-bottom: 30px;
        }
        
        .img-slide {
          display: flex;
          flex-wrap: nowrap;
          padding-left: calc((100% - 1600px) / 2);
          margin: 0;
          padding-top: 0;
          padding-bottom: 0;
          list-style: none;
        }
        
        .img-slide li {
          transition: all 0.3s;
        }
        
        .img-slide li + li {
          margin-left: 175px;
        }
        
        .img-slide li:nth-child(odd) a {
          width: 750px;
          height: 52vh;
        }
        
        .img-slide li:nth-child(even) {
          margin-top: -150px;
        }
        
        .img-slide li:nth-child(even) a {
          width: 445px;
          height: 55vh;
        }
        
        .img-slide li:hover {
          transform: translate(-10px, -10px);
        }
        
        .img-slide li a {
          display: block;
          position: relative;
          box-shadow: 25px 25px 50px rgba(0, 0, 0, 0.15);
          transition: all 0.3s;
          text-decoration: none;
        }
        
        .img-slide li a:after {
          display: block;
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          background: linear-gradient(0deg, rgba(1, 1, 1, 0.5) 0%, rgba(0, 0, 0, 0) 60%);
          transition: all 0.25s;
        }
        
        .img-slide li a:hover {
          box-shadow: 25px 25px 35px rgba(0, 0, 0, 0.2);
        }
        
        .img-slide li .txt-content {
          position: absolute;
          bottom: 0;
          z-index: 2;
          width: 100%;
          padding: 0 0 60px 55px;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
        }
        
        .img-slide li .txt-content p {
          margin-bottom: 10px;
          font-size: 28px;
          font-weight: 700;
        }
        
        .img-slide li .txt-content div {
          white-space: pre-line;
        }
        
        .img-slide li img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .bg {
          position: absolute;
          bottom: 0;
          width: 100%;
          z-index: -1;
        }
        
        .flow-txt {
          position: relative;
          z-index: -2;
          opacity: 0.15;
          font-size: 190px;
          font-weight: 700;
          color: #007BFF;
          line-height: 0.65;
          white-space: nowrap;
          animation: flow 30s linear infinite;
        }
        
        @keyframes flow {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        
        .bg-box {
          width: 100%;
          height: 30vh;
          background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 48%, #2563eb 75%, #ffffff 94%);
        }
      `}</style>
      
      <section ref={sectionRef} className="features-section">
        <div className="tit-area">
          <p className="tit gradient-text-blue">Premium <span>RentCar</span></p>
          <p className="txt">믿을 수 있는 전문 렌트카 서비스로{'\n'}안전하고 편리한 차량 이용을 약속드립니다.</p>
        </div>
        
        <div className="img-slide-wrap">
          <ul ref={slideRef} className="img-slide">
            {features.map((feature, index) => (
              <li key={index}>
                <a href="#">
                  <img src={feature.image} alt={feature.title} />
                  <div className="txt-content">
                    <p>{feature.title}</p>
                    <div>{feature.description}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg">
          <p className="flow-txt">Safe & Reliable Car Rental Service</p>
          <div className="bg-box"></div>
        </div>
      </section>
    </>
  );
}; 