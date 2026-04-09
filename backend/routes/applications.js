const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/apply', async (req, res) => {
  const { rollNo, driveId } = req.body;
  const result = await pool.query("INSERT INTO Applications (roll_no, drive_id) VALUES ($1, $2) RETURNING *", [rollNo, driveId]);
  res.json(result.rows[0]);
});

router.get('/:roll_no', async (req, res) => {
  const query = `SELECT * FROM Applications WHERE roll_no = $1 ORDER BY applied_on DESC`;
  const result = await pool.query(query, [req.params.roll_no]);
  res.json(result.rows);
});

module.exports = router;