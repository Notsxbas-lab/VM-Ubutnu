# 🚀 INICIO RÁPIDO - Sistema Multi-VM Ubuntu

## ⚡ Para usuarios que quieren empezar ya mismo:

### 1. Asegúrate de tener Docker Desktop instalado y ejecutándose

Descarga desde: https://www.docker.com/products/docker-desktop/

### 2. Ejecuta el script de configuración inicial (SOLO LA PRIMERA VEZ)

Abre PowerShell en esta carpeta y ejecuta:

```powershell
.\configurar.ps1
```

Este script:
- ✅ Construye la imagen base de Ubuntu
- ✅ Inicia el panel web de administración
- ✅ Abre el navegador automáticamente

### 3. Accede al panel web

El navegador se abrirá automáticamente en: **http://localhost:3000**

### 4. Crea tu primera VM

1. Haz clic en "➕ Crear Nueva VM"
2. Dale un nombre (ej: "desarrollo", "pruebas", "produccion")
3. Opcionalmente, configura CPU y RAM
4. ¡Listo! Tu VM se creará automáticamente

### 5. Conéctate por SSH

```powershell
ssh ubuntu@localhost -p [PUERTO_MOSTRADO]
```

- **Usuario:** `ubuntu`
- **Contraseña:** `ubuntu123`

El puerto SSH específico se mostrará al crear la VM.

---

## 🎯 ¿Qué puedes hacer?

### Desde el Panel Web:

- ➕ **Crear múltiples VMs** con nombres personalizados
- ▶️ **Iniciar/Detener/Reiniciar** cada VM individualmente
- ⚙️ **Configurar recursos** (CPU y RAM) por VM
- 📊 **Ver estadísticas** en tiempo real de cada VM
- 📝 **Consultar logs** de cada VM
- 🗑️ **Eliminar VMs** que no necesites

### Desde SSH:

Cada VM es un Ubuntu 22.04 completo donde puedes:
- Instalar cualquier software
- Ejecutar servidores web, bases de datos, etc.
- Desarrollar y probar aplicaciones
- Todo lo que harías en Ubuntu normal

---

## 📋 Comandos Útiles

```powershell
# Ver VMs en ejecución
docker ps

# Ver todas las VMs (incluso detenidas)
docker ps -a

# Detener el panel web
docker-compose down

# Reiniciar el panel web
docker-compose restart web-panel

# Ver logs del panel web
docker-compose logs web-panel
```

---

## 🆕 Características Nuevas vs. Versión Anterior

| Característica | Antes | Ahora |
|----------------|-------|-------|
| Número de VMs | 1 fija | Ilimitadas |
| Crear VMs | Manual | Desde el panel web |
| Gestión | Una sola | Individual por VM |
| Puertos SSH | 2222 fijo | Auto-asignados (2222, 2223...) |
| Nombres | Fijo | Personalizados |

---

## 💡 Ejemplos de Uso

### Crear VM para desarrollo web
```
Nombre: desarrollo-web
CPU: 2
RAM: 2 GB
Puerto: 2222
```

### Crear VM para base de datos
```
Nombre: mysql-server
CPU: 4
RAM: 4 GB
Puerto: 2223
```

### Crear VM para testing
```
Nombre: test
CPU: 1
RAM: 1 GB
Puerto: 2224
```

Cada VM es completamente independiente y puedes conectarte a todas simultáneamente.

---

## 🔧 Solución de Problemas

### No puedo acceder al panel web

```powershell
# Reinicia el panel web
docker-compose restart web-panel

# Verifica que esté corriendo
docker ps
```

### Error al crear VM

- Verifica que Docker Desktop tenga suficiente RAM asignada (Settings → Resources)
- Asegúrate de que el nombre no contenga caracteres especiales

### No puedo conectar por SSH

- Asegúrate de que la VM esté **iniciada** (botón verde en el panel)
- Verifica el puerto correcto (se muestra en la tarjeta de la VM)

---

Para más detalles, consulta el **README.md** completo.

🎉 **¡Disfruta tu sistema multi-VM!**
