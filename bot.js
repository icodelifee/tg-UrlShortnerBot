const TeleBot = require('telebot');
const config = require('./config')
const bot = new TeleBot(config.botToken);
const userToken = config.bitlyToken
const urlCheck = require('url-regex');
const Bitly = require('bitlyapi');
const bitly = new Bitly(userToken);
const Bypasser = require('node-bypasser');

bot.on('text', (msg) => {
    var toShort = msg.text;
    if(msg.text.includes('/bp',0)){ return }
    if(msg.text.includes('/start',0)){ return }
    if(msg.text.includes('/help',0)){ return }
    var checkURL = urlCheck({ exact: true, strict: false }).test(toShort);
    if (checkURL === true) {
        if (toShort.indexOf('http' || 'https') === -1) {
            toShort = "https://" + toShort;
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

// General Commands

bot.on('/start', (msg) => {
    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton("Source Code", {url:"https://github.com/icodelifee/tg-UrlShortnerBot" })
        ],
        [
            bot.inlineButton("Support Chat",{ url: "https://t.me/itorrentsupport" })
        ]
    ])
    msg.reply.text(`<b>Hi ${msg.chat.first_name}, I Can Short And Bypass Yout Links.</b>\n-/help For More Info\n<code>Bot Developer : </code>@iCodeLife`, {
        asReply: true,
        parseMode: "html",
        replyMarkup
    }).catch((err) => console.log(err))
}
);

bot.on('/help', (msg) => {
    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton("Source Code", {url:"https://github.com/icodelifee/tg-UrlShortnerBot" })
        ],
        [
            bot.inlineButton("Support Chat",{ url: "https://t.me/itorrentbotsupport" })
        ]
    ])
    msg.reply.text(`<b>Hi ${msg.chat.first_name}, You Have Requested For Help!</b>\n`+
                    `\nHow To Use Bot 101:\n`+
                    `<b>To Short Url</b> - Copy Paste The Link And Send \n`+
                    `<b>To Bypass Url</b> - Use /bp Along With The Url You Want To Bypass\n`+
                    `\nSupported Websites For Bypassing:\n`+
                     `<code>Adf.ly\n`+
                     `Linkbucks.com (all alternative domains)\n`+
                     `Shorte.st (sh.st, u2ks.com, jnw0.com, digg.to, dh10thbvu.com)\n`+
                     `AdFoc.us\n`+
                     `Smsh.me\n`+
                     `P.pw\n`+
                     `LinkShrink.net\n`+
                     `Link5s.com\n`+
                     `Bc.vc\n`+
                     `NowVideo and AuroraVid (MP4/FLV video direct link will be extracted)\n`+
                     `All generic services that use simple 301/302 redirect (goo.gl, bit.ly, t.co,...)</code>\n`+
                     `\n<code>Bot Developer : </code>@iCodeLife`, {
        asReply: true,
        parseMode: "html",
        replyMarkup
    }).catch((err) => console.log(err))
});

bot.start();
