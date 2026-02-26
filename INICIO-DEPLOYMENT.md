# ⚡ GUÍA RÁPIDA DE DESPLIEGUE - 10 PASOS (5 minutos)

## 🎯 Objetivo: Tu web funcionando en PRODUCCIÓN para que otros la usen

---

## **OPCIÓN A: En Railway (La MÁS FÁCIL) ✅**

### Paso 1: Tener todo listo
```powershell
cd c:\Users\1SMRA-scamren559\Documents\VS
git add .
git commit -m "Listo para producción"
git push origin main
```

### Paso 2: Ir a Railway
https://railway.app → Sign up with GitHub

### Paso 3: Conectar tu repo
- New Project → Deploy from GitHub repo
- Selecciona `VM-Ubutnu`

### Paso 4: Railway detecta el Dockerfile automáticamente
✅ Listo, empezará a construir

### Paso 5: Agregar variables (Railway Dashboard)
```
NODE_ENV=production
JWT_SECRET=tu-secreto-muy-seguro-ahora
PORT=3000
```

### ✅ **YA ESTÁ EN PRODUCCIÓN**
Railway te da tu URL: `https://tu-nombreproyecto.railway.app`

Todo el mundo puede acceder aquí

---

## **OPCIÓN B: En DigitalOcean ($5/mes)**

### Paso 1: Crear Droplet
- DigitalOcean.com → Create Droplet
- Ubuntu 22.04 LTS, $5/mes

### Paso 2: SSH al servidor
```powershell
ssh root@tu-ip
```

### Paso 3: Instalar Docker
```bash
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker root
```

### Paso 4: Clonar tu repo
```bash
git clone https://github.com/tu-usuario/VM-Ubutnu.git
cd VM-Ubutnu
```

### Paso 5: Desplegar
```bash
cp .env.production .env
docker-compose -f docker-compose.production.yml up -d
```

### ✅ **YA ESTÁ EN PRODUCCIÓN**
URL: `http://tu-ip-del-servidor:3000`

O con tu dominio: `http://tu-dominio.com:3000`

---

## **OPCIÓN C: En Render (Gratis pero limitado)**

### Paso 1-3: Igual a Railway
https://render.com → New Web Service → GitHub

### Paso 4: Configurar
- Name: `vm-panel`
- Runtime: `Docker`
- Plan: Free (o Paid si necesitas)

### ✅ **YA ESTÁ EN PRODUCCIÓN**
Render te da tu URL pública

---

## 🔐 DESPUÉS DE DESPLEGAR (MUY IMPORTANTE)

### Cambiar contraseña admin
1. Accede a tu web
2. Login con: `admin` / `admin123`
3. Ve a "Usuarios" (si existe la opción)
4. Cambia a contraseña fuerte
5. Crea otros usuarios

---

## 📊 Diferencias clave

| | Railway | DigitalOcean | Render |
|---|---|---|---|
| **Tiempo setup** | 2 min | 10 min | 2 min |
| **Precio** | $5 gratis | $5/mes | Gratis |
| **Para producción** | ✅ SÍ | ✅ SÍ | ⚠️ No (hobby) |
| **Tu propia IP** | No | Sí | No |

---

## ✅ Verificar que funciona

1. Abre tu URL en navegador
2. Login: `admin` / `admin123`
3. Crea una VM de prueba
4. Espera a que aparezca el puerto SSH
5. Intenta conectar por SSH con el usuario `ubuntu` / `ubuntu123`

---

## 🆘 Si algo no funciona

```bash
# Ver logs
docker-compose logs -f web-panel

# Reiniciar
docker-compose restart web-panel

# Verificar que Docker está corriendo
docker ps
```

---

## 🚀 Recomendación FINAL

**Para empezar hoy mismo:** 
→ Usa **Railway** (2 minutos, gratis, profesional)

**Para control total:**
→ Usa **DigitalOcean** ($5/mes, tu propia IP)

**Para simplemente probar:**
→ Usa **Render** (gratis pero con limitaciones)

---

¿Cuál opción prefieres? 🎯
