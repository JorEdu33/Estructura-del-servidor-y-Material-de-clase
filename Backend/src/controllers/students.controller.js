const pool = require('../config/db');

exports.registrarEstudiante = async (req, res, next) => {
  try {
    const { codigo_estudiante, nombre_estudiante, grupo } = req.body;
    if (!codigo_estudiante || !nombre_estudiante || !grupo) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
      [codigo_estudiante]
    );

    if (rows.length > 0) {
      return res.json({ mensaje: "Estudiante ya registrado" });
    }

    await pool.execute(
      "INSERT INTO estudiantes (codigo_estudiante, nombre_estudiante, grupo) VALUES (?, ?, ?)",
      [codigo_estudiante, nombre_estudiante, grupo]
    );

    res.json({ mensaje: "Estudiante registrado correctamente" });
  } catch (err) {
    next(err);
  }
};

exports.registrarEjercicio = async (req, res, next) => {
  try {
    const { codigo_estudiante, nombre_ejercicio, nota } = req.body;

    if (!codigo_estudiante || !nombre_ejercicio || nota === undefined) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
      [codigo_estudiante]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    await pool.execute(
      "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota) VALUES (?, ?, ?)",
      [codigo_estudiante, nombre_ejercicio, nota]
    );

    res.json({ mensaje: "Ejercicio registrado correctamente" });
  } catch (err) {
    next(err);
  }
};
