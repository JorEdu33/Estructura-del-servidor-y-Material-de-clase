const pool = require('../config/db');

exports.evaluarVarianzas = async (req, res, next) => {
    try {
      const { codigo_estudiante, F_calc, F_crit_low, F_crit_high, resultado, codigo_funcion } = req.body;
  
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
      if (estudiante.length === 0) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }
  
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, "Ejercicio 1 - Práctica 2"]
      );
      if (intentos[0].num_intentos >= 2) {
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
      }
  
      const mina1 = [8260, 8130, 8350, 8070, 8340];
      const mina2 = [7950, 7890, 7900, 8140, 7920, 7840];
  
      const calcPruebaVarianzas = (x, y, alpha = 0.05) => {
        const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
        const variance = arr => {
          const m = mean(arr);
          return arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / (arr.length - 1);
        };
  
        const n1 = x.length;
        const n2 = y.length;
        const s1_sq = variance(x);
        const s2_sq = variance(y);
  
        const F_calc = s1_sq / s2_sq;
        const df1 = n1 - 1;
        const df2 = n2 - 1;
  
        const F_crit_low = 0.1040;
        const F_crit_high = 7.3878;
        const resultado = (F_calc < F_crit_low || F_calc > F_crit_high) ? "Reject" : "Fail to Reject";
  
        return { F_calc, F_crit_low, F_crit_high, resultado };
      };
  
      const esperado = calcPruebaVarianzas(mina1, mina2);
  
      const tol = 0.01;
      let puntos = 0;
      let fallos = [];
  
      if (Math.abs(F_calc - esperado.F_calc) <= tol) puntos++; else fallos.push("F_calc");
      if (Math.abs(F_crit_low - esperado.F_crit_low) <= tol) puntos++; else fallos.push("F_crit_low");
      if (Math.abs(F_crit_high - esperado.F_crit_high) <= tol) puntos++; else fallos.push("F_crit_high");
      if (resultado === esperado.resultado) puntos++; else fallos.push("resultado");
  
      let nota;
      if (puntos === 4) nota = 5.0;
      else if (puntos === 3) nota = 3.8;
      else if (puntos === 2) nota = 2.5;
      else if (puntos === 1) nota = 1.3;
      else nota = 0.0;
  
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 1 - Práctica 2", nota, codigo_funcion]
      );
  
      res.json({ mensaje: `Nota: ${nota}`, fallos, esperado });
  
    } catch (err) {
      next(err);
    }
  };




  exports.evaluarTUnaMuestra = async (req, res, next) => {
    try {
      const { codigo_estudiante, t_calc, t_crit_low, t_crit_high, resultado, codigo_funcion } = req.body;
  
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
      if (estudiante.length === 0) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }
  
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, "Ejercicio 2 - Práctica 2"]
      );
      if (intentos[0].num_intentos >= 2) {
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
      }
  
      const xbar = 27.5;
      const mu0 = 30;
      const s = 5;
      const n = 16;
  
      const calcPruebaT = (xbar, mu0, s, n, alpha = 0.05) => {
        const df = n - 1;
        const t_calc = (xbar - mu0) / (s / Math.sqrt(n));
        const t_crit_low = -2.1314;
        const t_crit_high = 2.1314;
        const resultado = t_calc < t_crit_low || t_calc > t_crit_high ? "Reject" : "Fail to Reject";
        return { t_calc, t_crit_low, t_crit_high, resultado };
      };
  
      const esperado = calcPruebaT(xbar, mu0, s, n);
  
      const tol = 0.01;
      let puntos = 0;
      let fallos = [];
  
      if (Math.abs(t_calc - esperado.t_calc) <= tol) puntos++; else fallos.push("t_calc");
      if (Math.abs(t_crit_low - esperado.t_crit_low) <= tol) puntos++; else fallos.push("t_crit_low");
      if (Math.abs(t_crit_high - esperado.t_crit_high) <= tol) puntos++; else fallos.push("t_crit_high");
      if (resultado === esperado.resultado) puntos++; else fallos.push("resultado");
  
      let nota;
      if (puntos === 4) nota = 5.0;
      else if (puntos === 3) nota = 3.8;
      else if (puntos === 2) nota = 2.5;
      else if (puntos === 1) nota = 1.3;
      else nota = 0.0;
  
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 2 - Práctica 2", nota, codigo_funcion]
      );
  
      res.json({ mensaje: `Nota: ${nota}`, fallos, esperado });
  
    } catch (err) {
      next(err);
    }
  };



  exports.ejer3_Prac2 = async (req, res, next) => {
    try {
      const { codigo_estudiante, t_calc, t_crit_low, t_crit_high, resultado, codigo_funcion } = req.body;
  
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
      if (estudiante.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
  
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, "Ejercicio 3 - Práctica 2"]
      );
      if (intentos[0].num_intentos >= 2) return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      const esperado = {
        t_calc: 2.926829,
        t_crit_low: -2.306004,
        t_crit_high: 2.306004,
        resultado: "Reject"
      };
  
      const tol = 0.04;
      let puntos = 0;
      let fallos = [];
  
      if (Math.abs(t_calc - esperado.t_calc) <= tol) puntos++; else fallos.push("t_calc");
      if (Math.abs(t_crit_low - esperado.t_crit_low) <= tol) puntos++; else fallos.push("t_crit_low");
      if (Math.abs(t_crit_high - esperado.t_crit_high) <= tol) puntos++; else fallos.push("t_crit_high");
      if (resultado === esperado.resultado) puntos++; else fallos.push("resultado");
  
      let nota;
      if (puntos === 4) nota = 5.0;
      else if (puntos === 3) nota = 3.8;
      else if (puntos === 2) nota = 2.5;
      else if (puntos === 1) nota = 1.2;
      else nota = 0.0;
  
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 3 - Práctica 2", nota, codigo_funcion]
      );
  
      res.json({ mensaje: `Nota: ${nota}`, fallos, esperado });
  
    } catch (err) {
      next(err);
    }
  };




  exports.ejer4_Prac2 = async (req, res, next) => {
    try {
      const { codigo_estudiante, t_calc, t_crit_low, t_crit_high, resultado, codigo_funcion } = req.body;
  
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
      if (estudiante.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
  
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, "Ejercicio 4 - Práctica 2"]
      );
      if (intentos[0].num_intentos >= 2) return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      const esperado = {
        t_calc: -0.3859,
        t_crit_low: -2.3646,
        t_crit_high: 2.3646,
        resultado: "Fail to Reject"
      };
  
      const tol = 0.02;
      let puntos = 0;
      let fallos = [];
  
      if (Math.abs(t_calc - esperado.t_calc) <= tol) puntos++; else fallos.push("t_calc");
      if (Math.abs(t_crit_low - esperado.t_crit_low) <= tol) puntos++; else fallos.push("t_crit_low");
      if (Math.abs(t_crit_high - esperado.t_crit_high) <= tol) puntos++; else fallos.push("t_crit_high");
      if (resultado === esperado.resultado) puntos++; else fallos.push("resultado");
  
      let nota;
      if (puntos === 4) nota = 5.0;
      else if (puntos === 3) nota = 3.8;
      else if (puntos === 2) nota = 2.5;
      else if (puntos === 1) nota = 1.2;
      else nota = 0.0;
  
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 4 - Práctica 2", nota, codigo_funcion]
      );
  
      res.json({ mensaje: `Nota: ${nota}`, fallos, esperado });
  
    } catch (err) {
      next(err);
    }
  };