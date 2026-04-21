import API_URL from "./api_url.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const menuBoton = document.getElementById('menuBtn');
    const navbar = document.querySelector('.navbar');


    menuBoton.addEventListener('click', () => {
        menuBoton.classList.toggle('open');
        navbar.classList.toggle('active');
    });


    // const idJugador = localStorage.getItem('id_jugador') || 1;
    // cargarVictorias(idJugador);

    // PromedioPuntajeGeneral();

    // const idNivel = localStorage.getItem('id_nivel') || 1;
    // PromedioPuntajeNivel(idNivel);

    // const idMundo = localStorage.getItem('id_mundo') || 1;
    // PromedioPuntajePorMundo(idMundo);

    // duracionPromedioPorMundo();
    const inicializarDashboard = async () => {
        try {
            const idJugador = localStorage.getItem('id_jugador') || 1;
            await cargarVictorias(idJugador);
        } catch (e) { console.error("Error en victorias:", e); }

        try {
            await PromedioPuntajeGeneral();
        } catch (e) { console.error("Error en promedio general:", e); }

        try {
            const idNivel = localStorage.getItem('id_nivel') || 1;
            await PromedioPuntajeNivel(idNivel);
        } catch (e) { console.error("Error en promedio nivel:", e); }

        try {
            const idMundo = localStorage.getItem('id_mundo') || 1;
            await PromedioPuntajePorMundo(idMundo);
        } catch (e) { console.error("Error en promedio mundo:", e); }

        try {
            await duracionPromedioPorMundo();
        } catch (e) { console.error("Error en duración:", e); }
    };

    inicializarDashboard();
});


//--------------------------- NUEVO ----------------------------------
//Victorias por Nivel
async function cargarVictorias(idJugador){
    const response = await fetch(
        `${ API_URL }/victorias/usuario/${idJugador}`
    );
    const dataVictory = await response.json();

    crearGraficaVictorias(dataVictory);
}


//Promedio Puntos General
async function PromedioPuntajeGeneral(){
    const response = await fetch(
        `${ API_URL }/puntuacion/promedio`
    );
    const dataAVGGeneral = await response.json();

    crearGraficaPromedioGeneral(dataAVGGeneral);
}


//Puntuacion Promedio Por Nivel
async function PromedioPuntajeNivel(nivelId){
    const response = await fetch(
        `${ API_URL }/puntuacion/promedio/${nivelId}`
    );
    const dataAVGNivel = await response.json();

    crearGraficaPromedioNivelGeneral(dataAVGNivel);
}


//Puntuacion Promedio Por Mundo
async function PromedioPuntajePorMundo(mundoId){
    const response = await fetch(
        `${ API_URL }/puntuacion/promedio/mundo/${mundoId}`
    );
    const dataAVGMundo = await response.json();

    crearGraficaPromedioMundoGeneral(dataAVGMundo);
}

//Duracion Promedio por Mundo
async function duracionPromedioPorMundo(){
    const response = await fetch(
        `${ API_URL }/duracion/promedio/mundos`
    );
    const dataDuracionMundos = await response.json();

    crearGraficaPromedioDuracionMundos(dataDuracionMundos);
}