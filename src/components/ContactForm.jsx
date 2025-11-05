import React, {useState} from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({name:'', email:'', message:''})

  const handle = (e) => {
    const {name, value} = e.target
    setForm(prev => ({...prev, [name]: value}))
  }

  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Consulta desde web: ${form.name}`)
    const body = encodeURIComponent(`Nombre: ${form.name}\nEmail: ${form.email}\n\nMensaje:\n${form.message}`)
    window.location.href = `mailto:info@vault-tec.example?subject=${subject}&body=${body}`
  }

  return (
    <form onSubmit={submit} className="card" style={{maxWidth:720}}>
      <h3>Contacta con nosotros</h3>
      <div className="field">
        <label>Nombre</label>
        <input name="name" value={form.name} onChange={handle} required />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handle} required />
      </div>
      <div className="field">
        <label>Mensaje</label>
        <textarea name="message" value={form.message} onChange={handle} rows="5" required />
      </div>
      <div style={{display:'flex', gap:8}}>
        <button className="button" type="submit">Enviar por e-mail</button>
        <div className="small">Se abrirá tu cliente de correo con el mensaje pre-llenado.</div>
      </div>
    </form>
  )
}