const format = require('date-fns/format');
const uniq = require('lodash/uniq');
import axios from 'axios';

import Command from '../interfaces/Command';
import Rate, { CURRENCIES } from '../models/Rate';
import Transaction from '../models/Transaction';
import { error } from "../views/error";

const RATES_API_URL = 'https://api.exchangeratesapi.io/';
const BASE_CURRENCY = 'ILS';

function apiString(date: Date) {
    return `${RATES_API_URL}${date}?base=${BASE_CURRENCY}`;
}

function getRatesFromApi(dt: Date) {
    return axios.get(apiString(dt));
}

function saveRatesFromApi(data, dt) {
    return Promise.all(
        CURRENCIES.map((currency) =>
            Rate.create({
                date: dt,
                currency,
                rate: data.rates[currency],
            }),
        ),
    );
}

const rates: Command = {
    re: /^rates$/,

    cb: (ctx, next) => {
        let dates;

        const withRates = (err, rates) => {
            err && console.error(err);

            dates = uniq(rates.map((rate) => format(rate, 'YYYY-MM-DD')));

            dates.forEach((dt) => {
                Rate.where({ date: dt }).exec((err, docs) => {
                    err && console.error(err);

                    if (!docs.length) {
                        getRatesFromApi(dt).then(({ data }) => {
                            saveRatesFromApi(data, dt).then(({}) => ctx.reply(`Added: ${dt}`));
                        }, console.error);
                    }
                });
            });
        };

        Transaction.distinct('date').exec(withRates);

        next();
    },
};

export default rates;
