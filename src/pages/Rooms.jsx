import React from 'react'
import rooms from '../data/rooms'
import RoomCard from '../components/RoomCard'
import { useNavigate } from 'react-router-dom'

export default function Rooms(){
  const navigate = useNavigate()
  const handleReserve = (room) => {
    // Pre-fill reservation page with room id via state
    navigate('/reservation', { state: { roomId: room.id } })
  }

  return (
    <div>
      <h2>Habitaciones</h2>
      <div className="grid cols-3" style={{marginTop:12}}>
        {rooms.map(r => (
          <RoomCard key={r.id} room={r} onReserve={handleReserve} />
        ))}
      </div>
    </div>
  )
}