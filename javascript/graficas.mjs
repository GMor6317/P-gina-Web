//import { text } from "body-parser";

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
//------------------------- Gráficas Generales -------------------------
// 1. Victorias por Mundo
export function crearGraficaVictoriasPorMundo(dataWinRate){
    const elemento = document.getElementById('graficaWinRate');

    const winRate = parseFloat(dataWinRate[0].PorcentajeWinRate);
    const loseRate = 100 - winRate;

    new Chart(elemento.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Victorias', 'Derrotas'],
            datasets: [{
                data: [winRate, loseRate],
                backgroundColor: [
                    'rgba(75, 192, 192, 0,7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Tasa de Éxito ${dataWinRate[0].id_mundo}`
                },
                tooltip: {
                    callbacks: {
                        label: (context) => ` ${context.label}: ${context.raw.toFixed(1)}%`
                    }
                }
            }
        }
    });
}

// 2. Promedio Puntos General
export function crearGraficaPromedioGeneral(dataAVGGeneral){
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


// 3. Puntuacion Promedio Por Nivel
export function crearGraficaPromedioNivelGeneral(dataAVGNivel){
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


// 4. Puntuacion Promedio Por Mundo
export function crearGraficaPromedioMundoGeneral(dataAVGMundo){
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


// 5. Duracion Promedio por Mundo
export function crearGraficaPromedioDuracionMundos(dataDuracionMundos){
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


// 6. Dificultad por Mundos
export function crearGraficaDificultadPorNivel(dataDificultadMundo){
    const dataset = dataDificultadMundo.map(d => ({
        x: d.id_mundo,
        y: d.num_nivel,
        r: d.promedio_estrellas * 5
    }));

    new Chart(document.getElementById("graficaDificutadPorMundo").getContext('2d'),{
        type: 'bubble',
        data:{
            datasets:[{
                label:'Dificultad por Mundo',
                data: dataset,
                backgroundColor : `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`
            }]
        },
        options:{
            scales:{
                x:{
                    title:{display:true, text:'Mundo'}
                },
                y:{
                    title:{display: true, text:'Nivel'}
                }
            }
        }
    });
}


// 7. Jugadores Unicos Por Nivel
export function crearGraficaJugadoresUnicos(dataJugadoresUnicos){
    const niveles = dataJugadoresUnicos.map(d => "Nivel " + d.num_nivel);
    const jugadores = dataJugadoresUnicos.map(d => d.jugadores);

    new Chart(document.getElementById('graficaJugadoresUnicos').getContext('2d'),{
        type: 'bar',
        data:{
            labels: niveles,
            datasets:[{
                label:'Jugadores que llegaron',
                data: jugadores,
                backgroundColor : `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`
            }]
        },
        options: {
            // indexAxis: 'y',
            responsive: true,
            scales: {
                y: {beginAtZero: true},
                x: {beginAtZero: true}
            }
        }
    });
}

//------------------------- Gráficas Particulares -------------------------
// 1. Victorias por Nivel
export function crearGraficaVictorias(dataVictory){
    const niveles = dataVictory.map(d => "Nivel " + d.num_nivel);
    const victorias = dataVictory.map(d => d.victorias);
    
    new Chart(document.getElementById('graficaVictorias').getContext('2d'), {
        type: "bar",
        data:{
            labels: niveles,
            datasets: [{
                label: "Victorias",
                data: victorias,
                backgroundColor : `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`
            }],
        }
    });
}


// 2. Duracion VS Precision
export function crearGraficaDuracionVSPrecision(dataPrecisionVSDuracion){
    const puntos = dataPrecisionVSDuracion.map(p => ({
        x: Number(p.duracion),
        y: Number(p.precision_juego)
    }));

    new Chart(document.getElementById('graficaDuracionVSPrecision'), {
        type: 'scatter',
        data:{
            datasets: [{
                label: 'Partidas',
                data: puntos,
                backgroundColor : `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`
            }],
        },
        options: {
            scales: {
                x: {
                    title:{display: true, text: 'Duración (segundos)'}
                },
                y:{
                    title:{display: true, text: 'Precisión (%)'},
                    min: 0,
                    max : 100
                }
            }
        }
    });
}


// 3. Habilidad Jugador
export function crearGraficaHabilidadJugador(dataHabilidadJugador){
    new Chart(document.getElementById('graficaHabilidadJugador').getContext('2d'),{
        type: 'radar',
        data:{
            labels:[
                'Precisión',
                'Consistencia',
                'Velocidad',
                'Resistencia',
                'Progreso'
            ],

            datasets:[{
                label: 'Perfil del jugador',
                data:[
                    dataHabilidadJugador.precision,
                    dataHabilidadJugador.consistencia,
                    200 - dataHabilidadJugador.velocidad,
                    dataHabilidadJugador.resistencia / 2,
                    dataHabilidadJugador.progreso * 20
                ],
                backgroundColor : `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`
            }]
        }
    })
}


// 4. WinRate Jugador 
export function crearGraficaWinRate(dataWinRate){
    const elemento = document.getElementById('graficaWinRate');

    const winRate = parseFloat(dataWinRate[0].PorcentajeWinRate);
    const loseRate = 100 - winRate;

    new Chart(elemento.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Victorias', 'Derrotas'],
            datasets: [{
                data: [winRate, loseRate],
                backgroundColor: [
                    'rgba(75, 192, 192, 0,7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Tasa de Éxito ${dataWinRate[0].id_mundo}`
                },
                tooltip: {
                    callbacks: {
                        label: (context) => ` ${context.label}: ${context.raw.toFixed(1)}%`
                    }
                }
            }
        }
    });
}









