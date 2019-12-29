import { startOfMonth, endOfMonth, format } from 'date-fns';

import Command from '../../interfaces/Command';
import Transaction, { TransactionDoc } from '../../models/Transaction';
import { error } from '../../views/error';

const trLs: Command = {
    name: 'tr ls',

    reaction: bot => async (msg, match) => {
        try {
            const transactions = await Transaction.find()
                .where('date')
                .gte(startOfMonth(new Date()))
                .lte(endOfMonth(new Date()));

            const strTransactions = transactions.map(tr => {
                let str = '';
                str += format(tr.date, 'DD/MM');
                str += ` -${tr.sum} ${tr.currency} `;
                str += ` :${tr.category}`;
                str += tr.tags.map(t => ' #' + t).join('');
                str += tr.description ? ` (${tr.description})` : '';
                str += ` [${tr.id}]`;
                return str;
            });

            const message = `${format(new Date(), 'MMMM YYYY')}:\n${strTransactions.join('\n')}`;

            bot.sendMessage(msg.chat.id, message);
        } catch (err) {
            bot.sendMessage(msg.chat.id, error(err));
        }
    },
};

export default trLs;
