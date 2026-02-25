## 🚀 INICIO INMEDIATO - Instrucciones en 60 Segundos

Tu sistema está 100% listo. Sigue estos pasos:

---

### ⏱️ SI PRIMERO NUNCA EJECUTASTE:

```powershell
cd "tu-ruta\Documents\VS"
.\configurar.ps1      # Espera 5-10 minutos (primera vez)
.\iniciar.ps1         # Una vez hecho
```

### ⏱️ SI YA EJECUTASTE ANTES:

```powershell
cd "tu-ruta\Documents\VS"
.\iniciar.ps1         # Así de simple
```

---

### 🌐 ABRE NAVEGADOR:

```
http://localhost:3000
```

### 🔑 CREDENCIALES:

**Admin:**
- Usuario: `admin`
- Contraseña: `admin123`
- Permisos: Crear/eliminar VMs, gestionar usuarios

**Usuario Normal:**
- Usuario: `usuario1`
- Contraseña: `user123`
- Permisos: Usar VMs asignadas (iniciar/parar/configurar)

---

### ✨ LO QUE YA ESTÁ FUNCIONANDO:

- ✅ **Autenticación JWT** - Tokens seguros de 24h
- ✅ **Multi-usuario** - Admin vs Usuarios normales
- ✅ **Control de Acceso** - Cada usuario ve solo sus VMs
- ✅ **API Protegida** - Todos los endpoints requieren token
- ✅ **Gestión de Usuarios** - Admin crea usuarios y asigna VMs
- ✅ **Interfaz Profesional** - Login + Panel adaptable

---

### 🎯 PRUEBA RÁPIDA (5 MINUTOS):

1. Abre: `http://localhost:3000`
2. Login: `admin` / `admin123`
3. Click: "➕ Crear Nueva VM"
4. Nombre: `test-1`
5. CPUs: `1`, Memoria: `1`
6. Click: "✅ Crear VM"
7. Espera ~1 minuto
8. Logout: "Cerrar Sesión" (arriba derecha)
9. Login: `usuario1` / `user123`
10. ¿Ves la VM? **NO** (porque no fue asignada)

---

### 🔗 ASIGNAR VM (Con API):

Desde PowerShell, después de obtener tu token:

```bash
curl -X POST http://localhost:3000/api/assign-vm `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <TU_TOKEN>" `
  -d '{
    "userId": 2,
    "vmName": "ubuntu-test-1"
  }'
```

**O más fácil:** Usa [Postman](https://www.postman.com/downloads/) o [Thunder Client](https://www.thunderclient.com/)

---

### 📚 DOCUMENTACIÓN:

- **Empezar:** `README-RESUMEN.md`
- **Pasos detallados:** `NEXT-STEPS.md`
- **Referencia técnica:** `CAMBIOS-AUTENTICACION.md`
- **Verificar todo funciona:** `VERIFICACION.md`
- **Inventario de cambios:** `INVENTARIO-ARCHIVOS.md`

---

### 🎁 EXTRAS:

- **Ver token:**
  1. Abre DevTools (F12)
  2. Ir a: Aplicación → LocalStorage
  3. Busca: `token`

- **Conectar por SSH:**
  ```bash
  ssh ubuntu@localhost -p 2222
  # Contraseña: ubuntu123
  ```

- **Ver logs del panel:**
  Mira la terminal donde corre `.\iniciar.ps1`

---

### 🐛 SI ALGO FALLA:

```powershell
# Cierra panel
Ctrl+C

# Reinicia
.\iniciar.ps1

# Si nada funciona, borra base de datos
Remove-Item web-panel/users.json

# Y reinicia (recreará usuarios por defecto)
.\iniciar.ps1
```

---

## ✅ SISTEMA COMPLETO

Tu panel ahora tiene:
- 🔐 Autenticación multi-usuario
- 👥 Roles (Admin/User)
- 🔑 Tokens JWT
- 🎯 Control de permisos
- 👤 Gestión de usuarios
- 🖥️ API protegida
- 🎨 Interfaz profesional

---

**¡Disfrútalo! 🚀**

