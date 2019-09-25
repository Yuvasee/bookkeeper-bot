const { Schema, model } = require('mongoose');

export const CURRENCIES = ['RUB', 'USD', 'EUR'];

const rateToIlsSchema = new Schema({
    date: String,
    currency: {
        type: String,
        enum: CURRENCIES,
    },
    rate: Number,
    env: String,
});

const Rate = model('Rate', rateToIlsSchema);

export default Rate;
