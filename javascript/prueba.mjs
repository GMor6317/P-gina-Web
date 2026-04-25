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
    crearGraficaHabilidadJugador,
    crearGraficaVictoriasPorMundo,
    crearGraficaWinRate
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
            const idMundo = localStorage.getItem('id_mundo') || 1;
            await victoriasPorMundo(idMundo);
        } catch (e) { console.error("Error en victorias por mundo: ", e); }

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
// Gráficas Generales
//Victorias por Mundo - F
export async function victoriasPorMundo(mundoId){
    const response = await fetch(
        `${ API_URL }/victorias/mundo/${mundoId}`
    );
    const dataVictoriasMundo = await response.json();

    crearGraficaVictoriasPorMundo(dataVictoriasMundo);
}


//Promedio Puntos General - F
export async function PromedioPuntajeGeneral(){
    const response = await fetch(
        `${ API_URL }/puntuacion/promedio`
    );
    const dataAVGGeneral = await response.json();

    crearGraficaPromedioGeneral(dataAVGGeneral);
}


//Puntuacion Promedio Por Nivel - NF *******
export async function PromedioPuntajeNivel(mundoId, nivelId){
    const response = await fetch(
        `${ API_URL }/puntuacion/promedio/${mundoId}/${nivelId}`
    );
    const dataAVGNivel = await response.json();

    crearGraficaPromedioNivelGeneral(dataAVGNivel);
}


//Puntuacion Promedio Por Mundo - F
export async function PromedioPuntajePorMundo(mundoId){
    const response = await fetch(
        // `${ API_URL }/puntuacion/promedio/mundo/${mundoId}`
        `${ API_URL }/prueba/${mundoId}`
    );
    const dataAVGMundo = await response.json();

    crearGraficaPromedioMundoGeneral(dataAVGMundo);
}

//Duracion Promedio por Mundo - F
export async function duracionPromedioPorMundo(){
    const response = await fetch(
        `${ API_URL }/duracion/promedio/mundos`
    );
    const dataDuracionMundos = await response.json();

    crearGraficaPromedioDuracionMundos(dataDuracionMundos);
}

//------------------- GRAFICAS ACTUALIZADAS --------------------------
//Dificultad por Mundo - F
export async function dificultadPorMundo(){
    const response = await fetch(
        `${ API_URL }/dificultad/mundo`
    );
    const dataDificultadMundo = await response.json();

    crearGraficaDificultadPorNivel(dataDificultadMundo);
}


//Jugadores Únicos por Nivel - F
export async function jugadoresUnicosPorNivel(){
    const response = await fetch(
        `${ API_URL }/jugadores/nivel`
    );
    const dataJugadoresUnicos = await response.json();

    crearGraficaJugadoresUnicos(dataJugadoresUnicos);
}

//--------------------- Graficas Individuales -------------------------
//Victorias por Nivel - F 
export async function cargarVictorias(userName, userApellido){
    const response = await fetch(
        `${ API_URL }/victorias/usuario/${userName}/${userApellido}`
    );
    const dataVictory = await response.json();

    crearGraficaVictorias(dataVictory);
}


//Precision VS Duracion - F
export async function precisionVSDuracion(nombreJugador, apellidoJugador){
    const response = await fetch(
        `${ API_URL }/duracion/precision/${nombreJugador}/${apellidoJugador}`
    );
    const dataPrecisionVSDuracion = await response.json();

    crearGraficaDuracionVSPrecision(dataPrecisionVSDuracion);
}


//Habilidad Jugador***
export async function habilidadJugador(userName, userApellido){
    const response = await fetch(
        `${ API_URL }/habilidad/jugador/${userName}/${userApellido}`
    );
    const dataHabilidadJugador = await response.json();

    crearGraficaHabilidadJugador(dataHabilidadJugador);
}


//WinRate Jugador - F
export async function winRateJugador(userName, userApellido){
    const response = await fetch(
        `${ API_URL }/winrate/jugador/${userName}/${userApellido}`
    );
    const dataWinRate = await response.json();

    crearGraficaWinRate(dataWinRate);
}

