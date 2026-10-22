// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
const stream = vi.hoisted(() => ({ data: null, state: null, stop: vi.fn() }))
vi.mock('../api/client', () => ({ incidentAPI: {}, settingsAPI: {}, subscribeToIncidents: (data, state) => { stream.data = data; stream.state = state; return stream.stop } }))
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ currentUser: { uid: 'staff' }, userRole: 'Staff', isStaff: true }) }))
vi.mock('../context/SchoolsContext', () => ({ useSchools: () => ({ schools: [] }) }))
vi.mock('../components/QuickActions', () => ({ default: () => <h2>Quick Alert</h2> }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
const incident = { id: 'old', incidentNumber: 'INC-001', title: 'Older active incident', status: 'acknowledged', createdAt: '2026-01-01T10:00:00Z' }
function load(records = [incident]) {
  render(<MemoryRouter><Dashboard /></MemoryRouter>)
  act(() => { stream.data(records); stream.state('live') })
}
function select(status) {
  fireEvent.change(screen.getByRole('combobox', { name: 'Incident status' }), { target: { value: status } })
}
test('Quick Alert precedes a collapsed selector with all five statuses', () => {
  load()
  expect(screen.getByText('Quick Alert').compareDocumentPosition(screen.getByRole('heading', { name: 'My incident status' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
  expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual(['Select a status', 'Triggered', 'Acknowledged', 'In Progress', 'Resolved', 'Archived'])
})
test('filters every status, includes all matches, sorts newest first and closes', () => {
  const records = ['triggered', 'acknowledged', 'in-progress', 'resolved', 'archived'].map(status => ({ ...incident, id: status, title: `${status} alert`, status }))
  load([...records, ...Array.from({ length: 12 }, (_, i) => ({ ...incident, id: `${i}`, title: `Completed ${i}`, status: 'resolved', createdAt: '2026-09-01T10:00:00Z' }))])
  for (const status of ['triggered', 'acknowledged', 'in-progress', 'archived']) {
    select(status)
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText(`${status} alert`)).toBeInTheDocument()
  }
  select('resolved')
  expect(screen.getAllByRole('listitem')).toHaveLength(13)
  expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Completed 0')
  expect(screen.getByRole('list')).toHaveClass('max-h-72', 'overflow-y-auto')
  fireEvent.click(screen.getByRole('button', { name: 'Close list' }))
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
  expect(screen.getByRole('combobox')).toHaveValue('')
})
test('live transitions update the selected list, preserve data on disconnect and clean up', () => {
  load()
  select('acknowledged')
  expect(screen.getByText('INC-001')).toBeInTheDocument()
  act(() => stream.data([{ ...incident, status: 'in-progress' }]))
  expect(screen.getByText('No incidents match this status.')).toBeInTheDocument()
  select('in-progress')
  act(() => stream.state('error'))
  expect(screen.getByText(/may be out of date/)).toBeInTheDocument()
  expect(screen.getByText('Older active incident')).toBeInTheDocument()
  act(() => { stream.data([{ ...incident, status: 'resolved' }]); stream.state('live') })
  expect(screen.getByText('No incidents match this status.')).toBeInTheDocument()
  select('resolved')
  expect(screen.getByText('Older active incident')).toBeInTheDocument()
  cleanup()
  expect(stream.stop).toHaveBeenCalledOnce()
})
test('empty results and initial connection failures are clear', () => {
  render(<MemoryRouter><Dashboard /></MemoryRouter>)
  act(() => stream.state('error'))
  expect(screen.getByText(/Unable to load incident status/)).toBeInTheDocument()
  select('triggered')
  expect(screen.getByText('No incidents match this status.')).toBeInTheDocument()
})
test('uses ID fallback, retains TEST marker and navigates to the existing details route', () => {
  render(<MemoryRouter><Routes><Route path="/" element={<Dashboard />} /><Route path="/incidents/old" element={<h1>Existing incident details</h1>} /></Routes></MemoryRouter>)
  act(() => { stream.data([{ ...incident, incidentNumber: null, isTest: true }]); stream.state('live') })
  select('acknowledged')
  const list = within(screen.getByRole('list'))
  expect(list.getByText('old')).toBeInTheDocument()
  expect(list.getByText('TEST')).toBeInTheDocument()
  expect(list.getByRole('link')).toHaveAttribute('href', '/incidents/old')
  fireEvent.click(list.getByRole('link'))
  expect(screen.getByRole('heading', { name: 'Existing incident details' })).toBeInTheDocument()
})
