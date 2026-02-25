# Script de inicio rápido para el Panel Web Multi-VM
# Ejecuta este script en PowerShell para iniciar el panel web

Write-Host "🚀 Iniciando Panel Web Multi-VM Ubuntu..." -ForegroundColor Cyan
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

# Verificar si existe la imagen base
Write-Host "🔍 Verificando imagen base de Ubuntu..." -ForegroundColor Cyan
$imageExists = docker images ubuntu-vm-image -q

if (-not $imageExists) {
    Write-Host "⚠️  La imagen base no existe. Ejecuta primero:" -ForegroundColor Yellow
    Write-Host "   .\configurar.ps1" -ForegroundColor White
    Write-Host ""
    $respuesta = Read-Host "¿Quieres construir la imagen ahora? (s/n)"
    if ($respuesta -eq 's' -or $respuesta -eq 'S') {
        Write-Host ""
        Write-Host "📦 Construyendo imagen base (esto puede tomar 5-10 minutos)..." -ForegroundColor Cyan
        docker build -t ubuntu-vm-image .
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Error al construir la imagen" -ForegroundColor Red
            exit 1
        }
        Write-Host "✅ Imagen construida correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Cancelado. Ejecuta .\configurar.ps1 primero." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Imagen base encontrada" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Iniciando panel web..." -ForegroundColor Cyan
docker-compose up -d

Write-Host ""
Write-Host "✅ ¡Panel web iniciado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🌐 ACCEDE AL PANEL WEB" -ForegroundColor White
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Desde el panel web puedes:" -ForegroundColor Gray
Write-Host "   • Crear nuevas VMs con nombres personalizados" -ForegroundColor Gray
Write-Host "   • Gestionar cada VM individualmente" -ForegroundColor Gray
Write-Host "   • Ver estadísticas en tiempo real" -ForegroundColor Gray
Write-Host "   • Configurar recursos (CPU, RAM)" -ForegroundColor Gray
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🔐 CONECTAR POR SSH" -ForegroundColor White
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Después de crear una VM:" -ForegroundColor Gray
Write-Host "   ssh ubuntu@localhost -p [PUERTO]" -ForegroundColor White
Write-Host ""
Write-Host "   Usuario: ubuntu" -ForegroundColor Gray
Write-Host "   Contraseña: ubuntu123" -ForegroundColor Gray
Write-Host ""
Write-Host "El puerto SSH se muestra en cada tarjeta de VM." -ForegroundColor Gray
Write-Host ""
Write-Host "⏳ Esperando a que el panel web esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎉 ¡Todo listo! Abriendo el panel web en tu navegador..." -ForegroundColor Green
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
