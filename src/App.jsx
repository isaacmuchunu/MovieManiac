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

function App() {
  return (
    <div className="bg-netflix-black min-h-screen">
      <Routes>
        {/* Auth pages without navbar/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Watch page without navbar/footer */}
        <Route path="/watch/:contentId" element={<Watch />} />
        <Route path="/watch/:contentId/:episodeId" element={<Watch />} />

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
              <Route path="/kids" element={<Home />} />
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
