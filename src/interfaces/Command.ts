import TelegramBot = require('node-telegram-bot-api');

export default interface Command {
    trigger: RegExp;
    reaction: (bot: TelegramBot) => (ctx: any, next: any) => void;
}
