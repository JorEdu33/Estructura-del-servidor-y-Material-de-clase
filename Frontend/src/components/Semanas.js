// src/components/Semanas.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ← useParams para leer la URL
import "./Semanas.css";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function Semanas() {
  const { grupo } = useParams();              // ← grupo desde /semana/:grupo
  const [semanas, setSemanas] = useState([]);
  const [activeSemanas, setActiveSemanas] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/semanas/${encodeURIComponent(grupo)}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();   // ← objeto { semana: [registros] }

        // Agrupar por estudiante
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

  return (
    <div className="container">
      {semanas.length === 0 ? (
        <p className="empty">No hay datos disponibles</p>
      ) : (
        semanas.map((semana) => (
          <div key={semana.numero} className="semana-card">
            <button className="semana-header" onClick={() => toggleSemana(semana.numero)}>
              <span>
                Semana {semana.numero}
                <span className="badge">Semana actual</span>
              </span>
              <span>{activeSemanas[semana.numero] ? "▼" : "▶"}</span>
            </button>

            {activeSemanas[semana.numero] && (
              <div className="semana-content">
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