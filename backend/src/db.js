const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'vaulttechotel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(async (connection) => {
    console.log('Base de datos conectada correctamente');
    
    // Crear tablas si no existen
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS rooms (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2),
        capacity INT,
        description TEXT,
        image VARCHAR(255)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        details TEXT
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        roomId VARCHAR(50),
        checkin DATE,
        checkout DATE,
        guests INT,
        notes TEXT,
        createdAt DATETIME,
        FOREIGN KEY (roomId) REFERENCES rooms(id)
      )
    `);

    // Verificar si hay datos en las tablas
    const [roomCount] = await connection.execute('SELECT COUNT(*) as cnt FROM rooms');
    if (roomCount[0].cnt === 0) {
      const rooms = require('./seed/rooms');
      for (const room of rooms) {
        await connection.execute(
          'INSERT INTO rooms (id, name, price, capacity, description, image) VALUES (?, ?, ?, ?, ?, ?)',
          [room.id, room.name, room.price, room.capacity, room.description, room.image]
        );
      }
    }

    const [serviceCount] = await connection.execute('SELECT COUNT(*) as cnt FROM services');
    if (serviceCount[0].cnt === 0) {
      const services = require('./seed/services');
      for (const service of services) {
        await connection.execute(
          'INSERT INTO services (id, title, details) VALUES (?, ?, ?)',
          [service.id, service.title, service.details]
        );
      }
    }

    connection.release();
  })
  .catch(err => {
    console.error('Error conectando a la base de datos:', err);
  });

// Funciones del módulo
module.exports = {
  getRooms: async () => {
    const [rows] = await pool.execute('SELECT * FROM rooms ORDER BY name');
    return rows;
  },

  getServices: async () => {
    const [rows] = await pool.execute('SELECT * FROM services ORDER BY title');
    return rows;
  },

  createReservation: async (data) => {
    const id = 'res_' + Date.now();
    const obj = {
      id,
      name: data.name,
      email: data.email,
      roomId: data.roomId,
      checkin: data.checkin,
      checkout: data.checkout,
      guests: data.guests || 1,
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    await pool.execute(
      `INSERT INTO reservations (id, name, email, roomId, checkin, checkout, guests, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [obj.id, obj.name, obj.email, obj.roomId, obj.checkin, obj.checkout, obj.guests, obj.notes, obj.createdAt]
    );

    return obj;
  },

  getReservations: async () => {
    const [rows] = await pool.execute('SELECT * FROM reservations ORDER BY createdAt DESC');
    return rows;
  },

  getReservationById: async (id) => {
    const [rows] = await pool.execute('SELECT * FROM reservations WHERE id = ?', [id]);
    return rows[0];
  }
};