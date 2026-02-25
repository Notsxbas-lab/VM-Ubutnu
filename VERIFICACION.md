## ✅ CHECKLIST DE VERIFICACIÓN - Sistema Multi-Usuario

Usa este checklist para verificar que todo está funcionando correctamente.

---

## 🔧 Verificación Técnica (Terminal)

### 1. Archivos Creados/Modificados Existen
```powershell
# ✅ Archivos NUEVOS
test-path web-panel/public/login.html       # Debe ser: True
test-path web-panel/public/login.js         # Debe ser: True
test-path web-panel/users.json              # Debe ser: True

# ✅ Archivos MODIFICADOS
test-path web-panel/server.js               # Debe ser: True
test-path web-panel/package.json            # Debe ser: True
test-path web-panel/public/script.js        # Debe ser: True
test-path web-panel/public/index.html       # Debe ser: True
test-path web-panel/public/styles.css       # Debe ser: True
```

### 2. Dependencies Instaladas
```powershell
# Verifica que jsonwebtoken esté en package.json
cat web-panel/package.json | findstr jsonwebtoken
# Debe mostrar: "jsonwebtoken": "^9.0.0"
```

### 3. Base de Datos de Usuarios
```powershell
# Verifica que users.json tenga usuarios
cat web-panel/users.json
# Debe mostrar usuarios Admin y usuario1
```

---

## 🌐 Verificación en Navegador

### Paso 1: Verificar Page Login
- [ ] Abre: http://localhost:3000
- [ ] Deberías ver: **Página de LOGIN** (no el panel directamente)
- [ ] Botón: "🔐 Panel VM" en el título
- [ ] Campos: Username y Password
- [ ] Botón: "Iniciar Sesión" (azul)
- [ ] Credenciales de prueba visibles al final

### Paso 2: Login Exitoso
- [ ] Ingresa: `admin` / `admin123`
- [ ] Mensaje: "✓ Autenticación exitosa. Redirigiendo..."
- [ ] Espera 1 segundo
- [ ] Deberías ver: **Panel principal con VMs**

### Paso 3: Verificar Interfaz Admin
En el panel principal deberías ver:
- [ ] Tu usuario: "👤 admin" (arriba a la derecha)
- [ ] Botón: "Cerrar Sesión" (rojo, arriba a la derecha)
- [ ] Botón: "➕ Crear Nueva VM" (verde, en el header)
- [ ] Botón: "🔄 Actualizar Lista" (gris)

### Paso 4: Verificar VM Cards (Si hay VMs)
En cada tarjeta de VM deberías ver:
- [ ] Nombre de la VM
- [ ] Puerto SSH
- [ ] Estado (En Ejecución / Detenida)
- [ ] Botones: ▶️ Iniciar, 🔄 Reiniciar
- [ ] Botones: ⏹️ Detener, ⚙️ Config
- [ ] Botón: 🗑️ Eliminar (ROJO, solo admin)

### Paso 5: Logout
- [ ] Haz click en: "Cerrar Sesión"
- [ ] Deberías regresar a: **Página de LOGIN**
- [ ] LocalStorage debe estar vacío

### Paso 6: Login Como Usuario Normal
- [ ] Usuario: `usuario1`
- [ ] Contraseña: `user123`
- [ ] Iniciar sesión
- [ ] Ver: "👤 usuario1" (arriba a la derecha)
- [ ] **NO** deberías ver: Botón "➕ Crear Nueva VM"
- [ ] **NO** deberías ver: Botón "🗑️ Eliminar" (en VMs)

### Paso 7: Crear VM Como Admin
- [ ] Logout
- [ ] Login como admin
- [ ] Click: "➕ Crear Nueva VM"
- [ ] Modal: "➕ Crear Nueva Máquina Virtual"
- [ ] Campos:
  - [ ] Nombre: `test-vm`
  - [ ] CPUs: `1`
  - [ ] Memoria: `1`
- [ ] Click: "✅ Crear VM"
- [ ] Espera ~1 minuto
- [ ] Deberías ver: Nueva VM en la lista
- [ ] Deberías ver: Puerto SSH asignado (2222)

---

## 🔐 Verificación de Autenticación

### Token en LocalStorage
```javascript
// En DevTools Console (F12):
localStorage.getItem('token')
// Debe devolver: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

localStorage.getItem('username')
// Debe devolver: "admin" o "usuario1"
```

### Token es JWT Válido
- [ ] Token tiene 3 partes: `xxxxx.yyyyy.zzzzz`
- [ ] Decodifica en: https://jwt.io
- [ ] Payload contiene: `id`, `username`, `role`

### API Requiere Autenticación
```bash
# En PowerShell, sin token debería estar ausente 401:
curl http://localhost:3000/api/vms
# Respuesta: {"error":"Token requerido","success":false}

# Con token válido:
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/vms
# Respuesta: {"vms":[...],"success":true,"isAdmin":true}
```

---

## 👥 Verificación de Permisos

### Admin - Permisos Completos
- [ ] Ve TODAS las VMs
- [ ] Ve botón "➕ Crear Nueva VM"
- [ ] Ve botón "🗑️ Eliminar" en cada VM
- [ ] Puede iniciar/parar/reiniciar
- [ ] Puede modificar configuración

### Usuario - Permisos Limitados
- [ ] Ve solo VMs asignadas (inicialmente: NINGUNA)
- [ ] **NO** ve botón "➕ Crear Nueva VM"
- [ ] **NO** ve botón "🗑️ Eliminar"
- [ ] Puede iniciar/parar/reiniciar (si asignada)
- [ ] Puede verificar logs (si asignada)

---

## 🧪 Test de Asignación de VM

### Como Admin: Asignar VM a Usuario
```bash
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
$header = @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"}
$body = @{userId=2;vmName="ubuntu-test-vm"} | ConvertTo-Json

curl -X POST http://localhost:3000/api/assign-vm `
  -HeadersHeader $header `
  -Body $body
```

### Como Usuario: Verificar Acceso
- [ ] Logout como admin
- [ ] Login como `usuario1`
- [ ] Debería ver ahora la VM asignada
- [ ] Debería poder iniciar/parar

### Como Usuario: Intentar Acceso Denegado
```bash
# Intentar acceder a VM no asignada:
curl -X POST http://localhost:3000/api/vm/otra-vm/start `
  -H "Authorization: Bearer <USER_TOKEN>"
# Respuesta: {"error":"No tienes acceso a esta VM","success":false}
```

---

## 🐛 Tests de Error

### Test 1: Token Expirado
```bash
# Esperar 24 horas O editar server.js a expiración rápida
curl -H "Authorization: Bearer <TOKEN_VIEJO>" http://localhost:3000/api/vms
# Respuesta: {"error":"Token inválido","success":false}
```

### Test 2: Token Inválido
```bash
curl -H "Authorization: Bearer xxxxx" http://localhost:3000/api/vms
# Respuesta: {"error":"Token inválido","success":false}
```

### Test 3: Sin Token
```bash
curl http://localhost:3000/api/vms
# Respuesta: {"error":"Token requerido","success":false}
```

### Test 4: Admin Requiere Permisos
```bash
curl -X POST http://localhost:3000/api/vm/create \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"test","cpus":"1","memory":"1"}'
# Respuesta: {"error":"Acceso denegado. Solo administradores...","success":false}
```

---

## 📊 Diagrama de Verificación Visual

```
INICIO
  ├─ ¿Ves página de LOGIN?
  │  ├─ No  → Problema con configuración
  │  └─ Sí  → ✅ OK
  │
  ├─ ¿Login con admin funciona?
  │  ├─ No  → Problema con autenticación
  │  └─ Sí  → ✅ OK
  │
  ├─ ¿Ves botón "Crear VM" como admin?
  │  ├─ No  → Problema con script.js
  │  └─ Sí  → ✅ OK
  │
  ├─ ¿Botón "Crear VM" DESAPARECE como usuario?
  │  ├─ No  → Problema con updateAdminUI()
  │  └─ Sí  → ✅ OK
  │
  ├─ ¿Logout limpia sesión?
  │  ├─ No  → Problema con logout()
  │  └─ Sí  → ✅ OK
  │
  └─ ¿Usuario ve solo sus VMs?
     ├─ No  → Problema con asignación
     └─ Sí  → ✅ SISTEMA FUNCIONAL
```

---

## 📈 Performance Checks

- [ ] Login tarda < 2 segundos
- [ ] Panel carga < 3 segundos
- [ ] VMs se actualizan cada 5 segundos
- [ ] Crear VM tarda ~1 minuto máximo
- [ ] Cambios de permisos son inmediatos
- [ ] Logout es instantáneo

---

## 🔍 DevTools Console Checks

En la consola del navegador (F12), NO debería haber:
- [ ] Errores JavaScript
- [ ] Errores de CORS
- [ ] Errores de fetch
- [ ] Advertencias de seguridad

Deberías ver:
- [ ] Token en localStorage
- [ ] Username en localStorage
- [ ] Llamadas API exitosas en Network tab

---

## 📱 Responsiveness

- [ ] Panel se ve bien en escritorio
- [ ] Panel se adapta en mobile (si lo abres)
- [ ] Botones son escificables
- [ ] Texto es legible
- [ ] Formularios son funcionales

---

## 🔐 Seguridad Checks

- [ ] Las contraseñas NO se envían en URL
- [ ] Los tokens NO se muestran en Network tab (están en headers)
- [ ] El logout limpia localStorage
- [ ] Las sesiones sin token redirigen a login
- [ ] Los botones admin no están ejecutables sin autenticación

---

## ✨ RESULTADO FINAL

Si todos los checks están ✅, entonces tu sistema está:
- ✅ Instalado correctamente
- ✅ Autenticado y funcional
- ✅ Con permisos trabajando
- ✅ Listo para usar
- ✅ Listo para extender

---

## 📝 Notas Finales

Si algo falla:
1. Revisa la consola del navegador (DevTools F12)
2. Revisa la terminal donde corre `.\iniciar.ps1`
3. Busca mensajes de error rojo
4. Reinicia: `Ctrl+C` y `.\iniciar.ps1`
5. Borra cache: `Ctrl+Shift+Del` en navegador

---

**Checklist Completado:** [ ]

Cuando todas las verificaciones pasen, tu sistema está 100% funcional.

¡Disfrútalo! 🚀

