const TeleBot = require("telebot");
const urlCheck = require("url-regex");
const BitlyClient = require("bitly").BitlyClient;

const config = require("../config");
const bitly = new BitlyClient(config.bitlyToken);
const bot = new TeleBot(config.botToken);

const shortner = async (msg) => {
	const toShort = msg.text;
	if (["/bp", "/start", "/help"].some((sstr) => toShort === sstr)) return;
	const checkURL = urlCheck({ exact: true, strict: false }).test(toShort);
	if (checkURL) {
		if (toShort.indexOf("http" || "https") === -1) {
			toShort = "https://" + toShort;
		}
		const res = await bitly.shorten(toShort);
		const replyMarkup = bot.inlineKeyboard([
			[bot.inlineButton("🔄Refresh Clicks", { callback: "null" })],
		]);
		var clicks = 0;
		const toMsg =
			"<b>Your Short URL👇</b>\n\n" +
			"<b>🔗Long URL : </b>" +
			res.long_url +
			"\n<b>🔗Short URL : </b>" +
			res.id +
			"\n\n" +
			"🖱Total Clicks : " +
			clicks;
		msg.reply.text(toMsg, {
			asReply: true,
			parseMode: "html",
			replyMarkup,
		});
	} else {
		// Invalid URL
		msg.reply.text("Send A Valid URL [example: https://www.github.com]", {
			asReply: true,
			webPreview: false,
		});
	}
};
module.exports = shortner;
