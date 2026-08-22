import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Share2, TrendingUp, Wallet, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
}).format(Number(value || 0));

const getFallbackCover = (city) => {
  const c = (city || '').toLowerCase();
  if (c.includes('paris')) return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&h=500&q=80';
  if (c.includes('tokyo')) return 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&h=500&q=80';
  if (c.includes('york') || c.includes('nyc')) return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&h=500&q=80';
  if (c.includes('interlaken') || c.includes('swiss')) return 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=500&q=80';
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=500&q=80';
};

const PublicTripView = () => {
  const { shareKey } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [cloneSuccess, setCloneSuccess] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/trips/shared/${shareKey}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Shared trip not found');
        }

        setTrip(data);
      } catch (err) {
        setError(err.message || 'Failed to load shared itinerary');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [shareKey]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloneTrip = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setCloning(true);
      const res = await fetch(`http://localhost:5000/api/trips/shared/${shareKey}/clone`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setCloneSuccess(true);
        setTimeout(() => {
          navigate(`/trips/${data.id}`);
        }, 1000);
      } else {
        alert(data.message || 'Failed to clone trip');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading shared itinerary...</div>;
  }

  if (error || !trip) {
    return (
      <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '3rem' }}>
          <h3 style={{ color: 'var(--danger)' }}>{error || 'Shared trip not found'}</h3>
        </div>
      </div>
    );
  }

  const groupedActivities = (trip.activities || []).reduce((acc, activity) => {
    if (!acc[activity.day_number]) {
      acc[activity.day_number] = [];
    }
    acc[activity.day_number].push(activity);
    return acc;
  }, {});

  const coverImage = trip.cover_photo_url || getFallbackCover(trip.destination_place);

  return (
    <div className="animated-fade">
      <div
        style={{
          minHeight: 320,
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.25) 0%, rgba(15,23,42,0.72) 100%), url("${coverImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', color: '#fff' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
            <ArrowLeft size={14} /> Back
          </button>

          <div style={{ maxWidth: '720px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>
              <img src="/logo.jpeg" alt="Logo" style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover' }} />
              GlobalTrotter Shared Itinerary
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, marginTop: '1rem', lineHeight: 1.05 }}>{trip.title}</h1>
            <p style={{ marginTop: '0.75rem', fontSize: '1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '640px' }}>
              {trip.description || 'A curated trip plan shared from GlobalTrotter.'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.25rem', color: 'rgba(255,255,255,0.92)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} /> {trip.destination_place}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} /> {trip.start_date} to {trip.end_date}
              </span>
              <span>By {trip.user?.first_name} {trip.user?.last_name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Budget</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Wallet size={16} /> {formatCurrency(trip.totalBudget)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Estimated Spend</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <TrendingUp size={16} /> {formatCurrency(trip.totalExpense)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleCopyLink} className="btn btn-secondary">
              <Share2 size={14} /> {copied ? 'Link Copied' : 'Copy Share Link'}
            </button>
            <button onClick={handleCloneTrip} className="btn btn-primary" disabled={cloning}>
              {cloneSuccess ? <Check size={14} /> : <Copy size={14} />}
              {cloneSuccess ? 'Trip Copied!' : cloning ? 'Copying…' : 'Copy Trip to My Itineraries'}
            </button>
          </div>
        </div>

        {trip.sections?.length > 0 && (
          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Trip Sections</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {trip.sections.map((section) => (
                <div key={section.id} style={{ padding: '1rem 1.1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <strong>{section.title}</strong>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{formatCurrency(section.budget)}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{section.description || 'No additional details provided.'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Day-wise Plan</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.keys(groupedActivities).length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No day-wise activities have been added yet.</div>
            ) : (
              Object.entries(groupedActivities).map(([day, activities]) => (
                <div key={day} style={{ padding: '1rem 1.1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <strong>Day {day}</strong>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {formatCurrency(activities.reduce((sum, activity) => sum + parseFloat(activity.expense || 0), 0))}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {activities.map((activity) => (
                      <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-sm)', background: '#fff' }}>
                        <span>{activity.activity_name}</span>
                        <strong style={{ color: 'var(--success)' }}>{formatCurrency(activity.expense)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTripView;
