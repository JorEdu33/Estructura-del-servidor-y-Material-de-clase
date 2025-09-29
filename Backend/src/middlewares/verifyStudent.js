const pool = require('../config/db');

async function ensureStudentExists(req, res, next) {
  try {
    const codigo = req.body.codigo_estudiante || req.params.codigo_estudiante || req.params.codigo;
    if (!codigo) return res.status(400).json({ error: "Falta codigo_estudiante" });

    const [rows] = await pool.execute("SELECT * FROM estudiantes WHERE codigo_estudiante = ?", [codigo]);
    if (rows.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });

    req.estudiante = rows[0];
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { ensureStudentExists };