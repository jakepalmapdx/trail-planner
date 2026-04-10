import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const DEFAULT_FOOD_PLAN = [
  {
    id: 'day1',
    label: 'Day 1',
    name: 'Devils Lake → Green Lakes',
    miles: 7.7,
    calories: 2500,
    meals: {
      breakfast: [
        { id: 'b1', name: 'Instant oatmeal (2 packets)', note: 'Add nut butter packet for calories' },
        { id: 'b2', name: 'Instant coffee / Starbucks Via', note: '' },
        { id: 'b3', name: 'Handful of dried fruit', note: '' },
      ],
      lunch: [
        { id: 'l1', name: 'Pita + hard salami + aged cheddar', note: '' },
        { id: 'l2', name: 'Energy bar (Clif, ProBar)', note: '' },
        { id: 'l3', name: 'Dried mango slices', note: '' },
      ],
      dinner: [
        { id: 'd1', name: 'Freeze-dried dinner', note: 'Mountain House Beef Stroganoff' },
        { id: 'd2', name: 'Hot chocolate packet', note: '' },
        { id: 'd3', name: '2 squares dark chocolate', note: '' },
      ]
    }
  },
  {
    id: 'day2',
    label: 'Day 2 — Big Mileage',
    name: 'Green Lakes → Alder Creek',
    miles: 12.5,
    calories: 3500,
    meals: {
      breakfast: [
        { id: 'b1', name: 'Granola + powdered/coconut milk', note: '' },
        { id: 'b2', name: 'Coffee + electrolyte packet', note: '' },
        { id: 'b3', name: 'Nut butter packet', note: '' },
      ],
      lunch: [
        { id: 'l1', name: 'Tortillas + tuna packet + hot sauce', note: '' },
        { id: 'l2', name: 'Corn chips (Fritos)', note: 'Salt craving is real on big days' },
        { id: 'l3', name: 'Trail mix w/ M&Ms', note: '' },
      ],
      dinner: [
        { id: 'd1', name: 'Freeze-dried pasta or mac & cheese', note: 'Add olive oil for +120 cal' },
        { id: 'd2', name: 'Miso soup packet', note: '' },
        { id: 'd3', name: 'Gummy bears', note: '' },
      ]
    }
  },
  {
    id: 'day3',
    label: 'Day 3 — Big Mileage',
    name: 'Alder Creek → Obsidian Zone',
    miles: 12.2,
    calories: 3500,
    meals: {
      breakfast: [
        { id: 'b1', name: 'Instant grits or polenta', note: 'Instant cheese grits are underrated trail food' },
        { id: 'b2', name: 'Coffee + electrolyte', note: '' },
        { id: 'b3', name: 'Almonds', note: '' },
      ],
      lunch: [
        { id: 'l1', name: 'Bagel thin + cream cheese + smoked salmon', note: '' },
        { id: 'l2', name: 'Crackers + peanut butter packet', note: '' },
        { id: 'l3', name: 'Date-nut energy balls', note: 'Pre-made at home' },
      ],
      dinner: [
        { id: 'd1', name: 'Freeze-dried chili mac or red beans & rice', note: '' },
        { id: 'd2', name: 'Instant mashed potato side', note: '' },
        { id: 'd3', name: 'Tea + dark chocolate', note: '' },
      ]
    }
  },
  {
    id: 'day4',
    label: 'Day 4',
    name: 'Obsidian Zone → Mesa Creek',
    miles: 8.2,
    calories: 2800,
    meals: {
      breakfast: [
        { id: 'b1', name: 'Oatmeal + coconut flakes + dried berries', note: '' },
        { id: 'b2', name: 'Coffee', note: '' },
        { id: 'b3', name: 'Macadamia nuts', note: '' },
      ],
      lunch: [
        { id: 'l1', name: 'Shin Ramyun', note: 'Add instant mashed potato to thicken' },
        { id: 'l2', name: 'Jerky / meat stick', note: '' },
        { id: 'l3', name: 'Sour gummies', note: 'Morale item' },
      ],
      dinner: [
        { id: 'd1', name: 'Freeze-dried Thai curry or coconut rice', note: '' },
        { id: 'd2', name: 'Electrolyte drink mix', note: '' },
        { id: 'd3', name: 'Best remaining chocolate', note: '' },
      ]
    }
  },
  {
    id: 'day5',
    label: 'Day 5 — Out Day',
    name: 'Mesa Creek → Devils Lake',
    miles: 6.3,
    calories: 2000,
    meals: {
      breakfast: [
        { id: 'b1', name: 'Finish remaining oatmeal or granola', note: '' },
        { id: 'b2', name: 'Last coffee', note: 'Make it count' },
      ],
      lunch: [
        { id: 'l1', name: 'Remaining bars + trail mix', note: '' },
        { id: 'l2', name: 'Dried fruit — whatever is left', note: '' },
      ],
      dinner: [
        { id: 'd1', name: '10 Barrel Brewing — Bend', note: '30 min east on Cascade Lakes Hwy' },
        { id: 'd2', name: 'Biggest burger available', note: 'You have earned it' },
      ]
    }
  }
]

const DEFAULT_SNACKS = [
  { id: 'sn1', name: 'Trail mix (custom)', cal: '~160 cal/oz' },
  { id: 'sn2', name: 'Snickers / PayDay bars', cal: '~270 cal each' },
  { id: 'sn3', name: 'Nut butter packets', cal: '~190 cal — Justin\'s' },
  { id: 'sn4', name: 'Meat sticks / jerky', cal: '~80–110 cal' },
  { id: 'sn5', name: 'Medjool dates', cal: '~66 cal each' },
  { id: 'sn6', name: 'Corn chips (Fritos)', cal: '~160 cal/oz + salt' },
  { id: 'sn7', name: 'ProBar Meal bar', cal: '~370 cal' },
  { id: 'sn8', name: 'Crackers (Triscuit)', cal: '~140 cal/serving' },
  { id: 'sn9', name: 'Dried mango / apricot', cal: '~70 cal/oz' },
  { id: 'sn10', name: 'Dark chocolate 70%+', cal: '~170 cal/oz' },
  { id: 'sn11', name: 'Nuun / electrolyte tabs', cal: 'Hydration critical' },
  { id: 'sn12', name: 'Starbucks Via packets', cal: 'Morale: ∞' },
]

const MEAL_CONFIG = {
  breakfast: { label: '☀️ Breakfast', color: '#c9a84c' },
  lunch: { label: '🌤️ Lunch / Trail', color: '#5a8fa3' },
  dinner: { label: '🌙 Dinner', color: '#6b8c5a' },
}

// ── Meal Item ──
function MealItem({ item, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [nameVal, setNameVal] = useState(item.name)
  const [noteVal, setNoteVal] = useState(item.note)

  const handleSave = () => {
    onEdit(item.id, { name: nameVal, note: noteVal })
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{
        background: '#1a1714',
        border: '1px solid #5a8fa3',
        borderRadius: '3px',
        padding: '8px',
        marginBottom: '4px'
      }}>
        <input
          value={nameVal}
          onChange={e => setNameVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
          style={{
            background: 'transparent', border: 'none',
            borderBottom: '1px solid #3d3731',
            color: '#e8e0d8', fontSize: '12px',
            width: '100%', outline: 'none',
            padding: '2px 0', marginBottom: '6px'
          }}
        />
        <input
          value={noteVal}
          onChange={e => setNoteVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="Note (optional)…"
          style={{
            background: 'transparent', border: 'none',
            borderBottom: '1px solid #3d3731',
            color: '#7a6f66', fontSize: '11px',
            width: '100%', outline: 'none', padding: '2px 0'
          }}
        />
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          <button onClick={handleSave} style={{
            background: '#5a8fa3', border: 'none', borderRadius: '2px',
            color: 'white', padding: '3px 10px', fontSize: '10px',
            fontFamily: 'monospace', cursor: 'pointer'
          }}>Save</button>
          <button onClick={() => setEditing(false)} style={{
            background: 'none', border: '1px solid #3d3731', borderRadius: '2px',
            color: '#7a6f66', padding: '3px 10px', fontSize: '10px',
            fontFamily: 'monospace', cursor: 'pointer'
          }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'start', gap: '8px',
      padding: '5px 0',
      borderBottom: '1px solid rgba(61,55,49,0.4)',
      group: true
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: '#e8e0d8', lineHeight: 1.4 }}>{item.name}</div>
        {item.note && (
          <div style={{ fontSize: '11px', color: '#7a6f66', marginTop: '1px' }}>{item.note}</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
        <button
          onClick={() => setEditing(true)}
          style={{
            background: 'none', border: 'none', color: '#7a6f66',
            cursor: 'pointer', fontSize: '11px', padding: '2px 4px',
            opacity: 0.5, transition: 'opacity 0.15s'
          }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.5}
        >✏️</button>
        <button
          onClick={() => onDelete(item.id)}
          style={{
            background: 'none', border: 'none', color: '#c0392b',
            cursor: 'pointer', fontSize: '11px', padding: '2px 4px',
            opacity: 0.4, transition: 'opacity 0.15s'
          }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.4}
        >✕</button>
      </div>
    </div>
  )
}

// ── Meal Column ──
function MealColumn({ mealType, items, onEditItem, onDeleteItem, onAddItem }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newNote, setNewNote] = useState('')
  const config = MEAL_CONFIG[mealType]

  const handleAdd = () => {
    if (!newName.trim()) return
    onAddItem(mealType, {
      id: 'custom-' + Date.now(),
      name: newName.trim(),
      note: newNote.trim()
    })
    setNewName('')
    setNewNote('')
    setShowAdd(false)
  }

  return (
    <div style={{ flex: 1, minWidth: '160px' }}>
      <div style={{
        fontFamily: 'monospace', fontSize: '10px',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: config.color,
        marginBottom: '8px', paddingBottom: '6px',
        borderBottom: `1px solid ${config.color}30`
      }}>
        {config.label}
      </div>

      <div>
        {items.map(item => (
          <MealItem
            key={item.id}
            item={item}
            onEdit={(id, updates) => onEditItem(mealType, id, updates)}
            onDelete={(id) => onDeleteItem(mealType, id)}
          />
        ))}
      </div>

      {showAdd ? (
        <div style={{ marginTop: '6px' }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Add item…"
            autoFocus
            style={{
              background: '#1a1714', border: '1px solid #5a8fa3',
              borderRadius: '3px', color: '#e8e0d8',
              padding: '5px 8px', fontSize: '12px',
              width: '100%', outline: 'none', marginBottom: '4px'
            }}
          />
          <input
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Note (optional)…"
            style={{
              background: '#1a1714', border: '1px solid #3d3731',
              borderRadius: '3px', color: '#7a6f66',
              padding: '5px 8px', fontSize: '11px',
              width: '100%', outline: 'none', marginBottom: '6px'
            }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={handleAdd} style={{
              background: '#6b8c5a', border: 'none', borderRadius: '2px',
              color: 'white', padding: '4px 10px', fontSize: '10px',
              fontFamily: 'monospace', cursor: 'pointer'
            }}>Add</button>
            <button onClick={() => setShowAdd(false)} style={{
              background: 'none', border: '1px solid #3d3731', borderRadius: '2px',
              color: '#7a6f66', padding: '4px 10px', fontSize: '10px',
              fontFamily: 'monospace', cursor: 'pointer'
            }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          style={{
            marginTop: '6px', background: 'none',
            border: '1px dashed #3d3731', borderRadius: '2px',
            color: '#7a6f66', padding: '4px 8px',
            fontSize: '10px', fontFamily: 'monospace',
            letterSpacing: '0.08em', cursor: 'pointer',
            width: '100%', transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = '#6b8c5a'
            e.target.style.color = '#6b8c5a'
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = '#3d3731'
            e.target.style.color = '#7a6f66'
          }}
        >+ add</button>
      )}
    </div>
  )
}

// ── Day Card ──
function DayCard({ day, onEditMealItem, onDeleteMealItem, onAddMealItem, onEditDay }) {
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal] = useState(day.name)
  const [editingCal, setEditingCal] = useState(false)
  const [calVal, setCalVal] = useState(day.calories)

  const calColor = day.calories >= 3000 ? '#d4622a' : day.calories >= 2500 ? '#c9a84c' : '#6b8c5a'

  return (
    <div style={{
      background: '#2d2926',
      border: '1px solid #3d3731',
      borderRadius: '4px',
      marginBottom: '16px',
      overflow: 'hidden'
    }}>
      {/* Day Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: '12px', padding: '12px 16px',
        background: '#3d3731',
        flexWrap: 'wrap'
      }}>
        <div>
          <div style={{
            fontFamily: 'monospace', fontSize: '10px',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#c9a84c', marginBottom: '3px'
          }}>
            {day.label}
          </div>
          {editingName ? (
            <input
              value={nameVal}
              onChange={e => setNameVal(e.target.value)}
              onBlur={() => { onEditDay(day.id, { name: nameVal }); setEditingName(false) }}
              onKeyDown={e => {
                if (e.key === 'Enter') { onEditDay(day.id, { name: nameVal }); setEditingName(false) }
                if (e.key === 'Escape') setEditingName(false)
              }}
              autoFocus
              style={{
                background: '#1a1714', border: '1px solid #5a8fa3',
                borderRadius: '3px', color: '#f5f1ed',
                padding: '3px 8px', fontSize: '13px',
                fontWeight: '500', outline: 'none'
              }}
            />
          ) : (
            <div
              onClick={() => setEditingName(true)}
              style={{
                fontSize: '13px', color: '#f5f1ed',
                fontWeight: '500', cursor: 'text'
              }}
              title="Click to edit"
            >
              {day.name}
            </div>
          )}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            fontFamily: 'monospace', fontSize: '10px',
            color: '#7a6f66'
          }}>
            {day.miles} mi
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'monospace', fontSize: '9px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#7a6f66', marginBottom: '2px'
            }}>Target Cal</div>
            {editingCal ? (
              <input
                type="number"
                value={calVal}
                onChange={e => setCalVal(parseInt(e.target.value) || 0)}
                onBlur={() => { onEditDay(day.id, { calories: calVal }); setEditingCal(false) }}
                onKeyDown={e => {
                  if (e.key === 'Enter') { onEditDay(day.id, { calories: calVal }); setEditingCal(false) }
                  if (e.key === 'Escape') setEditingCal(false)
                }}
                autoFocus
                style={{
                  background: '#1a1714', border: '1px solid #5a8fa3',
                  borderRadius: '3px', color: calColor,
                  padding: '2px 6px', fontSize: '13px',
                  fontFamily: 'monospace', fontWeight: '700',
                  width: '80px', textAlign: 'right', outline: 'none'
                }}
              />
            ) : (
              <div
                onClick={() => setEditingCal(true)}
                style={{
                  fontFamily: 'monospace', fontSize: '14px',
                  fontWeight: '700', color: calColor,
                  cursor: 'text'
                }}
                title="Click to edit calorie target"
              >
                {day.calories.toLocaleString()} cal
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meal Columns */}
      <div style={{
        display: 'flex', gap: '0',
        padding: '14px 16px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {Object.keys(MEAL_CONFIG).map(mealType => (
          <MealColumn
            key={mealType}
            mealType={mealType}
            items={day.meals[mealType] || []}
            onEditItem={(mt, id, updates) => onEditMealItem(day.id, mt, id, updates)}
            onDeleteItem={(mt, id) => onDeleteMealItem(day.id, mt, id)}
            onAddItem={(mt, item) => onAddMealItem(day.id, mt, item)}
          />
        ))}
      </div>
    </div>
  )
}

// ── Snack Grid ──
function SnackGrid({ snacks, setSnacks }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCal, setNewCal] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    setSnacks(prev => [...prev, {
      id: 'sn-' + Date.now(),
      name: newName.trim(),
      cal: newCal.trim()
    }])
    setNewName('')
    setNewCal('')
    setShowAdd(false)
  }

  const handleDelete = (id) => {
    setSnacks(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '8px',
        marginBottom: '12px'
      }}>
        {snacks.map(snack => (
          <div
            key={snack.id}
            style={{
              background: '#2d2926',
              border: '1px solid #3d3731',
              borderRadius: '3px',
              padding: '9px 12px',
              position: 'relative',
              group: true
            }}
          >
            <div style={{ fontSize: '12px', color: '#e8e0d8' }}>{snack.name}</div>
            {snack.cal && (
              <div style={{
                fontFamily: 'monospace', fontSize: '10px',
                color: '#7a6f66', display: 'block', marginTop: '2px'
              }}>
                {snack.cal}
              </div>
            )}
            <button
              onClick={() => handleDelete(snack.id)}
              style={{
                position: 'absolute', top: '6px', right: '6px',
                background: 'none', border: 'none',
                color: '#c0392b', cursor: 'pointer',
                fontSize: '10px', opacity: 0.3,
                transition: 'opacity 0.15s', padding: '0'
              }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.3}
            >✕</button>
          </div>
        ))}

        {showAdd && (
          <div style={{
            background: '#2d2926',
            border: '1px dashed #5a8fa3',
            borderRadius: '3px',
            padding: '9px 12px'
          }}>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Snack name…"
              autoFocus
              style={{
                background: 'none', border: 'none',
                borderBottom: '1px solid #3d3731',
                color: '#e8e0d8', fontSize: '12px',
                width: '100%', outline: 'none',
                padding: '2px 0', marginBottom: '5px'
              }}
            />
            <input
              value={newCal}
              onChange={e => setNewCal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Cal info…"
              style={{
                background: 'none', border: 'none',
                borderBottom: '1px solid #3d3731',
                color: '#7a6f66', fontSize: '11px',
                width: '100%', outline: 'none',
                padding: '2px 0', marginBottom: '8px'
              }}
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={handleAdd} style={{
                background: '#6b8c5a', border: 'none', borderRadius: '2px',
                color: 'white', padding: '3px 8px', fontSize: '10px',
                fontFamily: 'monospace', cursor: 'pointer'
              }}>Add</button>
              <button onClick={() => setShowAdd(false)} style={{
                background: 'none', border: '1px solid #3d3731', borderRadius: '2px',
                color: '#7a6f66', padding: '3px 8px', fontSize: '10px',
                fontFamily: 'monospace', cursor: 'pointer'
              }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: 'none', border: '1px solid #3d3731',
            borderRadius: '3px', color: '#6b8c5a',
            padding: '6px 14px', fontSize: '10px',
            fontFamily: 'monospace', letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer',
            transition: 'all 0.15s'
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
          + Add Snack
        </button>
      )}
    </div>
  )
}

// ── Main FoodPlanner ──
function FoodPlanner({ tripId }) {
  const [foodPlan, setFoodPlan] = useLocalStorage(
    tripId ? `trip-food-${tripId}` : 'foodPlan',
    []
  )
  const [snacks, setSnacks] = useLocalStorage(
    tripId ? `trip-snacks-${tripId}` : 'snacks',
    DEFAULT_SNACKS
  )

  const editMealItem = (dayId, mealType, itemId, updates) => {
    setFoodPlan(prev => prev.map(day =>
      day.id === dayId
        ? {
            ...day,
            meals: {
              ...day.meals,
              [mealType]: day.meals[mealType].map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              )
            }
          }
        : day
    ))
  }

  const deleteMealItem = (dayId, mealType, itemId) => {
    setFoodPlan(prev => prev.map(day =>
      day.id === dayId
        ? {
            ...day,
            meals: {
              ...day.meals,
              [mealType]: day.meals[mealType].filter(item => item.id !== itemId)
            }
          }
        : day
    ))
  }

  const addMealItem = (dayId, mealType, newItem) => {
    setFoodPlan(prev => prev.map(day =>
      day.id === dayId
        ? {
            ...day,
            meals: {
              ...day.meals,
              [mealType]: [...day.meals[mealType], newItem]
            }
          }
        : day
    ))
  }

  const editDay = (dayId, updates) => {
    setFoodPlan(prev => prev.map(day =>
      day.id === dayId ? { ...day, ...updates } : day
    ))
  }

  const totalCal = foodPlan.reduce((sum, day) => sum + day.calories, 0)
  const totalMiles = foodPlan.reduce((sum, day) => sum + day.miles, 0).toFixed(1)

  const resetFood = () => {
    if (confirm('Reset food plan to defaults? This cannot be undone.')) {
      setFoodPlan(DEFAULT_FOOD_PLAN)
      setSnacks(DEFAULT_SNACKS)
    }
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 80px' }}>

      {/* Stats Row */}
      <div style={{
        display: 'flex', gap: '10px', flexWrap: 'wrap',
        padding: '24px 0 28px'
      }}>
        {[
          { label: 'Total Miles', value: totalMiles, unit: 'mi', color: '#5a8fa3' },
          { label: 'Total Days', value: foodPlan.length, unit: 'days', color: '#c9a84c' },
          { label: 'Target Calories', value: totalCal.toLocaleString(), unit: 'cal total', color: '#d4622a' },
          { label: 'Avg Per Day', value: Math.round(totalCal / foodPlan.length).toLocaleString(), unit: 'cal/day', color: '#6b8c5a' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, minWidth: '120px',
            background: `${stat.color}12`,
            border: `1px solid ${stat.color}30`,
            borderRadius: '4px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: 'monospace', fontSize: '9px',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#7a6f66', marginBottom: '6px'
            }}>
              {stat.label}
            </div>
            <div style={{
              fontSize: '22px', fontWeight: '700',
              color: stat.color, lineHeight: 1
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '11px', color: '#7a6f66', marginTop: '3px' }}>
              {stat.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div style={{
        background: 'rgba(90,143,163,0.08)',
        border: '1px solid rgba(90,143,163,0.2)',
        borderRadius: '3px', padding: '12px 16px',
        marginBottom: '24px',
        fontSize: '13px', color: '#b8afa8', lineHeight: 1.7
      }}>
        <span style={{
          fontFamily: 'monospace', fontSize: '10px',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#5a8fa3', display: 'block', marginBottom: '5px'
        }}>
          📦 Prep Note
        </span>
        No resupply on this route — all 5 days of food goes in on Day 1. Pre-bag each day's snacks individually. Remove all unnecessary packaging at home to cut weight. Shop at REI Bend, Market of Choice, or Whole Foods before heading to the trailhead.
      </div>

      {/* Reset */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          onClick={resetFood}
          style={{
            background: 'none',
            border: '1px solid rgba(192,57,43,0.4)',
            borderRadius: '3px', color: '#c0392b',
            padding: '6px 14px', fontSize: '10px',
            fontFamily: 'monospace', letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer'
          }}
        >Reset to Defaults</button>
      </div>

      {/* Day Cards */}
      {foodPlan.map(day => (
        <DayCard
          key={day.id}
          day={day}
          onEditMealItem={editMealItem}
          onDeleteMealItem={deleteMealItem}
          onAddMealItem={addMealItem}
          onEditDay={editDay}
        />
      ))}

      {/* Snacks Section */}
      <div style={{ marginTop: '36px' }}>
        <div style={{
          display: 'flex', alignItems: 'baseline',
          gap: '12px', marginBottom: '6px'
        }}>
          <div style={{
            fontSize: '18px', fontWeight: '700',
            color: '#f5f1ed', letterSpacing: '-0.02em'
          }}>
            Daily Snack Rotation
          </div>
        </div>
        <div style={{
          fontSize: '13px', color: '#7a6f66',
          marginBottom: '16px', lineHeight: 1.6
        }}>
          Pack a full day's snacks separate from meals. Target 600–800 extra cal from snacks on big mileage days.
        </div>
        <SnackGrid snacks={snacks} setSnacks={setSnacks} />
      </div>
    </div>
  )
}

export default FoodPlanner