const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/apply', async (req, res) => {
  const { rollNo, driveId } = req.body;
  const result = await pool.query("INSERT INTO Applications (roll_no, drive_id) VALUES ($1, $2) RETURNING *", [rollNo, driveId]);
  res.json(result.rows[0]);
});

router.get('/:roll_no', async (req, res) => {
  const query = `
    SELECT a.application_id, c.company_name, d.role, a.current_status, a.applied_on
    FROM Applications a
    JOIN Drives d ON a.drive_id = d.drive_id
    JOIN Companies c ON d.company_id = c.company_id
    WHERE a.roll_no = $1
    ORDER BY a.applied_on DESC;
  `;
  const result = await pool.query(query, [req.params.roll_no]);
  res.json(result.rows);
});

module.exports = router;