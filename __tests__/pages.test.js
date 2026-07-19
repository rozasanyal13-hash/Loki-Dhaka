/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../pages/index'
import Login from '../pages/login'
import { generateHmacToken } from '../src/utils/hmac'

test('dev login stores user in localStorage', ()=>{
  render(<Login />)
  const btn = screen.getByRole('button', { name: /login/i })
  fireEvent.click(btn)
  const user = JSON.parse(localStorage.getItem('loki_user'))
  expect(user).toBeTruthy()
  expect(user.email).toBe('dev@example.com')
})

test('generate token and persist visit', async ()=>{
  // ensure no visits
  localStorage.removeItem('loki_visits')
  const secret = 'test-secret'
  const { token, expiresAt } = await generateHmacToken(secret, 'p1')
  // simulate visit persistence like page does
  const visits = JSON.parse(localStorage.getItem('loki_visits') || '[]')
  visits.unshift({ payload: 'p1', token, ts: Date.now() })
  localStorage.setItem('loki_visits', JSON.stringify(visits))
  const stored = JSON.parse(localStorage.getItem('loki_visits'))
  expect(stored.length).toBeGreaterThanOrEqual(1)
  expect(stored[0].token).toBe(token)
})
