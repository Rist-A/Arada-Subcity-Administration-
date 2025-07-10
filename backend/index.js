const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import routes
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/request-types', require('./routes/requestTypeRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/leaders', require('./routes/departmentLeaderRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/login', require('./routes/loginRoutes'))
// Repeat for each table's routes

app.get('/', (req, res) => {
  res.send('API is working');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
