export function generateTimeSlots(): string[] {
  const slots: string[] = []

  for (let hour = 9; hour < 18; hour++) {
    for (let minute of [0, 30]) {
      const h = String(hour).padStart(2, '0')
      const m = String(minute).padStart(2, '0')
      slots.push(`${h}:${m}`)
    }
  }

  return slots
}

export function parseDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`)
}

export function isReservationInSlot(
  reservationStart: string,
  reservationEnd: string,
  slotTime: string,
  date: string
): boolean {
  const resStart = new Date(reservationStart).getTime()
  const resEnd = new Date(reservationEnd).getTime()
  const slotStart = parseDateTime(date, slotTime).getTime()
  const slotEnd = slotStart + 30 * 60 * 1000 // 30분 후

  // 예약이 슬롯과 겹치는가?
  return resStart < slotEnd && resEnd > slotStart
}
