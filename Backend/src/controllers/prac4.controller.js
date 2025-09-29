const pool = require('../config/db');

exports.ejer1_prac4_C1 = async (req, res, next) => {
  try {
    const { codigo_estudiante, Mediana, Bias, SE, CI_lower, CI_upper, codigo_funcion } = req.body;
    const [estudiante] = await pool.execute("SELECT * FROM estudiantes WHERE codigo_estudiante = ?", [codigo_estudiante]);
    if (estudiante.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });

    const [intentos] = await pool.execute("SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", [codigo_estudiante, "Ejercicio 1 - Práctica 4 - C1"]);
    if (intentos[0].num_intentos >= 2) return res.status(403).json({ error: "Número máximo de intentos alcanzado" });

    const esperado = { Mediana: 13.85, Bias: 0.2473, SE: 0.8155, CI_lower: 12.2516, CI_upper: 15.4484 };
    const tol = 0.01;
    let puntos = 0; let fallos = [];
    function check(nombre) { if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++; else fallos.push(nombre); }
    ["Mediana","Bias","SE","CI_lower","CI_upper"].forEach(check);

    let nota;
    if (puntos === 5) nota = 5.0;
    else if (puntos === 4) nota = 4.0;
    else if (puntos === 3) nota = 3.0;
    else if (puntos === 2) nota = 2.0;
    else if (puntos === 1) nota = 1.0;
    else nota = 0.0;

    await pool.execute("INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
      [codigo_estudiante, "Ejercicio 1 - Práctica 4 - C1", nota, codigo_funcion]);

    res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });

  } catch (err) { next(err); }
};


exports.ejer2_prac4_C1 = async (req, res, next) => {
  try {
    const { codigo_estudiante, Mediana, Bias, SE, CI_lower, CI_upper, codigo_funcion } = req.body;
    const [estudiante] = await pool.execute("SELECT * FROM estudiantes WHERE codigo_estudiante = ?", [codigo_estudiante]);
    if (estudiante.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });

    const [intentos] = await pool.execute("SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", [codigo_estudiante, "Ejercicio 2 - Práctica 4 - C1"]);
    if (intentos[0].num_intentos >= 2) return res.status(403).json({ error: "Número máximo de intentos alcanzado" });

    const esperado = { Mediana: 28.5, Bias: 0.8388, SE: 1.7777, CI_lower: 24.3661, CI_upper: 32.6339 };
    const tol = 0.001;
    let puntos = 0; let fallos = [];
    function check(nombre) { if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++; else fallos.push(nombre); }
    ["Mediana","Bias","SE","CI_lower","CI_upper"].forEach(check);

    let nota;
    if (puntos === 5) nota = 5.0;
    else if (puntos === 4) nota = 4.0;
    else if (puntos === 3) nota = 3.0;
    else if (puntos === 2) nota = 2.0;
    else if (puntos === 1) nota = 1.0;
    else nota = 0.0;

    await pool.execute("INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
      [codigo_estudiante, "Ejercicio 2 - Práctica 4 - C1", nota, codigo_funcion]);

    res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });

  } catch (err) { next(err); }
};


exports.ejer1_prac4_F3 = async (req, res, next) => {
  try {
    const { codigo_estudiante, Mediana, Bias, SE, CI_lower, CI_upper, codigo_funcion } = req.body;
    const [estudiante] = await pool.execute("SELECT * FROM estudiantes WHERE codigo_estudiante = ?", [codigo_estudiante]);
    if (estudiante.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });

    const [intentos] = await pool.execute("SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", [codigo_estudiante, "Ejercicio 1 - Práctica 4 - F3"]);
    if (intentos[0].num_intentos >= 2) return res.status(403).json({ error: "Número máximo de intentos alcanzado" });

    const esperado = { Mediana: 1.71, Bias: -0.0011, SE: 0.0307, CI_lower: 1.6595, CI_upper: 1.7605 };
    const tol = 0.001;
    let puntos = 0; let fallos = [];
    function check(nombre) { if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++; else fallos.push(nombre); }
    ["Mediana","Bias","SE","CI_lower","CI_upper"].forEach(check);

    let nota;
    if (puntos === 5) nota = 5.0;
    else if (puntos === 4) nota = 4.0;
    else if (puntos === 3) nota = 3.0;
    else if (puntos === 2) nota = 2.0;
    else if (puntos === 1) nota = 1.0;
    else nota = 0.0;

    await pool.execute("INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
      [codigo_estudiante, "Ejercicio 1 - Práctica 4 - F3", nota, codigo_funcion]);

    res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });

  } catch (err) { next(err); }
};


exports.ejer2_prac4_F3 = async (req, res, next) => {
  try {
    const { codigo_estudiante, Mediana, Bias, SE, CI_lower, CI_upper, codigo_funcion } = req.body;
    const [estudiante] = await pool.execute("SELECT * FROM estudiantes WHERE codigo_estudiante = ?", [codigo_estudiante]);
    if (estudiante.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });

    const [intentos] = await pool.execute("SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", [codigo_estudiante, "Ejercicio 2 - Práctica 4 - F3"]);
    if (intentos[0].num_intentos >= 2) return res.status(403).json({ error: "Número máximo de intentos alcanzado" });

    const esperado = { Mediana: 318.22, Bias: 1.833, SE: 20.9402, CI_lower: 269.5058, CI_upper: 366.9342 };
    const tol = 0.001;
    let puntos = 0; let fallos = [];
    function check(nombre) { if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++; else fallos.push(nombre); }
    ["Mediana","Bias","SE","CI_lower","CI_upper"].forEach(check);

    let nota;
    if (puntos === 5) nota = 5.0;
    else if (puntos === 4) nota = 4.0;
    else if (puntos === 3) nota = 3.0;
    else if (puntos === 2) nota = 2.0;
    else if (puntos === 1) nota = 1.0;
    else nota = 0.0;

    await pool.execute("INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
      [codigo_estudiante, "Ejercicio 2 - Práctica 4 - F3", nota, codigo_funcion]);

    res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });

  } catch (err) { next(err); }
};
