import { Room } from '@/types'

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-gray-800 mb-3">{room.name}</h3>
      <div className="space-y-2 text-gray-600">
        <p className="flex items-center gap-2">
          <span className="text-sm font-medium">수용 인원:</span>
          <span>{room.capacity}명</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-sm font-medium">위치:</span>
          <span>{room.location}</span>
        </p>
      </div>
      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium">
        예약하기
      </button>
    </div>
  )
}
