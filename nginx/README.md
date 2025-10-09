# 🌐 Configuración de Nginx con Certificado Autofirmado SAN

Este módulo configura **Nginx** como proxy inverso seguro (HTTPS) para el backend del proyecto, con un certificado **autofirmado SAN (Subject Alternative Name)** que permite usar una **IP pública** (por ejemplo, `147.185.221.25`) sin errores de validación SSL.

---

## 🧩 Descripción general

El archivo `nginx.conf` configura:

- Redirección automática de HTTP → HTTPS  
- Certificado SSL con soporte TLS 1.2 y 1.3  
- Proxy inverso hacia el contenedor del backend (`backend:3000`)  
- Limitación de solicitudes (rate limiting)  
- Cabeceras de seguridad recomendadas  
- Logs de acceso y errores  
- Compatibilidad HTTP/2  

---

## 🛡️ nginx.conf

El archivo `nginx.conf` define las políticas de seguridad y el proxy:

```nginx
events {}

http {
    # ---- Seguridad global ----
    server_tokens off;                   # Ocultar versión
    client_max_body_size 5M;             # Límite de payload
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    # ---- Rate limiting ----
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    # ---- Logs ----
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log warn;

    # ---- HTTP → HTTPS ----
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    # ---- HTTPS ----
    server {
        listen 443 ssl;
        http2 on;
        server_name _;

        ssl_certificate     /etc/nginx/certs/fullchain.pem;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # ---- Cabeceras seguras ----
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy no-referrer-when-downgrade;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # ---- Proxy hacia backend ----
        location / {
            limit_req zone=api_limit burst=20 nodelay;

            proxy_pass http://backend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
````

---

## 🔐 Creación del certificado autofirmado SAN

En entornos donde se usa una IP pública (por ejemplo, `147.185.221.25`) sin dominio, es necesario crear un certificado con soporte **Subject Alternative Name (SAN)**.

### 1️⃣ Crear el archivo `san.cnf`

Guarda el siguiente contenido en el mismo directorio del `nginx.conf`:

```bash
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
x509_extensions    = v3_req
distinguished_name = dn

[dn]
CN = 147.185.221.25

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = 147.185.221.25
```

### 2️⃣ Generar el certificado y la clave privada

Ejecuta los siguientes comandos en tu terminal (desde el mismo directorio):

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout privkey.pem \
  -out fullchain.pem \
  -config san.cnf
```

Esto generará:

* `privkey.pem` → Clave privada
* `fullchain.pem` → Certificado autofirmado con SAN

---

## 📁 Ubicación de los certificados

Copia ambos archivos a la carpeta que Nginx usa dentro del contenedor.
Si usas **Docker Compose**, puedes montar el volumen así:

```yaml
services:
  nginx:
    image: nginx:latest
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs
    depends_on:
      - backend
    networks:
      - app-network
```

Asegúrate de colocar los archivos generados (`privkey.pem` y `fullchain.pem`) dentro de la carpeta `certs/`.

---

## 🚀 Reiniciar el servicio Nginx

Aplica los cambios y reinicia el contenedor:

```bash
docker-compose restart nginx
```

---

## ✅ Verificación

Una vez en ejecución, el servicio estará disponible en:

🔒 **[https://147.185.221.25](https://147.185.221.25)**

> Es posible que el navegador muestre una advertencia (“Conexión no privada”) ya que el certificado no proviene de una autoridad certificadora reconocida.
> Esto es normal y totalmente seguro para entornos de prueba o desarrollo.

---

## 🧰 Comandos útiles

Verificar el contenido del certificado:

```bash
openssl x509 -in fullchain.pem -text -noout
```

Probar conexión SSL:

```bash
curl -vk https://147.185.221.25
```
