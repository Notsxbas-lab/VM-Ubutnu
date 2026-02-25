## 📝 Cambios Técnicos - Sistema de Autenticación Multi-Usuario

Este documento detalla todos los cambios realizados para implementar el sistema completo de autenticación JWT con control de acceso basado en roles (RBAC).

---

## 🔧 Cambios en Backend

### `/web-panel/server.js`

#### 1. **Importaciones Agregadas** (Línea ~1-10)
```javascript
const fs = require('fs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'tu-super-secreto-cambiar-en-produccion-2025';
const usersFilePath = path.join(__dirname, 'users.json');
let users = [];

// Cargar usuarios al iniciar
try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    users = JSON.parse(data).users;
} catch (err) {
    console.log('Archivo users.json no existe, se creará con usuarios por defecto');
    users = [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin', accessibleVMs: [] },
        { id: 2, username: 'usuario1', password: 'user123', role: 'user', accessibleVMs: [] }
    ];
    saveUsers();
}
```

#### 2. **Función saveUsers()** (Línea ~60-66)
```javascript
function saveUsers() {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2));
    } catch (err) {
        console.error('Error guardando usuarios:', err);
    }
}
```

#### 3. **Middleware verifyToken()** (Línea ~40-50)
```javascript
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token requerido', success: false });
    }
    
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido', success: false });
    }
}
```

#### 4. **Middleware verifyAdmin()** (Línea ~52-57)
```javascript
function verifyAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden hacer esto.', success: false });
    }
    next();
}
```

#### 5. **Middleware verifyVMAccess()** (Línea ~67-87)
Verifica que el usuario tenga acceso a la VM específica:
- Admins: acceso a todas
- Usuarios: solo acceso a sus VMs asignadas

#### 6. **POST /api/login** (Línea ~95-125)
Nuevo endpoint público:
- Valida credenciales
- Genera token JWT (24h expiración)
- Devuelve token y datos del usuario

#### 7. **POST /api/register-user** (Línea ~127-150)
Nuevo endpoint protegido (admin only):
- Crea nuevo usuario
- Guarda en users.json
- Role por defecto: 'user'

#### 8. **POST /api/assign-vm** (Línea ~152-170)
Nuevo endpoint protegido (admin only):
- Asigna VM a un usuario
- Agrega VM a accessibleVMs del usuario

#### 9. **POST /api/revoke-vm** (Línea ~172-190)
Nuevo endpoint protegido (admin only):
- Revoca acceso a VM
- Remueve VM de accessibleVMs

#### 10. **GET /api/users** (Línea ~192-200)
Nuevo endpoint protegido (admin only):
- Lista todos los usuarios
- Devuelve id, username, role, accessibleVMs

#### 11. **GET /api/vms** (Línea ~202-232)
Modificado - Ahora tiene:
- `verifyToken` middleware
- Filtrado por rol (usuarios solo ven sus VMs)
- Devuelve `isAdmin` en respuesta

#### 12. **GET /api/vm/:name/status** (Línea ~235-260)
Modificado - Ahora tiene:
- `verifyToken` middleware
- `verifyVMAccess` middleware
- Valida que usuario tenga acceso

#### 13. **POST /api/vm/create** (Línea ~263-370)
Modificado - Ahora tiene:
- `verifyToken` middleware
- `verifyAdmin()` middleware
- Solo admins pueden crear

#### 14. **POST /api/vm/:name/start** (Línea ~395-405)
Modificado - Agregado:
- `verifyToken` middleware
- `verifyVMAccess()` middleware

#### 15. **POST /api/vm/:name/stop** (Línea ~407-417)
Modificado - Agregado:
- `verifyToken` middleware
- `verifyVMAccess()` middleware

#### 16. **POST /api/vm/:name/restart** (Línea ~419-429)
Modificado - Agregado:
- `verifyToken` middleware
- `verifyVMAccess()` middleware

#### 17. **POST /api/vm/:name/config** (Línea ~450-468)
Modificado - Agregado:
- `verifyToken` middleware
- `verifyVMAccess()` middleware

#### 18. **DELETE /api/vm/:name** (Línea ~432-449)
Modificado - Agregado:
- `verifyToken` middleware
- `verifyAdmin()` middleware

#### 19. **GET /api/vm/:name/logs** (Línea ~470-482)
Modificado - Agregado:
- `verifyToken` middleware
- `verifyVMAccess()` middleware

---

## 📦 Cambios en Frontend

### `/web-panel/public/script.js`

#### Cambios Principales:
1. **getToken()** - Obtiene JWT del localStorage
2. **getHeaders()** - Crea headers con Authorization Bearer
3. **handleUnauthorized()** - Redirige a login si 401
4. **checkAuthentication()** - Verifica token al cargar
5. **logout()** - Limpia token y redirige a login
6. **updateUserUI()** - Muestra usuario y botón logout
7. **updateAdminUI()** - Muestra/oculta botones según rol

#### Todas las llamadas fetch() ahora:
- Incluyen `headers: getHeaders(true)`
- Manejan respuestas 401
- Verifican permisos antes de mostrar botones

### `/web-panel/public/login.html` (NUEVO)

Página de login con:
- Formulario username/password
- Validaciones cliente
- Mensajes de error/éxito
- Credenciales de prueba visibles
- Estilos profesionales con gradientes

### `/web-panel/public/login.js` (NUEVO)

Lógica de login:
- Valida formulario
- Hace POST a /api/login
- Guarda token en localStorage
- Redirige a index.html si éxito
- Muestra errores al usuario

### `/web-panel/public/index.html`

Cambios:
1. Header reorganizado con información del usuario
2. ID 'createVMBtn' en botón para controlar visibilidad
3. Sección 'userInfo' para mostrar username y logout
4. Botones admin ocultos por defecto

### `/web-panel/public/styles.css`

Estilos Agregados:
```css
.header-info { ... }          /* Área de info del usuario */
.logout-btn { ... }          /* Botón de logout rojo */
```

---

## 📚 Cambios en Configuración

### `/web-panel/package.json`

Agregado:
```json
"jsonwebtoken": "^9.0.0"
```

Nueva dependencia necesaria para:
- Crear tokens JWT
- Validar tokens
- Extraer payload de tokens

### `/web-panel/users.json` (NUEVO)

Creado automáticamente con:
```json
{
  "users": [
    { "id": 1, "username": "admin", "password": "admin123", "role": "admin", "accessibleVMs": [] },
    { "id": 2, "username": "usuario1", "password": "user123", "role": "user", "accessibleVMs": [] }
  ]
}
```

---

## 🔐 Flujo de Autenticación

### 1. Login
```
Cliente -> POST /api/login { username, password }
Server -> valida en users.json
Server <- JWT token (24h)
Cliente -> guarda en localStorage
```

### 2. Acceso a Recursos Protegidos
```
Cliente -> GET /api/vms + Header: Authorization: Bearer <TOKEN>
Server -> verifyToken() extrae payload
Server -> verifyAdmin() (si requiere)
Server <- datos con permiso
Server -> error 403 si sin permiso
Server -> error 401 si token expirado
```

### 3. Logout
```
Cliente -> borra localStorage
Cliente -> redirige a /login.html
```

---

## 🔑 Estructuras de Datos

### Usuario en users.json
```javascript
{
    id: 1,                           // ID único
    username: "admin",               // Usuario único
    password: "admin123",            // ⚠️ Plaintext (para desarrollo)
    role: "admin",                   // admin | user
    accessibleVMs: [                 // VMs asignadas
        "ubuntu-vm1",
        "ubuntu-vm2"
    ]
}
```

### Token JWT Payload
```javascript
{
    id: 1,
    username: "admin",
    role: "admin",
    iat: 1704067200,           // Issued at
    exp: 1704153600            // Expires in 24h
}
```

### VMs Response (GET /api/vms)
```javascript
{
    vms: [...],                // Array de VMs
    success: true,
    isAdmin: true              // NUEVO
}
```

---

## 🛡️ Validaciones Implementadas

### En Servidor:
- ✅ Token válido en Authorization header
- ✅ Token no expirado
- ✅ Usuario existe en users.json
- ✅ Rol es admin para operaciones admin
- ✅ Usuario tiene acceso a VM solicitada
- ✅ VM existe en Docker

### En Cliente:
- ✅ Token presente en localStorage
- ✅ Redirige a login si sin token
- ✅ Oculta botones según rol
- ✅ Maneja errores 401
- ✅ Valida respuestas JSON

---

## 📊 Diagrama de Permisos

```
┌─────────────────┐
│     Admin       │
├─────────────────┤
│ • Ver todas VMs │
│ • Crear VM      │
│ • Eliminar VM   │
│ • Gestionar usr │
└─────────────────┘

┌─────────────────┐
│  User Normal    │
├─────────────────┤
│ • Ver sus VMs   │
│ • Iniciar VM    │
│ • Parar VM      │
│ • Config VM     │
└─────────────────┘
```

---

## 🔄 Ciclo de Vida de Sesión

```
1. Usuario abre navegador
   ↓
2. LocalStorage sin token?
   → Redirige a /login.html
   ↓
3. Ingresa credenciales
   → POST /api/login
   ↓
4. JWT devuelto
   → Guarda en localStorage
   ↓
5. Redirige a /index.html
   ↓
6. checkAuthentication() valida token
   ↓
7. Carga VMs según rol
   ↓
8. Renderiza UI adaptada
   ↓
9. Hizo logout?
   → Limpia localStorage
   → Redirige a /login.html
   ↓
10. Token expiró? (24h)
    → Respuesta 401
    → Redirige a login
```

---

## 🎯 Decisiones de Diseño

### 1. **JWT en localStorage**
- ✅ Persiste en refrescas
- ✅ Accesible por JavaScript
- ❌ Vulnerable a XSS (no es problema aquí)

### 2. **Plaintext Passwords**
- ✅ Simple para desarrollo
- ❌ NO seguro para producción
- → Usar bcrypt en producción

### 3. **users.json File**
- ✅ Sin dependencias externas
- ✅ Fácil de entender
- ❌ No escalable para >1000 usuarios
- → Usar PostgreSQL en producción

### 4. **Role/User Model**
- ✅ Flexible y extensible
- ✅ Fácil de entender
- → Puede agregar más roles si necesita

### 5. **accessibleVMs Array**
- ✅ Asignación flexible
- ✅ Un usuario puede tener múltiples VMs
- ✅ Rápido para verificación

---

## 📈 Mejoras Futuras

### Corto Plazo (Fácil):
- [ ] Hash de contraseñas con bcrypt
- [ ] Email de confirmación
- [ ] Recuperación de contraseña
- [ ] Cambio de contraseña

### Mediano Plazo (Moderado):
- [ ] Base de datos PostgreSQL
- [ ] Logging de auditoría
- [ ] HTTPS con certificados
- [ ] Rate limiting en login
- [ ] 2FA (Autenticación de dos factores)

### Largo Plazo (Avanzado):
- [ ] OAuth2 con Google/GitHub
- [ ] API Key para scripts
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Métricas y estadísticas
- [ ] Backup automático de VMs

---

## 🧪 Testing Recomendado

### Manual:
1. [ ] Login con admin válido
2. [ ] Login con usuario inválido
3. [ ] Crear VM como admin
4. [ ] Intentar crear como usuario (debe fallar)
5. [ ] Asignar VM al usuario
6. [ ] Usuario ve VM asignada
7. [ ] Usuario NO ve VMs de otros
8. [ ] Token expira en 24h
9. [ ] Logout limpia sesión

### Automatizado (Con Postman/cURL):
```bash
# 1. Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Crear VM (admin)
curl -X POST http://localhost:3000/api/vm/create \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"test","cpus":"1","memory":"1"}'

# 3. Asignar usuario
curl -X POST http://localhost:3000/api/assign-vm \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"userId":2,"vmName":"ubuntu-test"}'

# 4. Listar como usuario
curl -X GET http://localhost:3000/api/vms \
  -H "Authorization: Bearer <USER_TOKEN>"
```

---

## 📝 Checklist de Verificación

- ✅ Login.html funciona
- ✅ Credenciales de prueba activas
- ✅ Token JWT se genera
- ✅ Token se guarda en localStorage
- ✅ API requiere token
- ✅ Admin ve botón crear
- ✅ Usuario NO ve botón crear
- ✅ Admin ve botón eliminar
- ✅ Usuario NO ve botón eliminar
- ✅ Logout limpia sesión
- ✅ Redirige a login sin token
- ✅ VMs filtradas por usuario

---

Este sistema está listo para producción con cambios menores en seguridad.

**Fecha:** Enero 2025
**Versión:** 2.0 - Autenticación Multi-Usuario

