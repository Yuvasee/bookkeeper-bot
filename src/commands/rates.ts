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

const rates: Command = {
    trigger: /^rates$/,

    reaction: (bot: TelegramBot) => (msg: Message, match: RegExpExecArray) => {
        let dates;
        Transaction.distinct('date').exec((err, transactionRates: Date[]) => {
            err && console.error(err);

            dates = uniq(transactionRates.map(rate => format(rate, 'YYYY-MM-DD')));

            dates.forEach(dt => {
                Rate.find({ date: dt }).exec(async (errRate, docs) => {
                    errRate && console.error(errRate);

                    if (docs.length) {
                        return;
                    }

                    try {
                        const ratesResponse = await getRatesFromApi(dt);
                        await saveRatesFromApi(ratesResponse.data, dt);
                        bot.sendMessage(msg.chat.id, `Added: ${dt}`);
                    } catch (error) {
                        console.error(error, dt);
                    }
                });
            });
        });
    },
};
export default rates;

function apiString(dt: string) {
    return `${RATES_API_URL}${dt}?base=${BASE_CURRENCY}`;
}

function getRatesFromApi(dt: string) {
    return axios.get(apiString(dt));
}

function saveRatesFromApi(data: any, dt: string) {
    return Promise.all(
        CURRENCIES.map(currency =>
            Rate.create({
                date: dt,
                currency,
                rate: data.rates[currency],
            })
        )
    );
}
