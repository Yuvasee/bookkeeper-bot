require('dotenv').config();
import TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

import minusSum from './commands/minusSum';
import rates from './commands/rates';
import Command from './interfaces/Command';

mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log('Connected to MongoDB');

    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    registerCommand(bot, minusSum);
    registerCommand(bot, rates);
});

// import revert from './commands/revert';
// import stats from './commands/stats';

// registerCommand(revert);
// registerCommand(stats);

function registerCommand(bot: TelegramBot, command: Command) {
    bot.onText(command.trigger, command.reaction(bot));
}
