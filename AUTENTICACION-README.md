# 🖥️ Panel de Control - Ubuntu VMs con Autenticación Multi-Usuario

Sistema completo de administración de máquinas virtuales Ubuntu con:
- ✅ Autenticación JWT
- ✅ Control de acceso basado en roles (Admin/Usuario)
- ✅ Creación dinámica de VMs
- ✅ Panel web intuitivo
- ✅ Acceso SSH directo desde Windows

## 📋 Requisitos Previos

- Docker Desktop (con WSL2 en Windows)
- PowerShell (Windows)
- Node.js 18+ (incluido en el contenedor del panel)
- Git (opcional)

## 🚀 Inicio Rápido

### Paso 1: Preparar el entorno de Docker

```powershell
# Ejecutar desde la carpeta del proyecto
.\configurar.ps1
```

Este script:
- Construye la imagen base de Ubuntu (`ubuntu-vm-image`)
- Instala dependencias necesarias en el panel
- Prepara el entorno para crear VMs

**⏱️ Este proceso toma 5-10 minutos en la primera ejecución.**

### Paso 2: Iniciar el panel

```powershell
.\iniciar.ps1
```

El panel web estará disponible en: **http://localhost:3000**

### Paso 3: Iniciar sesión

Accede con las credenciales de prueba:

**👨‍💼 Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

**👤 Usuario Normal:**
- Usuario: `usuario1`
- Contraseña: `user123`

## 👥 Roles y Permisos

### 👨‍💼 Administrador (`admin`)
- ✅ Ver todas las VMs
- ✅ Crear nuevas VMs
- ✅ Modificar configuración de recursos
- ✅ Detener y reiniciar VMs
- ✅ Eliminar VMs
- ✅ Asignar VMs a usuarios

### 👤 Usuario Normal (`user`)
- ✅ Ver solo sus VMs asignadas
- ✅ Iniciar/Detener sus VMs
- ✅ Modificar configuración de sus VMs
- ✅ Ver logs de sus VMs
- ❌ NO puede crear nuevas VMs
- ❌ NO puede eliminar VMs
- ❌ NO puede asignar VMs a otros usuarios

## 💻 Cómo Conectarse por SSH

### Desde Windows PowerShell

```powershell
ssh ubuntu@localhost -p 2222
```

Contraseña: `ubuntu123`

### Notas sobre Puertos SSH

- Primera VM: puerto 2222
- Segunda VM: puerto 2223
- Tercera VM: puerto 2224
- Etc.

**El puerto se asigna automáticamente.**

## 🛠️ Gestión de Usuarios (Para Administradores)

### Crear un Nuevo Usuario

```bash
curl -X POST http://localhost:3000/api/register-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -d '{
    "username": "nuevoUsuario",
    "password": "suContraseña"
  }'
```

### Asignar una VM a un Usuario

```bash
curl -X POST http://localhost:3000/api/assign-vm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -d '{
    "userId": 2,
    "vmName": "ubuntu-miVm"
  }'
```

### Revocar Acceso a una VM

```bash
curl -X POST http://localhost:3000/api/revoke-vm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -d '{
    "userId": 2,
    "vmName": "ubuntu-miVm"
  }'
```

## 📁 Estructura del Proyecto

```
.
├── Dockerfile              # Imagen base for Ubuntu VMs
├── docker-compose.yml      # Orquestación de servicios
├── configurar.ps1          # Script para preparar entorno
├── iniciar.ps1             # Script para iniciar panel
├── web-panel/
│   ├── server.js           # Backend Node.js Express
│   ├── package.json        # Dependencias
│   ├── users.json          # Base de datos de usuarios
│   └── public/
│       ├── index.html      # Panel principal
│       ├── login.html      # Página de login
│       ├── script.js       # Lógica del panel
│       ├── login.js        # Lógica de login
│       └── styles.css      # Estilos
└── README.md               # Este archivo
```

## 🔐 Seguridad

### Sobre las Contraseñas

⚠️ **Nota de Seguridad:** En esta versión de prueba, las contraseñas se almacenan en plaintext en `users.json`. 

**Para producción, deberías:**
- Usar bcrypt para hashing de contraseñas
- Usar una base de datos segura (PostgreSQL, MongoDB)
- Usar HTTPS en lugar de HTTP
- Cambiar el `JWT_SECRET` en el código

### Tokens JWT

- Duración: 24 horas
- Se almacenan en localStorage del navegador
- Se incluyen en cada petición al servidor

## 🐛 Troubleshooting

### "Error: Image base not constructed"

**Solución:** Ejecuta `.\configurar.ps1` primero para construir la imagen base.

### "No puedo conectarme por SSH"

**Verifica:**
1. ¿Está la VM iniciada? (Debería tener estado "En Ejecución")
2. ¿Usas el puerto correcto?
3. ¿Tienes SSH instalado en Windows? (Incluido en Windows 10+)

### "Acceso denegado al crear VM"

**Posibles razones:**
- Solo los administradores pueden crear VMs
- Verifica que estés logueado con la cuenta `admin`

### El panel se cierra o no responde

**Solución:**
1. Cierra con `Ctrl+C`
2. Ejecuta nuevamente: `.\iniciar.ps1`

## 📞 Soporte

Si experimentas problemas:

1. Verifica los logs del panel en la terminal
2. Asegúrate de que Docker Desktop esté corriendo
3. Intenta reiniciar: `.\iniciar.ps1`

## 📝 Cambios Recientes

### v2.0 - Autenticación Multi-Usuario
- ✨ Sistema JWT completo
- ✨ Rol Based Access Control (RBAC)
- ✨ Página de login
- ✨ Protección de endpoints API
- ✨ Gestión de usuarios
- ✨ Asignación de VMs a usuarios

### v1.0 - Sistema Inicial
- Operación de VM única
- Panel web básico
- Acceso SSH

## 📄 Licencia

Este proyecto está disponible para uso personal y educativo.

---

**Última actualización:** Enero 2025
**Estado:** Funcional y Listo para Usar
