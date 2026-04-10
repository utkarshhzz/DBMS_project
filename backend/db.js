const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

let db;

(async () => {
    db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
    
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Students ( roll_no VARCHAR(20) PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, department VARCHAR(50), cgpa REAL CHECK (cgpa >= 0 AND cgpa <= 10) );
        CREATE TABLE IF NOT EXISTS Companies ( company_id INTEGER PRIMARY KEY AUTOINCREMENT, company_name VARCHAR(100) NOT NULL, industry VARCHAR(100) );
        CREATE TABLE IF NOT EXISTS Drives ( drive_id INTEGER PRIMARY KEY AUTOINCREMENT, company_id INTEGER REFERENCES Companies(company_id), role VARCHAR(100) NOT NULL, package_lpa REAL, min_cgpa REAL, allowed_departments VARCHAR(255), deadline DATE );
        CREATE TABLE IF NOT EXISTS Applications ( application_id INTEGER PRIMARY KEY AUTOINCREMENT, roll_no VARCHAR(20) REFERENCES Students(roll_no), drive_id INTEGER REFERENCES Drives(drive_id), current_status VARCHAR(50) DEFAULT 'Applied', applied_on DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE(roll_no, drive_id) );
        
        INSERT OR IGNORE INTO Companies (company_id, company_name, industry) VALUES (1, 'TechCorp', 'Software'), (2, 'FinServe', 'Finance');
        INSERT OR IGNORE INTO Drives (drive_id, company_id, role, package_lpa, min_cgpa, allowed_departments, deadline) VALUES (1, 1, 'Software Engineer', 12.5, 7.5, 'Computer Science, IT', '2026-12-31'), (2, 2, 'Data Analyst', 10.0, 7.0, 'All', '2026-11-30');
    `);
})();

module.exports = {
    query: async (sql, params = []) => {
        const sqliteSql = sql.replace(/\$\d+/g, '?');
        const isSelect = sqliteSql.trim().toUpperCase().startsWith('SELECT');
        const hasReturning = sqliteSql.toUpperCase().includes('RETURNING');
        if (isSelect || hasReturning) { return { rows: await db.all(sqliteSql, params) }; } 
        else { const res = await db.run(sqliteSql, params); return { rows: [], rowCount: res.changes }; }
    }
};