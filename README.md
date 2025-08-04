# 🚗 RentCar Demo

현대적인 렌트카 서비스 데모 웹사이트입니다.

## 🛠️ 기술 스택

- **Next.js 15.4.5** (App Router)
- **React 19** 
- **TypeScript 5**
- **Tailwind CSS 4**
- **Framer Motion** (애니메이션)
- **Lucide React** (아이콘)

## 📁 프로젝트 구조

```
src/
├── app/                 # Next.js App Router 페이지
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트 (Button, Card 등)
│   ├── layout/         # 레이아웃 컴포넌트 (Header, Footer)
│   ├── car/            # 차량 관련 컴포넌트
│   └── booking/        # 예약 관련 컴포넌트
├── types/              # TypeScript 타입 정의
├── data/               # 모의 데이터
├── lib/                # 유틸리티 함수
└── hooks/              # 커스텀 훅
```

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm start
```

## ✨ 주요 기능

- 🏠 **메인 페이지**: 히어로 섹션과 주요 기능 소개
- 🔍 **차량 검색**: 지역, 날짜별 차량 검색
- 🚗 **차량 목록**: 다양한 차량 옵션 제공
- 📱 **반응형 디자인**: 모바일 친화적 UI
- ⚡ **애니메이션**: Framer Motion을 활용한 부드러운 애니메이션

## 🎨 디자인 시스템

- **색상**: Blue 기반 색상 팔레트
- **애니메이션**: 마이크로 인터랙션 적용
- **타이포그래피**: 한글 최적화 폰트

## 📝 개발 계획

이 프로젝트는 기본 구조만 완성된 상태입니다. 향후 추가될 기능:

- 차량 상세 페이지
- 예약 시스템
- 사용자 인증
- 결제 시스템
- 관리자 대시보드

---

Built with ❤️ using Next.js and React
