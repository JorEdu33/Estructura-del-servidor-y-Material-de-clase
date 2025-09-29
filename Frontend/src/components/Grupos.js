// src/components/Grupos.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Grupos.css";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/grupos`);
        if (!res.ok) throw new Error("Error al cargar grupos");
        const data = await res.json();
        setGrupos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrupos();
  }, []);

  const handleGrupoClick = (grupo) => {
    navigate(`/semanas/${encodeURIComponent(grupo)}`);
  };

  if (loading) return <p className="loading">Cargando grupos...</p>;
  if (error) return <p className="error">❌ {error}</p>;

  return (
    <div className="grupos-container">
      <h2 className="grupos-title">Grupos disponibles</h2>
      {grupos.length === 0 ? (
        <p className="empty">No hay grupos registrados.</p>
      ) : (
        <div className="grupos-grid">
          {grupos.map((grupo, idx) => (
            <div
              key={idx}
              className="grupo-card"
              onClick={() => handleGrupoClick(grupo)}
            >
              <span className="grupo-icon">★</span>
              {grupo}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}