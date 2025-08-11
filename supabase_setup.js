const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lieorhwpkxoeqobftkig.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im' +
  'xpZW9yaHdwa3hvZXFvYmZ0a2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MTc0NTQsImV4cCI6MjA3MDE5MzQ1NH0.urwE93o' +
  'N77JFmyk9svG28M_ntxPcT90v8THeupl31XM'
);

async function setupDatabase() {
  try {
    console.log('🚀 Starting Supabase database setup...\n');

    // Step 1: Check current vehicles table structure
    console.log('1. Checking current vehicles table...');
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1);
    
    if (vehiclesError) {
      console.log('❌ Vehicles table not found:', vehiclesError.message);
    } else {
      console.log('✅ Vehicles table exists. Sample data keys:');
      console.log(Object.keys(vehicles[0] || {}));
    }

    // Step 2: Check if new tables exist
    console.log('\n2. Checking new tables...');
    
    const { data: brands, error: brandsError } = await supabase
      .from('vehicle_brands')
      .select('*')
      .limit(1);
    
    const { data: locations, error: locationsError } = await supabase
      .from('vehicle_locations')
      .select('*')
      .limit(1);
    
    const { data: categories, error: categoriesError } = await supabase
      .from('vehicle_categories')
      .select('*')
      .limit(1);

    console.log('vehicle_brands:', brandsError ? '❌ Not found' : '✅ Exists');
    console.log('vehicle_locations:', locationsError ? '❌ Not found' : '✅ Exists');
    console.log('vehicle_categories:', categoriesError ? '❌ Not found' : '✅ Exists');

    // Step 3: Create sample data if tables exist
    if (!brandsError && !locationsError && !categoriesError) {
      console.log('\n3. Adding sample data...');
      
      // Insert sample brands
      const { error: brandInsertError } = await supabase
        .from('vehicle_brands')
        .upsert([
          { name: '현대', country: '한국' },
          { name: '기아', country: '한국' },
          { name: 'BMW', country: '독일' },
          { name: '벤츠', country: '독일' },
          { name: '아우디', country: '독일' },
          { name: '토요타', country: '일본' },
          { name: '혼다', country: '일본' },
          { name: '테슬라', country: '미국' }
        ], { onConflict: 'name' });

      // Insert sample locations
      const { error: locationInsertError } = await supabase
        .from('vehicle_locations')
        .upsert([
          { name: '강남점', address: '서울특별시 강남구 테헤란로 123', phone: '02-1234-5678', manager_name: '김매니저', manager_phone: '010-1234-5678' },
          { name: '홍대점', address: '서울특별시 마포구 홍익로 456', phone: '02-2345-6789', manager_name: '이매니저', manager_phone: '010-2345-6789' },
          { name: '부산점', address: '부산광역시 해운대구 해운대해변로 789', phone: '051-3456-7890', manager_name: '박매니저', manager_phone: '010-3456-7890' },
          { name: '대구점', address: '대구광역시 중구 중앙대로 321', phone: '053-4567-8901', manager_name: '최매니저', manager_phone: '010-4567-8901' }
        ], { onConflict: 'name' });

      // Insert sample categories
      const { error: categoryInsertError } = await supabase
        .from('vehicle_categories')
        .upsert([
          { name: '경차', description: '소형 경제형 차량', base_daily_rate: 40000, price_multiplier: 0.8 },
          { name: '소형', description: '소형 승용차', base_daily_rate: 50000, price_multiplier: 0.9 },
          { name: '중형세단', description: '중형 승용차', base_daily_rate: 70000, price_multiplier: 1.0 },
          { name: '대형세단', description: '대형 프리미엄 승용차', base_daily_rate: 80000, price_multiplier: 1.2 },
          { name: 'SUV', description: '스포츠 유틸리티 차량', base_daily_rate: 90000, price_multiplier: 1.3 },
          { name: '승합차', description: '9인승 이상 대형 차량', base_daily_rate: 120000, price_multiplier: 1.5 },
          { name: '전기차', description: '친환경 전기 차량', base_daily_rate: 100000, price_multiplier: 1.4 }
        ], { onConflict: 'name' });

      if (brandInsertError) console.log('❌ Brand insert error:', brandInsertError.message);
      else console.log('✅ Sample brands inserted');

      if (locationInsertError) console.log('❌ Location insert error:', locationInsertError.message);
      else console.log('✅ Sample locations inserted');

      if (categoryInsertError) console.log('❌ Category insert error:', categoryInsertError.message);
      else console.log('✅ Sample categories inserted');
    }

    // Step 4: Test the new services
    console.log('\n4. Testing services...');
    
    if (!brandsError) {
      const { data: allBrands } = await supabase.from('vehicle_brands').select('*');
      console.log(`✅ Found ${allBrands?.length || 0} brands`);
    }
    
    if (!locationsError) {
      const { data: allLocations } = await supabase.from('vehicle_locations').select('*');
      console.log(`✅ Found ${allLocations?.length || 0} locations`);
    }
    
    if (!categoriesError) {
      const { data: allCategories } = await supabase.from('vehicle_categories').select('*');
      console.log(`✅ Found ${allCategories?.length || 0} categories`);
    }

    console.log('\n🎉 Database setup completed successfully!');
    
    // Instructions for manual table creation if needed
    if (brandsError || locationsError || categoriesError) {
      console.log('\n⚠️  Some tables are missing. Please run the following SQL in Supabase Dashboard:');
      console.log('');
      console.log('CREATE TABLE vehicle_brands (');
      console.log('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
      console.log('  name VARCHAR(50) NOT NULL UNIQUE,');
      console.log('  logo_url VARCHAR(255),');
      console.log('  country VARCHAR(50),');
      console.log('  is_active BOOLEAN DEFAULT TRUE,');
      console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
      console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
      console.log(');');
      console.log('');
      console.log('-- (Similar CREATE statements for vehicle_locations and vehicle_categories)');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupDatabase();


