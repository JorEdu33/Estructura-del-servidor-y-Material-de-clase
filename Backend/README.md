# 📘 Documentación del Backend

## 🧩 Swagger UI

Al desplegar el proyecto con **Docker Compose**, el backend genera automáticamente una **documentación interactiva** de todos los endpoints disponibles mediante **Swagger UI**.  
Puedes acceder a ella desde cualquiera de las siguientes rutas:

```bash
http://localhost:3000/api-docs/#/
https://<ip_publica_playit>/api-docs/#/
```
---
## ⚙️ Configuración de CORS

En el archivo `src/app.js`, el middleware **CORS** está configurado para permitir solicitudes únicamente desde una dirección IP específica.
Esto garantiza que solo el **dashboard del frontend** pueda comunicarse con el backend.

Para ajustarlo, tienes dos opciones:

1. **Usar la IP generada por Playit** para el servicio del frontend.
2. **Definir una variable de entorno** en el archivo `.env` que contenga la IP autorizada.

Ejemplo en tu `.env`:

```env
FRONTEND_IP=<ip_proporcionada_por_playit>
```

