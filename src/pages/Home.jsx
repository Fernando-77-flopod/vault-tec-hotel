import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div>
      <section className="card" style={{marginBottom:16}}>
        <h1>Bienvenido a Vault-Tec Hotel</h1>
        <p className="small">Un refugio seguro y cómodo con servicios premium. Explora nuestras habitaciones y servicios, y realiza tu reserva en línea.</p>
        <div style={{marginTop:10}}>
          <Link className="button" to="/rooms">Ver Habitaciones</Link>
          <Link className="button" to="/reservation" style={{marginLeft:8, background:'#2a9d8f'}}>Reservar ahora</Link>
        </div>
      </section>

      <section>
        <h2>¿Por qué elegir Vault-Tec?</h2>
        <div className="grid cols-3" style={{marginTop:10}}>
          <div className="card">
            <h4>Seguridad</h4>
            <p className="small">Instalaciones con altos estándares de seguridad y privacidad.</p>
          </div>
          <div className="card">
            <h4>Ubicación</h4>
            <p className="small">Cercano a puntos de interés y transporte.</p>
          </div>
          <div className="card">
            <h4>Comodidad</h4>
            <p className="small">Habitaciones modernas y servicio atento.</p>
          </div>
        </div>
      </section>
    </div>
  )
}