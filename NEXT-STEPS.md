## 🎯 Próximos Pasos - Sistema Completo de Autenticación

¡Tu sistema de VMs ahora tiene **autenticación multi-usuario completa**! 🎉

### ✅ Lo que Se Acaba de Implementar

1. **Sistema JWT completo** - Tokens seguros de 24 horas
2. **Página de login** - Interfaz profesional para autenticarse
3. **Control de acceso** - Admin vs Usuarios normales
4. **Protección de API** - Todos los endpoints requieren autenticación
5. **Asignación de VMs** - Los admins pueden asignar VMs a usuarios específicos
6. **Interfaz adaptable** - El panel muestra diferentes opciones según el rol

---

## 🚀 Cómo Probar Ahora

### Paso 1: Preparar el entorno (Si no lo has hecho)

```powershell
cd "tu-ruta\Documents\VS"
.\configurar.ps1
```

⏱️ Espera a que termine (5-10 minutos en la primera ejecución)

### Paso 2: Iniciar el panel

```powershell
.\iniciar.ps1
```

Verás salida similar a:
```
Iniciando contenedor del panel web...
El panel web está disponible en http://localhost:3000
```

### Paso 3: Abrir en el navegador

Abre: **http://localhost:3000**

✅ Deberías ver la **página de login** (no el panel directamente)

---

## 🔐 Credenciales de Prueba

### Cuenta Administrador
```
Usuario:    admin
Contraseña: admin123
```
**Permisos:** Crear VMs, eliminar VMs, gestionar usuarios

### Cuenta Usuario Operador
```
Usuario:    usuario1
Contraseña: user123
```
**Permisos:** Usar VMs asignadas (iniciar, detener, ver configuración)

---

## 🧪 Flujo de Prueba Recomendado

### 1️⃣ Login como Admin
- Usuario: `admin`
- Contraseña: `admin123`
- Verás: Botón "➕ Crear Nueva VM" **VISIBLE**
- Verás: Botón "🗑️ Eliminar" en cada VM **VISIBLE**

### 2️⃣ Crear una VM de Prueba
- Haz clic en "➕ Crear Nueva VM"
- Nombre: `prueba-1`
- CPUs: `1`
- Memoria: `1`
- Espera a que se cree (~1 minuto)

### 3️⃣ Probar Funcionamiento Admin
- Haz clic en "⚙️ Config" en la VM
- Modifica los recursos (ej: 2 CPUs)
- Prueba botones: ▶️ Iniciar, 🔄 Reiniciar, ⏹️ Detener

### 4️⃣ Logout y Login como Usuario
- Haz clic en "Cerrar Sesión" (esquina superior)
- Usuario: `usuario1`
- Contraseña: `user123`
- ❌ **NO** verás botón "➕ Crear Nueva VM"
- ❌ **NO** verás botón "🗑️ Eliminar"
- ✅ Pero **tampoco** verás la VM (porque no fue asignada)

### 5️⃣ Asignar VM al Usuario (Como Admin)
Logout y vuelve a admin, luego ejecuta:

```bash
# En PowerShell (reemplaza <TOKEN> con tu token JWT)
curl -X POST http://localhost:3000/api/assign-vm `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." `
  -d '{
    "userId": 2,
    "vmName": "ubuntu-prueba-1"
  }'
```

⚠️ **ALTERNATIVA MÁS FÁCIL:**
- Usa Postman o Thunder Client (extensiones de VS Code)
- POST a: `http://localhost:3000/api/assign-vm`
- Header: `Authorization: Bearer <TU_TOKEN_JWT>`
- Body JSON:
  ```json
  {
    "userId": 2,
    "vmName": "ubuntu-prueba-1"
  }
  ```

### 6️⃣ Verificar Asignación
- Logout (usuario1)
- Login como `usuario1` nuevamente
- ✅ Ahora **SÍ** verá la VM "prueba-1"
- ✅ Puede iniciar/detener
- ❌ **NO** puede eliminar

---

## 📱 Características Principales

### En el Panel Web

#### Para Todos:
- 📋 Lista de VMs asignadas
- 🔌 Puerto SSH visible
- 📊 Estado en tiempo real
- 📝 Ver logs de la VM
- 📋 Copiar comando SSH con un clic

#### Para Admin Únicamente:
- ➕ Crear nuevas VMs
- 📊 Ver TODAS las VMs (no solo asignadas)
- 🗑️ Eliminar VMs (botón rojo)

#### Para Usuarios:
- ▶️ Iniciar VM
- ⏹️ Detener VM
- 🔄 Reiniciar VM
- ⚙️ Ver/Modificar configuración
- 📝 Ver logs

---

## 🔑 Para Obtener Tu Token JWT

Si necesitas el token para APIs o Postman:

### 1. Desde el navegador (DevTools)
- Abre DevTools (F12)
- Ve a "Aplicación" → "LocalStorage"
- Busca `token`
- Cópialo

### 2. O haz un POST a login
```bash
curl -X POST http://localhost:3000/api/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'
```

Respuesta:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {...}
}
```

---

## 🛠️ Estructura de Carpetas

```
tu-proyecto/
├── web-panel/
│   ├── server.js           ← Lógica de autenticación + API
│   ├── users.json          ← Base de datos de usuarios
│   ├── package.json        ← Dependencias (con jsonwebtoken)
│   └── public/
│       ├── index.html      ← Panel principal
│       ├── login.html      ← Nueva: Página de login
│       ├── login.js        ← Nueva: Lógica de login
│       ├── script.js       ← Actualizado: Con autenticación
│       └── styles.css      ← Estilos (con logout button)
├── Dockerfile              ← Imagen base Ubuntu
├── docker-compose.yml
├── configurar.ps1
├── iniciar.ps1
└── README.md
```

---

## 🔗 Endpoints de API (Para Desarrolladores)

### Sin Autenticación
- `POST /api/login` - Obtener token JWT

### Con Autenticación (Header: `Authorization: Bearer <TOKEN>`)

**Lectura:**
- `GET /api/vms` - Listar VMs del usuario
- `GET /api/vm/:name/status` - Estado de una VM
- `GET /api/vm/:name/logs` - Logs de una VM

**Escritura:**
- `POST /api/vm/:name/start` - Iniciar VM
- `POST /api/vm/:name/stop` - Detener VM
- `POST /api/vm/:name/restart` - Reiniciar VM
- `POST /api/vm/:name/config` - Actualizar configuración
- `DELETE /api/vm/:name` - Eliminar VM (admin only)
- `POST /api/vm/create` - Crear VM (admin only)

### Admin Only
- `POST /api/register-user` - Crear nuevo usuario
- `POST /api/assign-vm` - Asignar VM a usuario
- `POST /api/revoke-vm` - Revocar acceso a VM
- `GET /api/users` - Listar todos los usuarios

---

## ⚙️ Cambios en el Código

### Files Modificados:
- ✏️ `web-panel/server.js` - Autenticación + middlewares + endpoints de gestión
- ✏️ `web-panel/public/script.js` - Token handling + UI adaptable
- ✏️ `web-panel/public/index.html` - Área de usuario + botones condicionales
- ✏️ `web-panel/package.json` - Agregada dependencia `jsonwebtoken`
- ✏️ `web-panel/public/styles.css` - Estilos para logout button

### Archivos Nuevos:
- ✨ `web-panel/public/login.html` - Página de login
- ✨ `web-panel/public/login.js` - Lógica de login
- ✨ `web-panel/users.json` - BD de usuarios (se crea automáticamente)

---

## ⚠️ Notas Importantes

1. **Tokens expiran en 24 horas** - El usuario será redirigido a login
2. **Contraseñas en plaintext** - Por desarrollo. En producción usar bcrypt.
3. **JWT_SECRET debe cambiar** - En producción, cambiar la constante en server.js
4. **LocalStorage es local** - Los tokens se pierden al borrar datos del navegador
5. **Permisos estrictos** - Los usuarios solo ven/usan sus VMs asignadas

---

## 🎓 Esquema de Datos

### Usuario en users.json
```json
{
  "id": 1,
  "username": "admin",
  "password": "admin123",
  "role": "admin",
  "accessibleVMs": ["ubuntu-vm1", "ubuntu-vm2"]
}
```

### Token JWT
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "id": 1, "username": "admin", "role": "admin", "iat": ..., "exp": ... }
Signature: HMAC-SHA256(header.payload, JWT_SECRET)
```

---

## 🐛 Si Algo No Funciona

### Problema: "Acceso denegado" en login
- Verifica: `web-panel/users.json` existe
- Verifica: Contraseña es exactamente `admin123` o `user123`

### Problema: Tokens expiran rápido
- Aumenta `expiresIn: '24h'` en server.js línea ~92
- O usa `expiresIn: '7d'` para 7 días

### Problema: VM no aparece para usuario
- Asegúrate de ejecutar `/api/assign-vm` con el vmName correcto
- Verifica: Incluye el prefijo `ubuntu-` en el nombre

### Problema: El panel se bloquea
- Presiona `Ctrl+C` en la terminal
- Ejecuta `.\iniciar.ps1` nuevamente

---

## 📧 Estructura de Respuestas de API

### Login Exitoso
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### Error 401 (Token Expirado)
```json
{
  "error": "Token inválido",
  "success": false
}
```

### Error 403 (Sin Permiso)
```json
{
  "error": "Acceso denegado. Solo administradores pueden hacer esto.",
  "success": false
}
```

---

## ✨ Qué sigue

**Todas estas características están implementadas y listas:**
- ✅ Autenticación JWT
- ✅ Rol Based Access Control
- ✅ Página de login
- ✅ Gestión de usuarios
- ✅ Asignación de VMs
- ✅ API protegida
- ✅ UI adaptable

**Bonus ideas si quieres extender:**
- 🔐 Hash de contraseñas con bcrypt
- 💾 Base de datos PostgreSQL
- 📧 Email de registro automático
- 📱 Panel de administración avanzado
- 🔔 Notificaciones de estado de VM
- 📊 Estadísticas de uso
- 🌐 HTTPS con certificados

---

¡**Tu sistema es completamente funcional! 🎉**

Ahora puedes:
1. Crear múltiples VMs
2. Compartir con otros usuarios
3. Controlar el acceso por rol
4. Gestionar permiso

Pruébalo y disfruta 🚀

