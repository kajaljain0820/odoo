import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Calendar, Plus, Trash2, Check, ArrowRight, Wallet, Info } from 'lucide-react';

const ItineraryBuilder = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state for a new section
  const [newSection, setNewSection] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: ''
  });

  useEffect(() => {
    fetchTripAndSections();
  }, [id]);

  const fetchTripAndSections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/trips/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTrip(data);
        setSections(data.sections || []);
        
        // Auto-fill new section dates with trip dates as defaults
        setNewSection(prev => ({
          ...prev,
          start_date: data.start_date,
          end_date: data.end_date
        }));
      } else {
        setError('Failed to fetch trip details');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSection.title || !newSection.budget) {
      setError('Please provide at least a title and budget');
      return;
    }

    try {
      setError('');
      const response = await fetch('http://localhost:5000/api/trips/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tripId: id,
          title: newSection.title,
          description: newSection.description,
          start_date: newSection.start_date || null,
          end_date: newSection.end_date || null,
          budget: parseFloat(newSection.budget)
        })
      });

      if (response.ok) {
        const addedSection = await response.json();
        setSections(prev => [...prev, addedSection]);
        
        // Reset form
        setNewSection({
          title: '',
          description: '',
          start_date: trip ? trip.start_date : '',
          end_date: trip ? trip.end_date : '',
          budget: ''
        });
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to add section');
      }
    } catch (err) {
      console.error(err);
      setError('Error adding section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/trips/sections/${sectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSections(prev => prev.filter(sec => sec.id !== sectionId));
      } else {
        setError('Failed to delete section');
      }
    } catch (err) {
      console.error(err);
      setError('Error deleting section');
    }
  };

  // Calculate total budget of sections added so far
  const totalBudget = sections.reduce((sum, sec) => sum + parseFloat(sec.budget || 0), 0);

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Itinerary Builder...</div>;
  }

  if (!trip) {
    return (
      <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '3rem' }}>
          <h3 style={{ color: 'var(--danger)' }}>Trip not found</h3>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animated-fade" style={{ maxWidth: '900px', paddingTop: '2.5rem' }}>
      
      {/* Trip Header Widget */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-mid)', fontWeight: 700, textTransform: 'uppercase' }}>Active Itinerary Builder</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{trip.title}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <Compass size={14} /> Destination: {trip.destination_place} | <Calendar size={14} /> {trip.start_date} to {trip.end_date}
          </p>
        </div>
        <div style={{ background: 'var(--primary-light)', border: '1px solid var(--border-medium)', padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Sum Total Budget</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
            <Wallet size={20} /> ₹{totalBudget.toFixed(2)}
          </span>
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
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {/* Dynamic Sections Manager (Screen 5: Section 1, Section 2...) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {sections.map((section, idx) => (
          <div key={section.id} className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--primary-mid)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Section {idx + 1}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{section.title}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Wallet size={14} /> ₹{parseFloat(section.budget).toFixed(2)}
                </span>
                <button 
                  onClick={() => handleDeleteSection(section.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'var(--transition)' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--danger)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.85rem' }}>
              {section.description || 'No additional information details written.'}
            </p>

            {(section.start_date || section.end_date) && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={12} /> Date Range: {section.start_date || 'N/A'} to {section.end_date || 'N/A'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Add New Section Form - Screen 5 layout mapping */}
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <Plus size={20} style={{ color: 'var(--primary-mid)' }} />
          <span>Add Another Section Block</span>
        </h3>

        <form onSubmit={handleAddSection}>
          <div className="form-group">
            <label className="form-label">Section Title (e.g. Flight, Hotel Booking, Excursion)</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Enter section name"
              value={newSection.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Section Information & Details</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="This can be anything like travel details, flight numbers, hotel confirmation, address or key contact info..."
              value={newSection.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="start_date"
                className="form-input"
                value={newSection.start_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="end_date"
                className="form-input"
                value={newSection.end_date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Section Budget (INR)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>₹</span>
              <input
                type="number"
                name="budget"
                step="0.01"
                className="form-input"
                style={{ paddingLeft: '2rem' }}
                placeholder="0.00 INR"
                value={newSection.budget}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-secondary" style={{ flex: 1 }}>
              <Plus size={16} /> Add Section Block
            </button>
            <button 
              type="button" 
              onClick={() => navigate(`/trips/${id}`)} 
              className="btn btn-primary" 
              style={{ flex: 1 }}
            >
              Finish & View Itinerary <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default ItineraryBuilder;
