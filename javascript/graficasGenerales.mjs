import API_URL from "./api_url.mjs";
import { crearGraficaVictoriasPorMundo } from "./graficas.mjs";
import { PromedioPuntajeNivel, PromedioPuntajePorMundo, victoriasPorMundo } from "./prueba.mjs";

const menuMundo = document.getElementById("filtroMundo");
const menuNivel = document.getElementById("filtroNivel");

menuMundo.addEventListener("change", function(){
    const idMundoSeleccionado = parseInt(this.value);
    console.log("Mundo seleccionado: ", idMundoSeleccionado);
    llamarGraficasPorMundo(idMundoSeleccionado);
});

menuNivel.addEventListener("change", function(){
    const idNivelSeleccionado = this.value;
    console.log("Nivel seleccionado: ", idNivelSeleccionado);
    llamarGraficasPorNivel(idNivelSeleccionado);
});




function llamarGraficasPorMundo(idMundo){
    victoriasPorMundo(idMundo);
    PromedioPuntajePorMundo(idMundo);
}


function llamarGraficasPorNivel(idNivel){
    PromedioPuntajeNivel(idNivel);

}






function almacenarMundo(idMundo){
    mundo_nivel.set("mundo", idMundo);
}



function almacenarNivel(idNivel){
    mundo_nivel.set("nivel", idNivel);
}






