const fs = require("fs");
const path = require("path");
const { fetchMovies } = require("./fetchMovies");
const sendEmailNotification = require("./sendEmailNotification");

const checkForUpdates = async () => {
  const movieFilePath = path.join(__dirname, "movies.json");
  let previousMovies = [];
  let isFirstRun = false;

  if (!fs.existsSync(movieFilePath)) {
    fs.writeFileSync(movieFilePath, JSON.stringify([], null, 2));
    isFirstRun = true;
  } else {
    previousMovies = JSON.parse(fs.readFileSync(movieFilePath, "utf8"));
  }

  const movies = await fetchMovies();

  if (!isFirstRun) {
    const updatedMovies = movies.filter((movie) => {
      const previousMovie = previousMovies.find((m) => m.id === movie.id);
      return previousMovie && previousMovie.release_date !== movie.release_date;
    });

    const newMovies = movies.filter((movie) => {
      return !previousMovies.some((m) => m.id === movie.id);
    });

    const removedMovies = previousMovies.filter((movie) => {
      return !movies.some((m) => m.id === movie.id);
    });

    if (updatedMovies.length > 0) {
      console.log(`${updatedMovies.length} movies have updated release dates.`);
      for (const movie of updatedMovies) {
        const previousMovie = previousMovies.find((m) => m.id === movie.id);
        await sendEmailNotification(movie, previousMovie.release_date);
      }
    }

    if (newMovies.length > 0) {
      console.log(`${newMovies.length} new movies found.`);
      for (const movie of newMovies) {
        await sendEmailNotification(movie, "N/A");
      }
    }

    if (removedMovies.length > 0) {
      console.log(`${removedMovies.length} movies have been removed.`);
    }
  }

  fs.writeFileSync(movieFilePath, JSON.stringify(movies, null, 2));
};

module.exports = checkForUpdates;
