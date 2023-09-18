import React from "react";
import { useParams } from "react-router-dom";

const SingleMovie = () => {
  const { movieId } = useParams();
  return (
    <div className="flex items-center justify-center text-white">
      SingleMovie - {movieId}
    </div>
  );
};

export default SingleMovie;
