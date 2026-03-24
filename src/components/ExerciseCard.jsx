export default function ExerciseCard({ template, exercise, exerciseIndex, onSetUpdate, onSetComplete }) {
  return (
    <div className="exercise-card">
      <div className="exercise-header">
        <h3 className="exercise-name">{template.name}</h3>
        <p className="exercise-cue">{template.cue}</p>
      </div>

      <div className="exercise-video-slot">
        {template.video ? (
          <video src={template.video} autoPlay loop muted playsInline />
        ) : (
          <div className="video-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Demo Video</span>
          </div>
        )}
      </div>

      <div className="sets-log">
        {exercise.sets.map((set, i) => (
          <div key={i} className={`set-card ${set.completed ? 'completed' : ''}`}>
            <div className="set-label">Set {i + 1}</div>
            <div className="set-fields">
              <div className="field">
                <label>lbs</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={set.weight}
                  onChange={(e) => onSetUpdate(exerciseIndex, i, 'weight', e.target.value)}
                  placeholder={set.previousWeight || '\u2014'}
                  disabled={set.completed}
                />
              </div>
              <div className="field">
                <label>Reps</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={set.reps}
                  onChange={(e) => onSetUpdate(exerciseIndex, i, 'reps', e.target.value)}
                  disabled={set.completed}
                />
              </div>
              <button
                className={`check-btn ${set.completed ? 'checked' : ''}`}
                onClick={() => !set.completed && onSetComplete(exerciseIndex, i)}
                disabled={set.completed}
              >
                {set.completed ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : null}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
