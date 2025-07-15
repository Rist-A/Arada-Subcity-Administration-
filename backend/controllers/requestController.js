const RequestModel = require('../models/requestModel');

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await RequestModel.getAll();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const request = await RequestModel.create(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Accepted', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await RequestModel.update(id, { status });
    if (!updated) return res.status(404).json({ message: 'Request not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RequestModel.remove(id);
    if (!deleted) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};