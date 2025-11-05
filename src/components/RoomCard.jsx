import React from 'react'

export default function RoomCard({room, onReserve}) {
  return (
    <div className="card">
      <img className="room-image" src={room.image} alt={room.name} />
      <h3 style={{marginTop:10, marginBottom:4}}>{room.name}</h3>
      <div className="small">Capacidad: {room.capacity} · Precio: ${room.price} / noche</div>
      <p style={{marginTop:8, marginBottom:10}}>{room.description}</p>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <button className="button" onClick={() => onReserve(room)}>Reservar</button>
        <div className="small">ID: {room.id}</div>
      </div>
    </div>
  )
}