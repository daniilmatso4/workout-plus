const EXERCISE_MUSCLES = {
  'bench-press':     { primary: ['chest'], secondary: ['front-delt', 'tricep'] },
  'bench-press-u':   { primary: ['chest'], secondary: ['front-delt', 'tricep'] },
  'incline-db-press':{ primary: ['chest', 'front-delt'], secondary: ['tricep'] },
  'cable-fly':       { primary: ['chest'], secondary: [] },
  'ohp':             { primary: ['front-delt'], secondary: ['tricep', 'upper-back'] },
  'ohp-u':           { primary: ['front-delt'], secondary: ['tricep', 'upper-back'] },
  'lateral-raise':   { primary: ['front-delt'], secondary: [] },
  'tricep-pushdown': { primary: ['tricep'], secondary: [] },
  'tricep-pushdown-u':{ primary: ['tricep'], secondary: [] },
  'overhead-tri-ext':{ primary: ['tricep'], secondary: [] },
  'barbell-row':     { primary: ['lats', 'upper-back'], secondary: ['bicep', 'rear-delt'] },
  'barbell-row-u':   { primary: ['lats', 'upper-back'], secondary: ['bicep', 'rear-delt'] },
  'lat-pulldown':    { primary: ['lats'], secondary: ['bicep', 'rear-delt'] },
  'lat-pulldown-u':  { primary: ['lats'], secondary: ['bicep', 'rear-delt'] },
  'seated-cable-row':{ primary: ['lats', 'upper-back'], secondary: ['bicep'] },
  'face-pull':       { primary: ['rear-delt', 'upper-back'], secondary: [] },
  'barbell-curl':    { primary: ['bicep'], secondary: ['forearm'] },
  'hammer-curl':     { primary: ['bicep', 'forearm'], secondary: [] },
  'db-curl-u':       { primary: ['bicep'], secondary: ['forearm'] },
  'squat':           { primary: ['quad', 'glute'], secondary: ['hamstring', 'core'] },
  'squat-l':         { primary: ['quad', 'glute'], secondary: ['hamstring', 'core'] },
  'rdl':             { primary: ['hamstring', 'glute'], secondary: ['lower-back'] },
  'rdl-l':           { primary: ['hamstring', 'glute'], secondary: ['lower-back'] },
  'leg-press':       { primary: ['quad'], secondary: ['glute'] },
  'walking-lunge':   { primary: ['quad', 'glute'], secondary: ['hamstring'] },
  'bulgarian-split': { primary: ['quad', 'glute'], secondary: ['hamstring'] },
  'leg-curl':        { primary: ['hamstring'], secondary: [] },
  'leg-curl-l':      { primary: ['hamstring'], secondary: [] },
  'leg-ext-l':       { primary: ['quad'], secondary: [] },
  'calf-raise':      { primary: ['calf'], secondary: [] },
  'calf-raise-l':    { primary: ['calf'], secondary: [] },
}

// Front figure (cx=80) — muscle ellipse positions
const FRONT = {
  'chest':      [{ cx:71, cy:48, rx:9, ry:7 }, { cx:89, cy:48, rx:9, ry:7 }],
  'front-delt': [{ cx:56, cy:38, rx:7, ry:6 }, { cx:104, cy:38, rx:7, ry:6 }],
  'bicep':      [{ cx:52, cy:56, rx:5, ry:11 }, { cx:108, cy:56, rx:5, ry:11 }],
  'forearm':    [{ cx:50, cy:76, rx:4, ry:10 }, { cx:110, cy:76, rx:4, ry:10 }],
  'core':       [{ cx:80, cy:66, rx:8, ry:10 }],
  'quad':       [{ cx:72, cy:102, rx:7, ry:18 }, { cx:88, cy:102, rx:7, ry:18 }],
}

// Back figure (cx=220) — muscle ellipse positions
const BACK = {
  'upper-back': [{ cx:220, cy:42, rx:14, ry:7 }],
  'rear-delt':  [{ cx:196, cy:38, rx:7, ry:6 }, { cx:244, cy:38, rx:7, ry:6 }],
  'lats':       [{ cx:210, cy:56, rx:9, ry:12 }, { cx:230, cy:56, rx:9, ry:12 }],
  'tricep':     [{ cx:192, cy:56, rx:5, ry:11 }, { cx:248, cy:56, rx:5, ry:11 }],
  'lower-back': [{ cx:220, cy:72, rx:8, ry:6 }],
  'glute':      [{ cx:212, cy:88, rx:8, ry:7 }, { cx:228, cy:88, rx:8, ry:7 }],
  'hamstring':  [{ cx:212, cy:110, rx:7, ry:17 }, { cx:228, cy:110, rx:7, ry:17 }],
  'calf':       [{ cx:210, cy:144, rx:5, ry:11 }, { cx:230, cy:144, rx:5, ry:11 }],
}

function BodyFront({ cx }) {
  return (
    <g fill="#1e1e2e">
      <circle cx={cx} cy={16} r={10} />
      <rect x={cx-3} y={26} width={6} height={5} rx={2} />
      <rect x={cx-21} y={33} width={42} height={48} rx={8} />
      <rect x={cx-32} y={35} width={11} height={30} rx={5} />
      <rect x={cx-30} y={65} width={9} height={26} rx={4} />
      <rect x={cx+21} y={35} width={11} height={30} rx={5} />
      <rect x={cx+21} y={65} width={9} height={26} rx={4} />
      <rect x={cx-17} y={81} width={14} height={42} rx={7} />
      <rect x={cx-15} y={123} width={10} height={36} rx={5} />
      <rect x={cx+3} y={81} width={14} height={42} rx={7} />
      <rect x={cx+5} y={123} width={10} height={36} rx={5} />
    </g>
  )
}

function BodyBack({ cx }) {
  return (
    <g fill="#1e1e2e">
      <circle cx={cx} cy={16} r={10} />
      <rect x={cx-3} y={26} width={6} height={5} rx={2} />
      <rect x={cx-21} y={33} width={42} height={48} rx={8} />
      <rect x={cx-32} y={35} width={11} height={30} rx={5} />
      <rect x={cx-30} y={65} width={9} height={26} rx={4} />
      <rect x={cx+21} y={35} width={11} height={30} rx={5} />
      <rect x={cx+21} y={65} width={9} height={26} rx={4} />
      <rect x={cx-17} y={81} width={14} height={42} rx={7} />
      <rect x={cx-15} y={123} width={10} height={36} rx={5} />
      <rect x={cx+3} y={81} width={14} height={42} rx={7} />
      <rect x={cx+5} y={123} width={10} height={36} rx={5} />
    </g>
  )
}

export default function MuscleMap({ exerciseId, color = '#6366f1' }) {
  const info = EXERCISE_MUSCLES[exerciseId] || { primary: [], secondary: [] }

  const getStyle = (group) => {
    if (info.primary.includes(group)) return { fill: color, opacity: 0.9 }
    if (info.secondary.includes(group)) return { fill: color, opacity: 0.25 }
    return null
  }

  const isPrimary = (group) => info.primary.includes(group)

  return (
    <div className="muscle-map">
      <svg viewBox="0 0 300 180" className="muscle-svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bodies */}
        <BodyFront cx={80} />
        <BodyBack cx={220} />

        {/* Front muscles */}
        {Object.entries(FRONT).map(([group, spots]) => {
          const style = getStyle(group)
          if (!style) return null
          return spots.map((s, i) => (
            <ellipse
              key={`f-${group}-${i}`}
              cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry}
              fill={style.fill}
              opacity={style.opacity}
              filter={isPrimary(group) ? 'url(#glow)' : undefined}
              className={isPrimary(group) ? 'muscle-pulse' : ''}
            />
          ))
        })}

        {/* Back muscles */}
        {Object.entries(BACK).map(([group, spots]) => {
          const style = getStyle(group)
          if (!style) return null
          return spots.map((s, i) => (
            <ellipse
              key={`b-${group}-${i}`}
              cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry}
              fill={style.fill}
              opacity={style.opacity}
              filter={isPrimary(group) ? 'url(#glow)' : undefined}
              className={isPrimary(group) ? 'muscle-pulse' : ''}
            />
          ))
        })}

        {/* Labels */}
        <text x={80} y={172} textAnchor="middle" className="body-label">FRONT</text>
        <text x={220} y={172} textAnchor="middle" className="body-label">BACK</text>
      </svg>
    </div>
  )
}
