const nodemailer = require('nodemailer')

async function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
  } else {
    // Crear cuenta Ethereal para pruebas si no hay SMTP configurado
    const testAccount = await nodemailer.createTestAccount()
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass }
    })
  }
}

async function sendReservationEmail(reservation) {
  const transporter = await createTransport()
  const from = process.env.EMAIL_FROM || 'Vault-Tec <no-reply@vault-tec.example>'
  const to = process.env.EMAIL_TO || 'reservas@vault-tec.example'

  const subject = `Nueva reserva: ${reservation.roomId} - ${reservation.name}`
  const text = [
    `Nueva reserva recibida:`,
    `ID: ${reservation.id}`,
    `Nombre: ${reservation.name}`,
    `Email: ${reservation.email}`,
    `Habitación: ${reservation.roomId}`,
    `Check-in: ${reservation.checkin}`,
    `Check-out: ${reservation.checkout}`,
    `Huéspedes: ${reservation.guests}`,
    `Notas: ${reservation.notes}`,
    `Creado en: ${reservation.createdAt}`
  ].join('\n')

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text
  })

  // Si es ethereal, obtener preview URL
  let previewUrl = null
  try {
    previewUrl = nodemailer.getTestMessageUrl(info) || null
  } catch (e) {
    previewUrl = null
  }
  return { info, previewUrl }
}

module.exports = { sendReservationEmail }