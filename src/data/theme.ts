import { RentCarTheme } from '@/types/theme';

export const rentCarTheme: RentCarTheme = {
  "siteName": "SAMPLE RENTCAR",
  "tagline": "신뢰할 수 있는 렌트카 서비스",
  "phoneNumber": "1544-5678",
  "theme": {
    "colors": {
      "primary": "#007BFF",
      "secondary": "#6C757D",
      "dark": "#212529",
      "light": "#F8F9FA",
      "accent": "#17A2B8"
    },
    "layout": "modern-automotive"
  },
  "header": {
    "navigation": [
      { "title": "렌트카 안내", "link": "/guide" },
      { "title": "실시간 예약", "link": "/booking" },
      { "title": "차량정보", "link": "/vehicles" },
      { "title": "고객센터", "link": "/support" }
    ],
    "contact": {
      "phone": "1544-5678",
      "displayText": "상담문의"
    }
  },
  "hero": {
    "backgroundImage": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&fit=crop",
    "title": "SAMPLE RENTCAR",
    "subtitle": "신뢰할 수 있는 렌트카 서비스를 경험하세요",
    "searchForm": {
      "title": "QUICK CARS SEARCH",
      "subtitle": "빠른 차량 검색으로 원하는 렌트카를 찾아보세요",
      "fields": [
        {
          "type": "select",
          "placeholder": "차종 선택",
          "options": ["소형차", "중형차", "대형차", "SUV", "승합차"]
        },
        {
          "type": "select", 
          "placeholder": "지역",
          "options": ["서울", "부산", "대구", "인천", "광주", "대전", "울산"]
        }
      ],
      "buttonText": "차량 검색 시작하기"
    }
  },
  "features": [
    {
      "icon": "settings",
      "title": "렌트카 시스템",
      "description": "편리한 온라인 예약"
    },
    {
      "icon": "edit",
      "title": "차량 관리 현황",
      "description": "실시간 차량 상태 확인"
    },
    {
      "icon": "shield",
      "title": "안전하고 빠른",
      "description": "믿을 수 있는 렌트카 서비스"
    },
    {
      "icon": "car",
      "title": "렌트카",
      "description": "다양한 차량 선택"
    }
  ],
  "vehicleSection": {
    "title": "SAMPLE BEST RENTCAR",
    "subtitle": "최고의 렌트카를 만나보세요",
    "categories": [
      {
        "name": "인기차량 베스트",
        "active": true
      },
      {
        "name": "프리미엄 차량"
      },
      {
        "name": "경제형 차량"
      },
      {
        "name": "전기차 라인업"
      }
    ],
    "vehicles": [
      {
        "name": "렌트A",
        "category": "소형차",
        "price": "일일 3만원부터",
        "image": "https://images.unsplash.com/photo-1549399292-46fea681ac63?w=400&h=300&fit=crop",
        "features": ["연비우수", "주차편리", "도심주행"]
      },
      {
        "name": "렌트B",
        "category": "중형차", 
        "price": "일일 4만원부터",
        "image": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop",
        "features": ["안전성", "편의성", "경제성"]
      },
      {
        "name": "신차급 The New",
        "category": "신차",
        "price": "750,000원",
        "originalPrice": "1,000,000원",
        "discount": "250,000원 할인",
        "image": "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=400&h=300&fit=crop",
        "badge": "인기",
        "isPromoted": true
      },
      {
        "name": "K7 Premier",
        "category": "프리미엄",
        "price": "일일 8만원부터", 
        "image": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop",
        "features": ["최고급", "비즈니스", "장거리"]
      },
      {
        "name": "K5 3세대",
        "category": "중형세단",
        "price": "일일 6만원부터",
        "image": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop", 
        "features": ["인기모델", "합리적", "안정성"]
      },
      {
        "name": "K 전기차 라인업",
        "category": "전기차",
        "price": "일일 10만원부터",
        "image": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
        "features": ["친환경", "최신기술", "경제적"],
        "badge": "인기",
        "isPromoted": true
      }
    ]
  },
  "reviewSection": {
    "title": "SAMPLE RENTCAR REVIEW",
    "subtitle": "고객들의 생생한 이용 후기를 확인하세요",
    "reviewImages": [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1484136754297-2b16b427cdb5?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1565120130276-dfbd9d7a3043?w=300&h=200&fit=crop"
    ],
    "ctaText": "실제 이용고객 리뷰보기 체험해보세요."
  },
  "consultationBanner": {
    "items": [
      "Consultation Inquiry - 렌트카 상담문의 24시간",
      "보험 - 렌트카 보험문의 24시간", 
      "사고 - 렌트카 사고문의 24시간",
      "기타 - 렌트카 기타문의 24시간"
    ]
  },
  "contactSection": {
    "title": "Quick Consultation",
    "subtitle": "빠른 상담 문의",
    "backgroundImage": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop",
    "form": {
      "fields": [
        { "type": "text", "placeholder": "성함", "required": true },
        { "type": "tel", "placeholder": "연락처", "required": true },
        { "type": "email", "placeholder": "이메일", "required": false },
        { "type": "textarea", "placeholder": "문의내용", "required": true }
      ],
      "submitText": "빠른상담신청"
    }
  },
  "footer": {
    "companyName": "SAMPLE RENTCAR",
    "description": "고객만족을 최우선으로 하는 렌트카 전문업체입니다.",
    "address": "서울특별시 강남구 테헤란로 123번길 45",
    "businessInfo": [
      "대표이사: 홍길동",
      "사업자등록번호: 123-45-67890", 
      "통신판매업신고: 제2024-서울강남-1234호"
    ],
    "contact": {
      "phone": "1544-0634",
      "email": "info@samplerentcar.com",
      "hours": "평일 09:00 ~ 18:00 (주말/공휴일 휴무)"
    },
    "links": [
      { "title": "개인정보처리방침", "url": "/privacy" },
      { "title": "이용약관", "url": "/terms" }
    ],
    "copyright": "Copyright ⓒ 2024 SAMPLE RENTCAR All rights reserved.",
    "backgroundImage": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&h=1080&fit=crop"
  },
  "floatingButtons": {
    "chat": {
      "text": "채팅상담",
      "icon": "message-circle"
    },
    "call": {
      "text": "전화상담", 
      "phone": "1544-0634",
      "icon": "phone"
    },
    "top": {
      "icon": "arrow-up"
    }
  }
}; 