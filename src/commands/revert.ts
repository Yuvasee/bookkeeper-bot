import { Message, ParseMode } from 'node-telegram-bot-api';
import TelegramBot = require('node-telegram-bot-api');

import Command from '../interfaces/Command';
import Transaction from '../models/Transaction';
import { error } from '../views/error';
import { transaction } from '../views/transaction';

const revert: Command = {
    trigger: /^revert$/,

    reaction: (bot: TelegramBot) => (msg: Message, match: RegExpExecArray) => {
        Transaction.find()
            .sort({ createdAt: -1 })
            .findOneAndRemove((err, t) => {
                if (err) {
                    bot.sendMessage(msg.chat.id, error(err));
                } else {
                    bot.sendMessage(msg.chat.id, transaction(t) + '\n<b>Deleted</b>', {
                        parse_mode: 'HTML' as ParseMode,
                    });
                }
            });
    },
};

export default revert;