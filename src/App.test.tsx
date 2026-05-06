import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('메인 화면에 PANG 타이틀이 렌더링된다', () => {
    render(<App />)
    expect(screen.getByText('PANG')).toBeInTheDocument()
  })

  it('메인 화면에 3개의 메뉴 항목이 렌더링된다', () => {
    render(<App />)
    expect(screen.getByText('GAME START')).toBeInTheDocument()
    expect(screen.getByText('HIGH SCORE')).toBeInTheDocument()
    expect(screen.getByText('GAME QUIT')).toBeInTheDocument()
  })
})
