const { startOfWeek, setWeek } = require('date-fns');
const { es } = require('date-fns/locale');
const pool = require('../config/db');

// =========================
// 1️⃣ Registrar estudiante
// =========================
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

// =============================
// 🔧 Función auxiliar de fecha
// =============================
function obtenerFechaSemana(semana) {
  const añoActual = new Date().getFullYear();
  let fecha = new Date(añoActual, 0, 1);
  fecha = setWeek(fecha, semana, { locale: es });
  const inicioSemana = startOfWeek(fecha, { weekStartsOn: 1 }); // lunes
  return inicioSemana;
}

// =========================
// 2️⃣ Asignar ceros
// =========================
exports.asignarCeros = async (req, res, next) => {
  const { semana, grupo } = req.body;

  try {
    if (!semana || !grupo) {
      return res.status(400).json({ error: 'Faltan datos: semana o grupo' });
    }

    const fechaInicio = obtenerFechaSemana(semana);

    // --- 1. Obtener estudiantes del grupo ---
    const [estudiantes] = await pool.query(
      'SELECT codigo_estudiante FROM estudiantes WHERE grupo = ?',
      [grupo]
    );

    if (estudiantes.length === 0) {
      return res.status(404).json({ message: `No hay estudiantes en el grupo ${grupo}.` });
    }

    // --- 2. Obtener ejercicios registrados en esa semana y grupo ---
    const [ejerciciosSemana] = await pool.query(
      `SELECT DISTINCT e.nombre_ejercicio
       FROM ejercicios e
       JOIN estudiantes s ON e.codigo_estudiante = s.codigo_estudiante
       WHERE WEEKOFYEAR(e.tiempo) = ? AND s.grupo = ?`,
      [semana, grupo]
    );

    if (ejerciciosSemana.length === 0) {
      return res.status(404).json({ message: `No hay ejercicios registrados en la semana ${semana} para el grupo ${grupo}.` });
    }

    const resumen = [];

    // --- 3. Revisar e insertar los faltantes ---
    for (const estudiante of estudiantes) {
      const [realizados] = await pool.query(
        'SELECT nombre_ejercicio FROM ejercicios WHERE codigo_estudiante = ? AND WEEKOFYEAR(tiempo) = ?',
        [estudiante.codigo_estudiante, semana]
      );

      const realizadosNombres = realizados.map(r => r.nombre_ejercicio);
      const faltantes = ejerciciosSemana
        .map(e => e.nombre_ejercicio)
        .filter(ej => !realizadosNombres.includes(ej));

      for (const ejercicio of faltantes) {
        await pool.query(
          'INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, tiempo) VALUES (?, ?, 0, ?)',
          [estudiante.codigo_estudiante, ejercicio, fechaInicio]
        );
      }

      if (faltantes.length > 0) {
        resumen.push({
          codigo_estudiante: estudiante.codigo_estudiante,
          ejercicios_faltantes: faltantes
        });
      }
    }

    res.json({
      message: `✅ Se asignaron ceros a los ejercicios faltantes de la semana ${semana} en el grupo ${grupo}.`,
      fecha_usada: fechaInicio.toISOString(),
      resumen
    });

  } catch (error) {
    console.error('❌ Error asignando ceros:', error);
    next(error);
  }
};


// =========================
// 3️⃣ Registrar ejercicio
// =========================
exports.registrarEjercicio = async (req, res, next) => {
  try {
    const { codigo_estudiante, nombre_ejercicio, nota, codigo } = req.body;

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
      "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
      [codigo_estudiante, nombre_ejercicio, nota, codigo || null]
    );

    res.json({ mensaje: "Ejercicio registrado correctamente" });
  } catch (err) {
    next(err);
  }
};
