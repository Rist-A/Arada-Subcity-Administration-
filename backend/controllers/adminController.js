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
    const { username, password_hash, email ,phone_number} = req.body;

    // Check for existing email
    const existing = await AdminModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already in use by another admin' });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);
    const newAdmin = await AdminModel.createAdmin(username, hashedPassword, email,phone_number);
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// PUT edit admin password
exports.editAdmin = async (req, res) => {
  try {
    const { password, newpassword } = req.body;
    const { id } = req.params; // get admin ID from the route params

    if (!id || !password || !newpassword) {
      return res.status(400).json({ message: 'Admin ID, current password, and new password are required.' });
    }

    // 1. Find admin by ID
    const admin = await AdminModel.getAdminById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    // 2. Verify old password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    // 3. Hash new password
    const newHashedPassword = await bcrypt.hash(newpassword, 10);

    // 4. Update password
    await AdminModel.updateAdminPassword(id, newHashedPassword);

    res.status(200).json({ message: 'Password updated successfully.' });

  } catch (err) {
    console.error('🔥 Error in editAdmin:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};





// DELETE admin
exports.deleteadmin = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL
      const admin = await AdminModel.getAdminById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

      await AdminModel.deleteAdminById(id);
       res.status(200).json({ message: 'admin deleted successfully' });
    
  } catch (err) {
    console.error("🔥 Error in deleteadmin:", err);
    res.status(500).json({ error: err.message });
  }
};

