const express = require('express');
const pool = require('../db');
const router = express.Router();

// TPO: Add a new Placement Drive
router.post('/drive', async (req, res) => {
  try {
    const { companyId, role, packageLpa, minCgpa, allowedDepartments, deadline } = req.body;
    
    // Convert deadline format or let Postgres handle YYYY-MM-DD
    const newDrive = await pool.query(
      `INSERT INTO Drives (company_id, role, package_lpa, min_cgpa, allowed_departments, deadline) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [companyId, role, packageLpa, minCgpa, allowedDepartments, deadline]
    );

    res.json(newDrive.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error: 'Server Error'});
  }
});

// TPO: Update a student's application status
router.put('/application/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const update = await pool.query(
      "UPDATE Applications SET current_status = $1 WHERE application_id = $2 RETURNING *",
      [status, id]
    );

    res.json(update.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error: 'Server Error'});
  }
});

// TPO: Get Drive Statistics
router.get('/stats', async (req, res) => {
  try {
    const query = `
      SELECT d.drive_id, c.company_name, d.role, 
             COUNT(a.application_id) as total_applicants,
             SUM(CASE WHEN a.current_status = 'Offered' THEN 1 ELSE 0 END) as total_offers
      FROM Drives d
      LEFT JOIN Companies c ON d.company_id = c.company_id
      LEFT JOIN Applications a ON d.drive_id = a.drive_id
      GROUP BY d.drive_id, c.company_name, d.role
      ORDER BY d.drive_id DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error: 'Server Error'});
  }
});

// TPO: Get All Applications
router.get('/applications', async (req, res) => {
  try {
    const query = `
      SELECT a.application_id, s.name as student_name, s.roll_no, c.company_name, d.role, a.current_status, a.applied_on
      FROM Applications a
      JOIN Students s ON a.roll_no = s.roll_no
      JOIN Drives d ON a.drive_id = d.drive_id
      JOIN Companies c ON d.company_id = c.company_id
      ORDER BY a.applied_on DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error: 'Server Error'});
  }
});

// TPO: Get all Companies
router.get('/companies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Companies ORDER BY company_name');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error: 'Server Error'});
  }
});

module.exports = router;
