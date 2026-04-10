import { useState } from 'react'
import { updateTrip } from '../lib/trips'

// Compute end date from start + days (1 day = same date)
function computeEndDate(startDate, days) {
  if (!startDate || !days) return ''
  const n = parseInt(days, 10)
  if (!n || n < 1) return ''
  const d = new Date(startDate + 'T00:00:00')
  d.setDate(d.getDate() + (n - 1))
  return d.toISOString().slice(0, 10)
}

// Compute days from start + end
function computeDays(startDate, endDate) {
  if (!startDate || !endDate) return ''
  const s = new Date(startDate + 'T00:00:00')
  const e = new Date(endDate + 'T00:00:00')
  const days = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1
  return days > 0 ? String(days) : ''
}

export default function EditTripModal({ trip, onClose, onUpdated }) {
  const [name, setName] = useState(trip.name || '')
  const [trailName, setTrailName] = useState(trip.trail_name || '')
  const [startDate, setStartDate] = useState(trip.start_date || '')
  const [days, setDays] = useState(computeDays(trip.start_date, trip.end_date))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const endDate = computeEndDate(startDate, days)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setError(null)
    setSubmitting(true)
    try {
      const updated = await updateTrip(trip.id, {
        name: name.trim(),
        trail_name: trailName.trim() || null,
        start_date: startDate || null,
        end_date: endDate || null,
      })
      onUpdated(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Trip</h2>
          <button className="modal-close" onClick={onClose} disabled={submitting}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field">
            <label htmlFor="edit-trip-name">Trip Name *</label>
            <input
              id="edit-trip-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
              disabled={submitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-trail-name">Trail / Route</label>
            <input
              id="edit-trail-name"
              type="text"
              value={trailName}
              onChange={e => setTrailName(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="edit-start-date">Start Date</label>
              <input
                id="edit-start-date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="form-field">
              <label htmlFor="edit-days">Days on Trip</label>
              <input
                id="edit-days"
                type="number"
                min="1"
                value={days}
                onChange={e => setDays(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          {endDate && (
            <div style={{
              fontFamily: 'monospace', fontSize: '11px',
              color: '#7a6f66', marginTop: '-6px', marginBottom: '6px',
            }}>
              End date: <span style={{ color: '#e8e0d8' }}>
                {new Date(endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span> {' '}
              <span style={{ color: '#5a8fa3' }}>(auto-calculated)</span>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary modal-submit"
              disabled={submitting || !name.trim()}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
