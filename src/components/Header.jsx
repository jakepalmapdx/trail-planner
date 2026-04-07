function Header({ trail, activeTab, setActiveTab }) {
  const tabs = [
    { id: 'gear', label: '📋 Gear', },
    { id: 'cost', label: '💰 Cost' },
    { id: 'food', label: '🍽️ Food' },
  ]

  return (
    <div>
      {/* Top Bar */}
      <div style={{
        background: '#0f0d0c',
        padding: '32px 40px 24px',
        borderBottom: '1px solid #3d3731',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '-80px', right: '-80px',
          width: '350px', height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90,143,163,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Eyebrow */}
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

        {/* Trail Name */}
        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 38px)',
          fontWeight: '700',
          color: '#f5f1ed',
          marginBottom: '10px',
          lineHeight: 1.1,
          letterSpacing: '-0.02em'
        }}>
          {trail?.name}
        </h1>

        {/* Trail Meta Pills */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Location', value: trail?.location },
            { label: 'Distance', value: `${trail?.miles} miles` },
            { label: 'Duration', value: `${trail?.days} days` },
            { label: 'Permit', value: trail?.permit },
          ].map(pill => (
            <div key={pill.label} style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: '#7a6f66',
              background: '#2d2926',
              border: '1px solid #3d3731',
              padding: '4px 10px',
              borderRadius: '2px'
            }}>
              {pill.label}: <span style={{ color: '#e8e0d8' }}>{pill.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        background: '#2d2926',
        borderBottom: '1px solid #3d3731',
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
  )
}

export default Header