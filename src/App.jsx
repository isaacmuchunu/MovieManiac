import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import NewPopular from "./pages/NewPopular";
import MyList from "./pages/MyList";
import Search from "./pages/Search";
import MovieDetail from "./components/MovieDetail";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Browse from "./pages/Browse";
import Series from "./pages/Series";
import WatchHistory from "./pages/WatchHistory";
import Profiles from "./pages/Profiles";
import Kids from "./pages/Kids";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentManagement from "./pages/admin/ContentManagement";
import UserManagement from "./pages/admin/UserManagement";
import Analytics from "./pages/admin/Analytics";

/**
 * Root application component that configures top-level routes and layouts.
 *
 * Sets up authentication routes (no global nav/footer), a watch route (no global nav/footer),
 * an admin section using its own layout and nested admin routes, and the main site routes
 * wrapped with the global Navbar and Footer. Several main routes are protected and require
 * authentication.
 *
 * @returns {JSX.Element} The root JSX element that renders the application's route tree and layouts.
 */
function App() {
  return (
    <div className="bg-netflix-black min-h-screen">
      <Routes>
        {/* Auth pages without navbar/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Watch page without navbar/footer */}
        <Route path="/watch/:type/:id" element={<Watch />} />

        {/* Admin panel with own layout */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/content" element={<ContentManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </AdminLayout>
        } />

        {/* Main app with navbar/footer */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/browse/:genre" element={<Browse />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv-shows" element={<TVShows />} />
              <Route path="/series/:seriesId" element={<Series />} />
              <Route path="/new" element={<NewPopular />} />
              <Route path="/my-list" element={
                <ProtectedRoute>
                  <MyList />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <WatchHistory />
                </ProtectedRoute>
              } />
              <Route path="/profiles" element={
                <ProtectedRoute>
                  <Profiles />
                </ProtectedRoute>
              } />
              <Route path="/search" element={<Search />} />
              <Route path="/movie/:movieId" element={<MovieDetail />} />
              <Route path="/kids" element={<Kids />} />
              <Route path="/browse-by-language" element={<Browse />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;