const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { rollNo, name, email, password, department, cgpa } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const result = await pool.query('INSERT INTO Students VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [rollNo, name, email, hash, department, cgpa]);
  res.json(result.rows[0]);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM Students WHERE email=$1', [email]);
  if (!user.rows.length || !(await bcrypt.compare(password, user.rows[0].password))) {
    return res.status(401).json({error: "Invalid Credentials"});
  }
  const token = jwt.sign({id: user.rows[0].roll_no}, 'secret', {expiresIn: '1h'});
  res.json({token, rollNo: user.rows[0].roll_no, name: user.rows[0].name });
});

module.exports = router;