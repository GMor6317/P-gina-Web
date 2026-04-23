import API_URL from "./api_url.mjs";

async function CargarRanking() {
    try {
        const res = await fetch(`${API_URL}/dashboard/ranking`);
        const { exito, datos } = await res.json();
        const lista = document.querySelector('.ranking-list');

        if (exito && lista) {
            lista.innerHTML = datos.map(j => `
                <li class="ranking-item">
                    <div class="posicion">${j.posicion}</div>
                    <div class="avatar"><i class="fas fa-user"></i></div>
                    <div class="nombre">${j.nombre_real}</div>
                    <div class="puntuacion">${Number(j.puntaje).toLocaleString()}</div>
                    <div class="trofeo">${j.posicion <= 3 ? '&#x1F3C6;' : ''}</div>
                </li>`).join('');
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

window.addEventListener('load', CargarRanking);