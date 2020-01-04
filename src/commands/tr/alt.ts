import { ParseMode } from 'node-telegram-bot-api';

import Command from '../../interfaces/Command';
import Transaction from '../../models/Transaction';
import { parseTransaction } from './_common';
import { error } from '../../views/error';
import { transaction } from '../../views/transaction';

const trAlt: Command = {
    name: 'tr alt',

    reaction: bot => async (msg, match) => {
        const { text } = msg;

        const innerMatch = text.match(/^tr\s+alt\s+([a-fA-F\d]{24})\s+(.*)/);
        const [, id, trString] = innerMatch;

        const tr = await Transaction.findById(id);

        if (!tr) {
            bot.sendMessage(msg.chat.id, `Transaction ${id} not found. Nothing done.`);
            return;
        }

        const tProps = parseTransaction(trString, tr);
        Object.assign(tr, tProps);

        const chatId = msg.chat.id;
        const options = { parse_mode: 'HTML' as ParseMode };
        tr.save((err: any) => {
            if (err) {
                bot.sendMessage(chatId, error(err), options);
            } else {
                bot.sendMessage(chatId, transaction(tr), options);
            }
        });
    },
};

export default trAlt;
