const STATIC_MODE = true;

if (STATIC_MODE) {
    window.addEventListener('load', () => {
        const errorMessage = document.getElementById('errorMessage');
        const loginButton = document.querySelector('.login-btn');
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.style.opacity = '0.6';
            loginButton.style.cursor = 'not-allowed';
        }
        errorMessage.textContent = 'Modo estatico: backend no configurado. El login esta deshabilitado.';
        errorMessage.style.display = 'block';
    });
} else {
    // Manejar el envío del formulario de login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        const loading = document.getElementById('loading');
        
        // Limpiar mensajes previos
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        loading.style.display = 'block';
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            loading.style.display = 'none';
            
            if (response.ok && data.success) {
                // Guardar el token
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);
                
                successMessage.textContent = '✓ Autenticación exitosa. Redirigiendo...';
                successMessage.style.display = 'block';
                
                // Redirigir después de 1 segundo
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
            } else {
                errorMessage.textContent = '✗ ' + (data.error || 'Error en la autenticación');
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            loading.style.display = 'none';
            errorMessage.textContent = '✗ Error al conectar con el servidor: ' + error.message;
            errorMessage.style.display = 'block';
            console.error('Error:', error);
        }
    });

    // Verificar si el usuario ya está autenticado
    window.addEventListener('load', () => {
        const token = localStorage.getItem('token');
        if (token) {
            // Si el usuario ya tiene un token válido, redirigir a index.html
            window.location.href = '/index.html';
        }
    });
}
