import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Star, MapPin, Wallet, X, Filter, ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL SEARCH DATABASE — 50+ activities across Indian & international cities
// ─────────────────────────────────────────────────────────────────────────────
const SEARCH_DATABASE = [
  // ─── PUNE ───────────────────────────────────────────────────────
  { id: 101, title: 'Shaniwar Wada Fort Tour', category: 'Heritage', city: 'Pune', tags: ['pune', 'fort', 'history', 'heritage'], rating: 4.6, cost: 250, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&h=250&q=80', description: 'Explore the iconic 18th-century Peshwa fortress. Guided tours cover the grand entrance, halls, and the famous sound-and-light show at sunset.' },
  { id: 102, title: 'Aga Khan Palace Visit', category: 'Heritage', city: 'Pune', tags: ['pune', 'palace', 'history', 'gandhi'], rating: 4.5, cost: 100, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&h=250&q=80', description: 'Visit the historical palace that served as Gandhi\'s prison. Features a museum with freedom movement artefacts and beautiful Italian gardens.' },
  { id: 103, title: 'Osho Meditation Resort', category: 'Wellness', city: 'Pune', tags: ['pune', 'meditation', 'wellness', 'osho', 'koregaon'], rating: 4.7, cost: 1200, image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=400&h=250&q=80', description: 'World-renowned meditation and wellness resort in Koregaon Park. Offers daily meditation sessions, therapy, and lush bamboo garden walks.' },
  { id: 104, title: 'Sinhagad Fort Trek', category: 'Trekking', city: 'Pune', tags: ['pune', 'trek', 'sinhagad', 'fort', 'nature'], rating: 4.8, cost: 500, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&h=250&q=80', description: 'Early morning trek to the famous Sinhagad fort with panoramic views of the Sahyadri mountains. Enjoy hot bhakri and curd at the top.' },
  { id: 105, title: 'Pune Food Walk — FC Road', category: 'Dining', city: 'Pune', tags: ['pune', 'food', 'street food', 'fc road', 'misal pav'], rating: 4.9, cost: 800, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=250&q=80', description: 'Guided food walk through FC Road covering misal pav, sabudana vada, vada pav, and local chai. Includes 8 tastings across iconic joints.' },
  { id: 106, title: 'Rajiv Gandhi Zoological Park', category: 'Nature', city: 'Pune', tags: ['pune', 'zoo', 'animals', 'katraj'], rating: 4.3, cost: 120, image: 'https://images.unsplash.com/photo-1503252947848-7338d3f92f31?auto=format&fit=crop&w=400&h=250&q=80', description: 'The Katraj zoo houses tigers, leopards, crocodiles, and a snake park. Great half-day outing for families and wildlife enthusiasts.' },

  // ─── MUMBAI ─────────────────────────────────────────────────────
  { id: 201, title: 'Gateway of India Boat Cruise', category: 'Sightseeing', city: 'Mumbai', tags: ['mumbai', 'gateway', 'boat', 'harbor', 'cruise'], rating: 4.5, cost: 350, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&h=250&q=80', description: 'Cruise along the Arabian Sea from Gateway of India to Elephanta Island. Enjoy skyline views and arrive at the UNESCO-listed cave temples.' },
  { id: 202, title: 'Dharavi Slum Tour', category: 'Culture', city: 'Mumbai', tags: ['mumbai', 'dharavi', 'slum', 'tour', 'social'], rating: 4.7, cost: 1500, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&h=250&q=80', description: 'Responsible guided tour of Asia\'s largest slum. Explores leather recycling, pottery, food industries, and community resilience stories.' },
  { id: 203, title: 'Bollywood Studio Tour', category: 'Entertainment', city: 'Mumbai', tags: ['mumbai', 'bollywood', 'film', 'studio', 'filmnagar'], rating: 4.6, cost: 2500, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=250&q=80', description: 'Go behind the scenes at a Bollywood film studio. Watch live sets, meet costume designers, and learn about India\'s film industry.' },
  { id: 204, title: 'Marine Drive Sunset Walk', category: 'Scenic', city: 'Mumbai', tags: ['mumbai', 'marine drive', 'sunset', 'walk', 'queen necklace'], rating: 4.8, cost: 0, image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=400&h=250&q=80', description: 'Walk along the famous "Queen\'s Necklace" promenade at golden hour. Watch the city light up as the sun dips below the Arabian Sea.' },
  { id: 205, title: 'Mumbai Street Food Crawl', category: 'Dining', city: 'Mumbai', tags: ['mumbai', 'food', 'street food', 'pav bhaji', 'vada pav'], rating: 4.9, cost: 900, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&h=250&q=80', description: 'Taste pav bhaji at Juhu Beach, vada pav at Dadar, and Irani chai at a century-old café. Covers 6 iconic spots across the city.' },

  // ─── GOA ────────────────────────────────────────────────────────
  { id: 301, title: 'Dudhsagar Waterfall Jeep Safari', category: 'Adventure', city: 'Goa', tags: ['goa', 'waterfall', 'jeep', 'dudhsagar', 'trek'], rating: 4.9, cost: 1800, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=250&q=80', description: 'Thrilling jeep ride through Western Ghats jungle to reach India\'s 5th tallest waterfall. Includes swimming, lunch, and spice plantation visit.' },
  { id: 302, title: 'Sunset Catamaran Cruise', category: 'Scenic', city: 'Goa', tags: ['goa', 'cruise', 'sunset', 'dolphin', 'boat'], rating: 4.7, cost: 1200, image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=400&h=250&q=80', description: 'Two-hour catamaran cruise to spot dolphins in the wild, then watch the Goan sunset with drinks on deck. Light snacks included.' },
  { id: 303, title: 'Old Goa Church Trail', category: 'Heritage', city: 'Goa', tags: ['goa', 'church', 'heritage', 'portuguese', 'bom jesus'], rating: 4.5, cost: 300, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&h=250&q=80', description: 'Guided trail of UNESCO-listed Portuguese-era churches including Bom Jesus Basilica and Se Cathedral. Covers 400 years of colonial history.' },
  { id: 304, title: 'Scuba Diving at Grande Island', category: 'Adventure', city: 'Goa', tags: ['goa', 'scuba', 'diving', 'water sports', 'ocean'], rating: 4.8, cost: 3500, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&h=250&q=80', description: 'Beginner-friendly scuba dive in the crystal-clear waters of Grande Island. Certified PADI instructor, all equipment included.' },

  // ─── DELHI ──────────────────────────────────────────────────────
  { id: 401, title: 'Red Fort Guided Tour', category: 'Heritage', city: 'Delhi', tags: ['delhi', 'red fort', 'mughal', 'history', 'heritage'], rating: 4.7, cost: 600, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&h=250&q=80', description: 'Expert-guided tour of the iconic Mughal fortress. Covers the Diwan-i-Khas, Rang Mahal, and the famous battlements with panoramic views.' },
  { id: 402, title: 'Old Delhi Food Walk', category: 'Dining', city: 'Delhi', tags: ['delhi', 'food', 'old delhi', 'chandni chowk', 'parantha'], rating: 4.9, cost: 1200, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&h=250&q=80', description: 'Walk through Chandni Chowk tasting butter chicken, paranthe wali gali, jalebi, and kulfi. Covers the city\'s 300-year-old culinary traditions.' },
  { id: 403, title: 'Qutub Minar Sunrise Visit', category: 'Heritage', city: 'Delhi', tags: ['delhi', 'qutub minar', 'minaret', 'morning', 'heritage'], rating: 4.6, cost: 400, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&h=250&q=80', description: 'Early morning guided visit to the tallest minaret in India before the crowds arrive. Spectacular golden light on the 73m sandstone tower.' },
  { id: 404, title: 'Humayun\'s Tomb Photography Walk', category: 'Culture', city: 'Delhi', tags: ['delhi', 'humayun', 'tomb', 'mughal', 'photography'], rating: 4.7, cost: 500, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&h=250&q=80', description: 'Guided photography session at the precursor to the Taj Mahal. Learn composition techniques while capturing stunning Mughal architecture.' },

  // ─── JAIPUR ─────────────────────────────────────────────────────
  { id: 501, title: 'Amber Fort Elephant Ride', category: 'Experience', city: 'Jaipur', tags: ['jaipur', 'amber fort', 'elephant', 'rajasthan', 'heritage'], rating: 4.8, cost: 2000, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&h=250&q=80', description: 'Majestic elephant ride up the ramparts of Amber Fort, then a guided tour of the mirror palace, sheesh mahal, and zenana chamber.' },
  { id: 502, title: 'Pink City Cycle Tour', category: 'Sightseeing', city: 'Jaipur', tags: ['jaipur', 'cycle', 'bike', 'pink city', 'old city'], rating: 4.7, cost: 800, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&h=250&q=80', description: 'Sunrise cycle through Jaipur\'s walled city covering Hawa Mahal, Jantar Mantar, and local bazaars. Ends with breakfast at a rooftop café.' },
  { id: 503, title: 'Rajasthani Cooking Class', category: 'Dining', city: 'Jaipur', tags: ['jaipur', 'cooking', 'rajasthani', 'dal baati', 'food'], rating: 4.9, cost: 1500, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=250&q=80', description: 'Hands-on cooking class in a haveli kitchen. Learn to make dal baati churma, gatte ki sabzi, and laal maas with a master chef.' },

  // ─── INTERNATIONAL ──────────────────────────────────────────────
  { id: 11, title: 'Paragliding Tandem Flight', category: 'Adventure', city: 'Interlaken', tags: ['interlaken', 'paragliding', 'adventure', 'swiss', 'flying'], rating: 4.9, cost: 18000, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&h=250&q=80', description: 'Soar above the pristine Swiss lakes of Thun and Brienz. Includes professional pilot, HD video footage, and transfer from Interlaken.' },
  { id: 12, title: 'Louvre Guided Art Tour', category: 'Culture', city: 'Paris', tags: ['paris', 'louvre', 'art', 'museum', 'mona lisa'], rating: 4.8, cost: 3800, image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=400&h=250&q=80', description: 'Skip the queue with a 2-hour guided highlights walk seeing the Mona Lisa, Venus de Milo, and Winged Victory with an art historian.' },
  { id: 13, title: 'Central Park Biking Tour', category: 'Sightseeing', city: 'New York', tags: ['new york', 'nyc', 'central park', 'bike', 'cycling'], rating: 4.7, cost: 2900, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&h=250&q=80', description: 'Guided bike ride through Central Park covering Strawberry Fields, Bethesda Fountain, and Bow Bridge. Bike and helmet included.' },
  { id: 14, title: 'Eiffel Tower Summit Access', category: 'Sightseeing', city: 'Paris', tags: ['paris', 'eiffel tower', 'summit', 'champagne', 'views'], rating: 4.8, cost: 5700, image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=400&h=250&q=80', description: 'Ascend to the top platform of the Eiffel Tower. Sip champagne at the summit lounge and admire panoramic Parisian vistas at sunset.' },
  { id: 15, title: 'Shibuya Food Tour (Ramen & Sushi)', category: 'Dining', city: 'Tokyo', tags: ['tokyo', 'shibuya', 'ramen', 'sushi', 'food', 'japan'], rating: 4.9, cost: 7100, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=250&q=80', description: 'Taste authentic ramen, fresh sushi, and yakitori in Shibuya\'s neon backalleys with a native food guide.' },
  { id: 16, title: 'Harder Kulm Funicular Ride', category: 'Scenic', city: 'Interlaken', tags: ['interlaken', 'funicular', 'mountain', 'viewpoint', 'swiss'], rating: 4.6, cost: 3400, image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&h=250&q=80', description: 'Steep funicular railway up Interlaken\'s local mountain with a glass-bottomed overlook and spectacular alpine panorama.' },
  { id: 17, title: 'London Eye Night Flight', category: 'Scenic', city: 'London', tags: ['london', 'london eye', 'ferris wheel', 'thames', 'night'], rating: 4.6, cost: 4200, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&h=250&q=80', description: 'Evening capsule ride on the iconic London Eye. See Big Ben, Tower Bridge, and The Shard illuminated against the London skyline.' },
  { id: 18, title: 'Tsukiji Fish Market & Sushi Breakfast', category: 'Dining', city: 'Tokyo', tags: ['tokyo', 'tsukiji', 'sushi', 'fish market', 'breakfast'], rating: 4.9, cost: 4500, image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=400&h=250&q=80', description: 'Early morning tuna auction at Tsukiji followed by the freshest sushi breakfast you\'ll ever have at a market-side counter.' },

  // ─── AGRA ───────────────────────────────────────────────────────
  { id: 601, title: 'Taj Mahal Sunrise Tour', category: 'Heritage', city: 'Agra', tags: ['agra', 'taj mahal', 'sunrise', 'mughal', 'wonder'], rating: 5.0, cost: 2500, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&h=250&q=80', description: 'Beat the crowds with a sunrise entry to the Taj Mahal. Watch the marble glow pink at dawn with an expert guide explaining its 370-year history.' },
  { id: 602, title: 'Agra Fort Night Tour', category: 'Heritage', city: 'Agra', tags: ['agra', 'fort', 'mughal', 'night', 'sound and light'], rating: 4.6, cost: 1200, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&h=250&q=80', description: 'Guided tour of Agra Fort including the sound-and-light show narrating the love story of Shah Jahan and Mumtaz Mahal.' },

  // ─── KERALA ─────────────────────────────────────────────────────
  { id: 701, title: 'Alleppey Houseboat Stay', category: 'Experience', city: 'Kerala', tags: ['kerala', 'houseboat', 'backwaters', 'alleppey', 'cruise'], rating: 4.9, cost: 8500, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=250&q=80', description: 'Overnight stay on a traditional Kerala kettuvallam through palm-fringed backwaters. All meals included with fresh seafood and toddy.' },
  { id: 702, title: 'Munnar Tea Estate Walk', category: 'Nature', city: 'Kerala', tags: ['kerala', 'munnar', 'tea', 'plantation', 'nature'], rating: 4.8, cost: 1000, image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=400&h=250&q=80', description: 'Guided walk through rolling tea gardens of Munnar. Visit the tea factory, learn the processing steps, and taste 6 premium varieties.' },
  { id: 703, title: 'Kathakali Dance Performance', category: 'Culture', city: 'Kerala', tags: ['kerala', 'kathakali', 'dance', 'classical', 'culture'], rating: 4.7, cost: 600, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&h=250&q=80', description: 'Evening Kathakali performance with pre-show makeup demonstration. One of India\'s most visually spectacular classical dance forms.' },
];

// All unique cities and categories for filter chips
const ALL_CITIES = [...new Set(SEARCH_DATABASE.map(i => i.city))].sort();
const ALL_CATEGORIES = [...new Set(SEARCH_DATABASE.map(i => i.category))].sort();

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { token } = useAuth();
  const [searchVal, setSearchVal] = useState(query);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [showAddModal, setShowAddModal] = useState(null);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // ── Filter results based on query + chips ──
  useEffect(() => {
    const lq = query.toLowerCase().trim();
    let filtered = SEARCH_DATABASE;

    if (lq) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(lq) ||
        item.city.toLowerCase().includes(lq) ||
        item.category.toLowerCase().includes(lq) ||
        item.tags.some(t => t.includes(lq)) ||
        item.description.toLowerCase().includes(lq)
      );
    }
    if (cityFilter) filtered = filtered.filter(i => i.city === cityFilter);
    if (categoryFilter) filtered = filtered.filter(i => i.category === categoryFilter);

    setResults(filtered);
  }, [query, cityFilter, categoryFilter]);

  // ── Live autocomplete suggestions ──
  useEffect(() => {
    const val = searchVal.toLowerCase().trim();
    if (!val || val.length < 2) { setSuggestions([]); return; }

    const seen = new Set();
    const sugg = [];

    SEARCH_DATABASE.forEach(item => {
      // City suggestions
      if (item.city.toLowerCase().includes(val) && !seen.has('city:' + item.city)) {
        seen.add('city:' + item.city);
        sugg.push({ type: 'city', label: item.city, icon: '📍' });
      }
      // Category suggestions
      if (item.category.toLowerCase().includes(val) && !seen.has('cat:' + item.category)) {
        seen.add('cat:' + item.category);
        sugg.push({ type: 'category', label: item.category, icon: '🏷️' });
      }
      // Activity suggestions
      if (item.title.toLowerCase().includes(val) && !seen.has('act:' + item.title)) {
        seen.add('act:' + item.title);
        sugg.push({ type: 'activity', label: item.title, sub: item.city, icon: '⭐' });
      }
      // Tag suggestions
      item.tags.forEach(tag => {
        if (tag.includes(val) && !seen.has('tag:' + tag)) {
          seen.add('tag:' + tag);
          sugg.push({ type: 'tag', label: tag, icon: '🔍' });
        }
      });
    });

    setSuggestions(sugg.slice(0, 8));
    setShowSuggestions(true);
  }, [searchVal]);

  useEffect(() => { fetchUserTrips(); }, []);

  const fetchUserTrips = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/trips', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
        if (data.length > 0) setSelectedTripId(data[0].id);
      }
    } catch (e) { console.error(e); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSearchParams({ q: searchVal });
  };

  const applySuggestion = (sugg) => {
    setShowSuggestions(false);
    setSearchVal(sugg.label);
    setSearchParams({ q: sugg.label });
    if (sugg.type === 'city') setCityFilter(sugg.label);
    if (sugg.type === 'category') setCategoryFilter(sugg.label);
  };

  const handleAddActivity = async () => {
    if (!selectedTripId || !showAddModal) return;
    try {
      const res = await fetch('http://localhost:5000/api/trips/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          tripId: selectedTripId,
          day_number: parseInt(selectedDay),
          activity_name: showAddModal.title,
          expense: parseFloat(showAddModal.cost),
          order: 99
        })
      });
      if (res.ok) {
        setMessage(`✅ "${showAddModal.title}" added to your trip!`);
        setTimeout(() => { setMessage(''); setShowAddModal(null); }, 2500);
      } else { setMessage('Failed to add activity.'); }
    } catch (e) { setMessage('Network error'); }
  };

  return (
    <div className="container animated-fade" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Search Activities &amp; Cities</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Find popular adventures, experiences and destinations to add to your plan
        </p>
      </div>

      {/* ── Search Bar with live autocomplete ── */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted-light)', zIndex: 1, pointerEvents: 'none' }} />
            <input
              ref={inputRef}
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.6rem', fontSize: '1rem' }}
              placeholder="Type a city, activity, or category… e.g. Pune, Trekking, Goa…"
              value={searchVal}
              onChange={e => { setSearchVal(e.target.value); }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              autoComplete="off"
            />
            {searchVal && (
              <button
                type="button"
                onClick={() => { setSearchVal(''); setSearchParams({}); setSuggestions([]); }}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted-light)', padding: 0 }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.75rem', fontSize: '0.95rem' }}>Search</button>
        </form>

        {/* Autocomplete Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 80,
            background: '#fff', border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
            zIndex: 200, overflow: 'hidden', marginTop: 4
          }}>
            {suggestions.map((sugg, i) => (
              <div
                key={i}
                onMouseDown={() => applySuggestion(sugg)}
                style={{
                  padding: '0.75rem 1rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  borderBottom: i < suggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <span style={{ fontSize: '1rem' }}>{sugg.icon}</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{sugg.label}</div>
                  {sugg.sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sugg.sub}</div>}
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sugg.type}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Filter Chips ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Filter size={13} /> Filter:
        </span>

        {/* City chips */}
        {ALL_CITIES.map(city => (
          <button
            key={city}
            onClick={() => setCityFilter(prev => prev === city ? '' : city)}
            style={{
              background: cityFilter === city ? 'var(--primary)' : '#fff',
              color: cityFilter === city ? '#fff' : 'var(--text-muted)',
              border: `1.5px solid ${cityFilter === city ? 'var(--primary)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.85rem', fontSize: '0.775rem', fontWeight: 600,
              cursor: 'pointer', transition: 'var(--transition)'
            }}
          >
            📍 {city}
          </button>
        ))}

        {/* Category chips */}
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(prev => prev === cat ? '' : cat)}
            style={{
              background: categoryFilter === cat ? 'var(--primary-dark)' : '#fff',
              color: categoryFilter === cat ? '#fff' : 'var(--text-muted)',
              border: `1.5px solid ${categoryFilter === cat ? 'var(--primary-dark)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.85rem', fontSize: '0.775rem', fontWeight: 600,
              cursor: 'pointer', transition: 'var(--transition)'
            }}
          >
            {cat}
          </button>
        ))}

        {(cityFilter || categoryFilter) && (
          <button
            onClick={() => { setCityFilter(''); setCategoryFilter(''); }}
            style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1.5px solid rgba(225,29,72,0.18)', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.85rem', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer' }}
          >
            <X size={12} style={{ marginRight: 3 }} /> Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--primary)', fontWeight: 700 }}>{results.length}</strong> result{results.length !== 1 ? 's' : ''}
          {query ? <> for <strong style={{ color: 'var(--primary)' }}>"{query}"</strong></> : ' — all activities'}
        </span>
      </div>

      {/* ── Results ── */}
      {results.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No results for "{query}"</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try searching for a different city (like <strong>Mumbai</strong>, <strong>Goa</strong>, <strong>Delhi</strong>, <strong>Jaipur</strong>) or activity type.
          </p>
          <button onClick={() => { setSearchVal(''); setSearchParams({}); setCityFilter(''); setCategoryFilter(''); }} className="btn btn-secondary">
            Show all activities
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.map(item => (
            <div key={item.id} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', overflow: 'hidden' }}>
              <img
                src={item.image} alt={item.title}
                style={{ width: '100%', height: '100%', minHeight: 160, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.category}</span>
                      <span style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <MapPin size={10} />{item.city}
                      </span>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={14} fill="#f59e0b" /> {item.rating}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.865rem', lineHeight: 1.55 }}>{item.description}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Wallet size={15} /> ₹{item.cost === 0 ? 'Free' : item.cost.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => setShowAddModal(item)}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.15rem', fontSize: '0.85rem' }}
                  >
                    <Plus size={15} /> Add to Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add to Trip Modal ── */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card animated-fade" style={{ width: '100%', maxWidth: 460, padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Add to Trip</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Adding <strong style={{ color: 'var(--primary)' }}>"{showAddModal.title}"</strong> (₹{showAddModal.cost.toLocaleString('en-IN')})
            </p>

            {message && (
              <div style={{ background: 'rgba(13,148,136,0.08)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {message}
              </div>
            )}

            {trips.length === 0 ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No active trips found.</p>
                <button onClick={() => navigate('/trips/create')} className="btn btn-secondary" style={{ width: '100%' }}>Create a Trip First</button>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Select Trip</label>
                  <select className="form-select" value={selectedTripId} onChange={e => setSelectedTripId(e.target.value)}>
                    {trips.map(t => <option key={t.id} value={t.id}>{t.title} ({t.destination_place})</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                  <label className="form-label">Day Number</label>
                  <select className="form-select" value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                    {[1,2,3,4,5,6,7,8,9,10].map(d => <option key={d} value={d}>Day {d}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={handleAddActivity} className="btn btn-primary" style={{ flex: 1 }}>Confirm Add</button>
                  <button onClick={() => setShowAddModal(null)} className="btn btn-secondary" style={{ width: 90 }}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SearchResults;
