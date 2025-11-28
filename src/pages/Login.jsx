import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../lib/auth'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ email:'', username:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
      } else {
        await register(form.username, form.email, form.password)
      }
      navigate('/', { relative: 'route' })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error en la autenticación')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError(null)
    setForm({ email:'', username:'', password:'' })
  }

  return (
    <div className="auth-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 200px)',
      padding: '20px'
    }}>
      <div className="auth-box" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '10px',
        // Sombra azulada sutil para dar tema
        boxShadow: '0 4px 20px rgba(0, 78, 152, 0.2)',
        border: '1px solid var(--vault-blue)' // Borde azul fino
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: 'var(--vault-blue)', // CAMBIO: Azul Vault-Tec
          fontWeight: 'bold'
        }}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        
        <form onSubmit={submit}>
          {error && (
            <div style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '6px',
              fontSize: '0.9rem',
              border: '1px solid #f87171'
            }}>{error}</div>
          )}

          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--vault-blue)', fontWeight: 'bold' }}>
                Nombre de usuario
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handle}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--vault-blue)', fontWeight: 'bold' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handle}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--vault-blue)', fontWeight: 'bold' }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handle}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* CAMBIO: Usamos la clase btn-primary (Amarillo) */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary" 
            style={{
              width: '100%', // Forzamos ancho completo
              marginBottom: '1rem',
              border: '2px solid var(--vault-yellow)',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Procesando...' : (isLogin ? 'Acceder al Refugio' : 'Registrarse')}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--vault-blue)', // CAMBIO: Azul Vault-Tec
                cursor: 'pointer',
                fontSize: '0.9rem',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? '¿No tienes cuenta? Créala aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </form>

        {isLogin && (
          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
            <div>Usuario demo: admin@vault-tec.example</div>
            <div>Contraseña: password</div>
          </div>
        )}
      </div>
    </div>
  )
}