-- Crear tabla de estudiantes 
CREATE TABLE estudiantes ( 
    codigo_estudiante VARCHAR(20) PRIMARY KEY, 
    nombre_estudiante VARCHAR(100) NOT NULL,
    grupo VARCHAR(10) NOT NULL); 
    
-- Crear tabla de ejercicios 
CREATE TABLE ejercicios ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    codigo_estudiante VARCHAR(20), 
    nombre_ejercicio VARCHAR(100) NOT NULL, 
    nota DECIMAL(5,2) NOT NULL, 
    tiempo TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    codigo TEXT, 
    FOREIGN KEY (codigo_estudiante) REFERENCES estudiantes(codigo_estudiante) );
    
    
    
