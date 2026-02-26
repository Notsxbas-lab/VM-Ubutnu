# 🚀 GUÍA DE DESPLIEGUE PARA PRODUCCIÓN

## 📍 Opción 1: **RAILWAY** (La más fácil - Recomendada) ✅

### Paso 1: Preparar el repositorio GitHub
```bash
git add .
git commit -m "Preparado para producción"
git push origin main
```

### Paso 2: Crear cuenta en Railway
1. Ve a https://railway.app
2. Regístrate con GitHub
3. Conecta tu repositorio

### Paso 3: Configurar en Railway
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Selecciona tu repositorio `VM-Ubutnu`
4. Railway detectará el Dockerfile automáticamente

### Paso 4: Configurar Variables de Entorno
En Railway, ve a "Variables":
```
NODE_ENV=production
JWT_SECRET=tu-secreto-super-seguro-2025-CAMBIAR
PORT=3000
```

### Paso 5: Deploy
- Railway hará deploy automáticamente
- Tu URL es: `https://tu-proyecto.up.railway.app`

**Ventajas:**
- ✅ Gratis (primeros $5 USD de crédito)
- ✅ Deploy automático desde GitHub
- ✅ SSL/HTTPS incluido
- ✅ Logs en tiempo real
- ✅ Fácil escalamiento

---

## 📍 Opción 2: **DIGITALOCEAN** (Mejor control - $5/mes)

### Paso 1: Crear Droplet
1. Ve a https://www.digitalocean.com
2. Click "Create" → "Droplets"
3. Selecciona:
   - **Image:** Ubuntu 22.04 LTS
   - **Size:** $5/mes (1GB RAM, 1 vCPU)
   - **Region:** Más cercana a ti
   - **Username:** tu_usuario

### Paso 2: Conectar por SSH
```powershell
# En PowerShell
ssh root@tu-ip-del-servidor

# Primera conexión: cambia la contraseña si es necesario
```

### Paso 3: Instalar Docker y Docker Compose
```bash
# En el servidor:
curl -sSL https://get.docker.com | sh
curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker --version
docker-compose --version
```

### Paso 4: Clonar tu repositorio
```bash
git clone https://github.com/tu-usuario/VM-Ubutnu.git
cd VM-Ubutnu
```

### Paso 5: Crear archivo .env
```bash
nano .env.production
```
Pega:
```
NODE_ENV=production
PORT=3000
JWT_SECRET=tu-secreto-super-seguro-ahora-mismo-2025
```
Guarda: `Ctrl+X` → `Y` → `Enter`

### Paso 6: Iniciar la aplicación
```bash
docker-compose -f docker-compose.yml up -d
```

### Paso 7: Verificar que funciona
```bash
# Ver logs
docker-compose logs -f web-panel

# Ver contenedores ejecutándose
docker-compose ps
```

Tu app está disponible en: `http://tu-ip-del-servidor:3000`

**Para usar dominio propio:**
1. Apunta tu dominio DNS a la IP del servidor
2. Configura SSL con Let's Encrypt (certbot)

---

## 📍 Opción 3: **RENDER** (Alternativa fácil - Gratis)

### Paso 1: Conectar GitHub
1. Ve a https://render.com
2. Regístrate con GitHub
3. Conecta tu repositorio

### Paso 2: Crear nuevo servicio
1. Click "New +"
2. Selecciona "Web Service"
3. Elige tu repositorio `VM-Ubutnu`
4. Configurar:
   - **Name:** vm-ubuntu-panel
   - **Environment:** Docker
   - **Plan:** Free (con limitaciones)

### Paso 3: Variables de Entorno
```
NODE_ENV=production
JWT_SECRET=tu-secreto-seguro-2025
PORT=3000
```

### Paso 4: Deploy
- Render inicia el deploy automáticamente
- Tu URL: `https://vm-ubuntu-panel.onrender.com`

---

## 🔐 Seguridad - MUY IMPORTANTE

### Después de desplegar:
1. **Cambia las credenciales por defecto:**
   ```bash
   # Edita web-panel/users.json
   # Cambia: admin123 y user123 por contraseñas fuertes
   ```

2. **Regenera el JWT_SECRET:**
   ```powershell
   # Genera uno nuevo
   -join(([char[]](33..126)) | Get-Random -Count 32)
   ```

3. **Usa HTTPS obligatorio** en producción

4. **Configura Firewall:**
   - Solo puerto 3000 accesible
   - SSH solo desde IPs autorizadas

---

## 📊 Comparativa de Opciones

| Característica | Railway | DigitalOcean | Render |
|---|---|---|---|
| **Precio** | Libre ($5) | $5/mes | Gratis |
| **Facilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Control** | Medio | Alto | Bajo |
| **Soporte Producción** | Sí | Sí | No (hobby) |
| **SSL/HTTPS** | Automático | Manual | Automático |
| **Escalamiento** | Fácil | Fácil | Limitado |

---

## ✅ Verificar que todo funciona

### 1. Acceder a la web
```
https://tu-dominio.com/
```

### 2. Login
- **Usuario:** admin
- **Contraseña:** admin123 (⚠️ CAMBIAR DESPUÉS)

### 3. Crear una VM de prueba
1. Click "➕ Crear Nueva VM"
2. Nombre: "test-vm"
3. CPU: 1, RAM: 512MB
4. Click "Crear"

### 4. Verificar que la VM funciona
- Espera a que aparezca el puerto SSH
- Intenta conectar:
```powershell
ssh ubuntu@tu-dominio.com -p [puerto-mostrado]
# Contraseña: ubuntu123
```

---

## 🐛 Solucionar Problemas

### La web no se ve
```bash
# Ver logs
docker-compose logs web-panel

# Reiniciar
docker-compose restart web-panel
```

### Las VMs no se crean
```bash
# Verificar Docker está ejecutándose
docker ps

# Ver el error
docker-compose logs -f web-panel | grep -i "error"
```

### Conexión SSH no funciona
```bash
# Verificar puertos
docker port ubuntu-vm-test-vm

# El puerto debe estar en tu servidor
netstat -an | grep LISTEN
```

---

## 📞 Soporte

Si algo no funciona:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica que Docker está ejecutándose
3. Comprueba las variables de entorno
4. Reinicia todo: `docker-compose down && docker-compose up -d`

¡Éxito! 🚀
