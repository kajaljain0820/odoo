import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Send, Compass, MessageSquare, Tag, User as UserIcon, MapPin } from 'lucide-react';

const Community = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchFeed(); }, [searchQuery]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/community';
      if (searchQuery) url += `?search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setPosts(await res.json());
    } catch (e) { setError('Failed to load community feed'); }
    finally { setLoading(false); }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content: newPostContent, activity_or_place: newPostTag })
      });
      if (res.ok) {
        const created = await res.json();
        setPosts(prev => [created, ...prev]);
        setNewPostContent('');
        setNewPostTag('');
      }
    } catch (e) { setError('Error posting'); }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <div className="container animated-fade" style={{ maxWidth: 820, paddingTop: '2.5rem', paddingBottom: '3rem' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Community Tab</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Share travel experiences, tips, and discover what other travellers have done
        </p>
      </div>

      {/* Search + Sort bar (Screen 10) */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted-light)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by tags, keywords, or places…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <select className="form-select" style={{ width: 'auto', fontSize: '0.875rem', padding: '0.7rem 1rem' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* Compose Post Card */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          {/* Current user avatar */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--border-color)', overflow: 'hidden'
          }}>
            {user?.photo_url
              ? <img src={user.photo_url} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <UserIcon size={20} style={{ color: 'var(--primary)' }} />
            }
          </div>
          <form onSubmit={handlePostSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <textarea
              className="form-textarea"
              style={{ minHeight: 85, resize: 'vertical' }}
              placeholder="Share your experience about a trip or activity…"
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
                <MapPin size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted-light)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.2rem', fontSize: '0.85rem', padding: '0.55rem 0.85rem 0.55rem 2.2rem' }}
                  placeholder="Tag a place or activity…"
                  value={newPostTag}
                  onChange={e => setNewPostTag(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>
                <Send size={14} /> Share
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading community feed…</div>
      ) : sortedPosts.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No posts yet — be the first to share!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sortedPosts.map(post => {
            const author = post.user || {};
            return (
              <div key={post.id} className="glass-card animated-fade" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>

                  {/* Avatar circle (Screen 10 wireframe) */}
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1.5px solid var(--border-color)', overflow: 'hidden'
                  }}>
                    {author.photo_url
                      ? <img src={author.photo_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <UserIcon size={20} style={{ color: 'var(--primary-mid)' }} />
                    }
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                          {author.first_name} {author.last_name}
                        </span>
                        <span style={{ color: 'var(--text-muted-light)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>@{author.username}</span>
                        <span style={{ color: 'var(--text-muted-light)', fontSize: '0.8rem', marginLeft: '0.75rem' }}>
                          {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {post.activity_or_place && (
                        <span style={{
                          background: 'var(--primary-light)', color: 'var(--primary)',
                          fontSize: '0.72rem', fontWeight: 700,
                          padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)',
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                        }}>
                          <MapPin size={11} /> {post.activity_or_place}
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {post.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;
