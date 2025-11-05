import React from 'react'

export default function ServiceCard({service}) {
  return (
    <div className="card">
      <h4>{service.title}</h4>
      <p className="small" style={{marginTop:6}}>{service.details}</p>
    </div>
  )
}