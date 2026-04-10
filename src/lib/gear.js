import { supabase } from './supabase'

export async function fetchGearInventory() {
  const { data, error } = await supabase
    .from('gear_inventory')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function addGearItem({ name, category, brand, weightOz, notes }) {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('gear_inventory')
    .insert({
      user_id: user.id,
      name,
      category: category || null,
      brand: brand || null,
      weight_oz: weightOz || null,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGearItem(itemId, updates) {
  const mapped = {}
  if (updates.name !== undefined) mapped.name = updates.name
  if (updates.category !== undefined) mapped.category = updates.category
  if (updates.brand !== undefined) mapped.brand = updates.brand
  if (updates.weightOz !== undefined) mapped.weight_oz = updates.weightOz
  if (updates.notes !== undefined) mapped.notes = updates.notes

  const { data, error } = await supabase
    .from('gear_inventory')
    .update(mapped)
    .eq('id', itemId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGearItem(itemId) {
  const { error } = await supabase
    .from('gear_inventory')
    .delete()
    .eq('id', itemId)

  if (error) throw error
}

export const GEAR_CATEGORIES = [
  'Shelter',
  'Pack & Carry',
  'Clothing',
  'Navigation & Safety',
  'Kitchen & Water',
  'Hygiene',
  'Electronics',
  'Misc.',
]
