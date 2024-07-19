const cron = require("node-cron");
const checkForUpdates = require("./checkForUpdates");
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.get("/movies", (req, res) => {
  const movieFilePath = path.join(__dirname, "/movies.json");

  console.log(`Checking for movies.json at: ${movieFilePath}`);

  if (fs.existsSync(movieFilePath)) {
    const content = fs.readFileSync(movieFilePath, "utf8");
    const movies = JSON.parse(content);

    const filteredMovies = movies.map((movie) => ({
      original_title: movie.original_title,
      release_date: movie.release_date,
    }));

    res.json(filteredMovies);
  } else {
    console.error("movies.json not found.");
    res.status(404).send("movies.json not found.");
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Movie Update Notifier is running smoothly.",
    timestamp: new Date().toISOString(),
  });
});

// Start the HTTP server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`HTTP server running on port ${port}.`);
});

// Schedule the task to run every day
cron.schedule("0 0 * * *", checkForUpdates);

// Run checkForUpdates initially
checkForUpdates().catch(console.error);
