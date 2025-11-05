import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getUser, clearAuth } from '../lib/auth'

export default function Header(){
  const loc = useLocation()
  const navigate = useNavigate()
  const user = getUser()

  const doLogout = () => {
    clearAuth()
    navigate('/', { relative: 'route' })
  }

  return (
    <header className="header">
      <div className="container nav" style={{justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center'}}>
          <div className="brand">Vault-Tec Hotel</div>
          <nav style={{display:'flex', gap:8}}>
            <Link to="/" className={loc.pathname==='/' ? 'active' : ''}>Inicio</Link>
            <Link to="/rooms">Habitaciones</Link>
            <Link to="/services">Servicios</Link>
            <Link to="/reservation">Reservar</Link>
            <Link to="/contact">Contacto</Link>
          </nav>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          {user ? (
            <>
              <div style={{fontSize:14, opacity:0.95}}>Hola, {user.name || user.email}</div>
              <button className="button" onClick={doLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="button" style={{background:'#fff', color:'#0b4f6c'}}>Iniciar sesión</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}