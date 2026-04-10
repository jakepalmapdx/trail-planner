import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import GearList from '../components/GearList'
import CostCalculator from '../components/CostCalculator'
import FoodPlanner from '../components/FoodPlanner'

const EMPTY_GEAR = []

export default function TripView({ trip, onBack, user, onSignOut }) {
  const [activeTab, setActiveTab] = useState('gear')

  // Per-trip localStorage keys — starts empty unless AI pre-populated it
  const [gearData, setGearData] = useLocalStorage(
    `trip-gear-${trip.id}`,
    EMPTY_GEAR
  )

  const tabs = [
    { id: 'gear', label: 'Gear' },
    { id: 'cost', label: 'Cost' },
    { id: 'food', label: 'Food' },
  ]

  return (
    <div className="app">
      {/* Trip Header */}
      <div style={{
        background: '#0f0d0c',
        borderBottom: '1px solid #3d3731',
      }}>
        {/* Top bar with back + sign out */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 24px',
          borderBottom: '1px solid rgba(61,55,49,0.5)',
        }}>
          <button
            onClick={onBack}
            className="btn btn-ghost"
            style={{ gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            All Trips
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#7a6f66' }}>{user?.email}</span>
            <button onClick={onSignOut} className="btn btn-ghost">Sign Out</button>
          </div>
        </div>

        {/* Trip info */}
        <div style={{ padding: '24px 24px 20px', position: 'relative', overflow: 'hidden' }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute',
            top: '-80px', right: '-80px',
            width: '350px', height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(90,143,163,0.08) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#5a8fa3',
            marginBottom: '10px'
          }}>
            Trail Planner
          </div>

          <h1 style={{
            fontSize: 'clamp(22px, 4vw, 38px)',
            fontWeight: '700',
            color: '#f5f1ed',
            marginBottom: '10px',
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}>
            {trip.name}
          </h1>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {trip.trail_name && (
              <div style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: '#7a6f66',
                background: '#2d2926',
                border: '1px solid #3d3731',
                padding: '4px 10px',
                borderRadius: '2px'
              }}>
                Trail: <span style={{ color: '#e8e0d8' }}>{trip.trail_name}</span>
              </div>
            )}
            {trip.start_date && (
              <div style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: '#7a6f66',
                background: '#2d2926',
                border: '1px solid #3d3731',
                padding: '4px 10px',
                borderRadius: '2px'
              }}>
                Start: <span style={{ color: '#e8e0d8' }}>
                  {new Date(trip.start_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}
            {trip.end_date && (
              <div style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: '#7a6f66',
                background: '#2d2926',
                border: '1px solid #3d3731',
                padding: '4px 10px',
                borderRadius: '2px'
              }}>
                End: <span style={{ color: '#e8e0d8' }}>
                  {new Date(trip.end_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          background: '#2d2926',
          borderTop: '1px solid #3d3731',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          overflowX: 'auto'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontFamily: 'monospace',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '14px 24px',
                border: 'none',
                borderBottom: activeTab === tab.id
                  ? '2px solid #5a8fa3'
                  : '2px solid transparent',
                background: 'none',
                color: activeTab === tab.id ? '#5a8fa3' : '#7a6f66',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'gear' && (
        <GearList
          categories={gearData}
          setCategories={setGearData}
        />
      )}
      {activeTab === 'cost' && (
        <CostCalculator tripId={trip.id} />
      )}
      {activeTab === 'food' && (
        <FoodPlanner tripId={trip.id} />
      )}
    </div>
  )
}
