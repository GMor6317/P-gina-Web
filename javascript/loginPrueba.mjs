import API_URL from "./api_url.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // encodeURIComponent limpia caracteres raros para la URL
        const query = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

        try {
            const res = await fetch(`${API_URL}/validar?${query}`, {
                method: 'GET'
            });

            const result = await res.json();

            if (result.exito) {
                alert("¡Acceso concedido!");
                window.location.href = "estadisticasParticulares.html";
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            console.error("Error al validar:", error);
            alert("Error de conexión");
        }
    });
});