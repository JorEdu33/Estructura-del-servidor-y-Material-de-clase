const pool = require('../config/db');

exports.evaluarEstadisticos = async (req, res, next) => {
    try {
        const { codigo_estudiante, todas, no_sembradas, sembradas } = req.body;
  
        const [estudiante] = await pool.execute(
            "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
            [codigo_estudiante]
        );
        if (estudiante.length === 0) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }
  
        const [intentos] = await pool.execute(
            "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
            [codigo_estudiante, "Ejercicio 1 - Práctica 1"]
        );
        if (intentos[0].num_intentos >= 2) {
            return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
        }
  
        const datosNoSembradas = [81.2,26.1,95.0,41.1,28.6,21.7,11.5,68.5,345.5,321.2,1202.6,1.0,4.9,163.0,372.4,244.3,47.3,87.0,26.3,24.4,830.1,4.9,36.6,147.8,17.3,29.0];
        const datosSembradas = [274.7,302.8,242.5,255.0,17.5,115.3,31.4,703.4,334.1,1697.8,118.3,198.6,129.6,274.7,119.0,1656.0,7.7,430.0,40.6,92.4,200.7,32.7,4.1,978.0,489.1,2745.6];
        const datosTodas = [...datosNoSembradas, ...datosSembradas];
  
        const calcEstadisticos = (arr) => {
            const media = arr.reduce((a, b) => a + b, 0) / arr.length;
            const varianza = arr.reduce((a, b) => a + Math.pow(b - media, 2), 0) / (arr.length - 1);
            const desviacion = Math.sqrt(varianza);
            const rango = Math.max(...arr) - Math.min(...arr);
            return { media, desviacion_estandar: desviacion, rango };
        };
  
        const esperado = {
            todas: calcEstadisticos(datosTodas),
            no_sembradas: calcEstadisticos(datosNoSembradas),
            sembradas: calcEstadisticos(datosSembradas)
        };
  
        const tol = 0.01;
        const comparar = (actual, esperado) => {
            return (
                Math.abs(actual.media - esperado.media) <= tol &&
                Math.abs(actual.desviacion_estandar - esperado.desviacion_estandar) <= tol &&
                Math.abs(actual.rango - esperado.rango) <= tol
            );
        };
  
        let puntos = 0;
        let fallos = [];
  
        if (comparar(todas, esperado.todas)) puntos++;
        else fallos.push("todas");
  
        if (comparar(no_sembradas, esperado.no_sembradas)) puntos++;
        else fallos.push("no_sembradas");
  
        if (comparar(sembradas, esperado.sembradas)) puntos++;
        else fallos.push("sembradas");
  
        let nota;
        if (puntos === 3) nota = 5.0;
        else if (puntos === 2) nota = 3.5;
        else if (puntos === 1) nota = 2.0;
        else nota = 0.0;
  
        await pool.execute(
            "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota) VALUES (?, ?, ?)",
            [codigo_estudiante, "Ejercicio 1 - Práctica 1", nota]
        );
  
        res.json({ 
            mensaje: `Nota: ${nota}`,
            fallos
        });
  
    } catch (err) {
        next(err);
    }
  };
  


  exports.evaluarCiclos = async (req, res, next) => {
    try {
        const { codigo_estudiante, mediana, cuartiles, proporcion_sobre_2000 } = req.body;
  
        const [estudiante] = await pool.execute(
            "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
            [codigo_estudiante]
        );
        if (estudiante.length === 0) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }
  
        const [intentos] = await pool.execute(
            "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
            [codigo_estudiante, "Ejercicio 2 - Práctica 1"]
        );
        if (intentos[0].num_intentos >= 2) {
            return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
        }
  
        const ciclos = [1115, 865, 1015, 885, 1594, 1000, 1416, 1501, 1310, 2130, 845, 1223,
                        2023, 1820, 1560, 1238, 1540, 1421, 1674, 375, 1315, 1940, 1055, 990,
                        1502, 1109, 1016, 2265, 1269, 1120, 1764, 1468, 1258, 1481, 1102, 1910,
                        1260, 910, 1330, 1512, 1315, 1567, 1605, 1018, 1888, 1730, 1608, 1750,
                        1085, 1883, 706, 1452, 1782, 1102, 1535, 1642, 798, 1203, 2215, 1890,
                        1522, 1578, 1781, 1020, 1270, 785, 2100, 1792, 758, 1750];
  
        const calcularMediana = (arr) => {
            const sorted = [...arr].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        };
  
        const quantile = (arr, p) => {
            const sorted = [...arr].sort((a, b) => a - b);
            const n = sorted.length;
            const h = (n - 1) * p + 1;
            const hf = Math.floor(h) - 1;
            const fraction = h - Math.floor(h);
            if (hf + 1 < n) {
                return sorted[hf] + fraction * (sorted[hf + 1] - sorted[hf]);
            } else {
                return sorted[hf];
            }
        };
  
        const calcularCuartiles = (arr) => ({
            Q1: quantile(arr, 0.25),
            Q2: quantile(arr, 0.50),
            Q3: quantile(arr, 0.75)
        });
  
        const calcularProporcionSobre2000 = (arr) => {
            const count = arr.filter(x => x > 2000).length;
            return (count / arr.length) * 100;
        };
  
        const esperado = {
            mediana: calcularMediana(ciclos),
            cuartiles: calcularCuartiles(ciclos),
            proporcion_sobre_2000: calcularProporcionSobre2000(ciclos)
        };
  
        const tol = 0.5;
        let fallos = [];
  
        if (Math.abs(mediana - esperado.mediana) > tol) fallos.push("mediana");
  
        if (Math.abs(cuartiles.Q1 - esperado.cuartiles.Q1) > tol ||
            Math.abs(cuartiles.Q2 - esperado.cuartiles.Q2) > tol ||
            Math.abs(cuartiles.Q3 - esperado.cuartiles.Q3) > tol) fallos.push("cuartiles");
  
        if (Math.abs(proporcion_sobre_2000 - esperado.proporcion_sobre_2000) > tol) fallos.push("proporcion_sobre_2000");
  
        let puntos = 3 - fallos.length;
        let nota;
        if (puntos === 3) nota = 5.0;
        else if (puntos === 2) nota = 3.5;
        else if (puntos === 1) nota = 2.0;
        else nota = 0.0;
  
        await pool.execute(
            "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota) VALUES (?, ?, ?)",
            [codigo_estudiante, "Ejercicio 2 - Práctica 1", nota]
        );
  
        res.json({ mensaje: `Nota: ${nota}`, fallos });
  
    } catch (err) {
        next(err);
    }
  };


  exports.evaluarExpresion = async (req, res, next) => {
    try {
        const { codigo_estudiante, stats } = req.body;
  
        const [estudiante] = await pool.execute(
            "SELECT * FROM estudiantes WHERE codigo_estudiante = ?",
            [codigo_estudiante]
        );
        if (estudiante.length === 0) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }
  
        const [intentos] = await pool.execute(
            "SELECT COUNT(*) AS num_intentos FROM ejercicios WHERE codigo_estudiante = ? AND nombre_ejercicio = ?",
            [codigo_estudiante, "Ejercicio 3 - Práctica 1"]
        );
        if (intentos[0].num_intentos >= 2) {
            return res.status(403).json({ error: "Número máximo de intentos alcanzado" });
        }
  
        const grupos = {
            "Alta.Dosis": [16.1, 134.9, 52.7, 14.4, 124.3, 99.0, 24.3, 16.3, 15.2, 47.7,
                           12.9, 72.7, 126.7, 46.4, 60.3, 23.5, 43.6, 79.4, 38.0, 58.2, 26.5],
            "Control.1": [297.1, 491.8, 1332.9, 1172.0, 1482.7, 335.4, 528.9, 24.1, 545.2,
                          92.9, 337.1, 102.3, 255.1, 100.5, 159.9, 168.0, 95.2, 132.5, 442.6,
                          15.8, 175.6],
            "Control.2": [25.1, 820.1, 82.5, 713.9, 785.6, 114.0, 31.9, 86.3, 646.6, 169.9,
                          20.2, 280.2, 194.2, 408.4, 155.5, 864.6, 355.4, 634.0, 2029.9,
                          362.1, 0],
            "Control.3": [131.1, 166.5, 2258.4, 497.5, 263.4, 252.3, 351.4, 678.9, 3010.2,
                          67.1, 318.2, 2476.4, 181.4, 2081.5, 424.3, 188.1, 563.0, 149.1,
                          2122.9, 1295.9, 0]
        };
  
        const desviacion_estandar = arr => {
            const m = arr.reduce((a,b)=>a+b,0)/arr.length;
            const sqDiff = arr.map(x=>Math.pow(x-m,2));
            return Math.sqrt(sqDiff.reduce((a,b)=>a+b,0)/(arr.length-1));
        };
        const varianza = arr => Math.pow(desviacion_estandar(arr),2);
        const rango = arr => Math.max(...arr) - Math.min(...arr);
  
        let esperado = {};
        for (let g in grupos) {
            esperado[g] = {
                desviacion_estandar: desviacion_estandar(grupos[g]),
                varianza: varianza(grupos[g]),
                rango: rango(grupos[g])
            };
        }
  
        const tol = 0.01;
        let fallos = [];
        for (let g in esperado) {
            for (let key of ["desviacion_estandar", "varianza", "rango"]) {
                if (!stats[g] || Math.abs(stats[g][key] - esperado[g][key]) > tol) {
                    fallos.push(`${g} -> ${key}`);
                }
            }
        }
  
        let nota;
        if (fallos.length === 0) nota = 5.0;
        else if (fallos.length <= 3) nota = 3.5;
        else if (fallos.length <= 6) nota = 2.0;
        else nota = 0.0;
  
        await pool.execute(
            "INSERT INTO ejercicios (codigo_estudiante, nombre_ejercicio, nota) VALUES (?, ?, ?)",
            [codigo_estudiante, "Ejercicio 3 - Práctica 1", nota]
        );
  
        res.json({ mensaje: `Nota: ${nota}`, fallos });
  
    } catch (err) {
        next(err);
    }
  };