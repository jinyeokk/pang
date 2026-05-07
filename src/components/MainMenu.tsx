import { useState, useEffect, useCallback } from 'react'

const MENU_ITEMS = ['GAME START', 'HIGH SCORE', 'GAME QUIT'] as const
type MenuItem = typeof MENU_ITEMS[number]

interface Props {
  onStart: () => void
}

function MainMenu({ onStart }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)

  const selectItem = useCallback((item: MenuItem) => {
    if (item === 'GAME START') {
      onStart()
    } else if (item === 'HIGH SCORE') {
      setNotice('준비 중입니다.')
    } else if (item === 'GAME QUIT') {
      setNotice('브라우저 탭을 닫아 종료해주세요.')
    }
  }, [onStart])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
        e.preventDefault()
      }
      if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length)
        setNotice(null)
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev + 1) % MENU_ITEMS.length)
        setNotice(null)
      } else if (e.key === 'Enter') {
        selectItem(MENU_ITEMS[selectedIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, selectItem])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
      {MENU_ITEMS.map((item, index) => {
        const isSelected = selectedIndex === index
        return (
          <div
            key={item}
            onClick={() => {
              setSelectedIndex(index)
              selectItem(item)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontFamily: 'monospace',
              fontSize: '1.4rem',
              letterSpacing: '0.25rem',
              cursor: 'pointer',
              userSelect: 'none',
              padding: '0.4rem 1.2rem',
              borderRadius: '4px',
              color: isSelected ? '#FFD700' : '#aaaadd',
              background: isSelected ? 'rgba(255, 215, 0, 0.08)' : 'transparent',
              border: isSelected ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid transparent',
              textShadow: isSelected ? '0 0 12px #FFD700, 0 0 24px #FFD700aa' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ width: '1.2rem', textAlign: 'center', fontSize: '1rem' }}>
              {isSelected ? '▶' : ''}
            </span>
            {item}
          </div>
        )
      })}

      {notice && (
        <p style={{
          color: '#ff9966',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          marginTop: '0.6rem',
          letterSpacing: '0.1rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          ★ {notice}
        </p>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default MainMenu
