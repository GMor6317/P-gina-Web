import API_URL from "./api_url.mjs";

async function CargarRanking() {
    try {
        const response = await fetch(`${API_URL}/dashboard/ranking`);
        const result = await response.json();
        if (result.exito) {
            const ranking = document.querySelector('.ranking-list');
            if (!ranking){
                return;
            } 

            ranking.innerHTML = '';

            const tops = [result.top1, result.top2, result.top3, result.top4];

            tops.forEach((jugador, index) => {
                // Solo agregamos el item si el jugador tiene un nombre (evita filas vacías)
                if (jugador && jugador.nombre_usuario !== "") {
                    const posicion = index + 1;
                    const li = `
                        <li class="ranking-item">
                            <div class="posicion">${posicion}</div>
                            <div class="avatar"><i class="fas fa-user"></i></div>
                            <div class="nombre">${jugador.nombre_real}</div>
                            <div class="puntuacion">${Number(jugador.puntaje).toLocaleString()}</div>
                            <div class="trofeo">${posicion <= 3 ? '&#x1F3C6;' : ''}</div>
                        </li>
                    `;
                    ranking.innerHTML += li;
                }
            });
            console.log("Ranking actualizado con éxito");
        }
    } catch (error) {
        console.error("Error al cargar el ranking:", error);
    }
}

// Ejecutar cuando la página cargue
window.addEventListener('load', CargarRanking);