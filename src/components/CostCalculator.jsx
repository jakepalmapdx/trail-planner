import { useState, useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

// Map a gear category id (from AI/gear list) to a cost section id.
// Falls back to 'misc' if no match.
function mapGearCategoryToCostSection(gearCategoryId) {
  const id = (gearCategoryId || '').toLowerCase()
  if (id.includes('shelter') || id.includes('sleep')) return 'shelter'
  if (id.includes('pack') || id.includes('carry') || id.includes('foot')) return 'pack'
  if (id.includes('cloth')) return 'clothing'
  if (id.includes('nav') || id.includes('safe')) return 'safety'
  if (id.includes('kitchen') || id.includes('water') || id.includes('cook')) return 'kitchen'
  if (id.includes('hyg') || id.includes('lnt') || id.includes('leave')) return 'hygiene'
  return 'misc'
}

const DEFAULT_COSTS = [
  {
    id: 'travel',
    icon: '🚗',
    title: 'Travel & Trip Fees',
    items: [
      { id: 't1', name: 'Overnight Permit Fee', note: '$6/group on Recreation.gov', cost: 6, owned: false },
      { id: 't2', name: 'Trailhead Parking', note: '$5/day × 5 days = $25', cost: 25, owned: false },
      { id: 't3', name: 'NW Forest Pass (annual)', note: 'Covers parking if buying anyway', cost: 35, owned: false },
      { id: 't4', name: 'Accommodation (night before)', note: 'Devils Lake CG $20 or hotel in Bend', cost: 0, owned: false },
      { id: 't5', name: 'Post-trip meal / celebration', note: '10 Barrel or Deschutes in Bend', cost: 60, owned: false },
    ]
  },
  {
    id: 'shelter',
    icon: '⛺',
    title: 'Shelter & Sleep',
    items: [
      { id: 'sh1', name: '3-Season Tent', note: 'REI Half Dome ~$250, Big Agnes ~$400', cost: 0, owned: false },
      { id: 'sh2', name: 'Tent Footprint', note: 'Brand-specific ~$50–80 or Tyvek DIY ~$10', cost: 0, owned: false },
      { id: 'sh3', name: 'Sleeping Bag (20°F rated)', note: 'Kelty ~$100, Marmot ~$200, WM $500+', cost: 0, owned: false },
      { id: 'sh4', name: 'Sleeping Pad (insulated)', note: 'Thermarest Z-Lite ~$55, NeoAir XLite ~$200', cost: 0, owned: false },
    ]
  },
  {
    id: 'pack',
    icon: '🎒',
    title: 'Pack, Footwear & Carry',
    items: [
      { id: 'pk1', name: 'Backpack (50–65L)', note: 'Osprey Atmos ~$250, REI Flash ~$180', cost: 0, owned: false },
      { id: 'pk2', name: 'Trekking Poles', note: 'Black Diamond Trail ~$70, Distance ~$180', cost: 0, owned: false },
      { id: 'pk3', name: 'Trail Runners / Boots', note: 'Altra Lone Peak ~$140, Salomon ~$140', cost: 0, owned: false },
      { id: 'pk4', name: 'Gaiters (Dirty Girl)', note: 'Dirty Girl ~$20–30. Do not skip these.', cost: 0, owned: false },
      { id: 'pk5', name: 'Merino Wool Socks (3 pairs)', note: 'Darn Tough ~$25/pair = ~$75 total', cost: 0, owned: false },
      { id: 'pk6', name: 'Pack Rain Cover + Dry Bag Liner', note: '~$20–40 combined', cost: 0, owned: false },
    ]
  },
  {
    id: 'clothing',
    icon: '🧥',
    title: 'Clothing',
    items: [
      { id: 'cl1', name: 'Merino Base Layers (2×)', note: 'Smartwool or Icebreaker ~$70–100 each', cost: 0, owned: false },
      { id: 'cl2', name: 'Sun Hoody (UPF 50+)', note: 'Patagonia Capilene ~$65, Columbia ~$40', cost: 0, owned: false },
      { id: 'cl3', name: 'Puffy Jacket (600+ fill)', note: 'Patagonia Down Sweater ~$230, REI 650 ~$140', cost: 0, owned: false },
      { id: 'cl4', name: 'Hardshell Rain Jacket', note: 'Arc\'teryx ~$500, REI Co-op Rainier ~$200', cost: 0, owned: false },
      { id: 'cl5', name: 'Hiking Pants / Convertible', note: 'REI Co-op Sahara ~$70, Kuhl ~$90', cost: 0, owned: false },
      { id: 'cl6', name: 'Sun Hat, Beanie, Buff', note: '~$15–40 combined', cost: 0, owned: false },
    ]
  },
  {
    id: 'safety',
    icon: '⛑️',
    title: 'Navigation & Safety',
    items: [
      { id: 'sf1', name: 'Paper Topo Map', note: 'Nat Geo #821 ~$15 at REI', cost: 15, owned: false },
      { id: 'sf2', name: 'Satellite Communicator', note: 'Garmin inReach Mini ~$350 or REI rental ~$75', cost: 0, owned: false },
      { id: 'sf3', name: 'Headlamp + batteries', note: 'Black Diamond Spot ~$40', cost: 0, owned: false },
      { id: 'sf4', name: 'First Aid Kit', note: 'Adventure Medical Kits ~$30 or build your own', cost: 0, owned: false },
      { id: 'sf5', name: 'Portable Battery Bank', note: 'Anker 20,000 mAh ~$45', cost: 0, owned: false },
      { id: 'sf6', name: 'Emergency Bivy + Whistle', note: 'SOL Escape Bivvy ~$40, Fox 40 whistle ~$8', cost: 0, owned: false },
    ]
  },
  {
    id: 'kitchen',
    icon: '🍳',
    title: 'Kitchen & Water',
    items: [
      { id: 'kt1', name: 'Backpacking Stove', note: 'Jetboil Flash ~$110, MSR PocketRocket 2 ~$50', cost: 0, owned: false },
      { id: 'kt2', name: 'Fuel Canisters (2×)', note: 'MSR IsoPro 100g ~$8 each = ~$16', cost: 16, owned: false },
      { id: 'kt3', name: 'Cook Pot + Spork', note: 'Snow Peak 700 ~$55, titanium spork ~$12', cost: 0, owned: false },
      { id: 'kt4', name: 'Water Filter (Sawyer Squeeze)', note: '~$35 at REI', cost: 0, owned: false },
      { id: 'kt5', name: 'Water Bottles / Soft Flasks', note: 'Nalgene ~$12, Hydrapak Softflask ~$20', cost: 0, owned: false },
    ]
  },
  {
    id: 'hygiene',
    icon: '🧴',
    title: 'Hygiene & LNT',
    items: [
      { id: 'hy1', name: 'Trowel', note: 'Sea to Summit pocket trowel ~$15', cost: 15, owned: false },
      { id: 'hy2', name: 'Sunscreen SPF50+', note: '~$12–18', cost: 15, owned: false },
      { id: 'hy3', name: 'Insect Repellent + Head Net', note: '~$10–15 combined', cost: 12, owned: false },
      { id: 'hy4', name: 'Anti-Chafe Balm + Blister Kit', note: 'Body Glide ~$12, Leukotape ~$10', cost: 22, owned: false },
      { id: 'hy5', name: 'Dr. Bronner\'s + Hand Sanitizer', note: '~$5–8 combined', cost: 7, owned: false },
      { id: 'hy6', name: 'Ursack Major food bag', note: '~$90. Bear canister rental also at REI', cost: 0, owned: false },
    ]
  },
  {
    id: 'misc',
    icon: '📦',
    title: 'Misc.',
    items: []
  },
  {
    id: 'food',
    icon: '🥾',
    title: 'Food & Consumables',
    items: [
      { id: 'fd1', name: 'Freeze-dried dinners (5×)', note: 'Mountain House ~$12–15 each = ~$65', cost: 65, owned: false },
      { id: 'fd2', name: 'Breakfasts (oatmeal, granola)', note: '~$4–6/day × 5 = ~$25', cost: 25, owned: false },
      { id: 'fd3', name: 'Lunches (wraps, tortillas, tuna)', note: '~$6–8/day × 5 = ~$35', cost: 35, owned: false },
      { id: 'fd4', name: 'Snacks (trail mix, bars, chocolate)', note: '~$8–12/day × 5 = ~$50', cost: 50, owned: false },
      { id: 'fd5', name: 'Coffee + electrolytes', note: 'Starbucks Via, Nuun tabs ~$20 total', cost: 20, owned: false },
    ]
  }
]

// ── Summary Card ──
function SummaryCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: color ? `${color}12` : '#2d2926',
      border: `1px solid ${color ? `${color}30` : '#3d3731'}`,
      borderRadius: '4px',
      padding: '16px',
      textAlign: 'center',
      flex: 1,
      minWidth: '130px'
    }}>
      <div style={{
        fontFamily: 'monospace', fontSize: '9px',
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: '#7a6f66', marginBottom: '8px'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '26px', fontWeight: '700',
        color: color || '#f5f1ed',
        lineHeight: 1
      }}>
        ${value.toLocaleString()}
      </div>
      {sub && (
        <div style={{ fontSize: '11px', color: '#7a6f66', marginTop: '5px' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

// ── Gas Calculator ──
function GasCalculator({ onGasCostChange }) {
  const [distance, setDistance] = useState('')
  const [mpg, setMpg] = useState('')
  const [price, setPrice] = useState('')

  const calc = () => {
    const d = parseFloat(distance)
    const m = parseFloat(mpg)
    const p = parseFloat(price)
    if (!d || !m || !p) return null
    const gallons = (d * 2) / m
    return gallons * p
  }

  const gasCost = calc()

  const inputStyle = {
    background: '#1a1714',
    border: '1px solid #3d3731',
    borderRadius: '3px',
    color: '#e8e0d8',
    padding: '7px 10px',
    fontSize: '12px',
    fontFamily: 'monospace',
    width: '110px',
    outline: 'none'
  }

  return (
    <div style={{
      background: '#2d2926',
      border: '1px solid #3d3731',
      borderRadius: '4px',
      padding: '16px',
      marginBottom: '2px'
    }}>
      <div style={{
        fontFamily: 'monospace', fontSize: '10px',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: '#7a6f66', marginBottom: '14px'
      }}>
        ⛽ Gas Calculator
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7a6f66', marginBottom: '4px' }}>Distance from home (mi)</div>
          <input
            style={inputStyle}
            type="number"
            placeholder="e.g. 280"
            value={distance}
            onChange={e => setDistance(e.target.value)}
          />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#7a6f66', marginBottom: '4px' }}>Vehicle MPG</div>
          <input
            style={inputStyle}
            type="number"
            placeholder="e.g. 28"
            value={mpg}
            onChange={e => setMpg(e.target.value)}
          />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#7a6f66', marginBottom: '4px' }}>Gas price ($/gal)</div>
          <input
            style={inputStyle}
            type="number"
            placeholder="e.g. 3.80"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
      </div>

      <div style={{
        background: 'rgba(90,143,163,0.08)',
        border: '1px solid rgba(90,143,163,0.2)',
        borderRadius: '3px',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div>
          <div style={{
            fontFamily: 'monospace', fontSize: '10px',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#5a8fa3', marginBottom: '3px'
          }}>
            Estimated Round-Trip Gas Cost
          </div>
          {gasCost !== null && (
            <div style={{ fontSize: '11px', color: '#7a6f66' }}>
              {parseFloat(distance) * 2} mi ÷ {mpg} mpg = {((parseFloat(distance) * 2) / parseFloat(mpg)).toFixed(1)} gal × ${price}
            </div>
          )}
        </div>
        <div style={{
          fontFamily: 'monospace', fontSize: '22px',
          color: gasCost !== null ? '#f5f1ed' : '#3d3731'
        }}>
          {gasCost !== null ? `$${gasCost.toFixed(2)}` : '—'}
        </div>
      </div>

      {gasCost !== null && (
        <button
          onClick={() => onGasCostChange(parseFloat(gasCost.toFixed(2)))}
          style={{
            marginTop: '10px',
            background: 'none',
            border: '1px solid #5a8fa3',
            borderRadius: '3px',
            color: '#5a8fa3',
            padding: '6px 14px',
            fontSize: '10px',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          + Add Gas Cost to Travel Section
        </button>
      )}
    </div>
  )
}

// ── Cost Row ──
function CostRow({ item, onUpdate, onDelete }) {
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal] = useState(item.name)

  const handleNameSave = () => {
    onUpdate(item.id, { name: nameVal })
    setEditingName(false)
  }

  return (
    <tr style={{
      opacity: item.owned ? 0.5 : 1,
      transition: 'opacity 0.2s',
      borderBottom: '1px solid rgba(61,55,49,0.5)'
    }}>
      {/* Name */}
      <td style={{ padding: '9px 12px', verticalAlign: 'middle' }}>
        {editingName ? (
          <input
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={e => {
              if (e.key === 'Enter') handleNameSave()
              if (e.key === 'Escape') setEditingName(false)
            }}
            autoFocus
            style={{
              background: '#1a1714',
              border: '1px solid #5a8fa3',
              borderRadius: '3px',
              color: '#e8e0d8',
              padding: '4px 8px',
              fontSize: '12px',
              width: '100%',
              outline: 'none'
            }}
          />
        ) : (
          <span
            onClick={() => setEditingName(true)}
            style={{
              fontSize: '13px',
              color: item.owned ? '#6b8c5a' : '#e8e0d8',
              cursor: 'text',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
            title="Click to edit"
          >
            <span>
              {item.name}
              {item.productName && (
                <>
                  <span style={{ color: '#7a6f66' }}> — </span>
                  <span style={{ color: '#c9a84c' }}>{item.productName}</span>
                </>
              )}
            </span>
            {item.fromInventory && (
              <span
                title="Pulled from your gear inventory"
                style={{
                  fontFamily: 'monospace', fontSize: '8px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '2px 6px', borderRadius: '2px',
                  color: '#6b8c5a',
                  border: '1px solid #6b8c5a55',
                  background: 'rgba(107,140,90,0.1)',
                  whiteSpace: 'nowrap',
                }}
              >
                ✓ My Gear
              </span>
            )}
          </span>
        )}
        <span style={{ fontSize: '11px', color: '#7a6f66', display: 'block', marginTop: '2px' }}>
          {item.note}
        </span>
      </td>

      {/* Cost Input */}
      <td style={{ padding: '9px 12px', textAlign: 'right', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
          <span style={{ fontSize: '12px', color: '#7a6f66' }}>$</span>
          <input
            type="number"
            value={item.cost}
            min="0"
            onChange={e => onUpdate(item.id, { cost: parseFloat(e.target.value) || 0 })}
            style={{
              background: '#1a1714',
              border: '1px solid #3d3731',
              borderRadius: '3px',
              color: item.owned ? '#6b8c5a' : '#e8e0d8',
              padding: '5px 8px',
              fontSize: '12px',
              fontFamily: 'monospace',
              width: '80px',
              textAlign: 'right',
              outline: 'none'
            }}
          />
        </div>
      </td>

      {/* Already Own */}
      <td style={{ padding: '9px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
        <label style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '5px',
          cursor: 'pointer',
          fontSize: '11px',
          color: item.owned ? '#6b8c5a' : '#7a6f66',
          fontFamily: 'monospace'
        }}>
          <input
            type="checkbox"
            checked={item.owned}
            onChange={e => onUpdate(item.id, { owned: e.target.checked })}
            style={{ accentColor: '#6b8c5a', cursor: 'pointer' }}
          />
          Own
        </label>
      </td>

      {/* Delete */}
      <td style={{ padding: '9px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
        <button
          onClick={() => onDelete(item.id)}
          style={{
            background: 'none', border: 'none',
            color: '#7a6f66', cursor: 'pointer',
            fontSize: '13px', padding: '2px',
            opacity: 0.5, transition: 'opacity 0.15s'
          }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.5}
        >✕</button>
      </td>
    </tr>
  )
}

// ── Add Cost Row Form ──
function AddCostRowForm({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [cost, setCost] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({
      id: 'custom-' + Date.now(),
      name: name.trim(),
      note: note.trim(),
      cost: parseFloat(cost) || 0,
      owned: false
    })
  }

  const inputStyle = {
    background: '#1a1714',
    border: '1px solid #3d3731',
    borderRadius: '3px',
    color: '#e8e0d8',
    padding: '6px 10px',
    fontSize: '12px',
    outline: 'none',
    flex: 1,
    minWidth: '80px'
  }

  return (
    <div style={{
      display: 'flex', gap: '8px', alignItems: 'center',
      padding: '10px 12px',
      background: '#2d2926',
      borderTop: '1px dashed #3d3731',
      flexWrap: 'wrap'
    }}>
      <input
        style={{ ...inputStyle, flex: 2 }}
        placeholder="Item name…"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        autoFocus
      />
      <input
        style={{ ...inputStyle, flex: 3 }}
        placeholder="Note…"
        value={note}
        onChange={e => setNote(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
      />
      <input
        style={{ ...inputStyle, flex: 0, width: '80px', textAlign: 'right' }}
        type="number"
        placeholder="$0"
        value={cost}
        onChange={e => setCost(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        min="0"
      />
      <button
        onClick={handleAdd}
        style={{
          background: '#6b8c5a', border: 'none', borderRadius: '3px',
          color: 'white', padding: '6px 14px', fontSize: '10px',
          fontFamily: 'monospace', letterSpacing: '0.1em',
          textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap'
        }}
      >+ Add</button>
      <button
        onClick={onCancel}
        style={{
          background: 'none', border: '1px solid #3d3731', borderRadius: '3px',
          color: '#7a6f66', padding: '6px 14px', fontSize: '10px',
          fontFamily: 'monospace', letterSpacing: '0.1em',
          textTransform: 'uppercase', cursor: 'pointer'
        }}
      >Cancel</button>
    </div>
  )
}

// ── Cost Section ──
function CostSection({ section, onUpdateItem, onDeleteItem, onAddItem, onGasCostAdd }) {
  const [showAddForm, setShowAddForm] = useState(false)

  const sectionTotal = section.items.reduce((sum, item) => sum + (item.owned ? 0 : item.cost), 0)
  const ownedTotal = section.items.reduce((sum, item) => sum + (item.owned ? item.cost : 0), 0)

  const handleAdd = (newItem) => {
    onAddItem(section.id, newItem)
    setShowAddForm(false)
  }

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Section Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 14px',
        background: '#3d3731',
        borderRadius: '3px 3px 0 0',
        border: '1px solid #3d3731',
        borderBottom: 'none'
      }}>
        <span style={{ fontSize: '14px' }}>{section.icon}</span>
        <span style={{
          fontFamily: 'monospace', fontSize: '11px',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#b8afa8'
        }}>
          {section.title}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          {ownedTotal > 0 && (
            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#6b8c5a' }}>
              own: ${ownedTotal.toFixed(0)}
            </span>
          )}
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#e8e0d8' }}>
            ${sectionTotal.toFixed(0)}
          </span>
        </div>
      </div>

      {/* Gas Calculator (travel section only) */}
      {section.id === 'travel' && (
        <GasCalculator onGasCostChange={(cost) => {
          onAddItem('travel', {
            id: 'gas-' + Date.now(),
            name: 'Gas (round trip)',
            note: 'Calculated from gas calculator',
            cost,
            owned: false
          })
        }} />
      )}

      {/* Table */}
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        border: '1px solid #3d3731',
        borderTop: section.id === 'travel' ? '1px solid #3d3731' : 'none',
        borderRadius: section.id !== 'travel' ? '0' : '0',
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #3d3731' }}>
            <th style={{
              fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#7a6f66',
              padding: '8px 12px', background: '#2d2926', textAlign: 'left'
            }}>Item</th>
            <th style={{
              fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#7a6f66',
              padding: '8px 12px', background: '#2d2926', textAlign: 'right',
              width: '110px'
            }}>Cost</th>
            <th style={{
              fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#7a6f66',
              padding: '8px 12px', background: '#2d2926', textAlign: 'center',
              width: '80px'
            }}>Own?</th>
            <th style={{ background: '#2d2926', width: '32px' }}></th>
          </tr>
        </thead>
        <tbody style={{ background: '#2d2926' }}>
          {section.items.map(item => (
            <CostRow
              key={item.id}
              item={item}
              onUpdate={(id, updates) => onUpdateItem(section.id, id, updates)}
              onDelete={(id) => onDeleteItem(section.id, id)}
            />
          ))}
        </tbody>
      </table>

      {/* Add Row */}
      {showAddForm ? (
        <AddCostRowForm
          onAdd={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            width: '100%',
            background: 'none',
            border: '1px solid #3d3731',
            borderTop: 'none',
            borderRadius: '0 0 3px 3px',
            color: '#6b8c5a',
            padding: '8px',
            fontSize: '10px',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(107,140,90,0.08)'}
          onMouseLeave={e => e.target.style.background = 'none'}
        >
          + Add Item
        </button>
      )}
    </div>
  )
}

// ── Main CostCalculator ──
function CostCalculator({ tripId, gearData }) {
  const EMPTY_COSTS = DEFAULT_COSTS.map(section => ({ ...section, items: [] }))
  const [costData, setCostData] = useLocalStorage(
    tripId ? `trip-cost-${tripId}` : 'costData',
    EMPTY_COSTS
  )

  // Sync gear list items into cost sections. Each gear item gets a cost
  // row with id `gear-{categoryId}-{itemId}` so user-edited cost/owned
  // values are preserved across re-syncs. Items removed from the gear
  // list are also removed from cost data.
  useEffect(() => {
    if (!gearData || gearData.length === 0) return

    const gearRowIds = new Set()
    const gearRowsBySection = {}

    gearData.forEach(gearCat => {
      const sectionId = mapGearCategoryToCostSection(gearCat.id)
      if (!gearRowsBySection[sectionId]) gearRowsBySection[sectionId] = []
      gearCat.items.forEach(item => {
        const rowId = `gear-${gearCat.id}-${item.id}`
        gearRowIds.add(rowId)
        gearRowsBySection[sectionId].push({
          id: rowId,
          name: item.name,
          productName: item.productName || '',
          fromInventory: !!item.fromInventory,
          note: item.note || '',
          cost: 0,
          owned: !!item.owned,
        })
      })
    })

    setCostData(prev => {
      // Ensure all DEFAULT_COSTS sections exist (handles 'misc' added later)
      const existingIds = new Set(prev.map(s => s.id))
      let next = [...prev]
      DEFAULT_COSTS.forEach(defSection => {
        if (!existingIds.has(defSection.id)) {
          next.push({ ...defSection, items: [] })
        }
      })

      let changed = next !== prev

      next = next.map(section => {
        const incoming = gearRowsBySection[section.id] || []
        const existingGearRows = section.items.filter(i => i.id.startsWith('gear-'))
        const nonGearRows = section.items.filter(i => !i.id.startsWith('gear-'))

        // Merge: keep cost/owned for existing gear rows, drop removed ones,
        // add new ones.
        const existingById = new Map(existingGearRows.map(r => [r.id, r]))
        const mergedGearRows = incoming.map(row => {
          const existing = existingById.get(row.id)
          if (existing) {
            // Preserve user-edited cost/owned, refresh metadata from gear
            return {
              ...row,
              cost: existing.cost,
              owned: existing.owned,
            }
          }
          return row
        })

        // Detect change to avoid unnecessary state updates
        const sameLength = mergedGearRows.length === existingGearRows.length
        const sameContent = sameLength && mergedGearRows.every((r, i) => {
          const e = existingGearRows[i]
          return e && e.id === r.id && e.name === r.name && e.note === r.note
            && e.productName === r.productName && e.fromInventory === r.fromInventory
        })
        if (sameContent) return section

        changed = true
        return { ...section, items: [...nonGearRows, ...mergedGearRows] }
      })

      return changed ? next : prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gearData])

  const updateItem = (sectionId, itemId, updates) => {
    setCostData(prev => prev.map(section =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : section
    ))
  }

  const deleteItem = (sectionId, itemId) => {
    if (!confirm('Remove this item?')) return
    setCostData(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, items: section.items.filter(item => item.id !== itemId) }
        : section
    ))
  }

  const addItem = (sectionId, newItem) => {
    setCostData(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, items: [...section.items, newItem] }
        : section
    ))
  }

  // Totals
  const allItems = costData.flatMap(s => s.items)
  const totalCost = allItems.reduce((sum, item) => sum + (item.owned ? 0 : item.cost), 0)
  const ownedValue = allItems.reduce((sum, item) => sum + (item.owned ? item.cost : 0), 0)
  const travelCost = costData
    .find(s => s.id === 'travel')?.items
    .reduce((sum, item) => sum + (item.owned ? 0 : item.cost), 0) || 0

  const resetAll = () => {
    if (confirm('Reset all cost data to defaults? This cannot be undone.')) {
      setCostData(DEFAULT_COSTS)
    }
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 80px' }}>

      {/* Summary Cards */}
      <div style={{
        display: 'flex', gap: '10px', flexWrap: 'wrap',
        padding: '24px 0 28px'
      }}>
        <SummaryCard
          label="Total to Buy"
          value={totalCost}
          sub="everything not owned"
        />
        <SummaryCard
          label="Already Own"
          value={ownedValue}
          sub="saved / not spending"
          color="#6b8c5a"
        />
        <SummaryCard
          label="Grand Total"
          value={totalCost + ownedValue}
          sub="full gear value"
          color="#5a8fa3"
        />
        <SummaryCard
          label="Travel & Fees"
          value={travelCost}
          sub="gas, permits, parking"
          color="#c9a84c"
        />
      </div>

      {/* Reset Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          onClick={resetAll}
          style={{
            background: 'none',
            border: '1px solid rgba(192,57,43,0.4)',
            borderRadius: '3px',
            color: '#c0392b',
            padding: '6px 14px',
            fontSize: '10px',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          Reset to Defaults
        </button>
      </div>

      {/* Sections */}
      {costData.map(section => (
        <CostSection
          key={section.id}
          section={section}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
          onAddItem={addItem}
        />
      ))}
    </div>
  )
}

export default CostCalculator