import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Calendar, Plus, Save, AlertCircle, Wallet } from 'lucide-react';

const SUGGESTIONS = {
  paris: [
    { title: 'Eiffel Tower Tour', category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=300&h=200&q=80' },
    { title: 'Louvre Museum entry', category: 'Art & Culture', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=300&h=200&q=80' },
    { title: 'Seine River Evening Cruise', category: 'Romance', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=300&h=200&q=80' }
  ],
  tokyo: [
    { title: 'Shibuya Crossing & Hachiko', category: 'City Walk', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&h=200&q=80' },
    { title: 'Senso-ji Temple Explore', category: 'History', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&h=200&q=80' },
    { title: 'Akihabara Anime Tour', category: 'Subculture', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=300&h=200&q=80' }
  ],
  'new york': [
    { title: 'Empire State Building', category: 'Views', image: 'https://images.unsplash.com/photo-1522083165195-342750297f4e?auto=format&fit=crop&w=300&h=200&q=80' },
    { title: 'MET Museum Entrance', category: 'Art', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=300&h=200&q=80' },
    { title: 'Broadway Tickets (Wicked)', category: 'Entertainment', image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=300&h=200&q=80' }
  ],
  interlaken: [
    { title: 'Paragliding Experience', category: 'Adventure', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&h=200&q=80' },
    { title: 'Jungfraujoch Train Pass', category: 'Scenic', image: 'https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?auto=format&fit=crop&w=300&h=200&q=80' },
    { title: 'Harder Kulm Viewpoint', category: 'Hike', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&h=200&q=80' }
  ]
};

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    title: '',
    destination_place: '',
    description: '',
    cover_photo_url: '',
    start_date: '',
    end_date: '',
    budget: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError('Cover photo must be less than 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, cover_photo_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleApplySuggestion = (suggestionTitle) => {
    setFormData(prev => ({
      ...prev,
      title: prev.title ? prev.title : `${formData.destination_place || 'My'} - ${suggestionTitle}`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, destination_place, start_date, end_date, budget } = formData;

    if (!title || !destination_place || !start_date || !end_date || !budget) {
      setError('Please fill in all fields');
      return;
    }

    if (start_date > end_date) {
      setError('Start date cannot be after end date');
      return;
    }

    if (Number(budget) <= 0) {
      setError('Budget must be greater than 0');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create trip');
      }

      // Automatically forward to Build Itinerary Screen (Screen 5)
      navigate(`/trips/${data.id}/build`);
    } catch (err) {
      setError(err.message || 'Error planning new trip');
    } finally {
      setLoading(false);
    }
  };

  // Determine which suggestions to show
  const cityKey = formData.destination_place.toLowerCase().trim();
  const activeSuggestions = SUGGESTIONS[cityKey] || [
    { title: 'Paragliding Tandem Flight', category: 'Adventure', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=300&h=200&q=80' },
    { title: 'Historical Guided City Tour', category: 'Culture', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=300&h=200&q=80' },
    { title: 'Local Culinary Food Tasting', category: 'Dining', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&h=200&q=80' }
  ];

  return (
    <div className="container animated-fade" style={{ maxWidth: '800px', paddingTop: '3rem' }}>
      
      <div className="glass-card" style={{ padding: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Compass size={32} style={{ color: 'var(--primary-mid)' }} />
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Plan a New Trip</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Map out your travel dates and destination</p>
          </div>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.1)', 
            border: '1px solid var(--danger)', 
            color: 'var(--danger)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
          <div className="form-group">
            <label className="form-label">Trip Title / Name</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Paris Art Escape, Alpine Hiking Adventure"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select a Place (Destination)</label>
            <input
              type="text"
              name="destination_place"
              className="form-input"
              placeholder="Enter city (e.g. Paris, Tokyo, New York, Interlaken)"
              value={formData.destination_place}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Trip Description</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Add a short overview of the trip, the vibe, or important notes"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleCoverPhotoUpload}
            />
            {formData.cover_photo_url && (
              <img
                src={formData.cover_photo_url}
                alt="Trip cover preview"
                style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginTop: '0.75rem', border: '1px solid var(--border-color)' }}
              />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="date"
                  name="start_date"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="date"
                  name="end_date"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Trip Budget (INR)</label>
            <div style={{ position: 'relative' }}>
              <Wallet size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="number"
                min="0"
                step="0.01"
                name="budget"
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Enter your budget in rupees"
                value={formData.budget}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              <Save size={16} /> {loading ? 'Creating Trip...' : 'Build Itinerary'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary" style={{ width: '120px' }}>
              Cancel
            </button>
          </div>
        </form>

        {/* Suggestion for Places to Visit/Activities to perform (Screen 4) */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', fontWeight: 700, borderTop: '1px solid var(--border-color)', paddingTop: '2rem', color: 'var(--text-main)' }}>
            Suggestions for Places to Visit &amp; Activities in {formData.destination_place || 'Popular Cities'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem' }}>
            {activeSuggestions.map((sug, idx) => (
              <div key={idx} className="glass-card" style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img src={sug.image} alt={sug.title} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--primary-mid)', fontWeight: 700 }}>{sug.category}</span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0.15rem 0 0.5rem' }}>{sug.title}</h4>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleApplySuggestion(sug.title)}
                    className="btn btn-secondary" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', gap: '0.15rem' }}
                  >
                    <Plus size={12} /> Use Title Idea
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CreateTrip;
