import { fetchGearInventory } from './gear'

export async function generateGearList({ trailName, description, startDate, endDate }) {
  // Fetch user's gear inventory to cross-reference
  let gearInventory = []
  try {
    gearInventory = await fetchGearInventory()
  } catch (err) {
    console.warn('Could not fetch gear inventory for cross-reference:', err)
  }

  const res = await fetch('/api/generate-gear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      trailName,
      description,
      startDate,
      endDate,
      gearInventory,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `API error: ${res.status}`)
  }

  const { gearCategories } = await res.json()
  return gearCategories
}
