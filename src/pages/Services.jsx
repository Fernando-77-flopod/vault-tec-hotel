import React from 'react'
import services from '../data/services'
import ServiceCard from '../components/ServiceCard'

export default function Services(){
  return (
    <div>
      <h2>Servicios</h2>
      <div className="grid cols-3" style={{marginTop:12}}>
        {services.map(s => <ServiceCard key={s.id} service={s} />)}
      </div>
    </div>
  )
}