const pool = require('../config/db');

exports.ejer1_prac5_C1 = async (req, res, next) => {
    try {
      const { 
        codigo_estudiante,
        a_d, a_estadistico_z, a_valor_critico, a_p_valor, a_decision,
        b_beta, b_power,
        c_diferencia_detectar, c_n_requerido,
        codigo_funcion 
      } = req.body;
  
      // 1. Verificar si el estudiante existe
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?", 
        [codigo_estudiante]
      );
      if (estudiante.length === 0) 
        return res.status(404).json({ error: "Estudiante no encontrado" });
  
      // 2. Verificar límite de intentos
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", 
        [codigo_estudiante, "Ejercicio 1 - Práctica 5 - C1"]
      );
      if (intentos[0].num_intentos >= 1) 
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      // 3. Valores esperados del ejercicio
      const esperado = {
        a_d: 0.5,
        a_estadistico_z: -0.9467292624062583,
        a_valor_critico: 1.959963984540054,
        a_p_valor: 0.3437767552983577,
        a_decision: "Fail to Reject",
        b_beta: 0.5093144323300305,
        b_power: 0.4906855676699695,
        c_diferencia_detectar: 0.75,
        c_n_requerido: 16.0
      };
  
      const tol = 0.01; // tolerancia numérica
      let puntos = 0;
      let fallos = [];
  
      // 4. Función de chequeo
      function check(nombre, isString = false) {
        if (isString) {
          if (req.body[nombre] === esperado[nombre]) puntos++;
          else fallos.push(nombre);
        } else {
          if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++;
          else fallos.push(nombre);
        }
      }
  
      // 5. Comparar resultados
      check("a_d");
      check("a_estadistico_z");
      check("a_valor_critico");
      check("a_p_valor");
      check("a_decision", true); // string
      check("b_beta");
      check("b_power");
      check("c_diferencia_detectar");
      check("c_n_requerido");
  
      // 6. Calcular nota según aciertos (9 ítems)
      let nota = 0.0;
      if (puntos === 9) nota = 5.0;
      else if (puntos === 8) nota = 4.5;
      else if (puntos === 7) nota = 4.0;
      else if (puntos === 6) nota = 3.5;
      else if (puntos === 5) nota = 3.0;
      else if (puntos === 4) nota = 2.0;
      else if (puntos === 3) nota = 1.5;
      else if (puntos === 2) nota = 1.0;
      else if (puntos === 1) nota = 0.5;
  
      // 7. Guardar resultado en la BD
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 1 - Práctica 5 - C1", nota, codigo_funcion]
      );
  
      // 8. Responder al calificador
      res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });
  
    } catch (err) {
      next(err);
    }
  };
  


  exports.ejer2_prac5_C1 = async (req, res, next) => {
    try {
      const { 
        codigo_estudiante,
        a_d, a_t0, a_valor_critico_t, a_decision,
        b_p_valor,
        c_beta, c_power,
        codigo_funcion 
      } = req.body;
  
      // 1. Verificar si el estudiante existe
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?", 
        [codigo_estudiante]
      );
      if (estudiante.length === 0) 
        return res.status(404).json({ error: "Estudiante no encontrado" });
  
      // 2. Verificar límite de intentos
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", 
        [codigo_estudiante, "Ejercicio 2 - Práctica 5 - C1"]
      );
      if (intentos[0].num_intentos >= 1) 
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      // 3. Valores esperados del ejercicio
      const esperado = {
        a_d: 0.20162691820284762,
        a_t0: 0.646473078455851,
        a_valor_critico_t: 2.4620213601503833,
        a_decision: "Fail to Reject",
        b_p_valor: 0.26152842417800537,
        c_beta: 0.9,
        c_power: 0.1
      };
  
      const tol = 0.01; // tolerancia numérica
      let puntos = 0;
      let fallos = [];
  
      // 4. Función de chequeo
      function check(nombre, isString = false) {
        if (isString) {
          if (req.body[nombre] === esperado[nombre]) puntos++;
          else fallos.push(nombre);
        } else {
          if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++;
          else fallos.push(nombre);
        }
      }
  
      // 5. Comparar resultados
      check("a_d");
      check("a_t0");
      check("a_valor_critico_t");
      check("a_decision", true); // string
      check("b_p_valor");
      check("c_beta");
      check("c_power");
  
      // 6. Calcular nota (7 ítems)
      const totalItems = 7;
      let nota = (puntos / totalItems) * 5.0; 
      nota = Math.round(nota * 10) / 10; // redondeo a 1 decimal
  
      // 7. Guardar en BD
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 2 - Práctica 5 - C1", nota, codigo_funcion]
      );
  
      // 8. Responder
      res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });
  
    } catch (err) {
      next(err);
    }
  };
  

   exports.ejer2_prac5_C1 = async (req, res, next) => {
    try {
      const { 
        codigo_estudiante,
        a_d, a_t0, a_valor_critico_t, a_decision,
        b_p_valor,
        c_beta, c_power,
        codigo_funcion 
      } = req.body;
  
      // 1. Verificar si el estudiante existe
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?", 
        [codigo_estudiante]
      );
      if (estudiante.length === 0) 
        return res.status(404).json({ error: "Estudiante no encontrado" });
  
      // 2. Verificar límite de intentos
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?", 
        [codigo_estudiante, "Ejercicio 2 - Práctica 5 - C1"]
      );
      if (intentos[0].num_intentos >= 1) 
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      // 3. Valores esperados del ejercicio
      const esperado = {
        a_d: 0.20162691820284762,
        a_t0: 0.646473078455851,
        a_valor_critico_t: 2.4620213601503833,
        a_decision: "Fail to Reject",
        b_p_valor: 0.26152842417800537,
        c_beta: 0.9,
        c_power: 0.1
      };
  
      const tol = 0.01; // tolerancia numérica
      let puntos = 0;
      let fallos = [];
  
      // 4. Función de chequeo
      function check(nombre, isString = false) {
        if (isString) {
          if (req.body[nombre] === esperado[nombre]) puntos++;
          else fallos.push(nombre);
        } else {
          if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++;
          else fallos.push(nombre);
        }
      }
  
      // 5. Comparar resultados
      check("a_d");
      check("a_t0");
      check("a_valor_critico_t");
      check("a_decision", true); // string
      check("b_p_valor");
      check("c_beta");
      check("c_power");
  
      // 6. Calcular nota (7 ítems)
      const totalItems = 7;
      let nota = (puntos / totalItems) * 5.0; 
      nota = Math.round(nota * 10) / 10; // redondeo a 1 decimal
  
      // 7. Guardar en BD
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 2 - Práctica 5 - C1", nota, codigo_funcion]
      );
  
      // 8. Responder
      res.json({ mensaje: `Nota: ${nota}`, aciertos: puntos, fallos, esperado });
  
    } catch (err) {
      next(err);
    }
  };



  exports.ejer3_prac5_C1 = async (req, res, next) => {
    try {
      const { 
        codigo_estudiante,
        a_lambda,
        a_chi2_0,
        a_chi2_critico,
        a_decision,
        a_p_valor,
        a_beta,
        a_power,
        codigo_funcion
      } = req.body;
  
      // 1. Validar estudiante
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
      if (estudiante.length === 0) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }
  
      // 2. Verificar intentos
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, "Ejercicio 3 - Práctica 5 - C1"]
      );
      if (intentos[0].num_intentos >= 1) {
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
      }
  
      // 3. Valores esperados
      const esperado = { 
        a_lambda: 0.8004434589800443,
        a_chi2_0: 18.580582199694202,
        a_chi2_critico: 14.256454576274688,
        a_decision: "Fail to Reject",
        a_p_valor: 0.06842906100911392,
        a_beta: 0.8,
        a_power: 0.2 // (redondeado de 0.19999999999999996)
      };
  
      const tol = 0.01;
      let puntos = 0; 
      let fallos = [];
  
      // Función de chequeo para numéricos
      function checkNum(nombre) {
        if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++;
        else fallos.push(nombre);
      }
  
      // Función de chequeo para strings
      function checkStr(nombre) {
        if (req.body[nombre] === esperado[nombre]) puntos++;
        else fallos.push(nombre);
      }
  
      // 4. Verificar cada ítem
      checkNum("a_lambda");
      checkNum("a_chi2_0");
      checkNum("a_chi2_critico");
      checkStr("a_decision");
      checkNum("a_p_valor");
      checkNum("a_beta");
      checkNum("a_power");
  
      // 5. Calcular nota
      let nota;
      if (puntos === 7) nota = 5.0;
      else if (puntos === 6) nota = 4.2;
      else if (puntos === 5) nota = 3.5;
      else if (puntos === 4) nota = 2.8;
      else if (puntos === 3) nota = 2.1;
      else if (puntos === 2) nota = 1.4;
      else if (puntos === 1) nota = 0.7;
      else nota = 0.0;
  
      // 6. Guardar resultado en BD
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 3 - Práctica 5 - C1", nota, codigo_funcion]
      );
  
      // 7. Responder al cliente
      res.json({ 
        mensaje: `Nota: ${nota}`, 
        aciertos: puntos, 
        fallos, 
        esperado 
      });
  
    } catch (err) {
      next(err);
    }
  };
  
  exports.ejer1_prac5_F3 = async (req, res, next) => {
    try {
      const {
        codigo_estudiante,
        a_d,
        a_estadistico_z,
        a_valor_critico,
        a_p_valor,
        a_decision,
        b_beta,
        b_power,
        c_diferencia_detectar,
        c_n_requerido,
        codigo_funcion
      } = req.body;
  
      // 1. Validar estudiante
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
      if (estudiante.length === 0) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }
  
      // 2. Verificar intentos (máx. 2)
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, "Ejercicio 1 - Práctica 5 - F3"]
      );
      if (intentos[0].num_intentos >= 1) {
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
      }
  
      // 3. Valores esperados
      const esperado = {
        a_d: 0.5000000000000004,
        a_estadistico_z: -4.772970773009188,
        a_valor_critico: 1.959963984540054,
        a_p_valor: 1.8152814273975082e-06,
        a_decision: "Reject",
        b_beta: 0.057562456812491294,
        b_power: 0.9424375431875087,
        c_diferencia_detectar: 0.20000000000000018,
        c_n_requerido: 32.0
      };
      
  
      const tol = 0.01; // tolerancia para valores numéricos
      let puntos = 0;
      let fallos = [];
  
      // Chequeo para numéricos
      function checkNum(nombre) {
        if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) {
          puntos++;
        } else {
          fallos.push(nombre);
        }
      }
  
      // Chequeo para strings
      function checkStr(nombre) {
        if (req.body[nombre] === esperado[nombre]) {
          puntos++;
        } else {
          fallos.push(nombre);
        }
      }
  
      // 4. Validar respuestas
      checkNum("a_d");
      checkNum("a_estadistico_z");
      checkNum("a_valor_critico");
      checkNum("a_p_valor");
      checkStr("a_decision");
      checkNum("b_beta");
      checkNum("b_power");
      checkNum("c_diferencia_detectar");
      checkNum("c_n_requerido");
  
      // 5. Calcular nota
      let nota;
      if (puntos === 9) nota = 5.0;
      else if (puntos === 8) nota = 4.4;
      else if (puntos === 7) nota = 3.8;
      else if (puntos === 6) nota = 3.3;
      else if (puntos === 5) nota = 2.7;
      else if (puntos === 4) nota = 2.2;
      else if (puntos === 3) nota = 1.6;
      else if (puntos === 2) nota = 1.0;
      else if (puntos === 1) nota = 0.5;
      else nota = 0.0;
  
      // 6. Guardar en la base de datos
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 1 - Práctica 5 - F3", nota, codigo_funcion]
      );
  
      // 7. Responder al cliente
      res.json({
        mensaje: `Nota: ${nota}`,
        aciertos: puntos,
        fallos,
        esperado
      });
  
    } catch (err) {
      next(err);
    }
  };
  

  exports.ejer2_prac5_F3 = async (req, res, next) => {
    try {
      const {
        codigo_estudiante,
        a_d,
        a_t0,
        a_valor_critico_t,
        a_decision,
        b_p_valor,
        c_beta,
        c_power,
        codigo_funcion
      } = req.body;
  
      // 1. Validar estudiante
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
      if (estudiante.length === 0) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }
  
      // 2. Verificar intentos (máx. 2)
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, "Ejercicio 2 - Práctica 5 - F3"]
      );
      if (intentos[0].num_intentos >= 1) {
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
      }
  
      // 3. Valores esperados (los defines según el ejercicio en tu BD o lógica)
      const esperado = {
        a_d: 0.20101663943666206,
        a_t0: -3.7923797593928454,
        a_valor_critico_t: 2.4620213601503833,
        a_decision: "Fail to Reject",
        b_p_valor: 0.9996495654636345,
        c_beta: 0.9,
        c_power: 0.1
      };
  
      const tol = 0.01; // tolerancia para numéricos
      let puntos = 0;
      let fallos = [];
  
      // Chequeo numérico
      function checkNum(nombre) {
        if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) {
          puntos++;
        } else {
          fallos.push(nombre);
        }
      }
  
      // Chequeo string
      function checkStr(nombre) {
        if (req.body[nombre] === esperado[nombre]) {
          puntos++;
        } else {
          fallos.push(nombre);
        }
      }
  
      // 4. Validar cada campo
      checkNum("a_d");
      checkNum("a_t0");
      checkNum("a_valor_critico_t");
      checkStr("a_decision");
      checkNum("b_p_valor");
      checkNum("c_beta");
      checkNum("c_power");
  
      // 5. Calcular nota (7 ítems)
      let nota;
      if (puntos === 7) nota = 5.0;
      else if (puntos === 6) nota = 4.2;
      else if (puntos === 5) nota = 3.5;
      else if (puntos === 4) nota = 2.8;
      else if (puntos === 3) nota = 2.1;
      else if (puntos === 2) nota = 1.4;
      else if (puntos === 1) nota = 0.7;
      else nota = 0.0;
  
      // 6. Guardar en BD
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 2 - Práctica 5 - F3", nota, codigo_funcion]
      );
  
      // 7. Responder al cliente
      res.json({
        mensaje: `Nota: ${nota}`,
        aciertos: puntos,
        fallos,
        esperado
      });
  
    } catch (err) {
      next(err);
    }
  };
  
  exports.ejer3_prac5_F3 = async (req, res, next) => {
    try {
      const {
        codigo_estudiante,
        a_lambda,
        a_chi2_0,
        a_chi2_critico,
        a_decision,
        a_p_valor,
        a_beta,
        a_power,
        codigo_funcion
      } = req.body;
  
      // 1. Verificar que el estudiante exista
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
      if (estudiante.length === 0) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }
  
      // 2. Verificar número de intentos
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, "Ejercicio 3 - Práctica 5 - F3"]
      );
      if (intentos[0].num_intentos >= 1) {
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
      }
  
      // 3. Valores esperados
      const esperado = {
        a_lambda: 1.5007244627324092,
        a_chi2_0: 20.269565217391303,
        a_chi2_critico: 16.918977604620448,
        a_decision: "Reject",
        a_p_valor: 0.01631977426800868,
        a_beta: 0.4,
        a_power: 0.6
      };
  
      const tol = 0.001; // tolerancia para los valores numéricos
      let puntos = 0;
      let fallos = [];
  
      // 4. Verificar cada campo
      function check(nombre, isString = false) {
        if (isString) {
          if (req.body[nombre] === esperado[nombre]) puntos++;
          else fallos.push(nombre);
        } else {
          if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++;
          else fallos.push(nombre);
        }
      }
  
      check("a_lambda");
      check("a_chi2_0");
      check("a_chi2_critico");
      check("a_decision", true); // texto, no numérico
      check("a_p_valor");
      check("a_beta");
      check("a_power");
  
      // 5. Calcular nota
      let nota;
      if (puntos === 7) nota = 5.0;
      else if (puntos === 6) nota = 4.2;
      else if (puntos === 5) nota = 3.5;
      else if (puntos === 4) nota = 2.8;
      else if (puntos === 3) nota = 2.1;
      else if (puntos === 2) nota = 1.4;
      else if (puntos === 1) nota = 0.7;
      else nota = 0.0;
  
      // 6. Guardar resultado en la base de datos
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 3 - Práctica 5 - F3", nota, codigo_funcion]
      );
  
      // 7. Responder al cliente
      res.json({
        mensaje: `Nota: ${nota}`,
        aciertos: puntos,
        fallos,
        esperado
      });
  
    } catch (err) {
      next(err);
    }
  };
  