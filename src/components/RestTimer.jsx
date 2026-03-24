import { useState, useEffect } from 'react'

const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function RestTimer({ duration, onComplete, onSkip }) {
  const [remaining, setRemaining] = useState(duration)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [duration, onComplete])

  const progress = remaining / duration
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="rest-timer-overlay" onClick={onSkip}>
      <div className="rest-timer" onClick={(e) => e.stopPropagation()}>
        <div className="timer-display">
          <svg className="timer-ring" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={RADIUS} className="timer-bg" />
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              className="timer-progress"
              style={{
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset: dashOffset,
              }}
            />
          </svg>
          <div className="timer-center">
            <div className="timer-time">{remaining}</div>
            <div className="timer-label">seconds</div>
          </div>
        </div>
        <button className="timer-skip" onClick={onSkip}>
          Skip Rest
        </button>
      </div>
    </div>
  )
}
