import { useState } from 'react'
import { Room, Reservation } from '@/types'
import { generateTimeSlots, isReservationInSlot } from '@/lib/timeSlots'
import { createReservation } from '@/hooks/useCreateReservation'

interface ReservationModalProps {
  room: Room
  date: string
  reservations: Reservation[]
  onClose: () => void
  onSuccess: () => void
}

export function ReservationModal({ room, date, reservations, onClose, onSuccess }: ReservationModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const timeSlots = generateTimeSlots()

  const isSlotAvailable = (slot: string) => {
    return !reservations.some(res => isReservationInSlot(res.start_time, res.end_time, slot, date) && res.room_id === room.id)
  }

  const handleSubmit = async () => {
    if (!selectedSlot || !userName.trim()) {
      setError('시간과 이름을 모두 입력해주세요')
      return
    }

    setLoading(true)
    setError(null)
    const result = await createReservation({
      roomId: room.id,
      user: userName,
      date,
      slotTime: selectedSlot,
    })

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } else {
      setError(result.error || '예약 생성 실패')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-sm text-center">
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">예약되었습니다!</h3>
          <p className="text-gray-600 text-sm">{room.name} • {selectedSlot}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{room.name} 예약</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시간 선택 ({date})
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(slot => {
                const available = isSlotAvailable(slot)
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    disabled={!available || loading}
                    className={`p-2 rounded text-sm font-medium transition ${
                      available
                        ? selectedSlot === slot
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="예약자 이름"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedSlot || !userName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-300"
            >
              {loading ? '처리 중...' : '예약하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
