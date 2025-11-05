import React from 'react'

export default function Footer(){
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Vault-Tec Hotel — Todos los derechos reservados</div>
      <div style={{marginTop:6}}>Contacto: <a href="mailto:info@vault-tec.example">info@vault-tec.example</a></div>
    </footer>
  )
}