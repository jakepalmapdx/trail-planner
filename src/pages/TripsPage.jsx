import { useState, useEffect } from 'react'
import { fetchTrips, deleteTrip } from '../lib/trips'
import NewTripModal from '../components/NewTripModal'

export default function TripsPage({ onOpenTrip }) {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadTrips()
  }, [])

  async function loadTrips() {
    try {
      const data = await fetchTrips()
      setTrips(data)
    } catch (err) {
      console.error('Failed to load trips:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(e, tripId) {
    e.stopPropagation()
    if (!confirm('Delete this trip? This cannot be undone.')) return

    setDeletingId(tripId)
    try {
      await deleteTrip(tripId)
      setTrips(prev => prev.filter(t => t.id !== tripId))
    } catch (err) {
      console.error('Failed to delete trip:', err)
    } finally {
      setDeletingId(null)
    }
  }

  function handleCreated(newTrip) {
    setTrips(prev => [newTrip, ...prev])
    setShowModal(false)
  }

  function formatDate(dateStr) {
    if (!dateStr) return null
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  function getDaysUntil(dateStr) {
    if (!dateStr) return null
    const start = new Date(dateStr + 'T00:00:00')
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const diff = Math.ceil((start - now) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'past'
    if (diff === 0) return 'today'
    if (diff === 1) return 'tomorrow'
    return `${diff} days`
  }

  return (
    <>
      <main className="trips-main">
        <div className="trips-top">
          <div>
            <h1>Your Trips</h1>
            <p className="trips-count">
              {loading ? 'Loading...' : `${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button className="btn btn-primary btn-new-trip" onClick={() => setShowModal(true)}>
            + New Trip
          </button>
        </div>

        {!loading && trips.length === 0 && (
          <div className="trips-empty">
            <div className="trips-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7l6-4 6 4 6-4v14l-6 4-6-4-6 4z" />
                <path d="M9 3v14" />
                <path d="M15 7v14" />
              </svg>
            </div>
            <h2>No trips yet</h2>
            <p>Create your first backpacking trip to start planning gear, costs, and food.</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Create Your First Trip
            </button>
          </div>
        )}

        {!loading && trips.length > 0 && (
          <div className="trips-grid">
            {trips.map(trip => {
              const countdown = getDaysUntil(trip.start_date)
              return (
                <div
                  key={trip.id}
                  className="trip-card"
                  onClick={() => onOpenTrip(trip)}
                >
                  <div className="trip-card-top">
                    <h3 className="trip-card-name">{trip.name}</h3>
                    <button
                      className="trip-card-delete"
                      onClick={(e) => handleDelete(e, trip.id)}
                      disabled={deletingId === trip.id}
                      title="Delete trip"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      </svg>
                    </button>
                  </div>

                  {trip.trail_name && (
                    <div className="trip-card-trail">{trip.trail_name}</div>
                  )}

                  {trip.description && (
                    <p className="trip-card-desc">{trip.description}</p>
                  )}

                  <div className="trip-card-meta">
                    {trip.start_date && (
                      <span className="trip-card-pill">
                        {formatDate(trip.start_date)}
                        {trip.end_date && ` – ${formatDate(trip.end_date)}`}
                      </span>
                    )}
                    {countdown && countdown !== 'past' && (
                      <span className="trip-card-pill trip-card-countdown">
                        {countdown === 'today' ? 'Today!' : countdown === 'tomorrow' ? 'Tomorrow!' : `In ${countdown}`}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {showModal && (
        <NewTripModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  )
}
