# 🚀 SCRIPT DE DESPLIEGUE PARA WINDOWS POWERSHELL

Write-Host "🔄 Iniciando despliegue en producción..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (!(Test-Path "docker-compose.yml")) {
    Write-Host "❌ Error: docker-compose.yml no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Copiando .env desde .env.production..." -ForegroundColor Yellow
Copy-Item ".env.production" ".env" -Force

Write-Host "🔐 Generando JWT_SECRET..." -ForegroundColor Yellow
$jwt_secret = -join(([char[]](33..126)) | Get-Random -Count 32)
(Get-Content ".env") -replace 'JWT_SECRET=.*', "JWT_SECRET=$jwt_secret" | Set-Content ".env"
Write-Host "✅ JWT_SECRET generado" -ForegroundColor Green

Write-Host "🛑 Deteniendo contenedores anteriores..." -ForegroundColor Yellow
docker-compose down

Write-Host "🔨 Construyendo imagen..." -ForegroundColor Yellow
docker-compose -f docker-compose.production.yml build

Write-Host "▶️  Iniciando servicios..." -ForegroundColor Yellow
docker-compose -f docker-compose.production.yml up -d

Write-Host "⏳ Esperando a que la aplicación se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "✅ Despliegue completado exitosamente" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Tu aplicación está disponible en:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Credenciales iniciales:" -ForegroundColor Cyan
Write-Host "   Usuario: admin" -ForegroundColor Yellow
Write-Host "   Contraseña: admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  CAMBIAR CREDENCIALES INMEDIATAMENTE" -ForegroundColor Red
Write-Host ""
Write-Host "📊 Ver logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f web-panel" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ver estado:" -ForegroundColor Cyan
docker-compose ps
