import { supabase } from '@/lib/supabase'
import { parseDateTime } from '@/lib/timeSlots'

interface CreateReservationParams {
  roomId: string
  user: string
  date: string
  slotTime: string
}

export async function createReservation(params: CreateReservationParams) {
  try {
    const { roomId, user, date, slotTime } = params
    const startTime = parseDateTime(date, slotTime).toISOString()
    const endTime = new Date(parseDateTime(date, slotTime).getTime() + 30 * 60 * 1000).toISOString()

    const { error } = await supabase.from('reservations').insert({
      room_id: roomId,
      user,
      start_time: startTime,
      end_time: endTime,
    })

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: '이미 예약된 시간입니다' }
      }
      return { success: false, error: error.message || '예약 생성 실패' }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : '알 수 없는 오류' }
  }
}
