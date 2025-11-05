import React from 'react'
import ContactForm from '../components/ContactForm'

export default function Contact(){
  return (
    <div>
      <h2>Contacto</h2>
      <p className="small">Si tienes dudas o quieres solicitar información adicional, escríbenos.</p>
      <ContactForm />
      <section style={{marginTop:12}}>
        <div className="card small">
          <strong>Correo:</strong> reservas@vault-tec.example<br/>
          <strong>Teléfono:</strong> +1 (555) 000-VAUL
        </div>
      </section>
    </div>
  )
}