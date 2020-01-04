import Command from '../../interfaces/Command';
import Transaction, { TransactionDoc } from '../../models/Transaction';
import { error } from '../../views/error';

interface CountAggregation {
    _id: string;
    count: number;
}

const catsLs: Command = {
    name: 'cats ls',

    reaction: bot => async (msg, match) => {
        const agg = [
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ];

        Transaction.aggregate(agg).exec((err, res: CountAggregation[]) => {
            if (err) {
                bot.sendMessage(msg.chat.id, error(err));
                return;
            }

            const message =
                '<b>Categories used:</b>' +
                res
                    .sort((a, b) => b.count - a.count)
                    .reduce((acc, item) => {
                        return acc + `\n${item.count} ${item._id}`;
                    }, '');

            bot.sendMessage(msg.chat.id, message, { parse_mode: 'HTML' });
        });
    },
};

export default catsLs;
