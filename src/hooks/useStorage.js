import { useState, useCallback, useEffect } from 'react'

const PREFIX = 'workoutplus'

function load(userId) {
  try {
    const raw = localStorage.getItem(`${PREFIX}_${userId}`)
    return raw ? JSON.parse(raw) : { history: [] }
  } catch {
    return { history: [] }
  }
}

function persist(userId, data) {
  localStorage.setItem(`${PREFIX}_${userId}`, JSON.stringify(data))
}

export function useStorage(userId) {
  const [data, setData] = useState(() => load(userId))

  useEffect(() => {
    setData(load(userId))
  }, [userId])

  const saveWorkout = useCallback((workout) => {
    setData((prev) => {
      const updated = { ...prev, history: [...prev.history, workout] }
      persist(userId, updated)
      return updated
    })
  }, [userId])

  const getLastWorkout = useCallback(
    (dayName) => {
      const matches = data.history.filter((w) => w.dayName === dayName && w.completed)
      return matches.length > 0 ? matches[matches.length - 1] : null
    },
    [data.history]
  )

  const getTodayCompleted = useCallback(
    (dayName) => {
      const today = new Date().toISOString().split('T')[0]
      return data.history.find((w) => w.date === today && w.dayName === dayName && w.completed) || null
    },
    [data.history]
  )

  const saveProgress = useCallback(
    (session) => {
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem(`${PREFIX}_progress_${userId}`, JSON.stringify({ date: today, ...session }))
    },
    [userId]
  )

  const loadProgress = useCallback(() => {
    try {
      const raw = localStorage.getItem(`${PREFIX}_progress_${userId}`)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      const today = new Date().toISOString().split('T')[0]
      return parsed.date === today ? parsed : null
    } catch {
      return null
    }
  }, [userId])

  const clearProgress = useCallback(() => {
    localStorage.removeItem(`${PREFIX}_progress_${userId}`)
  }, [userId])

  return {
    history: data.history,
    saveWorkout,
    getLastWorkout,
    getTodayCompleted,
    saveProgress,
    loadProgress,
    clearProgress,
  }
}
