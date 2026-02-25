# Script de configuración inicial para Multi-VM Ubuntu
# Ejecuta este script una sola vez para configurar el sistema

Write-Host "🚀 Configuración Inicial - Sistema Multi-VM Ubuntu" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Docker está instalado
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado." -ForegroundColor Red
    Write-Host "Por favor, instala Docker Desktop desde: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Verificar si Docker está ejecutándose
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker no está ejecutándose." -ForegroundColor Red
    Write-Host "Por favor, inicia Docker Desktop y vuelve a ejecutar este script." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Docker detectado y funcionando" -ForegroundColor Green
Write-Host ""

# Cambiar al directorio del script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "📦 Paso 1: Construyendo imagen base de Ubuntu..." -ForegroundColor Cyan
Write-Host "   (Esto puede tomar 5-10 minutos la primera vez)" -ForegroundColor Yellow
Write-Host ""

# Construir imagen base
docker build -t ubuntu-vm-image .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error al construir la imagen base" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Imagen base construida correctamente" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Paso 2: Iniciando panel web..." -ForegroundColor Cyan
docker-compose up -d web-panel

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error al iniciar el panel web" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "⏳ Esperando a que el panel web esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "✅ ¡Sistema configurado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🌐 ACCEDE AL PANEL WEB" -ForegroundColor White
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Desde ahí podrás:" -ForegroundColor Gray
Write-Host "  • Crear nuevas máquinas virtuales Ubuntu" -ForegroundColor Gray
Write-Host "  • Iniciar, detener y gestionar VMs" -ForegroundColor Gray
Write-Host "  • Ver estadísticas en tiempo real" -ForegroundColor Gray
Write-Host "  • Configurar recursos (CPU, RAM)" -ForegroundColor Gray
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🔐 CONECTAR POR SSH" -ForegroundColor White
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Una vez que crees una VM, conéctate así:" -ForegroundColor Gray
Write-Host "   ssh ubuntu@localhost -p [PUERTO]" -ForegroundColor White
Write-Host ""
Write-Host "   Usuario: ubuntu" -ForegroundColor Gray
Write-Host "   Contraseña: ubuntu123" -ForegroundColor Gray
Write-Host ""
Write-Host "El puerto SSH se mostrará al crear cada VM." -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Abriendo panel web en tu navegador..." -ForegroundColor Green
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
