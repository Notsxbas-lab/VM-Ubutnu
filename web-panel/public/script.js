const API_URL = 'http://localhost:3000/api';

// Estado global del usuario actual
let currentUser = null;

// Obtener token del localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Crear headers con token
function getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
}

// Manejar respuesta 401 (token expirado)
async function handleUnauthorized() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login.html';
}

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthentication();
    updateUserUI();
    loadVMList();
    // Actualizar cada 5 segundos
    setInterval(loadVMList, 5000);
});

// Verificar si el usuario está autenticado
async function checkAuthentication() {
    const token = getToken();
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    try {
        // Validar que el token sea válido
        const response = await fetch(`${API_URL}/vms`, {
            headers: getHeaders(true)
        });
        
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        
        // Obtener datos del usuario del localStorage o del servidor
        const username = localStorage.getItem('username');
        currentUser = {
            username: username,
            // Determinar rol basado en respuesta de servidor
            role: 'user' // Por defecto, se actualizará cuando se carguen las VMs
        };
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        handleUnauthorized();
    }
}

// Actualizar UI del usuario
function updateUserUI() {
    const username = localStorage.getItem('username');
    const userInfoElement = document.getElementById('userInfo');
    
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <span>👤 ${username}</span>
            <button onclick="logout()" class="logout-btn">Cerrar Sesión</button>
        `;
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login.html';
}

// Cargar lista de VMs
async function loadVMList() {
    try {
        const response = await fetch(`${API_URL}/vms`, {
            headers: getHeaders(true)
        });
        
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Determinar rol del usuario según los VMs disponibles
            if (currentUser) {
                currentUser.role = data.isAdmin ? 'admin' : 'user';
                updateAdminUI();
            }
            renderVMList(data.vms);
        }
    } catch (error) {
        console.error('Error al cargar VMs:', error);
    }
}

// Actualizar UI según rol del usuario
function updateAdminUI() {
    const createVMButton = document.getElementById('createVMBtn');
    const adminSection = document.getElementById('adminSection');
    
    if (currentUser.role === 'admin') {
        if (createVMButton) createVMButton.style.display = 'block';
        if (adminSection) adminSection.style.display = 'block';
    } else {
        if (createVMButton) createVMButton.style.display = 'none';
        if (adminSection) adminSection.style.display = 'none';
    }
}

// Renderizar lista de VMs
function renderVMList(vms) {
    const vmList = document.getElementById('vmList');
    
    if (vms.length === 0) {
        vmList.innerHTML = '<div class="loading">No hay VMs asignadas. Contáctate con el administrador.</div>';
        return;
    }
    
    // Limpiar lista
    vmList.innerHTML = '';
    
    // Crear tarjeta para cada VM
    vms.forEach(vm => {
        const card = createVMCard(vm);
        vmList.appendChild(card);
        
        // Cargar detalles de la VM
        loadVMDetails(vm.displayName);
    });
}

// Crear tarjeta de VM
function createVMCard(vm) {
    const template = document.getElementById('vmCardTemplate');
    const card = template.content.cloneNode(true);
    const cardElement = card.querySelector('.vm-card');
    
    // Configurar datos básicos
    cardElement.dataset.vmName = vm.displayName;
    cardElement.querySelector('.vm-name').textContent = vm.displayName;
    cardElement.querySelector('.ssh-port').textContent = vm.sshPort;
    
    // Status badge inicial
    const badge = cardElement.querySelector('.status-badge');
    const statusText = cardElement.querySelector('.status-text');
    if (vm.running) {
        badge.classList.add('running');
        statusText.textContent = 'En Ejecución';
    } else {
        badge.classList.add('stopped');
        statusText.textContent = 'Detenida';
    }
    
    // Comando SSH
    const sshCommand = cardElement.querySelector('.ssh-command');
    sshCommand.textContent = `ssh ubuntu@localhost -p ${vm.sshPort}`;
    
    // Ocultar botón de eliminar para usuarios normales
    const deleteButton = cardElement.querySelector('.delete-btn');
    if (deleteButton && currentUser && currentUser.role !== 'admin') {
        deleteButton.style.display = 'none';
    }
    
    return card;
}

// Cargar detalles de una VM
async function loadVMDetails(vmName) {
    try {
        const response = await fetch(`${API_URL}/vm/${vmName}/status`, {
            headers: getHeaders(true)
        });
        
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        
        const data = await response.json();
        
        const card = document.querySelector(`[data-vm-name="${vmName}"]`);
        if (!card) return;
        
        // Actualizar estado
        const badge = card.querySelector('.status-badge');
        const statusText = card.querySelector('.status-text');
        badge.className = 'status-badge';
        
        if (data.running) {
            badge.classList.add('running');
            statusText.textContent = 'En Ejecución';
        } else {
            badge.classList.add('stopped');
            statusText.textContent = 'Detenida';
        }
        
        // Actualizar información
        card.querySelector('.vm-status').textContent = data.status || '-';
        card.querySelector('.vm-uptime').textContent = data.uptime || '-';
        
        if (data.stats) {
            card.querySelector('.vm-cpu').textContent = data.stats.cpuUsage;
            card.querySelector('.vm-memory').textContent = data.stats.memoryUsage;
        } else {
            card.querySelector('.vm-cpu').textContent = '-';
            card.querySelector('.vm-memory').textContent = '-';
        }
        
        // Actualizar configuración actual en el panel
        const cpusInput = card.querySelector('.config-cpus');
        const memoryInput = card.querySelector('.config-memory');
        if (cpusInput && memoryInput) {
            cpusInput.placeholder = `Actual: ${data.config.cpus}`;
            memoryInput.placeholder = `Actual: ${data.config.memory}`;
        }
        
    } catch (error) {
        console.error(`Error al cargar detalles de ${vmName}:`, error);
    }
}

// Mostrar modal de crear VM
function showCreateVMModal() {
    const modal = document.getElementById('createVMModal');
    modal.classList.add('show');
}

// Cerrar modal de crear VM
function closeCreateVMModal() {
    const modal = document.getElementById('createVMModal');
    modal.classList.remove('show');
    document.getElementById('createVMForm').reset();
}

// Crear nueva VM
async function createVM(event) {
    event.preventDefault();
    
    const name = document.getElementById('vmName').value;
    const cpus = document.getElementById('vmCpus').value;
    const memory = document.getElementById('vmMemory').value;
    
    try {
        const response = await fetch(`${API_URL}/vm/create`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify({ name, cpus, memory })
        });
        
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        
        // Verificar si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('El servidor no está respondiendo correctamente. Verifica que el panel web esté funcionando.');
        }
        
        const data = await response.json();
        
        if (data.success) {
            alert(`✅ ${data.message}\n\nConéctate usando:\nssh ubuntu@localhost -p ${data.sshPort}`);
            closeCreateVMModal();
            loadVMList();
        } else {
            if (data.needsSetup) {
                alert(`❌ ${data.error}\n\n📝 Pasos para solucionar:\n1. Abre PowerShell en la carpeta del proyecto\n2. Ejecuta: .\\configurar.ps1\n3. Espera a que termine la construcción\n4. Intenta crear la VM nuevamente`);
            } else {
                alert(`❌ Error: ${data.error}`);
            }
        }
    } catch (error) {
        console.error('Error completo:', error);
        alert(`❌ Error al crear VM: ${error.message}\n\n💡 Consejo: Asegúrate de haber ejecutado .\\configurar.ps1 primero.`);
    }
}

// Refrescar lista de VMs
function refreshVMList() {
    loadVMList();
}

// Iniciar VM
async function startVM(button) {
    const card = button.closest('.vm-card');
    const vmName = card.dataset.vmName;
    const messageDiv = card.querySelector('.vm-message');
    
    showVMMessage(messageDiv, 'Iniciando VM...', 'loading');
    
    try {
        const response = await fetch(`${API_URL}/vm/${vmName}/start`, {
            method: 'POST',
            headers: getHeaders(true)
        });
        
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            showVMMessage(messageDiv, data.message, 'success');
            setTimeout(() => loadVMDetails(vmName), 1000);
        } else {
            showVMMessage(messageDiv, data.error, 'error');
        }
    } catch (error) {
        showVMMessage(messageDiv, `Error: ${error.message}`, 'error');
    }
}

// Detener VM
async function stopVM(button) {
    const card = button.closest('.vm-card');
    const vmName = card.dataset.vmName;
    const messageDiv = card.querySelector('.vm-message');
    
    showVMMessage(messageDiv, 'Deteniendo VM...', 'loading');
    
    try {
        const response = await fetch(`${API_URL}/vm/${vmName}/stop`, {
            method: 'POST',
            headers: getHeaders(true)
        });
        
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            showVMMessage(messageDiv, data.message, 'success');
            setTimeout(() => loadVMDetails(vmName), 1000);
        } else {
            showVMMessage(messageDiv, data.error, 'error');
        }
    } catch (error) {
        showVMMessage(messageDiv, `Error: ${error.message}`, 'error');
    }
}

// Reiniciar VM
async function restartVM(button) {
    const card = button.closest('.vm-card');
    const vmName = card.dataset.vmName;
    const messageDiv = card.querySelector('.vm-message');
    
    showVMMessage(messageDiv, 'Reiniciando VM...', 'loading');
    
    try {
        const response = await fetch(`${API_URL}/vm/${vmName}/restart`, {
            method: 'POST',
            headers: getHeaders(true)
        });
        
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            showVMMessage(messageDiv, data.message, 'success');
            setTimeout(() => loadVMDetails(vmName), 1000);
        } else {
            showVMMessage(messageDiv, data.error, 'error');
        }
    } catch (error) {
        showVMMessage(messageDiv, `Error: ${error.message}`, 'error');
    }
}

// Eliminar VM
async function deleteVM(button) {
    const card = button.closest('.vm-card');
    const vmName = card.dataset.vmName;
    
    if (!confirm(`¿Estás seguro de que quieres eliminar la VM '${vmName}'?\n\n⚠️ Esta acción no se puede deshacer y se perderán todos los datos.`)) {
        return;
    }
    
    const messageDiv = card.querySelector('.vm-message');
    showVMMessage(messageDiv, 'Eliminando VM...', 'loading');
    
    try {
        const response = await fetch(`${API_URL}/vm/${vmName}`, {
            method: 'DELETE',
            headers: getHeaders(true)
        });
        
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            card.style.opacity = '0';
            setTimeout(() => {
                loadVMList();
            }, 500);
        } else {
            showVMMessage(messageDiv, data.error, 'error');
        }
    } catch (error) {
        showVMMessage(messageDiv, `Error: ${error.message}`, 'error');
    }
}

// Mostrar detalles y configuración de VM
function showVMDetails(button) {
    const card = button.closest('.vm-card');
    const configPanel = card.querySelector('.vm-config-panel');
    configPanel.style.display = 'block';
    
    // Cargar logs
    refreshVMLogs(button);
}

// Ocultar detalles de VM
function hideVMDetails(button) {
    const card = button.closest('.vm-card');
    const configPanel = card.querySelector('.vm-config-panel');
    configPanel.style.display = 'none';
}

// Actualizar configuración de VM
async function updateVMConfig(event, form) {
    event.preventDefault();
    
    const card = form.closest('.vm-card');
    const vmName = card.dataset.vmName;
    const messageDiv = card.querySelector('.vm-message');
    
    const cpus = form.querySelector('.config-cpus').value;
    const memory = form.querySelector('.config-memory').value;
    
    if (!cpus && !memory) {
        showVMMessage(messageDiv, 'Ingresa al menos un valor', 'error');
        return;
    }
    
    showVMMessage(messageDiv, 'Actualizando configuración...', 'loading');
    
    try {
        const response = await fetch(`${API_URL}/vm/${vmName}/config`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify({ cpus, memory })
        });
        
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            showVMMessage(messageDiv, data.message, 'success');
            form.reset();
            setTimeout(() => loadVMDetails(vmName), 1000);
        } else {
            showVMMessage(messageDiv, data.error, 'error');
        }
    } catch (error) {
        showVMMessage(messageDiv, `Error: ${error.message}`, 'error');
    }
}

// Refrescar logs de VM
async function refreshVMLogs(button) {
    const card = button.closest('.vm-card');
    const vmName = card.dataset.vmName;
    const logsContainer = card.querySelector('.vm-logs');
    
    logsContainer.textContent = 'Cargando logs...';
    
    try {
        const response = await fetch(`${API_URL}/vm/${vmName}/logs`, {
            headers: getHeaders(true)
        });
        
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        
        const data = await response.json();
        logsContainer.textContent = data.logs || 'No hay logs disponibles';
    } catch (error) {
        logsContainer.textContent = `Error al cargar logs: ${error.message}`;
    }
}

// Copiar comando SSH
function copySSHCommand(button) {
    const command = button.previousElementSibling.textContent;
    navigator.clipboard.writeText(command).then(() => {
        const originalText = button.textContent;
        button.textContent = '✅';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
        alert('Error al copiar al portapapeles');
    });
}

// Mostrar mensaje en tarjeta de VM
function showVMMessage(messageDiv, message, type) {
    messageDiv.textContent = message;
    messageDiv.className = 'vm-message ' + type;
    
    if (type !== 'loading') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('createVMModal');
    if (event.target === modal) {
        closeCreateVMModal();
    }
}
