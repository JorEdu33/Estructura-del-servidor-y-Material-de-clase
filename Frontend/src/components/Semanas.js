// src/components/Semanas.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Semanas.css";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function Semanas() {
  const { grupo } = useParams(); // ← grupo desde /semanas/:grupo
  const [semanas, setSemanas] = useState([]);
  const [activeSemanas, setActiveSemanas] = useState({});
  const [loadingSemana, setLoadingSemana] = useState(null); // 🔹 NUEVO
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/semanas/${encodeURIComponent(grupo)}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const semanasArray = Object.entries(data).map(([numero, registros]) => {
          const estudiantesMap = {};
          registros.forEach((r) => {
            const key = r.codigo_estudiante;
            if (!estudiantesMap[key]) {
              estudiantesMap[key] = {
                codigo_estudiante: r.codigo_estudiante,
                nombre_estudiante: r.nombre_estudiante,
                grupo: r.grupo,
                ejercicios: [],
              };
            }
            estudiantesMap[key].ejercicios.push({
              ejercicio: r.ejercicio,
              mejor_nota: r.mejor_nota,
            });
          });

          return {
            numero,
            estudiantes: Object.values(estudiantesMap),
          };
        });

        setSemanas(semanasArray);
      } catch (err) {
        console.error("Error cargando semanas:", err);
      }
    };

    if (grupo) fetchData();
  }, [grupo]);

  const toggleSemana = (numero) => {
    setActiveSemanas((prev) => ({ ...prev, [numero]: !prev[numero] }));
  };

  const calcularNotaFinal = (ejercicios) => {
    if (!ejercicios?.length) return "-";
    const total = ejercicios.reduce((acc, e) => acc + (parseFloat(e.mejor_nota) || 0), 0);
    return (total / ejercicios.length).toFixed(1);
  };

  const verDetalles = (semana, estudiante) => {
    navigate(`/estudiantes/${semana}/${estudiante.codigo_estudiante}`, {
      state: { estudiante, semana },
    });
  };

  // 🔹 NUEVA FUNCIÓN: invocar el endpoint /asignar-ceros
  const llenarNotas = async (semanaNumero) => {
    try {
      setLoadingSemana(semanaNumero);
      const response = await fetch("https://147.185.221.25:28151/api/asignar-ceros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semana: semanaNumero,
          grupo: grupo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const result = await response.json();
      alert(`Notas llenadas correctamente para la semana ${semanaNumero}`);
      console.log("Respuesta del servidor:", result);
    } catch (error) {
      console.error("Error llenando notas:", error);
      alert("Error al llenar las notas. Verifica el servidor o la conexión.");
    } finally {
      setLoadingSemana(null);
    }
  };

  return (
    <div className="container">
      {semanas.length === 0 ? (
        <p className="empty">No hay datos disponibles</p>
      ) : (
        semanas.map((semana) => (
          <div key={semana.numero} className="semana-card">
            <div className="semana-header" onClick={() => toggleSemana(semana.numero)}>
              <span>
                Semana {semana.numero}
                <span className="badge">Semana actual</span>
              </span>
              <span>{activeSemanas[semana.numero] ? "▼" : "▶"}</span>
            </div>

            {activeSemanas[semana.numero] && (
              <div className="semana-content">
                {/* 🔹 Botón Llenar notas */}
                <button
                  onClick={() => llenarNotas(semana.numero)}
                  disabled={loadingSemana === semana.numero}
                  style={{
                    background: "#1e3a8a",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    marginBottom: "15px",
                  }}
                >
                  {loadingSemana === semana.numero ? "Llenando..." : "Llenar notas"}
                </button>

                {semana.estudiantes.map((est) => (
                  <div key={est.codigo_estudiante} style={{ marginTop: "20px" }}>
                    <h4 className="item-title">
                      {est.nombre_estudiante} ({est.codigo_estudiante}) -{" "}
                      <span style={{ color: "#555" }}>Grupo: {est.grupo}</span>
                    </h4>

                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                      <thead>
                        <tr>
                          {est.ejercicios.map((e, i) => (
                            <th key={i} style={{ border: "1px solid #ddd", padding: "8px" }}>
                              {e.ejercicio}
                            </th>
                          ))}
                          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Nota final</th>
                          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {est.ejercicios.map((e, i) => (
                            <td key={i} style={{ border: "1px solid #ddd", padding: "8px" }}>
                              {e.mejor_nota}
                            </td>
                          ))}
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                              color: "#1e40af",
                            }}
                          >
                            {calcularNotaFinal(est.ejercicios)}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <button
                              onClick={() => verDetalles(semana.numero, est)}
                              style={{
                                background: "#166534",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 10px",
                                cursor: "pointer",
                              }}
                            >
                              Detalles
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
