const axios = require("axios");

const { TMDB_API_KEY } = require("./constants");
const fetchMovies = async (pages = 5) => {
  let allMovies = [];
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  for (let page = 1; page <= pages; page++) {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: TMDB_API_KEY,
            language: "en-US",
            sort_by: "release_date.desc",
            with_original_language: "te",
            page: page,
            "release_date.gte": today, // Only get movies with a release date greater than or equal to today
          },
        }
      );
      allMovies = allMovies.concat(response.data.results);
    } catch (error) {
      console.error(`Error fetching movies from page ${page}:`, error);
      throw error;
    }
  }
  return allMovies;
};

const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
          append_to_response: "credits",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching movie details for movie ID ${movieId}:`,
      error
    );
    throw error;
  }
};

module.exports = { fetchMovies, fetchMovieDetails };
