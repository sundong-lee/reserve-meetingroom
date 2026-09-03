export interface Room {
  id: string
  name: string
  capacity: number
  location: string
  created_at?: string
}

export interface Reservation {
  id: string
  room_id: string
  user: string
  start_time: string
  end_time: string
  created_at?: string
}
