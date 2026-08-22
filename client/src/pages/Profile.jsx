import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Camera, Edit2, Check, X, Compass, Calendar, ArrowRight, Trash2 } from 'lucide-react';

const Profile = () => {
  const { user, token, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    photo_url: user?.photo_url || '',
    additional_info: user?.additional_info || ''
  });
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        logout();
        navigate('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete account');
      }
    } catch (e) {
      setError('Error deleting account');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const fetchUserTrips = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching profile trips:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      city: user?.city || '',
      photo_url: user?.photo_url || '',
      additional_info: user?.additional_info || ''
    });
    setIsEditing(false);
    setError('');
  };

  // Group trips for Screen 7 listings
  const preplannedTrips = trips.filter(t => t.status === 'Upcoming');
  const previousTrips = trips.filter(t => t.status === 'Completed');

  const getDestinationImage = (city) => {
    const c = (city || '').toLowerCase();
    if (c.includes('paris')) return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&h=180&q=70';
    if (c.includes('tokyo')) return 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=300&h=180&q=70';
    if (c.includes('york') || c.includes('nyc')) return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=300&h=180&q=70';
    if (c.includes('interlaken') || c.includes('swiss')) return 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=300&h=180&q=70';
    if (c.includes('london')) return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=300&h=180&q=70';
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&h=180&q=70';
  };

  const renderProfileTripCard = (trip) => (
    <div key={trip.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <img src={getDestinationImage(trip.destination_place)} alt={trip.title} style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: '0.75rem 0.85rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.2rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trip.title}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>{trip.destination_place}</div>
        <button
          onClick={() => navigate(`/trips/${trip.id}`)}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '0.35rem', fontSize: '0.78rem' }}
        >
          View
        </button>
      </div>
    </div>
  );

  return (
    <div className="container animated-fade" style={{ maxWidth: '1000px', paddingTop: '2.5rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem', alignItems: 'flex-start' }} className="profile-grid">
        
        {/* Left Side: Avatar Card */}
        <div className="glass-card" style={{ padding: '2.5rem 1.75rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 1.5rem' }}>
            {formData.photo_url ? (
              <img 
                src={formData.photo_url} 
                alt="Profile Avatar" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-mid)' }} 
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                background: 'var(--grad-purple)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white'
              }}>
                <UserIcon size={54} />
              </div>
            )}
            
            {isEditing && (
              <label htmlFor="profile-photo-upload" style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: 'var(--grad-purple)',
                borderRadius: '50%',
                padding: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
              }}>
                <Camera size={16} color="white" />
                <input 
                  id="profile-photo-upload" 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handlePhotoUpload} 
                />
              </label>
            )}
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.first_name} {user?.last_name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>@{user?.username}</p>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', minHeight: '60px' }}>
            {user?.additional_info || 'No travel bio provided yet. Add one in editing mode!'}
          </p>

          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              <Edit2 size={14} /> Edit Profile
            </button>
          )}
        </div>

        {/* Right Side: Edit Form & Trip Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* User Details & Editing Option */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 700 }}>
              User Details Information
            </h3>

            {success && (
              <div style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {success}
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-input"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-input"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Bio / Travel Styles</label>
                <textarea
                  name="additional_info"
                  className="form-textarea"
                  value={formData.additional_info}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Share details about your travels..."
                ></textarea>
              </div>

              {isEditing && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                    <Check size={16} /> Save Changes
                  </button>
                  <button type="button" onClick={handleCancel} className="btn btn-secondary" style={{ width: '120px' }}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              )}
            </form>

            {/* Danger Zone */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--danger)' }}>Delete Account</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Permanently remove your account and all associated trip data</p>
              </div>
              <button onClick={handleDeleteAccount} className="btn btn-danger" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }} disabled={loading}>
                <Trash2 size={14} /> Delete Account
              </button>
            </div>
          </div>

          {/* Triplist: Preplanned & Previous Trips (Screen 7 wireframe image grid) */}
          <div style={{ marginTop: '2rem' }}>

            {/* Preplanned Trips */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 4, height: 18, background: 'var(--primary)', borderRadius: 4, display: 'inline-block' }} />
                Preplanned Trips
              </h4>
              {preplannedTrips.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px dashed var(--border-medium)' }}>No upcoming trips scheduled.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '1rem' }}>
                  {preplannedTrips.map(renderProfileTripCard)}
                </div>
              )}
            </div>

            {/* Previous Trips */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 4, height: 18, background: 'var(--text-muted-light)', borderRadius: 4, display: 'inline-block' }} />
                Previous Trips
              </h4>
              {previousTrips.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px dashed var(--border-medium)' }}>No previous trips recorded.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '1rem' }}>
                  {previousTrips.map(renderProfileTripCard)}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
