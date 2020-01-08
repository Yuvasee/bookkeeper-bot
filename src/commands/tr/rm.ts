import { ParseMode } from 'node-telegram-bot-api';

import { Command } from '@v9v/nodejs-bot-engine';
import Transaction from '../../models/Transaction';
import { error } from '../../views/error';

const trRm: Command = {
    name: 'tr rm',

    reaction: bot => async (msg, match) => {
        const { text } = msg;

        const innerMatch = text.match(/^tr\s+rm\s+([a-fA-F\d]{24})\s*/);
        const [, id] = innerMatch;

        const chatId = msg.chat.id;
        const options = { parse_mode: 'HTML' as ParseMode };
        Transaction.findByIdAndDelete(id, (err, res) => {
            if (err) {
                bot.sendMessage(chatId, error(err), options);
            } else {
                !res && bot.sendMessage(chatId, `Transaction ${id} not found. Nothing done.`);
                res && bot.sendMessage(chatId, `Transaction ${res.id} deleted (-${res.sum} ${res.currency}).`);
            }
        });
    },
};

export default trRm;
