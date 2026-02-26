const express = require('express');
const Docker = require('dockerode');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
let docker = null;
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu-super-secreto-cambiar-en-produccion-2025';

// Inicializar Docker de forma segura
try {
    docker = new Docker({ socketPath: '/var/run/docker.sock' });
    console.log('Docker conectado');
} catch (err) {
    console.warn('Docker no disponible (normal en Render):', err.message);
    docker = null;
}

// Cargar usuarios
const usersFilePath = path.join(__dirname, 'users.json');
let users = [];
try {
    users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8')).users;
} catch (err) {
    console.error('Error cargando usuarios:', err);
    users = [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin', accessibleVMs: [] },
        { id: 2, username: 'usuario1', password: 'user123', role: 'user', accessibleVMs: [] }
    ];
}

app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const VM_PREFIX = 'ubuntu-vm-';
const BASE_SSH_PORT = 2222;

// Middleware de autenticación
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado', success: false });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido', success: false });
    }
}

// Verificar si es admin
function verifyAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden hacer esto.', success: false });
    }
    next();
}

// Guardar usuarios en archivo
function saveUsers() {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2));
    } catch (err) {
        console.error('Error guardando usuarios:', err);
    }
}

// Middleware para verificar acceso a una VM
function verifyVMAccess(req, res, next) {
    const vmName = req.params.name.startsWith(VM_PREFIX) ? req.params.name : VM_PREFIX + req.params.name;
    const currentUser = users.find(u => u.id === req.user.id);
    
    // Los admins pueden acceder a todas las VMs
    if (currentUser.role === 'admin') {
        req.vmName = vmName;
        return next();
    }
    
    // Los usuarios normales solo acceden a sus VMs asignadas
    if (!currentUser.accessibleVMs.includes(vmName)) {
        return res.status(403).json({ error: 'No tienes acceso a esta VM', success: false });
    }
    
    req.vmName = vmName;
    next();
}

// ===== RUTAS DE AUTENTICACIÓN (SIN PROTECCIÓN) =====

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos', success: false });
    }
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos', success: false });
    }
    
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({
        success: true,
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

// Registrar nuevo usuario (solo admin puede hacerlo)
app.post('/api/register-user', verifyToken, verifyAdmin, (req, res) => {
    const { username, password, role } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos', success: false });
    }
    
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ error: 'El usuario ya existe', success: false });
    }
    
    const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        username,
        password,
        role: role || 'user',
        accessibleVMs: []
    };
    
    users.push(newUser);
    saveUsers();
    
    res.json({
        success: true,
        message: `Usuario '${username}' creado correctamente`,
        user: { id: newUser.id, username: newUser.username, role: newUser.role }
    });
});

// Dar acceso a VM a un usuario (solo admin)
app.post('/api/assign-vm', verifyToken, verifyAdmin, (req, res) => {
    const { userId, vmName } = req.body;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado', success: false });
    }
    
    if (!user.accessibleVMs.includes(vmName)) {
        user.accessibleVMs.push(vmName);
        saveUsers();
    }
    
    res.json({
        success: true,
        message: `Acceso a VM '${vmName}' asignado a '${user.username}'`,
        accessibleVMs: user.accessibleVMs
    });
});

// Quitar acceso a VM de un usuario (solo admin)
app.post('/api/revoke-vm', verifyToken, verifyAdmin, (req, res) => {
    const { userId, vmName } = req.body;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado', success: false });
    }
    
    user.accessibleVMs = user.accessibleVMs.filter(vm => vm !== vmName);
    saveUsers();
    
    res.json({
        success: true,
        message: `Acceso a VM '${vmName}' revocado de '${user.username}'`
    });
});

// Obtener todos los usuarios (solo admin)
app.get('/api/users', verifyToken, verifyAdmin, (req, res) => {
    const usersList = users.map(u => ({
        id: u.id,
        username: u.username,
        role: u.role,
        accessibleVMs: u.accessibleVMs
    }));
    
    res.json({ success: true, users: usersList });
});

// Página principal (requiere autenticación)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listar todas las VMs (requiere autenticación)
app.get('/api/vms', verifyToken, async (req, res) => {
    try {
        if (!docker) {
            return res.json({ vms: [], success: true, isAdmin: false, warning: 'Docker no disponible en este servidor' });
        }
        const containers = await docker.listContainers({ all: true });
        let vms = containers
            .filter(c => c.Names.some(name => name.includes(VM_PREFIX)))
            .map(c => {
                const name = c.Names[0].replace('/', '');
                const ports = c.Ports.find(p => p.PrivatePort === 22);
                return {
                    id: c.Id.substring(0, 12),
                    name: name,
                    displayName: name.replace(VM_PREFIX, ''),
                    status: c.State,
                    running: c.State === 'running',
                    created: new Date(c.Created * 1000).toLocaleString(),
                    sshPort: ports ? ports.PublicPort : 'N/A',
                    image: c.Image
                };
            });
        
        // Filtrar VMs según permisos del usuario
        const currentUser = users.find(u => u.id === req.user.id);
        const isAdmin = currentUser && currentUser.role === 'admin';
        
        if (currentUser && currentUser.role === 'user') {
            // Los usuarios normales solo ven las VMs que les fueron asignadas
            vms = vms.filter(vm => currentUser.accessibleVMs.includes(vm.name));
        }
        // Los admins ven todas las VMs
        
        res.json({ vms, success: true, isAdmin });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
});

// Obtener estado de una VM específica (requiere autenticación)
app.get('/api/vm/:name/status', verifyToken, async (req, res) => {
    try {
        const vmName = req.params.name.startsWith(VM_PREFIX) ? req.params.name : VM_PREFIX + req.params.name;
        
        // Verificar permisos
        const currentUser = users.find(u => u.id === req.user.id);
        if (currentUser.role === 'user' && !currentUser.accessibleVMs.includes(vmName)) {
            return res.status(403).json({ error: 'No tienes acceso a esta VM', success: false });
        }
        
        const container = docker.getContainer(vmName);
        const info = await container.inspect();
        
        let stats = null;
        if (info.State.Running) {
            stats = await container.stats({ stream: false });
        }
        
        const sshPort = info.NetworkSettings.Ports['22/tcp'] 
            ? info.NetworkSettings.Ports['22/tcp'][0].HostPort 
            : 'N/A';
        
        res.json({
            id: info.Id.substring(0, 12),
            name: info.Name.replace('/', ''),
            displayName: info.Name.replace('/', '').replace(VM_PREFIX, ''),
            status: info.State.Status,
            running: info.State.Running,
            startedAt: info.State.StartedAt,
            uptime: info.State.Running ? calculateUptime(info.State.StartedAt) : '0s',
            sshPort: sshPort,
            config: {
                cpus: info.HostConfig.NanoCpus / 1000000000 || 'Sin límite',
                memory: info.HostConfig.Memory ? `${(info.HostConfig.Memory / 1024 / 1024 / 1024).toFixed(2)} GB` : 'Sin límite',
            },
            stats: stats ? {
                cpuUsage: calculateCPUPercent(stats),
                memoryUsage: calculateMemoryUsage(stats)
            } : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear nueva VM
app.post('/api/vm/create', verifyToken, verifyAdmin, async (req, res) => {
    try {
        if (!docker) {
            return res.status(503).json({ error: 'Docker no disponible en este servidor', success: false });
        }
        const { name, cpus, memory } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'El nombre es requerido', success: false });
        }
        
        // Validar nombre
        const safeName = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const vmName = VM_PREFIX + safeName;
        
        // Verificar si ya existe
        const containers = await docker.listContainers({ all: true });
        if (containers.some(c => c.Names.some(n => n.includes(vmName)))) {
            return res.status(400).json({ error: 'Ya existe una VM con ese nombre', success: false });
        }
        
        // Encontrar puerto SSH disponible
        const usedPorts = containers
            .flatMap(c => c.Ports)
            .filter(p => p.PublicPort)
            .map(p => p.PublicPort);
        
        let sshPort = BASE_SSH_PORT;
        while (usedPorts.includes(sshPort)) {
            sshPort++;
        }
        
        // Configuración del contenedor
        const containerConfig = {
            Image: 'ubuntu-vm-image',
            name: vmName,
            Hostname: vmName,
            ExposedPorts: {
                '22/tcp': {}
            },
            HostConfig: {
                PortBindings: {
                    '22/tcp': [{ HostPort: sshPort.toString() }]
                },
                RestartPolicy: {
                    Name: 'unless-stopped'
                }
            }
        };
        
        // Verificar si la imagen base existe
        try {
            await docker.getImage('ubuntu-vm-image').inspect();
        } catch (imageError) {
            return res.status(400).json({ 
                error: 'La imagen base de Ubuntu no existe. Por favor, ejecuta primero: .\\configurar.ps1 desde PowerShell para construir la imagen base.',
                success: false,
                needsSetup: true
            });
        }
        
        // Aplicar límites de recursos si se especifican
        if (cpus) {
            containerConfig.HostConfig.NanoCpus = parseFloat(cpus) * 1000000000;
        }
        if (memory) {
            containerConfig.HostConfig.Memory = parseFloat(memory) * 1024 * 1024 * 1024;
        }
        
        // Crear contenedor
        const container = await docker.createContainer(containerConfig);
        await container.start();
        
        res.json({ 
            message: `VM '${safeName}' creada correctamente en puerto SSH ${sshPort}`,
            success: true,
            vmName: vmName,
            displayName: safeName,
            sshPort: sshPort
        });
    } catch (error) {
        console.error('Error al crear VM:', error);
        res.status(500).json({ 
            error: error.message || 'Error desconocido al crear la VM', 
            success: false 
        });
    }
});

// Iniciar VM
app.post('/api/vm/:name/start', verifyToken, verifyVMAccess, async (req, res) => {
    try {
        if (!docker) {
            return res.status(503).json({ error: 'Docker no disponible', success: false });
        }
        const container = docker.getContainer(req.vmName);
        await container.start();
        res.json({ message: 'VM iniciada correctamente', success: true });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
});

// Detener VM
app.post('/api/vm/:name/stop', verifyToken, verifyVMAccess, async (req, res) => {
    try {
        if (!docker) {
            return res.status(503).json({ error: 'Docker no disponible', success: false });
        }
        const container = docker.getContainer(req.vmName);
        await container.stop();
        res.json({ message: 'VM detenida correctamente', success: true });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
});

// Reiniciar VM
app.post('/api/vm/:name/restart', verifyToken, verifyVMAccess, async (req, res) => {
    try {
        if (!docker) {
            return res.status(503).json({ error: 'Docker no disponible', success: false });
        }
        const container = docker.getContainer(req.vmName);
        await container.restart();
        res.json({ message: 'VM reiniciada correctamente', success: true });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
});

// Eliminar VM (solo admin)
app.delete('/api/vm/:name', verifyToken, verifyAdmin, async (req, res) => {
    try {
        if (!docker) {
            return res.status(503).json({ error: 'Docker no disponible', success: false });
        }
        const vmName = req.params.name.startsWith(VM_PREFIX) ? req.params.name : VM_PREFIX + req.params.name;
        const container = docker.getContainer(vmName);
        
        // Detener si está corriendo
        try {
            await container.stop();
        } catch (e) {
            // Ya está detenido
        }
        
        // Eliminar contenedor
        await container.remove({ v: true }); // v: true elimina también los volúmenes
        
        res.json({ message: 'VM eliminada correctamente', success: true });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
});

// Actualizar configuración de VM
app.post('/api/vm/:name/config', verifyToken, verifyVMAccess, async (req, res) => {
    try {
        if (!docker) {
            return res.status(503).json({ error: 'Docker no disponible', success: false });
        }
        const { cpus, memory } = req.body;
        const container = docker.getContainer(req.vmName);
        
        const updateData = {};
        if (cpus) updateData.NanoCpus = parseFloat(cpus) * 1000000000;
        if (memory) updateData.Memory = parseFloat(memory) * 1024 * 1024 * 1024;
        
        await container.update(updateData);
        res.json({ 
            message: 'Configuración actualizada. Reinicia la VM para aplicar cambios.', 
            success: true 
        });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
});

// Obtener logs de VM
app.get('/api/vm/:name/logs', verifyToken, verifyVMAccess, async (req, res) => {
    try {
        if (!docker) {
            return res.status(503).json({ error: 'Docker no disponible', success: false });
        }
        const container = docker.getContainer(req.vmName);
        const logs = await container.logs({
            stdout: true,
            stderr: true,
            tail: 100
        });
        res.json({ logs: logs.toString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Construir imagen base (solo necesario una vez)
app.post('/api/build-image', async (req, res) => {
    try {
        const stream = await docker.buildImage({
            context: path.join(__dirname, '..'),
            src: ['Dockerfile']
        }, {
            t: 'ubuntu-vm-image'
        });
        
        stream.pipe(process.stdout);
        
        stream.on('end', () => {
            res.json({ message: 'Imagen construida correctamente', success: true });
        });
        
        stream.on('error', (error) => {
            res.status(500).json({ error: error.message, success: false });
        });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
});

// Funciones auxiliares
function calculateUptime(startedAt) {
    const start = new Date(startedAt);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000);
    
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

function calculateCPUPercent(stats) {
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;
    return cpuPercent.toFixed(2) + '%';
}

function calculateMemoryUsage(stats) {
    const used = stats.memory_stats.usage / 1024 / 1024;
    const limit = stats.memory_stats.limit / 1024 / 1024;
    return `${used.toFixed(2)} MB / ${limit.toFixed(2)} MB`;
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Panel web ejecutándose en http://localhost:${PORT}`);
});
