# 📚 EJEMPLOS DE USO

## Ejemplos prácticos de lo que puedes hacer con tu máquina virtual Ubuntu

---

## 1. Servidor Web Python

### Montar un servidor web simple en Ubuntu

```bash
# Conéctate por SSH
ssh ubuntu@localhost -p 2222

# Crea un archivo HTML
mkdir ~/web
cd ~/web
echo "<h1>¡Hola desde Ubuntu!</h1>" > index.html

# Inicia servidor web en puerto 8000
python3 -m http.server 8000
```

Luego, agrega el puerto 8000 al `docker-compose.yml`:
```yaml
ports:
  - "2222:22"
  - "8080:8000"  # Agrega esta línea
```

Reinicia: `docker-compose restart ubuntu-vm`

Visita: http://localhost:8080

---

## 2. Instalar y ejecutar Node.js

```bash
# Conéctate por SSH
ssh ubuntu@localhost -p 2222

# Instala Node.js
sudo apt update
sudo apt install nodejs npm -y

# Verifica instalación
node --version
npm --version

# Crea una app simple
mkdir ~/mi-app
cd ~/mi-app
npm init -y
npm install express

# Crea server.js
cat > server.js << 'EOF'
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('¡Hola desde Node.js!'));
app.listen(3001, () => console.log('Servidor en puerto 3001'));
EOF

# Ejecuta
node server.js
```

---

## 3. Base de datos MySQL

```bash
# En Ubuntu (SSH)
sudo apt update
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo mysql_secure_installation

# Acceder a MySQL
sudo mysql

# Crear base de datos
CREATE DATABASE midb;
SHOW DATABASES;
exit;
```

Expón el puerto en `docker-compose.yml`:
```yaml
ports:
  - "3306:3306"
```

---

## 4. Instalar Docker dentro de Ubuntu (Docker-in-Docker)

```bash
# En Ubuntu (SSH)
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo usermod -aG docker ubuntu

# Cierra sesión y vuelve a conectar
exit
ssh ubuntu@localhost -p 2222

# Prueba Docker
docker run hello-world
```

---

## 5. Programación en Python

```bash
# En Ubuntu (SSH)
sudo apt install python3-pip python3-venv -y

# Crear entorno virtual
mkdir ~/proyecto-python
cd ~/proyecto-python
python3 -m venv venv
source venv/bin/activate

# Instalar paquetes
pip install requests pandas numpy

# Crear script
cat > script.py << 'EOF'
import requests
import pandas as pd

response = requests.get('https://api.github.com')
print(f"Status: {response.status_code}")
EOF

# Ejecutar
python script.py
```

---

## 6. Git y desarrollo

```bash
# Git ya está instalado, configúralo
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Clonar un repositorio
cd ~
git clone https://github.com/usuario/repositorio.git
cd repositorio
```

---

## 7. Transferir archivos grandes

### Desde Windows a Ubuntu:

```powershell
# En PowerShell (Windows)
scp -P 2222 "C:\ruta\archivo.zip" ubuntu@localhost:~/
```

### Desde Ubuntu a Windows:

```bash
# En Ubuntu (SSH)
# Usa la carpeta compartida
cp ~/archivo.zip /shared/
```

Luego accede desde Windows: `c:\Users\1SMRA-scamren559\Documents\VS\shared\archivo.zip`

---

## 8. Compilar código C/C++

```bash
# En Ubuntu (SSH)
sudo apt install build-essential -y

# Crear programa
cat > hello.c << 'EOF'
#include <stdio.h>
int main() {
    printf("¡Hola desde C!\n");
    return 0;
}
EOF

# Compilar y ejecutar
gcc hello.c -o hello
./hello
```

---

## 9. Análisis de datos con Jupyter

```bash
# En Ubuntu (SSH)
pip install jupyter pandas matplotlib numpy

# Iniciar Jupyter (sin browser)
jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser
```

Expone puerto 8888 en `docker-compose.yml`:
```yaml
ports:
  - "8888:8888"
```

Abre: http://localhost:8888

---

## 10. Servidor SSH con múltiples usuarios

```bash
# En Ubuntu (SSH)
# Crear nuevo usuario
sudo adduser developer
sudo usermod -aG sudo developer

# Desde Windows, conéctate como developer:
# ssh developer@localhost -p 2222
```

---

## 11. Monitoreo del sistema

```bash
# En Ubuntu (SSH)
# Instalar herramientas de monitoreo
sudo apt install htop iotop nethogs -y

# Ver procesos
htop

# Ver uso de disco
df -h

# Ver memoria
free -h

# Ver red
nethogs
```

---

## 12. Automatización con cron

```bash
# En Ubuntu (SSH)
# Editar crontab
crontab -e

# Agregar tarea (backup cada día a las 2am)
# 0 2 * * * /ruta/a/script.sh

# Crear script de backup
cat > ~/backup.sh << 'EOF'
#!/bin/bash
tar -czf /shared/backup-$(date +%Y%m%d).tar.gz ~/proyecto
EOF

chmod +x ~/backup.sh
```

---

## 13. Proxy inverso con Nginx

```bash
# En Ubuntu (SSH)
sudo apt install nginx -y
sudo systemctl start nginx

# Configurar sitio
sudo nano /etc/nginx/sites-available/miapp

# Reiniciar nginx
sudo systemctl restart nginx
```

Expone puerto 80:
```yaml
ports:
  - "8080:80"
```

---

## 14. Ejecutar scripts de Windows en Ubuntu

```powershell
# En Windows, copia script a carpeta compartida
Copy-Item "C:\mis-scripts\script.sh" "c:\Users\1SMRA-scamren559\Documents\VS\shared\"

# En Ubuntu (SSH)
chmod +x /shared/script.sh
/shared/script.sh
```

---

## 15. Entorno de desarrollo completo

```bash
# En Ubuntu (SSH)
# Instalar todo lo necesario
sudo apt update
sudo apt install -y \
    build-essential \
    git \
    curl \
    wget \
    vim \
    nano \
    python3 \
    python3-pip \
    nodejs \
    npm \
    default-jdk \
    maven \
    docker.io \
    mysql-server \
    postgresql \
    redis-server

# Instalar VS Code Server (code-server)
curl -fsSL https://code-server.dev/install.sh | sh
code-server --bind-addr 0.0.0.0:8443
```

Expone puerto 8443 y accede a VS Code desde el navegador!

---

## Tips de Productividad

### Alias útiles

```bash
# Agregar a ~/.bashrc
echo 'alias ll="ls -lah"' >> ~/.bashrc
echo 'alias ports="netstat -tulpn"' >> ~/.bashrc
echo 'alias update="sudo apt update && sudo apt upgrade -y"' >> ~/.bashrc
source ~/.bashrc
```

### Persistir cambios en Docker

Los cambios en `/home/ubuntu` persisten automáticamente gracias al volumen `ubuntu-data`.

---

¿Necesitas más ejemplos? Consulta el README.md principal o experimenta por tu cuenta. ¡La VM es completamente tuya para explorar! 🚀
