# Deployment Guide - Urgara Jornales API

Guía de implementación para desplegar la API en un servidor Ubuntu EC2.

## Requisitos Previos

- Instancia EC2 Ubuntu (Ubuntu 20.04 o superior)
- Acceso SSH a la instancia
- Security Group configurado con puertos necesarios abiertos

## 1. Instalación de Nginx

### 1.1. Instalar Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 1.2. Iniciar y habilitar Nginx

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 1.3. Verificar instalación

```bash
curl http://localhost
```

Deberías ver la página de bienvenida de Nginx.

### 1.4. Configuración de Firewall

**IMPORTANTE:** En EC2, el firewall se gestiona a través de **Security Groups** de AWS, por lo que **NO es necesario activar UFW**.

El Security Group de tu instancia debe tener los siguientes puertos abiertos:
- **Puerto 22** (SSH) - Para acceso remoto
- **Puerto 80** (HTTP) - Para tráfico web
- **Puerto 443** (HTTPS) - Para tráfico web seguro

UFW permanece **inactivo** y esto es correcto para entornos EC2.

### 1.5. Archivos importantes de Nginx

- Configuración principal: `/etc/nginx/nginx.conf`
- Sites disponibles: `/etc/nginx/sites-available/`
- Sites activos: `/etc/nginx/sites-enabled/`
- Logs de acceso: `/var/log/nginx/access.log`
- Logs de error: `/var/log/nginx/error.log`

---

## 2. Configuración de Nginx como Reverse Proxy

### 2.1. Crear configuración del sitio

Crear el archivo de configuración para el dominio:

```bash
sudo nano /etc/nginx/sites-available/api-jornales
```

Agregar la siguiente configuración:

```nginx
server {
    listen 80;
    server_name api-jornales.urgara.org.ar;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2.2. Habilitar el sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/api-jornales /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### 2.3. Verificar DNS

Antes de continuar, asegúrate de que el dominio `api-jornales.urgara.org.ar` apunte a la IP pública de tu instancia EC2.

```bash
# Verificar resolución DNS
nslookup api-jornales.urgara.org.ar
```

---

## 3. Instalación de SSL con Certbot

### 3.1. Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 3.2. Obtener certificado SSL

```bash
sudo certbot --nginx -d api-jornales.urgara.org.ar
```

Certbot te pedirá:
1. Email para notificaciones de renovación
2. Aceptar términos de servicio
3. Opcionalmente compartir tu email con EFF
4. Elegir si redirigir HTTP a HTTPS (selecciona opción 2 para redirigir)

### 3.3. Verificar renovación automática

Certbot instala un timer que renueva automáticamente los certificados:

```bash
# Ver estado del timer
sudo systemctl status certbot.timer

# Probar renovación (dry-run)
sudo certbot renew --dry-run
```

### 3.4. Configuración final

Después de ejecutar Certbot, la configuración en `/etc/nginx/sites-available/api-jornales` se actualizará automáticamente con:
- Bloque server para puerto 443 (HTTPS)
- Redirección de puerto 80 a 443
- Rutas a certificados SSL

```bash
# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### 3.5. Verificar HTTPS

```bash
curl https://api-jornales.urgara.org.ar
```

**Nota:** Es normal recibir un error 502 Bad Gateway si aún no hay ninguna aplicación corriendo en el puerto 9000. El SSL está funcionando correctamente.

---

## 4. Instalación de Docker

### 4.1. Desinstalar versiones antiguas (si existen)

```bash
sudo apt remove docker docker-engine docker.io containerd runc
```

### 4.2. Instalar dependencias

```bash
sudo apt update
sudo apt install ca-certificates curl gnupg lsb-release -y
```

### 4.3. Agregar clave GPG oficial de Docker

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

### 4.4. Configurar el repositorio de Docker

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 4.5. Instalar Docker Engine

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

### 4.6. Verificar instalación

```bash
sudo docker --version
sudo docker compose version
```

### 4.7. Agregar usuario al grupo docker (opcional)

Esto permite ejecutar Docker sin `sudo`:

```bash
sudo usermod -aG docker $USER
```

**Importante:** Después de ejecutar este comando, cierra sesión y vuelve a conectarte por SSH para que los cambios tengan efecto.

### 4.8. Verificar que Docker funciona

```bash
# Si agregaste tu usuario al grupo docker, reconecta y ejecuta:
docker run hello-world

# Si no, usa sudo:
sudo docker run hello-world
```

Deberías ver el mensaje de bienvenida de Docker.

---

## 5. Configuración de GitHub Container Registry (GHCR)

### 5.1. Crear Personal Access Token en GitHub

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Nombre: `GHCR Access for EC2`
4. Permisos necesarios:
   - ✅ `write:packages` (incluye automáticamente `read:packages`)
   - ✅ `read:packages`
   - ✅ `repo` (solo si el repositorio es privado)
5. Click en "Generate token"
6. **Copia el token** (solo se muestra una vez)

### 5.2. Configurar secret en el repositorio (para GitHub Actions)

1. Ve a tu repositorio → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GHCR_TOKEN`
4. Value: Pega el Personal Access Token que generaste
5. Click "Add secret"

### 5.3. Autenticar Docker en el servidor EC2

En tu instancia EC2, ejecuta:

```bash
# Autenticarte en GitHub Container Registry
echo "TU_TOKEN_AQUI" | docker login ghcr.io -u DynnamoCrypt --password-stdin
```

Deberías ver: `Login Succeeded`

### 5.4. Verificar acceso a la imagen

```bash
# Descargar la imagen
docker pull ghcr.io/dynnamocrypt/urgara-jornales-api:latest
```

---

## 6. Configuración de Variables de Entorno

### 6.1. Crear directorio para la aplicación

```bash
mkdir -p ~/urgara-jornales-api
cd ~/urgara-jornales-api
```

### 6.2. Crear archivo .env

```bash
nano .env
```

Agregar las siguientes variables (ajusta los valores según tu configuración):

```env
# General
NODE_ENV=production
PORT=9000

# Database URLs (Amazon RDS)
DATABASE_COMMON_URL=postgresql://usuario:password@rds-endpoint:5432/urgara_common
DATABASE_LOCALITY_URL=postgresql://usuario:password@rds-endpoint:5432/urgara_locality

# CORS
CORS_ORIGIN=https://app.urgara.org.ar

# Security
COOKIE_SECRET=tu-cookie-secret-aqui
JWT_SECRET_CLIENT=tu-jwt-secret-client-aqui
JWT_SECRET_REFRESH=tu-jwt-refresh-secret-aqui
```

**IMPORTANTE:** Genera secrets seguros para producción:

```bash
# Generar secrets aleatorios
openssl rand -base64 32
```

### 6.3. Copiar docker-compose.prod.yml

Descarga o crea el archivo `docker-compose.prod.yml` en el directorio:

```bash
nano docker-compose.prod.yml
```

Copia el contenido del archivo `docker-compose.prod.yml` del repositorio.

---

## 7. Desplegar la Aplicación

### 7.1. Iniciar la aplicación con Docker Compose

```bash
cd ~/urgara-jornales-api
docker compose -f docker-compose.prod.yml up -d
```

### 7.2. Verificar que el contenedor está corriendo

```bash
docker ps
docker logs urgara-jornales-api
```

### 7.3. Verificar que la API responde

```bash
# Verificar en localhost
curl http://localhost:9000

# Verificar desde el dominio
curl https://api-jornales.urgara.org.ar
```

### 7.4. Comandos útiles

```bash
# Ver logs en tiempo real
docker logs -f urgara-jornales-api

# Detener la aplicación
docker compose -f docker-compose.prod.yml down

# Reiniciar la aplicación
docker compose -f docker-compose.prod.yml restart

# Actualizar a la última imagen
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```
