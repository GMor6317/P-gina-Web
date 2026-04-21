import api_url from "./api_url.mjs";

async function getGraficasGenerales() {
    try {
        const response = await fetch(`${api_url}/graficas-generales`);
        const data = await response.json();
        if(data.length == null){
            console.error("Error: La respuesta no es un array");
        }

        const graficasContainer = document.getElementById("graficasGeneralesContainer");
        data.forEach((graficaData, index) => { //
            const graficaDiv = document.createElement("div");
            graficaDiv.classList.add("Grafica");
            graficaDiv.innerHTML = `
                <h2>Gráfica ${index + 1}</h2>
                <canvas id="miGrafica${index + 1}"></canvas>
            `;

            graficasContainer.appendChild(graficaDiv);
        });

    }

    
    catch (error) {
        console.error("Error al obtener las gráficas generales:", error);
    }
}