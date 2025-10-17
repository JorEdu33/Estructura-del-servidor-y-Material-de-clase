const { startOfWeek, setWeek } = require('date-fns');
const { es } = require('date-fns/locale');
const pool = require('../config/db');


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
