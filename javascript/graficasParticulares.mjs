import API_URL from "./api_url.mjs";
import { cargarVictorias, habilidadJugador, precisionVSDuracion, winRateJugador } from "./prueba.mjs";



const boxNombre = document.getElementById("buscadorNombre");
const boxApellidos = document.getElementById("buscadorApellido");
const buscar = document.getElementById("botonBuscar");

buscar.addEventListener("click", function(){
    let nombre = boxNombre.value;
    let apellido = boxApellidos.value;

    console.log(`Buscando datos de ${nombre} ${apellido}...`);
    llamarGraficasJugador(nombre, apellido);
});


function llamarGraficasJugador(nombre, apellidos){
    cargarVictorias(nombre, apellidos);
    precisionVSDuracion(nombre, apellidos);
    habilidadJugador(nombre, apellidos);
    winRateJugador(nombre, apellidos);
}