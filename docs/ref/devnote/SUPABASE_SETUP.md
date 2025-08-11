# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 생성하거나 로그인합니다.
2. "New Project" 버튼을 클릭합니다.
3. 프로젝트 이름을 입력하고 (예: `rentcar-demo`) 데이터베이스 비밀번호를 설정합니다.
4. 지역을 선택하고 "Create new project"를 클릭합니다.

## 2. 환경 변수 설정

각 프로젝트의 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

### rentcar-demo/.env.local
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Database URL (for future use)
DATABASE_URL=your_database_url_here

# NextAuth (for future authentication)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3020
```

### rentcar-admin/.env.local
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Database URL (for future use)
DATABASE_URL=your_database_url_here

# NextAuth (for future authentication)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3022
```

## 3. Supabase URL과 API 키 찾기

1. Supabase 대시보드에서 프로젝트를 선택합니다.
2. 왼쪽 사이드바에서 "Settings" → "API"를 클릭합니다.
3. "Project URL"과 "anon public" 키를 복사합니다.
4. 위의 `.env.local` 파일에 붙여넣습니다.

## 4. 데이터베이스 테이블 생성

Supabase SQL Editor에서 다음 SQL을 실행하여 테이블을 생성합니다:

```sql
-- 차량 브랜드 테이블
CREATE TABLE vehicle_brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  logo_url VARCHAR(255),
  country VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 차량 위치 테이블
CREATE TABLE vehicle_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  address TEXT,
  phone VARCHAR(20),
  manager_name VARCHAR(50),
  manager_phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 차량 카테고리 테이블
CREATE TABLE vehicle_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  base_daily_rate INTEGER,
  price_multiplier DECIMAL(3,2) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 차량 테이블
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number VARCHAR(20) NOT NULL UNIQUE,
  brand_id UUID REFERENCES vehicle_brands(id) ON DELETE SET NULL,
  brand VARCHAR(50), -- 임시 호환성을 위해 유지
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR(30),
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')),
  passengers INTEGER DEFAULT 5,
  transmission VARCHAR(20) CHECK (transmission IN ('manual', 'automatic')),
  displacement INTEGER,
  mileage INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'inactive')),
  location_id UUID REFERENCES vehicle_locations(id) ON DELETE SET NULL,
  location VARCHAR(100), -- 임시 호환성을 위해 유지
  total_rentals INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0,
  daily_rate INTEGER NOT NULL,
  weekly_rate INTEGER DEFAULT 0,
  monthly_rate INTEGER DEFAULT 0,
  category_id UUID REFERENCES vehicle_categories(id) ON DELETE SET NULL,
  category VARCHAR(50), -- 임시 호환성을 위해 유지
  last_inspection_date DATE,
  images JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  insurance JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 고객 테이블
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  license_number VARCHAR(20) NOT NULL UNIQUE,
  license_expiry_date DATE NOT NULL,
  tier VARCHAR(20) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  total_rentals INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  is_blacklisted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 예약 테이블
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_number VARCHAR(20) NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pickup_location VARCHAR(100) NOT NULL,
  return_location VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  total_amount INTEGER NOT NULL,
  paid_amount INTEGER DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 상담 테이블
CREATE TABLE consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_number VARCHAR(20) NOT NULL UNIQUE,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('general', 'booking', 'technical', 'complaint')),
  subject VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_brand_model ON vehicles(brand, model);
CREATE INDEX idx_vehicles_brand_id ON vehicles(brand_id);
CREATE INDEX idx_vehicles_location_id ON vehicles(location_id);
CREATE INDEX idx_vehicles_category_id ON vehicles(category_id);
CREATE INDEX idx_vehicle_brands_name ON vehicle_brands(name);
CREATE INDEX idx_vehicle_locations_name ON vehicle_locations(name);
CREATE INDEX idx_vehicle_categories_name ON vehicle_categories(name);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_dates ON reservations(start_date, end_date);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_customers_email ON customers(email);
```

## 5. Row Level Security (RLS) 설정

보안을 위해 RLS를 활성화하고 정책을 설정합니다:

```sql
-- RLS 활성화
ALTER TABLE vehicle_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- 모든 테이블에 대해 읽기/쓰기 허용 (개발용)
CREATE POLICY "Allow all operations" ON vehicle_brands FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON vehicle_locations FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON vehicle_categories FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON vehicles FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON reservations FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON consultations FOR ALL USING (true);
```

## 6. 기존 테이블 업데이트 (필요시)

기존에 테이블을 생성했다면 다음 SQL을 단계별로 실행하여 새로운 필드들을 추가합니다:

```sql
-- Step 1: 새로운 lookup 테이블들 생성
-- (위의 4번 섹션에서 vehicle_brands, vehicle_locations, vehicle_categories 테이블 생성)

-- Step 2: vehicles 테이블에 새로운 필드 추가
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS displacement INTEGER,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS insurance JSONB,
ADD COLUMN IF NOT EXISTS brand_id UUID,
ADD COLUMN IF NOT EXISTS location_id UUID,
ADD COLUMN IF NOT EXISTS category_id UUID;

-- Step 3: Foreign Key 제약조건 추가
ALTER TABLE vehicles 
ADD CONSTRAINT fk_vehicles_brand FOREIGN KEY (brand_id) REFERENCES vehicle_brands(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_vehicles_location FOREIGN KEY (location_id) REFERENCES vehicle_locations(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_vehicles_category FOREIGN KEY (category_id) REFERENCES vehicle_categories(id) ON DELETE SET NULL;

-- Step 4: 기존 데이터에 기본값 설정
UPDATE vehicles 
SET 
  displacement = 2000,
  images = '[]',
  features = '[]',
  insurance = '{"provider": "", "policy_number": "", "start_date": "", "end_date": "", "contact_person": "", "contact_phone": ""}'
WHERE displacement IS NULL;
```

## 7. 샘플 데이터 삽입 (선택사항)

테스트를 위한 샘플 데이터를 삽입합니다:

```sql
-- 샘플 브랜드 데이터
INSERT INTO vehicle_brands (name, country) VALUES 
('현대', '한국'),
('기아', '한국'),
('BMW', '독일'),
('벤츠', '독일'),
('아우디', '독일'),
('토요타', '일본'),
('혼다', '일본'),
('테슬라', '미국');

-- 샘플 위치 데이터
INSERT INTO vehicle_locations (name, address, phone, manager_name, manager_phone) VALUES 
('강남점', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '김매니저', '010-1234-5678'),
('홍대점', '서울특별시 마포구 홍익로 456', '02-2345-6789', '이매니저', '010-2345-6789'),
('부산점', '부산광역시 해운대구 해운대해변로 789', '051-3456-7890', '박매니저', '010-3456-7890'),
('대구점', '대구광역시 중구 중앙대로 321', '053-4567-8901', '최매니저', '010-4567-8901');

-- 샘플 카테고리 데이터
INSERT INTO vehicle_categories (name, description, base_daily_rate, price_multiplier) VALUES 
('경차', '소형 경제형 차량', 40000, 0.8),
('소형', '소형 승용차', 50000, 0.9),
('중형세단', '중형 승용차', 70000, 1.0),
('대형세단', '대형 프리미엄 승용차', 80000, 1.2),
('SUV', '스포츠 유틸리티 차량', 90000, 1.3),
('승합차', '9인승 이상 대형 차량', 120000, 1.5),
('전기차', '친환경 전기 차량', 100000, 1.4);

-- 샘플 차량 데이터 (브랜드, 위치, 카테고리 ID 참조)
INSERT INTO vehicles (
  vehicle_number, brand_id, brand, model, year, color, fuel_type, 
  passengers, transmission, displacement, mileage, status, location_id, location,
  daily_rate, weekly_rate, monthly_rate, category_id, category, last_inspection_date,
  images, features, insurance
) 
SELECT 
  '12가3456', 
  (SELECT id FROM vehicle_brands WHERE name = '현대'), '현대',
  '그랜저', 2023, '검정', 'gasoline', 5, 'automatic', 2500, 15000, 'available',
  (SELECT id FROM vehicle_locations WHERE name = '강남점'), '강남점',
  80000, 500000, 2000000,
  (SELECT id FROM vehicle_categories WHERE name = '대형세단'), '대형세단',
  '2024-01-01',
  '[{"id": "img-1", "url": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop", "type": "main", "alt": "그랜저 메인 이미지", "order": 1}]',
  '[{"id": "navigation", "name": "네비게이션", "included": true}, {"id": "blackbox", "name": "블랙박스", "included": true}, {"id": "rear_camera", "name": "후방카메라", "included": true}]',
  '{"provider": "삼성화재", "policy_number": "POL-2024-001", "start_date": "2024-01-01", "end_date": "2024-12-31", "contact_person": "홍길동", "contact_phone": "02-1234-5678"}'

UNION ALL SELECT 
  '34나5678',
  (SELECT id FROM vehicle_brands WHERE name = '기아'), '기아',
  'K5', 2023, '흰색', 'gasoline', 5, 'automatic', 2000, 12000, 'available',
  (SELECT id FROM vehicle_locations WHERE name = '강남점'), '강남점',
  70000, 450000, 1800000,
  (SELECT id FROM vehicle_categories WHERE name = '중형세단'), '중형세단',
  '2024-01-15',
  '[{"id": "img-2", "url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop", "type": "main", "alt": "K5 메인 이미지", "order": 1}]',
  '[{"id": "navigation", "name": "네비게이션", "included": true}, {"id": "blackbox", "name": "블랙박스", "included": true}]',
  '{"provider": "DB손해보험", "policy_number": "POL-2024-002", "start_date": "2024-01-01", "end_date": "2024-12-31", "contact_person": "김영수", "contact_phone": "02-2345-6789"}'

UNION ALL SELECT 
  '56다7890',
  (SELECT id FROM vehicle_brands WHERE name = 'BMW'), 'BMW',
  'X3', 2023, '회색', 'gasoline', 5, 'automatic', 2000, 8000, 'available',
  (SELECT id FROM vehicle_locations WHERE name = '강남점'), '강남점',
  120000, 750000, 3000000,
  (SELECT id FROM vehicle_categories WHERE name = 'SUV'), 'SUV',
  '2024-02-01',
  '[{"id": "img-3", "url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop", "type": "main", "alt": "BMW X3 메인 이미지", "order": 1}]',
  '[{"id": "navigation", "name": "네비게이션", "included": true}, {"id": "blackbox", "name": "블랙박스", "included": true}, {"id": "sunroof", "name": "선루프", "included": true}]',
  '{"provider": "현대해상", "policy_number": "POL-2024-003", "start_date": "2024-01-01", "end_date": "2024-12-31", "contact_person": "박철수", "contact_phone": "02-3456-7890"}';

-- 샘플 고객 데이터
INSERT INTO customers (
  name, phone, email, license_number, license_expiry_date, tier
) VALUES 
('김철수', '010-1234-5678', 'kim@example.com', '12-34-567890-12', '2027-12-31', 'gold'),
('이영희', '010-2345-6789', 'lee@example.com', '23-45-678901-23', '2026-08-15', 'silver'),
('박민수', '010-3456-7890', 'park@example.com', '34-56-789012-34', '2028-03-20', 'bronze');
```

## 8. 프로젝트 실행

환경 변수를 설정한 후 프로젝트를 실행합니다:

```bash
# 데모 홈페이지
cd rentcar-demo
npm run dev

# 어드민 관리자 (새 터미널에서)
cd rentcar-admin
npm run dev
```

## 9. 확인사항

1. 브라우저에서 `http://localhost:3020` (데모)와 `http://localhost:3022` (어드민)에 접속
2. 어드민에서 차량 관리 페이지 접속
3. 차량 등록 기능 테스트
4. Supabase 대시보드에서 데이터 확인

## 문제 해결

### 환경 변수 오류
- `.env.local` 파일이 올바른 위치에 있는지 확인
- 환경 변수 이름이 정확한지 확인
- 프로젝트를 재시작

### 데이터베이스 연결 오류
- Supabase URL과 API 키가 올바른지 확인
- 네트워크 연결 상태 확인
- Supabase 프로젝트 상태 확인

### RLS 정책 오류
- 테이블에 RLS가 활성화되어 있는지 확인
- 정책이 올바르게 설정되어 있는지 확인
