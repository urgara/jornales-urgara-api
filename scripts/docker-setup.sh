#!/bin/bash

# Docker setup script for Dynnamix API
set -e

echo "🐳 Dynnamix API - Docker Setup"
echo "===================================="

# Function to check if a command exists
command_exists() {
command -v "$1" >/dev/null 2>&1
}

# Check if Docker is installed
if ! command_exists docker; then
echo "❌ Error: Docker is not installed."
echo "Please install Docker from https://docs.docker.com/get-docker/"
exit 1
fi

# Check if Docker Compose is available
if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
echo "❌ Error: Docker Compose is not available."
echo "Please install Docker Compose or update Docker to a version that includes Docker Compose."
exit 1
fi

# Set Docker Compose command
if command_exists docker-compose; then
DOCKER_COMPOSE="docker-compose"
else
DOCKER_COMPOSE="docker compose"
fi

echo "✅ Docker and Docker Compose are available"

# Parse command line arguments
ENVIRONMENT="production"
ACTION="up"

while [[ $# -gt 0 ]]; do
case $1 in
--dev|--development)
ENVIRONMENT="development"
shift
;;
--prod|--production)
ENVIRONMENT="production"
shift
;;
up|down|build|logs|restart)
ACTION="$1"
shift
;;
-h|--help)
echo "Usage: $0 [--dev|--prod] [up|down|build|logs|restart]"
echo ""
echo "Options:"
echo "  --dev, --developmentUse development configuration"
echo "  --prod, --productionUse production configuration (default)"
echo ""
echo "Actions:"
echo "  up  Start services (default)"
echo "  downStop services"
echo "  build   Build images"
echo "  logsShow logs"
echo "  restart Restart services"
echo ""
echo "Examples:"
echo "  $0 --dev upStart development environment"
echo "  $0 --prod buildBuild production images"
echo "  $0 logs Show logs"
exit 0
;;
*)
echo "Unknown option: $1"
echo "Use --help for usage information"
exit 1
;;
esac
done

echo "🔧 Environment: $ENVIRONMENT"
echo "🎯 Action: $ACTION"

# Set environment file and compose file based on environment
if [ "$ENVIRONMENT" = "development" ]; then
ENV_FILE=".env.docker.dev"
COMPOSE_FILE="docker-compose.dev.yml"
echo "📝 Using development configuration"
else
ENV_FILE=".env.docker"
COMPOSE_FILE="docker-compose.yml"
echo "📝 Using production configuration"
fi

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
echo "❌ Error: Environment file $ENV_FILE not found"
echo "Please create the environment file based on the template"
exit 1
fi

# Export environment variables
set -a
source "$ENV_FILE"
set +a

echo "📁 Using compose file: $COMPOSE_FILE"
echo "🔑 Using environment file: $ENV_FILE"

# Execute the requested action
case $ACTION in
up)
echo "🚀 Starting services..."
$DOCKER_COMPOSE -f "$COMPOSE_FILE" up -d
echo "✅ Services started successfully!"
echo ""
echo "📋 Service URLs:"
if [ "$ENVIRONMENT" = "development" ]; then
echo "  🗄️  Database: localhost:5433"
echo "  💻 Run API locally: pnpm run start:dev"
else
echo "  🌐 API: http://localhost:3000"
echo "  📚 Swagger: http://localhost:3000/docs"
echo "  🗄️  Database: localhost:5432"
fi
;;
down)
echo "🛑 Stopping services..."
$DOCKER_COMPOSE -f "$COMPOSE_FILE" down
echo "✅ Services stopped successfully!"
;;
build)
echo "🔨 Building images..."
$DOCKER_COMPOSE -f "$COMPOSE_FILE" build --no-cache
echo "✅ Images built successfully!"
;;
logs)
echo "📄 Showing logs..."
$DOCKER_COMPOSE -f "$COMPOSE_FILE" logs -f
;;
restart)
echo "🔄 Restarting services..."
$DOCKER_COMPOSE -f "$COMPOSE_FILE" restart
echo "✅ Services restarted successfully!"
;;
esac