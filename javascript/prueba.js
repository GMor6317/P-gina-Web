import API_URL from "./api_url.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const menuBoton = document.getElementById('menuBtn');
    const navbar = document.querySelector('.navbar');


    menuBoton.addEventListener('click', () => {
        menuBoton.classList.toggle('open');
        navbar.classList.toggle('active');
    });
});

//--------------------------- NUEVO ----------------------------------
async function cargarVictorias(idJugador){
    const response = await fetch(
        `${ API_URL }/victorias/${idJugador}`
    );
    const dataVictory = await response.json();

    crearGraficaVictorias(dataVictory);
}

async function PromedioPuntajeGeneral(){
    const response = await fetch(
        `${ API_URL }/puntuacion/promedio`
    );
    const dataAVGGeneral = await response.json();

    crearGraficaPromedioGeneral(dataAVGGeneral);
}

async function PromedioPuntajeNivel(nivelId){
    const response = await fetch(
        `${ API_URL }/puntuacion/promedio/${nivelId}`
    );
    const dataAVGNivel = await response.json();

    crearGraficaPromedioNivelGeneral(dataAVGNivel);
}

async function PromedioPuntajePorMundo(mundoId){
    const response = await fetch(
        `${ API_URL }/puntuaciones/promedio/mundo/${mundoId}`
    );
    const dataAVGMundo = await response.json();

    crearGraficaPromedioMundoGeneral(dataAVGMundo);
}