/**
 * The Bot Itself
 */
"use strict";
const path = require("path");
const Bot = require('@menome/botframework');
const config = require("../config/config.json");
const configSchema = require("./config-schema");
const uncrawler = require("./uncrawler");

// Start the actual bot here.
var bot = new Bot({
  config: {
    "name": "UNCrawler",
    "desc": "Removes files from the DB when they have been removed from their source system.",
    ...config
  },
  configSchema
});

// Let our middleware use these.
bot.web.use((req,res,next) => {
  req.uncrawler = new uncrawler(bot);
  next();
});

// Register controller middleware.
bot.registerControllers(path.join(__dirname+"/controllers"));

bot.start();
bot.changeState({state: "idle"});