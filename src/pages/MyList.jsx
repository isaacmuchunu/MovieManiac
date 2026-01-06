import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';

const MyList = () => {
  const [myList, setMyList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    // Load from localStorage
    const savedList = localStorage.getItem('moovie-mylist');
    if (savedList) {
      setMyList(JSON.parse(savedList));
    }
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const removeFromList = (movieId) => {
    const newList = myList.filter(m => m.id !== movieId);
    setMyList(newList);
    localStorage.setItem('moovie-mylist', JSON.stringify(newList));
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-20">
      {/* Header */}
      <div className="px-4 md:px-14 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My List</h1>
        <p className="text-gray-400">
          {myList.length > 0
            ? `You have ${myList.length} title${myList.length !== 1 ? 's' : ''} in your list`
            : 'Your list is empty'}
        </p>
      </div>

      {/* Content */}
      <div className="px-4 md:px-14">
        {myList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {myList.map((movie, index) => (
              <div key={movie.id} className="relative group">
                <MovieCard
                  movie={movie}
                  index={index}
                  onClick={() => handleMovieClick(movie)}
                />
                <button
                  onClick={() => removeFromList(movie.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-netflix-red"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-netflix-medium-gray flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Your list is empty
            </h2>
            <p className="text-gray-400 max-w-md">
              Add movies and TV shows to your list by clicking the + button on any title.
              Your list will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default MyList;
