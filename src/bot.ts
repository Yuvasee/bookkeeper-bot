require('dotenv').config();
import TelegramBot = require('node-telegram-bot-api');

import withDb from './db';

import { createBot } from './engine';

import minus from './commands/tr/minus';
import dump from './commands/dump';
import rates from './commands/rates';
import revert from './commands/revert';
import stats from './commands/stats';
import hi from './commands/hi';

import trSet from './commands/tr';
import catsSet from './commands/cats';

const { botToken, mongoString } = getEnvs();

withDb(mongoString, () => {
    const telegramApi = new TelegramBot(botToken, { polling: true });

    createBot(telegramApi)
        .registerCommand(minus)
        .registerCommand(dump)
        .registerCommand(rates)
        .registerCommand(revert)
        .registerCommand(stats)
        .registerCommand(hi)
        .registerCommandSet(trSet)
        .registerCommandSet(catsSet)
        .registerFallback();
});

function getEnvs() {
    if (!process.env.BOT_TOKEN) {
        throw new Error('No bot token found');
    }
    if (!process.env.MONGO_STRING) {
        throw new Error('No DB string found');
    }
    return {
        botToken: process.env.BOT_TOKEN,
        mongoString: process.env.MONGO_STRING,
    };
}
