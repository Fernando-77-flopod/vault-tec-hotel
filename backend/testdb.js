require('dotenv').config()
const sql = require('mssql')

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
}

async function testConnection() {
  try {
    console.log('Intentando conectar a:', process.env.DB_SERVER)
    const pool = await sql.connect(config)
    console.log('Conexión exitosa!')
    
    // Intentar crear la tabla users si no existe
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
      CREATE TABLE users (
        id VARCHAR(50) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        createdAt DATETIME
      )
    `)
    console.log('Tabla users creada/verificada correctamente')
    
    await pool.close()
  } catch (err) {
    console.error('Error de conexión:', err)
  }
}

testConnection()