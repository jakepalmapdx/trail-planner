import { useState, useEffect } from 'react'
import { fetchGearInventory, addGearItem, updateGearItem, deleteGearItem, GEAR_CATEGORIES } from '../lib/gear'

function toTotalOz(lbs, oz) {
  const l = lbs !== '' ? parseFloat(lbs) : 0
  const o = oz !== '' ? parseFloat(oz) : 0
  if (l === 0 && o === 0 && lbs === '' && oz === '') return null
  return (l * 16) + o
}

function fromTotalOz(totalOz) {
  if (totalOz == null) return { lbs: '', oz: '' }
  const lbs = Math.floor(totalOz / 16)
  const oz = +(totalOz % 16).toFixed(1)
  return { lbs: lbs > 0 ? String(lbs) : '', oz: oz > 0 ? String(oz) : '' }
}

function WeightInput({ lbs, oz, onLbsChange, onOzChange }) {
  return (
    <div className="weight-input-group">
      <div className="form-field" style={{ flex: 0, minWidth: '70px' }}>
        <label>Lbs</label>
        <input
          type="number"
          step="1"
          min="0"
          value={lbs}
          onChange={e => onLbsChange(e.target.value)}
          placeholder="0"
        />
      </div>
      <div className="form-field" style={{ flex: 0, minWidth: '70px' }}>
        <label>Oz</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="15.9"
          value={oz}
          onChange={e => onOzChange(e.target.value)}
          placeholder="0"
        />
      </div>
    </div>
  )
}

function AddGearForm({ onAdded }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [weightLbs, setWeightLbs] = useState('')
  const [weightOz, setWeightOz] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    try {
      const item = await addGearItem({
        name: name.trim(),
        category: category || null,
        brand: brand.trim() || null,
        weightOz: toTotalOz(weightLbs, weightOz),
        notes: notes.trim() || null,
      })
      onAdded(item)
      setName('')
      setCategory('')
      setBrand('')
      setWeightLbs('')
      setWeightOz('')
      setNotes('')
      setOpen(false)
    } catch (err) {
      console.error('Failed to add gear:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return (
      <button className="btn btn-primary btn-new-trip" onClick={() => setOpen(true)}>
        + Add Gear
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="gear-inv-add-form">
      <div className="gear-inv-add-row">
        <div className="form-field" style={{ flex: 2 }}>
          <label>Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Nemo Tensor Sleeping Pad"
            required
            autoFocus
          />
        </div>
        <div className="form-field" style={{ flex: 1 }}>
          <label>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="gear-inv-select"
          >
            <option value="">Select...</option>
            {GEAR_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="gear-inv-add-row">
        <div className="form-field" style={{ flex: 1 }}>
          <label>Brand</label>
          <input
            type="text"
            value={brand}
            onChange={e => setBrand(e.target.value)}
            placeholder="e.g. Nemo"
          />
        </div>
        <WeightInput
          lbs={weightLbs}
          oz={weightOz}
          onLbsChange={setWeightLbs}
          onOzChange={setWeightOz}
        />
        <div className="form-field" style={{ flex: 2 }}>
          <label>Notes</label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Optional notes..."
          />
        </div>
      </div>
      <div className="gear-inv-add-actions">
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary modal-submit" disabled={submitting || !name.trim()}>
          {submitting ? 'Adding...' : 'Add Item'}
        </button>
      </div>
    </form>
  )
}

function GearRow({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(item.name)
  const [category, setCategory] = useState(item.category || '')
  const [brand, setBrand] = useState(item.brand || '')
  const initWeight = fromTotalOz(item.weight_oz)
  const [weightLbs, setWeightLbs] = useState(initWeight.lbs)
  const [weightOz, setWeightOz] = useState(initWeight.oz)
  const [notes, setNotes] = useState(item.notes || '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await updateGearItem(item.id, {
        name: name.trim(),
        category: category || null,
        brand: brand.trim() || null,
        weightOz: toTotalOz(weightLbs, weightOz),
        notes: notes.trim() || null,
      })
      onUpdate(updated)
      setEditing(false)
    } catch (err) {
      console.error('Failed to update gear:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${item.name}"?`)) return
    try {
      await deleteGearItem(item.id)
      onDelete(item.id)
    } catch (err) {
      console.error('Failed to delete gear:', err)
    }
  }

  if (editing) {
    return (
      <div className="gear-inv-row gear-inv-row-editing">
        <div className="gear-inv-edit-fields">
          <input
            className="gear-inv-edit-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            autoFocus
          />
          <select
            className="gear-inv-select gear-inv-edit-input"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">No category</option>
            {GEAR_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            className="gear-inv-edit-input"
            value={brand}
            onChange={e => setBrand(e.target.value)}
            placeholder="Brand"
          />
          <div className="weight-input-group" style={{ gap: '4px' }}>
            <input
              className="gear-inv-edit-input"
              type="number"
              step="1"
              min="0"
              value={weightLbs}
              onChange={e => setWeightLbs(e.target.value)}
              placeholder="lbs"
              style={{ maxWidth: '60px' }}
            />
            <input
              className="gear-inv-edit-input"
              type="number"
              step="0.1"
              min="0"
              max="15.9"
              value={weightOz}
              onChange={e => setWeightOz(e.target.value)}
              placeholder="oz"
              style={{ maxWidth: '60px' }}
            />
          </div>
          <input
            className="gear-inv-edit-input"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes"
          />
        </div>
        <div className="gear-inv-edit-actions">
          <button className="btn btn-ghost" onClick={() => setEditing(false)} style={{ padding: '4px 10px', fontSize: '12px' }}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !name.trim()} style={{ width: 'auto', padding: '4px 12px', fontSize: '12px' }}>
            {saving ? '...' : 'Save'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="gear-inv-row">
      <div className="gear-inv-row-main">
        <span className="gear-inv-name">{item.name}</span>
        {item.brand && <span className="gear-inv-brand">{item.brand}</span>}
        {item.weight_oz != null && (
          <span className="gear-inv-weight">
            {item.weight_oz >= 16
              ? `${(item.weight_oz / 16).toFixed(1)} lbs`
              : `${item.weight_oz} oz`}
          </span>
        )}
      </div>
      {item.notes && <div className="gear-inv-notes">{item.notes}</div>}
      <div className="gear-inv-row-actions">
        <button className="gear-inv-action-btn" onClick={() => setEditing(true)} title="Edit">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button className="gear-inv-action-btn gear-inv-action-delete" onClick={handleDelete} title="Delete">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function GearInventoryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadGear()
  }, [])

  async function loadGear() {
    try {
      const data = await fetchGearInventory()
      setItems(data)
    } catch (err) {
      console.error('Failed to load gear:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleAdded(item) {
    setItems(prev => [...prev, item])
  }

  function handleUpdate(updated) {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
  }

  function handleDelete(itemId) {
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  // Group items by category
  const categories = [...new Set(items.map(i => i.category || 'Uncategorized'))]
  categories.sort((a, b) => {
    if (a === 'Uncategorized') return 1
    if (b === 'Uncategorized') return -1
    return a.localeCompare(b)
  })

  const filtered = items.filter(item => {
    const matchesCategory = filterCategory === 'all' || (item.category || 'Uncategorized') === filterCategory
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const groupedFiltered = {}
  filtered.forEach(item => {
    const cat = item.category || 'Uncategorized'
    if (!groupedFiltered[cat]) groupedFiltered[cat] = []
    groupedFiltered[cat].push(item)
  })

  const totalWeight = items.reduce((sum, i) => sum + (i.weight_oz || 0), 0)

  return (
    <main className="gear-inv-main">
      <div className="trips-top">
        <div>
          <h1>My Gear</h1>
          <p className="trips-count">
            {loading ? 'Loading...' : `${items.length} item${items.length !== 1 ? 's' : ''}${totalWeight > 0 ? ` \u00b7 ${(totalWeight / 16).toFixed(1)} lbs total` : ''}`}
          </p>
        </div>
        <AddGearForm onAdded={handleAdded} />
      </div>

      {!loading && items.length === 0 && (
        <div className="trips-empty">
          <div className="trips-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <path d="M3.27 6.96L12 12.01l8.73-5.05" />
              <path d="M12 22.08V12" />
            </svg>
          </div>
          <h2>No gear yet</h2>
          <p>Add gear you own so you can reference it when planning trips.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <>
          <div className="gear-inv-controls">
            <input
              type="text"
              className="gear-inv-search"
              placeholder="Search gear..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="gear-inv-filters">
              <button
                className={`gear-inv-filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
                onClick={() => setFilterCategory('all')}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`gear-inv-filter-btn ${filterCategory === cat ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {Object.keys(groupedFiltered).length === 0 && (
            <p style={{ color: '#7a6f66', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
              No gear matches your search.
            </p>
          )}

          {Object.entries(groupedFiltered)
            .sort(([a], [b]) => {
              if (a === 'Uncategorized') return 1
              if (b === 'Uncategorized') return -1
              return a.localeCompare(b)
            })
            .map(([cat, catItems]) => (
              <div key={cat} className="gear-inv-category">
                <div className="gear-inv-category-header">
                  <span className="gear-inv-category-name">{cat}</span>
                  <span className="gear-inv-category-count">
                    {catItems.length} item{catItems.length !== 1 ? 's' : ''}
                    {catItems.some(i => i.weight_oz) && (
                      <> &middot; {(catItems.reduce((s, i) => s + (i.weight_oz || 0), 0) / 16).toFixed(1)} lbs</>
                    )}
                  </span>
                </div>
                {catItems.map(item => (
                  <GearRow
                    key={item.id}
                    item={item}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ))
          }
        </>
      )}
    </main>
  )
}
