import express from 'express';
import cors from 'cors';
import db from './starMaths.mjs';

const app = express();
const port = process.env.PORT ?? 8080;
const ipAddress = process.env.C9_HOSTNAME ?? 'localhost';

app.use(cors());
app.use(express.json());


app.get('/jugador', async (req, res) => {
  let connection;

  try {
    connection = await db.connect();
    let url;
    if(process.env.AWS_LAMBDA_FUNCTION_NAME === undefined){
      url = `http://${ ipAddress }:${ port }`;
    }
    else {
      url = `https://${ req.hostname }:`;
    }

    const [rows] = await connection.execute(
      "SELECT * FROM Jugador"
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });

  } finally {
    if (connection) {
      await connection.end();
    }
  }
});


app.post('/login', async (req, res) => {
  let connection;

  try {
    const {nombre_usuario, contrasenia} = req.body;
    

    if (!nombre_usuario || !contrasenia) {
        
      return res.json({
        exito: false,
        aviso: "Faltan datos"
         
      });
    }

    connection = await db.connect();


    const result = await db.login(
      connection,
      nombre_usuario,
      contrasenia
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({
      exito: false,
      aviso: err.message
    });

  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

/*app.post('/logout', async (req, res) => {
  let connection;

  try {
    const { sesionId, hora_final } = req.body;

    connection = await db.connect();

    await connection.execute(
      "UPDATE Sesion SET fecha_final=? WHERE id_sesion=?",
      [hora_final, sesionId]
    );

    res.json({ exito: true, aviso: "Sesión cerrada" });

  } catch (err) {
    res.status(500).json({ exito: false, aviso: err.message });

  } finally {
    if (connection) {
      await connection.end();
    }
  }
}); */

app.post('/registro', async (req, res) => {
  let connection;

  try {
    const data = req.body;

    if (
      !data.nombre_usuario ||
      !data.corre_electronico ||
      !data.contrasenia ||
      !data.genero ||
      !data.nombre ||
      !data.apellidos ||
      !data.fecha_nacimiento ||
      !data.grado_escolar
    ) {
      return res.json({
        exito: false,
        aviso: "Faltan datos"
      });
    }

    connection = await db.connect();

    const result = await db.registro(connection, data);

    res.json(result);

  } catch (err) {
    res.status(500).json({
      exito: false,
      aviso: err.message
    });

  } finally {
    if (connection) {
      await connection.end();
    }
  }
});
  

app.post('/puntaje', async (req, res) => {
  let connection;

  try {
    const data = req.body;

    if (
      data.puntaje == null ||
      data.duracion == null ||
      data.victoria == null ||
      data.estrellas == null ||
      data.precision == null ||
      !data.id_jugador ||
      !data.id_mundo ||
      !data.nivel
    ) {
      return res.json({
        exito: false,
        aviso: "Faltan datos"
      });
    }

    connection = await db.connect();

    const result = await db.puntaje(connection, data);

    res.json(result);

  } catch (err) {
    res.status(500).json({
      exito: false,
      aviso: err.message
    });

  } finally {
    if (connection) {
      await connection.end();
    }
  }
});


app.get('/ranking/:id', async (req, res) => {
  let connection;

  try {
    connection = await db.connect();

    const JugadorId = req.params.id;

    const result = await db.ranking(connection, JugadorId);

    res.json(result);

  } catch (err) {
    res.status(500).json({
      exito: false,
      aviso: err.message
    });

  } finally {
    if (connection) await connection.end();
  }
});

app.post ('/configuracion', async (req, res) => {
  let connection;
  try {
  const data=req.body;
  
  connection =await db.connect ();
  const result =await db.configuracion (connection, data);
  
  res.json (result);}
  
  catch (err){
      return res.status(500).json({
      exito: false,
      aviso: err.message
    });

  } finally {
    if (connection) {
      await connection.end();
      }    
  }
});

 app.get ('/configuracion/:id', async(req, res)=>{
   let connection;
   try {
     connection=await db.connect ();
     const id_jugador = req.params.id;
     const result = await db.CualConfiguracion(connection, id_jugador);
     res.json(result);
   }
   catch (err){
     res.status(500).json({
       exito:false,
       aviso: err.message
     }
       );
   }
   finally{
     if (connection) await connection.end;
   }
 });
  
//-------------------------- NUEVO -----------------------
// 1. Victorias por Mundo
app.get('/victorias/mundo/:mundoId', async (req, res) => {
    let connection;

    try{
        connection = await db.connect();

        const mundoId = req.params.mundoId;



        const result = await db.victoriasPorMundo(connection, mundoId);

        res.json(result);
    }
    catch(err){
        res.status(500).json({
            exito: false,
            aviso: err.message
        });
    }
    finally{
        if(connection) await connection.end();
    }
});


// 2. Promedio Puntos General
app.get('/puntuacion/promedio', async (req,res) =>{
    let connection;

    try{
        connection = await db.connect();

        const result = await db.puntuacionPromedioGeneral(connection);

        res.json(result);
    }
    catch(err){
        res.status(500).json({
            exito: false,
            aviso: err.message
        });
    }
    finally{
        if(connection) await connection.end();
    }
});

// 3. Puntuacion Promedio Por Nivel ****
app.get('/puntuacion/promedio/:idMundo/:idNivel', async (req, res) => {
    let connection;

    try{
        connection = await db.connect();

        const mundoId = req.params.idMundo;

        const nivelId = req.params.idNivel;

        const result = await db.puntuacionPromedioNivel(connection, mundoId, nivelId);

        res.json(result);
    }
    catch(err){
        res.status(500).json({
            exito: false,
            aviso: err.message
        });
    }
    finally{
        if(connection) await connection.end();
    }
});


// 4. Puntuacion Promedio Por Mundo
// app.get('/puntuacion/promedio/mundo/:mundoId', async (req, res) =>{
  app.get('/prueba/:mundoId', async (req, res) =>{
    let connection;

    try{
        connection = await db.connect();

        const mundoId = req.params.mundoId;

        const result = await db.puntuacionPromedioPorMundo(connection, mundoId);

        res.json(result);
    }
    catch(err){
        res.status(500).json({
            exito: false,
            aviso: err.message
        });
    }
    finally{
        if(connection) await connection.end();
    }
});


// 5. Duracion Promedio por Mundo
app.get('/duracion/promedio/mundos', async (req, res) => {
    let connection;

    try{
        connection = await db.connect();

        const result = await db.duracionPromedioPorMundo(connection);

        res.json(result);
    }
    catch(err){
        res.status(500).json({
            exito: false,
            aviso: err.message
        });
    }
    finally{
        if(connection) await connection.end();
    }
});


//----------------- GRAFICAS ACTUALIZADAS ------------------------
// 6. Dificultad por mundo
app.get('/dificultad/mundo', async (req, res) => {
    let connection;

    try{
        connection = await db.connect();

        const result = await db.dificultadPorMundo(connection);

        res.json(result);
    }
    catch(err){
        res.status(500).json({
            exito: false,
            aviso: err.message
        });
    }
    finally{
        if(connection) await connection.end();
    }
});


// 7. Jugadores Únicos Por Nivel
app.get('/jugadores/nivel', async (req, res) => {
    let connection;

    try{
        connection = await db.connect();

        const result = await db.jugadoresUnicosPorNivel(connection);

        res.json(result);
    }
    catch(err){
        res.status(500).json({
            exito: false,
            aviso: err.message
        });
    }
    finally{
        if(connection) await connection.end();
    }
});


//-----------------Graficas individuales-----------------------------
// 1. Victorias por Nivel
app.get('/victorias/usuario/:nombre/:apellido', async (req, res) => {
    let connection;

    try{
        connection = await db.connect();

        const userName = req.params.nombre;
        const userApellido = req.params.apellido;

        const result = await db.victoriasPorNivel(connection, userName, userApellido);

        res.json(result);
    }
    catch(err){
        res.status(500).json({
            exito: false,
            aviso: err.message
        });
    }
    finally{
        if(connection) await connection.end();
    }
});


// 2. Duración vs precisión
app.get('/duracion/precision/:nombre/:apellido', async (req, res) => {
    let connection;

    try{
        connection = await db.connect();

        const nombreJugador = req.params.nombre;
        const apellidoJugador = req.params.apellido;

        const result = await db.precisionVSDuracion(connection, nombreJugador, apellidoJugador);

        res.json(result);
    }
    catch(err){
        res.status(500).json({
            exito: false,
            aviso: err.message
        });
    }
    finally{
        if(connection) await connection.end();
    }
});


// 3. Habilidad
app.get('/habilidad/jugador/:nombre/:apellido', async (req, res) => {
    let connection;

    try{
        connection = await db.connect();

        const nombreJugador = req.params.nombre;
        const apellidoJugador = req.params.apellido;

        const result = await db.habilidadJugador(connection, nombreJugador, apellidoJugador);

        res.json(result);
    }
    catch(err){
        res.status(500).json({
            exito: false,
            aviso: err.message
        });
    }
    finally{
        if(connection) await connection.end();
    }
});


// 4. WinRate Jugador
app.get('/winrate/jugador/:nombre/:apellido', async (req, res) => {
  let connection;

  try{
    connection = await db.connect();

    const userName = req.params.nombre;
    const usarApellido = req.params.apellido;

    const result = await db.winRateJugador(connection, userName, usarApellido);

    res.json(result);
  }
  catch(err){
    res.status(500).json({
      exito: false,
      aviso: err.message
    });
  }
  finally{
    if(connection) await connection.end();
  }
});

//--------------------- Ranking Administrador -------------------------
app.get('/dashboard/ranking', async (req, res) => {
  let connection;
  try {
    connection = await db.connect();

    const result = await db.rankingAdministrador(connection);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      exito: false,
      error: err.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

//--------------------- Registro De Administrador -------------------------
app.post('/validar', async (req, res) => {
    const { username, password } = req.body; 
    
    let connection;
    try {
        connection = await db.connect();
        const admin = await db.validarAdmin(connection, username, password);

        if (admin) {
            res.json({ exito: true });
        } else {
            res.status(401).json({ exito: false, mensaje: 'Incorrecto' });
        }
    } catch (err) {
        res.status(500).json({ exito: false });
    } finally {
        if (connection) await connection.end();
    }
});



app.use((req, res) => {
  res.status(404).json({ aviso: "Not Found" });
});

if (process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
  app.listen(port, () => {
    console.log(
      `Server listening at http://${ ipAddress }:${ port }`);
  });
}

export default app;