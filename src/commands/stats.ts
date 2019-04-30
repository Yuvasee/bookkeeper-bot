import ICommand from '../interfaces/ICommand';
import Transaction from '../models/Transaction';
import { errorView } from './_views';
// import { getRates } from '../rates';

const revert: ICommand = {
    re: /^stats$/,

    cb: (ctx, next) => {
        // TODO: filter by date

        // Check if rates are needed
        const rates = {};
        Transaction.aggregate(
            [
                {
                    $project: {
                        date: '$date',
                        indexOfILS: { $indexOfCP: ['$currency', 'ILS'] },
                        currency: '$currency',
                    },
                },
                { $match: { indexOfILS: { $lt: 0 } } },
                { $group: { _id: '$date' } },
            ],
            (err, res) => {
                err && ctx.replyWithHTML(errorView(err));
                ctx.replyWithHTML(res);
            },
        );

        // const { text } = ctx.message;
        Transaction.aggregate(
            [{ $group: { _id: '$category', sum: { $sum: '$sum' } } }, { $sort: { sum: -1 } }],
            (err, res) => {
                err && ctx.replyWithHTML(errorView(err));
                ctx.replyWithHTML(res);
            },
        );

        next();
    },
};

export default revert;
