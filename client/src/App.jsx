import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages — all placeholder stubs for Phase 0; real content added in later phases
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CreateTripPage from './pages/CreateTripPage.jsx';
import MyTripsPage from './pages/MyTripsPage.jsx';
import TripBuilderPage from './pages/TripBuilderPage.jsx';
import ItineraryViewPage from './pages/ItineraryViewPage.jsx';
import BudgetPage from './pages/BudgetPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import ExploreCitiesPage from './pages/ExploreCitiesPage.jsx';
import ExploreActivitiesPage from './pages/ExploreActivitiesPage.jsx';
import PublicTripPage from './pages/PublicTripPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Auth ─────────────────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* ── User screens ─────────────────────────────────────────────── */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/trips" element={<MyTripsPage />} />
        <Route path="/trips/new" element={<CreateTripPage />} />
        <Route path="/trips/:id/build" element={<TripBuilderPage />} />
        <Route path="/trips/:id" element={<ItineraryViewPage />} />
        <Route path="/trips/:id/budget" element={<BudgetPage />} />
        <Route path="/trips/:id/calendar" element={<CalendarPage />} />

        {/* ── Catalogue ────────────────────────────────────────────────── */}
        <Route path="/explore/cities" element={<ExploreCitiesPage />} />
        <Route path="/explore/activities" element={<ExploreActivitiesPage />} />

        {/* ── Public share ─────────────────────────────────────────────── */}
        <Route path="/s/:slug" element={<PublicTripPage />} />

        {/* ── Profile & admin ──────────────────────────────────────────── */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* ── Catch-all ────────────────────────────────────────────────── */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
