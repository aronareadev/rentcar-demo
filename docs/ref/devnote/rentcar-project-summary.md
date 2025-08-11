# 렌트카 프로젝트 개발 현황 및 계획
date : 2025-08-08
## 프로젝트 구조

### 1. 데모 홈페이지 (rentcar-demo)
- 포트: 3020
- Next.js 15, React 19, TypeScript
- Tailwind CSS 4, Framer Motion
- 고객용 웹사이트

### 2. 어드민 관리자 (rentcar-admin)  
- 포트: 3022
- Next.js 15, React 19, TypeScript
- 커스텀 CSS 스타일링
- 관리자용 대시보드

## 완성된 기능들

### 데모 홈페이지
- 메인 홈페이지 (완료)
  - HeroSection: 히어로 영역 및 차량 검색 폼
  - FeaturesSection: 서비스 특징 소개
  - VehicleSection: 추천 차량 목록
  - ReviewSection: 고객 후기
  - ConsultationBanner: 상담 문의 배너
  - ContactSection: 빠른 상담 폼
  - QuickMenu: 플로팅 메뉴

- 차량 정보 페이지 (완료)
  - 차량 목록 테이블
  - 카테고리별 필터링
  - 검색 기능
  - 페이지네이션

- 기본 컴포넌트 (완료)
  - 테마 시스템 및 레이아웃
  - UI 컴포넌트들
  - 아이콘 매핑 시스템

### 어드민 관리자
- 기본 구조 (완료)
  - AdminLayout: 전체 레이아웃
  - Sidebar: 접기/펼치기 가능한 네비게이션
  - Header: 검색, 알림, 사용자 메뉴
  - 반응형 디자인

- 대시보드 (완료)
  - 통계 카드: 신규 예약, 진행중 렌탈, 반납 예정, 대기중 상담
  - 매출 현황: 일간/주간/월간 매출 표시
  - 차량 현황: 상태별 차량 수 표시
  - 최근 예약 목록
  - 대기중 상담 목록

- 타입 정의 (완료)
  - Vehicle: 차량 정보
  - Reservation: 예약 정보
  - Consultation: 상담 정보
  - Customer: 고객 정보
  - AdminUser: 관리자 정보
  - DashboardStats: 대시보드 통계

- UI 컴포넌트 (완료)
  - Card: 카드 컴포넌트
  - Button: 버튼 컴포넌트
  - 유틸리티 함수들

## 기술 스택

### 공통
- Next.js 15
- React 19
- TypeScript
- Framer Motion

### 데모 홈페이지
- Tailwind CSS 4
- Lucide React
- clsx, tailwind-merge

### 어드민 관리자
- 커스텀 CSS
- Lucide React
- 인라인 스타일링

## 디렉토리 구조

### 데모 홈페이지
```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── layout/            # 레이아웃 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── booking/           # 예약 관련 컴포넌트
│   └── car/               # 차량 관련 컴포넌트
├── data/                  # 정적 데이터
├── hooks/                 # 커스텀 훅
├── lib/                   # 유틸리티 라이브러리
└── types/                 # TypeScript 타입 정의
```

### 어드민 관리자
```
src/
├── components/
│   ├── admin/             # 어드민 전용 컴포넌트
│   └── ui/                # 기본 UI 컴포넌트
├── data/                  # 목 데이터
├── lib/                   # 유틸리티 함수
└── types/                 # TypeScript 타입 정의
app/
└── admin/                 # 어드민 페이지들
```

## 남은 작업들

### 우선순위 높음

#### 데모 홈페이지
- 실시간 예약 페이지 구현
  - 예약 폼 컴포넌트
  - 날짜 선택기
  - 차량 선택 인터페이스
  - 결제 연동 (선택사항)

- 고객센터 페이지들
  - 렌트카 안내 페이지
  - 자주 묻는 질문
  - 이용약관

- 예약 프로세스 개선
  - 다단계 예약 플로우
  - 예약 확인 페이지
  - 예약 수정/취소 기능

#### 어드민 관리자
- 차량 관리 페이지
  - 차량 목록 조회
  - 차량 등록/수정/삭제
  - 차량 상태 관리
  - 차량 이미지 업로드

- 예약 관리 페이지
  - 예약 목록 조회
  - 예약 상세 정보
  - 예약 승인/취소
  - 예약 캘린더 뷰

- 상담 관리 페이지
  - 상담 목록 조회
  - 상담 답변 작성
  - 상담 상태 관리
  - 자동 응답 설정

### 우선순위 중간

#### 데이터 연동
- API 서버 구축 (선택사항)
- 데이터베이스 연동
- 실시간 데이터 동기화
- 파일 업로드 시스템

#### 추가 기능
- 인증 시스템
  - 고객 로그인/회원가입
  - 관리자 로그인
  - 권한 관리

- 알림 시스템
  - 실시간 알림
  - 이메일 알림
  - SMS 알림

- 통계 및 분석
  - 상세 매출 통계
  - 차트 라이브러리 연동
  - 보고서 생성

### 우선순위 낮음

#### 최적화 및 개선
- 성능 최적화
- SEO 최적화
- 다국어 지원
- 모바일 앱 대응

#### 고급 기능
- 실시간 채팅
- 지도 API 연동
- 결제 시스템
- 리뷰 시스템

## 개발 환경 설정

### 실행 방법
```bash
# 데모 홈페이지
cd rentcar-demo
npm run dev  # localhost:3020

# 어드민 관리자  
cd rentcar-admin
npm run dev  # localhost:3022
```

### 의존성 설치
```bash
# 각 프로젝트 디렉토리에서
npm install
```

## 주요 설정 파일

### 데모 홈페이지
- tailwind.config.ts: Tailwind CSS 설정
- next.config.ts: Next.js 설정
- tsconfig.json: TypeScript 설정

### 어드민 관리자
- tailwind.config.ts: Tailwind CSS 설정 (사용하지 않음)
- app/globals.css: 커스텀 CSS 스타일
- tsconfig.json: TypeScript 설정

## 팀 작업 가이드

### 코드 스타일
- TypeScript 엄격 모드 사용
- 컴포넌트는 함수형으로 작성
- Props는 interface로 타입 정의
- 파일명은 PascalCase 사용

### 커밋 메시지
- feat: 새로운 기능 추가
- fix: 버그 수정
- style: 스타일 변경
- refactor: 코드 리팩토링
- docs: 문서 수정

### 브랜치 전략
- main: 배포용 브랜치
- develop: 개발용 브랜치
- feature/기능명: 기능 개발 브랜치

## 배포 준비사항

### 환경 변수 설정
- DATABASE_URL
- NEXTAUTH_SECRET
- PAYMENT_API_KEY (선택사항)

### 빌드 명령어
```bash
npm run build
npm run start
```

## 참고 자료

### 디자인 참고
- docs/ref/ref-home-1.JPG: 홈페이지 참고 이미지
- docs/ref/ref-home-2.JPG: 홈페이지 참고 이미지
- docs/ref/rentcar_theme_data.json: 테마 데이터

### 계획 문서
- docs/ref/admin_planning.json: 어드민 기능 명세
