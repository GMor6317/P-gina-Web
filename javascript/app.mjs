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

    const userId = req.params.id;

    const result = await db.ranking(connection, userId);

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

//-------------------------- NUEVO -----------------------
//Victorias por Mundo
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

/*  ESTA ES PARTICULAR  */
//Victorias por Nivel
app.get('/victorias/usuario/:id', async (req, res) => {
    let connection;

    try{
        connection = await db.connect();

        const userId = req.params.id;

        const result = await db.victoriasPorNivel(connection, userId);

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


//Promedio Puntos General
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

//Puntuacion Promedio Por Nivel
app.get('/puntuacion/promedio/:id', async (req, res) => {
    let connection;

    try{
        connection = await db.connect();

        const nivelId = req.params.id;

        const result = await db.puntuacionPromedioNivel(connection, nivelId);

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


//Puntuacion Promedio Por Mundo
app.get('/puntuacion/promedio/mundo/:mundoId', async (req, res) =>{
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


//Duracion Promedio por Mundo
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