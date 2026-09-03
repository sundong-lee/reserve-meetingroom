import { useState } from 'react'
import { Room } from '@/types'
import { useRooms } from '@/hooks/useRooms'
import { useReservations } from '@/hooks/useReservations'
import { RoomCard } from '@/components/RoomCard/RoomCard'
import { ReservationModal } from '@/components/ReservationModal/ReservationModal'

export function Home() {
  const { rooms, loading: roomsLoading, error: roomsError } = useRooms()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const { reservations } = useReservations(selectedDate)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const handleReservationSuccess = () => {
    setSelectedRoom(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">회의실 예약</h2>
        <p className="text-gray-600">회의실을 선택하고 예약을 진행하세요.</p>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          예약 날짜
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {roomsError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          오류: {roomsError}
        </div>
      )}

      {roomsLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">불러오는 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onReserve={() => setSelectedRoom(room)}
            />
          ))}
        </div>
      )}

      {selectedRoom && (
        <ReservationModal
          room={selectedRoom}
          date={selectedDate}
          reservations={reservations}
          onClose={() => setSelectedRoom(null)}
          onSuccess={handleReservationSuccess}
        />
      )}
    </div>
  )
}
