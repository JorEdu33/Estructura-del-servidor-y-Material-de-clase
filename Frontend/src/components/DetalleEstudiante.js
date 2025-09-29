import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./DetalleEstudiantes.css";
const API_BASE = process.env.REACT_APP_API_BASE;

const Detalle = () => {
  const { semana, codigo } = useParams();
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/detalle/${semana}/${codigo}`
        );
        setEjercicios(res.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [semana, codigo]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este intento?")) return;

    try {
      await axios.delete(`${API_BASE}/api/detalle/${id}`);
      // 🔹 actualizar estado sin el eliminado
      setEjercicios((prev) => prev.filter((ej) => ej.id !== id));
    } catch (err) {
      console.error("Error eliminando intento:", err);
      alert("No se pudo eliminar el intento.");
    }
  };

  if (loading) return <p className="loading">Cargando...</p>;

  return (
    <div className="detalle-container">
      <h2 className="detalle-title">
        Ejercicios semana {semana} - Estudiante {codigo}
      </h2>

      {ejercicios.length === 0 ? (
        <p className="empty">No hay ejercicios registrados esta semana.</p>
      ) : (
        <div className="table-wrapper">
          <table className="detalle-table">
            <thead>
              <tr>
                <th>Ejercicio</th>
                <th>Nota</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Código</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ejercicios.map((ej) => (
                <tr key={ej.id}>
                  <td>{ej.nombre_ejercicio}</td>
                  <td>{ej.nota}</td>
                  <td>{ej.fecha}</td>
                  <td>{ej.hora}</td>
                  <td className="codigo-cell">
                    <pre>{ej.codigo}</pre>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(ej.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Detalle;
