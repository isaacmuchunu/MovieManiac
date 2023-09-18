import React from "react";
import Star from "../assets/star.png";
import {Link} from "react-router-dom"

const MovieCard = ({ movie }) => {
  return (
    <div className="w-48 h-80 relative rounded-md overflow-hidden shadow-lg m-4 ease-in-out duration-300">
      <Link to={`/movie/${movie.id}`} className="block" >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt="Movie Poster"
          className="w-full h-80 object-fit"
        />
        <div className="flex flex-col justify-end px-2 py-3 mb-2 absolute top-1 w-full h-full bg-transparent opacity-0 hover:opacity-100 duration-300 ease-in hover:ease-out">
          <h2 className="text-xl font-bold text-yellow-500">
            {movie.original_title}
          </h2>
          <div className="flex justify-between">
            <p className="text-gray-200 text-sm font-bold">
              {movie.release_date}
            </p>
            <div className="flex items-center text-gray-200 text-sm">
              <p className="mr-1">{movie.vote_average}</p>
              <img src={Star} alt="rating" className="w-4 h-4" />
            </div>
          </div>

          <p className="text-white text-xs italic font-thin px-1">
            {movie.overview.slice(0, 100) + "..."}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
