# 💻 Documentación del Frontend

## ⚙️ Configuración y Comunicación con el Backend

El servicio **Frontend** se construye y despliega automáticamente mediante **Docker Compose**.  
Durante el proceso, se le pasa como variable de entorno la **IP del backend** (proporcionada por *Playit*), con la cual se establecerá la comunicación entre ambos servicios.

### 🌐 Variable de Entorno

En el archivo `docker-compose.yml`, el frontend recibe la IP del backend a través de la siguiente variable:

```yaml
frontend:
  build:
    context: ./Frontend
  container_name: frontend
  ports:
    - "8080:80"
  environment:
    - REACT_APP_API_BASE=${REACT_APP_API_BASE}
  depends_on:
    - backend
  networks:
    - app-network

```
Asegúrate de definir la variable REACT_APP_API_BASE en tu archivo .env:


```env
REACT_APP_API_BASE=https://<ip_publica_playit_del_backend>
```

De esta manera, el frontend sabrá a qué dirección debe enviar las peticiones hacia el backend desplegado en Playit.
