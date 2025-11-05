// Utilidades simples para llamar a la API desde el frontend
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function fetchJSON(path, opts = {}) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, opts)
  const text = await res.text()
  try {
    // intenta parsear JSON si hay contenido
    const data = text ? JSON.parse(text) : null
    if (!res.ok) {
      const err = new Error(data?.error || res.statusText || 'Error en la petición')
      err.status = res.status
      err.payload = data
      throw err
    }
    return data
  } catch (e) {
    // si no es JSON, lanzar con el texto crudo
    if (res.ok) return text
    const err = new Error(text || res.statusText || 'Error en la petición')
    err.status = res.status
    throw err
  }
}