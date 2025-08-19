const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lieorhwpkxoeqobftkig.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im' +
  'xpZW9yaHdwa3hvZXFvYmZ0a2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MTc0NTQsImV4cCI6MjA3MDE5MzQ1NH0.urwE93o' +
  'N77JFmyk9svG28M_ntxPcT90v8THeupl31XM'
);

async function updateSchema() {
  try {
    console.log('Step 1: Adding new columns to vehicles table...');
    
    // Supabase에서는 직접 SQL을 실행할 수 없으므로, 수동으로 확인해보겠습니다
    const { data, error } = await supabase.from('vehicles').select('*').limit(1);
    
    if (error) {
      console.log('Error accessing table:', error.message);
      return;
    }
    
    console.log('Current table schema (sample row):');
    console.log(JSON.stringify(data[0], null, 2));
    
    // 새 필드가 있는지 확인
    const sampleRow = data[0];
    const hasNewFields = 'displacement' in sampleRow && 'images' in sampleRow && 'features' in sampleRow && 'insurance' in sampleRow;
    
    if (hasNewFields) {
      console.log('✅ New fields already exist in the table!');
    } else {
      console.log('❌ New fields missing. Please run the ALTER TABLE commands in Supabase SQL Editor:');
      console.log(`
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS displacement INTEGER,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS insurance JSONB;

UPDATE vehicles 
SET 
  displacement = 2000,
  images = '[]',
  features = '[]',
  insurance = '{"provider": "", "policy_number": "", "start_date": "", "end_date": "", "contact_person": "", "contact_phone": ""}'
WHERE displacement IS NULL;
      `);
    }
    
  } catch (e) {
    console.log('Error:', e.message);
  }
}

updateSchema();



