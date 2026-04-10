import { useAuth } from '../contexts/AuthContext'

export default function AppHeader({ activePage, onNavigate }) {
  const { user, signOut } = useAuth()

  const pages = [
    { id: 'trips', label: 'My Trips' },
    { id: 'gear', label: 'My Gear' },
  ]

  return (
    <header className="app-top-header">
      <div className="app-top-bar">
        <div className="trips-header-left">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7l6-4 6 4 6-4v14l-6 4-6-4-6 4z" />
            <path d="M9 3v14" />
            <path d="M15 7v14" />
          </svg>
          <span className="trips-header-title">Trail Planner</span>
        </div>
        <div className="trips-header-right">
          <span className="trips-header-email">{user?.email}</span>
          <button onClick={signOut} className="btn btn-ghost">Sign Out</button>
        </div>
      </div>
      <nav className="app-nav">
        {pages.map(page => (
          <button
            key={page.id}
            className={`app-nav-tab ${activePage === page.id ? 'active' : ''}`}
            onClick={() => onNavigate(page.id)}
          >
            {page.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
