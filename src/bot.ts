require('dotenv').config();
import mongoose = require('mongoose');
import TelegramBot = require('node-telegram-bot-api');

import Command from './interfaces/Command';

import minusSum from './commands/minusSum';
import rates from './commands/rates';
import revert from './commands/revert';
import stats from './commands/stats';

mongoose.connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log('Connected to MongoDB');

    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    registerCommand(bot, minusSum);
    registerCommand(bot, rates);
    registerCommand(bot, revert);
    registerCommand(bot, stats);
});

function registerCommand(bot: TelegramBot, command: Command) {
    bot.onText(command.trigger, command.reaction(bot));
}
