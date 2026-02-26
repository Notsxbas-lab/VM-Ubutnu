#!/bin/bash

# 🚀 SCRIPT DE DESPLIEGUE AUTOMÁTICO EN SERVIDOR LINUX

set -e  # Salir si hay error

echo "🔄 Iniciando despliegue en producción..."

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml no encontrado"
    exit 1
fi

echo "📦 Creando .env desde .env.production..."
cp .env.production .env

echo "🔐 Generando JWT_SECRET si no existe..."
if ! grep -q "JWT_SECRET=" .env || grep "JWT_SECRET=tu-clave" .env > /dev/null; then
    JWT_SECRET=$(head -c 32 /dev/urandom | base64)
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    echo "✅ JWT_SECRET generado"
fi

echo "🛑 Deteniendo contenedores anteriores..."
docker-compose down || true

echo "🔨 Construyendo imagen..."
docker-compose -f docker-compose.production.yml build

echo "▶️  Iniciando servicios..."
docker-compose -f docker-compose.production.yml up -d

echo "⏳ Esperando a que la aplicación se inicie..."
sleep 5

echo "✅ Verificando salud de la aplicación..."
if docker-compose -f docker-compose.production.yml exec web-panel curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Despliegue completado exitosamente"
    echo ""
    echo "🌐 Tu aplicación está disponible en:"
    echo "   http://localhost:3000"
    echo ""
    echo "📝 Credenciales iniciales:"
    echo "   Usuario: admin"
    echo "   Contraseña: admin123"
    echo ""
    echo "⚠️  CAMBIAR CREDENCIALES INMEDIATAMENTE"
    echo ""
    echo "📊 Ver logs:"
    echo "   docker-compose logs -f web-panel"
else
    echo "❌ Error: La aplicación no respondió"
    echo "Ver logs: docker-compose logs web-panel"
    exit 1
fi
