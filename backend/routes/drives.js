const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/eligible/:roll_no', async (req, res) => {
  const { roll_no } = req.params;
  const query = `
    SELECT d.drive_id, c.company_name, d.role
    FROM Drives d
    JOIN Companies c ON d.company_id = c.company_id
    JOIN Students s ON s.roll_no = $1
    WHERE d.min_cgpa <= s.cgpa AND NOT EXISTS (
      SELECT 1 FROM Applications a WHERE a.drive_id = d.drive_id AND a.roll_no = s.roll_no
    ) AND d.deadline >= CURRENT_DATE;
  `;
  const result = await pool.query(query, [roll_no]);
  res.json(result.rows);
});

module.exports = router;