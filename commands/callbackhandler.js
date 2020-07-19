const TeleBot = require('telebot');
const config = require('../config');
const Bitly = require('bitlyapi');

const userToken = config.bitlyToken;

const bot = new TeleBot(config.botToken);
const bitly = new Bitly(userToken);

const callback = async (msg) => {
	const regex = /(https:\/\/bit.ly)\/(\w+)/gm;
	const str = msg.message.text;
	const callbackURL = regex.exec(str)[0];
	const res = await bitly.clicks(callbackURL);
	const clicks = res.data.clicks[0].user_clicks;
	callbackMsg = str.replace(/Clicks([\w\s\.].*)/m, 'Clicks : ' + clicks);
	const replyMarkup = bot.inlineKeyboard([[bot.inlineButton('🔄Refresh Clicks', { callback: 'null' })]]);
	const msgParams = {
		chatId: msg.message.chat.id,
		messageId: msg.message.message_id,
	};
	bot.editMessageText(msgParams, callbackMsg, {
		parse: 'html',
		replyMarkup,
	}).catch((err) => console.log(err));
};

module.exports = callback;
