# Dockerfile para Ubuntu con SSH
FROM ubuntu:22.04

# Evitar prompts interactivos durante la instalación
ENV DEBIAN_FRONTEND=noninteractive

# Actualizar e instalar paquetes necesarios
RUN apt-get update && apt-get install -y \
    openssh-server \
    sudo \
    curl \
    wget \
    vim \
    nano \
    git \
    htop \
    net-tools \
    iputils-ping \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio para SSH
RUN mkdir /var/run/sshd

# Crear usuario 'ubuntu' con contraseña 'ubuntu123'
RUN useradd -m -s /bin/bash ubuntu && \
    echo 'ubuntu:ubuntu123' | chpasswd && \
    usermod -aG sudo ubuntu

# Permitir acceso SSH con contraseña
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Exponer puerto SSH
EXPOSE 22

# Script de inicio
RUN echo '#!/bin/bash\nservice ssh start\ntail -f /dev/null' > /start.sh && \
    chmod +x /start.sh

CMD ["/start.sh"]
