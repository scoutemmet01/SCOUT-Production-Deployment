import { useState } from 'react'
import { Link } from 'react-router-dom'

const statuses = {
  triggered: ['Triggered', 'bg-red-100 text-red-800'],
  acknowledged: ['Acknowledged', 'bg-blue-100 text-blue-800'],
  'in-progress': ['In Progress', 'bg-purple-100 text-purple-800'],
  resolved: ['Resolved', 'bg-green-100 text-green-800'],
  archived: ['Archived', 'bg-gray-100 text-gray-700'],
}

export default function StaffIncidentStatus({ incidents, connection }) {
  const [selectedStatus, setSelectedStatus] = useState('')
  const matching = incidents.filter(incident => incident.status === selectedStatus)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

  return (
    <section aria-labelledby="incident-status-heading" className="mb-4 rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 id="incident-status-heading" className="font-semibold text-gray-900">My incident status</h2>
        <p role="status" className="text-xs text-gray-600">
          {connection === 'live' ? 'Live updates connected' : connection === 'error'
            ? 'Updates disconnected. Displayed statuses may be out of date. Reconnecting…'
            : 'Connecting to live updates…'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="staff-incident-status" className="text-sm font-medium text-gray-700">Incident status</label>
        <select id="staff-incident-status" value={selectedStatus} onChange={event => setSelectedStatus(event.target.value)}
          aria-controls="staff-incident-list"
          className="max-w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select a status</option>
          {Object.entries(statuses).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
        {selectedStatus && <button onClick={() => setSelectedStatus('')} className="rounded px-2 py-2 text-sm text-blue-700 hover:underline">Close list</button>}
      </div>
      {connection === 'error' && !incidents.length && <p className="mt-3 text-sm text-gray-600">Unable to load incident status. Retrying automatically…</p>}
      {selectedStatus && (
        <div id="staff-incident-list" className="mt-3">
          <p role="status" className="mb-2 text-xs text-gray-600">{matching.length} {statuses[selectedStatus][0].toLowerCase()} incidents</p>
          {matching.length ? (
            <ul aria-label={`${statuses[selectedStatus][0]} incidents`} tabIndex={0}
              className="max-h-72 overflow-y-auto overscroll-contain divide-y divide-gray-100 rounded-md border border-gray-200">
              {matching.map(incident => (
                <li key={incident.id}>
                  <Link to={`/incidents/${incident.id}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 hover:bg-gray-50 focus-visible:outline-blue-500">
                    <span className="min-w-0 break-all text-xs text-gray-500">{incident.incidentNumber || incident.id}</span>
                    <span className="min-w-0 flex-1 basis-32 break-words text-sm font-medium text-gray-900">{incident.title || 'Untitled alert'}</span>
                    {incident.isTest && <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">TEST</span>}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statuses[selectedStatus][1]}`}>{statuses[selectedStatus][0]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="py-3 text-sm text-gray-600">No incidents match this status.</p>}
        </div>
      )}
    </section>
  )
}
