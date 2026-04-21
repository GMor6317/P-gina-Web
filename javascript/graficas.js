
// import ;

const g1 = document.getElementById('miGrafica').getContext('2d');
const g2 = document.getElementById('miGrafica2').getContext('2d');
const g3 = document.getElementById('miGrafica3').getContext('2d');

const miGrafica = new Chart(g1, {
    type: 'bar', // Puede ser 'line', 'pie', 'doughnut', etc.
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
        datasets: [{
            label: 'Jugadores por mes',
            data: [12, 19, 3, 5],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const miGrafica2 = new Chart(g2, {
    type: 'pie',
    data: {
        labels: ['1 Estrellas', '2 Estrellas', '3 Estrellas'],
        datasets: [{
            label: 'Número de jugadores y estrellas obtenidas en Nivel 1',
            data: [2, 5, 13],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset : 4
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const miGrafica3 = new Chart(g3, {
    type: 'line',
    data: {
        labels: [1, 2, 3, 4, 5],
        datasets: [{
            label: 'Mejora por nivel',
            data: [5, 4, 6, 10, 10],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }
});



//------------------------- NUEVO ------------------------------------
//Victorias por Nivel
function crearGraficaVictorias(dataVictory){
    const niveles = dataVictory.map(d => "Nivel " + d.num_nivel);
    const victorias = dataVictory.map(d => d.victorias);
    
    new Chart(document.getElementById('graficaVictorias').getContext('2d'), {
        type: "bar",
        data:{
            labels: niveles,
            datasets: [{
                label: "Victorias",
                data: victorias
            }]
        }
    });
}

//Promedio Puntos General
function crearGraficaPromedioGeneral(dataAVGGeneral){
    const mundos = [...new Set(dataAVGGeneral.map(item => item.mundo))];
    const niveles = [...new Set(dataAVGGeneral.map(item => item.num_nivel))];

    const datasets = mundos.map(mundo =>{
        return {
            label: mundo,
            data: niveles.map(nivel =>{
                const registro = dataAVGGeneral.find(d => d.mundo === mundo && d.num_nivel === nivel);
                return registro ? registro.PromedioPuntaje : 0;
            }),
            backgroundColor : `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
        };
    });

    const ctx = document.getElementById('graficaAVGGeneral').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: niveles.map(n => `Nivel ${n}`),
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {beginAtZero: true,
                    title: { display: true, text: 'Promedio de Aciertos' }
                }
            }
        }
    });
}


//Puntuacion Promedio Por Mundo
function crearGraficaPromedioMundoGeneral(dataAVGMundo){
    const niveles = dataAVGMundo.map(item => `Nivel ${item.num_nivel}`);
    const promedios = dataAVGMundo.map(item => item.PromedioPuntaje);

    new Chart(document.getElementById('graficaAVGMundo').getContext('2d'), {
        type: 'line',
        data: {
            labels: niveles,
            datasets: [{
                label: 'Promedio de puntaje',
                data: promedios,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {beginAtZero: true}
            }
        }
    });
}

//Puntuacion Promedio Por Nivel
function crearGraficaPromedioNivelGeneral(dataAVGNivel){
    const promedio = dataAVGNivel[0].PromedioPuntaje;

    new Chart(document.getElementById('graficaAVGNivel').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Nivel'],
            datasets: [{
                label: 'Promedio de puntaje',
                data: [promedio],
                backgroundColor: 'rgba(54, 162, 235, 0.6'
            }]
        },
        options: {
            scales: {
                y: {beginAtZero: true}
            }
        }
    });
}


//Duracion Promedio por Mundo
function crearGraficaPromedioDuracionMundos(dataDuracionMundos){
    const mundos = Array.from(new Set(dataDuracionMundos.map(item => item.mundo)));
    const niveles = Array.from(new Set(dataDuracionMundos.map(item => item.num_nivel)));

    const datasets = mundos.map(mundo =>{
        return {
            label: `Mundo ${mundo}`,
            data: niveles.map(nivel =>{
                const registro = dataDuracionMundos.find(d => d.mundo === mundo && d.num_nivel === nivel);
                return registro ? registro.DuracionPromedio : null;
            }),
            backgroundColor : `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`
        };
    });

    new Chart(document.getElementById('graficaDuracionMundos').getContext('2d'), {
        type: 'bar',
        data: {
            labels: niveles.map(n => `Nivel ${n}`),
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Duracion Promedio'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Niveles'
                    }
                }
            }
        }
    });
}