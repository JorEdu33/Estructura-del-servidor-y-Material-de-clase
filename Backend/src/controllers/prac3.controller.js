const pool = require('../config/db');

exports.ejer1_prac3_C1 = async (req, res, next) => {
    try {
      const {
        codigo_estudiante,
        codigo_funcion,
        ci_mean_95_low, ci_mean_95_high,
        ci_unilateral_99_low,
        edge_95_low, edge_95_high,
        pred_95_low, pred_95_high
      } = req.body;
  
      const [estudiante] = await pool.execute("SELECT * FROM estudiantes WHERE codigo_estudiante = ?", [codigo_estudiante]);
      if (estudiante.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
  
      const [intentos] = await pool.execute("SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", [codigo_estudiante, "Ejercicio 1 - Práctica 3 - C1"]);
      if (intentos[0].num_intentos >= 2) return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      const esperado = {
        ci_mean_95_low: 496.619844713797,
        ci_mean_95_high: 499.780155286203,
        ci_unilateral_99_low: 496.301903845102,
        edge_95_low: 13.8444380271877,
        edge_95_high: 36.3238822713192,
        pred_95_low: 488.719068282784,
        pred_95_high: 507.680931717216
      };
  
      const tol = 0.01;
      let puntos = 0;
      let fallos = [];
  
      function check(nombre) {
        if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++;
        else fallos.push(nombre);
      }
  
      ["ci_mean_95_low","ci_mean_95_high","ci_unilateral_99_low","edge_95_low","edge_95_high","pred_95_low","pred_95_high"].forEach(check);
  
      let nota;
      if (puntos === 7) nota = 5.0;
      else if (puntos === 6) nota = 4.2;
      else if (puntos === 5) nota = 3.5;
      else if (puntos === 4) nota = 2.8;
      else if (puntos === 3) nota = 2.1;
      else if (puntos === 2) nota = 1.4;
      else if (puntos === 1) nota = 0.7;
      else nota = 0.0;
  
      await pool.execute("INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 1 - Práctica 3 - C1", nota, codigo_funcion]);
  
      res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });
  
    } catch (err) { next(err); }
  };
  
  
  exports.ejer2_prac3_C1 = async (req, res, next) => {
    try {
      const {
        codigo_estudiante,
        codigo_funcion,
        ci_mean_95_low, ci_mean_95_high,
        ci_mean_99_low,
        ci_edge_95_low, ci_edge_95_high,
        tol_95_95_low, tol_95_95_high
      } = req.body;
  
      const [estudiante] = await pool.execute("SELECT * FROM estudiantes WHERE codigo_estudiante = ?", [codigo_estudiante]);
      if (estudiante.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
  
      const [intentos] = await pool.execute("SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", [codigo_estudiante, "Ejercicio 2 - Práctica 3 - C1"]);
      if (intentos[0].num_intentos >= 2) return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      const esperado = {
        ci_mean_95_low: 417.8838,
        ci_mean_95_high: 420.5162,
        ci_mean_99_low: 417.6107,
        ci_edge_95_low: 6.198545,
        ci_edge_95_high: 19.67559,
        tol_95_95_low: 410.811,
        tol_95_95_high: 427.589
      };
  
      const tol = 0.01;
      let puntos = 0;
      let fallos = [];
  
      function check(nombre) { if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++; else fallos.push(nombre); }
  
      ["ci_mean_95_low","ci_mean_95_high","ci_mean_99_low","ci_edge_95_low","ci_edge_95_high","tol_95_95_low","tol_95_95_high"].forEach(check);
  
      let nota;
      if (puntos === 7) nota = 5.0;
      else if (puntos === 6) nota = 4.2;
      else if (puntos === 5) nota = 3.5;
      else if (puntos === 4) nota = 2.8;
      else if (puntos === 3) nota = 2.1;
      else if (puntos === 2) nota = 1.4;
      else if (puntos === 1) nota = 0.7;
      else nota = 0.0;
  
      await pool.execute("INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 2 - Práctica 3 - C1", nota, codigo_funcion]);
  
      res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });
  
    } catch (err) { next(err); }
  };
  
  
  exports.ejer1_prac3_F3 = async (req, res, next) => {
    try {
      const { codigo_estudiante, codigo_funcion,
        IC95_low_sigma, IC95_high_sigma,
        LS99_sigma,
        IC95_low_t, IC95_high_t,
        tol95_90_low, tol95_90_high } = req.body;
  
      const [estudiante] = await pool.execute("SELECT * FROM estudiantes WHERE codigo_estudiante = ?", [codigo_estudiante]);
      if (estudiante.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
  
      const [intentos] = await pool.execute("SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", [codigo_estudiante, "Ejercicio 1 - Práctica 3 - F3"]);
      if (intentos[0].num_intentos >= 2) return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      const esperado = {
        IC95_low_sigma: 67.67383,
        IC95_high_sigma: 74.32617,
        LS99_sigma: 74.94794,
        IC95_low_t: 67.58964,
        IC95_high_t: 74.41036,
        tol95_90_low: 47.048,
        tol95_90_high: 94.952
      };
  
      const tol = 0.01;
      let puntos = 0;
      let fallos = [];
  
      function check(nombre) { if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++; else fallos.push(nombre); }
  
      ["IC95_low_sigma","IC95_high_sigma","LS99_sigma","IC95_low_t","IC95_high_t","tol95_90_low","tol95_90_high"].forEach(check);
  
      let nota;
      if (puntos === 7) nota = 5.0;
      else if (puntos === 6) nota = 4.2;
      else if (puntos === 5) nota = 3.5;
      else if (puntos === 4) nota = 2.8;
      else if (puntos === 3) nota = 2.1;
      else if (puntos === 2) nota = 1.4;
      else if (puntos === 1) nota = 0.7;
      else nota = 0.0;
  
      await pool.execute("INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 1 - Práctica 3 - F3", nota, codigo_funcion]);
  
      res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });
  
    } catch (err) { next(err); }
  };
  
  
  exports.ejer2_prac3_F3 = async (req, res, next) => {
    try {
      const {
        codigo_estudiante, codigo_funcion,
        t95,
        ci_mean_low, ci_mean_high,
        chi2_low, chi2_high,
        edge_low, edge_high,
        t99,
        pred_margin_99, pred_low, pred_high,
        tol_low, tol_high
      } = req.body;
  
      const [estudiante] = await pool.execute("SELECT * FROM estudiantes WHERE codigo_estudiante = ?", [codigo_estudiante]);
      if (estudiante.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
  
      const [intentos] = await pool.execute("SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", [codigo_estudiante, "Ejercicio 2 - Práctica 3 - F3"]);
      if (intentos[0].num_intentos >= 2) return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      const esperado = {
        t95: 2.093024,
        ci_mean_low: 63.03003,
        ci_mean_high: 65.76997,
        chi2_low: 8.906516,
        chi2_high: 32.85233,
        edge_low: 4.955509,
        edge_high: 18.27875,
        t99: 2.860935,
        pred_margin_99: 8.581298,
        pred_low: 55.8187,
        pred_high: 72.9813,
        tol_low: 57.6382,
        tol_high: 71.1618
      };
  
      const tol = 0.01;
      let puntos = 0;
      let fallos = [];
  
      function check(nombre) { if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++; else fallos.push(nombre); }
  
      ["t95","ci_mean_low","ci_mean_high","chi2_low","chi2_high","edge_low","edge_high","t99","pred_margin_99","pred_low","pred_high","tol_low","tol_high"].forEach(check);
  
      let nota = (puntos / 13) * 5;
  
      await pool.execute("INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 2 - Práctica 3 - F3", nota, codigo_funcion]);
  
      res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });
  
    } catch (err) { next(err); }
  };