import API_URL from "./api_url.mjs";

import { 
    crearGraficaPromedioGeneral, 
    crearGraficaVictorias, 
    crearGraficaPromedioNivelGeneral,
    crearGraficaPromedioMundoGeneral,
    crearGraficaPromedioDuracionMundos,
    crearGraficaDificultadPorNivel,
    crearGraficaJugadoresUnicos,
    crearGraficaDuracionVSPrecision,
    crearGraficaHabilidadJugador
} from "./graficas.mjs";


document.addEventListener('DOMContentLoaded', () => {
    const menuBoton = document.getElementById('menuBtn');
    const navbar = document.querySelector('.navbar');


    menuBoton.addEventListener('click', () => {
        menuBoton.classList.toggle('open');
        navbar.classList.toggle('active');
    });


    const inicializarDashboard = async () => {
        //Generales
         try {
            await PromedioPuntajeGeneral();
        } catch (e) { console.error("Error en promedio general: ", e); }

        try {
            const idNivel = localStorage.getItem('id_nivel') || 1;
            await PromedioPuntajeNivel(idNivel);
        } catch (e) { console.error("Error en promedio nivel: ", e); }

        try {
            const idMundo = localStorage.getItem('id_mundo') || 1;
            await PromedioPuntajePorMundo(idMundo);
        } catch (e) { console.error("Error en promedio mundo: ", e); }

        try {
            await duracionPromedioPorMundo();
        } catch (e) { console.error("Error en duración: ", e); }

        try {
            await dificultadPorMundo();
        } catch (e) {console.error("Error en dificultad: ", e);}

        try {
            await jugadoresUnicosPorNivel();
        } catch(e) { console.error("Error en jugadores únicos: ", e)}


        //Particulares
        try {
            const idJugador = localStorage.getItem('id_jugador') || 1;
            await cargarVictorias(idJugador);
        } catch (e) { console.error("Error en victorias: ", e); }

        try {
            const idJugador = localStorage.getItem('id_jugador') || 1;
            await precisionVSDuracion(idJugador);
        } catch (e) { console.error("Error en precisión vs duración: ", e); }
        
        try {
            const idJugador = localStorage.getItem('id_jugador') || 1;
            await habilidadJugador(idJugador);
        } catch (e) { console.error("Error en habilidad: ", e); }
    };
    
    inicializarDashboard();
});


//--------------------------- NUEVO ----------------------------------
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

//------------------- GRAFICAS ACTUALIZADAS --------------------------
//Dificultad por Mundo
async function dificultadPorMundo(){
    const response = await fetch(
        `${ API_URL }/dificultad/mundo`
    );
    const dataDificultadMundo = await response.json();

    crearGraficaDificultadPorNivel(dataDificultadMundo);
}


//Jugadores Únicos por Nivel
async function jugadoresUnicosPorNivel(){
    const response = await fetch(
        `${ API_URL }/jugadores/nivel`
    );
    const dataJugadoresUnicos = await response.json();

    crearGraficaJugadoresUnicos(dataJugadoresUnicos);
}

//--------------------- Graficas Individuales -------------------------
//Victorias por Nivel
async function cargarVictorias(idJugador){
    const response = await fetch(
        `${ API_URL }/victorias/usuario/${idJugador}`
    );
    const dataVictory = await response.json();

    crearGraficaVictorias(dataVictory);
}


//Precision VS Duracion
async function precisionVSDuracion(idJugador){
    const response = await fetch(
        `${ API_URL }/duracion/precision/${idJugador}`
    );
    const dataPrecisionVSDuracion = await response.json();

    crearGraficaDuracionVSPrecision(dataPrecisionVSDuracion);
}


//Habilidad Jugador
async function habilidadJugador(idJugador){
    const response = await fetch(
        `${ API_URL }/habilidad/jugador/${idJugador}`
    );
    const dataHabilidadJugador = await response.json();

    crearGraficaHabilidadJugador(dataHabilidadJugador);
}

