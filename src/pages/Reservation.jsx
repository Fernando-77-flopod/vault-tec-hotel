import React, {useState, useEffect} from 'react'
import ReservationForm from '../components/ReservationForm'
import { useLocation } from 'react-router-dom'
import rooms from '../data/rooms'
import { getUser } from '../lib/auth'

export default function Reservation(){
  const loc = useLocation()
  const [initialRoom, setInitialRoom] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (loc.state && loc.state.roomId) {
      const found = rooms.find(r => r.id === loc.state.roomId)
      setInitialRoom(found || { id: loc.state.roomId })
    }
    setUser(getUser())
  }, [loc.state])

  const handleSaved = (reservation, emailPreviewUrl = null) => {
    setConfirmation(reservation)
    setPreviewUrl(emailPreviewUrl)
  }

  return (
    <div>
      <h2>Reservas</h2>
      {confirmation ? (
        <div className="card" style={{maxWidth:720}}>
          <h3>Reserva creada</h3>
          <p className="small">ID: {confirmation.id}</p>
          <p>Hemos creado la reserva en el sistema. Revisaremos la solicitud y te contactaremos por e-mail.</p>
          {previewUrl && (
            <div style={{marginTop:8}}>
              <a className="button" href={previewUrl} target="_blank" rel="noreferrer">Ver preview de e-mail (Ethereal)</a>
              <div className="small" style={{marginTop:6}}>Si usas Ethereal para pruebas, aquí puedes ver el e-mail enviado.</div>
            </div>
          )}
        </div>
      ) : (
        <ReservationForm initialRoom={initialRoom} onSaved={handleSaved} />
      )}
      <section style={{marginTop:16}}>
        <h4>Reservas guardadas (local)</h4>
        <SavedReservations />
      </section>
    </div>
  )
}

function SavedReservations(){
  const [items, setItems] = React.useState([])

  React.useEffect(() => {
    const key = 'vaulttec_reservations'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    setItems(existing.reverse())
  }, [])

  if (items.length === 0) return <div className="small card">No hay reservas guardadas en este navegador.</div>

  return (
    <div className="grid" style={{marginTop:8}}>
      {items.map(i => (
        <div key={i.id} className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <strong>{i.name}</strong> <div className="small">Habitación: {i.roomId} · {i.checkin} → {i.checkout}</div>
          </div>
          <div className="small">{new Date(i.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}