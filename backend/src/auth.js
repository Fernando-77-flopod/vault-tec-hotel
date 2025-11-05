const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('./db')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'
const SALT_ROUNDS = 10

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

async function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}

async function authenticate(email, password) {
  const user = await db.getUserByEmail(email)
  if (!user) {
    throw new Error('Usuario no encontrado')
  }
  
  const valid = await comparePassword(password, user.password)
  if (!valid) {
    throw new Error('Contraseña incorrecta')
  }
  
  const token = generateToken(user)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}

async function register(name, email, password) {
  const exists = await db.getUserByEmail(email)
  if (exists) {
    throw new Error('El email ya está registrado')
  }

  const hashedPassword = await hashPassword(password)
  const user = await db.createUser({
    name,
    email,
    password: hashedPassword
  })

  const token = generateToken(user)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}

// Middleware para proteger rutas
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Token no válido' })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }

  req.user = payload
  next()
}

module.exports = {
  authenticate,
  register,
  requireAuth
}