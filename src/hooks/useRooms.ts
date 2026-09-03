import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Room } from '@/types'

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from('rooms')
          .select('*')
          .order('name')

        if (err) throw err
        setRooms(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms')
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  return { rooms, loading, error }
}
