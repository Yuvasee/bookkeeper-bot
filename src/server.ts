require('dotenv').config();
const mongoose = require('mongoose');

import db from './mongo';

import minusSum from './commands/minusSum';
import rates from './commands/rates';
import revert from './commands/revert';
import stats from './commands/stats';

const telegraf = require('telegraf');
const bot = new telegraf(process.env.BOT_TOKEN);

const registerCommand = (c) => {
    bot.hears(c.re, c.cb);
};

registerCommand(minusSum);
registerCommand(revert);
registerCommand(stats);
registerCommand(rates);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.launch();

export {};
