document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        // Construimos la URL con los parámetros de búsqueda
        const url = `/validar?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`;

        try {
            // Fetch por defecto es GET
            const response = await fetch(url);
            const result = await response.json();

            if (result.exito) {
                alert(`Acceso correcto para: ${result.usuario}`);
                window.location.href = 'index.html'; // O tu dashboard de StarMaths
            } else {
                alert('Usuario o contraseña no coinciden con nuestros registros.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al intentar obtener las credenciales.');
        }
    });
});