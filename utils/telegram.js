const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

module.exports.sendMessage = function sendMessage(payload) {
    return bot.sendMessage(process.env.TELEGRAM_CHAT_ID, payload, { parse_mode: "HTML" });
}