-- DBMS Project Phase 1: Schema & Seed Data

CREATE TABLE Students (
    roll_no VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(50),
    cgpa NUMERIC(4,2) CHECK (cgpa >= 0 AND cgpa <= 10)
);

CREATE TABLE Companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    industry VARCHAR(100)
);

CREATE TABLE Drives (
    drive_id SERIAL PRIMARY KEY,
    company_id INT REFERENCES Companies(company_id),
    role VARCHAR(100) NOT NULL,
    package_lpa NUMERIC(5,2),
    min_cgpa NUMERIC(4,2),
    allowed_departments VARCHAR(255),
    deadline DATE
);

CREATE TABLE Applications (
    application_id SERIAL PRIMARY KEY,
    roll_no VARCHAR(20) REFERENCES Students(roll_no),
    drive_id INT REFERENCES Drives(drive_id),
    current_status VARCHAR(50) DEFAULT 'Applied',
    applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(roll_no, drive_id)
);

-- Mock Data
INSERT INTO Companies (company_name, industry) VALUES ('TechCorp', 'Software'), ('FinServe', 'Finance');
INSERT INTO Drives (company_id, role, package_lpa, min_cgpa, allowed_departments, deadline) VALUES 
(1, 'Software Engineer', 12.5, 7.5, 'Computer Science, IT', '2026-12-31'),
(2, 'Data Analyst', 10.0, 7.0, 'All', '2026-11-30');
