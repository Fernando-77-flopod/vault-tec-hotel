import React, {useState, useEffect} from 'react'
import { API_BASE, fetchJSON } from '../lib/api'
import { getToken, getUser } from '../lib/auth'

export default function ReservationForm({initialRoom, onSaved}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    roomId: initialRoom?.id || '',
    checkin: '',
    checkout: '',
    guests: 1,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Si la página pasó initialRoom después del montaje, actualizar el campo
    if (initialRoom && initialRoom.id) {
      setForm(prev => ({ ...prev, roomId: initialRoom.id }))
    }
    const u = getUser()
    setUser(u)
    if (u) setForm(prev => ({ ...prev, name: u.name || '', email: u.email || '' }))
  }, [initialRoom])

  const handle = (e) => {
    const {name, value} = e.target
    setForm(prev => ({...prev, [name]: value}))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!getToken()) {
      setError('Debes iniciar sesión antes de crear una reserva. Ve a "Iniciar sesión".')
      return
    }
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        roomId: form.roomId,
        checkin: form.checkin,
        checkout: form.checkout,
        guests: Number(form.guests) || 1,
        notes: form.notes || ''
      }
      const data = await fetchJSON('/api/reservations', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}`},
        body: JSON.stringify(payload)
      })
      // data: { reservation, emailPreviewUrl? } o similar
      if (onSaved) onSaved(data.reservation, data.emailPreviewUrl || null)
    } catch (err) {
      console.error('Error creando reserva:', err)
      setError(err.message || 'Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="card" style={{maxWidth:720}}>
      <h3>Formulario de Reserva</h3>
      {error && <div className="small" style={{background:'#f8d7da', color:'#842029', padding:8, borderRadius:6}}>{error}</div>}
      <div className="field">
        <label>Nombre</label>
        <input name="name" value={form.name} onChange={handle} required />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handle} required />
      </div>
      <div className="field">
        <label>Habitación (ID)</label>
        <input name="roomId" value={form.roomId} onChange={handle} required />
        <div className="small">Puedes seleccionar la ID desde la página de habitaciones.</div>
      </div>
      <div style={{display:'flex', gap:12}}>
        <div style={{flex:1}} className="field">
          <label>Check-in</label>
          <input type="date" name="checkin" value={form.checkin} onChange={handle} required />
        </div>
        <div style={{flex:1}} className="field">
          <label>Check-out</label>
          <input type="date" name="checkout" value={form.checkout} onChange={handle} required />
        </div>
      </div>
      <div className="field">
        <label>Huéspedes</label>
        <input type="number" name="guests" min="1" value={form.guests} onChange={handle} />
      </div>
      <div className="field">
        <label>Notas / Peticiones</label>
        <textarea name="notes" value={form.notes} onChange={handle} rows="3" />
      </div>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Confirmar reserva'}
        </button>
        <div className="small">La reserva se envía al servidor y recibirás confirmación por e-mail.</div>
      </div>
      <div style={{marginTop:8, fontSize:13, color:'#6c757d'}}>
        API: {API_BASE}
      </div>
    </form>
  )
}