
// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import React from 'react'
import { describe, test, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

afterEach(() => {
  cleanup()
  sessionStorage.clear()
})

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { email: 'admin@school.edu' },
    userRole: 'Company Admin',
    isCompanyAdmin: true,
    isSchoolAdmin: false,
    isStaff: false,
    isAdmin: true,
    authLoading: false,
  }),
}))

vi.mock('../context/SchoolsContext', () => ({
  useSchools: () => ({
    schools: [],
  }),
}))

vi.mock('../api/client', () => ({
  incidentAPI: {
    list: vi.fn(() =>
      Promise.resolve([
        {
          id: '1',
          title: 'Fire Alert',
          type: 'fire',
          status: 'triggered',
          location: 'Science Block',
          priority: 'high',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Medical Emergency',
          type: 'medical',
          status: 'acknowledged',
          location: 'Library',
          priority: 'medium',
          isTest: true,
          createdAt: new Date().toISOString(),
        },
      ])
    ),
  },
  settingsAPI: {
    get: vi.fn(() =>
      Promise.resolve({ overdueThresholdMinutes: 15 })
    ),
  },
}))

async function renderDashboard() {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  )

  await screen.findByRole('heading', {
    name: 'Dashboard',
    level: 1,
  })
}

describe('SCRUM-25: Dashboard data sources and explanations', () => {
  test('shows the data source and category for triggered alerts', async () => {
    await renderDashboard()

    expect(
      screen.getByText(/Source: Incident records · Category: Triggered alerts/)
    ).toBeInTheDocument()
  })

  test('explains unacknowledged alerts and overdue thresholds', async () => {
    await renderDashboard()

    expect(
      screen.getByText(/Metric: Alerts awaiting acknowledgement/)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Overdue means the alert has exceeded/)
    ).toBeInTheDocument()
  })

  test('identifies the school scope for Company Admin', async () => {
    await renderDashboard()

    expect(
      screen.getByText(/Company Admin view/)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/you can see incidents across all schools/)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Today's non-triggered incidents/)
    ).toBeInTheDocument()
  })

  test('shows the dashboard legend explaining incident statuses', async () => {
    await renderDashboard()

    const legend = screen.getByRole('region', {
      name: 'Dashboard legend',
    })

    expect(legend).toHaveTextContent('Triggered:')
    expect(legend).toHaveTextContent('Acknowledged:')
    expect(legend).toHaveTextContent('In progress:')
    expect(legend).toHaveTextContent('Resolved:')
    expect(legend).toHaveTextContent('Archived:')
  })

  test('explains priority levels and test incidents', async () => {
    await renderDashboard()

    const legend = screen.getByRole('region', {
      name: 'Dashboard legend',
    })

    expect(legend).toHaveTextContent(
      'Critical / High / Medium / Low:'
    )
    expect(legend).toHaveTextContent(
      'Test incident, not a live emergency.'
    )
  })
})
