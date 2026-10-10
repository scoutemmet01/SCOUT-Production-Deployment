// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

const mocks = vi.hoisted(() => ({ auth: {}, data: null, state: null, stop: vi.fn(), create: vi.fn(), notify: vi.fn() }))
vi.mock('../context/AuthContext', () => ({ useAuth: () => mocks.auth }))
vi.mock('../context/SchoolsContext', () => ({ useSchools: () => ({ schools: [] }) }))
vi.mock('../api/client', () => ({
  subscribeToIncidents: (data, state) => { mocks.data = data; mocks.state = state; return mocks.stop },
  incidentAPI: { list: vi.fn().mockResolvedValue([]), create: (...args) => mocks.create(...args) },
  settingsAPI: { get: vi.fn().mockResolvedValue({ overdueThresholdMinutes: 15 }) },
  setupAPI: { getAlertTypes: vi.fn().mockResolvedValue({ alertTypes: [] }) },
  quickAlertsAPI: { list: vi.fn().mockResolvedValue({ quickAlerts: [{ id: 'quick', label: 'Library medical', available: true, priority: 'high', alertType: { label: 'Medical', value: 'medical' } }] }) },
  apiCall: (...args) => mocks.notify(...args),
}))

beforeEach(() => {
  mocks.auth = { currentUser: { uid: 'staff', displayName: 'Sam' }, userRole: 'Staff', isStaff: true }
  vi.clearAllMocks()
})
afterEach(cleanup)
function show() { return render(<MemoryRouter><Dashboard /></MemoryRouter>) }

test('staff Quick Alerts precede incident status and retain alert controls through live updates', async () => {
  const { unmount } = show()
  act(() => { mocks.data([]); mocks.state('live') })
  const quick = screen.getByRole('heading', { name: 'Quick Alert' })
  const status = screen.getByRole('heading', { name: 'My incident status' })
  expect(quick.compareDocumentPosition(status) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(await screen.findByRole('heading', { name: 'My quick alerts' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Manage' })).toHaveAttribute('href', '/my-quick-alerts')
  fireEvent.click(screen.getByRole('button', { name: /Emergency alert/i }))
  expect(screen.getByText('Select Emergency Type')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /General alert/i }))
  expect(screen.getByText('Select Incident Category')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /Library medical/i }))
  expect(screen.getByText('Send "Library medical"?')).toBeInTheDocument()
  expect(mocks.create).not.toHaveBeenCalled()
  expect(mocks.notify).not.toHaveBeenCalled()
  const incident = { id: 'incident', title: 'Tracked incident', status: 'acknowledged', location: 'Library', priority: 'high' }
  act(() => { mocks.data([incident]); mocks.state('live') })
  expect(screen.getByText('Acknowledged')).toBeInTheDocument()
  expect(screen.getByText('Tracked incident')).toHaveAttribute('href', '/incidents/incident')
  act(() => mocks.data([{ ...incident, status: 'in-progress' }]))
  expect(screen.getByText('In progress')).toBeInTheDocument()
  expect(quick.compareDocumentPosition(status) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  unmount()
  expect(mocks.stop).toHaveBeenCalledOnce()
})

test.each(['School Admin', 'Company Admin'])('%s dashboard does not render staff Quick Alerts or staff incident status', async role => {
  mocks.auth = { currentUser: { uid: 'admin' }, userRole: role, isStaff: false, isSchoolAdmin: role === 'School Admin', isCompanyAdmin: role === 'Company Admin' }
  show()
  await screen.findByText('No incidents found.')
  expect(screen.queryByRole('heading', { name: 'Quick Alert' })).not.toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'My incident status' })).not.toBeInTheDocument()
})

