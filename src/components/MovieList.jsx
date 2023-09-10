import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import FilterRating from "./FilterRating";
import _ from "lodash";
export const MovieList = ({type, title, emoji}) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filterRating, setFilterRating] = useState(0);
  const [sort, setSort] = useState({
    by: "default",
    order: "asc",
  });

  useEffect(() => {
    fetchMovies();
  }, []);
  useEffect(() => {
    if (sort.by !== "default") {
      const sortedMovies = _.orderBy(filteredMovies, [sort.by], [sort.order]);
      setFilteredMovies(sortedMovies);
    }
  }, [sort]);

  const fetchMovies = async () => {
    try {
      const res = await fetch(
`        https://api.themoviedb.org/3/movie/${type}?api_key=617c0260598c225e728db47b98d5ea6f
`      );
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
  const handleSort = (event) => {
    const { name, value } = event.target;
    setSort((prev) => {
      return { ...prev, [name]: value };
    });
    console.log(sort);
  };
  return (
    <div id={type}>
      <div className="pl-4 flex items-center justify-between font-poppins my-2">
        <header className="flex items-center">
          <img src={emoji} alt={`${emoji} Icon`} className="h-4 w-4" />
          <h2 className="text-gray-200 text-xl font-semibold">{title}</h2>
        </header>

        <div className="flex items-center font-thin justify-end mx-2">
          <FilterRating
            filterRating={filterRating}
            onRatingClick={handleClick}
            ratings={[8, 7, 6]}
          />
          <select
            name="by"
            onChange={handleSort}
            value={sort.by}
            className="bg-gray-800 border border-gray-500 text-gray-200 rounded-md mx-2 px-1"
          >
            <option value="Default">Sort By</option>
            <option value="release_date">Date</option>
            <option value="vote_average">Rating</option>
          </select>
          <select
            name="order"
            onChange={handleSort}
            value={sort.order}
            className="bg-gray-800 border border-gray-500 text-gray-200 rounded-md px-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
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
