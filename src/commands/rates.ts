import axios from 'axios';
import { format } from 'date-fns';
import { uniq } from 'lodash';
import { Message, ParseMode } from 'node-telegram-bot-api';
import TelegramBot = require('node-telegram-bot-api');

import Command from '../interfaces/Command';
import Rate, { CURRENCIES } from '../models/Rate';
import Transaction from '../models/Transaction';

const RATES_API_URL = 'https://api.exchangeratesapi.io/';
const BASE_CURRENCY = 'ILS';

function apiString(dt: string) {
    return `${RATES_API_URL}${dt}?base=${BASE_CURRENCY}`;
}

function getRatesFromApi(dt: string) {
    return axios.get(apiString(dt));
}

function saveRatesFromApi(data: any, dt: string) {
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
    trigger: /^rates$/,

    reaction: (bot: TelegramBot) => (msg: Message, match: RegExpExecArray) => {
        let dates;
        Transaction.distinct('date').exec((err, transactionRates: Date[]) => {
            err && console.error(err);

            dates = uniq(transactionRates.map((rate) => format(rate, 'YYYY-MM-DD')));

            dates.forEach((dt) => {
                Rate.find({ date: dt }).exec((errRate, docs) => {
                    errRate && console.error(errRate);

                    if (!docs.length) {
                        getRatesFromApi(dt).then(({ data }) => {
                            saveRatesFromApi(data, dt).then(({}) => bot.sendMessage(msg.chat.id, `Added: ${dt}`));
                        }, console.error);
                    }
                });
            });
        });
    },
};

export default rates;
