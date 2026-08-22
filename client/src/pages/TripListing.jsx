import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Calendar, Compass, Wallet, Trash2, Edit } from 'lucide-react';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(Number(value || 0));

const getDestinationImage = (trip) => {
  if (trip.cover_photo_url) return trip.cover_photo_url;
  const c = (trip.destination_place || '').toLowerCase();
  if (c.includes('paris')) return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&h=340&q=80';
  if (c.includes('tokyo')) return 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&h=340&q=80';
  if (c.includes('york') || c.includes('nyc')) return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&h=340&q=80';
  if (c.includes('interlaken') || c.includes('swiss')) return 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=340&q=80';
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&h=340&q=80';
};

const TripListing = () => {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('start_date');
  const [order, setOrder] = useState('ASC');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, [searchQuery, sortBy, order]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/trips?sortBy=${sortBy}&order=${order}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip and all its itinerary sections?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/trips/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTrips((prev) => prev.filter((trip) => trip.id !== id));
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const ongoingTrips = trips.filter((trip) => trip.status === 'Ongoing');
  const upcomingTrips = trips.filter((trip) => trip.status === 'Upcoming');
  const completedTrips = trips.filter((trip) => trip.status === 'Completed');

  const renderTripCard = (trip) => {
    const isOver = trip.totalExpense > trip.totalBudget;

    return (
      <div
        key={trip.id}
        style={{
          background: '#fff',
          border: '1.5px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          cursor: 'pointer',
          transition: 'var(--transition)',
          boxShadow: 'var(--shadow-xs)'
        }}
        onClick={() => navigate(`/trips/${trip.id}`)}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        }}
      >
        <img
          src={getDestinationImage(trip)}
          alt={trip.title}
          style={{ width: '108px', height: '84px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
        />

        <div
          style={{
            width: 4,
            height: 52,
            borderRadius: 4,
            flexShrink: 0,
            background: trip.status === 'Ongoing' ? 'var(--success)' : trip.status === 'Upcoming' ? 'var(--primary)' : 'var(--text-muted-light)'
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-main)' }}>{trip.title}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Compass size={12} /> {trip.destination_place}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={12} /> {trip.start_date} → {trip.end_date}
            </span>
          </p>
          {trip.description && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              {trip.description.length > 96 ? `${trip.description.slice(0, 96)}...` : trip.description}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-light)', textTransform: 'uppercase', fontWeight: 700 }}>Budget</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(trip.totalBudget)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted-light)', textTransform: 'uppercase', fontWeight: 700 }}>Spent</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isOver ? 'var(--danger)' : 'var(--success)' }}>{formatCurrency(trip.totalExpense)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${trip.id}/build`);
            }}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.7rem' }}
            title="Edit itinerary"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => handleDeleteTrip(e, trip.id)}
            className="btn btn-danger"
            style={{ padding: '0.4rem 0.7rem' }}
            title="Delete trip"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container animated-fade" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>User Trip Listing</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>View, sort, and manage all your travel plans</p>
        </div>
        <Link to="/trips/create" className="btn btn-primary">
          <Plus size={16} /> Plan a Trip
        </Link>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by city or trip name..."
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select className="form-select filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="start_date">Sort by Start Date</option>
              <option value="title">Sort by Name</option>
              <option value="budget">Sort by Budget</option>
            </select>

            <select className="form-select filter-select" value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
        {['All', 'Ongoing', 'Upcoming', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === tab ? 'var(--text-main)' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: 600,
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid var(--primary-mid)' : 'none',
              transition: 'var(--transition)'
            }}
          >
            {tab} ({tab === 'All' ? trips.length : tab === 'Ongoing' ? ongoingTrips.length : tab === 'Upcoming' ? upcomingTrips.length : completedTrips.length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading trips list...</div>
      ) : trips.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No trips found. <Link to="/trips/create" style={{ color: 'var(--primary)', fontWeight: 600 }}>Plan your first trip →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {(activeTab === 'All' || activeTab === 'Ongoing') && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 0 3px rgba(13,148,136,0.15)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>Ongoing</h3>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted-light)' }}>({ongoingTrips.length})</span>
              </div>
              {ongoingTrips.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-medium)' }}>No ongoing trips.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {ongoingTrips.map(renderTripCard)}
                </div>
              )}
            </div>
          )}

          {(activeTab === 'All' || activeTab === 'Upcoming') && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 0 3px rgba(124,58,237,0.15)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>Upcoming</h3>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted-light)' }}>({upcomingTrips.length})</span>
              </div>
              {upcomingTrips.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-medium)' }}>No upcoming trips scheduled.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {upcomingTrips.map(renderTripCard)}
                </div>
              )}
            </div>
          )}

          {(activeTab === 'All' || activeTab === 'Completed') && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--text-muted-light)', boxShadow: '0 0 0 3px rgba(156,163,175,0.15)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>Completed</h3>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted-light)' }}>({completedTrips.length})</span>
              </div>
              {completedTrips.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-medium)' }}>No completed trips yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {completedTrips.map(renderTripCard)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripListing;
