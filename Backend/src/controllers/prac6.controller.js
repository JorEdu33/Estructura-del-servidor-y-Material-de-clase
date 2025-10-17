const pool = require('../config/db');

exports.ejer1_prac6_C1 = async (req, res, next) => {
  try {
    const {
      codigo_estudiante,
      estadistico_t,
      valor_critico_inferior,
      valor_critico_superior,
      decision,
      p_valor,
      limite_inferior_ic,
      limite_superior_ic,
      potencia,
      error_tipo_II,
      d,
      tamano_muestra_aprox,
      codigo_funcion
    } = req.body;

    // 1️⃣ Verificar si el estudiante existe
    const [estudiante] = await pool.execute(
      "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
      [codigo_estudiante]
    );

    if (estudiante.length === 0)
      return res.status(404).json({ error: "Estudiante no encontrado" });

    // 2️⃣ Verificar límite de intentos
    const [intentos] = await pool.execute(
      "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
      [codigo_estudiante, "Ejercicio 1 - Práctica 6 - C1"]
    );

    if (intentos[0].num_intentos >= 1)
      return res.status(403).json({ error: "Número máximo de intentos alcanzado" });

    // 3️⃣ Valores esperados del ejercicio
    const esperado = {
      estadistico_t: 2.5575488870470826,
      valor_critico_inferior: -2.10092204024096,
      valor_critico_superior: 2.10092204024096,
      decision: "Reject",
      p_valor: 0.01978488726347316,
      limite_inferior_ic: 1.856824,
      limite_superior_ic: 18.943176,
      potencia: 0.09999999999999998,
      error_tipo_II: 0.9,
      d: 0.27494486380847216,
      tamano_muestra_aprox: 51.0
    };

    const tol = 0.01; // tolerancia numérica
    let puntos = 0;
    let fallos = [];

    // 4️⃣ Función de comparación
    function check(nombre, isString = false) {
      if (isString) {
        if (req.body[nombre] === esperado[nombre]) puntos++;
        else fallos.push(nombre);
      } else {
        if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++;
        else fallos.push(nombre);
      }
    }

    // 5️⃣ Verificar cada resultado
    check("estadistico_t");
    check("valor_critico_inferior");
    check("valor_critico_superior");
    check("decision", true);
    check("p_valor");
    check("limite_inferior_ic");
    check("limite_superior_ic");
    check("potencia");
    check("error_tipo_II");
    check("d");
    check("tamano_muestra_aprox");

    // 6️⃣ Calcular nota proporcional (11 ítems → 5.0 máximo)
    let nota = parseFloat(((puntos / 11) * 5.0).toFixed(1));

    // 7️⃣ Guardar resultado
    await pool.execute(
      "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
      [codigo_estudiante, "Ejercicio 1 - Práctica 6 - C1", nota, codigo_funcion]
    );

    // 8️⃣ Responder al calificador
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



exports.ejer2_prac6_C1 = async (req, res, next) => {
    try {
      const {
        codigo_estudiante,
        estadistico_z,
        valor_critico_inferior,
        valor_critico_superior,
        decision,
        p_valor,
        limite_inferior_ic,
        limite_superior_ic,
        error_tipo_II,
        potencia,
        tamano_muestra_aprox,
        codigo_funcion
      } = req.body;
  
      // 1️⃣ Verificar si el estudiante existe
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
  
      if (estudiante.length === 0)
        return res.status(404).json({ error: "Estudiante no encontrado" });
  
      // 2️⃣ Verificar límite de intentos (solo un intento permitido)
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, "Ejercicio 2 - Práctica 6 - C1"]
      );
  
      if (intentos[0].num_intentos >= 1)
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      // 3️⃣ Valores esperados del ejercicio
      const esperado = {
        estadistico_z: 4.216370213557839,
        valor_critico_inferior: -1.9599639845400545,
        valor_critico_superior: 1.959963984540054,
        decision: "Reject",
        p_valor: 2.482660633873479e-05,
        limite_inferior_ic: 2.1406149030863153,
        limite_superior_ic: 5.859385096913685,
        error_tipo_II: 0.11462085923764874,
        potencia: 0.8853791407623512,
        tamano_muestra_aprox: 22.0
      };
  
      const tol = 0.01; // tolerancia numérica
      let puntos = 0;
      let fallos = [];
  
      // 4️⃣ Función para comparar valores
      function check(nombre, isString = false) {
        if (isString) {
          if (req.body[nombre] === esperado[nombre]) puntos++;
          else fallos.push(nombre);
        } else {
          if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++;
          else fallos.push(nombre);
        }
      }
  
      // 5️⃣ Verificar todos los campos
      check("estadistico_z");
      check("valor_critico_inferior");
      check("valor_critico_superior");
      check("decision", true);
      check("p_valor");
      check("limite_inferior_ic");
      check("limite_superior_ic");
      check("error_tipo_II");
      check("potencia");
      check("tamano_muestra_aprox");
  
      // 6️⃣ Calcular nota proporcional (10 ítems → 5.0 máximo)
      let nota = (puntos / 10) * 5.0;
      nota = Math.max(0, Math.min(5, parseFloat(nota.toFixed(1))));
  
      // 7️⃣ Guardar resultado en la BD
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 2 - Práctica 6 - C1", nota, codigo_funcion]
      );
  
      // 8️⃣ Responder al calificador
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



  exports.ejer1_prac6_F3 = async (req, res, next) => {
    try {
      const {
        codigo_estudiante,
        estadistico_z,
        valor_critico_inferior,
        valor_critico_superior,
        decision,
        p_valor,
        limite_inferior_ic,
        limite_superior_ic,
        error_tipo_II,
        potencia,
        tamano_muestra_aprox,
        codigo_funcion
      } = req.body;
  
      // 1️⃣ Verificar si el estudiante existe
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
  
      if (estudiante.length === 0)
        return res.status(404).json({ error: "Estudiante no encontrado" });
  
      // 2️⃣ Verificar límite de intentos (máximo 1 intento)
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, "Ejercicio 1 - Práctica 6 - F3"]
      );
  
      if (intentos[0].num_intentos >= 1)
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      // 3️⃣ Valores esperados del ejercicio
      const esperado = {
        estadistico_z: 5.365365653371402,
        valor_critico_inferior: -1.9599639845400545,
        valor_critico_superior: 1.959963984540054,
        decision: "Reject",
        p_valor: 8.078539215361502e-08,
        limite_inferior_ic: 1.0155212192679595,
        limite_superior_ic: 2.1844787807320416,
        error_tipo_II: 0.08175095837555224,
        potencia: 0.9182490416244478,
        tamano_muestra_aprox: 35.0
      };
  
      const tol = 0.01; // tolerancia numérica
      let puntos = 0;
      let fallos = [];
  
      // 4️⃣ Función para comparar valores con tolerancia
      function check(nombre, isString = false) {
        if (isString) {
          if (req.body[nombre] === esperado[nombre]) puntos++;
          else fallos.push(nombre);
        } else {
          if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++;
          else fallos.push(nombre);
        }
      }
  
      // 5️⃣ Comparar todos los ítems del payload
      check("estadistico_z");
      check("valor_critico_inferior");
      check("valor_critico_superior");
      check("decision", true);
      check("p_valor");
      check("limite_inferior_ic");
      check("limite_superior_ic");
      check("error_tipo_II");
      check("potencia");
      check("tamano_muestra_aprox");
  
      // 6️⃣ Calcular nota proporcional (10 ítems → 5.0 máximo)
      let nota = (puntos / 10) * 5.0;
      nota = Math.max(0, Math.min(5, parseFloat(nota.toFixed(1))));
  
      // 7️⃣ Guardar resultado en la BD
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, "Ejercicio 1 - Práctica 6 - F3", nota, codigo_funcion]
      );
  
      // 8️⃣ Responder al calificador
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
  


  exports.ejer2_prac6_F3 = async (req, res, next) => {
    try {
      const {
        codigo_estudiante,
        estadistico_t,
        valor_critico_inferior,
        valor_critico_superior,
        decision,
        p_valor,
        limite_inferior_ic,
        limite_superior_ic,
        potencia,
        error_tipo_II,
        d,
        tamano_muestra_aprox,
        codigo_funcion
      } = req.body;
  
      const nombre_ejercicio = "Ejercicio 2 - Práctica 6 - F3";
  
      // 1️⃣ Verificar si el estudiante existe
      const [estudiante] = await pool.execute(
        "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
        [codigo_estudiante]
      );
      if (estudiante.length === 0)
        return res.status(404).json({ error: "Estudiante no encontrado" });
  
      // 2️⃣ Verificar límite de intentos (solo 1 intento permitido)
      const [intentos] = await pool.execute(
        "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
        [codigo_estudiante, nombre_ejercicio]
      );
      if (intentos[0].num_intentos >= 1)
        return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
  
      // 3️⃣ Valores esperados del ejercicio
      const esperado = {
        estadistico_t: 2.0967955847287376,
        valor_critico_inferior: -2.048407141795244,
        valor_critico_superior: 2.048407141795244,
        decision: "Reject",
        p_valor: 0.04516805940481938,
        limite_inferior_ic: 0.039231,
        limite_superior_ic: 3.360769,
        potencia: 0.4,
        error_tipo_II: 0.6,
        d: 0.45037734911104504,
        tamano_muestra_aprox: 26.0
      };
  
      // 4️⃣ Tolerancia y contadores
      const tol = 0.01;
      let puntos = 0;
      let fallos = [];
  
      // 5️⃣ Función de verificación
      function check(nombre, isString = false) {
        if (isString) {
          if (req.body[nombre] === esperado[nombre]) puntos++;
          else fallos.push(nombre);
        } else {
          if (Math.abs(req.body[nombre] - esperado[nombre]) <= tol) puntos++;
          else fallos.push(nombre);
        }
      }
  
      // 6️⃣ Comparar campos
      check("estadistico_t");
      check("valor_critico_inferior");
      check("valor_critico_superior");
      check("decision", true);
      check("p_valor");
      check("limite_inferior_ic");
      check("limite_superior_ic");
      check("potencia");
      check("error_tipo_II");
      check("d");
      check("tamano_muestra_aprox");
  
      // 7️⃣ Calcular nota proporcional (escala de 0 a 5)
      const total = 11;
      let nota = parseFloat(((puntos / total) * 5).toFixed(1));
      nota = Math.max(0, Math.min(5, nota)); // asegura que esté entre 0 y 5
  
      // 8️⃣ Guardar resultado en la BD
      await pool.execute(
        "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota, codigo) VALUES (?, ?, ?, ?)",
        [codigo_estudiante, nombre_ejercicio, nota, codigo_funcion]
      );
  
      // 9️⃣ Enviar respuesta
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
  
