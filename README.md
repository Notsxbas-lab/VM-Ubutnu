# 🖥️ Sistema Multi-VM Ubuntu con Panel Web

Sistema completo que te permite **crear y gestionar múltiples máquinas virtuales Ubuntu** con acceso SSH desde Windows y un panel web para administrarlas todas desde un solo lugar.

## 📋 Características

- ✅ **Múltiples VMs Ubuntu 22.04 LTS** - Crea tantas como necesites
- ✅ **Gestión desde el navegador** - Panel web intuitivo
- ✅ **Acceso SSH independiente** - Cada VM tiene su propio puerto
- ✅ **Control individual** - Inicia, detén, reinicia cada VM por separado
- ✅ **Configuración personalizada** - CPU y RAM configurables por VM
- ✅ **Monitoreo en tiempo real** - Estadísticas de cada VM
- ✅ **Nombres personalizados** - Dale el nombre que quieras a cada VM
- ✅ **Creación dinámica** - Crea y elimina VMs sin reiniciar
- ✅ **Visualización de logs** - Por cada VM individualmente
- ✅ **Auto-asignación de puertos** - Puertos SSH automáticos

## 🔧 Requisitos Previos

### 1. Instalar Docker Desktop para Windows

1. Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop/
2. Ejecuta el instalador
3. Reinicia tu computadora cuando se te solicite
4. Abre Docker Desktop y espera a que inicie completamente
5. Verifica la instalación ejecutando en PowerShell:
   ```powershell
   docker --version
   docker-compose --version
   ```

### 2. Configurar Docker

- Asegúrate de que Docker Desktop esté ejecutándose (icono de ballena en la bandeja del sistema)
- En la configuración de Docker Desktop:
  - Recursos → Avanzado: Asigna suficiente RAM y CPUs para tus VMs
  - Recomendado: Al menos 8GB RAM y 4 CPUs para múltiples VMs
  - General: Asegúrate de que "Use the WSL 2 based engine" esté activado (recomendado)

## 🚀 Instalación y Uso

### Paso 1: Navegar al directorio del proyecto

Abre PowerShell y ejecuta:

```powershell
cd "c:\Users\1SMRA-scamren559\Documents\VS"
```

### Paso 2: Ejecutar configuración inicial (SOLO LA PRIMERA VEZ)

```powershell
.\configurar.ps1
```

Este script automáticamente:
- Construye la imagen base de Ubuntu
- Inicia el panel web
- Abre el navegador en http://localhost:3000

**Nota:** Este paso solo se hace una vez. Después, las VMs se crean desde el panel web.

### Paso 3: Crear tu primera VM

1. El navegador debería abrirse automáticamente en http://localhost:3000
2. Haz clic en el botón **"➕ Crear Nueva VM"**
3. Completa el formulario:
   - **Nombre:** Ej: desarrollo, produccion, test (sin espacios)
   - **CPUs (opcional):** Número de CPUs a asignar
   - **Memoria (opcional):** RAM en GB
4. Haz clic en **"✅ Crear VM"**
5. ¡Tu VM se creará automáticamente!

### Paso 4: Verificar VMs creadas

```powershell
docker ps
```

Verás todas tus VMs activas con nombres como:
- `ubuntu-vm-desarrollo`
- `ubuntu-vm-produccion`
- `vm-web-panel` (el panel de control)

## 🌐 Uso del Panel Web

### Acceso

Abre tu navegador en: **http://localhost:3000**

### Funcionalidades

#### Crear Nueva VM
- Botón **"➕ Crear Nueva VM"** en la parte superior
- Asigna nombre personalizado y recursos
- Puerto SSH se asigna automáticamente

#### Gestionar VMs
Cada VM tiene su propia tarjeta con:
- **Estado actual** (En Ejecución / Detenida)
- **Puerto SSH** para conectarse
- **Estadísticas en tiempo real** (CPU, RAM, uptime)
- **Botones de control:**
  - ▶️ Iniciar
  - 🔄 Reiniciar
  - ⏹️ Detener
  - ⚙️ Config (abrir panel de configuración)
  - 🗑️ Eliminar

#### Ver Configuración y Logs
- Haz clic en **"⚙️ Config"** en cualquier VM
- Podrás:
  - Cambiar CPU y RAM
  - Ver logs del sistema
  - Actualizar configuración

## 🔐 Conectarse por SSH desde Windows

Cada VM tiene su propio puerto SSH (visible en el panel web).

### Conectar a una VM específica

```powershell
ssh ubuntu@localhost -p [PUERTO]
```

Por ejemplo:
```powershell
# VM en puerto 2222
ssh ubuntu@localhost -p 2222

# VM en puerto 2223
ssh ubuntu@localhost -p 2223

# VM en puerto 2224
ssh ubuntu@localhost -p 2224
```

- **Usuario:** `ubuntu`
- **Contraseña:** `ubuntu123`

**Tip:** El comando SSH completo se muestra en cada tarjeta de VM y puedes copiarlo con el botón 📋.

### Windows Terminal (Opcional)

Si tienes Windows Terminal, puedes crear perfiles para cada VM:

1. Abre Windows Terminal
2. Ve a Configuración → Agregar nuevo perfil
3. Usa comando: `ssh ubuntu@localhost -p [PUERTO_DE_TU_VM]`
4. Dale un nombre descriptivo (ej: "VM Desarrollo")

### Primera Conexión

La primera vez que te conectes a cada VM, verás un mensaje sobre la autenticidad del host. Escribe `yes` y presiona Enter.

## 💡 Casos de Uso de Múltiples VMs

### Ejemplo 1: Entornos Separados
```
VM "desarrollo" - Puerto 2222 - 2 CPUs, 2 GB RAM
VM "produccion" - Puerto 2223 - 4 CPUs, 4 GB RAM
VM "testing"    - Puerto 2224 - 1 CPU, 1 GB RAM
```

### Ejemplo 2: Diferentes Servicios
```
VM "web-server"  - Puerto 2222 - Para aplicaciones web
VM "database"    - Puerto 2223 - Para MySQL/PostgreSQL
VM "cache"       - Puerto 2224 - Para Redis
```

### Ejemplo 3: Aprendizaje
```
VM "practica"    - Puerto 2222 - Para experimentar
VM "laboratorio" - Puerto 2223 - Para cursos
VM "proyecto"    - Puerto 2224 - Para trabajo serio
```

## ⚙️ Comandos Útiles

### Ver estado de VMs
```powershell
# Ver todas las VMs en ejecución
docker ps

# Ver todas las VMs (incluso detenidas)
docker ps -a

# Ver solo VMs de Ubuntu
docker ps -a | Select-String "ubuntu-vm"
```

### Gestionar el panel web
```powershell
# Ver logs del panel web
docker-compose logs web-panel

# Reiniciar el panel web
docker-compose restart web-panel

# Detener el panel web (las VMs seguirán corriendo)
docker-compose down

# Iniciar el panel web nuevamente
docker-compose up -d
```

### Gestionar VMs individuales (avanzado)
```powershell
# Detener una VM específica
docker stop ubuntu-vm-nombre

# Iniciar una VM específica
docker start ubuntu-vm-nombre

# Ver logs de una VM específica
docker logs ubuntu-vm-nombre

# Eliminar una VM específica
docker rm ubuntu-vm-nombre
```

### Limpiar sistema
```powershell
# Detener todas las VMs y el panel
docker ps -q | ForEach-Object { docker stop $_ }

# Eliminar VMs detenidas
docker container prune

# Eliminar imágenes no utilizadas
docker image prune
```

### Reconstruir imagen base
```powershell
# Si actualizas el Dockerfile
docker build -t ubuntu-vm-image .
```

### Acceder directamente al contenedor Ubuntu
```powershell
docker exec -it ubuntu-vm bash
```

## 🎯 Casos de Uso

### Instalar software en Ubuntu

1. Conéctate por SSH: `ssh ubuntu@localhost -p 2222`
2. Instala lo que necesites:
   ```bash
   sudo apt update
   sudo apt install python3-pip nodejs npm git -y
   ```

### Transferir archivos

**Desde Windows a Ubuntu:**
```powershell
# Copia el archivo a la carpeta compartida
Copy-Item "C:\ruta\archivo.txt" "c:\Users\1SMRA-scamren559\Documents\VS\shared\"

# Luego en Ubuntu (SSH):
# cp /shared/archivo.txt ~/
```

**Desde Ubuntu a Windows:**
```bash
# En Ubuntu (SSH):
cp ~/archivo.txt /shared/

# Luego accede desde Windows en:
# c:\Users\1SMRA-scamren559\Documents\VS\shared\archivo.txt
```

### Ejecutar scripts en Ubuntu

```bash
# Conéctate por SSH
ssh ubuntu@localhost -p 2222

# Crea un script
nano myscript.sh

# Dale permisos de ejecución
chmod +x myscript.sh

# Ejecútalo
./myscript.sh
```

## 🔒 Seguridad

### Cambiar la contraseña de SSH

1. Conéctate a Ubuntu por SSH
2. Ejecuta:
   ```bash
   passwd
   ```
3. Ingresa la contraseña actual (`ubuntu123`) y luego la nueva

### Usar claves SSH en lugar de contraseña

1. En PowerShell (Windows), genera una clave SSH:
   ```powershell
   ssh-keygen -t rsa -b 4096
   ```

2. Copia la clave pública a Ubuntu:
   ```powershell
   type $env:USERPROFILE\.ssh\id_rsa.pub | ssh ubuntu@localhost -p 2222 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
   ```

3. Ahora puedes conectarte sin contraseña:
   ```powershell
   ssh ubuntu@localhost -p 2222
   ```

## 🐛 Solución de Problemas

### El panel web no carga

1. Verifica que Docker Desktop esté ejecutándose
2. Verifica que los contenedores estén activos:
   ```powershell
   docker-compose ps
   ```
3. Revisa los logs:
   ```powershell
   docker-compose logs web-panel
   ```

### No puedo conectarme por SSH

1. Asegúrate de que la VM esté iniciada (verifica en el panel web)
2. Verifica que el puerto 2222 no esté siendo usado por otro programa
3. Revisa los logs de la VM:
   ```powershell
   docker-compose logs ubuntu-vm
   ```

### Error "port is already allocated"

Otro programa está usando el puerto 2222 o 3000. Opciones:
1. Cierra el programa que está usando el puerto
2. O cambia los puertos en `docker-compose.yml`:
   ```yaml
   ports:
     - "2223:22"  # Cambia 2222 por 2223 para SSH
     - "3001:3000"  # Cambia 3000 por 3001 para el panel web
   ```

### La VM está muy lenta

1. Aumenta los recursos en Docker Desktop:
   - Docker Desktop → Settings → Resources → Advanced
   - Aumenta RAM y CPUs
2. O ajusta los límites en el panel web

### Reiniciar desde cero

Si algo sale mal y quieres empezar de nuevo:

```powershell
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker rmi ubuntu-vm vm-web-panel

# Reconstruir desde cero
docker-compose up -d --build
```

## 📊 Monitoreo de Recursos

El panel web muestra:
- Estado de la VM (en ejecución/detenida)
- Tiempo de actividad
- Uso de CPU en tiempo real
- Uso de memoria en tiempo real
- Logs del sistema

## 🔄 Actualizaciones y Mantenimiento

### Actualizar paquetes en Ubuntu

```bash
# Conéctate por SSH
ssh ubuntu@localhost -p 2222

# Actualiza
sudo apt update && sudo apt upgrade -y
```

### Hacer backup de datos

Los datos persistentes se guardan en el volumen `ubuntu-data`. Para hacer backup:

```powershell
# Ver ubicación del volumen
docker volume inspect ubuntu-data

# Crear backup
docker run --rm -v ubuntu-data:/data -v ${PWD}:/backup ubuntu tar czf /backup/ubuntu-data-backup.tar.gz /data
```

### Restaurar backup

```powershell
docker run --rm -v ubuntu-data:/data -v ${PWD}:/backup ubuntu tar xzf /backup/ubuntu-data-backup.tar.gz -C /
```

## 🌟 Características Avanzadas

### Exponer puertos adicionales

Si necesitas exponer más puertos de Ubuntu a Windows, edita `docker-compose.yml`:

```yaml
ports:
  - "2222:22"
  - "8080:80"   # Ejemplo: servidor web en Ubuntu
  - "3306:3306" # Ejemplo: MySQL
```

### Agregar más usuarios

```bash
# En Ubuntu (SSH)
sudo adduser nombreusuario
sudo usermod -aG sudo nombreusuario
```

### Instalar entorno de desarrollo

```bash
# Python
sudo apt install python3 python3-pip python3-venv -y

# Node.js
sudo apt install nodejs npm -y

# Java
sudo apt install default-jdk -y

# Docker dentro de Ubuntu (Docker en Docker)
sudo apt install docker.io -y
sudo usermod -aG docker ubuntu
```

## 📝 Notas Importantes

- La VM se iniciará automáticamente cuando inicies Docker Desktop (configurado con `restart: unless-stopped`)
- Los datos en `/home/ubuntu` persisten incluso si detienes el contenedor
- La carpeta `shared/` es perfecta para proyectos que necesitas editar en Windows y ejecutar en Ubuntu
- El panel web requiere acceso al socket de Docker para funcionar

## 🤝 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs`
2. Verifica que Docker Desktop esté actualizado
3. Asegúrate de tener suficientes recursos (RAM/CPU)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso libre.

---

**¡Disfruta tu máquina virtual Ubuntu! 🎉**
