require('dotenv').config();
import TelegramBot = require('node-telegram-bot-api');

import withDb from './db';

import Command from './interfaces/Command';

import minusSum from './commands/minusSum';
import rates from './commands/rates';
import revert from './commands/revert';
import stats from './commands/stats';

withDb(() => {
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    registerCommand(bot, minusSum);
    registerCommand(bot, rates);
    registerCommand(bot, revert);
    registerCommand(bot, stats);
});

function registerCommand(bot: TelegramBot, command: Command) {
    bot.onText(command.trigger, command.reaction(bot));

    bot.onText(/.*/, () => {});
}
