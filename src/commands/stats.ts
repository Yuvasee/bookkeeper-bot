const format = require('date-fns/format');

import ICommand from '../interfaces/ICommand';
import Transaction from '../models/Transaction';
import Rate from '../models/Rate';
import { errorView } from './_views';

const revert: ICommand = {
    re: /^stats$/,

    cb: (ctx, next) => {
        // TODO: filter by date (monthes)

        const { text } = ctx.message;

        let period = text.match(/^stats\s+([\d\w]+)\s?/);

        if (period) {
            period = period[1];
            !period.match(/\d\d/) && Number(period) < 12
        } else {
            period = format(new Date(), 'MM');
        }

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
