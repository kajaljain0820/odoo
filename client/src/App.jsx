import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import { ProtectedRoute, PublicRoute, AdminRoute } from './components/AuthRoute';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import TripListing from './pages/TripListing';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import ItineraryView from './pages/ItineraryView';
import Community from './pages/Community';
import CalendarView from './pages/CalendarView';
import AdminPanel from './pages/AdminPanel';
import PublicTripView from './pages/PublicTripView';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1, paddingBottom: '3rem' }}>
            <Routes>
              {/* Public Authentications */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              <Route path="/shared/:shareKey" element={<PublicTripView />} />

              {/* Private Dashboard Views */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Landing />} />
                <Route path="/trips" element={<TripListing />} />
                <Route path="/trips/create" element={<CreateTrip />} />
                <Route path="/trips/:id/build" element={<ItineraryBuilder />} />
                <Route path="/trips/:id" element={<ItineraryView />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route path="/community" element={<Community />} />
                
                {/* Admin Exclusive Views */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
              </Route>

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
