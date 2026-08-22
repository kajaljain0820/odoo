import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const statusStyle = {
  Ongoing:   { bg: 'var(--success)',  text: '#fff' },
  Upcoming:  { bg: 'var(--primary)',  text: '#fff' },
  Completed: { bg: 'var(--text-muted-light)', text: '#fff' },
};

const CalendarView = () => {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/trips', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTrips(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const firstDayIdx  = new Date(year, month, 1).getDay();

  const getTripsForDate = (dateStr) =>
    trips.filter(t => dateStr >= t.start_date && dateStr <= t.end_date);

  // Build cells array
  const cells = [];
  for (let i = 0; i < firstDayIdx; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const toDateStr = (day) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <div className="container animated-fade" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Calendar View</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>All your trips visualized on a monthly calendar</p>
        </div>
        {/* Status legend */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {Object.entries(statusStyle).map(([status, s]) => (
            <span key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: s.bg, display: 'inline-block' }} />
              {status}
            </span>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', overflow: 'hidden' }}>

        {/* Month Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem' }}>
            <ChevronLeft size={18} />
          </button>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <Calendar size={20} style={{ color: 'var(--primary)' }} />
            {MONTHS[month]} {year}
          </h3>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem' }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading trips…</div>
        ) : (
          <>
            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', marginBottom: '0.4rem' }}>
              {WEEKDAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted-light)', letterSpacing: '0.06em', padding: '0.4rem 0' }}>{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
              {cells.map((day, idx) => {
                if (day === null) {
                  return <div key={`e-${idx}`} style={{ minHeight: 90, borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', opacity: 0.3 }} />;
                }
                const dateStr = toDateStr(day);
                const dayTrips = getTripsForDate(dateStr);
                const today = isToday(day);

                return (
                  <div
                    key={`d-${day}`}
                    style={{
                      minHeight: 90,
                      background: today ? 'var(--primary-pale)' : '#fff',
                      border: today ? '2px solid var(--primary-mid)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.45rem 0.5rem',
                      display: 'flex', flexDirection: 'column', gap: '0.25rem',
                    }}
                  >
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: today ? 800 : 600,
                      color: today ? 'var(--primary)' : 'var(--text-body)',
                      alignSelf: 'flex-start',
                      lineHeight: 1
                    }}>{day}</span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
                      {dayTrips.map(trip => {
                        const s = statusStyle[trip.status] || statusStyle.Upcoming;
                        return (
                          <div
                            key={trip.id}
                            onClick={() => navigate(`/trips/${trip.id}`)}
                            title={`${trip.title} — ${trip.destination_place}`}
                            style={{
                              background: s.bg,
                              color: s.text,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              padding: '0.18rem 0.4rem',
                              borderRadius: 3,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              cursor: 'pointer',
                              lineHeight: 1.4
                            }}
                          >
                            {trip.title.toUpperCase()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
