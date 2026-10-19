// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import React from 'react'
import { describe, test, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'

// Covers the phone navigation: below the md breakpoint the sidebar becomes a
// drawer opened from the top bar. jsdom applies no media queries, so these
// tests check the drawer state and accessibility attributes rather than
// what is visible at a given width.

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { email: 'admin@school.test', _profileName: 'Test Admin' },
    userRole: 'School Admin',
    logout: vi.fn(),
    isCompanyAdmin: false,
    isSchoolAdmin: true,
    isStaff: false,
  }),
}))

vi.mock('../api/client', () => ({
  getIncidentById: vi.fn(),
}))

afterEach(() => {
  cleanup()
  localStorage.clear()
})

function renderLayout(path = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<Layout><p>Page content</p></Layout>} />
      </Routes>
    </MemoryRouter>
  )
}

const sidebar = () => document.getElementById('app-sidebar')
const openButton = () => screen.getByRole('button', { name: 'Open menu' })

describe('Layout navigation on small screens', () => {
  test('starts with the drawer closed', () => {
    renderLayout()

    expect(openButton()).toHaveAttribute('aria-expanded', 'false')
    expect(openButton()).toHaveAttribute('aria-controls', 'app-sidebar')
    expect(sidebar()).toHaveClass('-translate-x-full')
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  test('the menu button opens the drawer', () => {
    renderLayout()

    fireEvent.click(openButton())

    expect(openButton()).toHaveAttribute('aria-expanded', 'true')
    expect(sidebar()).toHaveClass('translate-x-0')
    expect(sidebar()).not.toHaveClass('-translate-x-full')
  })

  test('the close button closes the drawer', () => {
    renderLayout()
    fireEvent.click(openButton())

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))

    expect(sidebar()).toHaveClass('-translate-x-full')
  })

  test('tapping outside the drawer closes it', () => {
    const { container } = renderLayout()
    fireEvent.click(openButton())

    fireEvent.click(container.querySelector('.bg-black\\/40'))

    expect(sidebar()).toHaveClass('-translate-x-full')
    expect(container.querySelector('.bg-black\\/40')).not.toBeInTheDocument()
  })

  test('Escape closes the drawer', () => {
    renderLayout()
    fireEvent.click(openButton())

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(sidebar()).toHaveClass('-translate-x-full')
  })

  test('choosing a page closes the drawer', () => {
    renderLayout()
    fireEvent.click(openButton())

    fireEvent.click(screen.getByRole('link', { name: 'Incidents' }))

    expect(sidebar()).toHaveClass('-translate-x-full')
  })

  test('the drawer still lists the role\'s pages and the account footer', () => {
    renderLayout()

    expect(screen.getByRole('link', { name: 'Setup' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Notifications' })).toBeInTheDocument()
    expect(screen.getByText('Test Admin')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })
})
