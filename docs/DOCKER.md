# Docker Setup for Urgara Jornales API

This document provides comprehensive instructions for running the Urgara Jornales API using Docker.

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 20.10 or higher
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0 or higher
- At least 2GB of available RAM
- At least 5GB of available disk space

## 🚀 Quick Start

### Development Environment

1. **Copy the development environment file:**

   ```bash
   cp .env.docker.dev .env.docker.dev.local
   ```

2. **Edit the environment variables** (optional):

   ```bash
   # Edit database credentials, JWT secrets, etc.
   nano .env.docker.dev.local
   ```

3. **Start the development database:**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Run the application locally** with database in Docker:
   ```bash
   # Update your .env file to point to localhost:5433
   pnpm run start:dev
   ```

### Production Environment

1. **Copy the production environment file:**

   ```bash
   cp .env.docker .env.docker.local
   ```

2. **Update environment variables** (REQUIRED):

   ```bash
   # IMPORTANT: Change these in production!
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_REFRESH_SECRET=your_secure_refresh_secret_here
   DATABASE_PASSWORD=your_secure_db_password
   ADMIN_PASSWORD=your_secure_admin_password
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

## 🛠️ Available Scripts

### Using the Setup Script

Make the script executable:

```bash
chmod +x scripts/docker-setup.sh
```

Available commands:

```bash
# Development
./scripts/docker-setup.sh --dev up        # Start development environment
./scripts/docker-setup.sh --dev down      # Stop development environment
./scripts/docker-setup.sh --dev logs      # View development logs

# Production
./scripts/docker-setup.sh --prod up       # Start production environment
./scripts/docker-setup.sh --prod down     # Stop production environment
./scripts/docker-setup.sh --prod build    # Build production images
./scripts/docker-setup.sh --prod logs     # View production logs
./scripts/docker-setup.sh --prod restart  # Restart production services
```

### Manual Docker Compose Commands

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml logs -f

# Production
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose build --no-cache
```

## 🏗️ Architecture

### Services Overview

| Service    | Description            | Ports                   | Dependencies |
| ---------- | ---------------------- | ----------------------- | ------------ |
| `postgres` | PostgreSQL 16 database | 5432 (prod), 5433 (dev) | None         |
| `api`      | NestJS application     | 3000                    | postgres     |

### Network Architecture

```
Internet → API (3000) → PostgreSQL (5432)
```

## 🔧 Configuration

### Environment Variables

#### Required Variables

- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens
- `DATABASE_PASSWORD` - PostgreSQL password
- `ADMIN_PASSWORD` - Default admin password

#### Optional Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - API port (default: 3000)
- `DATABASE_NAME` - Database name
- `DATABASE_USER` - Database user
- `CORS_ORIGIN` - Allowed CORS origins

### Database Configuration

The PostgreSQL container includes:

- Automatic database creation
- Health checks
- Persistent volume storage
- UUID and crypto extensions

## �� Monitoring & Health Checks

### Health Check Endpoints

- **API Health**: `GET /health`
- **Database**: Automatic PostgreSQL health checks

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f postgres
```

### Container Status

```bash
# View running containers
docker-compose ps

# View resource usage
docker stats
```

## 🔒 Security

### Production Security Checklist

#### Application Security

- [ ] Change default passwords in `.env.docker`
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Configure proper CORS origins
- [ ] Set up reverse proxy (Nginx/Caddy) with SSL outside Docker

#### Docker Security (✅ Implemented)

- [x] Multi-stage build to reduce attack surface
- [x] Non-root user execution (nestjs:nodejs)
- [x] Updated base image with security patches
- [x] Minimal runtime dependencies
- [x] Proper file permissions and ownership
- [x] Health checks with timeout protection
- [x] Signal handling with dumb-init
- [x] No secrets embedded in image layers

#### Infrastructure Security

- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Scan Docker images for vulnerabilities
- [ ] Use Docker secrets for sensitive data
- [ ] Enable Docker Content Trust (DCT)

### SSL/HTTPS Setup (Recommended)

For production, it's recommended to set up SSL outside of Docker using a reverse proxy:

#### Option 1: Nginx + Certbot (Traditional)

```bash
# Install Nginx and Certbot on host
sudo apt install nginx certbot python3-certbot-nginx

# Configure Nginx to proxy to Docker API
sudo nano /etc/nginx/sites-available/urgara-jornales-api

# Nginx config example:
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

#### Option 2: Caddy (Automatic SSL)

```bash
# Install Caddy
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy

# Caddyfile:
yourdomain.com {
    reverse_proxy localhost:3000
}

# Caddy automatically handles SSL certificates!
```

## 🛡️ Security Verification

### Verify Docker Security Implementation

```bash
# Check if container runs as non-root user
docker-compose exec api whoami
# Should output: nestjs

# Check user permissions
docker-compose exec api id
# Should show uid=1001(nestjs) gid=1001(nodejs)

# Verify file permissions
docker-compose exec api ls -la /app
# Files should be owned by nestjs:nodejs

# Check for security vulnerabilities (if Docker Scout is available)
docker scout cves urgara-jornales-api

# Check container capabilities
docker inspect urgara-jornales-api | grep -A 10 "CapAdd\|CapDrop"
```

### Security Monitoring

```bash
# Monitor container resource usage
docker stats urgara-jornales-api

# Check for suspicious network connections
docker-compose exec api netstat -tuln

# Review container logs for security events
docker-compose logs api | grep -i "error\|warn\|security\|unauthorized"
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Test database connection
docker-compose exec postgres psql -U postgres -d urgara_jornales_api -c "SELECT 1;"
```

#### API Not Starting

```bash
# Check API logs
docker-compose logs api

# Check if database is ready
docker-compose exec api npx prisma migrate status

# Restart API service
docker-compose restart api
```

#### Port Already in Use

```bash
# Check what's using the port
netstat -tlnp | grep :3000

# Kill the process or change port in .env file
```

### Database Operations

#### Backup Database

```bash
docker-compose exec postgres pg_dump -U postgres urgara_jornales_api > backup.sql
```

#### Restore Database

```bash
docker-compose exec -T postgres psql -U postgres urgara_jornales_api < backup.sql
```

#### Reset Database

```bash
# Stop services
docker-compose down

# Remove database volume
docker volume rm urgara-jornales-api_postgres_data

# Restart services
docker-compose up -d
```

### Database Migrations

#### Global Database (automático)

Las migraciones de la base de datos global se ejecutan automáticamente al iniciar el contenedor a través del `docker-entrypoint.sh`. No requiere intervención manual.

```bash
# Si necesitás ejecutarlas manualmente:
docker exec -it urgara-jornales-api pnpm run prisma:migrate:deploy:global
```

#### Locality Database (manual, por localidad)

La arquitectura es **multi-tenant**: cada localidad tiene su propia base de datos. La variable `DATABASE_LOCALITY_URL` usa un placeholder `{locality}` que se reemplaza dinámicamente en runtime. Por esto, las migraciones de locality **no se ejecutan automáticamente** en el entrypoint y deben correrse manualmente por cada localidad.

Para migrar una base de datos de locality específica, se usa `docker exec` sobreescribiendo `DATABASE_LOCALITY_URL` con la URL completa (sin el placeholder `{locality}`, sino con el nombre real de la base de datos):

```bash
docker exec -it urgara-jornales-api \
  sh -c "DATABASE_LOCALITY_URL='postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<LOCALITY_DATABASE_NAME>?schema=public'\
  pnpm run prisma:migrate:deploy:locality"
```

**Opción 1 - Comando directo:**

```bash
docker exec -it urgara-jornales-api \
  sh -c "DATABASE_LOCALITY_URL='postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<LOCALITY_DATABASE_NAME>?schema=public'\
  pnpm run prisma:migrate:deploy:locality"
```

**Opción 2 - Con variable de entorno (recomendado si la terminal deforma el comando al pegarlo):**

```bash
export DB_URL='postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<LOCALITY_DATABASE_NAME>?schema=public'
docker exec -it urgara-jornales-api sh -c "DATABASE_LOCALITY_URL='$DB_URL' pnpm run prisma:migrate:deploy:locality"
```

**Después de migrar, reiniciar el contenedor** para que la aplicación cargue la nueva conexión de locality:

```bash
docker restart urgara-jornales-api
```

Esto es necesario porque `DatabaseLocalityService` carga las conexiones a las bases de datos de cada localidad al iniciar la aplicación (`onModuleInit`). Sin reiniciar, la nueva locality migrada no estará disponible.

**Importante:**
- Repetir el comando de migración por cada localidad que tenga su base de datos creada
- El `<LOCALITY_DATABASE_NAME>` corresponde al campo `databaseName` del modelo `Locality` en la base de datos global
- Si la contraseña contiene caracteres especiales, asegurate de que esté entre comillas simples dentro del comando
- No debe haber salto de línea entre la URL y `pnpm run` (el `\` al final de la línea de la URL debe estar pegado sin espacio)

## 🚀 Deployment

### Production Deployment Steps

1. **Server Setup**

   ```bash
   # Clone repository
   git clone <repository-url>
   cd urgara-jornales-api
   ```

2. **Environment Configuration**

   ```bash
   # Copy and configure environment
   cp .env.docker .env.docker.local
   # Edit with production values
   ```

3. **Build and Start**

   ```bash
   # Build images
   docker-compose build

   # Start services
   docker-compose up -d
   ```

4. **Verify Deployment**

   ```bash
   # Check service status
   docker-compose ps

   # Check logs
   docker-compose logs -f

   # Test API
   curl http://localhost:3000/health
   ```

5. **Set up SSL (Production)**
   ```bash
   # Choose between Nginx+Certbot or Caddy (see SSL section above)
   # Configure reverse proxy to handle HTTPS
   ```

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check migration status
docker-compose exec api npx prisma migrate status
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)
