drop database if exists StarMaths;
create database StarMaths;

use StarMaths;
drop table if exists Jugador;
create table Jugador(
id_jugador int auto_increment primary key,
nombre_usuario varchar(10) not null,
corre_electronico varchar(30) not null,
contrasenia varchar(32) not null,
monedas int not null default 0,
genero varchar(10) not null,
nombre varchar(20) not null,
apellidos varchar(40) not null,
fecha_nacimiento date not null ,
grado_escolar int not null, 
check (length
(contrasenia) >= 8 and length(contrasenia) <= 32 ),
check (genero = 'masculino' or genero = 'femenino'),
check (grado_escolar >= 1 and grado_escolar <= 6)
);


drop table if exists Configuracion;
create table Configuracion(
id_config int auto_increment primary key,
vol_efectos int not null,
vol_musica int not null,
brillo int not null,
id_jugador int,
foreign key(id_jugador) references Jugador(id_jugador),
check (vol_efectos >= 0 and vol_efectos <= 100),
check (vol_musica >= 0 and vol_musica <= 100),
check (brillo >= 0 and brillo <= 100)
);

drop table if exists Nave;
create table Nave( 
id_nave int auto_increment primary key,
nombre varchar(20) not null,
file_name varchar(100) not null,
precio int not null,
check(precio >= 0)
);

drop table if exists Mundo;
create table Mundo(
id_mundo int auto_increment primary key,
nombre varchar(20) not null
);

drop table if exists Nivel;
create table Nivel(
id_nivel int auto_increment primary key,
nombre varchar(20) not null,
id_mundo int not null,
num_nivel int null null,
foreign key(id_mundo) references Mundo(id_mundo) on delete cascade 
);



drop table if exists Partida;
create table Partida(
id_partida int auto_increment primary key,
puntaje int not null , 
duracion int not null, 
victoria bool not null, 
estrellas int not null, 
precision_juego decimal(5,2) not null,
id_jugador int not null,
id_nivel int not null, 
foreign key (id_jugador) references  Jugador(id_jugador) on delete cascade,
foreign key (id_nivel) references Nivel(id_nivel) on delete cascade,
check (estrellas >= 0 and estrellas <= 3)
);

drop table if exists JugadorNave;
create table JugadorNave(
id_jugador int not null, 
id_nave int not null, 
primary key (id_jugador, id_nave),
foreign key (id_jugador) references  Jugador(id_jugador) on delete cascade,
foreign key (id_nave) references  Nave(id_nave) on delete cascade
);

DELIMITER $$

CREATE TRIGGER noRepetidoNombreUsuarioInsert
BEFORE INSERT ON Jugador
FOR EACH ROW
BEGIN
    DECLARE v_usuario VARCHAR(10);

    SET v_usuario = NULL;

    SELECT nombre_usuario
    INTO v_usuario
    FROM Jugador
    WHERE nombre_usuario = NEW.nombre_usuario
    LIMIT 1;

    IF v_usuario IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No puedo tener nombres de usuario repetidos';
    END IF;
END$$

DELIMITER ;

insert into Jugador (nombre_usuario, corre_electronico, contrasenia, genero, nombre, apellidos,fecha_nacimiento, grado_escolar)
values ("casita","a01753547@tec", "casita12", "femenino", "cassandra", "padillabarovier","2005-06-01",2);









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