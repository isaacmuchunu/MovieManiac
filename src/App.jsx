import { useState } from "react";
import fire from "./assets/fire.png";
import star from "./assets/glowing-star.png";
import party from "./assets/partying-face.png";
import Navbar from "./components/Navbar";
import { MovieList } from "./components/MovieList";
import { Routes, Route } from "react-router-dom";
import SingleMovie from "./components/SingleMovie";

function App() {
  return (
    <div className="bg-gray-900 ">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <MovieList type={"popular"} title={"Popular"} emoji={fire} />
          }
        />
        <Route
          path="/top_rated"
          element={
            <MovieList type={"top_rated"} title={"Top Rated"} emoji={star} />
          }
        />
        <Route
          path="/upcoming"
          element={
            <MovieList type={"upcoming"} title={"Upcoming"} emoji={party} />
          }
        />
        <Route path="/movie/:movieId" element={<SingleMovie/>} />
      </Routes>
    </div>
  );
}

export default App;
