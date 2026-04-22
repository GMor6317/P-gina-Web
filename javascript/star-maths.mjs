import mysql from 'mysql2/promise';

async function connect() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "StarMaths"
  });
}


async function login(connection, nombre_usuario, contrasenia) {
  const [rows] = await connection.execute(
    "SELECT id_jugador, nombre_usuario FROM Jugador WHERE nombre_usuario=? AND contrasenia=?",
    [nombre_usuario, contrasenia]
  );

  if (rows.length > 0) {
    const id_jugador = rows[0].id_jugador;

    return { exito: true,
      aviso: "Login correcto",
      id_jugador: rows[0].id_jugador};
  }

  return { exito: false, aviso: "Usuario o contraseña incorrectos" };

}

async function registro(connection, data) {
  const {
    nombre_usuario,
    corre_electronico,
    contrasenia,
    genero,
    nombre,
    apellidos,
    fecha_nacimiento,
    grado_escolar
  } = data;

  const [result] = await connection.execute(
    `INSERT INTO Jugador  (nombre_usuario, corre_electronico, contrasenia, genero, nombre, apellidos, fecha_nacimiento, grado_escolar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre_usuario,
      corre_electronico,
      contrasenia,
      genero,
      nombre,
      apellidos,
      fecha_nacimiento,
      grado_escolar
    ]
  );

  return {
    exito: true,
    aviso: "Usuario registrado",
    id_jugador: result.insertId
  };
}

async function puntaje(connection, data) {
  const {
    puntaje,
    duracion,
    victoria,
    estrellas,
    precision,
    id_jugador,
    id_mundo,
    nivel
  } = data;

  const [nivelRows] = await connection.execute(
    `SELECT id_nivel FROM Nivel WHERE id_mundo = ? AND num_nivel = ?`,
    [id_mundo, nivel]
  );

  if (nivelRows.length === 0) {
    return {
      exito: false,
      aviso: "Nivel no encontrado"
    };
  }

  const id_nivel = nivelRows[0].id_nivel;

  const [result] = await connection.execute(
    `INSERT INTO Partida 
    (puntaje, duracion, victoria, estrellas, precision_juego, id_jugador, id_nivel)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      puntaje,
      duracion,
      victoria,
      estrellas,
      precision,
      id_jugador,
      id_nivel
    ]
  );

  return {
    exito: true,
    aviso: "Partida guardada",
    id_partida: result.insertId
  };
}

export async function ranking(connection, userId) {

  const [top] = await connection.execute(`
    SELECT 
  j.nombre_usuario,
  COALESCE(SUM(p.puntaje), 0) as puntaje_total
FROM Jugador j
LEFT JOIN Partida p ON p.id_jugador = j.id_jugador
GROUP BY j.id_jugador
ORDER BY puntaje_total DESC
LIMIT 4
  `);


  const [miRows] = await connection.execute(`
    SELECT 
  j.nombre_usuario,
  SUM(p.puntaje) as puntaje_total
FROM Jugador j
LEFT JOIN Partida p ON p.id_jugador = j.id_jugador
WHERE j.id_jugador = ?
GROUP BY j.id_jugador
  `, [userId]);

  let mipuntaje = miRows[0];

if (!mipuntaje) {
  mipuntaje = {
    nombre_usuario: "Jugador",
    puntaje_total: 0
  };
}

if (!mipuntaje.puntaje_total) {
  mipuntaje.puntaje_total = 0;
}

mipuntaje.puntaje_total = Number(mipuntaje.puntaje_total);

top.forEach(p => {
  p.puntaje_total = Number(p.puntaje_total);
});

  const [posRows] = await connection.execute(`
    SELECT COUNT(*) + 1 as posicion
    FROM (
        SELECT id_jugador, SUM(puntaje) as total
        FROM Partida
        GROUP BY id_jugador
    ) t
    WHERE total > ?
  `, [mipuntaje.puntaje_total]);

  let posicion = posRows[0]?.posicion || 1;

    return {
  exito: true,

  top1: top[0] || { nombre_usuario: "", puntaje_total: 0 },
  top2: top[1] || { nombre_usuario: "", puntaje_total: 0 },
  top3: top[2] || { nombre_usuario: "", puntaje_total: 0 },
  top4: top[3] || { nombre_usuario: "", puntaje_total: 0 },

  mipuntaje: {
    nombre_usuario: mipuntaje.nombre_usuario || "",
    puntaje_total: Number(mipuntaje.puntaje_total) || 0
  },

  posicion: Number(posicion) || 0
  };
}

//------------------------- NUEVO -----------------------
async function victoriasPorMundo(connection, mundoId){
    const [rows] = await connection.execute(`
        SELECT m.id_mundo, COUNT(CASE WHEN p.victoria = 1 THEN 1 END) * 100.0 / COUNT(*) AS PorcentajeWinRate
        FROM Partida p
        JOIN Nivel n ON n.id_nivel = p.id_nivel
        JOIN Mundo m ON m.id_mundo = n.id_mundo
        WHERE m.id_mundo = ?
        GROUP BY m.id_mundo
    `, [mundoId]);
    return rows;
}


//Promedio Puntos General
async function puntuacionPromedioGeneral(connection){
    const [rows] = await connection.execute(`
    SELECT m.nombre AS mundo, n.num_nivel, AVG(p.puntaje) AS PromedioPuntaje
    FROM Partida p 
    JOIN Nivel n ON n.id_nivel = p.id_nivel
    JOIN Mundo m ON m.id_mundo = n.id_mundo
    GROUP BY m.nombre, n.num_nivel
    ORDER BY m.nombre, n.num_nivel;
    `);
    return rows;
}


//Puntuacion Promedio Por Mundo
async function puntuacionPromedioPorMundo(connection, mundoId){
    const [rows] = await connection.execute(`
        SELECT n.num_nivel, AVG(p.puntaje) AS PromedioPuntaje
        FROM Partida p
        JOIN Nivel n ON p.id_nivel = n.id_nivel
        WHERE n.id_mundo = ?
        GROUP BY n.num_nivel
        ORDER BY n.num_nivel
    `, [mundoId]);
    return rows;
}

//Puntuacion Promedio Por Nivel
async function puntuacionPromedioNivel(connection, nivelId){
    const [rows] = await connection.execute(`
        SELECT AVG(puntaje) AS PromedioPuntaje
        FROM Partida p
        WHERE p.id_nivel = ?
        GROUP BY p.id_nivel
    `, [nivelId]);
    return rows;
}

//Duracion Promedio por Mundo
async function duracionPromedioPorMundo(connection){
    const [rows] = await connection.execute(`
        SELECT m.id_mundo, AVG(p.duracion) AS DuracionPromedio
        FROM Partida p
        JOIN Nivel n ON n.id_nivel = p.id_nivel
        JOIN Mundo m ON m.id_mundo = n.id_mundo
        GROUP BY m.id_mundo;
    `);
    return rows;
}

//----------------------- GRAFICAS ACTUALIZADAS ---------------------
//Dificultad por Mundo
async function dificultadPorMundo(connection){
    const [rows] = await connection.execute(`
        SELECT n.id_mundo, n.num_nivel, AVG(p.estrellas) AS promedio_estrellas
        FROM Partida p
        JOIN Nivel n ON p.id_nivel = n.id_nivel
        GROUP BY n.id_mundo, n.num_nivel
        ORDER BY n.id_mundo, n.num_nivel;
    `);
    return rows;
}


//Jugadores Únicos por Nivel
async function jugadoresUnicosPorNivel(connection){
    const [rows] = await connection.execute(`
        SELECT n.id_mundo, n.num_nivel, COUNT(DISTINCT p.id_jugador) AS jugadores
        FROM Partida p
        JOIN Nivel n ON p.id_nivel = n.id_nivel
        GROUP BY n.id_mundo, n.num_nivel
        ORDER BY n.id_mundo, n.num_nivel;
    `);
    return rows;
}


//----------------- Graficas individuales ----------------------------
//Victorias por Nivel
async function victoriasPorNivel(connection, userName, userApellido){
    const [rows] = await connection.execute(`
        SELECT n.num_nivel, COUNT(*) AS victorias
        FROM Partida p
        JOIN Nivel n ON p.id_nivel = n.id_nivel
        JOIN Jugador j ON p.id_jugador = j.id_jugador
        WHERE j.nombre = ?
        AND j.apellidos = ? 
        AND p.victoria = 1
        GROUP BY n.num_nivel
        ORDER BY n.num_nivel;            
    `, [userName, userApellido]);
    return rows;
}


//Precision VS Duracion
async function precisionVSDuracion(connection, nombreJugador, apellidoJugador){
    const [rows] = await connection.execute(`
        SELECT  duracion, precision_juego
        FROM Partida p
        JOIN Jugador j ON p.id_jugador = j.id_jugador
        WHERE j.nombre = ?
        AND j.apellidos = ? 
    `, [nombreJugador, apellidoJugador]);
    return rows;
}


async function habilidadJugador(connection, idJugador){
    const [rows] = await connection.execute(`
        SELECT
            AVG(p.precision_juego) AS precision,
            AVG(p.estrellas) AS consistencia,
            AVG(p.duracion) AS velocidad_prom,
            MAX(p.duracion) AS resistencia,
            MAX(n.num_nivel) AS progreso
        FROM Partida p
        JOIN Nivel n ON p.id_nivel = n.id_nivel
        JOIN Jugador j ON p.id_jugador = j.id_jugador
        WHERE j.nombre = ?
        AND j.apellidos = ? 
    `, [idJugador]);
    return rows;
}


async function winRateJugador(connection, userName, userApellido){
  const [rows] = await connection.execute(`
    SELECT m.id_mundo, COUNT(CASE WHEN p.victoria = 1 THEN 1 END) * 100.0 / COUNT(*) AS PorcentajeWinRate
        FROM Partida p
        JOIN Nivel n ON n.id_nivel = p.id_nivel
        JOIN Mundo m ON m.id_mundo = n.id_mundo
        JOIN Jugador j ON j.id_jugador = p.id_jugador
        WHERE j.nombre = ?
        AND j.apellidos = ?
        GROUP BY m.id_mundo
    `, [userName, userApellido]);
    return rows;
}


//------------------------ Ranking Administrador -------------------------
export async function rankingAdministrador(connection) {
  const [rows] = await connection.execute(`
    SELECT 
      RANK() OVER (ORDER BY SUM(p.puntaje) DESC) as posicion,
      j.nombre_usuario,
      j.nombre,
      j.apellidos,
      COALESCE(SUM(p.puntaje), 0) as puntaje_total
    FROM jugador j
    LEFT JOIN partida p ON p.id_jugador = j.id_jugador
    GROUP BY j.id_jugador
    ORDER BY puntaje_total DESC
  `);

  return {
    exito: true,
    datos: rows.map(r => ({
      posicion: r.posicion,
      usuario: r.nombre_usuario,
      nombre_real: `${r.nombre} ${r.apellidos}`, 
      puntaje: Number(r.puntaje_total)
    }))
  };
}

export default {
  connect,
  login,
  registro, 
  puntaje, 
  ranking,
  rankingAdministrador,
  victoriasPorMundo,
  victoriasPorNivel,
  puntuacionPromedioGeneral,
  puntuacionPromedioPorMundo,
  puntuacionPromedioNivel,
  duracionPromedioPorMundo,
  dificultadPorMundo,
  jugadoresUnicosPorNivel,
  precisionVSDuracion,
  habilidadJugador
};