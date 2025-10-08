# 📊 Ambiente de aprendizaje para la enseñanza de **Estadística II** Un enfoque en teoría, prácticas y autoevaluación

> Proyecto académico que integra teoría, ejercicios prácticos y actividades de autoevaluación automatizadas.

🔗 Repositorio

>Este proyecto está alojado en GitHub bajo:
>https://github.com/JorEdu33/Estructura-del-servidor-y-Material-de-clase.git
---
## 📥 Clonar el Repositorio
```env

git clone https://github.com/JorEdu33/Estructura-del-servidor-y-Material-de-clase.git
cd Estructura-del-servidor-y-Material-de-clase

```
---
## 🧠 Descripción General

Este proyecto implementa un **ambiente de aprendizaje digital** para apoyar la enseñanza de la asignatura **Estadística II**, combinando:

- 📚 **Material teórico** estructurado por semanas y temas.  
- 🧪 **Prácticas interactivas** desarrolladas en Google Colab o notebooks equivalentes.  
- 📝 **Autoevaluaciones automáticas** mediante validadores escritos en Python y R.  
- 🌐 Un dashboard donde el docente pude tener manejo de las notas de los estudiantes y revision de los intentos de los mismos.

Este entorno está desarrollado como un sistema de **microservicios y dockerizado**, que integra:
- Un **Backend Node.js** con Express.  
- Un **Frontend en React**.  
- Una **base de datos MySQL**.  
- Tunnilacion con **playit.gg**

---
## 🧰 Requisitos Previos

Asegúrate de contar con:

- [Docker](https://www.docker.com/) 🐳  
- [Docker Compose](https://docs.docker.com/compose/)  
- Conexión a Internet estable (para Playit y descarga de imágenes)  
- Variables de entorno configuradas en un archivo `.env` en la raíz del proyecto (ver sección siguiente)

---

## ⚙️ Configuración de Variables de Entorno

Crea un archivo llamado .env en la raíz del proyecto con el siguiente contenido de ejemplo:

```env
# Base de datos
MARIADB_USER=estadistica_user
MARIADB_PASSWORD=estadistica_pass
MARIADB_DATABASE=estadistica_db
TZ=America/Bogota

# Backend DB
DB_HOST=mariadb
DB_USER=estadistica_user
DB_PASSWORD=estadistica_pass
DB_NAME=estadistica_db

# Frontend
REACT_APP_API_BASE=(ip publica dada por playit en la cual esta exponiendo el Backend)

# Playit (túnel)
PLAYIT_SECRET_KEY=tu_clave_de_playit
```
### 📝 Obtención de la clave de Playit

1. Regístrate en [https://playit.gg/](https://playit.gg/) si aún no tienes una cuenta.  

2. Una vez dentro, genera un nuevo **agente**.  
   - Si estás usando Docker, el propio contenedor te mostrará la clave (`PLAYIT_SECRET_KEY`) que debes copiar y pegar en el archivo `.env`.  

3. En el **Dashboard** de Playit, crea un **túnel**:  
   - Se recomienda usar el protocolo **TCP+UDP**.  
   - En **Local Port**, especifica el puerto que deseas exponer públicamente.  
   - Por defecto, la configuración de Docker utiliza:  
     - `443` para el **Backend**  
     - `8080` para el **Frontend**
---

## 🚀 Despliegue con Docker Compose

Una vez hayas configurado tu .env, puedes levantar toda la infraestructura con:

```env
docker compose up -d
```
- El parámetro -d hace que los contenedores se inicien en modo desprendido (background).
- Para ver que todo esté corriendo correctamente:
```env
docker ps
```
- Para detener y remover los contenedores:
```env
docker compose down
```
⚠️ Verifica que no haya conflictos de puertos con servicios que ya estén activos (por ejemplo, si tu localhost ya usa el puerto 8080 o 443, puede haber errores).


## 📝 Autores

Jorge Eduardo Suárez Cortés

Daniel Alejandro Sánchez Rodríguez

Proyecto desarrollado como parte de la asignatura Práctica en Docencia para fortalecer la enseñanza de Estadística II.
