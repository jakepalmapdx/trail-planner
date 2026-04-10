import { useState, useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

// Build empty route legs based on trip duration. One leg per hiking day.
function buildEmptyRoute(startDate, endDate) {
  if (!startDate) return []
  const start = new Date(startDate + 'T00:00:00')
  const end = endDate ? new Date(endDate + 'T00:00:00') : start
  const msPerDay = 1000 * 60 * 60 * 24
  const dayCount = Math.max(1, Math.round((end - start) / msPerDay) + 1)

  return Array.from({ length: dayCount }, (_, i) => ({
    day: i + 1,
    from: '',
    to: '',
    miles: 0,
    camp: '',
    notes: '',
  }))
}

function LegRow({ leg, onUpdate, onDelete, isLast }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(leg)

  function save() {
    onUpdate({ ...draft, miles: parseFloat(draft.miles) || 0 })
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{
        background: '#2d2926',
        border: '1px solid #5a8fa3',
        borderRadius: '4px',
        padding: '14px 16px',
        marginBottom: '12px',
      }}>
        <div style={{
          fontFamily: 'monospace', fontSize: '10px',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#5a8fa3', marginBottom: '10px',
        }}>
          Day {leg.day}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <input
            value={draft.from}
            onChange={e => setDraft({ ...draft, from: e.target.value })}
            placeholder="From (e.g. Trailhead)"
            style={inputStyle}
          />
          <input
            value={draft.to}
            onChange={e => setDraft({ ...draft, to: e.target.value })}
            placeholder="To (e.g. Camp 1)"
            style={inputStyle}
          />
          <input
            type="number"
            value={draft.miles}
            onChange={e => setDraft({ ...draft, miles: e.target.value })}
            placeholder="Miles"
            step="0.1"
            min="0"
            style={{ ...inputStyle, maxWidth: '90px' }}
          />
        </div>
        <input
          value={draft.camp}
          onChange={e => setDraft({ ...draft, camp: e.target.value })}
          placeholder="Overnight camp / stopping point"
          style={{ ...inputStyle, width: '100%', marginBottom: '8px' }}
        />
        <textarea
          value={draft.notes}
          onChange={e => setDraft({ ...draft, notes: e.target.value })}
          placeholder="Notes — water sources, landmarks, hazards..."
          rows={2}
          style={{
            ...inputStyle,
            width: '100%',
            resize: 'vertical',
            fontFamily: 'inherit',
            marginBottom: '10px',
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={save} className="btn btn-primary" style={{ fontSize: '11px' }}>
            Save
          </button>
          <button onClick={() => { setDraft(leg); setEditing(false) }} className="btn btn-ghost" style={{ fontSize: '11px' }}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  const hasContent = leg.from || leg.to || leg.camp || leg.notes || leg.miles > 0

  return (
    <div
      onClick={() => setEditing(true)}
      style={{
        background: '#2d2926',
        border: '1px solid #3d3731',
        borderRadius: '4px',
        padding: '14px 16px',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#5a8fa3'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#3d3731'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: hasContent ? '10px' : 0 }}>
        <div style={{
          fontFamily: 'monospace', fontSize: '10px',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#c9a84c',
        }}>
          Day {leg.day}
        </div>
        {leg.miles > 0 && (
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#7a6f66' }}>
            {leg.miles} mi
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: '#7a6f66', cursor: 'pointer', fontSize: '13px',
            opacity: 0.4, transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.4}
          title="Delete leg"
        >✕</button>
      </div>
      {hasContent ? (
        <>
          {(leg.from || leg.to) && (
            <div style={{ fontSize: '14px', color: '#f5f1ed', marginBottom: '6px' }}>
              {leg.from || '?'} <span style={{ color: '#7a6f66' }}>→</span> {leg.to || '?'}
            </div>
          )}
          {leg.camp && (
            <div style={{ fontSize: '12px', color: '#5a8fa3', marginBottom: '4px' }}>
              ⛺ {leg.camp}
            </div>
          )}
          {leg.notes && (
            <div style={{ fontSize: '12px', color: '#b8afa8', lineHeight: 1.5 }}>
              {leg.notes}
            </div>
          )}
        </>
      ) : (
        <div style={{ fontSize: '12px', color: '#7a6f66', fontStyle: 'italic' }}>
          Tap to add details for this day
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  background: '#1a1714',
  border: '1px solid #3d3731',
  borderRadius: '3px',
  color: '#e8e0d8',
  padding: '7px 10px',
  fontSize: '12px',
  outline: 'none',
  flex: 1,
  minWidth: '120px',
}

export default function RoutePlanner({ tripId, startDate, endDate }) {
  const [route, setRoute] = useLocalStorage(`trip-route-${tripId}`, [])

  // Scaffold legs from trip dates. If empty, build from scratch.
  // If trip duration was extended after the fact, append new empty legs.
  useEffect(() => {
    if (!startDate) return
    const desired = buildEmptyRoute(startDate, endDate)
    if (desired.length === 0) return
    if (route.length === 0) {
      setRoute(desired)
    } else if (desired.length > route.length) {
      const extra = desired.slice(route.length)
      setRoute(prev => [...prev, ...extra])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  function updateLeg(idx, updated) {
    setRoute(prev => prev.map((l, i) => i === idx ? updated : l))
  }

  function deleteLeg(idx) {
    if (!confirm('Remove this day from the route?')) return
    setRoute(prev => prev.filter((_, i) => i !== idx).map((l, i) => ({ ...l, day: i + 1 })))
  }

  function addLeg() {
    setRoute(prev => [...prev, {
      day: prev.length + 1,
      from: '', to: '', miles: 0, camp: '', notes: '',
    }])
  }

  const totalMiles = route.reduce((sum, l) => sum + (parseFloat(l.miles) || 0), 0)

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 24px 80px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline',
        justifyContent: 'space-between', flexWrap: 'wrap',
        gap: '12px', marginBottom: '20px',
      }}>
        <div>
          <div style={{
            fontSize: '18px', fontWeight: '700',
            color: '#f5f1ed', letterSpacing: '-0.02em',
          }}>
            Route & Stopping Points
          </div>
          <div style={{ fontSize: '13px', color: '#7a6f66', marginTop: '4px' }}>
            {route.length} day{route.length === 1 ? '' : 's'} · {totalMiles.toFixed(1)} miles total
          </div>
        </div>
      </div>

      {route.length === 0 ? (
        <div style={{
          background: '#2d2926',
          border: '1px dashed #3d3731',
          borderRadius: '4px',
          padding: '40px 20px',
          textAlign: 'center',
          color: '#7a6f66',
          fontSize: '13px',
        }}>
          Set a start date and number of days on the trip to scaffold a route, or add legs manually.
        </div>
      ) : (
        route.map((leg, idx) => (
          <LegRow
            key={idx}
            leg={leg}
            onUpdate={(updated) => updateLeg(idx, updated)}
            onDelete={() => deleteLeg(idx)}
            isLast={idx === route.length - 1}
          />
        ))
      )}

      <button
        onClick={addLeg}
        style={{
          width: '100%',
          background: 'none',
          border: '1px solid #3d3731',
          borderRadius: '3px',
          color: '#6b8c5a',
          padding: '10px',
          fontSize: '11px',
          fontFamily: 'monospace',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.15s',
          marginTop: '8px',
        }}
        onMouseEnter={e => {
          e.target.style.borderColor = '#6b8c5a'
          e.target.style.background = 'rgba(107,140,90,0.08)'
        }}
        onMouseLeave={e => {
          e.target.style.borderColor = '#3d3731'
          e.target.style.background = 'none'
        }}
      >
        + Add Day
      </button>
    </div>
  )
}
