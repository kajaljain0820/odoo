import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, ArrowLeft, Wallet, TrendingUp, AlertTriangle, MapPin, Share2 } from 'lucide-react';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
}).format(Number(value || 0));

const ItineraryView = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newActivity, setNewActivity] = useState({
    day_number: 1,
    activity_name: '',
    expense: ''
  });
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTrip(data);
      } else {
        setError('Trip details not found');
      }
    } catch (err) {
      console.error(err);
      setError('Network connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e, dayNum) => {
    e.preventDefault();
    const actName = newActivity.activity_name;
    const actCost = newActivity.expense || 0;

    if (!actName) return;

    try {
      const response = await fetch('http://localhost:5000/api/trips/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tripId: id,
          day_number: dayNum,
          activity_name: actName,
          expense: parseFloat(actCost),
          order: trip.activities.filter((activity) => activity.day_number === dayNum).length + 1
        })
      });

      if (response.ok) {
        fetchTripDetails();
        setNewActivity({
          day_number: 1,
          activity_name: '',
          expense: ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteActivity = async (actId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/trips/activities/${actId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchTripDetails();
      }
    } catch (deleteError) {
      console.error(deleteError);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      let shareKey = trip?.share_key;

      // Generate share key if not yet created
      if (!shareKey) {
        const res = await fetch(`http://localhost:5000/api/trips/${id}/share`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok || !data.share_key) {
          throw new Error(data.message || 'Failed to generate share key');
        }
        shareKey = data.share_key;
        setTrip(prev => ({ ...prev, share_key: shareKey }));
      }

      const publicUrl = `${window.location.origin}/shared/${shareKey}`;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(publicUrl);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = publicUrl;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        setShareMessage('✓ Link copied!');
      } catch (clipErr) {
        console.error('Clipboard write failed:', clipErr);
        prompt('Copy your shared trip link:', publicUrl);
        setShareMessage('✓ Link generated!');
      }
    } catch (err) {
      console.error('Error generating share link:', err);
      setShareMessage(`Error: ${err.message}`);
    }
    setTimeout(() => setShareMessage(''), 4000);
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Itinerary Board...</div>;
  }

  if (error || !trip) {
    return (
      <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '3rem' }}>
          <h3 style={{ color: 'var(--danger)' }}>{error || 'Trip details not found'}</h3>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const dayDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const daysArray = Array.from({ length: dayDifference > 0 ? dayDifference : 1 }, (_, i) => i + 1);

  const activitiesByDay = {};
  daysArray.forEach((day) => {
    activitiesByDay[day] = trip.activities
      ? trip.activities.filter((activity) => activity.day_number === day).sort((a, b) => a.order - b.order)
      : [];
  });

  const isOverBudget = trip.totalExpense > trip.totalBudget;

  return (
    <div className="container animated-fade" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="glass-card itinerary-header-split" style={{ padding: '2rem', marginBottom: '2.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Itinerary for {trip.destination_place}</h2>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>"{trip.title}"</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
            Trip Dates: {trip.start_date} to {trip.end_date}
          </span>
          {trip.description && (
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.6, maxWidth: '60ch' }}>
              {trip.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.45rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <MapPin size={13} /> {trip.destination_place}
            </span>
            <button type="button" onClick={handleCopyShareLink} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
              <Share2 size={13} /> {shareMessage || 'Copy Public Link'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Wallet size={16} /> Trip Budget:
            </span>
            <strong style={{ color: 'var(--primary)' }}>{formatCurrency(trip.totalBudget)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <TrendingUp size={16} /> Total Expenses:
            </span>
            <strong style={{ color: isOverBudget ? 'var(--danger)' : 'var(--success)' }}>
              {formatCurrency(trip.totalExpense)}
            </strong>
          </div>

          {isOverBudget && (
            <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--danger)', fontSize: '0.75rem', alignItems: 'center', marginTop: '0.25rem' }}>
              <AlertTriangle size={12} /> Over budget limit by {formatCurrency(trip.totalExpense - trip.totalBudget)}!
            </div>
          )}
        </div>
      </div>

      {/* ── Budget Breakdown Card ── */}
      {(() => {
        const totalDays = daysArray.length;
        const avgPerDay = totalDays > 0 ? trip.totalExpense / totalDays : 0;
        const remaining = trip.totalBudget - trip.totalExpense;
        const pct = trip.totalBudget > 0 ? Math.min((trip.totalExpense / trip.totalBudget) * 100, 100) : 0;

        // Per-day spend for bar chart
        const daySpends = daysArray.map(day => ({
          day,
          spend: (activitiesByDay[day] || []).reduce((s, a) => s + parseFloat(a.expense || 0), 0)
        }));
        const maxSpend = Math.max(...daySpends.map(d => d.spend), 1);

        return (
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.75rem', color: 'var(--text-main)' }}>
              💰 Budget Breakdown
            </h3>

            {/* Summary stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Budget', value: formatCurrency(trip.totalBudget), color: '#7c3aed' },
                { label: 'Total Spent', value: formatCurrency(trip.totalExpense), color: isOverBudget ? '#e11d48' : '#059669' },
                { label: 'Remaining', value: formatCurrency(Math.abs(remaining)), color: remaining >= 0 ? '#059669' : '#e11d48', prefix: remaining < 0 ? '-' : '' },
                { label: 'Avg / Day', value: formatCurrency(avgPerDay), color: '#0891b2' },
              ].map(({ label, value, color, prefix }) => (
                <div key={label} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem' }}>{label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color }}>{prefix}{value}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            {trip.totalBudget > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span>Budget used</span>
                  <span style={{ fontWeight: 700, color: isOverBudget ? '#e11d48' : '#7c3aed' }}>{pct.toFixed(1)}%</span>
                </div>
                <div style={{ height: 10, background: 'var(--bg-tertiary)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 999,
                    width: `${pct}%`,
                    background: isOverBudget ? 'linear-gradient(90deg,#f43f5e,#e11d48)' : 'linear-gradient(90deg,#8b5cf6,#6d28d9)',
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>
            )}

            {/* SVG Bar Chart — spend per day */}
            {daySpends.length > 0 && (
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Daily Spend</div>
                <svg width="100%" height={110} style={{ overflow: 'visible' }}>
                  {daySpends.map((d, i) => {
                    const barW = Math.max(1, (1 / daySpends.length) * 100 - 2);
                    const x = (i / daySpends.length) * 100;
                    const barH = maxSpend > 0 ? (d.spend / maxSpend) * 80 : 0;
                    return (
                      <g key={d.day}>
                        <rect
                          x={`${x + 0.5}%`} y={90 - barH}
                          width={`${barW}%`} height={barH}
                          rx={4} fill={d.spend > 0 ? '#8b5cf6' : '#e5e7eb'}
                          opacity={0.85}
                        />
                        <text x={`${x + barW / 2 + 0.5}%`} y={106} textAnchor="middle" fontSize={10} fill="var(--text-muted)">D{d.day}</text>
                        {d.spend > 0 && (
                          <text x={`${x + barW / 2 + 0.5}%`} y={85 - barH} textAnchor="middle" fontSize={9} fill="#7c3aed" fontWeight="700">
                            ₹{Math.round(d.spend / 1000) > 0 ? `${(d.spend/1000).toFixed(1)}k` : Math.round(d.spend)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  {/* Budget line */}
                  {trip.totalBudget > 0 && (
                    <line
                      x1="0%" x2="100%"
                      y1={90 - (trip.totalBudget / (totalDays * maxSpend || 1)) * 80 * totalDays}
                      y2={90 - (trip.totalBudget / (totalDays * maxSpend || 1)) * 80 * totalDays}
                      stroke="#e11d48" strokeDasharray="4 3" strokeWidth={1.5} opacity={0.6}
                    />
                  )}
                </svg>
              </div>
            )}
          </div>
        );
      })()}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {daysArray.map((day) => {
          const dayActs = activitiesByDay[day];

          return (
            <div key={day} className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                Day {day} Planning
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }} className="day-grid-split">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                    Physical Activity Flowchart
                  </h4>

                  {dayActs.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-tertiary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted-light)' }}>
                      No activities planned for this day yet.
                    </div>
                  ) : (
                    <div className="timeline-container">
                      <div className="timeline-line"></div>
                      {dayActs.map((act, idx) => (
                        <div key={act.id} className="timeline-item">
                          <div className="timeline-node"></div>

                          <div
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '1rem 1.25rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  background: 'var(--primary-light)',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  color: 'var(--primary)'
                                }}
                              >
                                {idx + 1}
                              </span>
                              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{act.activity_name}</span>
                            </div>

                            <button
                              onClick={() => handleDeleteActivity(act.id)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted-light)', cursor: 'pointer' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--danger)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-muted-light)';
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <form
                    onSubmit={(e) => handleAddActivity(e, day)}
                    style={{
                      marginTop: '2rem',
                      display: 'flex',
                      gap: '0.75rem',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '1.5rem'
                    }}
                  >
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add activity name (e.g. Dinner, Skydiving)"
                      style={{ flex: 2, padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
                      value={newActivity.day_number === day ? newActivity.activity_name : ''}
                      onChange={(e) => setNewActivity({ day_number: day, activity_name: e.target.value, expense: newActivity.day_number === day ? newActivity.expense : '' })}
                    />
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="Est. Cost (INR)"
                      style={{ flex: 1, padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
                      value={newActivity.day_number === day ? newActivity.expense : ''}
                      onChange={(e) => setNewActivity({ day_number: day, activity_name: newActivity.day_number === day ? newActivity.activity_name : '', expense: e.target.value })}
                    />
                    <button type="submit" className="btn btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      <Plus size={14} /> Add Item
                    </button>
                  </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                    Expense List (INR)
                  </h4>

                  {dayActs.length === 0 ? (
                    <div style={{ padding: '2rem', color: 'var(--text-muted-light)', fontSize: '0.9rem' }}>{formatCurrency(0)}</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {dayActs.map((act) => (
                        <div key={act.id} style={{ height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Cost:</span>
                          <strong style={{ color: 'var(--success)' }}>{formatCurrency(act.expense)}</strong>
                        </div>
                      ))}

                      <div
                        style={{
                          marginTop: '1.25rem',
                          paddingTop: '0.75rem',
                          borderTop: '2px solid var(--border-color)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontWeight: 700
                        }}
                      >
                        <span>Day Total:</span>
                        <span style={{ color: 'var(--primary)' }}>
                          {formatCurrency(dayActs.reduce((sum, act) => sum + parseFloat(act.expense || 0), 0))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryView;
