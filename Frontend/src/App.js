import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Grupos from "./components/Grupos";
import Semanas from "./components/Semanas";
import Estudiantes from "./components/DetalleEstudiante";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Grupos />} />
          <Route path="/Semanas/:grupo" element={<Semanas />} />
          <Route path="/estudiantes/:semana/:codigo" element={<Estudiantes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
