import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Eagerly loaded pages (critical path)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy loaded pages for better initial load performance
const Movies = lazy(() => import("./pages/Movies"));
const TVShows = lazy(() => import("./pages/TVShows"));
const NewPopular = lazy(() => import("./pages/NewPopular"));
const MyList = lazy(() => import("./pages/MyList"));
const Search = lazy(() => import("./pages/Search"));
const MovieDetail = lazy(() => import("./components/MovieDetail"));
const Watch = lazy(() => import("./pages/Watch"));
const Browse = lazy(() => import("./pages/Browse"));
const Series = lazy(() => import("./pages/Series"));
const WatchHistory = lazy(() => import("./pages/WatchHistory"));
const Profiles = lazy(() => import("./pages/Profiles"));
const Kids = lazy(() => import("./pages/Kids"));

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ContentManagement = lazy(() => import("./pages/admin/ContentManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Settings = lazy(() => import("./pages/admin/Settings"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-netflix-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth pages without navbar/footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Watch page without navbar/footer */}
          <Route path="/watch/:type/:id" element={<Watch />} />

          {/* Admin panel with own layout */}
          <Route path="/admin/*" element={
            <AdminLayout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/content" element={<ContentManagement />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Suspense>
            </AdminLayout>
          } />

          {/* Main app with navbar/footer */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
              <Footer />
            </>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;