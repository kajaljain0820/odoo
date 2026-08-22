import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/trips') ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return '';
    const f = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const l = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    return `${f}${l}`;
  };

  return (
    <header style={{ 
      background: 'var(--bg-primary)', 
      borderBottom: '1px solid var(--border-color)', 
      position: 'sticky', top: 0, zIndex: 100 
    }}>
      <div className="container" style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        height: '64px', padding: '0 1.5rem' 
      }}>
        
        {/* Left Section: Logo, Search, and Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginRight: '0.5rem' }}>
            <img
              src="/logo.jpeg"
              alt="GlobalTrotter Logo"
              style={{
                width: '30px', height: '30px',
                borderRadius: '8px', objectFit: 'cover', flexShrink: 0
              }}
            />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a1a24', letterSpacing: '-0.01em' }}>
              GlobalTrotter
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ 
            width: '280px', display: 'flex', alignItems: 'center',
            background: '#f8f6fb', borderRadius: '999px',
            padding: '3px', position: 'relative', border: '1px solid #f0edf7'
          }}>
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '0 1rem', fontSize: '0.85rem', color: 'var(--text-main)'
              }}
            />
            <button type="submit" style={{
              background: '#9b7bcf', color: 'white', border: 'none',
              width: '30px', height: '30px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0
            }}>
              <Search size={14} />
            </button>
          </form>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.5rem' }}>
            <Link to="/" style={navLinkStyle(isActive('/'))}>Home</Link>
            <Link to="/calendar" style={navLinkStyle(isActive('/calendar'))}>Calendar</Link>
            <Link to="/community" style={navLinkStyle(isActive('/community'))}>Community</Link>
            {user.is_admin && (
              <Link to="/admin" style={navLinkStyle(isActive('/admin'))}>Admin</Link>
            )}
          </nav>
        </div>

        {/* Right Section: Actions & Avatar (Logo at the end) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/trips/create" style={{ 
            fontSize: '0.875rem', fontWeight: 600, color: '#4a4a5a', 
            textDecoration: 'none' 
          }}>
            Plan a trip
          </Link>
          
          <button onClick={handleLogout} style={{
            background: '#5b456e', color: 'white', border: 'none',
            padding: '0.5rem 1.1rem', borderRadius: '999px',
            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
          }}>
            Sign out
          </button>

          {/* User "Logo" (Avatar) at the end */}
          <Link to="/profile" style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: '#ebdfff', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, color: '#5b456e',
            textDecoration: 'none'
          }}>
            {getInitials()}
          </Link>
        </div>
      </div>
    </header>
  );
};

// Helper for nav link styling to match the reference exactly
const navLinkStyle = (isActive) => ({
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: isActive ? '#5b456e' : '#717180',
  background: isActive ? '#ebdfff' : 'transparent',
  padding: '0.4rem 1rem',
  borderRadius: '999px',
  transition: 'all 0.2s'
});

export default Header;
