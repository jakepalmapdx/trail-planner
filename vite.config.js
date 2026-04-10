import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/generate-gear', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          try {
            // Load .env fresh each time
            const envPath = resolve(process.cwd(), '.env')
            const envContent = readFileSync(envPath, 'utf-8')
            const envVars = {}
            envContent.split('\n').forEach(line => {
              const match = line.match(/^([^=]+)=(.*)$/)
              if (match) envVars[match[1].trim()] = match[2].trim()
            })

            const apiKey = envVars.ANTHROPIC_API_KEY
            if (!apiKey || apiKey === 'your-anthropic-api-key-here') {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured in .env' }))
              return
            }

            const { default: Anthropic } = await import('@anthropic-ai/sdk')
            const client = new Anthropic({ apiKey })

            const parsed = JSON.parse(body)
            const { trailName, description, startDate, endDate, gearInventory } = parsed

            if (!trailName) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Trail name is required' }))
              return
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

            const message = await client.messages.create({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 8000,
              messages: [{ role: 'user', content: prompt }],
            })

            const text = message.content[0].text.trim()

            let aiResponse
            try {
              aiResponse = JSON.parse(text)
            } catch {
              // Try to extract a JSON object from the response
              const objMatch = text.match(/\{[\s\S]*\}/)
              if (objMatch) {
                try {
                  aiResponse = JSON.parse(objMatch[0])
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
                  aiResponse = JSON.parse(fixed)
                }
              } else {
                throw new Error('Failed to parse AI response as JSON')
              }
            }

            const gearCategories = Array.isArray(aiResponse) ? aiResponse : (aiResponse.categories || [])
            const gearAdvice = Array.isArray(aiResponse) ? '' : (aiResponse.advice || '')
            const route = Array.isArray(aiResponse) ? [] : (aiResponse.route || [])

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ gearCategories, gearAdvice, route }))
          } catch (err) {
            console.error('API error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
})
