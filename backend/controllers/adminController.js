const bcrypt = require('bcrypt');
const AdminModel = require('../models/adminModel');

// GET all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.getAllAdmins();
    res.json(admins);
  } catch (err) {
    console.error("🔥 GET /api/admins error:", err); // add this
    res.status(500).json({ error: err.message });
  }
};

// POST create admin
exports.createAdmin = async (req, res) => {
  try {
    const { username, password_hash, email } = req.body;

    // Check for existing email
    const existing = await AdminModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already in use by another admin' });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);
    const newAdmin = await AdminModel.createAdmin(username, hashedPassword, email);
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// PUT edit admin password
exports.editAdmin = async (req, res) => {
  try {
    const { username, password, newpassword } = req.body;

    console.log("📥 Request body:", { username, password, newpassword });

    const admin = await AdminModel.getAdminByUsername(username);
    console.log("🧠 DB lookup result:", admin);

    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(404).json({ message: 'Admin not found' });
    }

    console.log("🔐 Stored hash:", admin.password_hash);

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    console.log("🔍 bcrypt result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const newHashedPassword = await bcrypt.hash(newpassword, 10);
    const updated = await AdminModel.updateAdminPassword(username, newHashedPassword);
    res.status(200).json({ message: 'Password updated successfully', admin: updated });

  } catch (err) {
    console.error("🔥 Error in editAdmin:", err);
    res.status(500).json({ error: err.message });
  }
};




// DELETE admin
exports.deleteadmin = async (req, res) => {
  try {
    const { username } = req.body;
    const deleted = await AdminModel.deleteAdminByUsername(username);
    if (!deleted) {
      return res.status(400).json({ message: 'User does not exist' });
    }
    res.status(200).json({ message: 'User deleted successfully', deletedUser: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
