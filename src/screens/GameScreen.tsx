import { useEffect } from 'react'
import HUD from '../components/HUD'

interface Props {
  onBack: () => void
}

function GameScreen({ onBack }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onBack])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <HUD score={0} lives={3} time={60} />

      {/* 게임 영역 */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: 'linear-gradient(to bottom, #4a90d9 0%, #87ceeb 60%, #b0e0f0 100%)',
        overflow: 'hidden',
      }}>
        {/* 바닥선 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: '#888',
        }} />
      </div>
    </div>
  )
}

export default GameScreen
