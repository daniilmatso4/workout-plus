import { useState, useEffect, useCallback, useRef } from 'react'
import { WORKOUTS, getWorkoutById } from '../data/workouts'
import { useStorage } from '../hooks/useStorage'
import ExerciseCard from './ExerciseCard'
import RestTimer from './RestTimer'

export default function WorkoutView({ userId }) {
  const {
    history,
    saveWorkout,
    getLastWorkout,
    getTodayCompleted,
    saveProgress,
    loadProgress,
    clearProgress,
  } = useStorage(userId)

  const [activeWorkoutId, setActiveWorkoutId] = useState(null)
  const [session, setSession] = useState(null)
  const [yogaChecks, setYogaChecks] = useState({})
  const [showTimer, setShowTimer] = useState(false)
  const [restDuration, setRestDuration] = useState(60)
  const [completed, setCompleted] = useState(false)
  const completedRef = useRef(false)

  const activeWorkout = activeWorkoutId ? getWorkoutById(activeWorkoutId) : null
  const isYoga = activeWorkout?.type === 'yoga'

  // Initialize lifting session
  useEffect(() => {
    if (!activeWorkout) {
      setSession(null)
      setYogaChecks({})
      setCompleted(false)
      completedRef.current = false
      return
    }

    if (isYoga) {
      // Load yoga checks for today
      const todayDone = getTodayCompleted(activeWorkout.name)
      if (todayDone) {
        setYogaChecks(todayDone.checks || {})
        setCompleted(true)
        completedRef.current = true
      } else {
        const saved = loadProgress()
        if (saved && saved.workoutId === activeWorkoutId) {
          setYogaChecks(saved.checks || {})
        } else {
          setYogaChecks({})
        }
        setCompleted(false)
        completedRef.current = false
      }
      setSession(null)
      return
    }

    // Lifting workout
    const todayDone = getTodayCompleted(activeWorkout.name)
    if (todayDone) {
      setSession(todayDone.exercises)
      setCompleted(true)
      completedRef.current = true
      return
    }

    const saved = loadProgress()
    if (saved && saved.workoutId === activeWorkoutId) {
      setSession(saved.exercises)
      setCompleted(false)
      completedRef.current = false
      return
    }

    const lastWorkout = getLastWorkout(activeWorkout.name)
    const newSession = activeWorkout.exercises.map((ex, i) => ({
      id: ex.id,
      name: ex.name,
      sets: Array.from({ length: ex.sets }, (_, j) => ({
        targetReps: ex.reps,
        reps: ex.reps,
        weight: lastWorkout?.exercises[i]?.sets[j]?.weight || '',
        previousWeight: lastWorkout?.exercises[i]?.sets[j]?.weight || '',
        completed: false,
      })),
    }))
    setSession(newSession)
    setCompleted(false)
    completedRef.current = false
  }, [activeWorkoutId, userId])

  // Auto-save lifting progress
  useEffect(() => {
    if (session && activeWorkoutId && !completedRef.current && !isYoga) {
      saveProgress({ workoutId: activeWorkoutId, exercises: session })
    }
  }, [session])

  // Auto-save yoga progress
  useEffect(() => {
    if (isYoga && activeWorkoutId && !completedRef.current) {
      saveProgress({ workoutId: activeWorkoutId, checks: yogaChecks })
    }
  }, [yogaChecks])

  const handleSetUpdate = useCallback((exIdx, setIdx, field, value) => {
    setSession((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : { ...ex, sets: ex.sets.map((s, j) => (j !== setIdx ? s : { ...s, [field]: value })) }
      )
    )
  }, [])

  const handleSetComplete = useCallback(
    (exIdx, setIdx) => {
      setSession((prev) => {
        const next = prev.map((ex, i) =>
          i !== exIdx
            ? ex
            : { ...ex, sets: ex.sets.map((s, j) => (j !== setIdx ? s : { ...s, completed: true })) }
        )

        const allDone = next.every((ex) => ex.sets.every((s) => s.completed))
        if (allDone && !completedRef.current) {
          completedRef.current = true
          setCompleted(true)
          saveWorkout({
            date: new Date().toISOString().split('T')[0],
            workoutId: activeWorkoutId,
            dayName: activeWorkout.name,
            exercises: next,
            completed: true,
            completedAt: new Date().toISOString(),
          })
          clearProgress()
        } else if (!allDone) {
          setShowTimer(true)
        }

        return next
      })
    },
    [activeWorkout, activeWorkoutId, saveWorkout, clearProgress]
  )

  const handleYogaToggle = (itemId) => {
    if (completedRef.current) return
    setYogaChecks((prev) => ({ ...prev, [itemId]: !prev[itemId] }))
  }

  const handleYogaDone = () => {
    completedRef.current = true
    setCompleted(true)
    saveWorkout({
      date: new Date().toISOString().split('T')[0],
      workoutId: activeWorkoutId,
      dayName: activeWorkout.name,
      checks: yogaChecks,
      completed: true,
      completedAt: new Date().toISOString(),
    })
    clearProgress()
  }

  const handleStartFresh = () => {
    completedRef.current = false
    setCompleted(false)
    clearProgress()
    if (isYoga) {
      setYogaChecks({})
      return
    }
    const lastWorkout = getLastWorkout(activeWorkout.name)
    const newSession = activeWorkout.exercises.map((ex, i) => ({
      id: ex.id,
      name: ex.name,
      sets: Array.from({ length: ex.sets }, (_, j) => ({
        targetReps: ex.reps,
        reps: ex.reps,
        weight: lastWorkout?.exercises[i]?.sets[j]?.weight || '',
        previousWeight: lastWorkout?.exercises[i]?.sets[j]?.weight || '',
        completed: false,
      })),
    }))
    setSession(newSession)
  }

  const handleBack = () => setActiveWorkoutId(null)

  // Progress
  const progress = session
    ? (() => {
        const total = session.reduce((sum, ex) => sum + ex.sets.length, 0)
        const done = session.reduce((sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0)
        return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
      })()
    : { total: 0, done: 0, percent: 0 }

  const yogaProgress = isYoga && activeWorkout
    ? (() => {
        const total = activeWorkout.items.length
        const done = Object.values(yogaChecks).filter(Boolean).length
        return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
      })()
    : { total: 0, done: 0, percent: 0 }

  // ── Category picker ──
  if (!activeWorkoutId) {
    const liftingWorkouts = WORKOUTS.filter((w) => w.type === 'lifting')
    const yogaWorkout = WORKOUTS.find((w) => w.type === 'yoga')

    return (
      <div className="category-picker">
        <h2 className="picker-title">Start Workout</h2>
        <p className="picker-subtitle">PPL / Upper Lower</p>
        <div className="category-grid">
          {liftingWorkouts.map((w) => {
            const todayDone = getTodayCompleted(w.name)
            return (
              <button
                key={w.id}
                className={`category-card ${todayDone ? 'done' : ''}`}
                onClick={() => setActiveWorkoutId(w.id)}
              >
                <div className="category-dot" style={{ background: w.color }} />
                <span className="category-name">{w.name}</span>
                <span className="category-count">{w.exercises.length} exercises</span>
                {todayDone && <span className="category-done-badge">Done</span>}
              </button>
            )
          })}
        </div>

        {yogaWorkout && (
          <>
            <div className="picker-divider" />
            <button
              className={`yoga-card ${getTodayCompleted(yogaWorkout.name) ? 'done' : ''}`}
              onClick={() => setActiveWorkoutId(yogaWorkout.id)}
            >
              <div className="yoga-card-left">
                <div className="category-dot" style={{ background: yogaWorkout.color }} />
                <div>
                  <span className="category-name">{yogaWorkout.name}</span>
                  <span className="yoga-subtitle">{yogaWorkout.subtitle}</span>
                </div>
              </div>
              {getTodayCompleted(yogaWorkout.name) ? (
                <span className="category-done-badge">Done</span>
              ) : (
                <span className="category-count">{yogaWorkout.items.length} poses</span>
              )}
            </button>
          </>
        )}
      </div>
    )
  }

  // ── Workout complete ──
  if (completed) {
    const totalWeight = !isYoga && session
      ? session.reduce(
          (sum, ex) => sum + ex.sets.reduce((s, set) => s + (Number(set.weight) || 0), 0),
          0
        )
      : 0

    return (
      <div className="workout-complete">
        <div className="complete-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="80" height="80">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-5" />
          </svg>
        </div>
        <h2>{isYoga ? 'Yoga Complete' : 'Workout Complete'}</h2>
        <p className="complete-text">
          {activeWorkout.name}
          {isYoga ? ' with Mom — namaste.' : ' — crushed it.'}
        </p>
        {!isYoga && (
          <div className="complete-stats">
            <div className="stat">
              <span className="stat-value">{progress.total}</span>
              <span className="stat-label">Sets</span>
            </div>
            {totalWeight > 0 && (
              <div className="stat">
                <span className="stat-value">{totalWeight.toLocaleString()}</span>
                <span className="stat-label">Total lbs</span>
              </div>
            )}
          </div>
        )}
        <div className="complete-actions">
          <button className="start-fresh-btn" onClick={handleStartFresh}>
            {isYoga ? 'Do Again' : 'Repeat Workout'}
          </button>
          <button className="back-btn-alt" onClick={handleBack}>
            Back to Workouts
          </button>
        </div>
      </div>
    )
  }

  // ── Yoga checklist ──
  if (isYoga) {
    return (
      <div className="workout-view">
        <div className="workout-top-bar">
          <button className="back-btn" onClick={handleBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="workout-top-info">
            <h2 className="workout-name">{activeWorkout.name}</h2>
            <span className="workout-subtitle">{activeWorkout.subtitle}</span>
          </div>
          <div className="workout-top-spacer" />
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${yogaProgress.percent}%`, background: activeWorkout.color }}
            />
          </div>
          <span className="progress-text">
            {yogaProgress.done}/{yogaProgress.total}
          </span>
        </div>

        <div className="yoga-checklist">
          {activeWorkout.items.map((item) => (
            <button
              key={item.id}
              className={`yoga-item ${yogaChecks[item.id] ? 'checked' : ''}`}
              onClick={() => handleYogaToggle(item.id)}
            >
              <div className={`yoga-check ${yogaChecks[item.id] ? 'checked' : ''}`}>
                {yogaChecks[item.id] && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className="yoga-item-info">
                <span className="yoga-item-name">{item.name}</span>
                <span className="yoga-item-note">{item.note}</span>
              </div>
            </button>
          ))}
        </div>

        {yogaProgress.done > 0 && (
          <button className="yoga-done-btn" onClick={handleYogaDone}>
            Mark Yoga as Done
          </button>
        )}
      </div>
    )
  }

  // ── Lifting workout ──
  if (!session) return null

  return (
    <div className="workout-view">
      <div className="workout-top-bar">
        <button className="back-btn" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="workout-top-info">
          <h2 className="workout-name">{activeWorkout.name}</h2>
        </div>
        <div className="workout-top-spacer" />
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress.percent}%`, background: activeWorkout.color }}
          />
        </div>
        <span className="progress-text">
          {progress.done}/{progress.total}
        </span>
      </div>

      <div className="rest-duration-control">
        <label>Rest:</label>
        <div className="duration-buttons">
          {[30, 45, 60, 90, 120].map((d) => (
            <button
              key={d}
              className={`duration-btn ${restDuration === d ? 'active' : ''}`}
              onClick={() => setRestDuration(d)}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      <div className="exercises">
        {activeWorkout.exercises.map((templateEx, i) =>
          session[i] ? (
            <ExerciseCard
              key={templateEx.id}
              template={templateEx}
              exercise={session[i]}
              exerciseIndex={i}
              onSetUpdate={handleSetUpdate}
              onSetComplete={handleSetComplete}
              accentColor={activeWorkout.color}
            />
          ) : null
        )}
      </div>

      {showTimer && (
        <RestTimer
          duration={restDuration}
          onComplete={() => setShowTimer(false)}
          onSkip={() => setShowTimer(false)}
        />
      )}
    </div>
  )
}
