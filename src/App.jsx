import { useState } from 'react'
import UserSelect from './components/UserSelect'
import WorkoutView from './components/WorkoutView'
import History from './components/History'
import Export from './components/Export'

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('workoutplus_user') || null)
  const [view, setView] = useState('today')

  const selectUser = (u) => {
    setUser(u)
    localStorage.setItem('workoutplus_user', u)
  }

  const switchUser = () => {
    setUser(null)
    localStorage.removeItem('workoutplus_user')
    setView('today')
  }

  if (!user) return <UserSelect onSelect={selectUser} />

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Workout<span className="accent">+</span></h1>
        <button className="user-badge" onClick={switchUser}>
          <span className="user-avatar">{user === 'me' ? 'M' : 'D'}</span>
          <span>{user === 'me' ? 'Me' : 'Dad'}</span>
        </button>
      </header>

      <main className="app-main">
        {view === 'today' && <WorkoutView userId={user} />}
        {view === 'history' && <History userId={user} />}
        {view === 'export' && <Export userId={user} />}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-btn ${view === 'today' ? 'active' : ''}`} onClick={() => setView('today')}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span>Workout</span>
        </button>
        <button className={`nav-btn ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>History</span>
        </button>
        <button className={`nav-btn ${view === 'export' ? 'active' : ''}`} onClick={() => setView('export')}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export</span>
        </button>
      </nav>
    </div>
  )
}
