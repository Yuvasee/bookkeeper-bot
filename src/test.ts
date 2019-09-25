import { format } from 'date-fns';
require('dotenv').config();
import { uniq } from 'lodash';
const mongoose = require('mongoose');

import Rate, { CURRENCIES } from './models/Rate';
import Transaction, { TransactionDoc } from './models/Transaction';

mongoose.connect(process.env.MONGO_STRING as any, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    Transaction.distinct('date').exec((err, transactionRates: TransactionDoc[]) => {
        err && console.error(err);
        console.log(transactionRates);

        // const dates = uniq(transactionRates.map((rate) => format(rate, 'YYYY-MM-DD')));

        // dates.forEach((dt) => {
        //     Rate.find({ date: dt }).exec((errRate, docs) => {
        //         errRate && console.error(errRate);
        //     });
        // });
    });
});
