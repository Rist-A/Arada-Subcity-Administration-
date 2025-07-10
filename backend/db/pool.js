const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection immediately
pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL successfully!');
    client.release(); // Don't forget to release the client
  })
  .catch(err => {
    console.error('❌ Failed to connect to PostgreSQL:', err.stack);
  });

module.exports = pool;
