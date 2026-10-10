import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIncidents } from '../api/client'
import { useAuth } from '../context/AuthContext'
import StaffIncidentStatus from '../components/StaffIncidentStatus'

export default function StaffIncidents() {
  const { currentUser, authLoading, userRole } = useAuth()
  const uid = currentUser?.uid
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    if (authLoading || !uid || userRole !== 'Staff') return
    let active = true
    getIncidents().then(data => {
      if (active) setRecords(data)
    }).catch(err => {
      if (active) setError(err.message || 'Failed to load incidents.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [authLoading, uid, userRole, attempt])

  // Defence in depth: the API remains responsible for enforcing access.
  const mine = useMemo(() => records.filter(item => currentUser && (
    item.triggeredById === currentUser.uid ||
    item.assignedUserIds?.includes(currentUser.uid) ||
    (currentUser.email && item.assignedUserEmails?.includes(currentUser.email))
  )), [records, currentUser])
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return mine.filter(item =>
      (status === 'all' || (status === 'active'
        ? ['triggered', 'acknowledged', 'in-progress'].includes(item.status)
        : item.status === status)) &&
      [item.incidentNumber, item.title, item.location].filter(Boolean).join(' ').toLowerCase().includes(term)
    )
  }, [mine, search, status])

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My incidents</h1>
          <p className="text-sm text-gray-600">Incidents you submitted or were assigned.</p>
        </div>
        <Link to="/submit" className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">Submit Alert</Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input aria-label="Search my incidents" placeholder="Search incidents..." value={search} onChange={event => setSearch(event.target.value)} className="min-w-0 w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
        <select aria-label="Incident status" value={status} onChange={event => setStatus(event.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500">
          <option value="all">All Incidents</option>
          <option value="active">Active Incidents</option>
          <option value="triggered">Triggered</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      {loading || authLoading ? <p role="status" className="p-8 text-center text-gray-500">Loading incidents...</p>
        : error ? <div role="alert" className="p-6 bg-white border rounded-xl text-red-700">
          <p>{error}</p><button onClick={() => { setLoading(true); setError(''); setAttempt(value => value + 1) }} className="mt-3 underline">Try again</button>
        </div>
          : !filtered.length ? <p role="status" className="p-8 bg-white border rounded-xl text-center text-gray-500">{mine.length ? 'No incidents match your filters.' : 'No incidents to track yet.'}</p>
            : <StaffIncidentStatus incidents={filtered} listView />}
    </div>
  )
}


