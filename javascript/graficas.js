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