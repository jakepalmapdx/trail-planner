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
    ).join('\n')}\n\nFor each item in your recommended list, if the user already owns something that matches or is equivalent, set "owned": true AND set "fromInventory": true AND set "productName" to the exact owned product name (e.g. "REI Half Dome 2"). If the user does not own a match, leave fromInventory false and you may suggest a productName recommendation if you have a strong one, otherwise omit it.`
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

Return ONLY a valid JSON object (no markdown, no code fences, no explanation) with this exact shape:
{"advice":"2-4 sentence review of whether the user's owned gear is suitable for THIS trip. Call out specific items they should consider upgrading, swapping, or even downgrading and why. If they have no inventory, say so briefly.","route":[{"day":1,"from":"Trailhead","to":"Camp 1","miles":7.5,"camp":"Specific named campsite or zone","notes":"Water sources, key landmarks, hazards on this segment"}],"categories":[{"id":"shelter","icon":"⛺","title":"Shelter & Sleep","items":[{"id":"s1","name":"3-Season Tent","productName":"","fromInventory":false,"note":"Why this matters for THIS trail...","priority":"critical","checked":false,"owned":false}]}]}

The "route" array MUST have exactly one entry per hiking day for this trip. Use real, named landmarks and campsites where possible. If you don't know a specific named site, describe the area (e.g. "alpine bench above Green Lakes").

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

    // Parse the JSON response — expects { advice, categories }
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      // Try to extract a JSON object from the response
      const objMatch = text.match(/\{[\s\S]*\}/)
      if (objMatch) {
        try {
          parsed = JSON.parse(objMatch[0])
        } catch {
          // Try to fix truncated JSON by closing open structures
          let fixed = objMatch[0]
          fixed = fixed.replace(/,\s*\{[^}]*$/, '')
          const openBrackets = (fixed.match(/\[/g) || []).length
          const closeBrackets = (fixed.match(/\]/g) || []).length
          const openBraces = (fixed.match(/\{/g) || []).length
          const closeBraces = (fixed.match(/\}/g) || []).length
          fixed += ']'.repeat(Math.max(0, openBrackets - closeBrackets))
          fixed += '}'.repeat(Math.max(0, openBraces - closeBraces))
          parsed = JSON.parse(fixed)
        }
      } else {
        throw new Error('Failed to parse AI response as JSON')
      }
    }

    const gearCategories = Array.isArray(parsed) ? parsed : (parsed.categories || [])
    const gearAdvice = Array.isArray(parsed) ? '' : (parsed.advice || '')
    const route = Array.isArray(parsed) ? [] : (parsed.route || [])

    return res.status(200).json({ gearCategories, gearAdvice, route })
  } catch (err) {
    console.error('AI generation error:', err)
    return res.status(500).json({ error: err.message || 'Failed to generate gear list' })
  }
}
