import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './MovieList.css'; // Import your CSS file for movie cards

const API_KEY = '7d785bcf7c0bd33928ae19591eae5e39'; // Replace with your TMDB API key
const API_BASE_URL = 'https://api.themoviedb.org/3/movie/';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState('popular');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${category}`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: page,
        },
      });

      setMovies(prevMovies => [...prevMovies, ...response.data.results]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
      setError('Error fetching movies. Please try again later.');
    }
  }, [category, page]);

  useEffect(() => {
    fetchMovies();
  }, [category, page, fetchMovies]);

  const handleCategoryChange = event => {
    setCategory(event.target.value);
    setMovies([]); // clear existing movies when category changes
    setPage(1); // reset page to 1 when category changes
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="movie-container">
      <h1>Popular Movies</h1>
      <div>
        <label htmlFor="category">Select Category:</label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="popular">Popular</option>
          <option value="top_rated">Top Rated</option>
          <option value="upcoming">Upcoming</option>
          <option value="now_playing">Now Playing</option>
        </select>
      </div>
      <div className="movie-cards">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img
              className="movie-thumbnail"
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="movie-info">
              <h2 className="movie-title">{movie.title}</h2>
              <p className="release-date">Release Date: {movie.release_date}</p>
              <p className="rating">Rating: {movie.vote_average}</p>
            </div>
          </div>
        ))}
      </div>
      {!loading && !error && (
        <button onClick={handleLoadMore} className="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
};

export default MovieList;
