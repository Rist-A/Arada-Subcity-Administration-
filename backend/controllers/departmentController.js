const DepartmentModel = require('../models/departmentModel');

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.getAll();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const department = await DepartmentModel.create(req.body);
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await DepartmentModel.update(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Department not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DepartmentModel.remove(id);
    if (!deleted) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};