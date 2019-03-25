const TeleBot = require('telebot');
const config = require('./config')
const bot = new TeleBot(config.botToken);
const userToken = config.bitlyToken
const urlCheck = require('url-regex');
var Bitly = require('bitlyapi');
var bitly = new Bitly(userToken);
var Bypasser = require('node-bypasser');

bot.on('text', (msg) => {
    var toShort = msg.text;
    if(msg.text.includes('/bp',0)){ return }
    var checkURL = urlCheck({ exact: true, strict: false }).test(toShort);
    if (checkURL === true) {
        if (toShort.indexOf('http' || 'https') === -1) {
            toShort = "https://" + toShort;
        }
        var data = {
            long_url: toShort
        }
        bitly.shorten(toShort).then((res) => {
            let replyMarkup = bot.inlineKeyboard([
                [
                    bot.inlineButton('🔄Refresh Clicks', {callback: "null"} ),
                ]
            ]);
            var clicks = 0;
            var toMsg = "<b>Your Short URL👇</b>\n\n" +
                "<b>🔗Long URL : </b>" + res.data.long_url +
                "\n<b>🔗Short URL : </b>" + res.data.url + "\n\n" +
                "🖱Total Clicks : " + clicks;
            msg.reply.text(toMsg, {
                asReply: true,
                parseMode: 'html',
                replyMarkup
            })
        }).catch((err) => console.log(err));
    } else {
        // Invalid URL
        msg.reply.text("Send A Valid URL [example: https://www.github.com]", {
            asReply: true,
            webPreview: false
        })
    }
})
bot.on('callbackQuery', async (msg) => {
    const regex = /(http:\/\/bit.ly)\/(\w+)/gm;
    const str = msg.message.text;
    let callbackURL;
    callbackURL = regex.exec(str)[0];
    let getClicks = (callbackURL) => {
        return bitly.clicks(callbackURL).then((res) => { return res.data.clicks[0].user_clicks })
    }
    let clicks = await getClicks(callbackURL);
    callbackMsg = str.replace(/Clicks([\w\s\.].*)/m,"Clicks : "+clicks);
    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton('🔄Refresh Clicks', { callback: "null"}),
        ]
    ]);
    bot.editMessageText(
            {
                chatId: msg.message.chat.id,
                messageId: msg.message.message_id,
            },
            callbackMsg,
            {
                parse: 'html',
                replyMarkup

            }
        ).catch((err) => console.log(err));

})

bot.on(/^\/bp (.+)$/, (msg, props) => {
    const toBp = props.match[1];
    var bp = new Bypasser(toBp);
    bp.decrypt((err,res)=>{
        if(!err){
            var toMsg = "<b>Your Bypassed URL👇</b>\n\n" +
            "<b>🔗Shortened URL : </b>" + toBp +
            "\n<b>🔗Bypassed URL : </b>" +  res;
            msg.reply.text(toMsg, {
            asReply: true,
            parseMode: 'html',
        })
        }
        else{
            msg.reply.text("Sorry, Cannot Bypass The Given URL!", {
                asReply: true,
                parseMode: 'html',
            })
        }
    })
})

bot.start();
