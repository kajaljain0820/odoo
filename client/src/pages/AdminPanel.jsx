import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Compass, BarChart2, Trash2, ShieldCheck, ShieldAlert as RevokeIcon, RefreshCw, AlertTriangle } from 'lucide-react';

const AdminPanel = () => {
  const { token, user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [usersList, setUsersList] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (activeTab === 'users') {
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUsersList(data);
        } else {
          setError('Failed to load users list');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        } else {
          setError('Failed to load analytics dashboard data');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure communicating with server');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId) => {
    if (userId === currentUser.id) {
      alert('You cannot modify your own administrative rights.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/toggle-admin`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage('Admin status updated successfully!');
        fetchAdminData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser.id) {
      alert('You cannot delete your own admin account.');
      return;
    }

    if (!window.confirm('Are you sure you want to permanently delete this user and all their trips? This action is irreversible.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage('User deleted successfully.');
        fetchAdminData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Custom SVG Line Chart Component
  const renderLineChart = (data) => {
    if (!data || data.length === 0) return <div style={{ color: 'var(--text-muted)' }}>No trend data available</div>;
    
    const width = 450;
    const height = 180;
    const padding = 30;

    const maxVal = Math.max(...data.map(d => d.count), 4);
    const minVal = 0;

    const points = data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding) / (data.length - 1 || 1));
      const y = height - padding - (d.count * (height - 2 * padding) / maxVal);
      return { x, y, label: d.month, val: d.count };
    });

    const pathData = points.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ background: 'transparent' }}>
        {/* Gridlines */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="rgba(255,255,255,0.05)" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.05)" />
        <line x1={padding} y1={height/2} x2={width - padding} y2={height/2} stroke="rgba(255,255,255,0.02)" strokeDasharray="4" />

        {/* Glowing Path Line */}
        <path d={pathData} fill="none" stroke="url(#line-grad)" strokeWidth="3" filter="url(#glow)" />
        <path d={pathData} fill="none" stroke="url(#line-grad)" strokeWidth="2.5" />

        {/* Linear Gradient & Glow Filter definitions */}
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary-mid)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="5" fill="var(--bg-primary)" stroke="var(--primary-mid)" strokeWidth="2" />
            <text x={p.x} y={height - 10} fill="var(--text-muted)" fontSize="8" textAnchor="middle">{p.label.split('-')[1] || p.label}</text>
            <text x={p.x} y={p.y - 10} fill="var(--text-main)" fontSize="9" fontWeight="bold" textAnchor="middle">{p.val}</text>
          </g>
        ))}
      </svg>
    );
  };

  // Custom SVG Bar Chart Component
  const renderBarChart = (data) => {
    if (!data || data.length === 0) return <div style={{ color: 'var(--text-muted)' }}>No bar data available</div>;

    const width = 450;
    const height = 180;
    const padding = 30;

    const maxVal = Math.max(...data.map(d => d.count), 4);

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="rgba(255,255,255,0.05)" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.05)" />

        {data.map((d, i) => {
          const barWidth = 30;
          const spacing = (width - 2 * padding) / data.length;
          const x = padding + i * spacing + (spacing - barWidth) / 2;
          const barHeight = (d.count * (height - 2 * padding)) / maxVal;
          const y = height - padding - barHeight;

          return (
            <g key={i}>
              {/* Bar Rect */}
              <rect 
                x={x} 
                y={y} 
                width={barWidth} 
                height={barHeight} 
                fill="url(#bar-grad)" 
                rx="3"
                style={{ transition: 'all 0.5s' }}
              />
              <text x={x + barWidth/2} y={height - 10} fill="var(--text-muted)" fontSize="8" textAnchor="middle">{d.month.split('-')[1] || d.month}</text>
              <text x={x + barWidth/2} y={y - 8} fill="var(--text-main)" fontSize="9" fontWeight="bold" textAnchor="middle">{d.count}</text>
            </g>
          );
        })}

        <defs>
          <linearGradient id="bar-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-mid)" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="container animated-fade" style={{ paddingTop: '2.5rem' }}>
      
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert style={{ color: 'var(--danger)' }} />
            <span>Admin Control Panel</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Monitor platforms user logs, analytics statistics, and regional allocations</p>
        </div>
        <button onClick={fetchAdminData} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <RefreshCw size={14} /> Reload Data
        </button>
      </div>

      {message && (
        <div style={{ background: 'rgba(13,148,136,0.08)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ background: 'var(--danger-light)', border: '1px solid rgba(225,29,72,0.2)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={15} /><span>{error}</span>
        </div>
      )}

      {/* Tabs navigation — Screen 12 */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '0' }}>
        {[
          { key: 'users',      label: 'Manage Users' },
          { key: 'cities',     label: 'Popular Cities' },
          { key: 'activities', label: 'Popular Activities' },
          { key: 'trends',     label: 'User Trends & Analytics' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              background: 'transparent', border: 'none',
              color: activeTab === key ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.9rem', fontWeight: 700,
              padding: '0.65rem 1.15rem',
              cursor: 'pointer',
              borderBottom: activeTab === key ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              transition: 'var(--transition)',
              marginBottom: '-1.5px'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content Area with Smooth Transition */}
      <div key={activeTab} className="animated-fade">
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Refreshing administration panel...</div>
        ) : activeTab === 'users' ? (
          
          /* Tab 1: Manage Users */
          <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} style={{ color: 'var(--danger)' }} />
              <span>Manage User Directory ({usersList.length} total)</span>
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.85rem' }}>User / Username</th>
                  <th style={{ padding: '0.85rem' }}>Email Address</th>
                  <th style={{ padding: '0.85rem' }}>City</th>
                  <th style={{ padding: '0.85rem' }}>Trips Count</th>
                  <th style={{ padding: '0.85rem' }}>Permissions</th>
                  <th style={{ padding: '0.85rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((usr) => (
                  <tr key={usr.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '1rem 0.85rem' }}>
                      <strong style={{ display: 'block', color: 'var(--text-main)' }}>{usr.first_name} {usr.last_name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{usr.username}</span>
                    </td>
                    <td style={{ padding: '1rem 0.85rem', color: 'var(--text-muted)' }}>{usr.email}</td>
                    <td style={{ padding: '1rem 0.85rem', color: 'var(--text-muted)' }}>{usr.city || 'N/A'}</td>
                    <td style={{ padding: '1rem 0.85rem', color: 'var(--primary-mid)', fontWeight: 'bold' }}>{usr.tripCount} Trips</td>
                    <td style={{ padding: '1rem 0.85rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        background: usr.is_admin ? 'rgba(244, 63, 94, 0.1)' : 'rgba(107, 114, 128, 0.05)',
                        color: usr.is_admin ? 'var(--danger)' : 'var(--text-muted)',
                        border: usr.is_admin ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid var(--border-color)'
                      }}>
                        {usr.is_admin ? 'Administrator' : 'Standard'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleToggleAdmin(usr.id)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          disabled={usr.id === currentUser.id}
                        >
                          {usr.is_admin ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(usr.id)}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          disabled={usr.id === currentUser.id}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'cities' ? (
          
          /* Tab 2: Popular Cities List */
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} style={{ color: 'var(--danger)' }} />
              <span>Popular Cities Booking Aggregates</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {analytics?.popularCities.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No city booking aggregates collected.</p>
              ) : (
                analytics?.popularCities.map((city, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <span>{idx + 1}. <strong>{city.name}</strong></span>
                      <span style={{ color: 'var(--primary-mid)', fontWeight: 700 }}>{city.tripCount} Visits</span>
                    </div>
                    {/* Progress bar representing share */}
                    <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        background: 'var(--grad-purple)',
                        width: `${Math.min((city.tripCount / (analytics.counts.trips || 1)) * 100, 100)}%`,
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === 'activities' ? (
          
          /* Tab 3: Popular Activities List */
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} style={{ color: 'var(--danger)' }} />
              <span>Popular Activities Scheduled</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {analytics?.popularActivities.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No activities recorded.</p>
              ) : (
                analytics?.popularActivities.map((act, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <span>{idx + 1}. <strong>{act.name}</strong></span>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{act.count} Times</span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        background: 'var(--grad-purple)',
                        width: `${Math.min(act.count * 20, 100)}%`,
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          
          /* Tab 4: User Trends and Analytics dashboard grids (Screen 12 charts) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* General counts widgets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="profile-trips-split">
              <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Active Users</span>
                <strong style={{ fontSize: '2.2rem', color: 'var(--primary-mid)' }}>{analytics?.counts.users}</strong>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Trips Planned</span>
                <strong style={{ fontSize: '2.2rem', color: 'var(--primary)' }}>{analytics?.counts.trips}</strong>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Community Shares</span>
                <strong style={{ fontSize: '2.2rem', color: 'var(--success)' }}>{analytics?.counts.posts}</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="admin-charts-grid">
              
              {/* User Registration Growth Line Chart */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart2 size={16} style={{ color: 'var(--primary-mid)' }} />
                  <span>User Sign-ups growth (Last 6 Months)</span>
                </h4>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderLineChart(analytics?.userTrends)}
                </div>
              </div>

              {/* Trip Bookings Bar Chart */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart2 size={16} style={{ color: 'var(--primary)' }} />
                  <span>Monthly Trip Allocations Trend</span>
                </h4>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderBarChart(analytics?.tripTrends)}
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default AdminPanel;
