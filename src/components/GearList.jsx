import { useState } from 'react'

const PRIORITY_LABELS = {
  critical: 'CRITICAL',
  recommended: 'REC',
  optional: 'OPTIONAL'
}

const PRIORITY_COLORS = {
  critical: '#d4622a',
  recommended: '#5a8fa3',
  optional: '#6b8c5a'
}

function GearItem({ item, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const [editNote, setEditNote] = useState(item.note)

  const handleSave = () => {
    onEdit(item.id, { name: editName, note: editNote })
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') setIsEditing(false)
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '24px 1fr auto auto',
      gap: '12px',
      alignItems: 'start',
      padding: '10px 14px',
      background: item.checked ? 'rgba(255,255,255,0.02)' : '#2d2926',
      borderRadius: '4px',
      marginBottom: '2px',
      opacity: item.checked ? 0.45 : 1,
      transition: 'opacity 0.2s'
    }}>

      {/* Checkbox */}
      <div
        onClick={() => onToggle(item.id)}
        style={{
          width: '18px',
          height: '18px',
          border: `1px solid ${item.checked ? '#5a8fa3' : '#7a6f66'}`,
          borderRadius: '3px',
          background: item.checked ? '#5a8fa3' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          marginTop: '2px',
          transition: 'all 0.15s'
        }}
      >
        {item.checked && <span style={{ color: 'white', fontSize: '11px' }}>✓</span>}
      </div>

      {/* Content */}
      <div>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              style={{
                background: '#1a1714',
                border: '1px solid #5a8fa3',
                borderRadius: '3px',
                color: '#e8e0d8',
                padding: '5px 8px',
                fontSize: '13px',
                width: '100%',
                outline: 'none'
              }}
            />
            <input
              value={editNote}
              onChange={e => setEditNote(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Note (optional)"
              style={{
                background: '#1a1714',
                border: '1px solid #3d3731',
                borderRadius: '3px',
                color: '#b8afa8',
                padding: '5px 8px',
                fontSize: '12px',
                width: '100%',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSave} style={{
                background: '#5a8fa3', border: 'none', borderRadius: '3px',
                color: 'white', padding: '4px 12px', fontSize: '11px', cursor: 'pointer'
              }}>Save</button>
              <button onClick={() => setIsEditing(false)} style={{
                background: 'none', border: '1px solid #3d3731', borderRadius: '3px',
                color: '#7a6f66', padding: '4px 12px', fontSize: '11px', cursor: 'pointer'
              }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <div
              onClick={() => onToggle(item.id)}
              style={{
                fontSize: '13px',
                color: '#e8e0d8',
                textDecoration: item.checked ? 'line-through' : 'none',
                textDecorationColor: '#7a6f66',
                cursor: 'pointer',
                lineHeight: '1.4'
              }}
            >
              {item.name}
            </div>
            {item.note && (
              <div style={{
                fontSize: '11px',
                color: '#7a6f66',
                marginTop: '2px',
                lineHeight: '1.5'
              }}>
                {item.note}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Priority Badge */}
      {!isEditing && (
        <div style={{
          fontSize: '9px',
          fontFamily: 'monospace',
          letterSpacing: '0.08em',
          padding: '2px 7px',
          borderRadius: '2px',
          whiteSpace: 'nowrap',
          color: PRIORITY_COLORS[item.priority],
          border: `1px solid ${PRIORITY_COLORS[item.priority]}40`,
          background: `${PRIORITY_COLORS[item.priority]}18`,
          alignSelf: 'start',
          marginTop: '2px'
        }}>
          {PRIORITY_LABELS[item.priority]}
        </div>
      )}

      {/* Actions */}
      {!isEditing && (
        <div style={{ display: 'flex', gap: '4px', alignSelf: 'start', marginTop: '1px' }}>
          <button
            onClick={() => setIsEditing(true)}
            title="Edit"
            style={{
              background: 'none', border: 'none',
              color: '#7a6f66', cursor: 'pointer',
              fontSize: '13px', padding: '0 3px',
              opacity: 0.6, transition: 'opacity 0.15s'
            }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.6}
          >✏️</button>
          <button
            onClick={() => onDelete(item.id)}
            title="Delete"
            style={{
              background: 'none', border: 'none',
              color: '#c0392b', cursor: 'pointer',
              fontSize: '13px', padding: '0 3px',
              opacity: 0.6, transition: 'opacity 0.15s'
            }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.6}
          >✕</button>
        </div>
      )}
    </div>
  )
}

function AddItemForm({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [priority, setPriority] = useState('recommended')

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({
      id: 'custom-' + Date.now(),
      name: name.trim(),
      note: note.trim(),
      priority,
      checked: false
    })
    setName('')
    setNote('')
    setPriority('recommended')
  }

  return (
    <div style={{
      background: '#2d2926',
      border: '1px dashed #3d3731',
      borderRadius: '4px',
      padding: '14px',
      marginTop: '8px'
    }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Item name…"
          autoFocus
          style={{
            flex: 2, minWidth: '140px',
            background: '#1a1714',
            border: '1px solid #5a8fa3',
            borderRadius: '3px',
            color: '#e8e0d8',
            padding: '7px 10px',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Note (optional)…"
          style={{
            flex: 3, minWidth: '140px',
            background: '#1a1714',
            border: '1px solid #3d3731',
            borderRadius: '3px',
            color: '#b8afa8',
            padding: '7px 10px',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          style={{
            background: '#1a1714',
            border: '1px solid #3d3731',
            borderRadius: '3px',
            color: '#e8e0d8',
            padding: '7px 10px',
            fontSize: '12px',
            fontFamily: 'monospace',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="critical">CRITICAL</option>
          <option value="recommended">REC</option>
          <option value="optional">OPTIONAL</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleAdd}
          style={{
            background: '#6b8c5a', border: 'none', borderRadius: '3px',
            color: 'white', padding: '7px 16px', fontSize: '11px',
            fontFamily: 'monospace', letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer'
          }}
        >+ Add Item</button>
        <button
          onClick={onCancel}
          style={{
            background: 'none', border: '1px solid #3d3731', borderRadius: '3px',
            color: '#7a6f66', padding: '7px 16px', fontSize: '11px',
            fontFamily: 'monospace', letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer'
          }}
        >Cancel</button>
      </div>
    </div>
  )
}

function GearCategory({ category, onToggleItem, onDeleteItem, onEditItem, onAddItem }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const checkedCount = category.items.filter(i => i.checked).length
  const totalCount = category.items.length

  const handleAdd = (newItem) => {
    onAddItem(category.id, newItem)
    setShowAddForm(false)
  }

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Category Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
        paddingBottom: '8px',
        borderBottom: '1px solid #3d3731'
      }}>
        <span style={{ fontSize: '16px' }}>{category.icon}</span>
        <span style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#b8afa8'
        }}>
          {category.title}
        </span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: checkedCount === totalCount ? '#6b8c5a' : '#7a6f66'
        }}>
          {checkedCount}/{totalCount}
        </span>
      </div>

      {/* Items */}
      <div>
        {category.items.map(item => (
          <GearItem
            key={item.id}
            item={item}
            onToggle={(id) => onToggleItem(category.id, id)}
            onDelete={(id) => onDeleteItem(category.id, id)}
            onEdit={(id, updates) => onEditItem(category.id, id, updates)}
          />
        ))}
      </div>

      {/* Add Form or Button */}
      {showAddForm ? (
        <AddItemForm
          onAdd={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            marginTop: '8px',
            background: 'none',
            border: '1px solid #3d3731',
            borderRadius: '3px',
            color: '#6b8c5a',
            padding: '6px 14px',
            fontSize: '10px',
            fontFamily: 'monospace',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = '#6b8c5a'
            e.target.style.background = 'rgba(107,140,90,0.1)'
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = '#3d3731'
            e.target.style.background = 'none'
          }}
        >
          + Add Item
        </button>
      )}
    </div>
  )
}

function GearList({ categories, setCategories, gearAdvice }) {
  const [activeCategory, setActiveCategory] = useState(null)
  const [adviceCollapsed, setAdviceCollapsed] = useState(false)

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const checkedItems = categories.reduce((sum, cat) =>
    sum + cat.items.filter(i => i.checked).length, 0)
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0

  const toggleItem = (categoryId, itemId) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )}
        : cat
    ))
  }

  const deleteItem = (categoryId, itemId) => {
    if (!confirm('Remove this item?')) return
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
        : cat
    ))
  }

  const editItem = (categoryId, itemId, updates) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )}
        : cat
    ))
  }

  const addItem = (categoryId, newItem) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: [...cat.items, newItem] }
        : cat
    ))
  }

  const uncheckAll = () => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      items: cat.items.map(item => ({ ...item, checked: false }))
    })))
  }

  const displayedCategories = activeCategory
    ? categories.filter(c => c.id === activeCategory)
    : categories

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 80px' }}>

      {/* AI Gear Advice Banner */}
      {gearAdvice && gearAdvice.trim() && (
        <div style={{
          marginTop: '24px',
          background: 'rgba(201,168,76,0.06)',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '4px',
          padding: '14px 16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: adviceCollapsed ? 0 : '10px',
          }}>
            <div style={{
              fontFamily: 'monospace', fontSize: '10px',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#c9a84c',
            }}>
              ✨ AI Gear Suitability Review
            </div>
            <button
              onClick={() => setAdviceCollapsed(c => !c)}
              style={{
                background: 'none', border: 'none',
                color: '#7a6f66', cursor: 'pointer',
                fontSize: '11px', fontFamily: 'monospace',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '2px 6px',
              }}
            >
              {adviceCollapsed ? 'Show' : 'Hide'}
            </button>
          </div>
          {!adviceCollapsed && (
            <div style={{
              fontSize: '13px', color: '#b8afa8', lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {gearAdvice}
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div style={{ padding: '24px 0 28px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#7a6f66',
          letterSpacing: '0.1em',
          marginBottom: '6px'
        }}>
          <span>PACKING PROGRESS</span>
          <span>{checkedItems} / {totalItems} items · {progress}%</span>
        </div>
        <div style={{
          height: '4px', background: '#3d3731',
          borderRadius: '2px', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: progress === 100 ? '#6b8c5a' : '#5a8fa3',
            borderRadius: '2px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{
        display: 'flex', gap: '6px', flexWrap: 'wrap',
        marginBottom: '28px'
      }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            fontFamily: 'monospace', fontSize: '10px',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '6px 12px', borderRadius: '2px', cursor: 'pointer',
            border: activeCategory === null ? 'none' : '1px solid #3d3731',
            background: activeCategory === null ? '#5a8fa3' : 'none',
            color: activeCategory === null ? 'white' : '#7a6f66',
            transition: 'all 0.15s'
          }}
        >All</button>
        {categories.map(cat => {
          const checked = cat.items.filter(i => i.checked).length
          const total = cat.items.length
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(isActive ? null : cat.id)}
              style={{
                fontFamily: 'monospace', fontSize: '10px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '6px 12px', borderRadius: '2px', cursor: 'pointer',
                border: isActive ? 'none' : '1px solid #3d3731',
                background: isActive ? '#5a8fa3' : 'none',
                color: isActive ? 'white' : '#7a6f66',
                transition: 'all 0.15s'
              }}
            >
              {cat.icon} {cat.title.split(' ')[0]} {checked}/{total}
            </button>
          )
        })}
        {checkedItems > 0 && (
          <button
            onClick={uncheckAll}
            style={{
              marginLeft: 'auto',
              fontFamily: 'monospace', fontSize: '10px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '6px 12px', borderRadius: '2px', cursor: 'pointer',
              border: '1px solid rgba(192,57,43,0.4)',
              background: 'none', color: '#c0392b',
              transition: 'all 0.15s'
            }}
          >Reset All</button>
        )}
      </div>

      {/* Categories */}
      {displayedCategories.map(category => (
        <GearCategory
          key={category.id}
          category={category}
          onToggleItem={toggleItem}
          onDeleteItem={deleteItem}
          onEditItem={editItem}
          onAddItem={addItem}
        />
      ))}
    </div>
  )
}

export default GearList