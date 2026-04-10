import { supabase } from './supabase'

export async function fetchTrips() {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createTrip({ name, trailName, description, startDate, endDate }) {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: user.id,
      name,
      trail_name: trailName || null,
      description: description || null,
      start_date: startDate || null,
      end_date: endDate || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTrip(tripId) {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId)

  if (error) throw error
}

export async function updateTrip(tripId, updates) {
  const { data, error } = await supabase
    .from('trips')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', tripId)
    .select()
    .single()

  if (error) throw error
  return data
}
