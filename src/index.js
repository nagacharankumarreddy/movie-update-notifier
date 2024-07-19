const cron = require("node-cron");
const checkForUpdates = require("./checkForUpdates");
const http = require("http");

// Start the HTTP server on port 3000
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Movie Update Notifier is running.");
});

server.listen(3000, () => {
  console.log("HTTP server running on port 3000.");
});

// Schedule the task to run every day
cron.schedule("0 0 * * *", checkForUpdates);

checkForUpdates().catch(console.error);
