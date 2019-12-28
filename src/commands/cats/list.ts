import Command from '../../interfaces/Command';
import Transaction, { TransactionDoc } from '../../models/Transaction';
import { error } from '../../views/error';

const catsList: Command = {
    name: 'cats list',
    reaction: bot => async (msg, match) => {
        try {
            bot.sendMessage(msg.chat.id, 'list');
        } catch (err) {
            bot.sendMessage(msg.chat.id, error(err));
        }
    },
};

export default catsList;
