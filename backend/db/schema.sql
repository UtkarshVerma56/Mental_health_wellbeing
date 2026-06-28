-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    registration_number VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    branch VARCHAR(50) NOT NULL,
    specialization VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@mnnit\.ac\.in$'),
    password_hash VARCHAR(255) NOT NULL DEFAULT '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- default: "password"
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMPTZ
);

-- Counsellors Table
CREATE TABLE IF NOT EXISTS counsellors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    domain VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@mnnit\.ac\.in$'),
    password_hash VARCHAR(255) NOT NULL DEFAULT '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMPTZ
);

-- Administrators Table
CREATE TABLE IF NOT EXISTS administrators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMPTZ
);

-- Deans Table
CREATE TABLE IF NOT EXISTS deans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMPTZ
);

-- Requests Table
CREATE TABLE IF NOT EXISTS requests (
    request_id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL REFERENCES students(registration_number) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'))
);

-- Responses Table
CREATE TABLE IF NOT EXISTS responses (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES requests(request_id) ON DELETE CASCADE,
    counsellor_id UUID NOT NULL REFERENCES counsellors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    timeslot VARCHAR(20) NOT NULL,
    action_performed TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('RESOLVED', 'FOLLOW_UP', 'REFERRED'))
);
