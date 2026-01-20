# Urgara Jornales API

API desarrollada en NestJS con PostgreSQL.

## Guía de Configuración en EC2 Ubuntu

### 1. Configurar SSH para GitHub

```bash
# Generar clave SSH
ssh-keygen -t ed25519 -C "tu-email@example.com"

# Copiar clave pública
cat ~/.ssh/id_ed25519.pub

# Agregar la clave a tu cuenta de GitHub:
# GitHub → Settings → SSH and GPG keys → New SSH key
```

### 2. Clonar el Proyecto

```bash
# Clonar usando SSH
git clone git@github.com:tu-usuario/urgara-jornales-api.git
cd urgara-jornales-api
```

### 3. Configurar Zona Horaria del Servidor

**IMPORTANTE**: El sistema está diseñado para funcionar con la zona horaria de Argentina (UTC-3).
El servidor DEBE configurarse con esta zona horaria para que las fechas se guarden y muestren correctamente.

```bash
# Configurar zona horaria a Argentina/Buenos Aires
sudo timedatectl set-timezone America/Argentina/Buenos_Aires

# Verificar configuración
timedatectl
# Debe mostrar: Time zone: America/Argentina/Buenos_Aires (ART, -0300)

# Alternativa: usando dpkg-reconfigure
sudo dpkg-reconfigure tzdata
# Seleccionar: America → Argentina → Buenos Aires
```

**Nota**: Esta configuración es crítica porque:
- Prisma guarda las fechas en la base de datos con zona horaria (timestamptz)
- JavaScript `Date` convierte automáticamente a la zona horaria del servidor
- Sin esta configuración, las fechas se mostrarán incorrectamente en la aplicación

### 4. Instalar Node.js

```bash
# Actualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 5. Instalar PostgreSQL

```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Iniciar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configurar base de datos
sudo -u postgres psql

# Dentro de psql:
CREATE DATABASE urgara_jornales_api;
CREATE USER urgara_jornales_user WITH PASSWORD 'urgara_jornales_password';
GRANT ALL PRIVILEGES ON DATABASE urgara_jornales_api TO urgara_jornales_user;

-- Verificar zona horaria de PostgreSQL (debe estar en UTC)
SHOW timezone;
-- Debe mostrar: UTC

\q
```

**Nota sobre zonas horarias**:
- PostgreSQL debe estar configurado en UTC (configuración por defecto)
- El servidor del sistema operativo debe estar en America/Argentina/Buenos_Aires
- Prisma guarda las fechas con timestamptz (timestamp with timezone)
- La conversión a la zona horaria local se hace automáticamente por el sistema operativo

### 6. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables
nano .env
```

Configurar en `.env`:

```env
POSTGRES_USER=urgara_jornales_user
POSTGRES_PASSWORD=urgara_jornales_password
POSTGRES_DB=urgara_jornales_api
DATABASE_URL=postgresql://urgara_jornales_user:urgara_jornales_password@localhost:5432/urgara_jornales_api?schema=public
NODE_ENV=production
PORT=3000
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
```

### 7. Instalar Dependencias y Configurar Prisma

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy
```

### 8. Construir y Ejecutar la Aplicación

```bash
# Construir aplicación
npm run build

# Ejecutar en producción
npm run start:prod

# Para desarrollo (opcional)
npm run start:dev
```

### 9. Configurar Nginx (Opcional)

```bash
# Instalar Nginx
sudo apt install nginx -y

# Crear configuración
sudo nano /etc/nginx/sites-available/urgara-jornales-api
```

Contenido del archivo:

```nginx
server {
listen 80;
server_name tu-dominio.com;

location / {
proxy_pass http://localhost:3000;
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

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/urgara-jornales-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 10. Configurar SSL con Let's Encrypt (Opcional)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Verificar renovación automática
sudo certbot renew --dry-run
```

### 11. Deploy Rápido con PM2

```bash
# Opción 1: Deploy automático con script
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# Opción 2: Deploy manual paso a paso
npm install
npm run build
npm run pm2:start
npm run pm2:save

# Configurar PM2 para iniciar con el sistema
npm run pm2:startup
# Ejecutar el comando que PM2 te muestre
```

## Comandos Útiles

### PM2 (Gestión de la aplicación)

```bash
# Ver logs de la aplicación
npm run pm2:logs

# Reiniciar aplicación
npm run pm2:restart

# Parar aplicación
npm run pm2:stop

# Eliminar aplicación de PM2
npm run pm2:delete

# Ver estado de aplicaciones PM2
pm2 status
```

### Sistema

```bash
# Ver estado de servicios
sudo systemctl status postgresql
sudo systemctl status nginx

# Ver logs del sistema
sudo journalctl -u nginx
sudo journalctl -u postgresql
```

### Deploy rápido después de cambios

```bash
# Para redeploy después de cambios en código
git pull
./scripts/deploy.sh
```

## Notas Técnicas

### Dependencia @prisma/client-runtime-utils

**Estado**: Workaround temporal para Prisma 7.x con pnpm

El paquete `@prisma/client-runtime-utils` está agregado como dependencia directa en `package.json` como solución temporal a un bug conocido de Prisma 7.0.0+ cuando se usa con pnpm.

**Problema**:
- Error de TypeScript TS2742 en compilación
- El tipo `Decimal` de Prisma no puede inferirse en `src/metadata.ts` (archivo autogenerado por @nestjs/swagger)
- Afecta a proyectos que usan Prisma 7.x + pnpm + NestJS Swagger

**Solución actual**:
- Agregar `@prisma/client-runtime-utils` como dependencia directa
- Esto hace explícita una dependencia que debería ser transitiva

**Referencias**:
- Issue principal: https://github.com/prisma/prisma/issues/28581
- Issue duplicado: https://github.com/prisma/prisma/issues/28664

**TODO - Revisar en el futuro**:
- Cuando Prisma lance una versión que solucione este bug oficialmente, verificar si se puede remover esta dependencia
- Monitorear los issues en GitHub para actualizaciones
- Probar sin la dependencia después de actualizar Prisma

---

## Troubleshooting

### Fechas incorrectas / Diferencia de 3 horas

Si las fechas se muestran con diferencia de horas, verificar la zona horaria del servidor:

```bash
# Verificar zona horaria actual
timedatectl

# Debe mostrar: Time zone: America/Argentina/Buenos_Aires (ART, -0300)
# Si no es así, configurar:
sudo timedatectl set-timezone America/Argentina/Buenos_Aires

# Reiniciar la aplicación después del cambio
npm run pm2:restart
```

**IMPORTANTE**: El servidor DEBE estar configurado en zona horaria Argentina/Buenos_Aires (UTC-3) para que las fechas funcionen correctamente.

### Error de Prisma

Si aparece error de descarga de binarios:

```bash
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
npx prisma generate
```

### Error de conexión a PostgreSQL

Verificar que el servicio esté corriendo:

```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Error de permisos

Verificar permisos de usuario en PostgreSQL:

```bash
sudo -u postgres psql
\du
```

## Scripts Disponibles

### Desarrollo

- `npm run build` - Construir aplicación
- `npm run start` - Iniciar aplicación
- `npm run start:dev` - Iniciar en modo desarrollo
- `npm run start:prod` - Iniciar en modo producción
- `npm run lint` - Ejecutar linter
- `npm run test` - Ejecutar tests

### PM2 (Producción)

- `npm run pm2:start` - Iniciar con PM2
- `npm run pm2:stop` - Parar aplicación
- `npm run pm2:restart` - Reiniciar aplicación
- `npm run pm2:logs` - Ver logs
- `npm run pm2:delete` - Eliminar de PM2
- `npm run deploy` - Build + Start + Save (deploy completo)

### Deploy

- `./scripts/deploy.sh` - Script de deploy automático
