# ✅ CHECKLIST DE DESPLIEGUE - GUÍA PASO A PASO

## 📋 Antes de Desplegar

- [ ] Tu repositorio está en GitHub
- [ ] El código está en rama `main` 
- [ ] Has hecho `git push` de todos los cambios
- [ ] Docker Desktop está instalado (para probar localmente)
- [ ] Tienes cuenta en la plataforma de despliegue elegida

---

## 🔐 SEGURIDAD - MUY IMPORTANTE

### Cambiar credenciales por defecto
- [ ] Cambiar usuario `admin` contraseña `admin123` a contraseña fuerte
- [ ] Cambiar usuario `usuario1` contraseña `user123` 
- [ ] Editar [web-panel/users.json](web-panel/users.json)
- [ ] Generar nuevo `JWT_SECRET` en `.env`

```powershell
# Generar JWT_SECRET aleatorio
-join(([char[]](33..126)) | Get-Random -Count 32)
```

---

## 🚀 DESPLIEGUE EN RAILWAY (RECOMENDADO)

### Paso 1: Preparar el código
```powershell
cd c:\Users\1SMRA-scamren559\Documents\VS
git add .
git commit -m "Listo para despliegue en Railway"
git push origin main
```
- [ ] Commits pusheados a GitHub

### Paso 2: Conectar Railway
- [ ] Ir a https://railway.app
- [ ] Registrarse con GitHub
- [ ] Conectar repositorio `VM-Ubutnu`
- [ ] Railway detecta automáticamente `Dockerfile` ✅

### Paso 3: Configurar variables de entorno en Railway
```
NODE_ENV=production
JWT_SECRET=<tu-secreto-generado>
PORT=3000
```
- [ ] Variables configuradas en Railway Dashboard

### Paso 4: Verificar Deploy
- [ ] Build completado ✅
- [ ] Servicio corriendo ✅
- [ ] URL pública disponible ✅
- [ ] Acceso a https://tu-proyecto.railway.app ✅

---

## 🚀 DESPLIEGUE EN DIGITALOCEAN (PRODUCCIÓN)

### Paso 1: Crear servidor
- [ ] DigitalOcean Droplet creado
- [ ] Ubuntu 22.04 LTS seleccionado
- [ ] Plan $5/mes seleccionado
- [ ] SSH configurado
- [ ] IP del servidor anotada

### Paso 2: Instalar Docker en el servidor
```bash
# SSH a tu servidor
ssh root@tu-ip

# Instalar Docker
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker root

# Verificar
docker --version
```
- [ ] Docker instalado en servidor
- [ ] `docker --version` funciona

### Paso 3: Clonar repositorio
```bash
git clone https://github.com/tu-usuario/VM-Ubutnu.git
cd VM-Ubutnu
```
- [ ] Repositorio clonado en servidor
- [ ] Estamos en el directorio correcto

### Paso 4: Configurar variables
```bash
cp .env.production .env
nano .env
# Cambiar JWT_SECRET y otras variables
```
- [ ] Archivo `.env` creado y configurado
- [ ] JWT_SECRET es único y fuerte

### Paso 5: Desplegar
```bash
docker-compose -f docker-compose.production.yml up -d
docker-compose ps  # Verificar que todo está corriendo
```
- [ ] Contenedores están en estado `Up`
- [ ] Panel web accesible en http://tu-ip:3000
- [ ] Puedes ver logs: `docker-compose logs -f web-panel`

---

## ✅ POST-DESPLIEGUE - VERIFICACIONES

### Acceso a la web
- [ ] Abrir navegador a URL de despliegue
- [ ] Página de login aparece
- [ ] Login funciona con credenciales por defecto
- [ ] Dashboard carga correctamente

### Crear una VM de prueba
- [ ] Click en "Crear Nueva VM"
- [ ] Nombre: "test-ubuntu"
- [ ] CPU: 1, Memory: 512
- [ ] Click "Crear"
- [ ] VM aparece en la lista
- [ ] Estado muestra como "running"
- [ ] Puerto SSH está asignado

### Conectar por SSH
```powershell
# Desde PowerShell local
ssh ubuntu@tu-dominio-o-ip -p [puerto-mostrado]
# Contraseña: ubuntu123
```
- [ ] Conexión SSH exitosa
- [ ] Terminal de Ubuntu abierta
- [ ] Usuario `ubuntu` verificado

### Gestionar VM
- [ ] Puedo reiniciar la VM desde el panel
- [ ] Puedo ver logs de la VM
- [ ] Puedo detener la VM
- [ ] Puedo iniciar la VM nuevamente
- [ ] Puedo eliminar la VM

---

## 🔒 SEGURIDAD POST-DESPLIEGUE

- [ ] **JWT_SECRET jamás debe estar en público**
  - Cambiar después de cada despliegue
- [ ] **Credenciales de admin cambiadas**
  - No usar `admin123` en producción
- [ ] **Firewall configurado**
  - Solo puerto 3000 expuesto
  - SSH solo desde IPs autorizadas
- [ ] **Backups configurados**
  - Si usas DigitalOcean: habilitar snapshots
- [ ] **Monitoreo activado**
  - Logs revisados regularmente
  - Alertas configuradas si es posible

---

## 🆘 SOLUCIONAR PROBLEMAS

### La web no carga
```bash
docker-compose logs web-panel
# Ver qué error hay
```

### Las VMs no se crean
```bash
docker ps
# Verificar que Docker está corriendo
# Ver si hay errores de permisos
```

### SSH no funciona
```bash
docker-compose ps
# Ver puertos asignados
netstat -an | grep LISTEN
```

### Contrasena olvidada
1. SSH al servidor
2. Editar `web-panel/users.json`
3. Cambiar contraseña y guardar
4. Reiniciar: `docker-compose restart web-panel`

---

## 📊 Monitoreo en Tiempo Real

### Ver logs
```bash
docker-compose logs -f web-panel
```

### Ver estado
```bash
docker-compose ps
```

### Ver uso de recursos
```bash
docker stats
```

### Reiniciar si hay problemas
```bash
docker-compose restart
```

---

## 🎉 ¡ÉXITO!

Si llegaste aquí sin errores, tu sistema está:
- ✅ En producción
- ✅ Accesible a través de internet
- ✅ Permite crear VMs reales
- ✅ Listo para que otros lo usen

---

## 📞 URLs importantes

- **Railway:** https://railway.app
- **DigitalOcean:** https://www.digitalocean.com
- **Documentación Docker:** https://docs.docker.com
- **Node.js Docs:** https://nodejs.org/docs

---

**Última actualización:** Febrero 26, 2026
**Estado:** Listo para producción ✅
