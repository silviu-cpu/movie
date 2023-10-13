import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./MovieList.css";
import FavouriteMovies from "./FavouriteMovies";

const API_KEY = "7d785bcf7c0bd33928ae19591eae5e39";
const API_BASE_URL = "https://api.themoviedb.org/3/movie/";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState("popular");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("popular");
  const [favouriteMovies, setFavouriteMovies] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavouriteMovies(storedFavorites);
  }, []);

  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${category}`, {
        params: {
          api_key: API_KEY,
          language: "en-US",
          page: page,
        },
      });

      setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
      setError("Error fetching movies. Please try again later.");
    }
  }, [category, page]);

  useEffect(() => {
    fetchMovies();
  }, [category, page, fetchMovies]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setMovies([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const removeFromFavorites = (movieId) => {
    const updatedFavorites = favouriteMovies.filter(
      (favMovie) => favMovie.id !== movieId
    );
    setFavouriteMovies(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const toggleFavourite = (movie) => {
    const updatedFavorites = favouriteMovies.some(
      (favMovie) => favMovie.id === movie.id
    )
      ? favouriteMovies.filter((favMovie) => favMovie.id !== movie.id)
      : [...favouriteMovies, movie];

    setFavouriteMovies(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="movie-container">
      <div className="button-container">
        <button onClick={() => handleTabClick("popular")}>
          Movies Category
        </button>
        <button onClick={() => handleTabClick("favourites")}>
          Favourite Movies
        </button>
      </div>

      {activeTab === "popular" && (
        <div>
          <label htmlFor="category">Select Category:</label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="popular">Popular</option>
            <option value="top_rated">Top Rated</option>
            <option value="upcoming">Upcoming</option>
            <option value="now_playing">Now Playing</option>
          </select>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-spinner">Loading...</div>}
      {activeTab === "popular" && (
        <div className="movie-cards">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                className="movie-thumbnail"
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
              />
              <button
                onClick={() => toggleFavourite(movie)}
                className="add-to-favorites-button"
              >
                {favouriteMovies.some((favMovie) => favMovie.id === movie.id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
              <div className="movie-info">
                <h2 className="movie-title">{movie.title}</h2>
                <p className="release-date">
                  Release Date: {movie.release_date}
                </p>
                <p className="rating">Rating: {movie.vote_average}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "favourites" && favouriteMovies.length > 0 && (
        <FavouriteMovies
          favouriteMovies={favouriteMovies}
          removeFromFavorites={removeFromFavorites}
        />
      )}

      {activeTab === "favourites" && favouriteMovies.length === 0 && (
        <div className="no-favorites-message">
          No movies added yet to your Favourites.
        </div>
      )}

      {!loading && !error && activeTab === "popular" && (
        <button onClick={handleLoadMore} className="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
};

export default MovieList;
