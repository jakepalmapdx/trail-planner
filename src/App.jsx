import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import AuthPage from './pages/AuthPage'
import TripsPage from './pages/TripsPage'
import TripView from './pages/TripView'
import GearInventoryPage from './pages/GearInventoryPage'
import AppHeader from './components/AppHeader'
import './App.css'

function App() {
  const { user, loading, signOut } = useAuth()
  const [activePage, setActivePage] = useState('trips')
  const [activeTrip, setActiveTrip] = useState(null)

  if (loading) {
    return (
      <div className="loading-screen">
        <span>Loading...</span>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  if (activeTrip) {
    return (
      <TripView
        trip={activeTrip}
        onBack={() => setActiveTrip(null)}
        user={user}
        onSignOut={signOut}
      />
    )
  }

  return (
    <div className="trips-page">
      <AppHeader activePage={activePage} onNavigate={setActivePage} />
      {activePage === 'trips' && <TripsPage onOpenTrip={setActiveTrip} />}
      {activePage === 'gear' && <GearInventoryPage />}
    </div>
  )
}

export default App
