import { Message } from 'node-telegram-bot-api';
import TelegramBot = require('node-telegram-bot-api');
import XLSX = require('xlsx');

import { Command } from '@v9v/nodejs-bot-engine';
import Transaction, { TransactionDoc } from '../models/Transaction';
import RateToIls, { RateToIlsDoc } from '../models/Rate';
import { error } from '../views/error';

const dump: Command = {
    name: 'dump',
    trigger: /^dump$/i,

    reaction: (bot: TelegramBot) => async (msg: Message, match: RegExpExecArray) => {
        try {
            const [transactionDocs, rateDocs] = await Promise.all([Transaction.find(), RateToIls.find()]);
            const transactions = transactionDocs.map(a => a.toObject() as TransactionDoc);
            const rates = rateDocs.map(a => a.toObject() as RateToIlsDoc);

            const book = XLSX.utils.book_new();
            book.Sheets.transactions = XLSX.utils.json_to_sheet(transactions);
            book.Sheets.rates = XLSX.utils.json_to_sheet(rates);
            book.SheetNames.push('transactions', 'rates');

            bot.sendDocument(
                msg.chat.id,
                XLSX.write(book, {
                    type: 'buffer',
                }),
                {},
                {
                    filename: 'dump.xlsx',
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            );
        } catch (err) {
            bot.sendMessage(msg.chat.id, error(err));
        }
    },
};

export default dump;
