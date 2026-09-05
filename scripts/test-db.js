const { Client } = require('pg');

async function testConnection(url, label) {
  console.log(`Testing ${label}...`);
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log(`✅ SUCCESS: Connected to ${label}!`);
    const res = await client.query('SELECT NOW();');
    console.log(`  Time: ${res.rows[0].now}`);
    await client.end();
    return true;
  } catch (err) {
    console.error(`❌ FAILED: ${label} - ${err.message}`);
    return false;
  }
}

async function run() {
  const connStrings = [
    { label: 'Direct 5432 postgres', url: 'postgresql://postgres:badhon2006@db.xwczzmlwjincmccopgha.supabase.co:5432/postgres?sslmode=require' },
    { label: 'Pooler 6543 postgres.xwczzmlwjincmccopgha', url: 'postgresql://postgres.xwczzmlwjincmccopgha:badhon2006@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require' },
    { label: 'Pooler 5432 postgres.xwczzmlwjincmccopgha', url: 'postgresql://postgres.xwczzmlwjincmccopgha:badhon2006@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require' },
    { label: 'Pooler 6543 postgres', url: 'postgresql://postgres:badhon2006@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require' },
  ];

  for (const item of connStrings) {
    await testConnection(item.url, item.label);
  }
}

run();

