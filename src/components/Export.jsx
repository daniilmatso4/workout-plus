import { useStorage } from '../hooks/useStorage'

function buildCSV(history, userName) {
  const rows = [['User', 'Date', 'Workout', 'Exercise', 'Set', 'Weight (lbs)', 'Reps', 'Completed']]

  history.forEach((workout) => {
    if (!workout.exercises) return
    workout.exercises.forEach((ex) => {
      ex.sets.forEach((set, i) => {
        rows.push([
          userName,
          workout.date,
          workout.dayName,
          ex.name,
          i + 1,
          set.weight || 'BW',
          set.reps,
          set.completed ? 'Yes' : 'No',
        ])
      })
    })
  })

  return rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function Export({ userId }) {
  const { history } = useStorage(userId)
  const userName = userId === 'me' ? 'Me' : 'Dad'

  const handleExportMine = () => {
    const csv = buildCSV(history, userName)
    downloadCSV(csv, `workout-plus-${userId}.csv`)
  }

  const handleExportAll = () => {
    const meData = JSON.parse(localStorage.getItem('workoutplus_me') || '{"history":[]}')
    const dadData = JSON.parse(localStorage.getItem('workoutplus_dad') || '{"history":[]}')

    const allRows = [['User', 'Date', 'Workout', 'Exercise', 'Set', 'Weight (lbs)', 'Reps', 'Completed']]

    const addRows = (hist, name) => {
      hist.forEach((workout) => {
        if (!workout.exercises) return
        workout.exercises.forEach((ex) => {
          ex.sets.forEach((set, i) => {
            allRows.push([
              name,
              workout.date,
              workout.dayName,
              ex.name,
              i + 1,
              set.weight || 'BW',
              set.reps,
              set.completed ? 'Yes' : 'No',
            ])
          })
        })
      })
    }

    addRows(meData.history, 'Me')
    addRows(dadData.history, 'Dad')

    const csv = allRows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    downloadCSV(csv, 'workout-plus-all.csv')
  }

  const handleOpenInSheets = () => {
    const meData = JSON.parse(localStorage.getItem('workoutplus_me') || '{"history":[]}')
    const dadData = JSON.parse(localStorage.getItem('workoutplus_dad') || '{"history":[]}')

    const allRows = [['User', 'Date', 'Workout', 'Exercise', 'Set', 'Weight (lbs)', 'Reps', 'Completed']]

    const addRows = (hist, name) => {
      hist.forEach((workout) => {
        if (!workout.exercises) return
        workout.exercises.forEach((ex) => {
          ex.sets.forEach((set, i) => {
            allRows.push([
              name,
              workout.date,
              workout.dayName,
              ex.name,
              i + 1,
              set.weight || 'BW',
              set.reps,
              set.completed ? 'Yes' : 'No',
            ])
          })
        })
      })
    }

    addRows(meData.history, 'Me')
    addRows(dadData.history, 'Dad')

    const csv = allRows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      // Open Google Sheets import
      const url = `https://docs.google.com/spreadsheets/d/e/create?usp=sharing`
      // Fallback: download CSV then user uploads to sheets
      downloadCSV(csv, 'workout-plus-all.csv')
      window.open('https://sheets.google.com', '_blank')
    }
    reader.readAsDataURL(blob)
  }

  const totalWorkouts = history.filter((w) => w.completed).length

  return (
    <div className="export-view">
      <h2>Export Data</h2>
      <p className="export-subtitle">
        {totalWorkouts} completed workout{totalWorkouts !== 1 ? 's' : ''} logged
      </p>

      <div className="export-cards">
        <button className="export-card" onClick={handleExportMine}>
          <div className="export-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div className="export-card-info">
            <span className="export-card-title">Export My Data</span>
            <span className="export-card-desc">Download {userName}'s workouts as CSV</span>
          </div>
        </button>

        <button className="export-card" onClick={handleExportAll}>
          <div className="export-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="export-card-info">
            <span className="export-card-title">Export All Data</span>
            <span className="export-card-desc">Both Me + Dad in one file</span>
          </div>
        </button>

        <button className="export-card sheets" onClick={handleOpenInSheets}>
          <div className="export-card-icon sheets-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          </div>
          <div className="export-card-info">
            <span className="export-card-title">Open in Google Sheets</span>
            <span className="export-card-desc">Downloads CSV + opens Sheets to import</span>
          </div>
        </button>
      </div>
    </div>
  )
}
