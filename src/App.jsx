import { useState } from "react";
import fire from './assets/fire.png'
import star from './assets/glowing-star.png'
import party from './assets/partying-face.png'
import Navbar from "./components/Navbar";
import { MovieList } from "./components/MovieList";

function App() {
  return (
    <div className="bg-gray-900 ">
      <Navbar />
      <MovieList type={"popular"} title={"Popular"} emoji={fire} />
      <MovieList type={"top_rated"} title={"Top Rated"} emoji={star} />
      <MovieList type={"upcoming"} title={"Upcoming"} emoji={party} />
    </div>
  );
}

export default App;
