import { useEffect, useState } from "react";
import fire from "../assets/fire.png";
import MovieCard from "./MovieCard";
import FilterRating from "./FilterRating";

export const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=617c0260598c225e728db47b98d5ea6f"
      );
      const data = await res.json();
      setMovies(data.results.slice(0, 15));
      setFilteredMovies(data.results.slice(0, 15));
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleClick = (rate) => {
    if (rate === filterRating) {
      setFilterRating(0);
      setFilteredMovies(movies);
    } else {
      setFilterRating(rate);
      const filterRating = movies.filter((movie) => movie.vote_average >= rate);
      setFilteredMovies(filterRating);
    }
  };

  return (
    <div>
      <div className="pl-4 flex items-center justify-between font-poppins my-2">
        <header className="flex items-center">
          <img src={fire} alt="fire" className="h-4 w-4" />
          <h2 className="text-gray-200 text-xl font-semibold">Popular</h2>
        </header>

        <div className="flex items-center font-thin justify-end mx-2">
          <FilterRating
            filterRating={filterRating}
            onRatingClick={handleClick}
          />
          <select
            name="sort and filter"
            className="bg-gray-800 border border-gray-500 text-gray-200 rounded-md mx-2 px-1"
          >
            <option>Sort By</option>
            <option>Date</option>
            <option>Rating</option>
          </select>
          <select
            name=""
            className="bg-gray-800 border border-gray-500 text-gray-200 rounded-md px-1"
          >
            <option>Ascending</option>
            <option>Descending</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap justify-between pl-4">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
