require('dotenv').config();
import TelegramBot = require('node-telegram-bot-api');

import withDb from './db';

import { createBot } from './engine';

import minus from './commands/minus';
import dump from './commands/dump';
import rates from './commands/rates';
import revert from './commands/revert';
import stats from './commands/stats';
import hi from './commands/hi';
import catsSet from './commands/cats';

withDb(() => {
    const telegramApi = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    createBot(telegramApi)
        .registerCommand(minus)
        .registerCommand(dump)
        .registerCommand(rates)
        .registerCommand(revert)
        .registerCommand(stats)
        .registerCommand(hi)
        .registerCommandSet(catsSet)
        .registerFallback();
});
