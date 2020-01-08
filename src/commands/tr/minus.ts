import { Message, ParseMode } from 'node-telegram-bot-api';
import TelegramBot = require('node-telegram-bot-api');

import { Command } from '@v9v/nodejs-bot-engine';
import Transaction from '../../models/Transaction';
import { error } from '../../views/error';
import { transaction } from '../../views/transaction';
import { parseTransaction } from './_common';

const minus: Command = {
    name: 'minus',
    trigger: /^-\d+(?:[.,]\d+)?(?:[+\-*\/]\d+(?:[.,]\d+)?)*/,

    reaction: (bot: TelegramBot) => (msg: Message, match: RegExpExecArray) => {
        const { text } = msg;

        const tProps = parseTransaction(text, {
            date: new Date(),
            actor: msg.from.username,
            currency: 'ILS',
            category: 'Unsorted',
        });
        const t = new Transaction(tProps);

        const chatId = msg.chat.id;
        const options = { parse_mode: 'HTML' as ParseMode };

        t.save((err: any) => {
            if (err) {
                bot.sendMessage(chatId, error(err), options);
            } else {
                bot.sendMessage(chatId, transaction(t), options);
            }
        });
    },
};
export default minus;
