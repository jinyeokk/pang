interface Props {
  score: number
  lives: number
  time: number
}

function HUD({ score, lives, time }: Props) {
  return (
    <div style={{
      height: '50px',
      flexShrink: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      fontFamily: 'monospace',
      color: '#fff',
      userSelect: 'none',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1px' }}>
        <span style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '0.15rem' }}>SCORE</span>
        <span style={{ fontSize: '1rem', letterSpacing: '0.1rem' }}>
          {String(score).padStart(6, '0')}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', fontSize: '1.3rem', color: '#ff6b6b' }}>
        {Array.from({ length: lives }, (_, i) => (
          <span key={i}>♥</span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
        <span style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '0.15rem' }}>TIME</span>
        <span style={{ fontSize: '1rem', letterSpacing: '0.1rem' }}>
          {String(time).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

export default HUD
