import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

// Load .env for local dev (Vercel handles this in production)
dotenv.config()

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { trailName, description, startDate, endDate, gearInventory } = req.body

  if (!trailName) {
    return res.status(400).json({ error: 'Trail name is required' })
  }

  // Build context about user's existing gear
  let inventoryContext = ''
  if (gearInventory && gearInventory.length > 0) {
    inventoryContext = `\n\nThe user already owns the following gear:\n${gearInventory.map(g =>
      `- ${g.name}${g.brand ? ` (${g.brand})` : ''}${g.weight_oz ? ` — ${g.weight_oz}oz` : ''}${g.category ? ` [${g.category}]` : ''}`
    ).join('\n')}\n\nFor each item in your recommended list, if the user already owns something that matches or is equivalent, set "owned": true.`
  }

  const dateContext = startDate
    ? `\nTrip dates: ${startDate}${endDate ? ` to ${endDate}` : ''}`
    : ''

  const descContext = description ? `\nAdditional details: ${description}` : ''

  const prompt = `You are an expert backpacking trip planner. Generate a gear checklist SPECIFICALLY tailored to this trail:

Trail: ${trailName}${descContext}${dateContext}

IMPORTANT: Your recommendations must be specific to THIS trail, THIS duration, and THIS terrain. Do NOT give generic backpacking advice. Reference the actual:
- Trail conditions (terrain type, exposure, river crossings)
- Elevation and weather patterns for the specific location and season
- Water source availability on this specific route
- Local regulations (fire bans, bear canisters, permits)
- Known hazards specific to this trail
${inventoryContext}

Return ONLY a valid JSON array (no markdown, no code fences, no explanation). Format:
[{"id":"shelter","icon":"⛺","title":"Shelter & Sleep","items":[{"id":"s1","name":"3-Season Tent","note":"Why this matters for THIS trail...","priority":"critical","checked":false,"owned":false}]}]

Categories: Shelter & Sleep, Pack & Carry, Clothing, Navigation & Safety, Kitchen & Water, Hygiene & Leave No Trace, Misc.
Priorities: "critical", "recommended", "optional"
IDs: s1-s14, p1-p14, c1-c14, n1-n14, k1-k14, h1-h14, m1-m14
Generate 6-10 items per category. Keep notes concise but trail-specific.`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text.trim()

    // Parse the JSON response
    let gearCategories
    try {
      gearCategories = JSON.parse(text)
    } catch {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        try {
          gearCategories = JSON.parse(jsonMatch[0])
        } catch {
          let fixed = jsonMatch[0]
          fixed = fixed.replace(/,\s*\{[^}]*$/, '')
          const openBrackets = (fixed.match(/\[/g) || []).length
          const closeBrackets = (fixed.match(/\]/g) || []).length
          const openBraces = (fixed.match(/\{/g) || []).length
          const closeBraces = (fixed.match(/\}/g) || []).length
          fixed += '}'.repeat(Math.max(0, openBraces - closeBraces))
          fixed += ']'.repeat(Math.max(0, openBrackets - closeBrackets))
          gearCategories = JSON.parse(fixed)
        }
      } else {
        throw new Error('Failed to parse AI response as JSON')
      }
    }

    return res.status(200).json({ gearCategories })
  } catch (err) {
    console.error('AI generation error:', err)
    return res.status(500).json({ error: err.message || 'Failed to generate gear list' })
  }
}
