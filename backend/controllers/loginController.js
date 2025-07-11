const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check in admin table first
    const adminResult = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
    const admin = adminResult.rows[0];

    if (admin && await bcrypt.compare(password, admin.password_hash)) {
      const token = jwt.sign({ email: admin.email, role: admin.status, userType: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.status(200).json({
        message: 'Login successful',
        token
      });
    }

    // Check in department leader table
  const leaderResult = await pool.query(
  `SELECT dl.*, d.name AS department_name 
   FROM departmentleader dl
   JOIN department d ON dl.department_id = d.department_id
   WHERE dl.email = $1`,
  [email]
);

    const leader = leaderResult.rows[0];

    if (leader && await bcrypt.compare(password, leader.password_hash)) {
      const token = jwt.sign({ email: leader.department_email, role: 'department_leader', userType: 'leader' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.status(200).json({
        message: 'Login successful',
        token
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });

  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};