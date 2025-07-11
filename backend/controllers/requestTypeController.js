const RequestTypeModel = require('../models/requestTypeModel');

exports.getAllRequestTypes = async (req, res) => {
  try {
    const types = await RequestTypeModel.getAll();
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRequestType = async (req, res) => {
  try {
    const { name } = req.body;
    const newType = await RequestTypeModel.create(name);
    res.status(201).json(newType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRequestType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedType = await RequestTypeModel.update(id, name);
    if (!updatedType) {
      return res.status(404).json({ message: 'Request type not found' });
    }
    res.json(updatedType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRequestType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedType = await RequestTypeModel.remove(id);
    if (!deletedType) {
      return res.status(404).json({ message: 'Request type not found' });
    }
    res.json({ message: 'Request type deleted successfully', deleted: deletedType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};