import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const BG_IMAGE = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&auto=format&fit=crop&q=80';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('Please fill in all fields'); return; }
    try {
      setError(''); setLoading(true);
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
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
          background: 'linear-gradient(135deg, rgba(60,20,100,0.75) 0%, rgba(20,10,40,0.55) 100%)',
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', height: '100%',
          padding: '3rem 3.5rem',
        }}>
          {/* Logo */}
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

          {/* Hero text */}
          <div>
            <div style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)', borderRadius: '999px',
              padding: '0.3rem 1rem', fontSize: '0.78rem', fontWeight: 600,
              color: 'rgba(255,255,255,0.9)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: '1.25rem'
            }}>
              🌍 Your next adventure awaits
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900,
              color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em',
              marginBottom: '1rem'
            }}>
              Plan the trip,<br />not the paperwork.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1rem', lineHeight: 1.65, maxWidth: 380 }}>
              Build itineraries day by day, track budgets as you go, and see what other travellers actually did when they got there.
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
            📸 Lake Tahoe, California
          </p>
        </div>
      </div>

      {/* ── RIGHT: Login Form — slides in from right ── */}
      <div
        className="auth-panel-animate"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(160deg, #f8f4ff 0%, #fdf6ff 50%, #f0f4ff 100%)',
          padding: '3rem 4rem', position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,181,253,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '-30px', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Top purple accent strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)', backgroundSize: '200% 100%', animation: 'shimmer 2.5s infinite', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

          {/* Floating logo icon */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src="/logo.jpeg"
              alt="GlobalTrotter Logo"
              className="auth-avatar-float"
              style={{
                width: 72, height: 72, borderRadius: '50%',
                margin: '0 auto 1rem',
                objectFit: 'cover',
                border: '3px solid #7c3aed',
                boxShadow: '0 8px 24px rgba(124,58,237,0.3)'
              }}
            />
          </div>

          {/* Header — staggered row 1 */}
          <div className="auth-row-animate" style={{ animationDelay: '0.05s', marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '2rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em', marginBottom: '0.4rem'
            }}>Welcome back 👋</h2>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Sign in to pick up where your last trip left off.
            </p>
          </div>

          {error && (
            <div className="auth-row-animate" style={{ animationDelay: '0.1s', background: '#fff1f2', border: '1px solid rgba(225,29,72,0.18)', color: '#e11d48', padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Username — staggered row 2 */}
            <div className="auth-row-animate" style={{ animationDelay: '0.12s' }}>
              <label style={labelStyle}>Username</label>
              <input
                id="login-username"
                type="text"
                placeholder="john"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.12)'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#ddd6fe'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8f4ff'; }}
              />
            </div>

            {/* Password — staggered row 3 */}
            <div className="auth-row-animate" style={{ animationDelay: '0.2s' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e9d8fd'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot — staggered row 4 */}
            <div className="auth-row-animate" style={{ animationDelay: '0.28s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#6b7280', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#7c3aed', width: 14, height: 14 }} />
                Remember me
              </label>
              <span style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 600, cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>

            {/* Submit — staggered row 5 */}
            <div className="auth-row-animate" style={{ animationDelay: '0.36s' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '0.9rem',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: '#fff', border: 'none', borderRadius: '10px',
                  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.28)',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(124,58,237,0.38)'; }}
                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(124,58,237,0.28)'; }}
              >
                {loading ? 'Signing in…' : 'Log in →'}
              </button>
            </div>
          </form>

          {/* Footer link — staggered row 6 */}
          <p className="auth-row-animate" style={{ animationDelay: '0.44s', marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            New here?{' '}
            <Link to="/register" style={{ color: '#7c3aed', fontWeight: 700, textDecoration: 'none' }}>
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block', fontSize: '0.8rem', fontWeight: 700,
  color: '#374151', marginBottom: '0.4rem',
  textTransform: 'uppercase', letterSpacing: '0.05em'
};

const inputStyle = {
  width: '100%', padding: '0.8rem 1rem',
  border: '1.5px solid #ddd6fe', borderRadius: '10px',
  fontSize: '0.95rem', outline: 'none', background: '#f8f4ff',
  color: '#0f172a', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  fontFamily: 'inherit'
};

export default Login;
