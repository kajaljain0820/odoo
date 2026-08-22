import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, AlertCircle } from 'lucide-react';

const BG_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&auto=format&fit=crop&q=80';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', password: '',
    first_name: '', last_name: '',
    email: '', phone: '',
    city: '', photo_url: '',
    additional_info: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('Image must be less than 2MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, photo_url: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, first_name, last_name, email } = formData;
    if (!username || !password || !first_name || !last_name || !email) {
      setError('Please fill all required fields (*)');
      return;
    }
    try {
      setError(''); setLoading(true);
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different username/email.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

      {/* ── LEFT: Full-screen travel photo with zoom-in animation ── */}
      <div
        className="auth-photo-panel"
        style={{
          position: 'relative', overflow: 'hidden',
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(50,10,90,0.8) 0%, rgba(15,5,35,0.6) 100%)',
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', height: '100%',
          padding: '3rem 3.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img
              src="/logo.jpeg"
              alt="GlobalTrotter"
              style={{
                width: 36, height: 36, borderRadius: 10,
                objectFit: 'cover', flexShrink: 0
              }}
            />
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              GlobalTrotter
            </span>
          </div>

          <div>
            <div style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)', borderRadius: '999px',
              padding: '0.3rem 1rem', fontSize: '0.78rem', fontWeight: 600,
              color: 'rgba(255,255,255,0.9)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: '1.25rem'
            }}>
              🗺️ Start your journey today
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900,
              color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1rem'
            }}>
              Your adventure<br />starts here.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1rem', lineHeight: 1.65, maxWidth: 360 }}>
              Create an account to start planning trips, tracking budgets, and sharing your experiences with our community of 41k+ travellers.
            </p>
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem' }}>
              {[['128+', 'Countries'], ['9.4k', 'Itineraries'], ['41k', 'Travellers']].map(([val, label]) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{val}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
            📸 Open road, somewhere beautiful
          </p>
        </div>
      </div>

      {/* ── RIGHT: Register Form — slides in from right ── */}
      <div
        className="auth-panel-animate"
        style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          background: 'linear-gradient(160deg, #f8f4ff 0%, #fdf6ff 50%, #f0f4ff 100%)',
          padding: '2.5rem 3.5rem', overflowY: 'auto', position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,181,253,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '35%', right: '-20px', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Top purple accent strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)', backgroundSize: '200% 100%', animation: 'shimmer 2.5s infinite', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 440, paddingTop: '1rem', position: 'relative', zIndex: 1 }}>

          {/* Photo Upload — floating bob animation */}
          <div className="auth-row-animate" style={{ animationDelay: '0.05s', textAlign: 'center', marginBottom: '1.5rem' }}>
            <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'inline-block' }}>
              <div
                className="auth-avatar-float"
                style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 0.6rem',
                  background: formData.photo_url ? 'transparent' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  border: formData.photo_url ? '2.5px dashed #c4b5fd' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', transition: 'all 0.3s',
                  boxShadow: formData.photo_url ? 'none' : '0 8px 24px rgba(124,58,237,0.3)'
                }}
              >
                {formData.photo_url
                  ? <img src={formData.photo_url} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ textAlign: 'center' }}>
                      <Camera size={22} style={{ color: '#fff', display: 'block', margin: '0 auto 0.2rem' }} />
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Photo</span>
                    </div>
                }
              </div>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Click to upload photo</span>
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </div>

          {/* Heading — staggered row 2 */}
          <div className="auth-row-animate" style={{ animationDelay: '0.1s', marginBottom: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.75rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em', marginBottom: '0.3rem'
            }}>
              Create Account ✨
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#7c3aed', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
            </p>
          </div>

          {error && (
            <div className="auth-row-animate" style={{ animationDelay: '0.12s', background: '#fff1f2', border: '1px solid rgba(225,29,72,0.18)', color: '#e11d48', padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Row 1: First + Last — staggered row 3 */}
            <div className="auth-row-animate" style={{ animationDelay: '0.16s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input id="reg-first" type="text" name="first_name" style={inputStyle} placeholder="Rohan" value={formData.first_name} onChange={handleInputChange}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e9d8fd'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input id="reg-last" type="text" name="last_name" style={inputStyle} placeholder="Sharma" value={formData.last_name} onChange={handleInputChange}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e9d8fd'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>

            {/* Row 2: Email + Phone — staggered row 4 */}
            <div className="auth-row-animate" style={{ animationDelay: '0.22s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input id="reg-email" type="email" name="email" style={inputStyle} placeholder="rohan@email.com" value={formData.email} onChange={handleInputChange}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e9d8fd'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input id="reg-phone" type="tel" name="phone" style={inputStyle} placeholder="+91 98765 43210" value={formData.phone} onChange={handleInputChange}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e9d8fd'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>

            {/* Row 3: City + Username — staggered row 5 */}
            <div className="auth-row-animate" style={{ animationDelay: '0.28s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={labelStyle}>City</label>
                <input id="reg-city" type="text" name="city" style={inputStyle} placeholder="Mumbai" value={formData.city} onChange={handleInputChange}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e9d8fd'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <label style={labelStyle}>Username *</label>
                <input id="reg-username" type="text" name="username" style={inputStyle} placeholder="rohan_traveller" value={formData.username} onChange={handleInputChange}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e9d8fd'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>

            {/* Password — staggered row 6 */}
            <div className="auth-row-animate" style={{ animationDelay: '0.34s', marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Password *</label>
              <input id="reg-password" type="password" name="password" style={inputStyle} placeholder="Minimum 6 characters" value={formData.password} onChange={handleInputChange}
                onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e9d8fd'; e.target.style.boxShadow = 'none'; }} />
            </div>

            {/* About You — staggered row 7 */}
            <div className="auth-row-animate" style={{ animationDelay: '0.4s', marginBottom: '1.25rem' }}>
              <label style={labelStyle}>About You</label>
              <textarea
                id="reg-info" name="additional_info"
                style={{ ...inputStyle, minHeight: 68, resize: 'vertical' }}
                placeholder="Tell us your travel interests, dream destinations…"
                value={formData.additional_info} onChange={handleInputChange}
                onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e9d8fd'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Submit — staggered row 8 */}
            <div className="auth-row-animate" style={{ animationDelay: '0.46s' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '0.9rem',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: '#fff', border: 'none', borderRadius: '10px',
                  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.28)',
                  fontFamily: 'inherit', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(124,58,237,0.38)'; }}
                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(124,58,237,0.28)'; }}
              >
                {loading ? 'Creating account…' : 'Create Account 🚀'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700,
  color: '#374151', marginBottom: '0.35rem',
  textTransform: 'uppercase', letterSpacing: '0.05em'
};

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  border: '1.5px solid #ddd6fe', borderRadius: '10px',
  fontSize: '0.875rem', outline: 'none', background: '#f8f4ff',
  color: '#0f172a', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  fontFamily: 'inherit'
};

export default Register;
