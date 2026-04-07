import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import useLocalStorage from './hooks/useLocalStorage'
import { trails } from './data/trails'
import Header from './components/Header'
import GearList from './components/GearList'
import CostCalculator from './components/CostCalculator'
import FoodPlanner from './components/FoodPlanner'
import AuthPage from './pages/AuthPage'
import './App.css'

function App() {
  const { user, loading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('gear')
  const [selectedTrail, setSelectedTrail] = useLocalStorage(
    'selectedTrail',
    trails[0].id
  )
  const [gearData, setGearData] = useLocalStorage(
    'gearData',
    trails[0].gearCategories
  )

  const trail = trails.find(t => t.id === selectedTrail)

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

  return (
    <div className="app">
      <Header
        trail={trail}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onSignOut={signOut}
      />
      {activeTab === 'gear' && (
        <GearList
          categories={gearData}
          setCategories={setGearData}
        />
      )}
      {activeTab === 'cost' && (
        <CostCalculator />
      )}
      {activeTab === 'food' && (
        <FoodPlanner />
      )}
    </div>
  )
}

export default App
