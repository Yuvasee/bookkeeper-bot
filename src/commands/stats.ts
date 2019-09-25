const format = require('date-fns/format');

import Command from '../interfaces/Command';
import Transaction from '../models/Transaction';
import Rate from '../models/Rate';
import { error } from "../views/error";

const revert: Command = {
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
                err && ctx.replyWithHTML(error(err));
                ctx.replyWithHTML(res);
            },
        );

        next();
    },
};

export default revert;
