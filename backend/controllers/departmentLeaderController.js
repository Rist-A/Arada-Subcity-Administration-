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


exports.updateLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await DepartmentLeaderModel.update(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Leader not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
