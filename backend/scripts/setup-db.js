require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'mnnit_counseling_db',
});

async function setup() {
  console.log('🔧 Setting up database...');

  const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('✅ Schema applied');

  const migration = fs.readFileSync(path.join(__dirname, '../db/migration.sql'), 'utf8');
  await pool.query(migration);
  console.log('✅ Migration applied');

  // Seed student — password = DOB = 15-05-2002
  await pool.query(`
    INSERT INTO students (registration_number, name, dob, branch, specialization, email)
    VALUES ('20BCS001', 'Rahul Sharma', '2002-05-15', 'Computer Science', 'AI/ML', 'rahul@mnnit.ac.in')
    ON CONFLICT (registration_number) DO NOTHING
  `);

  // Seed counsellor — password = DOB = 20-03-1985, login with email
  await pool.query(`
    INSERT INTO counsellors (name, dob, domain, email)
    VALUES ('Dr. Priya Singh', '1985-03-20', 'Mental Health', 'priya@mnnit.ac.in')
    ON CONFLICT (email) DO NOTHING
  `);

  // Seed admin — password = DOB = 01-01-1990, login with email
  await pool.query(`
    INSERT INTO administrators (name, dob, email)
    VALUES ('Admin User', '1990-01-01', 'admin@mnnit.ac.in')
    ON CONFLICT (email) DO NOTHING
  `);

  // Seed dean — password = DOB = 10-07-1975, login with email
  await pool.query(`
    INSERT INTO deans (name, dob, email)
    VALUES ('Dean Verma', '1975-07-10', 'dean@mnnit.ac.in')
    ON CONFLICT (email) DO NOTHING
  `);

  console.log('');
  console.log('🎉 Database ready! Login credentials:');
  console.log('');
  console.log('  STUDENT');
  console.log('  ├── URL      : http://localhost:5173/login/student');
  console.log('  ├── User ID  : 20BCS001');
  console.log('  └── Password : 15-05-2002  (DOB in DD-MM-YYYY)');
  console.log('');
  console.log('  COUNSELLOR');
  console.log('  ├── URL      : http://localhost:5173/login/counsellor');
  console.log('  ├── User ID  : priya@mnnit.ac.in');
  console.log('  └── Password : 20-03-1985  (DOB in DD-MM-YYYY)');
  console.log('');
  console.log('  ADMINISTRATOR');
  console.log('  ├── URL      : http://localhost:5173/login/administrator');
  console.log('  ├── User ID  : admin@mnnit.ac.in');
  console.log('  └── Password : 01-01-1990  (DOB in DD-MM-YYYY)');
  console.log('');
  console.log('  DEAN');
  console.log('  ├── URL      : http://localhost:5173/login/dean');
  console.log('  ├── User ID  : dean@mnnit.ac.in');
  console.log('  └── Password : 10-07-1975  (DOB in DD-MM-YYYY)');
  console.log('');

  await pool.end();
}

setup().catch(err => {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
});
