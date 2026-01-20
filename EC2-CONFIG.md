# Guía de Configuración EC2

Este documento describe el proceso paso a paso para configurar una instancia EC2 para el proyecto urgara-jornales-api.

## Pasos de Configuración

### Paso 1: Actualizar Sistema e Instalar Nginx

```bash
sudo apt update
sudo apt install nginx
```

### Paso 2: Configurar Firewall (UFW)

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh  # ⚠️ IMPORTANTE: Permitir SSH antes de habilitar UFW para evitar quedarse sin acceso
```

### Paso 3: Verificar Estado de Nginx

Comprobar que el servicio de Nginx esté funcionando correctamente:

```bash
systemctl status nginx
```

El output esperado debería mostrar:

```
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2020-04-20 16:08:19 UTC; 3 days ago
     Docs: man:nginx(8)
 Main PID: 2369 (nginx)
    Tasks: 2 (limit: 1153)
   Memory: 3.5M
   CGroup: /system.slice/nginx.service
           ├─2369 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
           └─2380 nginx: worker process
```

### Paso 4: Verificar Nginx en el Navegador

Abrir el navegador y navegar a la IP pública de la instancia EC2:

```
http://[IP_DE_LA_INSTANCIA]
```

Debería aparecer la página de bienvenida de Nginx que dice "Welcome to nginx!" - esta es la mejor manera de confirmar que todo funciona correctamente.

## Configuración como Proxy Inverso

### Paso 5: Crear Archivo de Configuración del Sitio

Navegar al directorio sites-available y crear un archivo con el dominio (que debe estar previamente registrado en Cloudflare, generalmente usando un subdominio):

```bash
cd /etc/nginx/sites-available
sudo nano [tu-dominio.com]
```

> **Nota:** El dominio debe estar previamente configurado en Cloudflare y apuntando a la IP de la instancia EC2.

### Paso 6: Configurar el Archivo del Dominio

Agregar la siguiente configuración al archivo creado:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Habilitar compresión gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    location / {
        proxy_pass http://localhost:3000;  # Puerto donde la API está corriendo
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

> **Importante:**
>
> - Reemplazar `tu-dominio.com` con el dominio real configurado en Cloudflare
> - Verificar que el puerto `3000` coincida con el puerto donde va a correr la API

### Paso 7: Crear Enlace Simbólico

Crear un enlace simbólico del archivo en sites-available hacia sites-enabled:

```bash
sudo ln -s /etc/nginx/sites-available/[tu-dominio.com] /etc/nginx/sites-enabled/
```

### Paso 8: Verificar Configuración de Nginx

Verificar que la configuración de Nginx sea correcta antes de continuar:

```bash
sudo nginx -t
```

Si la configuración es correcta, debería mostrar:

```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Paso 9: Instalar Certbot para SSL

Instalar Certbot y el plugin de Nginx para obtener certificados SSL:

```bash
sudo apt install certbot python3-certbot-nginx
```

### Paso 10: Obtener Certificado SSL

Ejecutar Certbot para obtener el certificado SSL automáticamente:

```bash
sudo certbot --nginx -d tu-dominio.com
```

> **Notas:**
>
> - Reemplazar `tu-dominio.com` con el dominio real
> - Si solicita un email, usar: `devs@dynnamo.com`
> - Certbot configurará automáticamente el SSL en Nginx
> - Mensaje de exito 'Successfully received certificate.'

### Paso 11: Verificar Configuración Final

Verificar que todo esté funcionando correctamente:

```bash
# Verificar estado del firewall
sudo ufw status

#Si aparece incativo
##Por precausción volver a hacer
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
## y luego activamos el ufw
sudo ufw enable
# Volvemos a verificar
sudo ufw status

# Para desarrollo y si la api no esta en produccion todavia permitamos el puerto de la DB, cuando este en produccion desactivarlo tanto en ufc como en el grupo de ec2
sudo ufw allow 5432/tcp

# Verificar configuración de Nginx
sudo nginx -t

# Verificar estado del servicio Nginx
systemctl status nginx

# Reiniciar Nginx para aplicar cambios
sudo systemctl restart nginx
```

## Notas Importantes sobre Compresión

### ⚠️ Compresión se maneja en Nginx, no en NestJS

**La compresión de respuestas HTTP se configura únicamente en Nginx como reverse proxy.** No se debe implementar compresión a nivel de aplicación (NestJS) porque:

1. **Evita compresión redundante**: Comprimir dos veces (NestJS → Nginx) es ineficiente y desperdicia CPU
2. **Mejor rendimiento**: Nginx está optimizado en C para compresión, es mucho más rápido que Node.js
3. **Configuración centralizada**: Un solo punto de control para todas las optimizaciones de red
4. **Flexibilidad**: Puedes ajustar niveles de compresión sin redeployar la aplicación

**Configuración recomendada de Nginx:**
```nginx
gzip on;                    # Habilitar compresión
gzip_vary on;              # Agregar header Vary: Accept-Encoding
gzip_proxied any;          # Comprimir respuestas proxeadas
gzip_comp_level 6;         # Nivel de compresión (1-9, 6 es balance óptimo)
gzip_types ...;            # Tipos MIME a comprimir (JSON, JS, CSS, etc.)
```

**Paquetes NO necesarios en NestJS:**
- ❌ `compression` - No instalar
- ❌ `@types/compression` - No instalar

La configuración de compresión gzip en Nginx (mostrada en el Paso 6) ya reduce los payloads JSON en 60-80% para usuarios con conexiones lentas.

## Instalación de Docker y Configuración de GitHub

### Paso 12: Instalar Docker

Instalar Docker para poder ejecutar la aplicación en contenedores:

```bash
# Instalar Docker
sudo apt install docker.io

# Agregar el usuario actual al grupo docker
sudo usermod -aG docker $USER

# Iniciar y habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Paso 13: Configurar SSH para GitHub

Configurar las claves SSH para poder descargar el repositorio privado:

```bash
# Generar clave SSH
ssh-keygen -t ed25519 -C "devs@dynnamo.com"

eval "$(ssh-agent -s)"

ssh-add ~/.ssh/id_ed25519

# Mostrar la clave pública para agregarla a GitHub
cat ~/.ssh/id_ed25519.pub

```

Agregar la clave en la configuracion del repostiro, no a nivel de cuenta y no activar los permisos de escritura.

luego clonar el repositorio estando en la raiz de la instancia.

> **Importante:** Copiar la clave pública mostrada y agregarla a las Deploy Keys del repositorio en GitHub.
