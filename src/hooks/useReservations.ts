import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Reservation } from '@/types'

export function useReservations(date: string) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true)
        const dayStart = new Date(`${date}T00:00:00`).toISOString()
        const dayEnd = new Date(`${date}T23:59:59`).toISOString()

        const { data, error: err } = await supabase
          .from('reservations')
          .select('*')
          .gte('start_time', dayStart)
          .lt('start_time', dayEnd)
          .order('start_time')

        if (err) throw err
        setReservations(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reservations')
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [date])

  return { reservations, loading, error }
}
