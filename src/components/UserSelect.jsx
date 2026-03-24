export default function UserSelect({ onSelect }) {
  return (
    <div className="user-select">
      <div className="user-select-content">
        <h1 className="user-select-title">
          Workout<span className="accent">+</span>
        </h1>
        <p className="user-select-subtitle">Who's training today?</p>
        <div className="user-buttons">
          <button className="user-btn" onClick={() => onSelect('me')}>
            <span className="user-btn-avatar">M</span>
            <span className="user-btn-label">Me</span>
          </button>
          <button className="user-btn" onClick={() => onSelect('dad')}>
            <span className="user-btn-avatar">D</span>
            <span className="user-btn-label">Dad</span>
          </button>
        </div>
      </div>
    </div>
  )
}
