import MainMenu from '../components/MainMenu'

interface Props {
  onStart: () => void
}

const BUBBLES = [
  { size: 80,  left: 8,  duration: 7,  delay: 0,   color: 'rgba(255, 100, 100, 0.35)' },
  { size: 50,  left: 20, duration: 9,  delay: 1.5, color: 'rgba(100, 200, 255, 0.35)' },
  { size: 110, left: 40, duration: 11, delay: 0.5, color: 'rgba(255, 220, 80,  0.30)' },
  { size: 60,  left: 62, duration: 8,  delay: 2,   color: 'rgba(180, 100, 255, 0.35)' },
  { size: 90,  left: 78, duration: 10, delay: 0.8, color: 'rgba(80,  255, 160, 0.30)' },
  { size: 40,  left: 90, duration: 6,  delay: 3,   color: 'rgba(255, 140, 60,  0.35)' },
]

function MainScreen({ onStart }: Props) {
  return (
    <div style={{
      background: 'radial-gradient(ellipse at 50% 40%, #2e2e7a 0%, #1a1a4e 60%, #0d0d2e 100%)',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '3rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* 배경 장식 버블 */}
      {BUBBLES.map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: '-120px',
          left: `${b.left}%`,
          width: `${b.size}px`,
          height: `${b.size}px`,
          borderRadius: '50%',
          background: b.color,
          border: `2px solid ${b.color.replace('0.3', '0.6').replace('0.35', '0.6')}`,
          animation: `floatUp ${b.duration}s ${b.delay}s ease-in infinite`,
        }} />
      ))}

      {/* 타이틀 */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <h1 style={{
          fontFamily: 'monospace',
          fontSize: '6rem',
          fontWeight: 'bold',
          letterSpacing: '1rem',
          margin: 0,
          animation: 'titleColor 3s linear infinite',
        }}>
          PANG
        </h1>
        <p style={{
          color: '#8888cc',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          letterSpacing: '0.3rem',
          margin: '0.5rem 0 0',
        }}>
          © 1989 MITCHELL CORP
        </p>
      </div>

      {/* 메뉴 */}
      <div style={{ zIndex: 1 }}>
        <MainMenu onStart={onStart} />
      </div>

      {/* 하단 안내 */}
      <p style={{
        color: '#6666aa',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        letterSpacing: '0.15rem',
        animation: 'blink 1s step-end infinite',
        zIndex: 1,
      }}>
        PRESS ENTER TO SELECT
      </p>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes titleColor {
          0%   { color: #ff6ec7; text-shadow: 0 0 20px #ff6ec7, 0 0 40px #ff6ec7; }
          25%  { color: #ffe566; text-shadow: 0 0 20px #ffe566, 0 0 40px #ffe566; }
          50%  { color: #6ef9ff; text-shadow: 0 0 20px #6ef9ff, 0 0 40px #6ef9ff; }
          75%  { color: #a0ff6e; text-shadow: 0 0 20px #a0ff6e, 0 0 40px #a0ff6e; }
          100% { color: #ff6ec7; text-shadow: 0 0 20px #ff6ec7, 0 0 40px #ff6ec7; }
        }

        @keyframes floatUp {
          0%   { transform: translateY(0)   scale(1);    opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-110vh) scale(0.6); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default MainScreen
