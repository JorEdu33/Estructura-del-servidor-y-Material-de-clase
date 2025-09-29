const pool = require('../config/db');

exports.getGrupos = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT TRIM(grupo) AS grupo
      FROM estudiantes
      WHERE grupo IS NOT NULL AND grupo != ''
      ORDER BY grupo ASC
    `);
    const grupos = rows.map(r => r.grupo);
    res.json(grupos);
  } catch (err) {
    next(err);
  }
};

exports.getSemanasPorGrupo = async (req, res, next) => {
  try {
    const { grupo } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        ej.codigo_estudiante,
        s.nombre_estudiante,
        s.grupo,
        ej.nombre_ejercicio,
        WEEK(ej.tiempo, 1) AS semana,
        MAX(ej.nota) AS mejor_nota
      FROM ejercicios ej
      JOIN estudiantes s ON ej.codigo_estudiante = s.codigo_estudiante
      WHERE s.grupo = ?
      GROUP BY ej.codigo_estudiante, s.nombre_estudiante, s.grupo,
               ej.nombre_ejercicio, WEEK(ej.tiempo, 1)
      ORDER BY semana, s.nombre_estudiante, ej.nombre_ejercicio;
    `, [grupo]);

    const semanas = {};
    rows.forEach(r => {
      if (!semanas[r.semana]) semanas[r.semana] = [];
      semanas[r.semana].push({
        codigo_estudiante: r.codigo_estudiante,
        nombre_estudiante: r.nombre_estudiante,
        grupo: r.grupo,
        ejercicio: r.nombre_ejercicio,
        mejor_nota: r.mejor_nota
      });
    });

    res.json(semanas);
  } catch (err) {
    next(err);
  }
};

exports.getDetallePorSemanaYCodigo = async (req, res, next) => {
  try {
    const { semana, codigo } = req.params;
    const [rows] = await pool.query(
      `SELECT id, nombre_ejercicio, nota, codigo, 
              DATE(tiempo) AS fecha, TIME(tiempo) AS hora
       FROM ejercicios 
       WHERE codigo_estudiante = ? 
         AND WEEK(tiempo, 1) = ? 
       ORDER BY tiempo ASC`,
      [codigo, semana]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.deleteDetalleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM ejercicios WHERE id = ? LIMIT 1", [id]);
    res.json({ success: true, message: "Intento eliminado" });
  } catch (err) {
    next(err);
  }
};
