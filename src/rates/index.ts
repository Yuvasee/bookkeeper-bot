import axios from 'axios';
const format = require('date-fns/format');
import Rate, { CURRENCIES } from '../models/Rate';

const RATES_API_URL = 'https://api.exchangeratesapi.io/';
const BASE_CURRENCY = 'ILS';

function apiString(date: Date) {
    return `${RATES_API_URL}${format(date, 'YYYY-MM-DD')}?base=${BASE_CURRENCY}`;
}

export function getRates(dt: Date) {
    const dtRounded = dateRound(dt);

    return new Promise((res, rej) => {
        Rate.where({ date: dtRounded }).exec((err, docs) => {
            err && rej(err);

            if (!docs.length) {
                getRatesFromApi(dtRounded)
                    .then((data) => {
                        return saveRatesFromApi(data);
                    }, rej)
                    .then(() => {
                        getRates(dt).then((rRes) => res(rRes), (rRej) => rej(rRej));
                    })
                    .catch(console.error);
            } else {
                res(docs);
            }
        });
    });
}

function getRatesFromApi(dt: Date) {
    return new Promise((res, rej) => {
        axios.get(apiString(dt)).then((r) => res(r.data), rej);
    });
}

function saveRatesFromApi(data) {
    return Promise.all(
        CURRENCIES.map((currency) =>
            Rate.create({
                date: new Date(data.date),
                currency,
                rate: data.rates[currency],
            }),
        ),
    );
}

function dateRound(dt) {
    return new Date(format(dt, 'YYYY-MM-DD'));
}
