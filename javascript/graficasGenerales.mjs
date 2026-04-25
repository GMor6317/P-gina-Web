import API_URL from "./api_url.mjs";
import { crearGraficaVictoriasPorMundo } from "./graficas.mjs";
import { PromedioPuntajeNivel, PromedioPuntajePorMundo, victoriasPorMundo } from "./prueba.mjs";

const menuMundo = document.getElementById("filtroMundo");
const menuNivel = document.getElementById("filtroNivel");

let idMundoSeleccionado = null;
 
menuMundo.addEventListener("change", function(){
    //const idMundoSeleccionado = parseInt(this.value);
    idMundoSeleccionado = parseInt(this.value);
    console.log("Mundo seleccionado: ", idMundoSeleccionado);

    llamarGraficasPorMundo(idMundoSeleccionado);
});

menuNivel.addEventListener("change", function(){
    const idNivelSeleccionado = parseInt(this.value);

    if(idMundoSeleccionado){
        console.log("Nivel seleccionado: ", idNivelSeleccionado);
        llamarGraficasPorNivel(idMundoSeleccionado, idNivelSeleccionado);
    }
});




function llamarGraficasPorMundo(idMundo){
    victoriasPorMundo(idMundo);
    PromedioPuntajePorMundo(idMundo);
}


function llamarGraficasPorNivel(idMundo, idNivel){
    PromedioPuntajeNivel(idMundo, idNivel);
}






