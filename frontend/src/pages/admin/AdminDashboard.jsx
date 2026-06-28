import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminAPI } from '../../services/api'
import useBackLogout from '../../hooks/useBackLogout'
import '../../styles/Auth.css'

const STATUS_BADGE = {
  PENDING:   { color:'#f39c12', label:'⏳ Pending' },
  APPROVED:  { color:'#3498db', label:'✅ Approved' },
  COMPLETED: { color:'#27ae60', label:'🟢 Completed' },
  REJECTED:  { color:'#e74c3c', label:'❌ Rejected' },
}

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  useBackLogout()

  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getStatistics()
      setStats(res.data)
    } catch {}
  }

  const fetchAll = async (status = '') => {
    setLoading(true)
    try {
      const res = await adminAPI.getAllRequests(status ? { status } : {})
      setAppointments(res.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) { fetchAll(filterStatus); return }
    setLoading(true)
    try {
      const res = await adminAPI.searchByRegNo(searchQuery.trim())
      setAppointments(res.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchStats(); fetchAll() }, [])

  useEffect(() => {
    if (!searchQuery) fetchAll(filterStatus)
  }, [filterStatus])

  const filtered = searchQuery
    ? appointments
    : filterStatus
      ? appointments.filter(a => a.request_status === filterStatus || a.status === filterStatus)
      : appointments

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1>⚙️ Administrator Dashboard</h1>
            <p>Welcome, <strong>{user?.name}</strong></p>
          </div>
          <button className="btn btn-danger" onClick={logout}>🚪 Logout</button>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'14px', marginBottom:'24px' }}>
            {[
              { label:'Total Requests', value: stats.totalRequests,   color:'#5b3ba6', icon:'📁' },
              { label:'Pending',        value: stats.pendingRequests,  color:'#f39c12', icon:'⏳' },
              { label:'Completed',      value: stats.completedRequests,color:'#27ae60', icon:'🟢' },
              { label:'Total Students', value: stats.totalStudents,    color:'#3498db', icon:'👨‍🎓' },
            ].map(c => (
              <div key={c.label} style={{ background:'white', borderRadius:'10px', padding:'20px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', borderTop:`4px solid ${c.color}` }}>
                <div style={{ fontSize:'1.6rem' }}>{c.icon}</div>
                <div style={{ fontSize:'1.9rem', fontWeight:'bold', color:c.color }}>{c.value}</div>
                <div style={{ color:'#666', fontSize:'0.85rem' }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Search + Filter bar */}
        <div style={{ background:'white', padding:'20px', borderRadius:'12px', marginBottom:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'flex-end' }}>
          <div style={{ flex:1, minWidth:'200px' }}>
            <label style={{ display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'0.9rem' }}>🔍 Search by Reg No</label>
            <input
              type="text"
              placeholder="e.g. 20BCS001"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{ width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd' }}
            />
          </div>
          <div style={{ minWidth:'160px' }}>
            <label style={{ display:'block', marginBottom:'6px', fontWeight:'600', fontSize:'0.9rem' }}>Filter by Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd' }}>
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleSearch} style={{ padding:'8px 20px' }}>Search</button>
          <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setFilterStatus(''); fetchAll(); fetchStats() }} style={{ padding:'8px 16px' }}>🔄 Reset</button>
        </div>

        {/* Table */}
        <div style={{ background:'white', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginBottom:'16px' }}>📋 All Appointments ({filtered.length})</h2>
          {loading ? (
            <p style={{ textAlign:'center', padding:'40px', color:'#888' }}>Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ textAlign:'center', padding:'40px', color:'#888' }}>No records found.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Reg No</th>
                    <th>Branch</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Counsellor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apt, i) => {
                    const status = apt.request_status || apt.status
                    const badge = STATUS_BADGE[status] || { color:'#999', label: status }
                    return (
                      <tr key={apt.request_id}>
                        <td>{i+1}</td>
                        <td><strong>{apt.student_name}</strong></td>
                        <td>{apt.registration_number}</td>
                        <td>{apt.branch}</td>
                        <td>{new Date(apt.appointment_date).toLocaleDateString('en-IN')}</td>
                        <td>{apt.time_slot}</td>
                        <td>{apt.counsellor_name || '—'}</td>
                        <td><span style={{ background:badge.color, color:'white', padding:'3px 10px', borderRadius:'10px', fontSize:'0.8rem', fontWeight:'600' }}>{badge.label}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
