import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { counsellorAPI } from '../../services/api'
import useBackLogout from '../../hooks/useBackLogout'
import '../../styles/Auth.css'

const STATUS_BADGE = {
  PENDING:   { color:'#f39c12', label:'⏳ Pending' },
  APPROVED:  { color:'#3498db', label:'✅ Approved' },
  COMPLETED: { color:'#27ae60', label:'🟢 Completed' },
  REJECTED:  { color:'#e74c3c', label:'❌ Rejected' },
}

const CounsellorDashboard = () => {
  const { user, logout } = useAuth()
  useBackLogout()

  const [activeTab, setActiveTab] = useState('pending')
  const [pending, setPending] = useState([])
  const [solved, setSolved] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type:'', text:'' })

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState(null) // { requestId, studentName }
  const [notes, setNotes] = useState('')
  const [resolution, setResolution] = useState('RESOLVED')
  const [submitting, setSubmitting] = useState(false)

  const fetchPending = async () => {
    setLoading(true)
    try {
      const res = await counsellorAPI.getPendingRequests()
      setPending(res.data || [])
    } catch { setMsg({ type:'error', text:'Failed to load pending requests.' }) }
    finally { setLoading(false) }
  }

  const fetchSolved = async () => {
    setLoading(true)
    try {
      const res = await counsellorAPI.getSolvedRequests()
      setSolved(res.data || [])
    } catch { setMsg({ type:'error', text:'Failed to load solved cases.' }) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchPending(); fetchSolved() }, [])

  const handleAccept = async (requestId) => {
    try {
      await counsellorAPI.updateAppointment(requestId, { status: 'APPROVED' })
      setMsg({ type:'success', text:'Request approved! Student has been notified.' })
      fetchPending(); fetchSolved()
    } catch { setMsg({ type:'error', text:'Failed to approve. Try again.' }) }
  }

  const handleReject = async (requestId) => {
    if (!window.confirm('Reject this request?')) return
    try {
      await counsellorAPI.updateAppointment(requestId, { status: 'REJECTED' })
      setMsg({ type:'success', text:'Request rejected.' })
      fetchPending()
    } catch { setMsg({ type:'error', text:'Failed to reject. Try again.' }) }
  }

  const openConfirmModal = (req) => {
    setConfirmModal(req)
    setNotes('')
    setResolution('RESOLVED')
  }

  const handleComplete = async () => {
    if (!notes.trim()) { setMsg({ type:'error', text:'Please add session notes.' }); return }
    setSubmitting(true)
    try {
      await counsellorAPI.confirmBooking(confirmModal.request_id, {
        date: new Date().toISOString().split('T')[0],
        timeslot: confirmModal.time_slot,
        action_performed: notes,
        status: resolution,
      })
      setMsg({ type:'success', text:'Session marked as completed!' })
      setConfirmModal(null)
      fetchPending(); fetchSolved()
    } catch { setMsg({ type:'error', text:'Failed to complete. Try again.' }) }
    finally { setSubmitting(false) }
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1>👨‍⚕️ Counsellor Dashboard</h1>
            <p>Welcome, <strong>{user?.name}</strong></p>
          </div>
          <button className="btn btn-danger" onClick={logout}>🚪 Logout</button>
        </div>

        {msg.text && (
          <div className={msg.type==='error' ? 'error-message' : 'success-message'} style={{ marginBottom:'16px' }}>
            {msg.text} <button style={{ float:'right', background:'none', border:'none', cursor:'pointer', fontWeight:'bold' }} onClick={() => setMsg({type:'',text:''})}>✕</button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'14px', marginBottom:'20px' }}>
          {[
            { label:'Pending', value: pending.length, color:'#f39c12', icon:'⏳' },
            { label:'Solved',  value: solved.length,  color:'#27ae60', icon:'✅' },
          ].map(c => (
            <div key={c.label} style={{ background:'white', borderRadius:'10px', padding:'20px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', borderTop:`4px solid ${c.color}` }}>
              <div style={{ fontSize:'1.8rem' }}>{c.icon}</div>
              <div style={{ fontSize:'2rem', fontWeight:'bold', color:c.color }}>{c.value}</div>
              <div style={{ color:'#666', fontSize:'0.9rem' }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-tabs">
          <button className={`dashboard-tab ${activeTab==='pending'?'active':''}`} onClick={() => { setActiveTab('pending'); fetchPending() }}>
            ⏳ Pending Requests ({pending.length})
          </button>
          <button className={`dashboard-tab ${activeTab==='solved'?'active':''}`} onClick={() => { setActiveTab('solved'); fetchSolved() }}>
            ✅ Solved Cases ({solved.length})
          </button>
        </div>

        {/* ── Pending Requests ── */}
        {activeTab === 'pending' && (
          <div style={{ background:'white', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <h2>⏳ Pending Student Requests</h2>
              <button className="btn btn-secondary" onClick={fetchPending} disabled={loading}>🔄 Refresh</button>
            </div>
            {loading ? (
              <p style={{ textAlign:'center', padding:'40px', color:'#888' }}>Loading...</p>
            ) : pending.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px', color:'#888' }}>
                <p style={{ fontSize:'3rem' }}>🎉</p>
                <p>No pending requests right now!</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Reg No</th>
                      <th>Branch</th>
                      <th>Requested Date</th>
                      <th>Time Slot</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map((req, i) => (
                      <tr key={req.request_id}>
                        <td>{i+1}</td>
                        <td><strong>{req.student_name}</strong></td>
                        <td>{req.registration_number}</td>
                        <td>{req.branch}</td>
                        <td>{new Date(req.appointment_date).toLocaleDateString('en-IN')}</td>
                        <td>{req.time_slot}</td>
                        <td style={{ display:'flex', gap:'6px' }}>
                          <button className="btn btn-primary" style={{ padding:'4px 10px', fontSize:'0.82rem' }} onClick={() => handleAccept(req.request_id)}>✅ Accept</button>
                          <button className="btn" style={{ padding:'4px 10px', fontSize:'0.82rem', background:'#27ae60', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' }} onClick={() => openConfirmModal(req)}>🟢 Complete</button>
                          <button className="btn btn-danger" style={{ padding:'4px 10px', fontSize:'0.82rem' }} onClick={() => handleReject(req.request_id)}>❌ Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Solved Cases ── */}
        {activeTab === 'solved' && (
          <div style={{ background:'white', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <h2>✅ Solved Cases</h2>
              <button className="btn btn-secondary" onClick={fetchSolved} disabled={loading}>🔄 Refresh</button>
            </div>
            {loading ? (
              <p style={{ textAlign:'center', padding:'40px', color:'#888' }}>Loading...</p>
            ) : solved.length === 0 ? (
              <p style={{ textAlign:'center', padding:'40px', color:'#888' }}>No solved cases yet.</p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Reg No</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solved.map((req, i) => {
                      const badge = STATUS_BADGE[req.status] || { color:'#999', label: req.status }
                      return (
                        <tr key={req.request_id}>
                          <td>{i+1}</td>
                          <td><strong>{req.student_name}</strong></td>
                          <td>{req.registration_number}</td>
                          <td>{new Date(req.appointment_date).toLocaleDateString('en-IN')}</td>
                          <td>{req.time_slot}</td>
                          <td><span style={{ background:badge.color, color:'white', padding:'3px 8px', borderRadius:'10px', fontSize:'0.8rem' }}>{badge.label}</span></td>
                          <td style={{ maxWidth:'200px', fontSize:'0.85rem', color:'#555' }}>{req.action_performed || '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Complete Session Modal ── */}
        {confirmModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
            <div style={{ background:'white', borderRadius:'14px', padding:'32px', width:'440px', maxWidth:'90vw', boxShadow:'0 8px 32px rgba(0,0,0,0.2)' }}>
              <h3>🟢 Mark Session as Completed</h3>
              <p style={{ color:'#555', marginBottom:'16px' }}>Student: <strong>{confirmModal.student_name}</strong></p>
              <div className="form-group">
                <label>Session Notes / Action Taken</label>
                <textarea rows="4" placeholder="Describe what was discussed and actions taken..." value={notes} onChange={e => setNotes(e.target.value)} style={{ width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd', resize:'vertical' }} />
              </div>
              <div className="form-group">
                <label>Resolution Status</label>
                <select value={resolution} onChange={e => setResolution(e.target.value)} style={{ width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd' }}>
                  <option value="RESOLVED">✅ Resolved</option>
                  <option value="FOLLOW_UP">🔄 Follow-Up Required</option>
                  <option value="REFERRED">↗️ Referred to Specialist</option>
                </select>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'8px' }}>
                <button className="btn-login" style={{ flex:1 }} onClick={handleComplete} disabled={submitting}>
                  {submitting ? 'Saving...' : '✅ Confirm & Complete'}
                </button>
                <button className="btn btn-secondary" style={{ flex:1 }} onClick={() => setConfirmModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CounsellorDashboard
