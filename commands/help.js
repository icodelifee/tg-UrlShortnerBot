const TeleBot = require('telebot');
const config = require('../config');
const bot = new TeleBot(config.botToken);


const help = (msg) => {
	const replyMarkup = bot.inlineKeyboard([
		[bot.inlineButton('Source Code', { url: 'https://github.com/icodelifee/tg-UrlShortnerBot' })],
		[bot.inlineButton('Support Chat', { url: 'https://t.me/itorrentchat' })],
	]);
	msg.reply
		.text(
			`<b>Hi ${msg.chat.first_name}, You Have Requested For Help!</b>\n` +
				`\nHow To Use Bot 101:\n` +
				`<b>To Short Url</b> - Copy Paste The Link And Send \n` +
				`<b>To Bypass Url</b> - Use /bp Along With The Url You Want To Bypass\n` +
				`\nSupported Websites For Bypassing:\n` +
				`<code>Adf.ly\n` +
				`Linkbucks.com (all alternative domains)\n` +
				`Shorte.st (sh.st, u2ks.com, jnw0.com, digg.to, dh10thbvu.com)\n` +
				`AdFoc.us\n` +
				`Smsh.me\n` +
				`P.pw\n` +
				`LinkShrink.net\n` +
				`Link5s.com\n` +
				`Bc.vc\n` +
				`NowVideo and AuroraVid (MP4/FLV video direct link will be extracted)\n` +
				`All generic services that use simple 301/302 redirect (goo.gl, bit.ly, t.co,...)</code>\n` +
				`\n<code>Bot Developer : </code>@iCodeLife`,
			{
				asReply: true,
				parseMode: 'html',
				replyMarkup,
			}
		)
		.catch((err) => console.log(err));
};

module.exports = help;