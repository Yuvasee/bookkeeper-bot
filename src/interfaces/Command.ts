import TelegramBot = require('node-telegram-bot-api');
import { Message } from 'node-telegram-bot-api';

export default interface Command {
    trigger: RegExp;
    reaction: (bot: TelegramBot) => (msg: Message, match: RegExpExecArray) => void;
}
