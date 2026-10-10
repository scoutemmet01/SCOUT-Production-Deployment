// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Incidents from '../pages/Incidents'
import { getIncidents, settingsAPI } from '../api/client'
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ currentUser: { uid: 'staff', email: 'staff@school.edu' }, userRole: 'Staff', isStaff: true, authLoading: false }) }))
vi.mock('../context/SchoolsContext', () => ({ useSchools: () => ({ schools: [] }) }))
vi.mock('../api/client', () => ({ getIncidents: vi.fn(), settingsAPI: { get: vi.fn() }, archiveAPI: {} }))
afterEach(() => { cleanup(); vi.resetAllMocks() })
const base = { status: 'triggered', createdAt: '2026-09-01T10:00:00Z', location: 'Library', priority: 'high' }
function show() { return render(<MemoryRouter><Incidents /></MemoryRouter>) }
test('submitted and assigned incidents only, detail links, test badge and minimal controls', async () => {
  getIncidents.mockResolvedValue([
    { ...base, id: 'mine', title: 'My alert', triggeredById: 'staff', isTest: true },
    { ...base, id: 'id', title: 'Assigned by ID', assignedUserIds: ['staff'] },
    { ...base, id: 'email', title: 'Assigned by email', assignedUserEmails: ['staff@school.edu'] },
    { ...base, id: 'other', title: 'Unrelated', triggeredById: 'other' },
  ])
  show()
  expect(await screen.findByText('My alert')).toHaveAttribute('href', '/incidents/mine')
  expect(screen.getAllByRole('article')).toHaveLength(3)
  expect(screen.queryByText('Unrelated')).not.toBeInTheDocument()
  expect(screen.getByText('TEST')).toBeInTheDocument()
  expect(screen.getByText('Submit Alert')).toHaveAttribute('href', '/submit')
  expect(screen.getAllByRole('combobox')).toHaveLength(1)
  expect(settingsAPI.get).not.toHaveBeenCalled()
})
test('status, recorded timeline and search/status filters', async () => {
  getIncidents.mockResolvedValue([{ ...base, id: 'mine', title: 'Response', incidentNumber: 'INC034', triggeredById: 'staff', status: 'in-progress', acknowledgedBy: [{ name: 'Alex', acknowledgedAt: '2026-09-01T10:05:00Z' }], inProgressBy: [{ name: 'Sam', inProgressAt: '2026-09-01T10:10:00Z' }] }])
  show()
  await screen.findByText('Response')
  expect(within(screen.getByRole('list', { name: 'Incident timeline' })).getAllByRole('listitem')).toHaveLength(3)
  expect(screen.getByText('Responders: Sam')).toBeInTheDocument()
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'INC034' } })
  expect(screen.getByText('Response')).toBeInTheDocument()
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'resolved' } })
  expect(screen.getByText('No incidents match your filters.')).toBeInTheDocument()
})
test('loading and empty states', async () => {
  let finish
  getIncidents.mockReturnValue(new Promise(resolve => { finish = resolve }))
  show()
  expect(screen.getByRole('status')).toHaveTextContent('Loading incidents...')
  finish([])
  expect(await screen.findByText('No incidents to track yet.')).toBeInTheDocument()
})
test('error and retry', async () => {
  getIncidents.mockRejectedValueOnce(new Error('Connection failed')).mockResolvedValueOnce([])
  show()
  expect(await screen.findByRole('alert')).toHaveTextContent('Connection failed')
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(await screen.findByText('No incidents to track yet.')).toBeInTheDocument()
})
test('all completed records and responsive cards with wrapping titles', async () => {
  getIncidents.mockResolvedValue(Array.from({ length: 12 }, (_, i) => ({ ...base, id: `${i}`, title: `Completed ${i}`, status: 'resolved', triggeredById: 'staff' })))
  show()
  await screen.findByText('Completed 11')
  expect(screen.getAllByRole('article')).toHaveLength(12)
  expect(screen.getByText('Completed 11')).toHaveClass('break-words')
  expect(screen.getAllByRole('article')[0].parentElement).toHaveClass('sm:grid-cols-2')
})
