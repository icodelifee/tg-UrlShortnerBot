const TeleBot = require('telebot');
const config = require('./config');
const bot = new TeleBot(config.botToken);

const bypasser = require('./commands/bypass');
const start = require('./commands/start');
const shortner = require('./commands/shortner');
const help = require('./commands/help');
const callback = require('./commands/callbackhandler');

bot.on('text',shortner);

bot.on('callbackQuery', callback);

bot.on(/^\/bp (.+)$/, bypasser);

// General Commands
bot.on('/start', start);
bot.on('/help', help);

bot.start();
