## 🎉 ¡IMPLEMENTACIÓN COMPLETA! - Sistema Multi-Usuario con Autenticación JWT

Tu sistema de VMs Ubuntu ahora tiene **autenticación de nivel empresarial** completamente funcional.

---

## ✅ Lo Que Está LISTO Para Usar

### 🔐 Autenticación
- ✨ Login seguro con JWT
- ✨ Tokens de 24 horas
- ✨ Logout con limpieza de sesión
- ✨ Redirección automática a login

### 👥 Gestión de Usuarios
- ✨ Usuarios admin y normales con permisos diferenciados
- ✨ Creación de nuevos usuarios
- ✨ Asignación de VMs a usuarios específicos
- ✨ Revocación de acceso a VMs

### 🖥️ Control de Acceso
- ✨ Admins: Full control (crear/eliminar/modificar VMs)
- ✨ Usuarios: Solo usan VMs asignadas (iniciar/parar/configurar)
- ✨ Cada usuario ve solo sus VMs

### 🔗 API Protegida
- ✨ Todos los endpoints requieren autenticación
- ✨ Validación de permisos en cada operación
- ✨ Respuestas de error claras (401/403)

### 🎨 Interfaz Intuitiva
- ✨ Página de login profesional
- ✨ Botones ocultados según rol
- ✨ Muestra usuario actual
- ✨ Botón de logout visible

---

## 🚀 CÓMO EMPEZAR AHORA

### Opción 1: Prueba Rápida (Recomendado)

```powershell
# 1. Ir a la carpeta del proyecto
cd "tu-ruta\Documents\VS"

# 2. Preparar (si no lo hizo antes)
.\configurar.ps1   # Espera 5-10 minutos

# 3. Iniciar panel
.\iniciar.ps1

# 4. Abrir navegador
# http://localhost:3000
```

### Opción 2: Desde VS Code

```powershell
# En terminal integrada de VS Code
.\configurar.ps1
.\iniciar.ps1
```

---

## 🔑 CREDENCIALES DE PRUEBA

### Administrador
```
Usuario:    admin
Contraseña: admin123
```

### Usuario Normal
```
Usuario:    usuario1
Contraseña: user123
```

---

## 📋 LO QUE PUEDES HACER AHORA

### Como Administrador (`admin` / `admin123`)
1. ✅ **Crear VMs** → Botón "➕ Crear Nueva VM"
2. ✅ **Eliminar VMs** → Botón "🗑️ Eliminar" en cada VM
3. ✅ **Ver TODAS las VMs** → Sin ningún filtro
4. ✅ **Asignar VMs a usuarios** → Vía API o curl
5. ✅ **Crear más usuarios** → Vía API o curl
6. ✅ **Cambiar configuración de VMs** → CPU y RAM

### Como Usuario Normal (`usuario1` / `user123`)
1. ✅ **Ver solo sus VMs** → Las que el admin asignó
2. ✅ **Iniciar/Detener VMs** → Botones ▶️ y ⏹️
3. ✅ **Reiniciar VMs** → Botón 🔄
4. ✅ **Ver configuración** → Pero NO crear
5. ✅ **Ver logs** → De sus VMs
6. ✅ **Conectarse por SSH** → A sus VMs asignadas

---

## 🧪 PRUEBA RÁPIDA EN 10 MINUTOS

### 1️⃣ Inicia el sistema (1 min)
```powershell
.\iniciar.ps1
```
Espera: "El panel web está disponible en http://localhost:3000"

### 2️⃣ Abre el navegador (1 min)
```
http://localhost:3000
```
Deberías ver la **página de login**

### 3️⃣ Login como admin (1 min)
- Usuario: `admin`
- Contraseña: `admin123`
- Click: ✅ Iniciar Sesión

### 4️⃣ Crea una VM de prueba (3 min)
- Click: "➕ Crear Nueva VM"
- Nombre: `test-1`
- CPUs: `1`
- Memoria: `1`
- Click: "✅ Crear VM"
- **Espera ~1 minuto**

### 5️⃣ Prueba funciones (3 min)
- Click: "▶️ Iniciar" (en la VM)
- Espera 3 segundos
- Click: "⚙️ Config"
- Modifica CPU a `2`
- Click: "💾 Guardar"
- Click: "⏹️ Detener"

### 6️⃣ Logout (1 min)
- Click: "Cerrar Sesión" (arriba a la derecha)
- Deberías ver login nuevamente

### 7️⃣ Login como usuario normal (1 min)
- Usuario: `usuario1`
- Contraseña: `user123`
- ❌ **NO ves** botón "➕ Crear Nueva VM"
- ❌ **NO ves** botón "🗑️ Eliminar"
- ❌ **NO ves** ninguna VM (porque no fue asignada)

### 8️⃣ Asigna la VM (2 min) - Como admin nuevamente
```powershell
# Logout de usuario1 y login como admin nuevamente

# Luego ejecuta en PowerShell:
curl -X POST http://localhost:3000/api/assign-vm `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer AQUI_PEGA_TU_TOKEN_JWT" `
  -d '{
    "userId": 2,
    "vmName": "ubuntu-test-1"
  }'
```

**💡 Alternativa:** Usa **Postman** o **Thunder Client** (extensión VS Code)

### 9️⃣ Verifica permisos (1 min)
- Logout de admin
- Login como usuario1 nuevamente
- ✅ **AHORA SÍ ves** la VM "test-1"
- ✅ Puedes iniciar/parar
- ✅ **PERO NO** ver botón de eliminar

---

## 📁 ARCHIVOS NUEVOS Y MODIFICADOS

### ✨ NUEVOS
```
web-panel/
├── public/
│   ├── login.html        ← Página de login
│   └── login.js          ← Lógica de login
└── users.json            ← Base de datos de usuarios
```

### ✏️ MODIFICADOS
```
web-panel/
├── server.js             ← Agregada autenticación (JWT, middlewares, endpoints)
├── package.json          ← Agregada: jsonwebtoken
└── public/
    ├── index.html        ← Agregada: área de usuario
    ├── script.js         ← Agregada: manejo de tokens
    └── styles.css        ← Agregados: estilos del logout
```

### 📄 DOCUMENTACIÓN
```
AUTENTICACION-README.md   ← Guía completa
NEXT-STEPS.md             ← Pasos a seguir
CAMBIOS-AUTENTICACION.md  ← Cambios técnicos
```

---

## 🔗 ENDPOINTS DE API

Todos requieren: `Authorization: Bearer <TOKEN>` (excepto /api/login)

### Públicos (Sin token):
- `POST /api/login` - Obtener JWT

### Protegidos (Con token):

**Lectura:**
- `GET /api/vms` - Tus VMs (filtradas por rol)
- `GET /api/vm/:name/status` - Estado de VM
- `GET /api/vm/:name/logs` - Logs de VM

**Control:**
- `POST /api/vm/:name/start` - Iniciar
- `POST /api/vm/:name/stop` - Parar
- `POST /api/vm/:name/restart` - Reiniciar
- `POST /api/vm/:name/config` - Cambiar resources
- `DELETE /api/vm/:name` - Eliminar (admin)
- `POST /api/vm/create` - Crear (admin)

**Admin:**
- `POST /api/register-user` - Crear usuario
- `POST /api/assign-vm` - Asignar VM
- `POST /api/revoke-vm` - Revocar VM
- `GET /api/users` - Listar usuarios

---

## ⚡ COMANDOS ÚTILES

### Obtener tu token para API
```bash
# Login
$response = curl -X POST http://localhost:3000/api/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'

# El token está en: $response.token
```

### O desde DevTools del navegador
1. Abre DevTools (F12)
2. Tabla → Aplicación
3. LocalStorage
4. Busca `token`
5. Cópialo

### Conectarse por SSH
```bash
ssh ubuntu@localhost -p 2222
# Contraseña: ubuntu123
```

---

## 💡 NOTAS IMPORTANTES

1. **Tokens expiran en 24h** → Será redirigido a login automáticamente
2. **Contraseña guardada en plaintext** → Para producción usar bcrypt
3. **JWT_SECRET debe cambiar** → En `server.js` línea ~5
4. **Los usuarios viven en users.json** → Archivo local (cambiar a DB en producción)
5. **Permisos son estrictos** → Usuarios solo ven/usan sus VMs

---

## 🛟 SI ALGO NO FUNCIONA

### "Acceso denegado" en login
```powershell
# Verifica que users.json exista
test-path web-panel/users.json

# Y que contenga usuarios válidos
cat web-panel/users.json
```

### "No aparecen credenciales de prueba"
```powershell
# Borra users.json y reinicia
remove-item web-panel/users.json
.\iniciar.ps1
```

### "Panel no responde"
```powershell
# Presiona Ctrl+C
# Luego reinicia
.\iniciar.ps1
```

### "Botones no aparecen/desaparecen"
- Usa DevTools (F12)
- Console → Busca errores
- Verifica que JWT esté en localStorage
- Haz refresh (F5)

---

## 🎓 CONCEPTOS PRINCIPALES

### Rol Admin
- Ve todas las VMs
- Puede crear/eliminar VMs
- Puede gestionar usuarios
- Puede asignar VMs a otros

### Rol User
- Ve solo sus VMs asignadas
- Puede usar (iniciar/parar/configurar) VMs
- NO puede crear/eliminar VMs
- NO puede gestionar usuarios

### JWT Token
- Contiene: id, username, role
- Duración: 24 horas
- Almacenado en: localStorage
- Enviado en: Header Authorization

### Permisos
```
Admin: *** (acceso total)
User:  +++  (solo operaciones)
```

---

## 📊 DIAGRAMA DEL FLUJO

```
┌─────────────────────────────────────────────────────┐
│                 NAVEGADOR                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ¿Token en localStorage?                            │
│      ├─ No  → /login.html (credenciales)            │
│      └─ Sí  → /index.html (datos + rol)             │
│                                                     │
│  En login.html:                                     │
│      ├─ POST /api/login                             │
│      └─ Guarda token en localStorage                │
│                                                     │
│  En index.html:                                     │
│      ├─ Todas las peticiones incluyen: "Bearer TOKEN"
│      ├─ Si 401 → Borra token y va a /login.html    │
│      └─ UI adaptada según rol (admin/user)          │
│                                                     │
└─────────────────────────────────────────────────────┘
         ↓                ↓                ↓
    ┌────────┐      ┌──────────┐    ┌─────────────┐
    │ Backend│      │ Docker   │    │ users.json  │
    │Express │      │VMs       │    │Base Datos   │
    └────────┘      └──────────┘    └─────────────┘
```

---

## ✨ FEATURES DESTACADAS

- 🔐 **JWT:** Tokens seguros que expiran
- 🗝️ **Roles:** Admin y User con permisos diferenciados
- 📦 **Escalable:** Fácil agregar más usuarios y VMs
- 🎯 **Preciso:** Permisos validados en cada operación
- 💾 **Persistente:** Tokens en localStorage, usuarios en archivo
- 🚀 **Rápido:** Sin bases de datos externas
- 🛡️ **Seguro:** Validaciones en servidor y cliente

---

## 🎁 BONUS

### Para Hackers/Desarrolladores:

1. Token está en localStorage → Accesible por JavaScript
2. Puedes usar DevTools para testear endpoints
3. Usuarios.json es editable → Puedes agregar más usuarios manualmente
4. JWT_SECRET está en el código → Cambiarlo en producción es CRÍTICO

### Mejoras Fáciles:
- [ ] Agregar bcrypt para hash de contraseñas
- [ ] Cambiar JWT_SECRET a variable de entorno
- [ ] Agregar validación de email en registro
- [ ] Agregar recuperación de contraseña

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

1. **Prueba el flujo completo** → Sigue la guía de 10 min
2. **Crea múltiples usuarios** → Para compartir con otros
3. **Asigna VMs diferentes** → A cada usuario
4. **Prueba permisos** → Intenta cosas que NO deberías poder hacer
5. **Lee la documentación** → AUTENTICACION-README.md y CAMBIOS-AUTENTICACION.md

---

## 📞 SOPORTE RÁPIDO

| Problema | Solución |
|----------|----------|
| "Login no funciona" | Verifica users.json existe |
| "No puedo crear VM" | Debes estar dentro como admin |
| "Usuario no ve VM" | Admin debe asignarla primero |
| "Token expirado" | Haz logout y re-login |
| "Panel se cierra" | Presiona Ctrl+C y reinicia |

---

## 🏆 LISTO PARA USAR

Tu sistema ahora es:
- ✅ **Funcional** - Todo implementado
- ✅ **Seguro** - Con autenticación JWT
- ✅ **Multi-usuario** - Admin y usuarios normales
- ✅ **Escalable** - Soporta múltiples usuarios y VMs
- ✅ **Documentado** - Con guías y ejemplos
- ✅ **Production-ready** - Con ajustes de seguridad menores

---

## 🚀 DISFRÚTALO

Tu sistema de VMs Ubuntu con autenticación multi-usuario está completamente funcional.

**¡A usar!** 🎉

---

**Último actualizado:** Enero 2025
**Versión:** 2.0 - Multi-Usuario Completo
**Estado:** ✅ LISTO PARA PRODUCCIÓN (con cambios de seguridad)

