require('dotenv').config();
import TelegramBot = require('node-telegram-bot-api');

import withDb from './db';

import { registerCommand, registerCommandSet } from './engine';

import minusSum from './commands/minusSum';
import makeDump from './commands/makeDump';
import rates from './commands/rates';
import revert from './commands/revert';
import stats from './commands/stats';
import hi from './commands/hi';
import catsSet from './commands/cats';

withDb(() => {
    const telegramApi = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    registerCommand(telegramApi, minusSum);
    registerCommand(telegramApi, makeDump);
    registerCommand(telegramApi, rates);
    registerCommand(telegramApi, revert);
    registerCommand(telegramApi, stats);
    registerCommand(telegramApi, hi);
    registerCommandSet(telegramApi, catsSet);
});
