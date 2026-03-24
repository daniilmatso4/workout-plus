import { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function History({ userId }) {
  const { history } = useStorage(userId)
  const [expanded, setExpanded] = useState(null)

  const sorted = [...history].reverse()

  if (sorted.length === 0) {
    return (
      <div className="history-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" style={{ opacity: 0.3, marginBottom: 16 }}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <p>No workouts logged yet.</p>
        <p>Complete your first workout to see it here.</p>
      </div>
    )
  }

  return (
    <div className="history">
      <h2>Workout History</h2>
      {sorted.map((workout, i) => (
        <div
          key={i}
          className="history-card"
          onClick={() => setExpanded(expanded === i ? null : i)}
        >
          <div className="history-header">
            <div>
              <div className="history-name">{workout.dayName}</div>
              <div className="history-date">{formatDate(workout.date)}</div>
            </div>
            <span className={`history-status ${workout.completed ? 'completed' : ''}`}>
              {workout.completed ? 'Complete' : 'Partial'}
            </span>
          </div>
          {expanded === i && (
            <div className="history-detail">
              {workout.exercises.map((ex, j) => (
                <div key={j} className="history-exercise">
                  <div className="history-exercise-name">{ex.name}</div>
                  <div className="history-sets">
                    {ex.sets.map((set, k) => (
                      <span key={k} className={`history-set ${set.completed ? 'done' : ''}`}>
                        S{k + 1}: {set.weight ? `${set.weight} lbs` : 'BW'} x{set.reps}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
