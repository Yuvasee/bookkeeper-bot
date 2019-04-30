const { Schema, model } = require('mongoose');

const transactionSchema = new Schema(
    {
        sum: Number,
        date: Date,
        actor: String,
        currency: {
            type: String,
            default: 'ILS',
            enum: ['ILS', 'RUB', 'USD', 'EUR'],
        },
        category: String,
        tags: [String],
        description: String,
    },
    {
        timestamps: true,
    },
);

const Transaction = model('Transaction', transactionSchema);

export default Transaction;
