const TeleBot = require("telebot");
const config = require("../config");
const axios = require("axios");
const bot = new TeleBot(config.botToken);

const instance = axios.create({
  baseURL: "https://api-ssl.bitly.com/v4/bitlinks/",
  timeout: 1000,
  headers: { Authorization: "Bearer " + config.bitlyToken },
});

const callback = async (msg) => {
  const regex = /(bit.ly)\/(\w+)/gm;
  const str = msg.message.text;
  const callbackURL = regex.exec(str)[0];
  const clicks = await getTotalClicks(callbackURL);
  callbackMsg = str.replace(/Clicks([\w\s\.].*)/m, "Clicks : " + clicks);
  const replyMarkup = bot.inlineKeyboard([
    [bot.inlineButton("🔄Refresh Clicks", { callback: "null" })],
  ]);
  const msgParams = {
    chatId: msg.message.chat.id,
    messageId: msg.message.message_id,
  };
  bot
    .editMessageText(msgParams, callbackMsg, {
      parse: "html",
      replyMarkup,
    })
    .catch((err) => console.log(err));
};
async function getTotalClicks(callbackURL) {
  const url = `${callbackURL}/clicks/summary`;
  const res = await instance.get(url);
  return res.data.total_clicks;
}

module.exports = callback;
