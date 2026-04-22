async function CargarRanking() {
    try{
        const response = await fetch(`${API_URL}/ranking/administrador`);
        const result = await response.json();
        
        if(result.exito){
            const ranking = document.querySelector('.ranking-list');
            ranking.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos datos


            result.datos.forEach(jugador =>{
                const li = `
                    <li class="ranking-item">
                        <div class = "posicion">${jugador.posicion}</div>
                        <div class = "avatar"><i class="fas fa-user"></i></div>
                        <div class = "nombre">${jugador.nombre_real}</div>
                        <div class = "puntaje">${jugador.puntaje}</div>
                        <div class = "trofeo">${jugador.posicion <= 3 ? '&#x1F3C6;' : ''}</div>
                    </li>
                `;
                ranking.innerHTML += li;
            });
        }
    } catch (error) {
        console.error("Error al cargar el ranking: ", error);
    }
    
}