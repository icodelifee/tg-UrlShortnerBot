const Bypasser = require('node-bypasser');
const TeleBot = require('telebot');
const config = require('../config');
const bot = new TeleBot(config.botToken);

const bypass = async (msg, props) => {
	const toBp = props.match[1];
	const bp = new Bypasser(toBp);
	const msgOptions = {
		asReply: true,
		parseMode: 'html',
	};
	bp.decrypt((err, res) => {
		if (!err) {
			const toMsg =
				'<b>Your Bypassed URL👇</b>\n\n' + `<b>🔗Shortened URL : </b>${toBp}``\n<b>🔗Bypassed URL : </b>${res}`;
			msg.reply.text(toMsg, msgOptions);
		} else msg.reply.text('Sorry, Cannot Bypass The Given URL!', msgOptions);
	});
};

module.exports = bypass;
