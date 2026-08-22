import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, MapPin, Calendar, Compass, ArrowRight, Wallet, ChevronRight } from 'lucide-react';

const REGIONAL_SELECTIONS = [
  { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&h=260&q=80', description: 'City of Lights' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&h=260&q=80', description: 'Sun, Sand & Beaches' },
  { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&h=260&q=80', description: 'The Big Apple' },
  { name: 'Interlaken', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&h=260&q=80', description: 'Swiss Alps' },
  { name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&h=260&q=80', description: 'Royal History' },
  { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=260&q=80', description: 'Island Paradise' },
];

const getDestinationImage = (city) => {
  const c = (city || '').toLowerCase();
  if (c.includes('paris')) return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&h=340&q=80';
  if (c.includes('tokyo')) return 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&h=340&q=80';
  if (c.includes('york') || c.includes('nyc')) return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&h=340&q=80';
  if (c.includes('swiss') || c.includes('interlaken')) return 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=340&q=80';
  if (c.includes('london')) return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&h=340&q=80';
  if (c.includes('bali')) return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&h=340&q=80';
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&h=340&q=80';
};

const statusConfig = {
  Ongoing:   { cls: 'badge-ongoing',   color: 'var(--success)' },
  Upcoming:  { cls: 'badge-upcoming',  color: 'var(--primary)' },
  Completed: { cls: 'badge-completed', color: 'var(--text-muted)' },
};

const Landing = () => {
  const { token, user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/trips', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setTrips(await response.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const prevTrips = trips.filter(t => t.status === 'Completed');
  const activeTrips = trips.filter(t => t.status !== 'Completed');

  return (
    <div className="animated-fade">

      {/* ── HERO BANNER (Screen 3) ── */}
      <div style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(79,46,200,0.55) 0%, rgba(30,12,80,0.82) 100%), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center 40%',
        minHeight: 420, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '4rem 2rem', color: '#fff',
        position: 'relative'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <img src="/logo.jpeg" alt="GlobalTrotter" style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover' }} />
          GlobalTrotter Travel Planner
        </div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem', lineHeight: 1.15 }}>
          Explore the World,<br />One Adventure at a Time
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', marginBottom: '2.5rem', maxWidth: 520 }}>
          Plan trips, track budgets in ₹, discover destinations, and share your experiences.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{
          display: 'flex', width: '100%', maxWidth: 620,
          background: '#fff', borderRadius: 'var(--radius-full)',
          overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 1.25rem' }}>
            <Search size={18} style={{ color: 'var(--text-muted-light)', marginRight: '0.6rem', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search destinations, activities, cities…"
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', color: 'var(--text-main)', background: 'transparent', padding: '0.9rem 0' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', margin: '0.35rem', padding: '0.65rem 1.5rem' }}>
            Search
          </button>
        </form>
      </div>

      {/* ── PAGE CONTENT ── */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>

        {/* ── TOP REGIONAL SELECTIONS ── */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Top Regional Selections</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>Handpicked destinations loved by our travellers</p>
            </div>
            <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {REGIONAL_SELECTIONS.map(dest => (
              <div
                key={dest.name}
                className="glass-card"
                style={{ cursor: 'pointer', overflow: 'hidden' }}
                onClick={() => navigate(`/search?q=${dest.name}`)}
              >
                <img src={dest.image} alt={dest.name} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '0.85rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{dest.name}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{dest.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACTIVE / UPCOMING TRIPS ── */}
        {activeTrips.length > 0 && (
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>My Trips</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>Your active and upcoming adventures</p>
              </div>
              <Link to="/trips" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem' }}>
                All trips <ChevronRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {activeTrips.slice(0, 3).map(trip => {
                const sc = statusConfig[trip.status] || statusConfig.Upcoming;
                return (
                  <div key={trip.id} className="glass-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/trips/${trip.id}`)}>
                    <div style={{ position: 'relative' }}>
                      <img src={getDestinationImage(trip.destination_place)} alt={trip.title} style={{ width: '100%', height: 145, objectFit: 'cover', display: 'block' }} />
                      <span className={`badge ${sc.cls}`} style={{ position: 'absolute', top: 10, left: 10 }}>{trip.status}</span>
                    </div>
                    <div style={{ padding: '1.1rem 1.25rem' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.3rem' }}>{trip.title}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.85rem' }}>
                        <MapPin size={12} /> {trip.destination_place}
                        <span style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={12} /> {trip.start_date}
                        </span>
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-light)', textTransform: 'uppercase', fontWeight: 700 }}>Budget</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>₹{trip.totalBudget.toFixed(0)}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-light)', textTransform: 'uppercase', fontWeight: 700 }}>Spent</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: trip.totalExpense > trip.totalBudget ? 'var(--danger)' : 'var(--success)' }}>₹{trip.totalExpense.toFixed(0)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PREVIOUS TRIPS ── */}
        {prevTrips.length > 0 && (
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Previous Trips</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>Adventures you've already completed</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {prevTrips.map(trip => (
                <div key={trip.id} className="glass-card" style={{ cursor: 'pointer', opacity: 0.88 }} onClick={() => navigate(`/trips/${trip.id}`)}>
                  <img src={getDestinationImage(trip.destination_place)} alt={trip.title} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block', filter: 'grayscale(25%)' }} />
                  <div style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{trip.title}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={11} />{trip.destination_place}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && trips.length === 0 && (
          <div className="glass-card" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
            <Compass size={52} style={{ color: 'var(--border-medium)', marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>No trips yet!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start planning your first adventure.</p>
            <Link to="/trips/create" className="btn btn-primary">
              <Plus size={16} /> Plan a Trip
            </Link>
          </div>
        )}

      </div>

      {/* ── FAB: Plan a Trip ── */}
      <Link
        to="/trips/create"
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          background: 'var(--primary)', color: '#fff',
          padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-full)',
          fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
          zIndex: 50, transition: 'var(--transition)'
        }}
      >
        <Plus size={18} /> Plan a Trip
      </Link>
    </div>
  );
};

export default Landing;
