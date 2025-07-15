const DepartmentLeaderModel = require('../models/departmentLeaderModel');
const bcrypt = require('bcrypt');
exports.getAllLeaders = async (req, res) => {
  try {
    const leaders = await DepartmentLeaderModel.getAll();
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLeader = async (req, res) => {
  try {
    const { email, password_hash } = req.body;

    // Check for existing email
    const existing = await DepartmentLeaderModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already in use by another leader' });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);
    const leader = await DepartmentLeaderModel.create({ ...req.body, password_hash: hashedPassword });

    res.status(201).json(leader);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// PUT edit department password

exports.updateLeader = async (req, res) => {
  try {
    const { password, newpassword } = req.body;
    const { id } = req.params;

    if (!id || !password || !newpassword) {
      return res.status(400).json({ message: 'Leader ID, current password, and new password are required.' });
    }

    const leader = await DepartmentLeaderModel.getLeaderById(id);
    if (!leader) {
      return res.status(404).json({ message: 'Leader not found.' });
    }

    const isMatch = await bcrypt.compare(password, leader.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    const newHashedPassword = await bcrypt.hash(newpassword, 10);

    // ✅ Fixed this line
    await DepartmentLeaderModel.updateLeaderPassword(id, newHashedPassword);

    res.status(200).json({ message: 'Password updated successfully.' });

  } catch (err) {
    console.error('🔥 Error in updateLeader:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};




exports.deleteLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DepartmentLeaderModel.remove(id);
    if (!deleted) return res.status(404).json({ message: 'Leader not found' });
    res.json({ message: 'Leader deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
