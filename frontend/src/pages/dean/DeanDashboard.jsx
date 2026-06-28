import { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line,
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { deanAPI } from '../../services/api'
import useBackLogout from '../../hooks/useBackLogout'
import '../../styles/Auth.css'

const PERIOD_OPTIONS = [
  { value: 'week',  label: 'Weekly  (last 12 weeks)'  },
  { value: 'month', label: 'Monthly (last 12 months)' },
  { value: 'year',  label: 'Yearly  (last 5 years)'   },
]

const STATUS_COLORS = {
  PENDING:   '#f39c12',
  APPROVED:  '#3498db',
  COMPLETED: '#27ae60',
  REJECTED:  '#e74c3c',
}

const STAT_BARS = [
  { key: 'totalRequests',     label: 'Total Requests', color: '#5b3ba6' },
  { key: 'pendingRequests',   label: 'Pending',        color: '#f39c12' },
  { key: 'approvedRequests',  label: 'Approved',       color: '#3498db' },
  { key: 'completedRequests', label: 'Completed',      color: '#27ae60' },
  { key: 'rejectedRequests',  label: 'Rejected',       color: '#e74c3c' },
  { key: 'totalStudents',     label: 'Students',       color: '#16a085' },
  { key: 'totalCounsellors',  label: 'Counsellors',    color: '#8e44ad' },
]

const DeanDashboard = () => {
  const { user, logout } = useAuth()
  useBackLogout()

  const [stats, setStats]       = useState(null)
  const [trends, setTrends]     = useState([])
  const [byBranch, setByBranch] = useState([])
  const [byStatus, setByStatus] = useState([])
  const [period, setPeriod]     = useState('month')
  const [loading, setLoading]   = useState(true)
  const [loadingT, setLoadingT] = useState(false)

  // ── Initial load: stats + analytics ──────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          deanAPI.getRequestStats(),
          deanAPI.getDashboardAnalytics(),
        ])
        setStats(statsRes.data)
        setByBranch(analyticsRes.data?.byBranch || [])
        setByStatus(analyticsRes.data?.byStatus  || [])
      } catch {}
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  // ── Trend fetch — re-runs whenever period changes ─────────────────────────
  const fetchTrends = useCallback(async () => {
    setLoadingT(true)
    try {
      const res = await deanAPI.getTrends(period)
      setTrends(
        (res.data || []).map(d => ({ ...d, count: parseInt(d.count) }))
      )
    } catch {}
    finally { setLoadingT(false) }
  }, [period])

  useEffect(() => { fetchTrends() }, [fetchTrends])

  // ── Derived values ────────────────────────────────────────────────────────
  const completionRate = stats && stats.totalRequests > 0
    ? Math.round((stats.completedRequests / stats.totalRequests) * 100)
    : 0

  const barData = STAT_BARS.map(({ key, label }) => ({
    name: label,
    value: stats?.[key] ?? 0,
  }))

  return (
    <div className="dashboard-container">
      <div className="container">

        {/* Header */}
        <div className="dashboard-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1>👔 Dean Dashboard</h1>
            <p>Welcome, <strong>{user?.name}</strong> — Student Welfare Overview</p>
          </div>
          <button className="btn btn-danger" onClick={logout}>🚪 Logout</button>
        </div>

        {loading ? (
          <p style={{ textAlign:'center', padding:'60px', color:'#888', fontSize:'1.2rem' }}>
            Loading analytics...
          </p>
        ) : (
          <>
            {/* ── Stat Cards ──────────────────────────────────────────────── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:'16px', marginBottom:'28px' }}>
              {[
                { label:'Total Requests',    value: stats?.totalRequests     || 0, color:'#5b3ba6', icon:'📁' },
                { label:'Pending',           value: stats?.pendingRequests   || 0, color:'#f39c12', icon:'⏳' },
                { label:'Approved',          value: stats?.approvedRequests  || 0, color:'#3498db', icon:'✅' },
                { label:'Completed',         value: stats?.completedRequests || 0, color:'#27ae60', icon:'🟢' },
                { label:'Completion Rate',   value: `${completionRate}%`,         color:'#5b3ba6', icon:'📈' },
                { label:'Total Students',    value: stats?.totalStudents     || 0, color:'#16a085', icon:'👨‍🎓' },
                { label:'Total Counsellors', value: stats?.totalCounsellors  || 0, color:'#8e44ad', icon:'👨‍⚕️' },
              ].map(c => (
                <div key={c.label} style={{ background:'white', borderRadius:'12px', padding:'20px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', borderTop:`4px solid ${c.color}` }}>
                  <div style={{ fontSize:'1.8rem' }}>{c.icon}</div>
                  <div style={{ fontSize:'2rem', fontWeight:'bold', color:c.color }}>{c.value}</div>
                  <div style={{ color:'#666', fontSize:'0.85rem', marginTop:'4px' }}>{c.label}</div>
                </div>
              ))}
            </div>

            {/* ── Status + Branch tables ───────────────────────────────────── */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>

              {/* Requests by Status */}
              <div style={{ background:'white', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ marginBottom:'16px' }}>📊 Requests by Status</h3>
                {byStatus.length === 0 ? <p style={{ color:'#888' }}>No data yet.</p> : (
                  <table className="table">
                    <thead><tr><th>Status</th><th>Count</th><th>Share</th></tr></thead>
                    <tbody>
                      {byStatus.map(row => {
                        const pct = stats?.totalRequests > 0
                          ? Math.round((parseInt(row.count) / stats.totalRequests) * 100)
                          : 0
                        return (
                          <tr key={row.status}>
                            <td>
                              <span style={{ background: STATUS_COLORS[row.status] || '#999', color:'white', padding:'2px 8px', borderRadius:'8px', fontSize:'0.8rem' }}>
                                {row.status}
                              </span>
                            </td>
                            <td><strong>{row.count}</strong></td>
                            <td>
                              <div style={{ background:'#eee', borderRadius:'6px', height:'10px', width:'100%' }}>
                                <div style={{ background: STATUS_COLORS[row.status] || '#999', width:`${pct}%`, height:'100%', borderRadius:'6px' }} />
                              </div>
                              <span style={{ fontSize:'0.75rem', color:'#666' }}>{pct}%</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Requests by Branch */}
              <div style={{ background:'white', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ marginBottom:'16px' }}>🏫 Requests by Branch</h3>
                {byBranch.length === 0 ? <p style={{ color:'#888' }}>No data yet.</p> : (
                  <table className="table">
                    <thead><tr><th>Branch</th><th>Count</th></tr></thead>
                    <tbody>
                      {byBranch.map(row => (
                        <tr key={row.branch}>
                          <td>{row.branch}</td>
                          <td><strong>{row.count}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* ── Line Chart — Trends with period dropdown ─────────────────── */}
            <div style={{ background:'white', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', marginBottom:'20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
                <h3 style={{ margin:0 }}>📅 Request Trends</h3>
                <select
                  value={period}
                  onChange={e => setPeriod(e.target.value)}
                  style={{ padding:'8px 14px', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'0.9rem', color:'#374151', background:'#fff', cursor:'pointer', outline:'none' }}
                >
                  {PERIOD_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {loadingT ? (
                <p style={{ textAlign:'center', color:'#888', padding:'40px 0' }}>Loading trend data...</p>
              ) : trends.length === 0 ? (
                <p style={{ textAlign:'center', color:'#888', padding:'40px 0' }}>
                  No trend data available yet. Data will appear as appointments are booked.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trends} margin={{ top:5, right:30, left:0, bottom:5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize:12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize:12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius:'8px', fontSize:'13px' }}
                      formatter={val => [val, 'Requests']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Requests"
                      stroke="#5b3ba6"
                      strokeWidth={2.5}
                      dot={{ r:4, fill:'#5b3ba6' }}
                      activeDot={{ r:6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ── Bar Chart — Full Statistics ──────────────────────────────── */}
            <div style={{ background:'white', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', marginBottom:'20px' }}>
              <h3 style={{ marginBottom:'20px' }}>📊 Full Statistics Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top:5, right:30, left:0, bottom:5 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize:11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize:12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius:'8px', fontSize:'13px' }}
                    formatter={val => [val, 'Count']}
                  />
                  <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={STAT_BARS[i].color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </>
        )}
      </div>
    </div>
  )
}

export default DeanDashboard
