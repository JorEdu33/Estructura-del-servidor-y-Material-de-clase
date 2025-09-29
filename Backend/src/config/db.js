const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// ✅ Probar conexión apenas arranca
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Conectado a MySQL:", dbConfig.database);
    conn.release();
  } catch (err) {
    console.error("❌ Error de conexión MySQL:", err.message);
  }
})();

module.exports = pool;