import React from "react";
import "./MovieList.css";

const FavouriteMovies = ({ favouriteMovies, removeFromFavorites }) => {
  return (
    <div className="movie-container">
      <h1>Your's Favourite Movies</h1>
      {favouriteMovies.length === 0 ? (
        <div>No movies have been added to your Favorites yet.</div>
      ) : (
        <div className="movie-cards">
          {favouriteMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                className="movie-thumbnail"
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="movie-info">
                <h2 className="movie-title">{movie.title}</h2>
                <p className="release-date">
                  Release Date: {movie.release_date}
                </p>
                <p className="rating">Rating: {movie.vote_average}</p>
              </div>
              <button
                className="add-to-favorites-button"
                onClick={() => removeFromFavorites(movie.id)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouriteMovies;
