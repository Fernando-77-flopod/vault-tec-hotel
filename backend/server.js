require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const db = require('./src/db')
const emailer = require('./src/email')
const auth = require('./src/auth')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }
    const result = await auth.authenticate(email, password)
    res.json(result)
  } catch (err) {
    console.error('Error en login:', err)
    res.status(401).json({ error: err.message || 'Credenciales inválidas' })
  }
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }
    const result = await auth.register(name, email, password)
    res.status(201).json(result)
  } catch (err) {
    console.error('Error en registro:', err)
    res.status(400).json({ error: err.message || 'Error al registrar usuario' })
  }
})

// Rutas
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await db.getRooms()
    res.json(rooms)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener habitaciones' })
  }
})

app.get('/api/services', async (req, res) => {
  try {
    const services = await db.getServices()
    res.json(services)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener servicios' })
  }
})

app.post('/api/reservations', async (req, res) => {
  try {
    const { name, email, roomId, checkin, checkout, guests, notes } = req.body
    if (!name || !email || !roomId || !checkin || !checkout) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }
    const reservation = await db.createReservation({
      name, email, roomId, checkin, checkout, guests: guests || 1, notes: notes || ''
    })

    // Enviar email de notificación (intenta enviarlo, pero no falla la API si falla el envío)
    try {
      const info = await emailer.sendReservationEmail(reservation)
      return res.status(201).json({ reservation, emailPreviewUrl: info.previewUrl || null })
    } catch (emailErr) {
      console.error('Error enviando email:', emailErr)
      return res.status(201).json({ reservation, emailError: true })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear reserva' })
  }
})

app.get('/api/reservations', async (req, res) => {
  try {
    const items = await db.getReservations()
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener reservas' })
  }
})

app.get('/api/reservations/:id', async (req, res) => {
  try {
    const item = await db.getReservationById(req.params.id)
    if (!item) return res.status(404).json({ error: 'Reserva no encontrada' })
    res.json(item)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener reserva' })
  }
})

// (Opcional) servir cliente estático si lo deseas (por ejemplo build del frontend)
// app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
  console.log(`Vault-Tec backend escuchando en http://localhost:${PORT}`)
})