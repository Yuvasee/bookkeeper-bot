import { Command } from '@v9v/nodejs-bot-engine';
import Transaction, { TransactionDoc } from '../../models/Transaction';
import { error } from '../../views/error';

const catsMerge: Command = {
    name: 'cats merge',
    reaction: bot => async (msg, match) => {
        try {
            bot.sendMessage(msg.chat.id, 'merge');
        } catch (err) {
            bot.sendMessage(msg.chat.id, error(err));
        }
    },
};

export default catsMerge;
