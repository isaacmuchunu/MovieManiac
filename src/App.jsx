import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import NewPopular from "./pages/NewPopular";
import MyList from "./pages/MyList";
import Search from "./pages/Search";
import MovieDetail from "./components/MovieDetail";
import Watch from "./pages/Watch";

function App() {
  return (
    <div className="bg-netflix-black min-h-screen">
      <Routes>
        {/* Watch page without navbar/footer */}
        <Route path="/watch/:movieId" element={<Watch />} />

        {/* Main app with navbar/footer */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv-shows" element={<TVShows />} />
              <Route path="/new" element={<NewPopular />} />
              <Route path="/my-list" element={<MyList />} />
              <Route path="/search" element={<Search />} />
              <Route path="/movie/:movieId" element={<MovieDetail />} />
              <Route path="/kids" element={<Home />} />
              <Route path="/browse-by-language" element={<Movies />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
