const cron = require("node-cron");
const checkForUpdates = require("./checkForUpdates");

// Schedule the task to run once a day at midnight
cron.schedule("* * * * *", checkForUpdates);

checkForUpdates().catch(console.error);
