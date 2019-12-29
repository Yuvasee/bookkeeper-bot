import { startOfMonth, endOfMonth } from 'date-fns';
import { ParseMode } from 'node-telegram-bot-api';

import Command from '../../interfaces/Command';
import Transaction from '../../models/Transaction';
import { error } from '../../views/error';
import transactionListView from '../../views/transactionList';

const trLs: Command = {
    name: 'tr ls',

    reaction: bot => async (msg, match) => {
        try {
            const transactions = await Transaction.find()
                .where('date')
                .gte(startOfMonth(new Date()))
                .lte(endOfMonth(new Date()));

            const message = transactionListView(transactions);

            const options = { parse_mode: 'HTML' as ParseMode };

            bot.sendMessage(msg.chat.id, message, options);
        } catch (err) {
            bot.sendMessage(msg.chat.id, error(err));
        }
    },
};

export default trLs;
