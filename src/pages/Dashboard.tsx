import { useState } from 'react'
import { useRooms } from '@/hooks/useRooms'
import { useReservations } from '@/hooks/useReservations'
import { generateTimeSlots, isReservationInSlot } from '@/lib/timeSlots'

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const { rooms, loading: roomsLoading } = useRooms()
  const { reservations, loading: reservationsLoading } = useReservations(selectedDate)

  const timeSlots = generateTimeSlots()
  const loading = roomsLoading || reservationsLoading

  const getReservationForSlot = (roomId: string, slotTime: string) => {
    return reservations.find(
      res =>
        res.room_id === roomId &&
        isReservationInSlot(res.start_time, res.end_time, slotTime, selectedDate)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">대시보드</h2>
        <p className="text-gray-600">시간별 회의실 현황을 확인하세요.</p>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          조회 날짜
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">불러오는 중...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-800 w-20">
                  시간
                </th>
                {rooms.map(room => (
                  <th
                    key={room.id}
                    className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-800 min-w-32"
                  >
                    {room.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(slot => (
                <tr key={slot} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 font-medium text-gray-700 bg-gray-50">
                    {slot}
                  </td>
                  {rooms.map(room => {
                    const reservation = getReservationForSlot(room.id, slot)
                    return (
                      <td
                        key={`${room.id}-${slot}`}
                        className="border border-gray-300 px-3 py-2 text-center"
                      >
                        {reservation ? (
                          <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                            <span>▣</span>
                            <span>{reservation.user}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">▢</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p>▢ = 예약 가능 | ▣ = 예약됨</p>
      </div>
    </div>
  )
}
