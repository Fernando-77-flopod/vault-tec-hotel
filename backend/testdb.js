// testdb.js (Corregido para MySQL)

require('dotenv').config();

// 1. Importamos la versión 'promise' de mysql2 para usar async/await
const mysql = require('mysql2/promise');

// 2. El objeto de configuración es diferente para mysql2
// Nota: 'server' se cambia por 'host' y no se usan las 'options' de mssql
const dbConfig = {
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function testConnection() {
  let connection; // Definimos la conexión aquí para poder cerrarla en el finally

  try {
    console.log('Intentando conectar a:', process.env.DB_SERVER);

    // 3. Creamos una conexión (o un pool) de esta forma
    connection = await mysql.createConnection(dbConfig);
    console.log('¡Conexión exitosa!');

    // 4. La sintaxis SQL es diferente para MySQL
    // Usamos 'CREATE TABLE IF NOT EXISTS'
    // Cambiamos 'NVARCHAR' por 'VARCHAR'
    // Ajustamos 'createdAt' para que use CURRENT_TIMESTAMP por defecto
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 5. La forma de ejecutar la consulta también cambia
    await connection.execute(createTableQuery);
    console.log('Tabla users creada/verificada correctamente');

  } catch (err) {
    // Manejo de errores de conexión de MySQL
    if (err.code === 'ECONNREFUSED') {
      console.error('Error: Conexión rechazada. ¿Está el servidor MySQL corriendo?');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Error: Acceso denegado. Revisa tu usuario y contraseña.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('Error: La base de datos no existe:', process.env.DB_NAME);
    } else {
      console.error('Error de conexión:', err);
    }
  } finally {
    // 6. Cerramos la conexión si se logró crear
    if (connection) {
      await connection.end();
      console.log('Conexión cerrada.');
    }
  }
}

testConnection();