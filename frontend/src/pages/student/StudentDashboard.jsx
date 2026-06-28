import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { studentAPI } from '../../services/api'
import useBackLogout from '../../hooks/useBackLogout'
import '../../styles/Auth.css'

const STATUS_BADGE = {
  PENDING:   { color: '#f39c12', label: '⏳ Pending' },
  APPROVED:  { color: '#3498db', label: '✅ Approved' },
  COMPLETED: { color: '#27ae60', label: '🟢 Completed' },
  REJECTED:  { color: '#e74c3c', label: '❌ Rejected' },
}

const TIME_SLOTS = ['09:00 AM','10:00 AM','11:00 AM','01:00 PM','02:00 PM','03:00 PM','04:00 PM']

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  useBackLogout()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [bookLoading, setBookLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  // Book form state
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [description, setDescription] = useState('')

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await studentAPI.getAppointments()
      setAppointments(res.data || [])
    } catch {
      setMsg({ type: 'error', text: 'Failed to load appointments.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [])

  const handleBook = async (e) => {
    e.preventDefault()
    setMsg({ type: '', text: '' })
    if (!date || !timeSlot) {
      setMsg({ type: 'error', text: 'Please select date and time slot.' })
      return
    }
    setBookLoading(true)
    try {
      await studentAPI.bookAppointment({ appointment_date: date, time_slot: timeSlot, description })
      setMsg({ type: 'success', text: '✅ Appointment booked successfully! A counsellor will review it.' })
      setDate(''); setTimeSlot(''); setDescription('')
      fetchAppointments()
      setTimeout(() => setActiveTab('status'), 1500)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Booking failed. Try again.' })
    } finally {
      setBookLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      await studentAPI.cancelAppointment(id)
      setMsg({ type: 'success', text: 'Appointment cancelled.' })
      fetchAppointments()
    } catch {
      setMsg({ type: 'error', text: 'Could not cancel. Try again.' })
    }
  }

  const pending = appointments.filter(a => a.status === 'PENDING').length
  const approved = appointments.filter(a => a.status === 'APPROVED').length
  const completed = appointments.filter(a => a.status === 'COMPLETED').length
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1>👨‍🎓 Student Dashboard</h1>
            <p>Welcome, <strong>{user?.name}</strong> &nbsp;|&nbsp; ID: {user?.id || user?.registration_number}</p>
          </div>
          <button className="btn btn-danger" onClick={logout}>🚪 Logout</button>
        </div>

        {msg.text && (
          <div className={msg.type === 'error' ? 'error-message' : 'success-message'} style={{ marginBottom:'16px' }}>
            {msg.text}
          </div>
        )}

        <div className="dashboard-tabs">
          {[['dashboard','📊 Overview'],['appointments','📅 Book Session'],['status','📋 My Appointments']].map(([tab, label]) => (
            <button key={tab} className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => { setActiveTab(tab); setMsg({type:'',text:''}) }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'dashboard' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:'16px', marginTop:'8px' }}>
            {[
              { label:'Total Requests', value: appointments.length, color:'#3498db', icon:'📁' },
              { label:'Pending',        value: pending,             color:'#f39c12', icon:'⏳' },
              { label:'Approved',       value: approved,            color:'#2980b9', icon:'✅' },
              { label:'Completed',      value: completed,           color:'#27ae60', icon:'🟢' },
            ].map(card => (
              <div key={card.label} style={{ background:'white', borderRadius:'12px', padding:'24px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', borderTop:`4px solid ${card.color}` }}>
                <div style={{ fontSize:'2rem' }}>{card.icon}</div>
                <div style={{ fontSize:'2rem', fontWeight:'bold', color: card.color }}>{card.value}</div>
                <div style={{ color:'#666', fontSize:'0.9rem' }}>{card.label}</div>
              </div>
            ))}
            <div style={{ background:'white', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', gridColumn:'1/-1' }}>
              <h3>ℹ️ How it works</h3>
              <ol style={{ marginTop:'8px', paddingLeft:'20px', lineHeight:'2' }}>
                <li>Click <strong>"Book Session"</strong> and pick a date + time slot.</li>
                <li>Your request goes to the counsellor as <strong>PENDING</strong>.</li>
                <li>Once the counsellor accepts, status changes to <strong>APPROVED</strong>.</li>
                <li>After the session, it becomes <strong>COMPLETED</strong>.</li>
              </ol>
            </div>
          </div>
        )}

        {/* ── Book Session ── */}
        {activeTab === 'appointments' && (
          <div style={{ background:'white', padding:'30px', borderRadius:'12px', maxWidth:'520px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2>📅 Book a Counselling Session</h2>
            <form onSubmit={handleBook} style={{ marginTop:'20px' }}>
              <div className="form-group">
                <label>Appointment Date</label>
                <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Time Slot</label>
                <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)} required>
                  <option value="">-- Select a time --</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Brief Description (optional)</label>
                <textarea rows="3" placeholder="Describe your concern briefly..." value={description} onChange={e => setDescription(e.target.value)} style={{ width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd' }} />
              </div>
              <button type="submit" className="btn-login" disabled={bookLoading}>
                {bookLoading ? 'Booking...' : '📩 Book Appointment'}
              </button>
            </form>
          </div>
        )}

        {/* ── My Appointments ── */}
        {activeTab === 'status' && (
          <div style={{ background:'white', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <h2>📋 My Appointments</h2>
              <button className="btn btn-secondary" onClick={fetchAppointments} disabled={loading}>🔄 Refresh</button>
            </div>
            {loading ? (
              <p style={{ textAlign:'center', padding:'40px', color:'#888' }}>Loading...</p>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px', color:'#888' }}>
                <p style={{ fontSize:'3rem' }}>📭</p>
                <p>No appointments yet. <button className="btn btn-primary" onClick={() => setActiveTab('appointments')}>Book one now!</button></p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Counsellor</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt, i) => {
                      const badge = STATUS_BADGE[apt.status] || { color:'#999', label: apt.status }
                      return (
                        <tr key={apt.request_id}>
                          <td>{i + 1}</td>
                          <td>{new Date(apt.appointment_date).toLocaleDateString('en-IN')}</td>
                          <td>{apt.time_slot}</td>
                          <td>{apt.counsellor_name || '—'}</td>
                          <td><span style={{ background: badge.color, color:'white', padding:'4px 10px', borderRadius:'12px', fontSize:'0.82rem', fontWeight:'600' }}>{badge.label}</span></td>
                          <td>
                            {apt.status === 'PENDING' && (
                              <button className="btn btn-danger" style={{ padding:'4px 10px', fontSize:'0.82rem' }} onClick={() => handleCancel(apt.request_id)}>Cancel</button>
                            )}
                            {apt.status === 'COMPLETED' && apt.action_performed && (
                              <span style={{ color:'#27ae60', fontSize:'0.82rem' }}>✔ Resolved</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
