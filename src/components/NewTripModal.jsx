import { useState } from 'react'
import { createTrip } from '../lib/trips'
import { generateGearList } from '../lib/ai'

export default function NewTripModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [trailName, setTrailName] = useState('')
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')

  // End date is computed from start + days. (days=1 means start === end)
  const endDate = (() => {
    if (!startDate || !duration) return ''
    const days = parseInt(duration, 10)
    if (!days || days < 1) return ''
    const d = new Date(startDate + 'T00:00:00')
    d.setDate(d.getDate() + (days - 1))
    return d.toISOString().slice(0, 10)
  })()
  const [useAI, setUseAI] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [aiStatus, setAiStatus] = useState(null)

  // Build a rich description for the AI from all fields
  function buildAIDescription() {
    const parts = []
    if (location.trim()) parts.push(`Location: ${location.trim()}`)
    if (duration.trim()) parts.push(`Duration: ${duration.trim()} days`)
    if (distance.trim()) parts.push(`Distance: ${distance.trim()} miles`)
    if (description.trim()) parts.push(description.trim())
    return parts.join('. ')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    setError(null)
    setSubmitting(true)

    try {
      setAiStatus(useAI && trailName.trim() ? 'Creating trip...' : null)
      const trip = await createTrip({
        name: name.trim(),
        trailName: trailName.trim(),
        description: buildAIDescription(),
        startDate: startDate || null,
        endDate: endDate || null,
      })

      let aiGear = null
      if (useAI && trailName.trim()) {
        setAiStatus('Generating gear list with AI... this may take a moment')
        try {
          const { gearCategories, gearAdvice, route } = await generateGearList({
            trailName: trailName.trim(),
            description: buildAIDescription(),
            startDate: startDate || null,
            endDate: endDate || null,
          })
          aiGear = gearCategories
          localStorage.setItem(`trip-gear-${trip.id}`, JSON.stringify(gearCategories))
          if (gearAdvice) {
            localStorage.setItem(`trip-gear-advice-${trip.id}`, JSON.stringify(gearAdvice))
          }
          if (route && route.length > 0) {
            localStorage.setItem(`trip-route-${trip.id}`, JSON.stringify(route))
          }
        } catch (aiErr) {
          console.warn('AI gear generation failed, starting blank:', aiErr)
        }
      }

      onCreated(trip, aiGear)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
      setAiStatus(null)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Trip</h2>
          <button className="modal-close" onClick={onClose} disabled={submitting}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field">
            <label htmlFor="trip-name">Trip Name *</label>
            <input
              id="trip-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Timberline Trail August 2026"
              required
              autoFocus
              disabled={submitting}
            />
          </div>

          <div className="form-row">
            <div className="form-field" style={{ flex: 2 }}>
              <label htmlFor="trail-name">Trail / Route</label>
              <input
                id="trail-name"
                type="text"
                value={trailName}
                onChange={e => setTrailName(e.target.value)}
                placeholder="e.g. Timberline Trail"
                disabled={submitting}
              />
            </div>
            <div className="form-field" style={{ flex: 2 }}>
              <label htmlFor="location">Location / State</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Mt. Hood, Oregon"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="duration">Days</label>
              <input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 3"
                disabled={submitting}
              />
            </div>
            <div className="form-field">
              <label htmlFor="distance">Miles</label>
              <input
                id="distance"
                type="number"
                min="0"
                step="0.1"
                value={distance}
                onChange={e => setDistance(e.target.value)}
                placeholder="e.g. 41"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="start-date">Start Date</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              disabled={submitting}
            />
            {endDate && (
              <div style={{
                fontFamily: 'monospace', fontSize: '11px',
                color: '#7a6f66', marginTop: '6px',
              }}>
                End date: <span style={{ color: '#e8e0d8' }}>
                  {new Date(endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span> {' '}
                <span style={{ color: '#5a8fa3' }}>(auto-calculated from {duration} day{duration === '1' ? '' : 's'})</span>
              </div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="description">Additional Details</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Terrain, weather expectations, group size, special conditions..."
              rows={2}
              disabled={submitting}
            />
          </div>

          {/* AI Toggle */}
          <div className="ai-toggle">
            <button
              type="button"
              className={`ai-toggle-option ${useAI ? 'active' : ''}`}
              onClick={() => setUseAI(true)}
              disabled={submitting}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 014 4c0 1.95-1.4 3.58-3.25 3.93" />
                <path d="M8.24 4.47A4 4 0 0112 2" />
                <path d="M12 6v6" />
                <circle cx="12" cy="18" r="4" />
                <path d="M12 22v-2" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
              </svg>
              AI Generate Gear
            </button>
            <button
              type="button"
              className={`ai-toggle-option ${!useAI ? 'active' : ''}`}
              onClick={() => setUseAI(false)}
              disabled={submitting}
            >
              Start Blank
            </button>
          </div>

          {useAI && (
            <p className="ai-hint">
              {trailName.trim()
                ? `AI will generate a gear list tailored to "${trailName.trim()}"${location.trim() ? ` in ${location.trim()}` : ''}${duration ? ` (${duration} days)` : ''} and cross-reference your gear inventory to mark items you already own.`
                : 'Enter a trail name above to enable AI gear generation.'}
            </p>
          )}

          {error && <div className="auth-error">{error}</div>}

          {aiStatus && (
            <div className="ai-status">
              <div className="ai-spinner" />
              {aiStatus}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary modal-submit"
              disabled={submitting || !name.trim()}
            >
              {submitting
                ? 'Creating...'
                : useAI && trailName.trim()
                  ? 'Create & Generate'
                  : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
